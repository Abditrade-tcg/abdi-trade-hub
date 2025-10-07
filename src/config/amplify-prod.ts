// Production Amplify configuration
export const amplifyConfig = {
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

export default amplifyConfig;