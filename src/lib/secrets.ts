// src/lib/secrets.ts
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

interface CloudinaryConfig {
  cloud_name?: string;
  api_key?: string;
  api_secret?: string;
}

interface ExternalAPISecrets {
  pokemon_tcg?: string;
  sentry_dsn?: string;
  google_analytics?: string;
  cloudinary?: CloudinaryConfig;
}

let client: SecretsManagerClient | null = null;

// Initialize the Secrets Manager client
function getClient(): SecretsManagerClient {
  if (!client) {
    // AWS_PROFILE is read from environment variables automatically

    const config: { region: string; credentials?: { accessKeyId: string; secretAccessKey: string } } = {
      region: process.env.AWS_REGION || 'us-east-2',
    };

    // Use explicit credentials if provided, otherwise use default credential chain (includes SSO)
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && 
        process.env.AWS_ACCESS_KEY_ID !== 'dummy-access-key-for-dev') {
      config.credentials = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      };
      console.log('🔑 Using explicit AWS credentials for Secrets Manager');
    } else {
      console.log('🔑 Using AWS default credential chain (includes SSO profile:', process.env.AWS_PROFILE || 'default', ')');
    }

    client = new SecretsManagerClient(config);
  }
  return client;
}

// Cache for secrets to avoid repeated API calls
const secretsCache = new Map<string, { value: string; expiry: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function getSecret(secretName: string): Promise<string> {
  // For development/build, check if we have AWS credentials (either explicit or SSO profile)
  const hasExplicitCredentials = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_ACCESS_KEY_ID !== 'dummy-access-key-for-dev';
  const hasAwsProfile = process.env.AWS_PROFILE;
  
  if (!hasExplicitCredentials && !hasAwsProfile) {
    console.warn(`Development mode: AWS Secrets Manager not configured for secret: ${secretName}`);
    return '';
  }

  // Check cache first
  const cached = secretsCache.get(secretName);
  if (cached && Date.now() < cached.expiry) {
    return cached.value;
  }

  try {
    const client = getClient();
    const command = new GetSecretValueCommand({
      SecretId: secretName,
    });
    
    const response = await client.send(command);
    
    if (!response.SecretString) {
      throw new Error(`Secret ${secretName} not found or empty`);
    }
    
    const secretValue = response.SecretString;
    
    // Cache the secret
    secretsCache.set(secretName, {
      value: secretValue,
      expiry: Date.now() + CACHE_TTL
    });
    
    return secretValue;
  } catch (error) {
    console.error(`Error retrieving secret ${secretName}:`, error);
    // In development, return empty string instead of throwing
    if (process.env.NODE_ENV === 'development') {
      return '';
    }
    throw new Error(`Failed to retrieve secret: ${secretName}`);
  }
}

export async function getJSONSecret(secretName: string): Promise<Record<string, unknown>> {
  const secretString = await getSecret(secretName);
  if (!secretString) return {};
  
  try {
    return JSON.parse(secretString);
  } catch (error) {
    console.error(`Error parsing JSON secret ${secretName}:`, error);
    return {};
  }
}

// Specific secret getters for commonly used secrets
export async function getStripeSecrets() {
  try {
    // Get individual secrets as they are stored separately in AWS
    const [secretKey, publishableKey, webhookSecret] = await Promise.all([
      getSecret('abditrade/stripe/secret-key'),
      getSecret('abditrade/stripe/publishable-key'), 
      getSecret('abditrade/stripe/webhook-secret')
    ]);
    
    return {
      secretKey: secretKey || process.env.STRIPE_SECRET_KEY || '',
      publishableKey: publishableKey || process.env.STRIPE_PUBLISHABLE_KEY || '',
      webhookSecret: webhookSecret || process.env.STRIPE_WEBHOOK_SECRET || ''
    };
  } catch (error) {
    console.warn('Using fallback Stripe configuration from environment variables');
    return {
      secretKey: process.env.STRIPE_SECRET_KEY || '',
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || ''
    };
  }
}

export async function getDatabaseSecrets() {
  try {
    const secrets = await getJSONSecret('abditrade/database/credentials');
    return {
      host: secrets.host || process.env.DATABASE_HOST || '',
      port: secrets.port || process.env.DATABASE_PORT || '5432',
      database: secrets.database || process.env.DATABASE_NAME || '',
      username: secrets.username || process.env.DATABASE_USER || '',
      password: secrets.password || process.env.DATABASE_PASSWORD || '',
      url: secrets.url || process.env.DATABASE_URL || ''
    };
  } catch (error) {
    console.warn('Using fallback database configuration from environment variables');
    return {
      host: process.env.DATABASE_HOST || '',
      port: process.env.DATABASE_PORT || '5432',
      database: process.env.DATABASE_NAME || '',
      username: process.env.DATABASE_USER || '',
      password: process.env.DATABASE_PASSWORD || '',
      url: process.env.DATABASE_URL || ''
    };
  }
}

export async function getRedisSecrets() {
  try {
    const secrets = await getJSONSecret('abditrade/redis/credentials');
    return {
      endpoint: secrets.endpoint || process.env.REDIS_ENDPOINT || '',
      port: secrets.port || process.env.REDIS_PORT || '6379',
      password: secrets.password || process.env.REDIS_PASSWORD || '',
      url: secrets.url || process.env.REDIS_URL || ''
    };
  } catch (error) {
    console.warn('Using fallback Redis configuration from environment variables');
    return {
      endpoint: process.env.REDIS_ENDPOINT || '',
      port: process.env.REDIS_PORT || '6379',
      password: process.env.REDIS_PASSWORD || '',
      url: process.env.REDIS_URL || ''
    };
  }
}

export async function getExternalAPISecrets() {
  try {
    // Get individual secrets from AWS Secrets Manager
    const [pokemonTCGKey, easyPostKey, apiTCGSecretString] = await Promise.all([
      getSecret('pokemon-tcg-api'),
      getSecret('easy-post'),
      getSecret('api_tcg') // Using 'api_tcg' as documented in AWS Secrets Manager
    ]);
    
    // Parse API_TCG key from JSON format
    let apiTCGKey = '';
    if (apiTCGSecretString) {
      try {
        const apiTCGSecret = JSON.parse(apiTCGSecretString);
        apiTCGKey = apiTCGSecret.api_tcg || '';
      } catch (error) {
        console.warn('Failed to parse api_tcg secret as JSON, using as string');
        apiTCGKey = apiTCGSecretString;
      }
    }
    
    return {
      pokemonTCG: pokemonTCGKey || process.env.POKEMON_TCG_API_KEY || '',
      easyPost: easyPostKey || process.env.EASYPOST_API_KEY || '',
      apiTCG: apiTCGKey || process.env.API_TCG_KEY || '', // Added API_TCG support
      sentryDSN: process.env.SENTRY_DSN || '',
      googleAnalytics: process.env.GOOGLE_ANALYTICS_ID || '',
      cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
        apiKey: process.env.CLOUDINARY_API_KEY || '',
        apiSecret: process.env.CLOUDINARY_API_SECRET || ''
      }
    };
  } catch (error) {
    console.warn('Using fallback external API configuration from environment variables');
    return {
      pokemonTCG: process.env.POKEMON_TCG_API_KEY || '',
      easyPost: process.env.EASYPOST_API_KEY || '',
      apiTCG: process.env.API_TCG_KEY || '', // Added API_TCG fallback
      sentryDSN: process.env.SENTRY_DSN || '',
      googleAnalytics: process.env.GOOGLE_ANALYTICS_ID || '',
      cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
        apiKey: process.env.CLOUDINARY_API_KEY || '',
        apiSecret: process.env.CLOUDINARY_API_SECRET || ''
      }
    };
  }
}

