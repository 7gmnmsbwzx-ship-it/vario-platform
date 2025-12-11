# 🗄️ Supabase Database Setup Guide

This guide will help you set up the complete database schema for your Vario platform.

## 📋 Overview

Your Vario platform requires these database components:

### **Tables:**
1. `users_profile` - User profiles and settings
2. `blocks` - Content blocks (links, text, images, etc.)
3. `ai_conversations` - AI chat history
4. `page_analytics` - Analytics and tracking data

### **Features:**
- ✅ Row Level Security (RLS) policies
- ✅ Automatic timestamps
- ✅ Storage buckets for images
- ✅ Analytics summary view
- ✅ Proper indexes for performance
- ✅ Data validation constraints

---

## 🚀 Quick Setup (5 minutes)

### **Step 1: Access Supabase SQL Editor**

1. Go to your Supabase project: https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **+ New query**

### **Step 2: Run the Migration**

1. Copy the entire contents of `supabase/migrations/20240101000000_initial_schema.sql`
2. Paste it into the SQL Editor
3. Click **Run** (or press Ctrl+Enter)
4. Wait for "Success. No rows returned" message

✅ **That's it!** Your database is now set up.

---

## 🧪 Test Your Setup

### **Method 1: Check Tables**

Run this in SQL Editor:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

**Expected output:**
- `ai_conversations`
- `blocks`
- `page_analytics`
- `users_profile`

### **Method 2: Check RLS Policies**

```sql
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

**You should see multiple policies** for each table (view, insert, update, delete).

### **Method 3: Check Storage Buckets**

```sql
SELECT * FROM storage.buckets;
```

**Expected output:**
- `avatars` bucket (public)
- `block-images` bucket (public)

---

## 👤 Create Your First User

### **Step 1: Sign Up**

1. Go to your deployed app: `https://your-app.vercel.app/signup`
2. Create an account with email/password
3. You'll be redirected to `/dashboard`

### **Step 2: Create Your Profile**

The app will automatically create your profile entry, but you can verify it:

```sql
-- Check if your profile was created
SELECT * FROM public.users_profile 
WHERE id = auth.uid();  -- This gets your current user ID
```

### **Step 3: Add Test Content**

Try adding blocks through the dashboard UI:
1. Go to `/dashboard/blocks`
2. Click "Add New Block"
3. Create a few test blocks

Or manually via SQL:
```sql
-- Get your user ID first
SELECT id FROM auth.users WHERE email = 'your-email@example.com';

-- Then insert a test block (replace YOUR_USER_ID)
INSERT INTO public.blocks (user_id, type, content, order_index, is_visible)
VALUES (
  'YOUR_USER_ID',
  'link',
  '{"url": "https://github.com", "title": "My GitHub", "icon": "fab fa-github"}'::jsonb,
  0,
  true
);
```

---

## 📊 Database Schema Details

### **users_profile Table**

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | References auth.users (Primary Key) |
| `username` | TEXT | Unique username (3-30 chars, lowercase) |
| `display_name` | TEXT | Display name (1-50 chars) |
| `avatar_url` | TEXT | URL to profile picture |
| `bio` | TEXT | User bio (max 500 chars) |
| `theme_id` | INTEGER | Theme selection (default: 1) |
| `is_public` | BOOLEAN | Profile visibility (default: true) |
| `custom_domain` | TEXT | Custom domain (optional) |
| `created_at` | TIMESTAMP | Account creation time |
| `updated_at` | TIMESTAMP | Last update time |

**Constraints:**
- Username: lowercase letters, numbers, hyphens, underscores only
- Username: 3-30 characters
- Display name: 1-50 characters
- Bio: max 500 characters

### **blocks Table**

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Block ID (Primary Key) |
| `user_id` | UUID | Owner user ID (Foreign Key) |
| `type` | TEXT | Block type: link, text, image, embed, video, social |
| `content` | JSONB | Block content (flexible structure) |
| `order_index` | INTEGER | Display order |
| `is_visible` | BOOLEAN | Visibility toggle |
| `created_at` | TIMESTAMP | Creation time |
| `updated_at` | TIMESTAMP | Last update time |

**Content Structure by Type:**

```jsonb
// Link block
{
  "url": "https://example.com",
  "title": "My Link",
  "icon": "fas fa-link"
}

// Text block
{
  "content": "Hello world! This is my text."
}

// Image block
{
  "url": "https://example.com/image.jpg",
  "alt": "Description",
  "caption": "Optional caption"
}

// Embed block
{
  "url": "https://youtube.com/watch?v=...",
  "type": "youtube"
}
```

### **ai_conversations Table**

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Conversation ID |
| `user_id` | UUID | Profile owner (nullable) |
| `visitor_id` | TEXT | Anonymous visitor ID |
| `messages` | JSONB | Message history array |
| `tokens_used` | INTEGER | AI token consumption |
| `created_at` | TIMESTAMP | Start time |
| `updated_at` | TIMESTAMP | Last message time |

