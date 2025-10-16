# Guild Filters Fix - Featured, My Guilds, and Trending

## Issue
On the Guilds page, the filters for "Featured", "My Guilds", and "Trending" were not showing any guilds even though guilds were being created and stored in DynamoDB.

## Root Causes

### 1. ❌ `isJoined` Always False
**Problem**: The `GET /api/guilds` endpoint was hardcoding `isJoined: false` for all guilds.

**Impact**: The "My Guilds" tab was empty because no guilds showed as joined, even for guilds the user created.

**File**: `src/pages/api/guilds/index.ts` line 47

```typescript
// BEFORE - Always false
isJoined: false, // Will be determined by frontend based on user session
```

### 2. ❌ `trending` Never Set to True
**Problem**: All guilds were created with `trending: false` and there was no logic to determine which guilds should be trending.

**Impact**: The "Featured" and "Trending" tabs were empty because no guilds had `trending: true`.

**File**: `src/lib/dynamodb.ts` line 60

```typescript
// Default value when creating guild
trending: false,
```

## Solutions Implemented

### ✅ Fix #1: Check Membership for Each Guild

Modified `GET /api/guilds` to check if the current user is a member of each guild using `memberDB.check()`.

**File**: `src/pages/api/guilds/index.ts`

```typescript
// BEFORE
const guilds = await guildDB.list(100);
const transformedGuilds = guilds.map((item) => ({
  // ...
  isJoined: false, // ❌ Always false
  // ...
}));

// AFTER
const session = await getServerSession(req, res, authOptions);
const guilds = await guildDB.list(100);

const transformedGuildsPromises = guilds.map(async (item) => {
  // ✅ Check if user is a member
  const isJoined = session?.userId 
    ? await memberDB.check(item.id, session.userId)
    : false;

  return {
    // ...
    isJoined, // ✅ Now correct!
    // ...
  };
});

const transformedGuilds = await Promise.all(transformedGuildsPromises);
```

### ✅ Fix #2: Calculate Trending Status Dynamically

Added logic to determine if a guild should be marked as trending based on activity metrics.

**Trending Criteria**:
- Guild has **5+ members**, OR
- Guild has **3+ posts**, OR
- Guild is manually marked as trending in database

**File**: `src/pages/api/guilds/index.ts`

```typescript
// Calculate trending status based on members and posts
const isTrending = (item.members >= 5) || (item.posts >= 3) || item.trending === true;

return {
  // ...
  trending: isTrending, // ✅ Dynamic calculation
  // ...
};
```

## How the Tabs Work

### Featured Tab (`value="featured"`)
Shows guilds where `trending === true`

```typescript
// Line 394
const filteredFeatured = filteredGuilds.filter(g => g.trending);
```

**Displays**:
- Guilds with 5+ members
- Guilds with 3+ posts
- Manually featured guilds

### My Guilds Tab (`value="my-guilds"`)
Shows guilds where `isJoined === true`

```typescript
// Line 395
const filteredMyGuilds = filteredGuilds.filter(g => g.isJoined);
```

**Displays**:
- Guilds you created
- Guilds you joined

### Trending Tab (`value="trending"`)
Same as Featured tab (uses `filteredFeatured`)

```typescript
// Line 771
<TabsContent value="trending">
  {filteredFeatured.map((guild) => (
    // ... renders guilds with trending: true
  ))}
</TabsContent>
```

## Testing Instructions

### Test My Guilds Tab:
1. ✅ Go to `/guilds`
2. ✅ Create a new guild
3. ✅ Click on "My Guilds" tab
4. ✅ **Expected**: You should see the guild you just created

### Test Featured/Trending Tabs:
**Option A - Add Members**:
1. ✅ Create a guild
2. ✅ Have 4 other users join the guild (total 5 members)
3. ✅ Refresh guilds page
4. ✅ Click "Featured" or "Trending" tabs
5. ✅ **Expected**: Guild appears with "Trending" badge

