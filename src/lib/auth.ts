import { NextAuthOptions } from 'next-auth';
import CognitoProvider from 'next-auth/providers/cognito';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { DynamoDBAdapter } from '@next-auth/dynamodb-adapter';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { authService } from '@/services/authService';

// Check if AWS credentials are configured
const hasAWSCredentials = 
  process.env.AWS_ACCESS_KEY_ID && 
  process.env.AWS_SECRET_ACCESS_KEY && 
  process.env.NEXT_PUBLIC_AWS_REGION;

const config = hasAWSCredentials ? {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  region: process.env.NEXT_PUBLIC_AWS_REGION!,
} : undefined;

const client = config ? DynamoDBDocument.from(new DynamoDB(config), {
  marshallOptions: {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
}) : undefined;

export const authOptions: NextAuthOptions = {
  adapter: client ? DynamoDBAdapter(client) : undefined,
  providers: [
    // Credentials provider for email/password authentication
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Use the existing authService to authenticate with Cognito
          const result = await authService.signIn(credentials.email, credentials.password);
          
          if (result.user) {
            // Construct name from available fields, fallback to username or email
            const firstName = result.user.firstName || '';
            const lastName = result.user.lastName || '';
            let name = `${firstName} ${lastName}`.trim();
            
            // If no first/last name, use username or email prefix
            if (!name) {
              name = result.user.username || result.user.email?.split('@')[0] || 'User';
            }
            
            return {
              id: result.user.id,
              email: result.user.email,
              name: name,
              username: result.user.username || result.user.email?.split('@')[0] || 'User',
              image: result.user.avatar || null,
            };
          }
          return null;
        } catch (error) {
          console.error('NextAuth Credentials authentication error:', error);
          return null;
        }
      }
    }),
    // Google OAuth provider for social sign-in
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
    ] : []),
    // Note: AWS Cognito OAuth provider removed for better user experience
    // Users can still sign in with email/password (handled by Cognito via credentials provider)
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, account, profile, user }) {
      if (account && profile) {
        token.accessToken = account.access_token;
        token.userId = profile.sub;
        token.username = profile.preferred_username || profile.email;
      }
      // Persist user data in JWT token from credentials provider
      if (user) {
        token.userId = user.id;
        token.email = user.email;
        token.name = user.name;
        // Add username to token - safely access it
        if ('username' in user && typeof user.username === 'string') {
          token.username = user.username;
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken as string;
      session.userId = token.userId as string;
      session.username = token.username as string;
      // Also add username to user object
      if (session.user && token.username) {
        session.user.username = token.username as string;
      }
      return session;
    },

  },
  pages: {
    signIn: '/auth',
    signOut: '/auth',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
};

// Extend the built-in session types
declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    userId?: string;
    username?: string;
    user?: {
      name?: string;
      email?: string;
      image?: string;
      username?: string;
    };
  }

  interface JWT {
    accessToken?: string;
    userId?: string;
    username?: string;
  }

  interface Profile {
    preferred_username?: string;
  }
  
  interface User {
    username?: string;
  }
}

// Define the user type that includes Stripe account information
export interface User {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  userType?: 'Individual' | 'TCG Store' | 'Buyer';
  storeName?: string;
  stripeAccountId?: string;
  // Add other user attributes as needed
}

/**
 * Get the current authenticated user
 * This function handles the authentication and returns user data
 * Note: This is a server-side function for API routes
 */
export async function getCurrentUser(): Promise<User | null> {
  // For now, return a mock user in development
  // In production, this would get the session and return the authenticated user
  if (process.env.NODE_ENV === 'development') {
    return {
      id: 'dev-user-123',
      email: 'dev@abditrade.com',
      username: 'developer',
      firstName: 'Dev',
      lastName: 'User',
      userType: 'Individual',
    };
  }

  // In production, implement real user fetching from session
  return null;
}