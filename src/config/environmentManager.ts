/**
 * Environment Configuration Utility
 * Manages environment-specific settings for development, staging, and production
 */

export type Environment = 'development' | 'staging' | 'production';

interface EnvironmentConfig {
  // Environment Info
  env: Environment;
  isDevelopment: boolean;
  isStaging: boolean;
  isProduction: boolean;
  
  // AWS Configuration
  aws: {
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    s3: {
      bucketName: string;
      region: string;
    };
    cognito: {
      region: string;
      userPoolId: string;
      userPoolClientId: string;
      identityPoolId: string;
    };
    opensearch: {
      endpoint: string;
      index: string;
    };
    dynamodb: {
      tablePrefix: string;
    };
  };
  
  // API Configuration
  api: {
    backendUrl: string;
    backendApiKey: string;
    yugiohApiUrl: string;
    pokemonApiUrl: string;
    magicApiUrl: string;
  };
  
  // Stripe Configuration
  stripe: {
    publishableKey: string;
    secretKey: string;
    webhookSecret: string;
  };
  
  // Auth Configuration
  auth: {
    nextAuthUrl: string;
    nextAuthSecret: string;
  };
  
  // Database Configuration
  database: {
    url: string;
  };
  
  // Feature Flags
  features: {
    enableOpenSearch: boolean;
    enableBackendAPI: boolean;
    enableRealPayments: boolean;
    enableS3Cache: boolean;
    enableRequestLogging: boolean;
  };
  
  // Cache Configuration
  cache: {
    ttlHours: number;
  };
  
  // Logging Configuration
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    enableRequestLogging: boolean;
  };
}

class EnvironmentManager {
  private config: EnvironmentConfig | null = null;
  
  constructor() {
    this.loadConfig();
  }
  
  private loadConfig(): void {
    const env = this.getCurrentEnvironment();
    
    this.config = {
      // Environment Info
      env,
      isDevelopment: env === 'development',
      isStaging: env === 'staging',
      isProduction: env === 'production',
      
      // AWS Configuration
      aws: {
        region: process.env.AWS_REGION || 'us-east-1',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        s3: {
          bucketName: process.env.AWS_S3_BUCKET_NAME || `abditrade-${env}-cache`,
          region: process.env.AWS_S3_REGION || 'us-east-1',
        },
        cognito: {
          region: process.env.AWS_COGNITO_REGION || 'us-east-1',
          userPoolId: process.env.AWS_COGNITO_USER_POOL_ID || '',
          userPoolClientId: process.env.AWS_COGNITO_USER_POOL_CLIENT_ID || '',
          identityPoolId: process.env.AWS_COGNITO_IDENTITY_POOL_ID || '',
        },
        opensearch: {
          endpoint: process.env.OPENSEARCH_ENDPOINT || '',
          index: process.env.OPENSEARCH_INDEX || `cards-${env}`,
        },
        dynamodb: {
          tablePrefix: process.env.DYNAMODB_TABLE_PREFIX || `abditrade-${env}-`,
        },
      },
      
      // API Configuration
      api: {
        backendUrl: process.env.NEXT_PUBLIC_BACKEND_API_URL || this.getDefaultBackendUrl(env),
        backendApiKey: process.env.BACKEND_API_KEY || '',
        yugiohApiUrl: process.env.YUGIOH_API_URL || 'https://db.ygoprodeck.com/api/v7/cardinfo.php',
        pokemonApiUrl: process.env.POKEMON_API_URL || 'https://api.pokemontcg.io/v2/cards',
        magicApiUrl: process.env.MAGIC_API_URL || 'https://api.scryfall.com/cards/search',
      },
      
      // Stripe Configuration
      stripe: {
        publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
        secretKey: process.env.STRIPE_SECRET_KEY || '',
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
      },
      
      // Auth Configuration
      auth: {
        nextAuthUrl: process.env.NEXTAUTH_URL || this.getDefaultAuthUrl(env),
        nextAuthSecret: process.env.NEXTAUTH_SECRET || '',
      },
      
      // Database Configuration
      database: {
        url: process.env.DATABASE_URL || '',
      },
      
      // Feature Flags
      features: {
        enableOpenSearch: process.env.ENABLE_OPENSEARCH === 'true',
        enableBackendAPI: process.env.ENABLE_BACKEND_API === 'true',
        enableRealPayments: process.env.ENABLE_REAL_PAYMENTS === 'true',
        enableS3Cache: process.env.ENABLE_S3_CACHE !== 'false', // Default to true
        enableRequestLogging: process.env.ENABLE_REQUEST_LOGGING === 'true',
      },
      
      // Cache Configuration
      cache: {
        ttlHours: parseInt(process.env.CACHE_TTL_HOURS || '24', 10),
      },
      
      // Logging Configuration
      logging: {
        level: this.getValidLogLevel(process.env.LOG_LEVEL, env),
        enableRequestLogging: process.env.ENABLE_REQUEST_LOGGING === 'true',
      },
    };
  }
  
