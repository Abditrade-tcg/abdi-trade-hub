# 🔧 Connect New Amplify App to Correct Repository

## Current Status:
- **New App ID:** `d2l066fpea7xoo` ✅ (Created successfully, no repo connected)
- **Old App ID:** `darg9t6uuyev5` ❌ (Connected to wrong repo: abditrade-web)

---

## 🎯 **Manual Connection Steps**

Since CLI is having GitHub permission issues, use the AWS Console:

### Step 1: Open Your New App
**Go to:** https://console.aws.amazon.com/amplify/home/apps/d2l066fpea7xoo

### Step 2: Connect Repository
1. **Click:** "Host web app" or "Connect app"
2. **Choose:** GitHub
3. **Authenticate:** Through browser (should work better than CLI)
4. **Select Repository:** `Abditrade-tcg/abditrade-frontend2.0`
5. **Choose Branch:** `main`
6. **Configure Build:** Review amplify.yml settings

### Step 3: Set Environment Variables
Add these in the Amplify console:
```
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-2_JQyLM7wLQ
NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID=tubrda7vo3mfajca930arr44p
NEXT_PUBLIC_COGNITO_REGION=us-east-2
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://d2l066fpea7xoo.amplifyapp.com
NEXT_PUBLIC_AWS_REGION=us-east-2
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-key
STRIPE_SECRET_KEY=your-stripe-secret
DATABASE_URL=your-database-url
POKEMON_TCG_API_KEY=your-pokemon-key
```

---

## 🔄 **Alternative: Try CLI One More Time**

Let me try a different approach with the CLI:

### Create Branch First:
```powershell
# Create a branch without OAuth token
aws amplify create-branch --app-id d2l066fpea7xoo --branch-name main --profile admin
```

### Then try to connect repository:
```powershell
# Try updating with SSH URL instead
aws amplify update-app --app-id d2l066fpea7xoo --repository git@github.com:Abditrade-tcg/abditrade-frontend2.0.git --profile admin
```

---

## 🗑️ **Clean Up Old App**

Once new app is working:
1. **Go to old app:** https://console.aws.amazon.com/amplify/home/apps/darg9t6uuyev5
2. **Delete it** to avoid confusion

---

## 📱 **Quick Links**
- **New App (d2l066fpea7xoo):** https://console.aws.amazon.com/amplify/home/apps/d2l066fpea7xoo
- **Old App (darg9t6uuyev5):** https://console.aws.amazon.com/amplify/home/apps/darg9t6uuyev5

The new app should connect to `abditrade-frontend2.0` correctly once you use the web console!