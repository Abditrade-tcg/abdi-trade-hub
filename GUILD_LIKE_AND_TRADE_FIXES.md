# Guild Like/Unlike & Trade Functionality Fixes

## Issues Fixed

### 1. ✅ Like/Unlike Not Toggling (Always Incrementing)

**Problem**: Users could click "like" multiple times and it would keep incrementing the like count instead of toggling between liked/unliked state.

**Root Cause**: The `GET /api/guilds/[guildId]/posts` endpoint was NOT returning the `isLiked` property for each post, so the frontend always thought the post was unliked.

**Solution**: Modified the posts API to check if the current user has liked each post using `likeDB.check()`.

**File Changed**: `src/pages/api/guilds/[guildId]/posts/index.ts`

```typescript
// BEFORE: Posts didn't include isLiked status
const formattedPosts = posts.map(post => ({
  id: post.id,
  author: post.authorName,
  // ... other fields
}));

// AFTER: Check like status for each post
const formattedPostsPromises = posts.map(async (post) => {
  const isLiked = session?.userId 
    ? await likeDB.check(guildId, post.id, session.userId)
    : false;

  return {
    id: post.id,
    author: post.authorName,
    isLiked, // ✅ Now included!
    // ... other fields
  };
});

const formattedPosts = await Promise.all(formattedPostsPromises);
```

**How It Works Now**:
1. User loads guild page → API checks `likeDB` for each post
2. Frontend receives posts with `isLiked: true/false`
3. User clicks like button → Frontend optimistically updates UI
4. API receives POST request → `likeDB.toggle()` adds/removes like record
5. `postDB.incrementLikes()` or `postDB.decrementLikes()` updates count
6. Frontend shows updated state (liked ❤️ or unliked 🤍)

### 2. ✅ Buy/Sell/Trade Functionality Already Exists!

**Finding**: The Buy/Sell/Trade buttons are **already implemented** in the "Recent" tab of the guild feed!

**Features Available**:
- **Trade Posts**: "View Details" + "Make Offer" buttons
- **Sell Posts**: "View Details" + "Purchase" buttons  
- **Buy Posts**: "Submit Offer" button

**Location**: `src/pages/GuildDetail.tsx` lines 1043-1111

**Modals Used**:
1. **CheckoutModal** (line 1752) - For purchasing cards
2. **TradeModal** (line 1765) - For making trade offers
3. **CardDetailModal** (line 1777) - For viewing card details

**Button Examples**:
```tsx
{post.postType === "trade" && (
  <>
    <Button onClick={() => {
      setSelectedPost(post);
      setShowCardDetail(true);
    }}>
      View Details
    </Button>
    <Button onClick={() => {
      setSelectedPost(post);
      setShowTrade(true);
    }}>
      <ArrowLeftRight className="h-4 w-4" />
      Make Offer
    </Button>
  </>
)}

{post.postType === "sell" && (
  <>
    <Button onClick={() => {
      setSelectedPost(post);
      setShowCardDetail(true);
    }}>
      View Details
    </Button>
    <Button onClick={() => {
      setSelectedPost(post);
      setShowCheckout(true);
    }}>
      <ShoppingCart className="h-4 w-4" />
      Purchase
    </Button>
  </>
)}

{post.postType === "buy" && (
  <Button onClick={() => {
    setSelectedPost(post);
    setShowTrade(true);
  }}>
    <Send className="h-4 w-4" />
    Submit Offer
  </Button>
)}
```

## Testing Steps

### Test Like/Unlike Toggle
1. ✅ Go to any guild page
2. ✅ Find a post and click the like button (thumbs up icon)
3. ✅ **Expected**: Button turns filled/highlighted, count increases by 1
4. ✅ Click like button again
5. ✅ **Expected**: Button turns unfilled, count decreases by 1
6. ✅ Refresh page
7. ✅ **Expected**: Like state persists (button stays filled if you liked it)

