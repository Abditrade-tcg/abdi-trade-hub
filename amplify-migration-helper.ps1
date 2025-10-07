# AWS Amplify Migration Helper Script (PowerShell)
# This script helps verify and update your Amplify configuration

Write-Host "🚀 Amplify Migration Helper for abditrade-frontend2.0" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

# Check if AWS CLI is installed
try {
    aws --version | Out-Null
    Write-Host "✅ AWS CLI is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ AWS CLI is not installed. Please install it first:" -ForegroundColor Red
    Write-Host "   https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2-windows.html" -ForegroundColor Yellow
    exit 1
}

# Check if user is logged in to AWS CLI
try {
    aws sts get-caller-identity | Out-Null
    Write-Host "✅ AWS CLI is configured" -ForegroundColor Green
} catch {
    Write-Host "❌ AWS CLI is not configured. Please run 'aws configure' first." -ForegroundColor Red
    exit 1
}

# List current Amplify apps
Write-Host ""
Write-Host "📋 Current Amplify Apps:" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
aws amplify list-apps --query 'apps[].{Name:name,AppId:appId,DefaultDomain:defaultDomain,Repository:repository}' --output table

Write-Host ""
Write-Host "🔍 Next Steps:" -ForegroundColor Yellow
Write-Host "==============" -ForegroundColor Yellow
Write-Host "1. Identify your current abditrade app ID from the list above"
Write-Host "2. Go to AWS Amplify Console: https://console.aws.amazon.com/amplify/"
Write-Host "3. Select your app and update the repository to 'abditrade-frontend2.0'"
Write-Host ""
Write-Host "Or use AWS CLI:" -ForegroundColor Magenta
Write-Host "aws amplify update-app --app-id YOUR_APP_ID --repository https://github.com/YOUR_USERNAME/abditrade-frontend2.0" -ForegroundColor Gray
Write-Host ""

Write-Host "📝 Important Environment Variables to Set:" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
$envVars = @(
    "NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-2_JQyLM7wLQ",
    "NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID=tubrda7vo3mfajca930arr44p",
    "STRIPE_PUBLISHABLE_KEY=pk_live_...",
    "STRIPE_SECRET_KEY=sk_live_...",
    "AWS_ACCESS_KEY_ID=AKIA...",
    "AWS_SECRET_ACCESS_KEY=...",
    "DATABASE_URL=postgresql://...",
    "REDIS_URL=redis://...",
    "JWT_SECRET=your-jwt-secret",
    "NEXTAUTH_SECRET=your-nextauth-secret",
    "NEXTAUTH_URL=https://your-domain.com"
)

foreach ($env in $envVars) {
    Write-Host $env -ForegroundColor Gray
}

Write-Host ""
Write-Host "🔗 Useful Links:" -ForegroundColor Cyan
Write-Host "===============" -ForegroundColor Cyan
Write-Host "AWS Amplify Console: https://console.aws.amazon.com/amplify/" -ForegroundColor Blue
Write-Host "Migration Guide: .\AMPLIFY_MIGRATION_GUIDE.md" -ForegroundColor Blue

Write-Host ""
Write-Host "🎯 Ready to migrate? Here's what to do:" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green
Write-Host "1. Note your App ID from the list above"
Write-Host "2. Run: aws amplify update-app --app-id YOUR_APP_ID --repository https://github.com/YOUR_USERNAME/abditrade-frontend2.0"
Write-Host "3. Or use the AWS Amplify Console web interface"
Write-Host "4. After updating, trigger a new deployment"
Write-Host ""

# Pause for user to read
Write-Host "Press any key to continue..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")