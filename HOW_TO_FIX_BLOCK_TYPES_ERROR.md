# 🔧 How to Fix "blocks_type_check" Constraint Error

## 🚨 Problem

When trying to create AI Chat, Button, or Social Links blocks, you see this error:

```
new row for relation "blocks" violates check constraint "blocks_type_check"
```

## 🔍 Root Cause

The database `blocks` table has a CHECK constraint that only allows these block types:
- `'link'`
- `'text'`
- `'image'`
- `'embed'`
- `'video'`
- `'social'`

But the application is trying to create blocks with these NEW types:
- `'button'` ❌ (not allowed)
- `'social_links'` ❌ (not allowed)
- `'ai_chat'` ❌ (not allowed)

## ✅ Solution: Update Database Constraint

You need to run a SQL migration to update the constraint in your Supabase database.

---

## 📋 Step-by-Step Fix

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Click **"SQL Editor"** in the left sidebar
4. Click **"New Query"**

### Step 2: Copy and Run the Fix SQL

Copy this entire SQL script and paste it into the SQL Editor:

```sql
-- ============================================================================
-- FIX: Add Missing Block Types to Database
-- ============================================================================

-- Step 1: Drop the old constraint
ALTER TABLE public.blocks DROP CONSTRAINT IF EXISTS blocks_type_check;

-- Step 2: Add new constraint with all block types
ALTER TABLE public.blocks 
ADD CONSTRAINT blocks_type_check 
CHECK (type IN (
  'link',         -- Link buttons (original)
  'text',         -- Text content (original)
  'image',        -- Images (original)
  'embed',        -- Embeds (original)
  'video',        -- Videos (original)
  'social',       -- Social links (original)
  'button',       -- Button links (NEW)
  'social_links', -- Social links grid (NEW)
  'ai_chat'       -- AI Chat widget (NEW)
));

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Block type constraint updated successfully!';
  RAISE NOTICE '🎉 You can now create blocks with all types!';
END $$;
```

### Step 3: Click "Run"

Click the **"Run"** button in the SQL Editor.

You should see a success message:
```
✅ Block type constraint updated successfully!
🎉 You can now create blocks with all types!
```

### Step 4: Verify the Fix

Run this verification query to confirm the constraint was updated:

```sql
SELECT 
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.blocks'::regclass
  AND conname = 'blocks_type_check';
```

You should see the new constraint with all 9 block types listed.

### Step 5: Test Creating Blocks

1. Go back to your Vario platform
2. Navigate to `/dashboard/blocks`
3. Try creating an **AI Chat** block
4. Fill out the form and click **"Create AI Chat Block"**
5. ✅ It should work now!

---

## 🎯 Alternative: Use the Pre-Made SQL File

We've created a file called `FIX_BLOCK_TYPES.sql` in your project:

```bash
/home/user/bento-clone/FIX_BLOCK_TYPES.sql
```

You can:
1. Open this file
2. Copy all the SQL code
3. Paste it into Supabase SQL Editor
4. Click "Run"

---

## 🔄 If You're Using Local Supabase

If you're running Supabase locally with Docker, you can run the migration directly:

```bash
cd /home/user/bento-clone
supabase migration new add_new_block_types
# Copy the SQL from FIX_BLOCK_TYPES.sql into the new migration file
supabase db reset
```

---

## 📊 What This Fix Does

### Before Fix
```sql
CHECK (type IN ('link', 'text', 'image', 'embed', 'video', 'social'))
```
❌ Only 6 block types allowed

### After Fix
```sql
CHECK (type IN (
  'link', 'text', 'image', 'embed', 'video', 'social',
  'button', 'social_links', 'ai_chat'
))
```
✅ Now 9 block types allowed

---

## 🧪 Testing After Fix

After running the SQL migration, test each block type:

1. **Text Block** ✅ (should work - was working before)
2. **Image Block** ✅ (should work - was working before)
3. **Button Link** ✅ (should work NOW)
4. **Social Links** ✅ (should work NOW)
5. **Embed** ✅ (should work - was working before)
6. **AI Chat** ✅ (should work NOW)

---

## 🚨 Common Issues

### Issue 1: "permission denied for table blocks"
**Solution**: Make sure you're running the SQL as the database owner or with proper permissions.

### Issue 2: "constraint does not exist"
**Solution**: The constraint might have a different name. Run this to find it:
```sql
SELECT conname FROM pg_constraint 
WHERE conrelid = 'public.blocks'::regclass;
```

### Issue 3: Still getting the error after running SQL
**Solution**: 
1. Clear your browser cache
2. Refresh the page
3. Try creating the block again
4. If still failing, verify the constraint was updated (see Step 4)

---

## 📞 Need Help?

If you're still having issues:

1. **Check Supabase Logs**: Look at the database logs for detailed error messages
2. **Verify Constraint**: Run the verification query from Step 4
3. **Check Permissions**: Ensure RLS policies allow block creation
4. **Clear Cache**: Browser cache and Supabase cache

---

## 🎉 Success!

Once the fix is applied, you should be able to:
- ✅ Create AI Chat blocks
- ✅ Create Button Link blocks  
- ✅ Create Social Links blocks
- ✅ See all blocks on your public profile page
- ✅ No more constraint errors!

---

**File Locations**:
- SQL Migration: `/home/user/bento-clone/supabase/migrations/20240114000000_add_new_block_types.sql`
- Quick Fix SQL: `/home/user/bento-clone/FIX_BLOCK_TYPES.sql`
- This Guide: `/home/user/bento-clone/HOW_TO_FIX_BLOCK_TYPES_ERROR.md`

**Last Updated**: December 14, 2025
