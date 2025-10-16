## Employee Role-Based Access Control System

### Overview
This system allows HR personnel to create employee accounts with specific roles that determine which admin pages and features they can access.

## Employee Roles & Access

### 1. CEO - Chief Executive Officer
**Access Level**: Full System Access
**Pages**: CEO Dashboard, Admin Panel, Analytics, HR, Warehouse, CFO Dashboard
**Permissions**:
- All admin read/write/delete operations
- User management
- Content moderation
- Guild management
- Trade management
- Report viewing
- Analytics access
- Settings management
- Financial viewing
- HR management

### 2. CFO - Chief Financial Officer
**Access Level**: Financial & Analytics
**Pages**: CFO Dashboard, Analytics, Admin Panel (limited)
**Permissions**:
- Admin read access
- Financial viewing & management
- Reports viewing
- Analytics viewing
- Trade viewing
- Order viewing
- Dispute viewing

### 3. HR - Human Resources
**Access Level**: Employee Management
**Pages**: HR Dashboard, Admin Panel (limited)
**Permissions**:
- Admin read access
- HR management
- User viewing
- User creation & updates
- Role assignment

### 4. MANAGER - General Manager
**Access Level**: Moderation & Reports
**Pages**: Admin Panel, Analytics
**Permissions**:
- Admin read access
- Content moderation
- Guild viewing
- Trade viewing
- Report viewing
- User viewing

### 5. SUPPORT - Customer Support
**Access Level**: Tickets & Support
**Pages**: Admin Panel
**Permissions**:
- Admin read access
- Ticket viewing & management
- User viewing
- Order viewing
- Dispute viewing

### 6. WAREHOUSE - Warehouse Manager
**Access Level**: Inventory & Shipping
**Pages**: Warehouse Dashboard, Admin Panel
**Permissions**:
- Warehouse management
- Inventory viewing & management
- Order viewing
- Shipping management

### 7. MODERATOR - Content Moderator
**Access Level**: Community Management
**Pages**: Admin Panel
**Permissions**:
- Content moderation
- Guild management
- Post deletion
- User suspension
- Report viewing

## How to Use

### For HR Personnel:

1. **Navigate to HR Dashboard** (`/hr`)
2. **Fill out Employee Form**:
   - First Name (required)
   - Last Name (required)
   - Email (required - must be @abditrade.com or @abditrade.tcg)
   - Phone (optional)
   - Employee Role (required - select from dropdown)
   - Department (optional)

3. **Click "Add Employee"**
   - System creates Cognito account
   - System creates DynamoDB user record
   - Employee receives credentials
   - Employee is automatically assigned permissions based on role

### Example: Creating a CEO

```json
{
  "firstName": "Marquise",
  "lastName": "Williams",
  "email": "marquise.williams@abditrade.com",
  "employeeRole": "CEO",
  "department": "Executive"
}
```

Result:
- User created in Cognito
- User record in DynamoDB with:
  - IsEmployee: true
  - EmployeeRole: "CEO"
  - AccessiblePages: ["ceo", "admin", "analytics", "hr", "warehouse", "cfo"]
  - Permissions: [all admin permissions]

## Technical Implementation

### 1. User Creation API
**Endpoint**: `POST /api/hr/create-employee`

**Request Body**:
```typescript
{
  email: string;
  firstName: string;
  lastName: string;
  employeeRole: 'CEO' | 'CFO' | 'HR' | 'MANAGER' | 'SUPPORT' | 'WAREHOUSE' | 'MODERATOR';
  department?: string;
  temporaryPassword?: string;
}
```

**Response**:
```typescript
{
  success: boolean;
  employee: {
    id: string;
    email: string;
    name: string;
    role: string;
    roleTitle: string;
    department: string;
    accessiblePages: string[];
    permissions: string[];
  };
}
```

### 2. Access Control Check
**Endpoint**: `POST /api/auth/check-access`

**Request Body**:
```typescript
{
  pageName: string; // e.g., 'ceo', 'admin', 'hr'
}
```

**Response**:
```typescript
{
  hasAccess: boolean;
  role: string;
  accessiblePages: string[];
}
```

### 3. Page Protection

Add to any admin page:

```typescript
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const MyAdminPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const checkAccess = async () => {
      if (status === 'authenticated' && session?.userId) {
        const response = await fetch('/api/auth/check-access', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pageName: 'ceo' })
        });
        
        const data = await response.json();
        
        if (!data.hasAccess) {
          router.push('/dashboard');
        }
      } else if (status === 'unauthenticated') {
        router.push('/auth');
      }
    };

    checkAccess();
  }, [status, session, router]);

  // ... rest of component
};
```

