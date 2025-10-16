# 🌐 Custom Domain Setup for New Amplify App

## Current Status:
- **Amplify App ID:** `d1ltdwo8ecgyoe`
- **Temporary Domain:** `d1ltdwo8ecgyoe.amplifyapp.com`
- **Custom Domain:** `abditrade.com` (setting up)

---

## ⏳ **While Waiting for Domain Setup**

### 1. Verify Current App is Working
First, make sure the app is working on the temporary domain:
**Test URL:** https://d1ltdwo8ecgyoe.amplifyapp.com

### 2. Prepare Environment Variables
Once your custom domain is ready, you'll need to update:

**Current (Temporary):**
```
NEXTAUTH_URL=https://d1ltdwo8ecgyoe.amplifyapp.com
NEXT_PUBLIC_APP_URL=https://d1ltdwo8ecgyoe.amplifyapp.com
```

**After Custom Domain:**
```
NEXTAUTH_URL=https://abditrade.com
NEXT_PUBLIC_APP_URL=https://abditrade.com
```

---

## 🔧 **Custom Domain Configuration Steps**

### When Domain is Ready:

#### Step 1: Update Environment Variables in Amplify
Go to: https://console.aws.amazon.com/amplify/home/apps/d1ltdwo8ecgyoe/settings/variables

**Update these variables:**
```
NEXTAUTH_URL=https://abditrade.com
NEXT_PUBLIC_APP_URL=https://abditrade.com
NEXT_PUBLIC_API_URL=https://api.abditrade.com (if you have a separate API domain)
```

#### Step 2: Update CORS in Backend
Update your backend CORS settings to include the new domain:
```javascript
const allowedOrigins = [
  'https://abditrade.com',  // New custom domain
  'https://d1ltdwo8ecgyoe.amplifyapp.com',  // Keep as backup
  'http://localhost:3000'   // Development
];
```

#### Step 3: Update External Services

**Stripe Webhooks:**
- Update webhook endpoints to use `https://abditrade.com`
- Update any Stripe Connect settings

**OAuth Providers (if any):**
- Update callback URLs to use new domain
- Update any social login configurations

**Third-party APIs:**
- Update any webhook configurations
- Update CORS settings on external APIs

---

## 📋 **Domain Verification Checklist**

When your domain is live, verify:

### ✅ **Basic Functionality:**
- [ ] Site loads at https://abditrade.com
- [ ] HTTPS certificate is valid
- [ ] All pages load correctly
- [ ] No mixed content warnings

### ✅ **Authentication:**
- [ ] Login/logout works
- [ ] Session persistence works
- [ ] Password reset emails work
- [ ] Social login (if configured) works

### ✅ **API Integration:**
- [ ] Backend API calls succeed
- [ ] Database connections work
- [ ] External API calls work (Pokemon, Scryfall, etc.)
- [ ] File uploads work (if applicable)

### ✅ **Payment Processing:**
- [ ] Stripe checkout works
- [ ] Webhook processing works
- [ ] Payment confirmations work

---

## 🚨 **Common Issues After Domain Change**

### Issue: "Invalid redirect_uri" errors
**Solution:** Update NextAuth configuration and OAuth provider settings

### Issue: CORS errors
**Solution:** Update backend CORS to include new domain

### Issue: Mixed content warnings
**Solution:** Ensure all resources load over HTTPS

### Issue: Stripe webhooks fail
**Solution:** Update webhook endpoints in Stripe dashboard

---

## 🔄 **Deployment Process After Domain Setup**

1. **Update environment variables** in Amplify console
2. **Trigger new deployment** (Amplify will automatically deploy when you update env vars)
3. **Test on new domain** immediately after deployment
4. **Monitor logs** for any errors
5. **Update DNS if needed** (usually handled by Amplify)

---

## 📞 **Support Resources**

### AWS Amplify Domain Setup:
- **Console:** https://console.aws.amazon.com/amplify/home/apps/d1ltdwo8ecgyoe/hosting/customdomain
- **Documentation:** https://docs.aws.amazon.com/amplify/latest/userguide/custom-domains.html

### Domain Status Check:
```powershell
# Check domain configuration
aws amplify get-domain-association --app-id d1ltdwo8ecgyoe --domain-name abditrade.com --profile admin
```

---

## 🎯 **Next Steps**

1. **Wait for domain setup** to complete in Amplify console
2. **Update environment variables** as soon as domain is active
3. **Test thoroughly** on the new domain
4. **Update external service configurations**
5. **Monitor for 24-48 hours** to ensure everything is stable

The custom domain setup usually takes 15-45 minutes, but DNS propagation can take up to 24 hours. Once it's ready, the environment variable updates are the most critical step!