export async function getCognitoSecrets() {
  try {
    const secrets = await getJSONSecret('abditrade/cognito/config');
    return {
      userPoolId: secrets.user_pool_id || process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || '',
      clientId: secrets.client_id || process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || '',
      domain: secrets.domain || process.env.COGNITO_USER_POOL_DOMAIN || '',
      region: secrets.region || process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-2'
    };
  } catch (error) {
    console.warn('Using fallback Cognito configuration from environment variables');
    return {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || '',
      clientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || '',
      domain: process.env.COGNITO_USER_POOL_DOMAIN || '',
      region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-2'
    };
  }
}

export async function getOAuthSecrets() {
  try {
    const [appleSecrets, googleSecrets] = await Promise.all([
      getJSONSecret('/abditrade/oauth/apple'),
      getJSONSecret('/abditrade/oauth/google')
    ]);
    
    return {
      apple: {
        clientId: appleSecrets.client_id || process.env.APPLE_CLIENT_ID || '',
        teamId: appleSecrets.team_id || process.env.APPLE_TEAM_ID || '',
        keyId: appleSecrets.key_id || process.env.APPLE_KEY_ID || '',
        privateKey: appleSecrets.private_key || process.env.APPLE_PRIVATE_KEY || ''
      },
      google: {
        clientId: googleSecrets.client_id || process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: googleSecrets.client_secret || process.env.GOOGLE_CLIENT_SECRET || ''
      }
    };
  } catch (error) {
    console.warn('Using fallback OAuth configuration from environment variables');
    return {
      apple: {
        clientId: process.env.APPLE_CLIENT_ID || '',
        teamId: process.env.APPLE_TEAM_ID || '',
        keyId: process.env.APPLE_KEY_ID || '',
        privateKey: process.env.APPLE_PRIVATE_KEY || ''
      },
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
      }
    };
  }
}