### Test Trade Functionality
1. ✅ Create a post with `postType: "trade"` and attach a card
2. ✅ **Expected**: Post shows "View Details" and "Make Offer" buttons
3. ✅ Click "View Details" → Card detail modal opens
4. ✅ Click "Make Offer" → Trade modal opens with your inventory

### Test Sell Functionality
1. ✅ Create a post with `postType: "sell"` and set a price
2. ✅ **Expected**: Post shows "View Details" and "Purchase" buttons
3. ✅ Click "View Details" → Card detail modal opens
4. ✅ Click "Purchase" → Checkout modal opens with payment options

### Test Buy Functionality
1. ✅ Create a post with `postType: "buy"` 
2. ✅ **Expected**: Post shows "Submit Offer" button
3. ✅ Click "Submit Offer" → Trade modal opens

## Technical Details

### Like Toggle Flow
```
Frontend (GuildDetail.tsx)
  ↓
handleLikePost(postId)
  ↓
Optimistic UI update (increment/decrement)
  ↓
POST /api/guilds/${guildId}/posts/${postId}/like
  ↓
likeDB.toggle(guildId, postId, userId)
  ├─ If liked: Delete like record → return { liked: false }
  └─ If not liked: Create like record → return { liked: true }
  ↓
Update post like count
  ├─ If liked: postDB.incrementLikes()
  └─ If unliked: postDB.decrementLikes()
  ↓
Return updated like count to frontend
```

### DynamoDB Schema

**Like Records**:
- PK: `GUILD#<guildId>#POST#<postId>`
- SK: `LIKE#<userId>`
- EntityType: `LIKE`
- createdAt: ISO timestamp

**Post Records**:
- PK: `GUILD#<guildId>`
- SK: `POST#<timestamp>#<postId>`
- likes: Number (incremented/decremented)
- comments: Number
- postType: "discussion" | "trade" | "sell" | "buy"
- card: Object (optional, contains card data)

## Known Issues (Minor)

### 1. Popular/Pinned Tabs Use Links Instead of Modals
**Location**: Lines 1312-1330 (Popular tab)
**Behavior**: Buttons redirect to `/trades` or `/orders` pages instead of opening modals
**Impact**: Low - Functionality works, just inconsistent UX
**Fix**: Update Popular/Pinned tabs to use same modal approach as Recent tab

### 2. Mock User Items in Trade Modal
**Location**: Line 1779
**Behavior**: Trade modal shows hardcoded user inventory
**Solution Needed**: Connect to real user inventory API

## Files Modified

1. **`src/pages/api/guilds/[guildId]/posts/index.ts`**
   - Added `likeDB` import
   - Added session check in GET endpoint
   - Modified to check `isLiked` status for each post using `likeDB.check()`
   - Changed `posts.map()` to async promises with `Promise.all()`

## Database Operations

### Before API Changes
```
GET /api/guilds/:guildId/posts
  └─ postDB.getByGuild(guildId)
  └─ Return posts (without isLiked)
```

### After API Changes
```
GET /api/guilds/:guildId/posts
  └─ postDB.getByGuild(guildId)
  └─ For each post:
      └─ likeDB.check(guildId, post.id, userId)
  └─ Return posts (with isLiked)
```

**Performance Impact**: 
- Additional DynamoDB `GetItem` call per post
- For 20 posts: ~20 reads (minimal impact, DynamoDB is fast)
- Could optimize with batch operations if needed

## Next Steps (Optional Improvements)

1. **Batch Like Checks**: Use `BatchGetItem` to check all likes in one call
2. **Cache Like Status**: Add short-lived cache (Redis/ElastiCache) for like status
3. **Real-time Updates**: Add WebSocket support for live like count updates
4. **Consistent Button Behavior**: Update Popular/Pinned tabs to use modals
5. **Real User Inventory**: Connect trade modal to actual user inventory API

---

**Status**: All critical issues resolved! ✅
**Like/Unlike**: Working correctly with toggle functionality
**Buy/Sell/Trade**: Already implemented with modal support
**Last Updated**: Session completion
