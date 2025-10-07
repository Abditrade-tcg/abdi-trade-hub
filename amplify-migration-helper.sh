#!/bin/bash

# AWS Amplify Migration Helper Script
# This script helps verify and update your Amplify configuration

echo "🚀 Amplify Migration Helper for abditrade-frontend2.0"
echo "=================================================="

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first:"
    echo "   https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html"
    exit 1
fi

# Check if user is logged in to AWS CLI
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS CLI is not configured. Please run 'aws configure' first."
    exit 1
fi

echo "✅ AWS CLI is configured"

# List current Amplify apps
echo ""
echo "📋 Current Amplify Apps:"
echo "========================"
aws amplify list-apps --query 'apps[].{Name:name,AppId:appId,DefaultDomain:defaultDomain,Repository:repository}' --output table

echo ""
echo "🔍 Next Steps:"
echo "=============="
echo "1. Identify your current abditrade app ID from the list above"
echo "2. Go to AWS Amplify Console: https://console.aws.amazon.com/amplify/"
echo "3. Select your app and update the repository to 'abditrade-frontend2.0'"
echo ""
echo "Or use AWS CLI:"
echo "aws amplify update-app --app-id YOUR_APP_ID --repository https://github.com/YOUR_USERNAME/abditrade-frontend2.0"
echo ""
echo "📝 Important Environment Variables to Set:"
echo "=========================================="
echo "NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-2_JQyLM7wLQ"
echo "NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID=tubrda7vo3mfajca930arr44p"
echo "STRIPE_PUBLISHABLE_KEY=pk_live_..."
echo "STRIPE_SECRET_KEY=sk_live_..."
echo "AWS_ACCESS_KEY_ID=AKIA..."
echo "AWS_SECRET_ACCESS_KEY=..."
echo "DATABASE_URL=postgresql://..."
echo "REDIS_URL=redis://..."
echo "JWT_SECRET=your-jwt-secret"
echo "NEXTAUTH_SECRET=your-nextauth-secret"
echo "NEXTAUTH_URL=https://your-domain.com"
echo ""
echo "🔗 Useful Links:"
echo "==============="
echo "AWS Amplify Console: https://console.aws.amazon.com/amplify/"
echo "Migration Guide: ./AMPLIFY_MIGRATION_GUIDE.md"