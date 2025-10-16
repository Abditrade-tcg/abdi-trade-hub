# 🔑 AWS Amplify Repository Update with GitHub Personal Access Token

## Your Command Structure:
```bash
aws amplify update-app \
  --app-id darg9t6uuyev5 \
  --repository https://github.com/Abditrade-tcg/abditrade-frontend2.0 \
  --oauth-token <your_github_PAT>
```

---

## 🚀 Step 1: Create GitHub Personal Access Token (PAT)

### Generate PAT:
1. **Go to GitHub:** https://github.com/settings/tokens
2. **Click:** "Generate new token" → "Generate new token (classic)"
3. **Configure the token:**
   - **Name:** `AWS Amplify - AbdiTrade`
   - **Expiration:** 90 days (or your preference)
   - **Scopes:** Check these boxes:
     - ✅ `repo` (Full control of private repositories)
     - ✅ `admin:repo_hook` (Full control of repository hooks)
     - ✅ `read:org` (Read org and team membership)

4. **Click:** "Generate token"
5. **⚠️ IMPORTANT:** Copy the token immediately - you won't see it again!

### Token Format:
Your token will look like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

## 🚀 Step 2: Configure AWS CLI (if not done)

```powershell
# Configure AWS CLI with your credentials
aws configure
```

When prompted, enter:
- **AWS Access Key ID:** [Your AWS access key]
- **AWS Secret Access Key:** [Your AWS secret key]
- **Default region name:** us-east-2
- **Default output format:** json

---

## 🚀 Step 3: Update Amplify Repository

### PowerShell Command:
```powershell
# Replace YOUR_GITHUB_TOKEN with your actual PAT
aws amplify update-app `
  --app-id darg9t6uuyev5 `
  --repository https://github.com/Abditrade-tcg/abditrade-frontend2.0 `
  --oauth-token YOUR_GITHUB_TOKEN
```

### Alternative (one-line):
```powershell
aws amplify update-app --app-id darg9t6uuyev5 --repository https://github.com/Abditrade-tcg/abditrade-frontend2.0 --oauth-token YOUR_GITHUB_TOKEN
```

---

## 🚀 Step 4: Trigger Deployment

After successfully updating the repository:

```powershell
# Start a new deployment
aws amplify start-job --app-id darg9t6uuyev5 --branch-name main --job-type RELEASE
```

---

## 🚀 Step 5: Verify Changes

### Check app details:
```powershell
aws amplify get-app --app-id darg9t6uuyev5
```

### Monitor deployment:
```powershell
aws amplify list-jobs --app-id darg9t6uuyev5 --branch-name main
```

---

## 📝 Complete PowerShell Script

Save this as `update-amplify-repo.ps1`:

```powershell
# AWS Amplify Repository Update Script
# Replace YOUR_GITHUB_TOKEN with your actual Personal Access Token

Write-Host "🔄 Updating AWS Amplify repository..." -ForegroundColor Yellow
Write-Host "App ID: darg9t6uuyev5" -ForegroundColor Cyan
Write-Host "New Repository: https://github.com/Abditrade-tcg/abditrade-frontend2.0" -ForegroundColor Cyan

# Update repository (replace YOUR_GITHUB_TOKEN)
$updateResult = aws amplify update-app `
  --app-id darg9t6uuyev5 `
  --repository https://github.com/Abditrade-tcg/abditrade-frontend2.0 `
  --oauth-token YOUR_GITHUB_TOKEN 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Repository updated successfully!" -ForegroundColor Green
    
    # Start deployment
    Write-Host "🚀 Starting deployment..." -ForegroundColor Yellow
    $deployResult = aws amplify start-job --app-id darg9t6uuyev5 --branch-name main --job-type RELEASE 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Deployment started successfully!" -ForegroundColor Green
        Write-Host "📱 Monitor progress at: https://console.aws.amazon.com/amplify/home/apps/darg9t6uuyev5" -ForegroundColor Cyan
        
        # Show app details
        Write-Host "📋 Updated app details:" -ForegroundColor Yellow
        aws amplify get-app --app-id darg9t6uuyev5 --query 'app.{Name:name,Repository:repository,DefaultDomain:defaultDomain}' --output table
    } else {
        Write-Host "❌ Failed to start deployment:" -ForegroundColor Red
        Write-Host $deployResult -ForegroundColor Red
    }
} else {
    Write-Host "❌ Failed to update repository:" -ForegroundColor Red
    Write-Host $updateResult -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Common issues:" -ForegroundColor Yellow
    Write-Host "  - Invalid GitHub Personal Access Token" -ForegroundColor Gray
    Write-Host "  - AWS CLI not configured" -ForegroundColor Gray
    Write-Host "  - Repository not accessible" -ForegroundColor Gray
}
```

---

## 🔧 Troubleshooting

### Error: "Invalid OAuth token"
- Verify your PAT is correct
- Ensure PAT has `repo` and `admin:repo_hook` permissions
- Check if PAT has expired

### Error: "Repository not found"
- Verify repository URL is correct
- Ensure PAT has access to the Abditrade-tcg organization
- Check if repository is private and PAT has appropriate permissions

### Error: "Unable to locate credentials"
- Run `aws configure` to set up AWS CLI
- Verify your AWS access keys are correct

---

## 🎯 Next Steps

1. **Create GitHub PAT** (Step 1)
2. **Configure AWS CLI** if needed (Step 2)
3. **Run the update command** with your PAT (Step 3)
4. **Monitor deployment** (Step 4)
5. **Verify app is working** at your Amplify domain

---

## 🔗 Useful Links

- **GitHub PAT Setup:** https://github.com/settings/tokens
- **Your Amplify App:** https://console.aws.amazon.com/amplify/home/apps/darg9t6uuyev5
- **AWS CLI Install:** https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2-windows.html

Let me know when you have the GitHub PAT ready, and I can help you run the command!