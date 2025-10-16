# 🚀 Update Amplify App Repository

## Your App Details
- **App ID:** `darg9t6uuyev5`
- **New Repository:** `https://github.com/Abditrade-tcg/abditrade-frontend2.0.git`

---

## ✅ Option 1: AWS Console (Easiest - No CLI needed)

### Step-by-Step Instructions:

1. **Go to AWS Amplify Console:**
   - Open: https://console.aws.amazon.com/amplify/home
   - Sign in to your AWS account

2. **Find Your App:**
   - Look for your app with ID `darg9t6uuyev5`
   - Click on the app name

3. **Update Repository:**
   - Go to **App settings** → **General**
   - In the **Repository** section, click **Edit**
   - Update the repository URL to: `https://github.com/Abditrade-tcg/abditrade-frontend2.0.git`
   - Click **Save**

4. **Trigger New Deployment:**
   - Go to the main app dashboard
   - Click **Redeploy this version** or wait for automatic deployment

---

## ✅ Option 2: AWS CLI (If you want to configure it)

### Configure AWS CLI:
```powershell
# Run this in PowerShell
aws configure
```

When prompted, enter:
- **AWS Access Key ID:** [Your access key]
- **AWS Secret Access Key:** [Your secret key]  
- **Default region name:** us-east-2
- **Default output format:** json

### Update Repository:
```powershell
# Update the repository
aws amplify update-app --app-id darg9t6uuyev5 --repository https://github.com/Abditrade-tcg/abditrade-frontend2.0.git

# Trigger a new deployment
aws amplify start-job --app-id darg9t6uuyev5 --branch-name main --job-type RELEASE
```

---

## ✅ Option 3: Direct PowerShell Commands (If AWS CLI is configured)

Save this as a PowerShell script and run it:

```powershell
# Update Amplify App Repository
Write-Host "🔄 Updating Amplify app repository..." -ForegroundColor Yellow

# Update the repository
$updateResult = aws amplify update-app --app-id darg9t6uuyev5 --repository https://github.com/Abditrade-tcg/abditrade-frontend2.0.git 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Repository updated successfully!" -ForegroundColor Green
    
    # Trigger deployment
    Write-Host "🚀 Starting deployment..." -ForegroundColor Yellow
    aws amplify start-job --app-id darg9t6uuyev5 --branch-name main --job-type RELEASE
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Deployment started successfully!" -ForegroundColor Green
        Write-Host "📱 Check your Amplify console for deployment progress:" -ForegroundColor Cyan
        Write-Host "   https://console.aws.amazon.com/amplify/home/apps/darg9t6uuyev5" -ForegroundColor Gray
    } else {
        Write-Host "❌ Failed to start deployment" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Failed to update repository:" -ForegroundColor Red
    Write-Host $updateResult -ForegroundColor Red
}
```

---

## 🔍 Verification Steps

After updating the repository:

1. **Check Amplify Console:**
   - Go to: https://console.aws.amazon.com/amplify/home/apps/darg9t6uuyev5
   - Verify the repository shows: `abditrade-frontend2.0`
   - Check that a new build has started

2. **Monitor Build Progress:**
   - Watch the build logs for any errors
   - Ensure all environment variables are properly set
   - Verify the build completes successfully

3. **Test Your Application:**
   - Visit your Amplify domain
   - Test key functionality (login, navigation, etc.)
   - Check browser console for any errors

---

## 🚨 If You Encounter Issues

### "Access denied" or "Repository not found"
1. Ensure the repository is public or AWS Amplify has access
2. Verify the repository URL is correct
3. Check GitHub permissions for AWS Amplify app

### "Build failed"
1. Check that `amplify.yml` exists in the new repository
2. Verify all environment variables are set in Amplify console
3. Review build logs for specific error messages

### "Environment variables missing"
Make sure these are set in your Amplify app settings:
- `NEXT_PUBLIC_COGNITO_USER_POOL_ID`
- `NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- All other required environment variables

---

## 🎯 Recommended Action

**I recommend using Option 1 (AWS Console)** since it's the most reliable and doesn't require CLI configuration.

1. Go to: https://console.aws.amazon.com/amplify/home/apps/darg9t6uuyev5
2. Click **App settings** → **General** → **Edit** (in Repository section)
3. Update to: `https://github.com/Abditrade-tcg/abditrade-frontend2.0.git`
4. Save and wait for deployment

Let me know if you need help with any of these steps!