# 🆕 New Amplify App Configuration Update

## New App Details:
- **New App ID:** `d1ltdwo8ecgyoe`
- **Repository:** `https://github.com/Abditrade-tcg/abditrade-frontend2.0` ✅
- **Domain:** `d1ltdwo8ecgyoe.amplifyapp.com`
- **Status:** Connected successfully, build failed (needs environment variables)

---

## 🔧 **Required Updates**

### 1. Environment Variables (Priority 1)
The build failed because environment variables need to be set. Go to:
**AWS Console:** https://console.aws.amazon.com/amplify/home/apps/d1ltdwo8ecgyoe/settings/variables

**Add these environment variables:**
```
NODE_ENV=production
NEXT_PUBLIC_AWS_REGION=us-east-2
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-2_JQyLM7wLQ
NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID=tubrda7vo3mfajca930arr44p
NEXT_PUBLIC_COGNITO_REGION=us-east-2
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=https://d1ltdwo8ecgyoe.amplifyapp.com
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
DATABASE_URL=your-database-url
POKEMON_TCG_API_KEY=your-pokemon-api-key
```

### 2. Update Domain References (Priority 2)
Update any hardcoded domain references in your code:

**Old Domain:** `darg9t6uuyev5.amplifyapp.com` or similar
**New Domain:** `d1ltdwo8ecgyoe.amplifyapp.com`

**Files to check:**
- `src/lib/auth.ts` (NEXTAUTH_URL)
- `src/config/amplify-prod.ts`
- Any API endpoint configurations
- CORS settings in your backend

### 3. Backend API CORS (Priority 2)
Update your backend CORS settings to allow the new domain:
```javascript
// In your backend CORS configuration
const allowedOrigins = [
  'https://d1ltdwo8ecgyoe.amplifyapp.com',  // New domain
  'https://abditrade.com',  // Custom domain (if you have one)
  'http://localhost:3000'   // Development
];
```

### 4. External Service Webhooks (Priority 3)
Update webhooks in external services:
- **Stripe webhooks:** Update to new domain
- **GitHub webhooks:** Should update automatically
- **Any third-party integrations**

---

## 🚀 **Immediate Action Steps**

### Step 1: Set Environment Variables (Do this first)
1. Go to: https://console.aws.amazon.com/amplify/home/apps/d1ltdwo8ecgyoe/settings/variables
2. Add all the environment variables listed above
3. Save changes

### Step 2: Trigger New Build
1. Go to: https://console.aws.amazon.com/amplify/home/apps/d1ltdwo8ecgyoe
2. Click "Redeploy this version" or push a new commit
3. Monitor the build logs

### Step 3: Update NextAuth URL
In your environment variables, make sure:
```
NEXTAUTH_URL=https://d1ltdwo8ecgyoe.amplifyapp.com
```

### Step 4: Test the Application
Once build succeeds:
1. Visit: https://d1ltdwo8ecgyoe.amplifyapp.com
2. Test authentication
3. Test key functionality

---

## 📝 **Configuration Files to Update**

### In your local development:
1. **Update `.env.local` (for development):**
   ```
   NEXTAUTH_URL=http://localhost:3000
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

2. **Update production configs:**
   ```
   NEXTAUTH_URL=https://d1ltdwo8ecgyoe.amplifyapp.com
   NEXT_PUBLIC_APP_URL=https://d1ltdwo8ecgyoe.amplifyapp.com
   ```

---

## 🎯 **Quick Commands**

### Check build status:
```powershell
aws amplify list-jobs --app-id d1ltdwo8ecgyoe --branch-name main --profile admin
```

### Get app details:
```powershell
aws amplify get-app --app-id d1ltdwo8ecgyoe --profile admin
```

### Get branch details:
```powershell
aws amplify get-branch --app-id d1ltdwo8ecgyoe --branch-name main --profile admin
```

---

## ✅ **Success Indicators**

You'll know everything is working when:
1. ✅ Build completes successfully
2. ✅ App loads at new domain
3. ✅ Authentication works
4. ✅ API calls succeed
5. ✅ No console errors

The most critical update is setting the environment variables - do that first and trigger a new build!