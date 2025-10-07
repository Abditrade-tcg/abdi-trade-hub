import { Amplify } from 'aws-amplify';

// Debug logging for production
if (typeof window !== 'undefined') {
  console.log('Amplify Configuration Debug:', {
    userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID ? 'SET' : 'MISSING',
    userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID ? 'SET' : 'MISSING',
    region: process.env.NEXT_PUBLIC_COGNITO_REGION || process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-2',
    env: process.env.NODE_ENV || 'unknown',
    publicEnv: process.env.NEXT_PUBLIC_ENV || 'unknown'
  });
}

// Fallback configuration for production
const fallbackConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-east-2_JQyLM7wLQ',
      userPoolClientId: 'tubrda7vo3mfajca930arr44p',
      region: 'us-east-2',
      signUpVerificationMethod: 'code' as const,
      loginWith: {
        email: true,
        username: false,
      },
    },
  },
};

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || fallbackConfig.Auth.Cognito.userPoolId,
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || fallbackConfig.Auth.Cognito.userPoolClientId,
      region: process.env.NEXT_PUBLIC_COGNITO_REGION || process.env.NEXT_PUBLIC_AWS_REGION || fallbackConfig.Auth.Cognito.region,
      signUpVerificationMethod: 'code' as const,
      loginWith: {
        email: true,
        username: false,
      },
    },
  },
};

// Validate configuration before configuring Amplify
const isConfigValid = amplifyConfig.Auth.Cognito.userPoolId && 
                     amplifyConfig.Auth.Cognito.userPoolClientId && 
                     amplifyConfig.Auth.Cognito.region;

console.log('Amplify Configuration Validation:', {
  userPoolId: amplifyConfig.Auth.Cognito.userPoolId,
  userPoolClientId: amplifyConfig.Auth.Cognito.userPoolClientId,
  region: amplifyConfig.Auth.Cognito.region,
  isValid: isConfigValid,
  usingFallback: !process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID
});

if (!isConfigValid) {
  console.error('Amplify configuration is invalid:', {
    userPoolId: amplifyConfig.Auth.Cognito.userPoolId,
    userPoolClientId: amplifyConfig.Auth.Cognito.userPoolClientId,
    region: amplifyConfig.Auth.Cognito.region
  });
} else {
  console.log('Amplify configuration is valid, configuring...');
  Amplify.configure(amplifyConfig);
}

export default amplifyConfig;