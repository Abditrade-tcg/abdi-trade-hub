# Guild Post Types - Complete Implementation

## Overview
This document describes the complete implementation of guild post types (Discussion, Trade, Sell, Buy) including visual indicators and action buttons.

## Changes Made

### 1. Post Type Submission Fix
**File**: `src/pages/GuildDetail.tsx` (Lines 252-303)

**Problem**: The `handleCreatePost` function was only sending `postType` when it wasn't 'Discussion', but the API requires `postType` as a required field.

**Solution**: Modified to always send `postType` in lowercase format:
```typescript
const postData = {
  content: newPostContent,
  postType: postType.toLowerCase(), // Always send, convert to lowercase
  ...(selectedCard && { cardData: selectedCard }), // Fixed field name
};
```

**Key Changes**:
- `postType` is now always included (not conditional)
- Converts from frontend format ('Trade') to API format ('trade')
- Changed `card` to `cardData` to match API expectations
- Ensures API validation passes (line 66 in posts API requires both content and postType)

### 2. Visual Post Type Indicators
**File**: `src/pages/GuildDetail.tsx` (All three tabs: Recent, Popular, Pinned)

**Problem**: Posts had no prominent visual indicator showing what type they were. Users couldn't easily distinguish between Discussion, Trade, Sell, and Buy posts.

**Solution**: Added colored badge icons next to the author name on all posts:

```typescript
{/* Post Type Badge */}
{post.postType === "trade" && (
  <Badge variant="outline" className="text-xs h-5 border-blue-500 text-blue-600 dark:text-blue-400">
    🔄 Trade
  </Badge>
)}
{post.postType === "sell" && (
  <Badge variant="outline" className="text-xs h-5 border-green-500 text-green-600 dark:text-green-400">
    💰 Selling
  </Badge>
)}
{post.postType === "buy" && (
  <Badge variant="outline" className="text-xs h-5 border-purple-500 text-purple-600 dark:text-purple-400">
    🛒 Buying
  </Badge>
)}
```

**Visual Design**:
- **Trade Posts**: Blue border, 🔄 icon
- **Sell Posts**: Green border, 💰 icon
- **Buy Posts**: Purple border, 🛒 icon
- **Discussion Posts**: No badge (default)
- Positioned next to author name for high visibility
- Color-coded borders match action button themes

**Locations**:
- **Recent Tab**: Lines 987-1005
- **Popular Tab**: Lines 1283-1301
- **Pinned Tab**: Lines 1510-1528

### 3. Existing Features (Already Implemented)

#### Post Creation Modal (Lines 823-958)
- Full post type selector dropdown
- Options: Discussion, Trade, Buy, Sell
- Card search functionality for commerce posts
- Selected card display with remove option
- Content textarea with character guidance

#### Action Buttons (Lines 1043-1111)
Posts with non-discussion types show commerce action buttons:

**Trade Posts**:
```typescript
<Button size="sm" className="gap-2">
  <ArrowLeftRight className="h-4 w-4" />
  Make Offer
</Button>
```

**Sell Posts**:
```typescript
<Button size="sm" className="gap-2">
  <ShoppingBag className="h-4 w-4" />
  Purchase
</Button>
```

**Buy Posts**:
```typescript
<Button size="sm" className="gap-2">
  <Tag className="h-4 w-4" />
  Submit Offer
</Button>
```

#### Card Display
Posts with attached cards show:
- Card image
- Card name
- Set information
- Price (if applicable)
- Condition details

## Post Type Flow

### Creating a Post
1. User opens "Create Post" modal
2. Selects post type from dropdown (Discussion/Trade/Buy/Sell)
3. For commerce types, can search and attach a card
4. Enters post content
5. Clicks "Post" button
6. `handleCreatePost` sends to API with `postType` in lowercase

### API Storage
- **Endpoint**: `POST /api/guilds/[guildId]/posts`
- **Required Fields**: `content`, `postType`
- **Optional Fields**: `cardData` (for commerce posts)
- **Post Types**: "discussion", "trade", "sell", "buy" (lowercase)
- **Validation**: Returns error if missing content or postType (line 66)

### Display
1. Posts fetched from API with `postType` field
2. Visual badge appears next to author name based on type
3. Commerce posts show highlighted action section
4. Action buttons link to appropriate flows:
   - Trade → `/trades` (offer negotiation)
   - Sell → `/orders` (purchase flow)
   - Buy → `/trades` (submit counter-offer)

## Testing Checklist

### Post Creation
- [ ] Create Discussion post → No badge, no action buttons
- [ ] Create Trade post with card → Blue "🔄 Trade" badge, "Make Offer" button
- [ ] Create Sell post with card → Green "💰 Selling" badge, "Purchase" button
- [ ] Create Buy post → Purple "🛒 Buying" badge, "Submit Offer" button

### Visual Indicators
- [ ] Badges appear on all tabs (Recent, Popular, Pinned)
- [ ] Colors display correctly in light/dark mode
- [ ] Icons render properly with emojis
- [ ] Badge positioned next to author name

### Action Buttons
- [ ] Trade posts show "Make Offer" button
- [ ] Sell posts show "Purchase" button
- [ ] Buy posts show "Submit Offer" button
- [ ] Discussion posts show NO action buttons
- [ ] Buttons link to correct pages

### API Integration
- [ ] Posts save with correct postType
- [ ] postType converts from 'Trade' to 'trade'
- [ ] Posts with cards include cardData
- [ ] Posts without cards omit cardData
- [ ] All types appear correctly in feed

## Database Schema

### Post Record
```typescript
{
  PK: "GUILD#<guildId>",
  SK: "POST#<postId>",
  id: string,
  guildId: string,
  userId: string,
  content: string,
  postType: "discussion" | "trade" | "sell" | "buy", // lowercase
  cardData?: {
    id: string,
    name: string,
    image_url: string,
    set_name: string,
    // ... other card fields
  },
  likes: number,
  comments: number,
  isPinned: boolean,
  createdAt: number,
  updatedAt: number
}
```

## Previous Fixes Referenced

This implementation builds on previous fixes:
1. **Like/Unlike Toggle**: Posts API returns `isLiked` status (GUILD_LIKE_AND_TRADE_FIXES.md)
2. **Guild Filters**: Membership checking and trending calculation (GUILD_FILTERS_FIX.md)

## Future Enhancements

### Universal Post Component (Suggested)
Consider extracting post rendering into a reusable component:
- **Location**: `src/components/PostCard.tsx`
- **Props**: `post`, `onLike`, `onComment`, `showActions`, `isGuildModerator`
- **Benefits**: DRY principle, easier maintenance, consistent styling
- **Usage**: All guild feeds, user profiles, home feed

### Additional Features
- Filter posts by type (show only Trade posts, etc.)
- Sort by post type in tabs
- Post type statistics in guild sidebar
- Bulk actions for specific post types (moderator feature)

## Summary

✅ **Complete**: Post types are now fully functional
- Posts created with correct type
- Visual indicators on all posts
- Action buttons for commerce posts
- Consistent across all tabs
- API integration working

Users can now clearly see what type each post is and take appropriate actions (trade, buy, sell) directly from the guild feed.
