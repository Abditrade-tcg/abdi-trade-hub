import { isFeatureEnabled } from '@/config/environmentManager';

export interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export interface UserGroup {
  id: string;
  name: string;
  description: string;
  roles: string[];
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  groups: string[];
  roles: string[];
  companyEmail?: boolean;
  department?: string;
  permissions?: string[];
}

export class UserManagementService {
  private static instance: UserManagementService;

  public static getInstance(): UserManagementService {
    if (!UserManagementService.instance) {
      UserManagementService.instance = new UserManagementService();
    }
    return UserManagementService.instance;
  }

  // Define user groups
  private readonly groups: Record<string, UserGroup> = {
    employees: {
      id: 'employees',
      name: 'Employees',
      description: 'Company employees with company email domains',
      roles: ['employee', 'admin']
    },
    stores: {
      id: 'stores',
      name: 'Stores & Businesses',
      description: 'Verified business accounts and stores',
      roles: ['store_owner', 'business']
    },
    individuals: {
      id: 'individuals',
      name: 'Individual Users',
      description: 'Regular individual user accounts',
      roles: ['user']
    },
    admins: {
      id: 'admins',
      name: 'Administrators',
      description: 'System administrators with full access',
      roles: ['admin', 'super_admin']
    }
  };

  // Define roles and permissions
  private readonly roles: Record<string, UserRole> = {
    super_admin: {
      id: 'super_admin',
      name: 'Super Administrator',
      description: 'Full system access',
      permissions: ['*']
    },
    admin: {
      id: 'admin',
      name: 'Administrator',
      description: 'Administrative access',
      permissions: [
        'view_admin_panel',
        'manage_users',
        'view_analytics',
        'manage_orders',
        'manage_disputes',
        'view_financial_reports'
      ]
    },
    hr: {
      id: 'hr',
      name: 'Human Resources',
      description: 'HR management access',
      permissions: [
        'view_admin_panel',
        'manage_employees',
        'assign_roles',
        'view_hr_dashboard'
      ]
    },
    employee: {
      id: 'employee',
      name: 'Employee',
      description: 'Company employee',
      permissions: [
        'view_employee_tools',
        'access_internal_features'
      ]
    },
    store_owner: {
      id: 'store_owner',
      name: 'Store Owner',
      description: 'Business/store owner account',
      permissions: [
        'manage_store',
        'view_store_analytics',
        'bulk_operations'
      ]
    },
    user: {
      id: 'user',
      name: 'User',
      description: 'Regular user account',
      permissions: [
        'view_marketplace',
        'make_purchases',
        'create_listings'
      ]
    }
  };

  // Company email domains from environment
  private readonly companyDomains = process.env.COMPANY_EMAIL_DOMAINS?.split(',').map(d => d.trim()) || [
    'abditrade.com',
    'abditrade.tcg'
  ];

  /**
   * Check if email belongs to company domain
   */
  isCompanyEmail(email: string): boolean {
    const domain = email.split('@')[1]?.toLowerCase();
    return this.companyDomains.includes(domain);
  }

  /**
   * Determine user group based on email and other factors
   */
  determineUserGroup(email: string, accountType?: 'individual' | 'business'): string {
    if (this.isCompanyEmail(email)) {
      return 'employees';
    }
    
    if (accountType === 'business') {
      return 'stores';
    }
    
    return 'individuals';
  }

  /**
   * Get user permissions based on roles
   */
  getUserPermissions(roles: string[]): string[] {
    const permissions = new Set<string>();
    
    roles.forEach(roleId => {
      const role = this.roles[roleId];
      if (role) {
        role.permissions.forEach(permission => {
          if (permission === '*') {
            // Super admin gets all permissions
            Object.values(this.roles).forEach(r => {
              r.permissions.forEach(p => permissions.add(p));
            });
          } else {
            permissions.add(permission);
          }
        });
      }
    });
    
    return Array.from(permissions);
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(userProfile: UserProfile, permission: string): boolean {
    if (!userProfile.permissions) {
      userProfile.permissions = this.getUserPermissions(userProfile.roles || []);
    }
    
    return userProfile.permissions.includes(permission) || userProfile.permissions.includes('*');
  }

  /**
   * Assign role to user (HR function)
   */
  async assignRole(userId: string, roleId: string): Promise<boolean> {
    try {
      if (isFeatureEnabled('enableBackendAPI')) {
        // In production, this would call the backend API
        const response = await fetch('/api/users/assign-role', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, roleId })
        });
        return response.ok;
      } else {
        // Development mode - simulate success
        console.log(`Assigning role ${roleId} to user ${userId}`);
        return true;
      }
    } catch (error) {
      console.error('Error assigning role:', error);
      return false;
    }
  }

  /**
   * Add user to group (HR function)
   */
  async addUserToGroup(userId: string, groupId: string): Promise<boolean> {
    try {
      if (isFeatureEnabled('enableBackendAPI')) {
        // In production, this would call the backend API and Cognito
        const response = await fetch('/api/users/add-to-group', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, groupId })
        });
        return response.ok;
      } else {
        // Development mode - simulate success
        console.log(`Adding user ${userId} to group ${groupId}`);
        return true;
      }
    } catch (error) {
      console.error('Error adding user to group:', error);
      return false;
    }
  }

  /**
   * Get user profile with roles and permissions
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      if (isFeatureEnabled('enableBackendAPI')) {
        const response = await fetch(`/api/users/${userId}/profile`);
        if (response.ok) {
          const profile = await response.json();
          profile.permissions = this.getUserPermissions(profile.roles || []);
          return profile;
        }
      } else {
        // Development mode - return mock profile
        const mockProfile: UserProfile = {
          id: userId,
          email: 'demo@example.com',
          name: 'Demo User',
          groups: ['individuals'],
          roles: ['user'],
          companyEmail: false
        };
        mockProfile.permissions = this.getUserPermissions(mockProfile.roles);
        return mockProfile;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
    return null;
  }

  /**
   * Get all available roles
   */
  getAllRoles(): UserRole[] {
    return Object.values(this.roles);
  }

  /**
   * Get all available groups
   */
  getAllGroups(): UserGroup[] {
    return Object.values(this.groups);
  }

  /**
   * Check if user should see admin navigation
   * Admin access is restricted to company email users with appropriate permissions
   */
  shouldShowAdminNav(userProfile: UserProfile): boolean {
    // Must be a company email user
    if (!userProfile.companyEmail && !this.isCompanyEmail(userProfile.email)) {
      return false;
    }
    
    // Must have admin panel permission
    return this.hasPermission(userProfile, 'view_admin_panel');
  }

  /**
   * Auto-assign user to appropriate groups on registration/login
   */
  async autoAssignUserGroups(email: string, userId: string, accountType?: 'individual' | 'business'): Promise<void> {
    const targetGroup = this.determineUserGroup(email, accountType);
    
    try {
      await this.addUserToGroup(userId, targetGroup);
      
      // Assign default role based on group
      if (targetGroup === 'employees') {
        if (this.isCompanyEmail(email)) {
          await this.assignRole(userId, 'employee');
        }
      } else if (targetGroup === 'stores') {
        await this.assignRole(userId, 'store_owner');
      } else {
        await this.assignRole(userId, 'user');
      }
    } catch (error) {
      console.error('Error auto-assigning user groups:', error);
    }
  }
}

export const userManagementService = UserManagementService.getInstance();