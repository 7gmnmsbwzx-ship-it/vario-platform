# 🗄️ Supabase Database Setup Guide

## Step 1: Access Supabase SQL Editor

1. Go to **[https://supabase.com](https://supabase.com)**
2. Sign in to your account
3. Open your project: **`ifhmmsxrbrqsclfnevfx`**
4. Click **"SQL Editor"** in the left sidebar

---

## Step 2: Run Database Schema

### Method A: Copy and Paste (Recommended)

1. In the SQL Editor, create a **New Query**
2. Copy the ENTIRE contents of `/home/user/bento-clone/supabase/schema.sql` (343 lines)
3. Paste into the SQL Editor
4. Click **"Run"** button (or press Ctrl/Cmd + Enter)
5. Wait for completion (should take 5-10 seconds)

### Method B: Upload File

1. Click the **"..."** menu in SQL Editor
2. Select **"Import SQL"**
3. Upload the `schema.sql` file from your computer
4. Click **"Run"**

---

## Step 3: Verify Tables Created

After running the schema, verify these tables exist:

Go to **"Table Editor"** in the left sidebar. You should see:

- ✅ `users_profile` - User profiles and settings
- ✅ `blocks` - Content blocks (links, text, images, etc.)
- ✅ `themes` - Theme configurations (5 default themes)
- ✅ `page_analytics` - Page views and click tracking
- ✅ `ai_conversations` - AI chat conversations

---

## Step 4: Create Storage Buckets

### Create "avatars" bucket:
1. Click **"Storage"** in left sidebar
2. Click **"New bucket"**
3. **Bucket name**: `avatars`
4. **Public bucket**: ✅ Check this box
5. Click **"Create bucket"**

### Create "block-images" bucket:
1. Click **"New bucket"** again
2. **Bucket name**: `block-images`
3. **Public bucket**: ✅ Check this box
4. Click **"Create bucket"**

---

## Step 5: Verify Everything is Set Up

### Check Tables:
```sql
-- Run this in SQL Editor to verify tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Expected output:
- ai_conversations
- blocks
- page_analytics
- themes
- users_profile

### Check Themes:
```sql
-- Verify 5 default themes were inserted
SELECT id, name, is_premium FROM themes;
```

Expected output:
- minimal | Minimal | false
- gradient | Gradient | false
- dark | Dark | false
- warm | Warm | false
- ocean | Ocean | false

### Check RLS Policies:
```sql
-- Verify Row Level Security is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN ('users_profile', 'blocks', 'themes', 'page_analytics', 'ai_conversations');
```

All should show `true` for `rowsecurity`.

---

## Step 6: Test Authentication

Now your database is ready! Test by creating an account:

1. Go to your app: [https://3000-iym6gdsyrgvh7nix90lk8-cbeee0f9.sandbox.novita.ai/signup](https://3000-iym6gdsyrgvh7nix90lk8-cbeee0f9.sandbox.novita.ai/signup)

2. Fill out the form:
   - **Email**: test@example.com
   - **Username**: testuser
   - **Display Name**: Test User
   - **Password**: Test123456

3. Click **"Create Account"**

4. You should be redirected to the dashboard!

---

## Step 7: Verify User Created in Supabase

1. Go to **"Authentication"** → **"Users"** in Supabase
2. You should see your test user listed

3. Go to **"Table Editor"** → **"users_profile"**
4. You should see a profile row for your test user with:
   - username: testuser
   - display_name: Test User
   - theme_id: minimal
   - is_public: true

---

## 🎉 Success!

Your database is now fully set up with:

- ✅ 5 tables with proper relationships
- ✅ Row Level Security (RLS) policies
- ✅ 5 default themes
- ✅ 2 storage buckets (avatars, block-images)
- ✅ Indexes for performance
- ✅ Triggers for auto-updating timestamps
- ✅ Analytics views

---

## 🔧 Troubleshooting

### Error: "relation already exists"
This means tables are already created. You can:
1. Drop all tables first (careful!):
   ```sql
   DROP TABLE IF EXISTS ai_conversations CASCADE;
   DROP TABLE IF EXISTS page_analytics CASCADE;
   DROP TABLE IF EXISTS blocks CASCADE;
   DROP TABLE IF EXISTS themes CASCADE;
   DROP TABLE IF EXISTS users_profile CASCADE;
   DROP TYPE IF EXISTS block_type CASCADE;
   ```
2. Then re-run the schema.sql

### Error: "permission denied"
Make sure you're using the correct Supabase project and have owner/admin access.

### Sign up fails with "Username already exists"
This is actually good! It means:
1. The database is working
2. Username validation is working
3. Just try a different username

### Can't see storage buckets
1. Make sure they're marked as **public**
2. Check Storage policies in Supabase dashboard

---

## 📚 What Each Table Does

| Table | Purpose | Key Features |
|-------|---------|--------------|
| **users_profile** | User profiles | Custom username, avatar, bio, theme selection |
| **blocks** | Content blocks | Text, images, buttons, social links, embeds, AI chat |
| **themes** | Theme presets | 5 beautiful themes (minimal, gradient, dark, warm, ocean) |
| **page_analytics** | Analytics | Page views, clicks, visitor tracking |
| **ai_conversations** | AI chat | Conversation history for AI chat feature |

---

## 🚀 Next Steps

After database setup:

1. ✅ **Sign up** for an account
2. ✅ **Create blocks** on your profile
3. ✅ **Customize theme** from 5 presets
4. ✅ **Share your link**: getearnly.com/yourusername
5. ✅ **Track analytics** in your dashboard

---

Need help? The schema includes:
- 15+ RLS policies for security
- Auto-updating timestamps
- Full-text search indexes
- Analytics aggregation views
- Referential integrity constraints

Everything is production-ready! 🎉
