'use client';

import { useEffect, useState } from 'react';
import { CognitoSession, UserRole } from '@/types';

export function useAuth() {
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