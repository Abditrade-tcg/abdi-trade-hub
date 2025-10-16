# Guild Post Creation - Testing Guide

## Issue
The guild detail page shows a simple post input instead of the enhanced modal with post type selection.

## What Should Happen

When you click **"Share your thoughts, trades, or questions..."** button:
1. A modal dialog should open
2. Modal should have 4 sections:
   - **Post Type** dropdown (Discussion, Trade, Buy, Sell)
   - **Card Selection** (if Trade/Buy/Sell selected)
   - **Message** textarea
   - **Cancel/Post** buttons

## Testing Steps

1. **Clear Browser Cache**:
   - Press `Ctrl + Shift + Delete`
   - Clear cached images and files
   - Or do a hard refresh: `Ctrl + F5`

2. **Check Browser Console**:
   - Press `F12` to open DevTools
   - Look for any JavaScript errors
   - Check if Dialog component is rendering

3. **Verify Modal Opens**:
   - Click the "Share your thoughts..." button
   - Modal should appear with title "Create a Post"
   - You should see the Post Type dropdown at the top

4. **Test Post Types**:
   - Select "Discussion" - Should only show message textarea
   - Select "Trade" - Should show card search + message
   - Select "Buy" - Should show card search + message  
   - Select "Sell" - Should show card search + message

5. **Test Card Search** (for Trade/Buy/Sell):
   - Type a card name in search box
   - Results should appear below
   - Click a card to select it
   - Selected card should show with preview image

## If Still Not Working

The modal code is at lines 818-958 in `guildDetail.tsx`:
- Check if `showPostModal` state is being set to `true`
- Check if Dialog component from `@/components/ui/dialog` is working
- Check if there are any z-index or CSS issues hiding the modal

## Expected UI Structure

```
[Avatar] [Button: "Share your thoughts, trades, or questions..."]
                    ↓ (click)
┌─────────────────────────────────────────────┐
│ Create a Post                          [X]  │
├─────────────────────────────────────────────┤
│ Post Type: [Discussion ▼]                  │
│                                             │
│ Message:                                    │
│ ┌─────────────────────────────────────────┐│
│ │ What's on your mind?                    ││
│ │                                         ││
│ └─────────────────────────────────────────┘│
│                                             │
│              [Cancel]  [📤 Post]            │
└─────────────────────────────────────────────┘
```

## Quick Fix Commands

If the dev server needs restart:
```powershell
# Kill server
taskkill /f /im node.exe

# Clear Next.js cache  
Remove-Item -Recurse -Force .\.next\*

# Restart
npm run dev
```

Then hard refresh the browser: `Ctrl + F5`
