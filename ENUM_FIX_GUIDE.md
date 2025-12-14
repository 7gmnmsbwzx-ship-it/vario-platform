## 🔧 How to Fix the ENUM Block Type Error

## 🚨 The Error You're Seeing

```
Error: Failed to run sql query: 
ERROR: 22P02: invalid input value for enum block_type: "link"
```

OR

```
new row for relation "blocks" violates check constraint "blocks_type_check"
```

---

## 🔍 What's Happening

Your database has a `block_type` **ENUM** (not a TEXT field), and it's missing the new block types that your application needs.

### Database Has (OLD):
```
'link', 'text', 'image', 'embed', 'video', 'social'
```

### App Needs (NEW):
```
'text', 'image', 'button', 'social_links', 'embed', 'ai_chat'
```

### Missing Types:
- ❌ `button`
- ❌ `social_links`
- ❌ `ai_chat`

---

## ✅ THE FIX (Copy-Paste This SQL!)

### Open Supabase SQL Editor and Run This:

```sql
-- Add new enum values to block_type
DO $$
BEGIN
  -- Add 'button'
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumtypid = 'block_type'::regtype 
    AND enumlabel = 'button'
  ) THEN
    ALTER TYPE block_type ADD VALUE IF NOT EXISTS 'button';
  END IF;

  -- Add 'social_links'
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumtypid = 'block_type'::regtype 
    AND enumlabel = 'social_links'
  ) THEN
    ALTER TYPE block_type ADD VALUE IF NOT EXISTS 'social_links';
  END IF;

  -- Add 'ai_chat'
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumtypid = 'block_type'::regtype 
    AND enumlabel = 'ai_chat'
  ) THEN
    ALTER TYPE block_type ADD VALUE IF NOT EXISTS 'ai_chat';
  END IF;
END $$;

-- Verify it worked
SELECT enumlabel as block_types
FROM pg_enum 
WHERE enumtypid = 'block_type'::regtype 
ORDER BY enumsortorder;
```

---

## 📋 Step-by-Step Instructions

### 1. Open Supabase Dashboard
Go to: https://supabase.com/dashboard

### 2. Select Your Project
Click on your Vario project

### 3. Open SQL Editor
- Click **"SQL Editor"** in the left sidebar
- Click **"New Query"**

### 4. Paste the SQL Above
Copy the entire SQL block from the "THE FIX" section above

### 5. Click "Run"
Click the green **"Run"** button

### 6. Check the Results
You should see output showing all block types including the 3 new ones:
```
block_types
-----------
link
text
image
embed
video
social
button        ← NEW!
social_links  ← NEW!
ai_chat       ← NEW!
```

### 7. Test Creating Blocks
Go back to your app:
- Navigate to `/dashboard/blocks`
- Try creating an **AI Chat** block
- Fill out the form
- Click "Create AI Chat Block"
- ✅ Success! No more errors!

---

## 🎯 Alternative: Use the Complete SQL File

We've created a comprehensive SQL file that:
- Detects your current setup automatically
- Shows you current values
- Adds missing values
- Shows you final values
- Gives clear success messages

**File**: `/home/user/bento-clone/FIX_ENUM_FINAL.sql`

**How to use**:
1. Open the file
2. Copy ALL the contents
3. Paste into Supabase SQL Editor
4. Click "Run"
5. Read the detailed output

---

## 🧪 Verify the Fix Worked

### Query 1: Check Enum Values
```sql
SELECT enumlabel 
FROM pg_enum 
WHERE enumtypid = 'block_type'::regtype 
ORDER BY enumsortorder;
```

**Expected Result**: You should see at least these 9 values:
- link
- text
- image
- embed
- video
- social
- button ✨
- social_links ✨
- ai_chat ✨

### Query 2: Test Insert (Optional)
```sql
-- Replace YOUR_USER_ID with your actual UUID
INSERT INTO public.blocks (user_id, type, content, order_index)
VALUES (
  'YOUR_USER_ID'::uuid,
  'ai_chat',
  '{"title": "Test", "description": "Test"}'::jsonb,
  9999
);

-- If successful, clean up:
DELETE FROM public.blocks WHERE order_index = 9999;
```

---

## ⚠️ Important Notes

### About PostgreSQL ENUMs

1. **Can't Remove Values**: Once you add an ENUM value, you can't remove it (PostgreSQL limitation)
2. **Order Matters**: New values are added at the end
3. **Safe to Add**: Adding values doesn't affect existing data
4. **No Downtime**: This operation is instant and non-blocking

### About Your Data

- ✅ **No data loss**: Existing blocks are unaffected
- ✅ **Backwards compatible**: Old block types still work
- ✅ **Instant**: Takes milliseconds to run
- ✅ **Safe**: Can run multiple times (idempotent)

---

## 🐛 Troubleshooting

### Error: "type block_type does not exist"

**Cause**: Your database uses TEXT with CHECK constraint, not ENUM.

**Solution**: Use `FIX_BLOCK_TYPES.sql` instead:
```sql
ALTER TABLE public.blocks DROP CONSTRAINT IF EXISTS blocks_type_check;

ALTER TABLE public.blocks 
ADD CONSTRAINT blocks_type_check 
CHECK (type IN (
  'link', 'text', 'image', 'embed', 'video', 'social',
  'button', 'social_links', 'ai_chat'
));
```

### Error: "permission denied"

**Cause**: Insufficient database permissions.

**Solution**: 
1. Make sure you're logged into the Supabase dashboard as the project owner
2. Or, run the SQL as a database superuser

### Still Getting Errors?

1. **Clear browser cache**: Hard refresh (Ctrl+Shift+R)
2. **Verify the fix**: Run the verification queries above
3. **Check application code**: Make sure you're using the correct type names
4. **Check Supabase logs**: Look for detailed error messages

---

## 📁 Related Files

- **Quick Fix**: `/home/user/bento-clone/FIX_ENUM_FINAL.sql` ⭐ (Recommended)
- **Complete Fix**: `/home/user/bento-clone/FIX_BLOCK_TYPES_COMPLETE.sql`
- **Enum Only**: `/home/user/bento-clone/FIX_BLOCK_TYPES_ENUM.sql`
- **Check Constraint**: `/home/user/bento-clone/FIX_BLOCK_TYPES.sql`

---

## ✅ Success Checklist

After running the fix:

- [ ] SQL executed without errors
- [ ] Verification query shows all 9 block types
- [ ] Can create Text blocks ✅
- [ ] Can create Image blocks ✅
- [ ] Can create Button blocks ✅ (NEW)
- [ ] Can create Social Links blocks ✅ (NEW)
- [ ] Can create Embed blocks ✅
- [ ] Can create AI Chat blocks ✅ (NEW)
- [ ] Blocks appear on public profile immediately
- [ ] No console errors in browser

---

## 🎉 You're Done!

Once the SQL runs successfully, you can:
1. Create all 6 block types without errors
2. See them immediately on your public profile
3. Build your beautiful Vario page!

---

**Created**: December 14, 2025  
**Status**: ✅ Ready to Use  
**Time to Fix**: ~2 minutes  
**Difficulty**: Easy (copy-paste-run)
