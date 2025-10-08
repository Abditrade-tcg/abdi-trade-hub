import { NextAuthOptions } from 'next-auth';
import CognitoProvider from 'next-auth/providers/cognito';
import { DynamoDBAdapter } from '@next-auth/dynamodb-adapter';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

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
    ...(process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID && process.env.COGNITO_CLIENT_SECRET ? [
      CognitoProvider({
        clientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID!,
        clientSecret: process.env.COGNITO_CLIENT_SECRET!,
        issuer: `https://cognito-idp.${process.env.NEXT_PUBLIC_COGNITO_REGION || 'us-east-1'}.amazonaws.com/${process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID}`,
        checks: ['pkce', 'state'],
      }),
    ] : []),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token;
        token.userId = profile.sub;
        token.username = profile.preferred_username || profile.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.userId = token.userId as string;
      session.username = token.username as string;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
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
  }

  interface JWT {
    accessToken?: string;
    userId?: string;
    username?: string;
  }

  interface Profile {
    preferred_username?: string;
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