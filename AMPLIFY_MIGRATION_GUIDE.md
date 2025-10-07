# AWS Amplify Repository Migration Guide

## Changing Amplify from `abditrade-web` to `abditrade-frontend2.0`

### Option 1: Update Existing Amplify App (Recommended)

1. **Access AWS Amplify Console**
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - Select your existing `abditrade-web` app

2. **Update Repository Settings**
   - Go to "App settings" → "General"
   - Click "Edit" next to "Repository"
   - Update the repository URL to point to `abditrade-frontend2.0`
   - If using GitHub: Update the repository name in the connection

3. **Update Environment Variables**
   - Go to "App settings" → "Environment variables"
   - Verify all environment variables are set correctly
   - Add any new variables needed for the updated application

4. **Deploy**
   - Trigger a new deployment from the main branch
   - Monitor the build logs to ensure successful deployment

### Option 2: Create New Amplify App

If you prefer to create a fresh Amplify app:

1. **Create New App**
   - Go to AWS Amplify Console
   - Click "Create app" → "Host web app"
   - Connect to your Git provider (GitHub)
   - Select the `abditrade-frontend2.0` repository
   - Choose the `main` branch

2. **Configure Build Settings**
   - Amplify should auto-detect the `amplify.yml` file
   - Review and confirm the build settings

3. **Set Environment Variables**
   - Add all required environment variables:
     ```
     NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-2_JQyLM7wLQ
     NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID=tubrda7vo3mfajca930arr44p
     STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key
     STRIPE_SECRET_KEY=sk_live_your_secret_key
     AWS_ACCESS_KEY_ID=your_access_key_id
     AWS_SECRET_ACCESS_KEY=your_secret_access_key
     DATABASE_URL=your_database_url
     REDIS_URL=your_redis_url
     OPENSEARCH_ENDPOINT=your_opensearch_endpoint
     JWT_SECRET=your_jwt_secret
     NEXTAUTH_SECRET=your_nextauth_secret
     NEXTAUTH_URL=https://your-domain.com
     ```

4. **Deploy**
   - Save and deploy the new app

### Option 3: AWS CLI Script

Use the AWS CLI to update the existing app:

```bash
# Update the source repository
aws amplify update-app \
  --app-id YOUR_APP_ID \
  --repository https://github.com/YOUR_USERNAME/abditrade-frontend2.0 \
  --region us-east-2

# Start a new deployment
aws amplify start-job \
  --app-id YOUR_APP_ID \
  --branch-name main \
  --job-type RELEASE \
  --region us-east-2
```

### Important Notes

1. **Environment Variables**: Make sure all environment variables are properly configured in the new repository setup
2. **Domain**: If you have a custom domain configured, it will remain the same
3. **AWS Secrets Manager**: The application is configured to use AWS Secrets Manager for production secrets
4. **Build Settings**: The `amplify.yml` file in `abditrade-frontend2.0` is already configured and ready to use

### Verification Steps

After migration:

1. **Check Build Logs**: Ensure the build completes successfully
2. **Test Application**: Verify all functionality works correctly
3. **Monitor**: Check AWS CloudWatch logs for any errors
4. **DNS**: Ensure your domain is properly configured

### Rollback Plan

If you need to rollback:
1. Change the repository back to `abditrade-web`
2. Redeploy from that repository
3. Monitor for successful deployment

### Questions?

If you encounter any issues during the migration:
1. Check the Amplify build logs for specific error messages
2. Verify all environment variables are set correctly
3. Ensure the `amplify.yml` file is properly configured
4. Test the application locally with `npm run build` before deploying