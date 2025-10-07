# AWS Secrets Manager Setup for Abditrade

This document explains how to configure AWS Secrets Manager for production deployment.

## Required Secrets (✅ Already Created)

### 1. Stripe Configuration
**Secret Names:** 
- `abditrade/stripe/secret-key` - **Type:** String (Stripe Secret API Key)
- `abditrade/stripe/publishable-key` - **Type:** String (Stripe Publishable API Key)  
- `abditrade/stripe/webhook-secret` - **Type:** String (Stripe Webhook Signing Secret)

### 2. Database Credentials
**Secret Name:** `abditrade/database/credentials`
**Type:** JSON
```json
{
  "host": "your-rds-endpoint.us-east-2.rds.amazonaws.com",
  "port": "5432",
  "database": "abditrade_prod",
  "username": "abditrade_user",
  "password": "your_secure_database_password",
  "url": "postgresql://abditrade_user:your_secure_password@your-rds-endpoint.us-east-2.rds.amazonaws.com:5432/abditrade_prod?sslmode=require"
}
```

### 3. Redis/ElastiCache Credentials
**Secret Name:** `abditrade/redis/credentials`
**Type:** JSON
```json
{
  "endpoint": "your-elasticache-endpoint.cache.amazonaws.com",
  "port": "6379",
  "password": "your_redis_auth_token",
  "url": "rediss://your-elasticache-endpoint.cache.amazonaws.com:6379"
}
```

### 4. External API Keys (✅ Already Created)
**Secret Names:**
- `pokemon-tcg-api` - **Type:** String (Pokemon TCG API Key)
- `easy-post` - **Type:** String (EasyPost API Key)

### 5. OAuth Configuration (✅ Already Created)
**Secret Names:**
- `/abditrade/oauth/apple` - **Type:** JSON (Apple Sign In credentials)
- `/abditrade/oauth/google` - **Type:** JSON (Google OAuth credentials)

### 6. Cognito Configuration
**Secret Name:** `abditrade/cognito/config` (⚠️ Create if needed)
**Type:** JSON
```json
{
  "user_pool_id": "us-east-2_YourPoolId",
  "client_id": "your_cognito_client_id", 
  "domain": "abditrade-auth",
  "region": "us-east-2"
}
```

## AWS CLI Commands to Create Secrets

```bash
# 1. Create Stripe secrets
aws secretsmanager create-secret \
  --name "abditrade/stripe/keys" \
  --description "Stripe API keys for Abditrade" \
  --secret-string file://stripe-secrets.json \
  --region us-east-2

# 2. Create Database secrets
aws secretsmanager create-secret \
  --name "abditrade/database/credentials" \
  --description "Database credentials for Abditrade" \
  --secret-string file://database-secrets.json \
  --region us-east-2

# 3. Create Redis secrets
aws secretsmanager create-secret \
  --name "abditrade/redis/credentials" \
  --description "Redis credentials for Abditrade" \
  --secret-string file://redis-secrets.json \
  --region us-east-2

# 4. Create External API secrets
aws secretsmanager create-secret \
  --name "abditrade/external-apis/keys" \
  --description "External API keys for Abditrade" \
  --secret-string file://external-api-secrets.json \
  --region us-east-2

# 5. Create Cognito secrets
aws secretsmanager create-secret \
  --name "abditrade/cognito/config" \
  --description "Cognito configuration for Abditrade" \
  --secret-string file://cognito-secrets.json \
  --region us-east-2
```

## Environment Variables for Production

Set these environment variables in your production deployment (Vercel, AWS Lambda, etc.):

```bash
# AWS Configuration
AWS_REGION=us-east-2
AWS_ACCESS_KEY_ID=your_production_access_key
AWS_SECRET_ACCESS_KEY=your_production_secret_key

# Application
NEXT_PUBLIC_APP_URL=https://abditrade.com
NEXT_PUBLIC_API_URL=https://api.abditrade.com
NEXT_PUBLIC_AWS_REGION=us-east-2
NODE_ENV=production

# NextAuth
NEXTAUTH_URL=https://abditrade.com
NEXTAUTH_SECRET=your_production_nextauth_secret
```

## IAM Policy for Secrets Access

Your application's IAM role needs this policy to access secrets:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": [
        "arn:aws:secretsmanager:us-east-2:*:secret:abditrade/*"
      ]
    }
  ]
}
```

## Development vs Production

- **Development**: Uses dummy values from `.env.local` and warns when secrets are not available
- **Production**: Automatically retrieves secrets from AWS Secrets Manager with fallback to environment variables
- **Build Process**: Works with both configurations - warnings are normal for development builds

## Security Best Practices

1. **Never commit real secrets** to version control
2. **Use IAM roles** instead of IAM users when possible (EC2, Lambda, ECS)
3. **Rotate secrets regularly** using AWS Secrets Manager automatic rotation
4. **Use least privilege** - only grant access to specific secrets needed
5. **Monitor secret access** with AWS CloudTrail
6. **Use different secrets** for different environments (dev, staging, prod)

## Testing Secret Access

Use the frontend secrets utility to test:

```typescript
import { getStripeSecrets, getDatabaseSecrets } from '@/lib/secrets';

// Test in your API routes or server-side code
const stripeConfig = await getStripeSecrets();
const dbConfig = await getDatabaseSecrets();
```

## Troubleshooting

1. **Access Denied**: Check IAM permissions for Secrets Manager
2. **Secret Not Found**: Verify secret name and region
3. **Invalid JSON**: Validate JSON format in secret values
4. **Development Warnings**: Normal - secrets utility falls back to env vars
5. **Build Warnings**: Normal for development - will be resolved in production with proper AWS credentials