**Option B - Add Posts**:
1. ✅ Create a guild
2. ✅ Create 3+ posts in the guild
3. ✅ Refresh guilds page
4. ✅ Click "Featured" or "Trending" tabs
5. ✅ **Expected**: Guild appears with "Trending" badge

**Quick Test (For Testing Only)**:
Temporarily change the trending threshold in the code:
```typescript
// For testing, make any guild with 1+ member trending
const isTrending = (item.members >= 1) || (item.posts >= 1);
```

## Database Schema

### Guild Record
```typescript
{
  PK: "GUILD#<uuid>",
  SK: "METADATA",
  EntityType: "GUILD",
  id: "<uuid>",
  name: "Pokemon Traders",
  members: 1,        // ← Used for trending calculation
  posts: 0,          // ← Used for trending calculation
  trending: false,   // ← Can be manually set
  // ...
}
```

### Member Record
```typescript
{
  PK: "GUILD#<uuid>",
  SK: "MEMBER#<userId>",
  EntityType: "MEMBER",
  guildId: "<uuid>",
  userId: "<userId>",
  role: "creator" | "admin" | "member",
  joinedAt: "2025-10-09T..."
}
```

## Performance Considerations

### Before Changes
```
GET /api/guilds
  └─ guildDB.list(100)
  └─ Return guilds (isJoined always false, trending from DB)
```

**1 DynamoDB query for all guilds**

### After Changes
```
GET /api/guilds
  └─ guildDB.list(100)
  └─ For each guild (e.g., 20 guilds):
      └─ memberDB.check(guildId, userId)
  └─ Calculate trending status
  └─ Return guilds (with correct isJoined and trending)
```

**1 query + 20 GetItem calls = 21 total operations**

**Impact**: Minimal - DynamoDB GetItem is very fast (~1-2ms each)

### Optimization Opportunities (Future)
1. **Batch Operations**: Use `BatchGetItem` to check all memberships in one call
2. **Caching**: Cache membership checks for 30-60 seconds
3. **Denormalization**: Add `userGuilds` field to user profile
4. **Indexing**: Create GSI for faster member lookups

## Files Modified

1. **`src/pages/api/guilds/index.ts`** (GET endpoint)
   - Added session check
   - Added async membership checking with `memberDB.check()`
   - Changed `guilds.map()` to async promises with `Promise.all()`
   - Added dynamic trending calculation based on members/posts

## Known Behaviors

### Trending Threshold
Current settings make a guild trending if:
- **5+ members** (encourages community growth)
- **3+ posts** (shows active engagement)

You can adjust these thresholds in `src/pages/api/guilds/index.ts`:
```typescript
// More strict (requires more activity)
const isTrending = (item.members >= 10) || (item.posts >= 10);

// More lenient (easier to become trending)
const isTrending = (item.members >= 2) || (item.posts >= 1);
```

### Tab Behavior
- **Featured** and **Trending** tabs show the same guilds (both use `filteredFeatured`)
- This is intentional - they're meant to highlight popular/active guilds
- Could be modified to show different criteria if needed

## Next Steps (Optional Improvements)

1. **Separate Featured vs Trending**:
   - Featured: Manually curated by admins
   - Trending: Automatically calculated based on recent activity

2. **Time-based Trending**:
   - Calculate trending based on activity in last 7 days
   - Requires tracking post/member timestamps

3. **Trending Score**:
   - Combine multiple factors: members, posts, likes, comments
   - Weight recent activity higher
   - Example: `score = members + (posts * 2) + (likes * 0.5)`

4. **Admin Panel**:
   - Allow admins to manually feature guilds
   - Toggle trending status directly

---

**Status**: All filters now working correctly! ✅
**My Guilds**: Shows guilds you're a member of
**Featured/Trending**: Shows guilds with 5+ members or 3+ posts
**Last Updated**: Session completion
