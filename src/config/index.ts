import { getConfig, isFeatureEnabled } from './environmentManager';

// Environment variable helper functions (deprecated - use environmentManager instead)
function getEnvVar(key: string, defaultValue: string = ''): string {
  const value = process.env[key];
  if (!value && !defaultValue) {
    console.warn(`Environment variable ${key} is not set and no default provided`);
  }
  return value || defaultValue;
}

function getNumberEnvVar(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

function getBooleanEnvVar(key: string, defaultValue: boolean = false): boolean {
  const value = process.env[key];
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
}

// Application configuration interface
interface AppConfig {
  // Application
  appUrl: string;
  apiUrl: string;
  
  // AWS Cognito
  aws: {
    region: string;
    cognito: {
      userPoolId: string;
      userPoolClientId: string;
      userPoolDomain: string;
    };
    accessKeyId: string;
    secretAccessKey: string;
    ses: {
      region: string;
      fromEmail: string;
    };
    s3: {
      bucket: string;
    };
  };
  
  // Card Data APIs
  cardApis: {
    ygo: {
      baseUrl: string;
    };
    pokemon: {
      baseUrl: string;
      apiKey: string;
    };
    scryfall: {
      baseUrl: string;
    };
    apiTcg: {
      baseUrl: string;
    };
  };
  
  // Database
  database: {
    url: string;
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
    ssl: boolean;
  };
  
  redis: {
    url: string;
    host: string;
    port: number;
    password: string;
    tls: boolean;
  };
  
  // Security
  security: {
    jwtSecret: string;
    nextAuthSecret: string;
    nextAuthUrl: string;
  };
  
  // External APIs
  stripe: {
    secretKey: string;
    publishableKey: string;
    webhookSecret: string;
  };
  
  // Monitoring
  monitoring: {
    sentryDsn: string;
    googleAnalyticsId: string;
  };
  
  // Storage
  storage: {
    cloudinary: {
      cloudName: string;
      apiKey: string;
      apiSecret: string;
    };
  };
  
  // Rate Limiting
  rateLimiting: {
    windowMs: number;
    maxRequests: number;
  };
  
  // CORS
  cors: {
    origin: string;
  };
  
  // Feature Flags
  features: {
    enableCardDataApis: boolean;
    enableRealAuthentication: boolean;
    enableAwsSes: boolean;
    enableEmployeeInvitation: boolean;
    enableReactQueryDevtools: boolean;
  };
}

// Configuration object
export const config: AppConfig = {
  // Application
  appUrl: getEnvVar('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
  apiUrl: getEnvVar('NEXT_PUBLIC_API_URL', 'http://localhost:3000/api'),
  
  // AWS Configuration
  aws: {
    region: getEnvVar('NEXT_PUBLIC_AWS_REGION', 'us-east-2'),
    cognito: {
      userPoolId: getEnvVar('NEXT_PUBLIC_COGNITO_USER_POOL_ID'),
      userPoolClientId: getEnvVar('NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID'),
      userPoolDomain: getEnvVar('COGNITO_USER_POOL_DOMAIN'),
    },
    accessKeyId: getEnvVar('AWS_ACCESS_KEY_ID'),
    secretAccessKey: getEnvVar('AWS_SECRET_ACCESS_KEY'),
    ses: {
      region: getEnvVar('AWS_SES_REGION', 'us-east-1'),
      fromEmail: getEnvVar('AWS_SES_FROM_EMAIL', 'noreply@abditrade.com'),
    },
    s3: {
      bucket: getEnvVar('AWS_S3_BUCKET', 'abditrade-assets'),
    },
  },
  
  // Card Data APIs
  cardApis: {
    ygo: {
      baseUrl: getEnvVar('YGO_PRO_API_URL', 'https://db.ygoprodeck.com/api/v7'),
    },
    pokemon: {
      baseUrl: getEnvVar('POKEMON_TCG_API_URL', 'https://api.pokemontcg.io/v2'),
      apiKey: getEnvVar('POKEMON_TCG_API_KEY', ''),
    },
    scryfall: {
      baseUrl: getEnvVar('SCRYFALL_API_URL', 'https://api.scryfall.com'),
    },
    apiTcg: {
      baseUrl: getEnvVar('API_TCG_URL', 'https://apitcg.com/api'),
    },
  },
  
  // Database Configuration
  database: {
    url: getEnvVar('DATABASE_URL'),
    host: getEnvVar('DATABASE_HOST'),
    port: getNumberEnvVar('DATABASE_PORT', 5432),
    name: getEnvVar('DATABASE_NAME'),
    user: getEnvVar('DATABASE_USER'),
    password: getEnvVar('DATABASE_PASSWORD'),
    ssl: getBooleanEnvVar('DATABASE_SSL', true),
  },
  
  // Redis Configuration
  redis: {
    url: getEnvVar('REDIS_URL'),
    host: getEnvVar('REDIS_ENDPOINT'),
    port: getNumberEnvVar('REDIS_PORT', 6379),
    password: getEnvVar('REDIS_PASSWORD'),
    tls: getBooleanEnvVar('REDIS_TLS', true),
  },
  
  // Security
  security: {
    jwtSecret: getEnvVar('JWT_SECRET'),
    nextAuthSecret: getEnvVar('NEXTAUTH_SECRET'),
    nextAuthUrl: getEnvVar('NEXTAUTH_URL'),
  },
  
  // Stripe
  stripe: {
    secretKey: getEnvVar('STRIPE_SECRET_KEY'),
    publishableKey: getEnvVar('STRIPE_PUBLISHABLE_KEY'),
    webhookSecret: getEnvVar('STRIPE_WEBHOOK_SECRET'),
  },
  
  // Monitoring
  monitoring: {
    sentryDsn: getEnvVar('SENTRY_DSN', ''),
    googleAnalyticsId: getEnvVar('GOOGLE_ANALYTICS_ID', ''),
  },
  
  // Storage
  storage: {
    cloudinary: {
      cloudName: getEnvVar('CLOUDINARY_CLOUD_NAME', ''),
      apiKey: getEnvVar('CLOUDINARY_API_KEY', ''),
      apiSecret: getEnvVar('CLOUDINARY_API_SECRET', ''),
    },
  },
  
  // Rate Limiting
  rateLimiting: {
    windowMs: getNumberEnvVar('RATE_LIMIT_WINDOW', 900000), // 15 minutes
    maxRequests: getNumberEnvVar('RATE_LIMIT_MAX_REQUESTS', 100),
  },
  
  // CORS
  cors: {
    origin: getEnvVar('CORS_ORIGIN', '*'),
  },
  
  // Feature Flags
  features: {
    enableCardDataApis: getBooleanEnvVar('ENABLE_CARD_DATA_APIS', true),
    enableRealAuthentication: getBooleanEnvVar('ENABLE_REAL_AUTHENTICATION', true),
    enableAwsSes: getBooleanEnvVar('ENABLE_AWS_SES', false),
    enableEmployeeInvitation: getBooleanEnvVar('ENABLE_EMPLOYEE_INVITATION', false),
    enableReactQueryDevtools: getBooleanEnvVar('ENABLE_REACT_QUERY_DEVTOOLS', process.env.NODE_ENV === 'development'),
  },
};

// Export individual sections for easy access
export const { 
  appUrl, 
  apiUrl, 
  aws, 
  cardApis, 
  database, 
  redis, 
  security, 
  stripe, 
  monitoring, 
  storage, 
  rateLimiting, 
  cors, 
  features 
} = config;

// Environment validation helper
export function validateEnvironment(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];
  
  // Critical environment variables
  const critical = [
    'NEXT_PUBLIC_APP_URL',
    'NEXT_PUBLIC_API_URL',
    'NEXT_PUBLIC_AWS_REGION',
    'NEXT_PUBLIC_COGNITO_USER_POOL_ID',
    'NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID',
  ];
  
  critical.forEach(key => {
    if (!process.env[key]) {
      missing.push(key);
    }
  });
  
  return {
    valid: missing.length === 0,
    missing
  };
}

// Environment info for debugging
export function getEnvironmentInfo() {
  return {
    nodeEnv: process.env.NODE_ENV,
    nextPublicEnv: process.env.NEXT_PUBLIC_ENV,
    hasAws: !!aws.cognito.userPoolId,
    hasStripe: !!stripe.secretKey,
    hasDatabase: !!database.url,
    hasRedis: !!redis.url,
    features: features,
  };
}

export default config;

// Enhanced configuration using environment manager
export const enhancedConfig = getConfig();

// Convenience exports for new system
export { getConfig, isFeatureEnabled } from './environmentManager';