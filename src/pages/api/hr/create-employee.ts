// API endpoint for HR to create employees with roles
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { CognitoIdentityProviderClient, AdminCreateUserCommand, AdminSetUserPasswordCommand } from '@aws-sdk/client-cognito-identity-provider';
import { v4 as uuidv4 } from 'uuid';

const dynamoClient = new DynamoDBClient({ region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-2' });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

const cognitoClient = new CognitoIdentityProviderClient({ 
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-2' 
});

// Define employee roles with their permissions
const EMPLOYEE_ROLES = {
  CEO: {
    title: 'Chief Executive Officer',
    permissions: [
      'admin.read', 'admin.write', 'admin.delete',
      'users.manage', 'content.moderate', 'guilds.manage',
      'trades.manage', 'reports.view', 'analytics.view',
      'settings.manage', 'financial.view', 'hr.manage'
    ],
    pages: ['ceo', 'admin', 'analytics', 'hr', 'warehouse']
  },
  CFO: {
    title: 'Chief Financial Officer',
    permissions: [
      'admin.read', 'financial.view', 'financial.manage',
      'reports.view', 'analytics.view', 'trades.view',
      'orders.view', 'disputes.view'
    ],
    pages: ['cfo', 'analytics', 'admin']
  },
  HR: {
    title: 'Human Resources',
    permissions: [
      'admin.read', 'hr.manage', 'users.view',
      'users.create', 'users.update', 'roles.assign'
    ],
    pages: ['hr', 'admin']
  },
  MANAGER: {
    title: 'Manager',
    permissions: [
      'admin.read', 'content.moderate', 'guilds.view',
      'trades.view', 'reports.view', 'users.view'
    ],
    pages: ['admin', 'analytics']
  },
  SUPPORT: {
    title: 'Customer Support',
    permissions: [
      'admin.read', 'tickets.view', 'tickets.manage',
      'users.view', 'orders.view', 'disputes.view'
    ],
    pages: ['admin']
  },
  WAREHOUSE: {
    title: 'Warehouse Manager',
    permissions: [
      'warehouse.manage', 'inventory.view', 'inventory.manage',
      'orders.view', 'shipping.manage'
    ],
    pages: ['warehouse', 'admin']
  },
  MODERATOR: {
    title: 'Content Moderator',
    permissions: [
      'content.moderate', 'guilds.manage', 'posts.delete',
      'users.suspend', 'reports.view'
    ],
    pages: ['admin']
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if user is authenticated and has HR permissions
    const session = await getServerSession(req, res, authOptions);
    
    if (!session || !session.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get the HR user's profile from DynamoDB
    const hrUserResponse = await docClient.send(new QueryCommand({
      TableName: process.env.DYNAMODB_TABLE || 'abditrade-main',
      IndexName: 'GSI-CognitoSub',
      KeyConditionExpression: 'CognitoSub = :sub',
      ExpressionAttributeValues: {
        ':sub': session.userId
      },
      Limit: 1
    }));

    if (!hrUserResponse.Items || hrUserResponse.Items.length === 0) {
      return res.status(403).json({ error: 'User profile not found' });
    }

    const hrUser = hrUserResponse.Items[0];

    // Check if HR user has permission to create employees
    if (!hrUser.IsEmployee || !hrUser.EmployeeRole || !['CEO', 'HR'].includes(hrUser.EmployeeRole)) {
      return res.status(403).json({ error: 'Insufficient permissions. Only CEO and HR can create employees.' });
    }

    // Extract employee data from request
    const {
      email,
      firstName,
      lastName,
      employeeRole,
      department,
      temporaryPassword
    } = req.body;

    // Validation
    if (!email || !firstName || !lastName || !employeeRole) {
      return res.status(400).json({ 
        error: 'Missing required fields: email, firstName, lastName, employeeRole' 
      });
    }

    // Check if email is a company email
    const companyDomains = ['abditrade.com', 'abditrade.tcg'];
    const emailDomain = email.split('@')[1]?.toLowerCase();
    
    if (!companyDomains.includes(emailDomain)) {
      return res.status(400).json({ 
        error: 'Only company email addresses (@abditrade.com or @abditrade.tcg) can be used for employees' 
      });
    }

    // Validate employee role
    if (!EMPLOYEE_ROLES[employeeRole as keyof typeof EMPLOYEE_ROLES]) {
      return res.status(400).json({ 
        error: 'Invalid employee role',
        availableRoles: Object.keys(EMPLOYEE_ROLES)
      });
    }

    const roleConfig = EMPLOYEE_ROLES[employeeRole as keyof typeof EMPLOYEE_ROLES];

    // Create user in Cognito
    let cognitoSub: string;
    try {
      const createUserResponse = await cognitoClient.send(new AdminCreateUserCommand({
        UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
        Username: email,
        UserAttributes: [
          { Name: 'email', Value: email },
          { Name: 'email_verified', Value: 'true' },
          { Name: 'given_name', Value: firstName },
          { Name: 'family_name', Value: lastName },
          { Name: 'name', Value: `${firstName} ${lastName}` }
        ],
        MessageAction: 'SUPPRESS' // Don't send welcome email
      }));

      cognitoSub = createUserResponse.User?.Username || '';

      // Set a permanent password
      const password = temporaryPassword || generateStrongPassword();
      await cognitoClient.send(new AdminSetUserPasswordCommand({
        UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
        Username: email,
        Password: password,
        Permanent: true
      }));

      console.log(`✅ Created Cognito user: ${email} (${cognitoSub})`);
      
    } catch (cognitoError: any) {
      if (cognitoError.name === 'UsernameExistsException') {
        return res.status(400).json({ error: 'User with this email already exists' });
      }
      console.error('Cognito error:', cognitoError);
      throw cognitoError;
    }

    // Create user record in DynamoDB
    const userId = uuidv4();
    const now = new Date().toISOString();
    const handle = email.split('@')[0];

    const userRecord = {
      PK: `USER#${userId}`,
      SK: 'PROFILE',
      UserId: userId,
      CognitoSub: cognitoSub,
      Email: email,
      Handle: handle,
      DisplayName: `${firstName} ${lastName}`,
      FirstName: firstName,
      LastName: lastName,
      IsActive: true,
      IsVerified: true,
      IsEmployee: true,
      EmployeeRole: employeeRole,
      Department: department || 'General',
      AccountType: 'employee',
      Reputation: 100,
      TotalTrades: 0,
      CreatedAt: now,
      UpdatedAt: now,
      LastActivity: now,
      EntityType: 'USER',
      CreatedBy: hrUser.UserId,
      RoleTitle: roleConfig.title,
      AccessiblePages: roleConfig.pages,
      Permissions: roleConfig.permissions,
      Preferences: {
        EmailNotifications: true,
        PushNotifications: true,
        PrivateProfile: false,
        ShowOnlineStatus: true
      },
      Stats: {
        PostsCount: 0,
        CommentsCount: 0,
        LikesReceived: 0,
        GuildsJoined: 0
      }
    };

    await docClient.send(new PutCommand({
      TableName: process.env.DYNAMODB_TABLE || 'abditrade-main',
      Item: userRecord
    }));

    console.log(`✅ Created DynamoDB user record for ${email}`);

    // Log the creation in audit trail
    await docClient.send(new PutCommand({
      TableName: process.env.DYNAMODB_TABLE || 'abditrade-main',
      Item: {
        PK: `AUDIT#${new Date().toISOString().substring(0, 10)}`,
        SK: `EVENT#${new Date().toISOString()}#${Math.random().toString(36).substring(7)}`,
        EventType: 'employee_created',
        Action: 'CREATE_EMPLOYEE',
        PerformedBy: hrUser.Email,
        PerformedById: hrUser.UserId,
        TargetEmail: email,
        TargetUserId: userId,
        EmployeeRole: employeeRole,
        Department: department,
        Timestamp: now,
        EntityType: 'AUDIT_EVENT'
      }
    }));

    return res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      employee: {
        id: userId,
        email: email,
        name: `${firstName} ${lastName}`,
        role: employeeRole,
        roleTitle: roleConfig.title,
        department: department,
        accessiblePages: roleConfig.pages,
        permissions: roleConfig.permissions
      },
      temporaryPassword: temporaryPassword || 'Password sent via secure channel'
    });

  } catch (error) {
    console.error('Error creating employee:', error);
    return res.status(500).json({ 
      error: 'Failed to create employee',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Helper function to generate a strong password
function generateStrongPassword(): string {
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lowercase = 'abcdefghjkmnpqrstuvwxyz';
  const numbers = '23456789';
  const special = '!@#$%&*';
  
  let password = '';
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  const allChars = uppercase + lowercase + numbers + special;
  for (let i = 0; i < 8; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  return password.split('').sort(() => Math.random() - 0.5).join('');
}
