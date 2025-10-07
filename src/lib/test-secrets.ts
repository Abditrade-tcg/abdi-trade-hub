// src/lib/test-secrets.ts
// Utility to test AWS Secrets Manager integration
// This file is for testing purposes only

import { 
  getStripeSecrets, 
  getExternalAPISecrets, 
  getOAuthSecrets,
  getCognitoSecrets 
} from './secrets';

export async function testSecretsIntegration() {
  console.log('🔐 Testing AWS Secrets Manager Integration...\n');

  try {
    // Test Stripe secrets
    console.log('📊 Testing Stripe Secrets...');
    const stripeSecrets = await getStripeSecrets();
    console.log('✅ Stripe Secrets:', {
      secretKey: stripeSecrets.secretKey ? '***' + stripeSecrets.secretKey.slice(-4) : 'Not found',
      publishableKey: stripeSecrets.publishableKey ? stripeSecrets.publishableKey.slice(0, 8) + '***' : 'Not found',
      webhookSecret: stripeSecrets.webhookSecret ? '***' + stripeSecrets.webhookSecret.slice(-4) : 'Not found'
    });

    // Test External API secrets
    console.log('\n🎮 Testing External API Secrets...');
    const apiSecrets = await getExternalAPISecrets();
    console.log('✅ External API Secrets:', {
      pokemonTCG: apiSecrets.pokemonTCG ? '***' + apiSecrets.pokemonTCG.slice(-4) : 'Not found',
      easyPost: apiSecrets.easyPost ? '***' + apiSecrets.easyPost.slice(-4) : 'Not found'
    });

    // Test OAuth secrets
    console.log('\n🔐 Testing OAuth Secrets...');
    const oauthSecrets = await getOAuthSecrets();
    console.log('✅ OAuth Secrets:', {
      apple: {
        clientId: oauthSecrets.apple.clientId ? String(oauthSecrets.apple.clientId).slice(0, 8) + '***' : 'Not found',
        teamId: oauthSecrets.apple.teamId ? String(oauthSecrets.apple.teamId) : 'Not found'
      },
      google: {
        clientId: oauthSecrets.google.clientId ? String(oauthSecrets.google.clientId).slice(0, 8) + '***' : 'Not found'
      }
    });

    // Test Cognito secrets
    console.log('\n🏛️ Testing Cognito Secrets...');
    const cognitoSecrets = await getCognitoSecrets();
    console.log('✅ Cognito Secrets:', {
      userPoolId: cognitoSecrets.userPoolId || 'Using fallback',
      clientId: cognitoSecrets.clientId || 'Using fallback',
      region: cognitoSecrets.region
    });

    console.log('\n🎉 Secrets Manager integration test completed successfully!');
    return true;

  } catch (error) {
    console.error('❌ Error testing secrets integration:', error);
    return false;
  }
}

// Helper function to validate secrets are loaded
export function validateProductionSecrets() {
  const requiredEnvVars = [
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'AWS_REGION'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName] || process.env[varName] === 'dummy-access-key-for-dev');

  if (missingVars.length > 0) {
    console.warn('⚠️ Development mode detected. Missing production AWS credentials:', missingVars);
    return false;
  }

  console.log('✅ Production AWS credentials configured');
  return true;
}

// Helper to show current environment configuration
export function showEnvironmentInfo() {
  console.log('🌍 Environment Information:');
  console.log('- NODE_ENV:', process.env.NODE_ENV);
  console.log('- AWS_REGION:', process.env.AWS_REGION);
  console.log('- AWS Credentials:', process.env.AWS_ACCESS_KEY_ID ? 
    (process.env.AWS_ACCESS_KEY_ID.includes('dummy') ? 'Development (dummy)' : 'Production') : 
    'Not configured'
  );
  console.log('- Cognito User Pool:', process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID ? 'Configured' : 'Not configured');
}