## Database Schema

### User Record in DynamoDB

```typescript
{
  PK: "USER#<userId>",
  SK: "PROFILE",
  UserId: string,
  CognitoSub: string,
  Email: string,
  FirstName: string,
  LastName: string,
  IsActive: boolean,
  IsVerified: boolean,
  IsEmployee: boolean,              // TRUE for employees
  EmployeeRole: string,              // CEO, CFO, HR, etc.
  Department: string,                // Department name
  RoleTitle: string,                 // Full title
  AccessiblePages: string[],         // ['ceo', 'admin', 'analytics']
  Permissions: string[],             // ['admin.read', 'admin.write', ...]
  CreatedBy: string,                 // UserId of HR who created
  CreatedAt: string,
  UpdatedAt: string
}
```

## Security Features

1. **Email Validation**: Only @abditrade.com or @abditrade.tcg emails allowed
2. **HR Permission Check**: Only CEO and HR roles can create employees
3. **Audit Trail**: All employee creations logged in AUDIT table
4. **Cognito Integration**: Users created in AWS Cognito for authentication
5. **Session-Based Access**: All access checks use server-side sessions
6. **Page-Level Protection**: Each admin page checks permissions on load

## File Locations

- **HR Page**: `src/pages/HR.tsx`
- **Create Employee API**: `src/pages/api/hr/create-employee.ts`
- **Check Access API**: `src/pages/api/auth/check-access.ts`
- **Access Helper**: `src/lib/employeeAccess.ts`
- **User Management Service**: `src/services/userManagementService.ts`

## Testing

### Test Employee Creation

1. Sign in as HR or CEO user
2. Navigate to `/hr`
3. Fill out form with:
   - Email: `test.employee@abditrade.com`
   - First Name: `Test`
   - Last Name: `Employee`
   - Role: `SUPPORT`
   - Department: `Customer Service`
4. Click "Add Employee"
5. Check Cognito User Pool for new user
6. Check DynamoDB for new user record
7. Sign in as new user
8. Verify they can only access Admin page (not CEO, CFO, HR, etc.)

### Test Access Control

1. Create user with SUPPORT role
2. Sign in as that user
3. Try accessing `/ceo` - should redirect to dashboard
4. Try accessing `/admin` - should work
5. Try accessing `/hr` - should redirect to dashboard

## Future Enhancements

1. **Role Updates**: API to update existing employee roles
2. **Role Revocation**: API to deactivate or remove employee access
3. **Temporary Access**: Time-limited role assignments
4. **Custom Roles**: UI to create custom roles with specific permissions
5. **Permission Groups**: Group permissions for easier management
6. **Audit Dashboard**: View all employee creation/modification history
7. **Email Notifications**: Send welcome emails with credentials
8. **Password Reset**: Allow employees to reset their own passwords
9. **2FA**: Add two-factor authentication for employee accounts
10. **Session Management**: View and revoke active employee sessions

## Troubleshooting

### Employee Can't Sign In

1. Check Cognito User Pool - user should exist
2. Check DynamoDB - user record should exist with IsEmployee: true
3. Verify email format is @abditrade.com or @abditrade.tcg
4. Check password was set correctly
5. Look for errors in CloudWatch logs

### Employee Can't Access Page

1. Check user's EmployeeRole field in DynamoDB
2. Verify AccessiblePages array includes the page name
3. Check session is active (user is signed in)
4. Verify page protection code is implemented
5. Check API response from `/api/auth/check-access`

### HR Can't Create Employees

1. Verify HR user's EmployeeRole is 'HR' or 'CEO'
2. Check HR user's IsEmployee is true
3. Verify Cognito User Pool ID in environment variables
4. Check IAM permissions for Cognito operations
5. Review API error response for specific issues

## Summary

This system provides a complete role-based access control solution where HR personnel can easily create employee accounts with predefined roles. Each role automatically gets appropriate permissions and page access, ensuring security while maintaining flexibility for different job functions.

Employees created through this system:
✅ Are authenticated via AWS Cognito
✅ Have profiles stored in DynamoDB
✅ Get automatic permission assignments
✅ Can only access their authorized pages
✅ Are tracked in audit logs
✅ Can be managed by HR/CEO users
