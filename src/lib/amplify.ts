import { Amplify } from 'aws-amplify';

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

if (!isConfigValid) {
  console.error('Amplify configuration is invalid');
} else {
  Amplify.configure(amplifyConfig);
}

export default amplifyConfig;