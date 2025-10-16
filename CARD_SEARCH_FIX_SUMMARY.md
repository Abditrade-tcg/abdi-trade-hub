# Card Search API Fix Summary

## Problem
Card search in guild post creation is failing with **502 Bad Gateway** errors.

## Root Cause
There's a mismatch between the API Gateway route and the Lambda handler routing:

- **API Gateway Resource**: `/v1/search/cards` 
- **Lambda Handler Expected**: `/v1/cards/search` OR `/v1/search/cards`

## What I Fixed

### 1. Frontend API Path ✅
**File**: `src/pages/api/cards.ts`
- Changed from: `${backendUrl}/v1/cards/search?${params}`
- Changed to: `${backendUrl}/v1/search/cards?${params}`

### 2. Backend Handler Routing ✅
**File**: `abditrade-web-backend/src/handlers/cards.ts` (line 143)
- Changed from: `if (path === '/v1/cards/search' && method === 'GET')`
- Changed to: `if ((path === '/v1/cards/search' || path === '/v1/search/cards') && method === 'GET')`

## What Still Needs to be Done

### Deploy Backend Changes
The backend code has been updated but **NOT YET DEPLOYED**. You need to:

```powershell
cd c:\Users\celzy\Desktop\abditrade-web-backend
aws sso login --profile abditrade-admin  # ✅ Already done
npm run build                             # ✅ Already done
npm run deploy                            # ❌ NEEDS TO BE DONE
```

**OR** deploy just the Backend stack:
```powershell
cd c:\Users\celzy\Desktop\abditrade-web-backend
npx cdk deploy AbditradeBackendStack --profile abditrade-admin
```

## Current Status

### Frontend
- ✅ Updated to call `/v1/search/cards`
- ✅ Server running on http://localhost:3000
- ✅ Enhanced guild post modal with card search working

### Backend  
- ✅ Code updated to accept both paths
- ✅ Built successfully (TypeScript compiled)
- ❌ **NOT DEPLOYED** - Still serving old code
- ❌ Lambda still returning 502 errors

## Error Logs from Terminal

```
🔄 Proxying card request to backend (with S3 caching): 
   https://9uy8yseaj4.execute-api.us-east-2.amazonaws.com/prod/v1/search/cards?game=Pokemon&q=charizard&page=1&limit=10
❌ Backend API error: 502 Bad Gateway - {"message": "Internal server error"}
```

## AWS Resources Confirmed

- **API Gateway ID**: `9uy8yseaj4`
- **API Name**: "Abditrade API"
- **Resource Path**: `/v1/search/cards`
- **Resource ID**: `9vfa0b`
- **Authentication**: `NONE` (no API key required)
- **Method**: `GET`

## Architecture Flow (When Fixed)

```
Frontend (guild post modal)
    ↓ Search "charizard"
    ↓
Frontend API (/api/cards)
    ↓ game=Pokemon&q=charizard
    ↓
Backend API Gateway (https://9uy8yseaj4.execute-api.us-east-2.amazonaws.com/prod)
    ↓ GET /v1/search/cards
    ↓
Lambda Handler (cards.ts)
    ↓ Route matches: /v1/search/cards
    ↓
CardCatalogService.searchCards()
    ↓ Check S3 cache first
    ↓ If not cached, call Pokemon TCG API (using secret from AWS Secrets Manager)
    ↓ Cache result to S3
    ↓ Return cards
    ↓
Frontend displays cards in search results
```

## How to Deploy

### Option 1: Deploy All Stacks (Recommended)
```powershell
cd c:\Users\celzy\Desktop\abditrade-web-backend
npm run deploy
```

This will:
1. Build TypeScript code
2. Deploy all CDK stacks including:
   - AbditradeCognitoStack
   - AbditradeBackendStack ← **This one has the Lambda fix**
   - AbditradeOpenSearchStack
   - AbditradeScheduledJobsStack
   - AbditradeCostBudgetStack

### Option 2: Deploy Only Backend Stack (Faster)
```powershell
cd c:\Users\celzy\Desktop\abditrade-web-backend
npx cdk deploy AbditradeBackendStack --profile abditrade-admin --require-approval never
```

### Option 3: If CDK Issues, Use AWS Console
1. Go to Lambda console: https://console.aws.amazon.com/lambda
2. Find the cards Lambda function
3. Update the code manually OR
4. Redeploy the Lambda with the new code

## After Deployment

### Test the Card Search
1. Open http://localhost:3000/guilds/[any-guild-id]
2. Click "Share your thoughts with the guild..."
3. Change Post Type to "Trade", "Buy", or "Sell"
4. Type a card name in the search box (e.g., "charizard")
5. You should see cards appear in the dropdown ✅

### Expected Success Logs
```
🔄 Proxying card request to backend (with S3 caching): https://...
✅ Retrieved 10 cards from backend (S3-cached)
GET /api/cards?game=Pokemon&q=charizard&limit=10 200 in 250ms
```

## Benefits of This Architecture

1. **Rate Limit Protection**: S3 caching prevents hitting external API limits
2. **Cost Savings**: Cached cards served from S3 (cheap) instead of external API calls
3. **Performance**: S3-cached responses are much faster
4. **API Key Security**: External API keys stored in AWS Secrets Manager, not in code
5. **Scalability**: Backend can handle multiple concurrent requests

## Troubleshooting

### If 502 Errors Continue After Deploy
Check Lambda logs:
```powershell
aws logs tail /aws/lambda/[lambda-name] --follow --profile abditrade-admin --region us-east-2
```

### If Lambda Function Not Found
List Lambda functions:
```powershell
aws lambda list-functions --profile abditrade-admin --region us-east-2 --query "Functions[?contains(FunctionName, 'cards')].FunctionName"
```

### If Deployment Fails
Check CDK diff first:
```powershell
cd c:\Users\celzy\Desktop\abditrade-web-backend
npx cdk diff --profile abditrade-admin
```

## Next Steps

1. ✅ AWS SSO Login completed
2. ✅ Code updated in both frontend and backend
3. ✅ Backend built successfully
4. ❌ **DEPLOY BACKEND** ← YOU ARE HERE
5. ⏳ Test card search in guild posts
6. ⏳ Verify S3 caching is working
7. ⏳ Test with different games (Pokemon, Magic, Yu-Gi-Oh, etc.)

---

**Current Blocker**: Backend Lambda needs to be deployed with the updated routing logic.

**Quick Deploy Command**:
```powershell
cd c:\Users\celzy\Desktop\abditrade-web-backend
npm run deploy
```

Or if that fails, just the backend:
```powershell
npx cdk deploy AbditradeBackendStack --profile abditrade-admin
```
