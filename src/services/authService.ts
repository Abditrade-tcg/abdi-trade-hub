// Production Authentication Service using AWS Cognito
import { signIn as amplifySignIn, signUp as amplifySignUp, signOut as amplifySignOut, getCurrentUser, fetchAuthSession, confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';
import { User, EmployeeRole, UserStatus } from '@/types';
import { reputationService } from './reputationService';

// Initialize Amplify (import the config)
import '@/lib/amplify';

export interface AuthConfig {
  region: string;
  userPoolId: string;
  userPoolWebClientId: string;
  identityPoolId: string;
}

export interface CognitoUser {
  sub: string;
  email: string;
  email_verified: boolean;
  given_name?: string;
  family_name?: string;
  picture?: string;
  'custom:employee_role'?: EmployeeRole;
  'custom:user_status'?: UserStatus;
  'custom:store_name'?: string;
  'custom:rep_score'?: string;
  'custom:total_trades'?: string;
  'custom:completion_rate'?: string;
  'custom:verification_level'?: string;
}

class AuthenticationService {
  private config: AuthConfig;
  private currentUser: User | null = null;

  constructor() {
    this.config = {
      region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-2',
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || '',
      userPoolWebClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || '',
      identityPoolId: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID || ''
    };

    // Debug logging for production
    console.log('AuthService Configuration:', {
      region: this.config.region,
      userPoolId: this.config.userPoolId ? 'SET' : 'MISSING',
      userPoolWebClientId: this.config.userPoolWebClientId ? 'SET' : 'MISSING',
      identityPoolId: this.config.identityPoolId ? 'SET' : 'MISSING'
    });

    // Validate required configuration
    if (!this.config.userPoolId || !this.config.userPoolWebClientId) {
      console.error('AuthService: Missing required Cognito configuration!', {
        userPoolId: this.config.userPoolId,
        userPoolWebClientId: this.config.userPoolWebClientId
      });
    }
  }

  // Initialize Cognito (called on app start)
  async initialize(): Promise<void> {
    try {
      console.log('🔄 Initializing AuthService...');
      
      // Try to get current user from local storage first
      const storedUser = localStorage.getItem('auth_user');
      if (storedUser) {
        try {
          this.currentUser = JSON.parse(storedUser);
          console.log('✅ Loaded user from localStorage:', this.currentUser?.email);
        } catch (error) {
          console.warn('Failed to parse stored user data:', error);
          localStorage.removeItem('auth_user');
        }
      }

      // Then check with Cognito if no stored user
      if (!this.currentUser) {
        console.log('🔍 No stored user, checking Cognito session...');
        this.currentUser = await this.getCurrentUser();
      }
      
      console.log('✅ AuthService initialized');
    } catch (error) {
      console.error('❌ Failed to initialize AuthService:', error);
    }
  }

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<{ user: User; needsPasswordChange?: boolean }> {
    try {
      console.log('🔑 Signing in user:', email);
      
      // First check if user is already authenticated
      console.log('🔍 Checking for existing user...');
      const existingUser = await this.getCurrentUser();
      if (existingUser) {
        console.log('✅ User already authenticated, returning existing user:', existingUser.email);
        return { user: existingUser, needsPasswordChange: false };
      }
      console.log('ℹ️ No existing user found, proceeding with authentication...');
      
      // Check if Cognito is properly configured
      if (!this.config.userPoolId || !this.config.userPoolWebClientId) {
        console.error('Cannot sign in: Auth UserPool not configured!');
        throw new Error('Auth UserPool not configured. Please check your environment variables.');
      }
      
      // Check if we're in development mode and AWS is not configured
      const isDev = process.env.NODE_ENV === 'development';
      const cognitoConfigured = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID && process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID;
      
      if (isDev && !cognitoConfigured) {
        console.warn('AWS Cognito not configured, using mock authentication for development');
        
        // Mock user for development
        const mockUser: User = {
          id: 'dev-user-' + Date.now(),
          username: email.split('@')[0],
          email: email,
          avatar: '/abditrade-logo.png',
          repScore: 100,
          badges: [],
          isVerified: false,
          joinedAt: new Date().toISOString(),
          totalTrades: 0,
          completionRate: 100,
          status: 'Individual',
          employeeRole: undefined,
          isEmployee: false
        };
        
        this.currentUser = mockUser;
        localStorage.setItem('auth_user', JSON.stringify(mockUser));
        
        return { user: mockUser, needsPasswordChange: false };
      }
      
      // Use AWS Amplify for real Cognito authentication
      let signInResult;
      try {
        signInResult = await amplifySignIn({
          username: email,
          password: password,
        });
      } catch (signInError: unknown) {
        // Handle specific case where user is already authenticated
        console.log('🔍 SignIn error caught:', signInError);
        console.log('🔍 Error name:', signInError instanceof Error ? signInError.name : 'unknown');
        console.log('🔍 Error message:', signInError instanceof Error ? signInError.message : 'unknown');
        
        if (signInError instanceof Error && 
            (signInError.message.includes('There is already a signed in user') ||
             signInError.name === 'InvalidUserPoolConfigurationException')) {
          console.log('🔍 User might already be signed in, attempting to get current user...');
          
          try {
            const cognitoUser = await getCurrentUser();
            if (cognitoUser && cognitoUser.signInDetails) {
              console.log('✅ Found existing Cognito user:', cognitoUser.signInDetails.loginId);
              
              // Get user attributes
              let userAttributes: Record<string, string | undefined> = {};
              try {
                const attrs = await fetchAuthSession();
                userAttributes = attrs as Record<string, string | undefined>;
                console.log('📋 User attributes from Cognito:', userAttributes);
              } catch (attrError) {
                console.log('⚠️ Could not fetch user attributes:', attrError);
              }
              
              const user = await this.createUserFromCognito({
                sub: cognitoUser.userId,
                email: cognitoUser.signInDetails.loginId,
                email_verified: true,
                given_name: userAttributes.given_name || 'User',
                family_name: userAttributes.family_name || '',
                'custom:employee_role': userAttributes['custom:employee_role'] as EmployeeRole | undefined,
                'custom:user_status': (userAttributes['custom:user_status'] as UserStatus) || 'Individual',
                'custom:rep_score': userAttributes['custom:rep_score'] || '0',
                'custom:total_trades': userAttributes['custom:total_trades'] || '0',
                'custom:completion_rate': userAttributes['custom:completion_rate'] || '0',
                'custom:verification_level': userAttributes['custom:verification_level'] || 'unverified'
              });
              
              this.currentUser = user;
              localStorage.setItem('auth_user', JSON.stringify(user));
              console.log('✅ Returning authenticated user:', user.email);
              return { user, needsPasswordChange: false };
            }
          } catch (cognitoError) {
            console.log('❌ Failed to get Cognito user:', cognitoError);
          }
        }
        throw signInError;
      }

      if (signInResult.isSignedIn) {
        // Get user attributes from Cognito
        const currentUser = await getCurrentUser();
        
        // Create user object from Cognito response
        const user = await this.createUserFromCognito({
          sub: currentUser.userId,
          email: email,
          email_verified: true,
          given_name: currentUser.signInDetails?.loginId?.split('@')[0] || 'User',
          family_name: '',
          // These will be fetched from actual user data/database in production
          'custom:employee_role': undefined,
          'custom:user_status': 'Individual',
          'custom:rep_score': '0',
          'custom:total_trades': '0',
          'custom:completion_rate': '0',
          'custom:verification_level': 'unverified'
        });

        this.currentUser = user;
        localStorage.setItem('auth_user', JSON.stringify(user));
        
        return { 
          user, 
          needsPasswordChange: signInResult.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED'
        };
      }

      throw new Error('Sign in was not successful');
    } catch (error) {
      console.error('❌ Authentication failed:', error);
      throw error;
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      console.log('🔐 Signing out user...');
      
      // Sign out from Cognito
      if (this.config.userPoolId && this.config.userPoolWebClientId) {
        await amplifySignOut();
      }
      
      // Clear local state
      this.currentUser = null;
      localStorage.removeItem('auth_user');
      
      console.log('✅ User signed out successfully');
    } catch (error) {
      console.error('❌ Error during sign out:', error);
      // Still clear local state even if Cognito sign out fails
      this.currentUser = null;
      localStorage.removeItem('auth_user');
    }
  }

  // Clear all authentication data (useful for production reset)
  async clearAuthData(): Promise<void> {
    try {
      console.log('🧹 Clearing all auth data...');
      
      // Sign out first
      await this.signOut();
      
      // Clear any additional cached data
      localStorage.clear();
      
      console.log('✅ All auth data cleared');
    } catch (error) {
      console.error('❌ Error clearing auth data:', error);
    }
  }

  // Get current authenticated user
  async getCurrentUser(): Promise<User | null> {
    try {
      // First check cached user
      if (this.currentUser) {
        return this.currentUser;
      }

      // Check localStorage
      const storedUser = localStorage.getItem('auth_user');
      if (storedUser) {
        try {
          this.currentUser = JSON.parse(storedUser);
          return this.currentUser;
        } catch (error) {
          console.warn('Failed to parse stored user:', error);
          localStorage.removeItem('auth_user');
        }
      }

      // If Cognito is not configured, return null
      if (!this.config.userPoolId || !this.config.userPoolWebClientId) {
        return null;
      }

      // Check with Cognito
      try {
        const cognitoUser = await getCurrentUser();
        if (cognitoUser && cognitoUser.signInDetails) {
          const user = await this.createUserFromCognito({
            sub: cognitoUser.userId,
            email: cognitoUser.signInDetails.loginId,
            email_verified: true,
            given_name: cognitoUser.signInDetails.loginId.split('@')[0],
            family_name: '',
            'custom:employee_role': undefined,
            'custom:user_status': 'Individual',
            'custom:rep_score': '0',
            'custom:total_trades': '0',
            'custom:completion_rate': '0',
            'custom:verification_level': 'unverified'
          });

          this.currentUser = user;
          localStorage.setItem('auth_user', JSON.stringify(user));
          return user;
        }
      } catch (error) {
        console.log('No current Cognito user:', error);
      }

      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Create user object from Cognito attributes
  private async createUserFromCognito(cognitoUser: CognitoUser): Promise<User> {
    const isEmployee = cognitoUser.email.endsWith('@abditrade.com');
    const status: UserStatus = cognitoUser['custom:user_status'] as UserStatus || 
                               (isEmployee ? 'Employee' : 'Individual');

    // Try to fetch real reputation data, fallback to defaults if not available
    let repScore = 85;
    let badges: string[] = [];
    let isVerified = false;

    try {
      const reputation = await reputationService.getMyReputation();
      repScore = reputation.repScore;
      badges = reputation.badges.map(badge => badge.name || badge.toString());
      isVerified = reputation.isVerified;
    } catch (error) {
      // Fallback to Cognito attributes or defaults
      console.warn('Could not fetch reputation data, using fallback values:', error);
      repScore = parseInt(cognitoUser['custom:rep_score'] || '85');
      isVerified = cognitoUser.email_verified && 
                   (cognitoUser['custom:verification_level'] === 'verified');
    }

    return {
      id: cognitoUser.sub,
      username: cognitoUser.given_name && cognitoUser.family_name 
        ? `${cognitoUser.given_name} ${cognitoUser.family_name}`
        : cognitoUser.email.split('@')[0],
      email: cognitoUser.email,
      avatar: cognitoUser.picture || '/abditrade-logo.png',
      repScore: repScore,
      badges: badges.map(badgeName => ({ 
        id: badgeName, 
        name: badgeName, 
        description: '', 
        icon: '', 
        color: '', 
        rarity: 'common' as const 
      })),
      isVerified: isVerified,
      joinedAt: new Date().toISOString(), // In production, would come from Cognito
      totalTrades: parseInt(cognitoUser['custom:total_trades'] || '0'),
      completionRate: parseInt(cognitoUser['custom:completion_rate'] || '0'),
      status: status,
      employeeRole: cognitoUser['custom:employee_role'] as EmployeeRole,
      isEmployee: isEmployee,
      storeName: cognitoUser['custom:store_name']
    };
  }

  // Check if user has admin access
  hasAdminAccess(user: User | null): boolean {
    if (!user) return false;
    
    return user.isEmployee && (
      user.employeeRole === 'ceo' || 
      user.employeeRole === 'hr' ||
      user.employeeRole === 'cfo'
    );
  }

  // Sign up new user
  async signUp(email: string, password: string, userDetails: {
    firstName: string;
    lastName: string;
    userType: 'Individual' | 'TCG Store';
    storeName?: string;
  }): Promise<{ user: User; needsVerification: boolean }> {
    try {
      console.log('Signing up user:', email);
      
      // Use AWS Amplify for real Cognito sign up
      const signUpResult = await amplifySignUp({
        username: email,
        password: password,
        options: {
          userAttributes: {
            email: email,
            given_name: userDetails.firstName,
            family_name: userDetails.lastName,
            name: `${userDetails.firstName} ${userDetails.lastName}`, // Full name for name.formatted requirement
            // Note: Custom attributes like user_type and store_name will be handled after confirmation
            // to avoid schema validation errors during signup
          },
        },
      });

      // Create user object for immediate return
      const user: User = {
        id: signUpResult.userId || 'temp-' + Date.now(),
        username: `${userDetails.firstName} ${userDetails.lastName}`,
        email: email,
        avatar: '/abditrade-logo.png',
        repScore: 0,
        badges: [],
        isVerified: false,
        joinedAt: new Date().toISOString(),
        totalTrades: 0,
        completionRate: 0,
        status: userDetails.userType as UserStatus,
        employeeRole: undefined,
        isEmployee: false,
        storeName: userDetails.storeName
      };

      return { 
        user, 
        needsVerification: !signUpResult.isSignUpComplete 
      };
    } catch (error) {
      console.error('Sign up failed:', error);
      throw error;
    }
  }

  // Confirm sign up with verification code
  async confirmSignUp(email: string, confirmationCode: string): Promise<void> {
    try {
      await confirmSignUp({ username: email, confirmationCode });
    } catch (error) {
      console.error('Confirmation failed:', error);
      throw error;
    }
  }

  // Resend confirmation code
  async resendConfirmationCode(email: string): Promise<void> {
    try {
      await resendSignUpCode({ username: email });
    } catch (error) {
      console.error('Resend confirmation failed:', error);
      throw error;
    }
  }
}

export const authService = new AuthenticationService();

// Make clearAuthData available globally for debugging in production
if (typeof window !== 'undefined') {
  (window as typeof window & { clearAbditradeAuth?: () => void }).clearAbditradeAuth = () => authService.clearAuthData();
}