  private getCurrentEnvironment(): Environment {
    const nodeEnv = process.env.NODE_ENV;
    const customEnv = process.env.NEXT_PUBLIC_ENV;
    
    // Custom environment takes precedence
    if (customEnv && ['development', 'staging', 'production'].includes(customEnv)) {
      return customEnv as Environment;
    }
    
    // Fall back to NODE_ENV
    switch (nodeEnv) {
      case 'development':
        return 'development';
      case 'production':
        return 'production';
      default:
        return 'development';
    }
  }
  
  private getDefaultBackendUrl(env: Environment): string {
    switch (env) {
      case 'production':
        return 'https://api.abditrade.com';
      case 'staging':
        return 'https://staging-api.abditrade.com';
      case 'development':
      default:
        return 'http://localhost:8000';
    }
  }
  
  private getDefaultAuthUrl(env: Environment): string {
    switch (env) {
      case 'production':
        return 'https://abditrade.com';
      case 'staging':
        return 'https://staging.abditrade.com';
      case 'development':
      default:
        return 'http://localhost:3000';
    }
  }
  
  private getValidLogLevel(logLevel: string | undefined, env: Environment): 'debug' | 'info' | 'warn' | 'error' {
    const validLevels = ['debug', 'info', 'warn', 'error'] as const;
    
    if (logLevel && validLevels.includes(logLevel as typeof validLevels[number])) {
      return logLevel as 'debug' | 'info' | 'warn' | 'error';
    }
    
    // Default based on environment
    return env === 'production' ? 'error' : 'info';
  }
  
  public getConfig(): EnvironmentConfig {
    if (!this.config) {
      this.loadConfig();
    }
    return this.config!;
  }
  
  public reloadConfig(): void {
    this.loadConfig();
  }
  
  /**
   * Validate that all required environment variables are set
   */
  public validateConfig(): { isValid: boolean; missingVars: string[] } {
    const config = this.getConfig();
    const missingVars: string[] = [];
    
    // Required AWS variables in production/staging
    if (!config.isDevelopment) {
      if (!config.aws.accessKeyId) missingVars.push('AWS_ACCESS_KEY_ID');
      if (!config.aws.secretAccessKey) missingVars.push('AWS_SECRET_ACCESS_KEY');
      if (!config.aws.cognito.userPoolId) missingVars.push('AWS_COGNITO_USER_POOL_ID');
      if (!config.aws.cognito.userPoolClientId) missingVars.push('AWS_COGNITO_USER_POOL_CLIENT_ID');
    }
    
    // Required NextAuth variables
    if (!config.auth.nextAuthSecret) missingVars.push('NEXTAUTH_SECRET');
    
    // Required Stripe variables if payments are enabled
    if (config.features.enableRealPayments) {
      if (!config.stripe.publishableKey) missingVars.push('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
      if (!config.stripe.secretKey) missingVars.push('STRIPE_SECRET_KEY');
      if (!config.stripe.webhookSecret) missingVars.push('STRIPE_WEBHOOK_SECRET');
    }
    
    // Required backend API variables if backend is enabled
    if (config.features.enableBackendAPI) {
      if (!config.api.backendApiKey) missingVars.push('BACKEND_API_KEY');
    }
    
    return {
      isValid: missingVars.length === 0,
      missingVars,
    };
  }
  
  /**
   * Get environment-specific logging configuration
   */
  public getLogLevel(): string {
    return this.getConfig().logging.level;
  }
  
  /**
   * Check if a feature is enabled
   */
  public isFeatureEnabled(feature: keyof EnvironmentConfig['features']): boolean {
    return this.getConfig().features[feature];
  }
  
  /**
   * Get AWS credentials for SDK initialization
   */
  public getAWSCredentials() {
    const { aws } = this.getConfig();
    return {
      region: aws.region,
      credentials: {
        accessKeyId: aws.accessKeyId,
        secretAccessKey: aws.secretAccessKey,
      },
    };
  }
  
  /**
   * Print configuration summary (for debugging)
   */
  public printConfigSummary(): void {
    const config = this.getConfig();
    const validation = this.validateConfig();
    
    console.log(`🌍 Environment: ${config.env}`);
    console.log(`🔧 Features: ${Object.entries(config.features).filter(([, enabled]) => enabled).map(([key]) => key).join(', ')}`);
    console.log(`📊 Log Level: ${config.logging.level}`);
    console.log(`💾 Cache TTL: ${config.cache.ttlHours}h`);
    
    if (!validation.isValid) {
      console.warn(`⚠️  Missing environment variables: ${validation.missingVars.join(', ')}`);
    } else {
      console.log(`✅ All required environment variables are set`);
    }
  }
}

// Export singleton instance
export const environmentManager = new EnvironmentManager();

// Export convenience functions
export const getConfig = () => environmentManager.getConfig();
export const isFeatureEnabled = (feature: keyof EnvironmentConfig['features']) => 
  environmentManager.isFeatureEnabled(feature);
export const getAWSCredentials = () => environmentManager.getAWSCredentials();
export const validateEnvironment = () => environmentManager.validateConfig();