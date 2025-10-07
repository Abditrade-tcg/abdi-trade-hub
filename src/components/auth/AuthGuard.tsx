'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserRole, AuthGuardConfig, CognitoSession } from '@/types';

interface AuthGuardProps extends AuthGuardConfig {
  children: React.ReactNode;
}

// Mock auth hook - replace with real Cognito implementation
function useAuth() {
  const [session, setSession] = useState<CognitoSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate auth check
    const checkAuth = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock session - replace with real Cognito session
        const mockSession: CognitoSession = {
          accessToken: 'mock-access-token',
          idToken: 'mock-id-token',
          refreshToken: 'mock-refresh-token',
          userId: 'user-123',
          username: 'testuser',
          email: 'test@example.com',
          roles: ['ceo'] as UserRole[], // Changed from ['user'] to ['ceo'] to grant CEO access
          permissions: ['read:profile', 'write:listings', 'admin:all', 'ceo:dashboard'], // Added admin permissions
          expiresAt: Date.now() + 3600000 // 1 hour
        };
        
        setSession(mockSession);
      } catch (err) {
        setError('Authentication failed');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Implement Cognito sign in
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockSession: CognitoSession = {
        accessToken: 'mock-access-token',
        idToken: 'mock-id-token',
        refreshToken: 'mock-refresh-token',
        userId: 'user-123',
        username: email.split('@')[0],
        email,
        roles: ['ceo'] as UserRole[],
        permissions: ['read:profile', 'write:listings', 'admin:all', 'ceo:dashboard'],
        expiresAt: Date.now() + 3600000
      };
      
      setSession(mockSession);
    } catch (err) {
      setError('Sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setSession(null);
  };

  return {
    session,
    isLoading,
    error,
    signIn,
    signOut,
    isAuthenticated: !!session
  };
}

export function AuthGuard({ 
  children, 
  requiredRoles = [], 
  requiredPermissions = [],
  redirectTo = '/login',
  fallback: Fallback
}: AuthGuardProps) {
  const { session, isLoading, error } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show error if authentication failed
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle>Authentication Error</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!session) {
    router.push(`${redirectTo}?redirect=${encodeURIComponent(pathname)}`);
    return null;
  }

  // Check role requirements
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => 
      session.roles.includes(role)
    );
    
    if (!hasRequiredRole) {
      if (Fallback) {
        return <Fallback />;
      }
      
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <CardTitle>Access Denied</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                You don't have the required permissions to access this page.
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Required roles: {requiredRoles.join(', ')}
              </p>
              <Button 
                onClick={() => router.back()} 
                variant="outline" 
                className="w-full"
              >
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  // Check permission requirements
  if (requiredPermissions.length > 0) {
    const hasRequiredPermissions = requiredPermissions.every(permission => 
      session.permissions.includes(permission)
    );
    
    if (!hasRequiredPermissions) {
      if (Fallback) {
        return <Fallback />;
      }
      
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <CardTitle>Insufficient Permissions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                You don't have the required permissions to access this page.
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Required permissions: {requiredPermissions.join(', ')}
              </p>
              <Button 
                onClick={() => router.back()} 
                variant="outline" 
                className="w-full"
              >
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  // Render children if all checks pass
  return <>{children}</>;
}

// Higher-order component for easy wrapping
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  config: AuthGuardConfig
) {
  return function AuthGuardedComponent(props: P) {
    return (
      <AuthGuard {...config}>
        <Component {...props} />
      </AuthGuard>
    );
  };
}

// Hook to use auth context
export { useAuth };