**Messages Structure:**
```jsonb
[
  {
    "role": "user",
    "content": "Hello!",
    "timestamp": "2024-01-01T12:00:00Z"
  },
  {
    "role": "assistant",
    "content": "Hi! How can I help?",
    "timestamp": "2024-01-01T12:00:01Z"
  }
]
```

### **page_analytics Table**

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Event ID |
| `user_id` | UUID | Profile owner |
| `event_type` | TEXT | page_view, block_click, ai_chat_message, profile_share |
| `event_data` | JSONB | Additional event data |
| `visitor_id` | TEXT | Anonymous visitor ID |
| `referrer` | TEXT | HTTP referrer |
| `user_agent` | TEXT | Browser user agent |
| `ip_address` | TEXT | Visitor IP |
| `created_at` | TIMESTAMP | Event time |

---

## 🔒 Row Level Security (RLS) Policies

### **Security Model:**

**Public Access:**
- ✅ Anyone can view public profiles
- ✅ Anyone can view visible blocks on public profiles
- ✅ Anyone can insert analytics/conversations (for tracking)

**Authenticated Users:**
- ✅ Users can view/edit their own data
- ✅ Users can create/update/delete their own blocks
- ✅ Users can view their own analytics

**Privacy:**
- ❌ Private profiles are hidden from public
- ❌ Users cannot access other users' private data
- ❌ Users cannot edit other users' content

### **Testing RLS Policies:**

```sql
-- Test as anonymous user (should only see public profiles)
SELECT * FROM users_profile WHERE is_public = true;

-- Test as authenticated user (should see own data)
SELECT * FROM users_profile WHERE id = auth.uid();
```

---

## 🎨 Storage Buckets

### **avatars Bucket**

**Purpose:** Store user profile pictures
**Access:** Public read, authenticated write (own files only)
**Path structure:** `{user_id}/{filename}`

**Usage in app:**
```typescript
// Upload avatar
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`${userId}/${fileName}`, file)

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('avatars')
  .getPublicUrl(`${userId}/${fileName}`)
```

### **block-images Bucket**

**Purpose:** Store images used in content blocks
**Access:** Public read, authenticated write (own files only)
**Path structure:** `{user_id}/{filename}`

---

## 📈 Analytics View

### **user_analytics_summary**

Aggregated analytics per user:

```sql
SELECT * FROM user_analytics_summary 
WHERE user_id = auth.uid();
```

**Returns:**
- `total_page_views` - Total profile views
- `total_block_clicks` - Total clicks on blocks
- `total_ai_chats` - Total AI chat messages
- `unique_visitors` - Unique visitor count
- `active_days` - Days with activity
- `last_activity` - Last activity timestamp

---

## 🛠️ Maintenance & Utilities

### **Reset User Data (Development Only)**

```sql
-- Delete all blocks for a user
DELETE FROM blocks WHERE user_id = 'YOUR_USER_ID';

-- Delete analytics
DELETE FROM page_analytics WHERE user_id = 'YOUR_USER_ID';

-- Delete AI conversations
DELETE FROM ai_conversations WHERE user_id = 'YOUR_USER_ID';
```

### **Backup Data**

```sql
-- Export user data
COPY (
  SELECT * FROM users_profile WHERE id = 'YOUR_USER_ID'
) TO '/tmp/profile_backup.csv' CSV HEADER;
```

### **Check Table Sizes**

```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 🐛 Troubleshooting

### **Issue: Tables not created**

**Solution:**
1. Check SQL Editor for error messages
2. Ensure you have owner/admin access to the project
3. Try running migration in smaller chunks

### **Issue: RLS blocking queries**

**Solution:**
1. Check if user is authenticated: `SELECT auth.uid();`
2. Verify RLS policies: `SELECT * FROM pg_policies;`
3. Test with RLS disabled (dev only): `ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;`

### **Issue: Storage uploads failing**

**Solution:**
1. Verify bucket exists: `SELECT * FROM storage.buckets;`
2. Check storage policies: `SELECT * FROM storage.policies;`
3. Ensure file path matches pattern: `{user_id}/{filename}`

### **Issue: Foreign key constraints**

**Solution:**
1. Ensure user profile exists before creating blocks
2. Check: `SELECT * FROM users_profile WHERE id = auth.uid();`
3. Create profile if missing via signup or SQL

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)

---

## ✅ Next Steps

After setting up the database:

1. ✅ Test signup/login flow
2. ✅ Create a test profile
3. ✅ Add content blocks
4. ✅ View your public page
5. ✅ Check analytics dashboard
6. ✅ Test AI chat (if configured)

**Your database is ready! Start building your Vario platform!** 🚀
