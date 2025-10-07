// pages/api/test-secrets.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { testSecretsIntegration, validateProductionSecrets, showEnvironmentInfo } from '@/lib/test-secrets';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('\n=== AWS Secrets Manager Test ===');
    
    // Show environment info
    showEnvironmentInfo();
    
    // Validate AWS credentials
    const hasProductionCredentials = validateProductionSecrets();
    
    // Test secrets integration
    const testResult = await testSecretsIntegration();
    
    console.log('=== Test Complete ===\n');

    return res.status(200).json({
      success: true,
      hasProductionCredentials,
      testResult,
      environment: process.env.NODE_ENV,
      awsRegion: process.env.AWS_REGION,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in secrets test:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}