// Helper to check if user has access to specific pages based on their role
import { Session } from 'next-auth';

export interface EmployeeAccess {
  isEmployee: boolean;
  role: string | null;
  accessiblePages: string[];
  permissions: string[];
}

// Define which roles can access which pages
const ROLE_PAGE_ACCESS: Record<string, string[]> = {
  CEO: ['ceo', 'admin', 'analytics', 'hr', 'warehouse', 'cfo'],
  CFO: ['cfo', 'analytics', 'admin'],
  HR: ['hr', 'admin'],
  MANAGER: ['admin', 'analytics'],
  SUPPORT: ['admin'],
  WAREHOUSE: ['warehouse', 'admin'],
  MODERATOR: ['admin']
};

/**
 * Check if user has access to a specific page
 */
export async function checkPageAccess(
  session: Session | null,
  pageName: string
): Promise<boolean> {
  if (!session || !session.userId) {
    return false;
  }

  try {
    // Fetch user profile from DynamoDB via API
    const response = await fetch('/api/auth/check-access', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: session.userId,
        pageName: pageName
      })
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.hasAccess || false;

  } catch (error) {
    console.error('Error checking page access:', error);
    return false;
  }
}

/**
 * Get user's employee access information
 */
export async function getEmployeeAccess(userId: string): Promise<EmployeeAccess> {
  try {
    const response = await fetch(`/api/auth/employee-access?userId=${userId}`);
    
    if (!response.ok) {
      return {
        isEmployee: false,
        role: null,
        accessiblePages: [],
        permissions: []
      };
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error getting employee access:', error);
    return {
      isEmployee: false,
      role: null,
      accessiblePages: [],
      permissions: []
    };
  }
}

/**
 * Client-side check for page access based on role
 */
export function canAccessPage(role: string | null, pageName: string): boolean {
  if (!role) return false;
  
  const accessiblePages = ROLE_PAGE_ACCESS[role];
  if (!accessiblePages) return false;
  
  return accessiblePages.includes(pageName.toLowerCase());
}

/**
 * Get all pages accessible by a role
 */
export function getAccessiblePages(role: string): string[] {
  return ROLE_PAGE_ACCESS[role] || [];
}

/**
 * Check if user has specific permission
 */
export function hasPermission(permissions: string[], requiredPermission: string): boolean {
  if (permissions.includes('*')) return true; // Super admin
  return permissions.includes(requiredPermission);
}
