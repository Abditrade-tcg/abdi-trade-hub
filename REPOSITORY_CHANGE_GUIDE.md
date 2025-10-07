# 🔄 AWS Amplify Repository Change Guide

## Issue: Cannot Change Source Repository in AWS Amplify

If you're unable to change the repository source in AWS Amplify from `abditrade-web` to `abditrade-frontend2.0`, here are several solutions:

---

## ✅ Method 1: AWS Amplify Console (Recommended)

### Step 1: Access Amplify Console
1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Sign in with your AWS account
3. Find your `abditrade` application

### Step 2: Disconnect Current Repository
1. Click on your app name
2. Go to **App settings** → **General**
3. In the **Repository** section, click **Edit**
4. Click **Disconnect repository**
5. Confirm the disconnection

### Step 3: Connect New Repository
1. After disconnection, click **Connect repository**
2. Choose **GitHub** as your repository service
3. Authorize AWS Amplify to access your GitHub account (if needed)
4. Select your GitHub organization/account
5. Choose **abditrade-frontend2.0** repository
6. Select the branch (usually `main` or `master`)
7. Click **Next**

### Step 4: Configure Build Settings
1. Amplify will detect your `amplify.yml` file
2. Review the build settings
3. Set your environment variables (see section below)
4. Click **Next** → **Save and deploy**

---

## ✅ Method 2: AWS CLI (If you have access)

### Prerequisites
```bash
# Install AWS CLI (if not already installed)
# https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2-windows.html

# Configure AWS credentials
aws configure
```

### Commands
```bash
# List your current Amplify apps to get the App ID
aws amplify list-apps

# Update the repository (replace YOUR_APP_ID and YOUR_GITHUB_USERNAME)
aws amplify update-app \
  --app-id YOUR_APP_ID \
  --repository https://github.com/YOUR_GITHUB_USERNAME/abditrade-frontend2.0

# Trigger a new deployment
aws amplify start-job --app-id YOUR_APP_ID --branch-name main --job-type RELEASE
```

---

## ✅ Method 3: Create New Amplify App (If methods above fail)

### Why This Might Be Necessary
- Repository connection issues
- Permission problems
- Corrupted app settings

### Steps
1. **Create New App:**
   - Go to AWS Amplify Console
   - Click **New app** → **Host web app**
   - Choose **GitHub**
   - Select **abditrade-frontend2.0** repository
   - Choose branch (main/master)

2. **Configure Build Settings:**
   - Amplify will detect your `amplify.yml`
   - Review and confirm settings

3. **Set Environment Variables** (see section below)

4. **Update DNS/Domain** (if you have a custom domain):
   - Go to **Domain management**
   - Add your domain
   - Update DNS records as instructed

5. **Delete Old App** (after verifying new one works):
   - Go to the old app
   - **App settings** → **General** → **Delete app**

---

## 🔑 Required Environment Variables

Make sure these are set in your Amplify app:

```bash
# Cognito Configuration
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-2_JQyLM7wLQ
NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID=tubrda7vo3mfajca930arr44p
NEXT_PUBLIC_COGNITO_REGION=us-east-2

# NextAuth Configuration
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=https://your-amplify-domain.com

# AWS Configuration
NEXT_PUBLIC_AWS_REGION=us-east-2
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# Stripe Configuration (from AWS Secrets Manager)
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...

# Database
DATABASE_URL=postgresql://your-database-url

# Redis (if using)
REDIS_URL=redis://your-redis-url

# API Keys (stored in AWS Secrets Manager)
POKEMON_TCG_API_KEY=your-pokemon-api-key
```

---

## 🚨 Common Issues & Solutions

### Issue: "Repository not found" or "Access denied"
**Solution:**
1. Ensure `abditrade-frontend2.0` repository exists on GitHub
2. Verify AWS Amplify has access to your GitHub account
3. Check repository visibility (public vs private)
4. Re-authorize GitHub connection in Amplify

### Issue: "Build failed" after repository change
**Solution:**
1. Check `amplify.yml` file exists in new repository
2. Verify all environment variables are set
3. Check build logs for specific errors
4. Ensure Node.js version matches (`package.json` engines field)

### Issue: "Environment variables not working"
**Solution:**
1. Double-check variable names (case-sensitive)
2. Ensure values don't have extra spaces
3. For secrets, verify AWS Secrets Manager access
4. Check if variables need `NEXT_PUBLIC_` prefix for client-side access

### Issue: Domain/DNS issues after repository change
**Solution:**
1. Domain settings should transfer automatically
2. If not, re-add domain in new app
3. Update DNS records if needed
4. Wait for propagation (up to 24 hours)

---

## ✅ Verification Steps

After changing the repository:

1. **Check Build Status:**
   - Go to your Amplify app
   - Check **Build history**
   - Ensure latest build succeeded

2. **Test Application:**
   - Visit your Amplify domain
   - Test key functionality (login, cart, etc.)
   - Check browser console for errors

3. **Verify Environment Variables:**
   - Test authentication flow
   - Check API connections
   - Verify Stripe integration

4. **Monitor Logs:**
   - Check CloudWatch logs
   - Monitor for any runtime errors
   - Verify database connections

---

## 📞 Need Help?

If you're still having issues:

1. **Check AWS Amplify Service Status:** https://status.aws.amazon.com/
2. **AWS Support:** If you have a support plan
3. **GitHub Repository Issues:** Check if the repo is accessible
4. **AWS Documentation:** https://docs.aws.amazon.com/amplify/

---

## 🎯 Quick Action Items

**Right Now:**
1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Try Method 1 (disconnect and reconnect repository)
3. If that fails, use Method 3 (create new app)

**The key is making sure your `abditrade-frontend2.0` repository is:**
- ✅ Accessible on GitHub
- ✅ Contains proper `amplify.yml`
- ✅ Has the same codebase as your working `abditrade-web`