// API endpoint to check if user has access to a page
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

const dynamoClient = new DynamoDBClient({ region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-2' });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session || !session.userId) {
      return res.status(401).json({ hasAccess: false, error: 'Unauthorized' });
    }

    const { pageName } = req.body;

    if (!pageName) {
      return res.status(400).json({ hasAccess: false, error: 'Page name is required' });
    }

    // Get user profile from DynamoDB
    const userResponse = await docClient.send(new QueryCommand({
      TableName: process.env.DYNAMODB_TABLE || 'abditrade-main',
      IndexName: 'GSI-CognitoSub',
      KeyConditionExpression: 'CognitoSub = :sub',
      ExpressionAttributeValues: {
        ':sub': session.userId
      },
      Limit: 1
    }));

    if (!userResponse.Items || userResponse.Items.length === 0) {
      return res.status(200).json({ hasAccess: false });
    }

    const user = userResponse.Items[0];

    // Check if user is an employee
    if (!user.IsEmployee || !user.EmployeeRole) {
      return res.status(200).json({ hasAccess: false });
    }

    // Check if user's accessible pages include the requested page
    const accessiblePages = user.AccessiblePages || [];
    const hasAccess = accessiblePages.includes(pageName.toLowerCase());

    return res.status(200).json({
      hasAccess,
      role: user.EmployeeRole,
      accessiblePages: accessiblePages
    });

  } catch (error) {
    console.error('Error checking access:', error);
    return res.status(500).json({ 
      hasAccess: false,
      error: 'Failed to check access'
    });
  }
}
