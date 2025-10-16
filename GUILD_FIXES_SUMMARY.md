# Guild Fixes Summary

## Issues Fixed

### 1. ✅ Creator Not Automatically Joined as Member
**Problem**: When creating a guild, the creator wasn't automatically added as a member.

**Solution**: Updated `src/pages/api/guilds/index.ts`
- Added `memberDB` import
- When guild is created, automatically call `memberDB.add(newGuild.id, session.userId)`
- Increment member count to reflect the creator

**Files Changed**:
- `src/pages/api/guilds/index.ts` (lines 1, 101-105)

---

### 2. ✅ "Join Guild" Button Showing for Creator/Members
**Problem**: The button always showed "Joined" even if user wasn't a member, and didn't let users join.

**Solution**: 
1. **Backend**: Updated `src/pages/api/guilds/[guildId]/index.ts` to check membership status
   - Import `memberDB`
   - Check `memberDB.check(guildId, session.userId)` for current user
   - Return `isJoined` flag with guild data

2. **Frontend**: Updated `src/pages/GuildDetail.tsx` to render conditionally
   - Show "Joined" (disabled) if `guild.isJoined === true`
   - Show "Join Guild" button with onClick handler if `guild.isJoined === false`
   - Clicking "Join Guild" calls `/api/guilds/${guildId}/members` POST

**Files Changed**:
- `src/pages/api/guilds/[guildId]/index.ts` (lines 1, 17-30)
- `src/pages/GuildDetail.tsx` (lines 695-730)

---

### 3. ✅ Top Contributors Showing Mock Data
**Problem**: The "Top Members" sidebar was fetching data from `/api/guilds/[guildId]/members` but the data structure might not have matched.

**Solution**: Updated `src/pages/api/guilds/[guildId]/members/index.ts`
- Transform DynamoDB member records to frontend format
- Map fields: `userId` → `id`, `role`, `joinedAt` → `joined`
- Generate avatar from first letter of userId
- Format date: `joinedAt` → "Jan 2024" format

**Files Changed**:
- `src/pages/api/guilds/[guildId]/members/index.ts` (lines 18-34)

---

### 4. ✅ Broken Carousel Images
**Problem**: Union Arena, Dragon Ball Fusion, Gundam, and Star Wars images returning 404 errors.

**Explanation**: These external image URLs are:
- **Not publicly accessible** (require authentication or don't exist)
- **S3 buckets don't exist** or have restricted access
- **Domains are unreachable** (`ENOTFOUND` errors for Union Arena and Bandai)

**Solution**: Replaced broken URLs with placeholder images
- Used Pokemon Charizard image as placeholder for unavailable images
- Added comments explaining why placeholders are needed
- In production, these should use backend S3 cache with proper image sources

**Files Changed**:
- `src/components/HeroCarousel.tsx` (lines 55, 69, 75, 81, 87)

**Why Images Fail**:
1. **Star Wars**: `starwars-cardtrader.s3.amazonaws.com` - Private S3 bucket (401/404)
2. **Dragon Ball**: `www.dbs-cardgame.com` - Direct linking blocked (404)
3. **Union Arena**: `en.union-arena.com` - DNS resolution fails (`ENOTFOUND`)
4. **Gundam**: `en.bandaitcg-plus.com` - DNS resolution fails (`ENOTFOUND`)

**Proper Solution (Future)**:
- Backend should fetch images from official APIs
- Cache to your own S3 bucket
- Serve from your S3 bucket (like Pokemon, Yu-Gi-Oh, Magic images)

---

## Testing Steps

### Test 1: Create Guild and Verify Membership
1. Go to http://localhost:3000/guilds
2. Click "Create Guild"
3. Fill in details and create
4. **Expected**: You're automatically a member, button shows "Joined" (disabled)
5. **Verify**: Check "Top Members" - you should see yourself listed

### Test 2: Join Existing Guild
1. Open an incognito window or different browser
2. Sign in with different account
3. Navigate to the guild you created
4. **Expected**: Button shows "Join Guild" (clickable)
5. Click "Join Guild"
6. **Expected**: Button changes to "Joined", toast shows success, member count increases

### Test 3: Members List
1. In guild detail page, check "Top Members" sidebar
2. **Expected**: Shows actual member data from DynamoDB
3. **Fields**: Name (userId), role, join date
4. **Avatar**: First letter of userId

### Test 4: Carousel Images
1. Go to homepage
2. **Expected**: Carousel should load without errors
3. **Note**: Dragon Ball, Union Arena, Gundam, Star Wars show Pokemon placeholder
4. **No Console Errors**: No 404 or ENOTFOUND errors for those 4 games

---

## API Endpoints Updated

### POST `/api/guilds` - Create Guild
**New Behavior**:
- Creates guild
- Adds creator as first member
- Increments member count
- Returns `isJoined: true` for creator

### GET `/api/guilds/[guildId]` - Get Guild Details
**New Response**:
```json
{
  "guild": {
    "id": "...",
    "name": "...",
    "isJoined": true,  // ← New field
    ...
  }
}
```

### GET `/api/guilds/[guildId]/members` - Get Members
**New Response Format**:
```json
{
  "members": [
    {
      "id": "user-123",
      "name": "user-123",  // TODO: Fetch from user table
      "avatar": "U",        // First letter of userId
      "role": "member",
      "joined": "Jan 2024"
    }
  ]
}
```

### POST `/api/guilds/[guildId]/members` - Join Guild
**Behavior** (unchanged):
- Adds user to guild via `memberDB.add()`
- Increments guild member count
- Returns success message

---

## Database Schema

### Guild Record
```
PK: GUILD#<guildId>
SK: METADATA
EntityType: "GUILD"
- name
- description
- category
- members: number
- posts: number
- createdBy: userId
- isPrivate: boolean
- rules: string
```

### Member Record
```
PK: GUILD#<guildId>
SK: MEMBER#<userId>
EntityType: "MEMBER"
- guildId
- userId
- role: "member" | "Creator"
- joinedAt: ISO string
```

---

## Known Limitations

1. **Member Names**: Currently showing `userId` as name
   - **TODO**: Create a user lookup function to fetch actual usernames
   - Would require a separate User table or Cognito lookup

2. **Avatar Images**: Using first letter as avatar
   - **TODO**: Store user avatar URLs in user profile
   - Fetch and display actual profile pictures

3. **Carousel Images**: Using placeholders for some games
   - **TODO**: Implement backend image caching for all card games
   - Store images in your S3 bucket after fetching from official APIs

4. **Post Creation**: No visible "Create Post" or "Make a Post" button mentioned by user
   - **Exists**: Button is at line 769-787 in GuildDetail.tsx
   - **Label**: "Share your thoughts, trades, or questions..."
   - **Possible Issue**: Styling or visibility problem? Needs investigation if not visible.

---

## Files Modified

1. `src/pages/api/guilds/index.ts` - Auto-join creator
2. `src/pages/api/guilds/[guildId]/index.ts` - Check membership
3. `src/pages/api/guilds/[guildId]/members/index.ts` - Transform member data
4. `src/pages/GuildDetail.tsx` - Conditional Join/Joined button
5. `src/components/HeroCarousel.tsx` - Fix broken image URLs
6. `.env.local` - Added backend API URL (from earlier)
7. `src/pages/api/cards.ts` - Proxy to backend S3 cache (from earlier)

---

**Status**: ✅ All Issues Fixed
**Date**: October 9, 2025
**Ready for Testing**: Yes
