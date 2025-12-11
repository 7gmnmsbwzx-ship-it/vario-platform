# ✅ Supabase Database Setup Checklist

## 🎯 Quick Start (5 Minutes)

Follow these steps to get your Vario platform database ready:

---

### **Step 1: Open Supabase SQL Editor** (1 min)

1. Go to https://supabase.com/dashboard
2. Select your Vario project
3. Click **"SQL Editor"** in left sidebar
4. Click **"+ New query"** button

---

### **Step 2: Run the Migration** (2 min)

1. Open the file: `supabase/migrations/20240101000000_initial_schema.sql`
2. Copy **ALL** the SQL code (Ctrl+A, Ctrl+C)
3. Paste into Supabase SQL Editor (Ctrl+V)
4. Click **"Run"** button (or press Ctrl+Enter)
5. Wait for success message: ✅ **"Success. No rows returned"**

**What this creates:**
- ✅ 4 database tables
- ✅ All RLS security policies
- ✅ 2 storage buckets (avatars, block-images)
- ✅ Indexes for performance
- ✅ Analytics summary view
- ✅ Automatic timestamp triggers

---

### **Step 3: Verify Setup** (1 min)

Run this query to check tables:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

**Expected result:**
```
ai_conversations
blocks
page_analytics
users_profile
```

✅ If you see all 4 tables, you're done!

---

### **Step 4: Test Your App** (1 min)

1. Go to your app: https://your-app.vercel.app/signup
2. Create a test account
3. You should be redirected to `/dashboard`
4. Try these features:
   - ✅ View your profile
   - ✅ Add a content block
   - ✅ Customize theme
   - ✅ View analytics (will be empty initially)

---

## 🔍 Troubleshooting

### **Problem: SQL Error when running migration**

**Solution:**
- Make sure you copied ALL the SQL code
- Check if tables already exist: `SELECT * FROM users_profile LIMIT 1;`
- If tables exist, you can skip the migration

### **Problem: "Permission denied" error**

**Solution:**
- Ensure you're the project owner/admin
- Check Supabase project settings → Database → Roles

### **Problem: App shows "Profile not found" after signup**

**Solution:**
1. Check if profile was created:
```sql
SELECT * FROM users_profile;
```

2. If empty, manually create profile:
```sql
-- Get your user ID
SELECT id, email FROM auth.users;

-- Create profile (replace with your ID)
INSERT INTO users_profile (id, username, display_name, is_public)
VALUES ('YOUR_USER_ID', 'testuser', 'Test User', true);
```

### **Problem: Can't upload images**

**Solution:**
1. Check storage buckets exist:
```sql
SELECT * FROM storage.buckets;
```

2. If missing, create them:
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('avatars', 'avatars', true),
  ('block-images', 'block-images', true);
```

---

## 📊 Database Schema Summary

### **Tables Created:**

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `users_profile` | User profiles & settings | Unique usernames, public/private toggle |
| `blocks` | Content blocks (links, text, etc.) | JSONB content, ordering, visibility |
| `ai_conversations` | AI chat history | Message arrays, token tracking |
| `page_analytics` | Analytics & tracking | Event types, visitor tracking |

### **Storage Buckets:**

| Bucket | Purpose | Access |
|--------|---------|--------|
| `avatars` | Profile pictures | Public read, authenticated write |
| `block-images` | Block images | Public read, authenticated write |

### **Security:**

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Users can only edit their own data
- ✅ Public profiles viewable by everyone
- ✅ Private profiles hidden from public
- ✅ Storage restricted to file owners

---

## 🚀 What's Next?

After database setup is complete:

### **Immediate Next Steps:**

1. **Create your profile**
   - Signup at: https://your-app.vercel.app/signup
   - Complete profile setup

2. **Add content blocks**
   - Go to: /dashboard/blocks
   - Add links, text, images

3. **View your public page**
   - Visit: /your-username
   - Share with others!

### **Customization:**

4. **Customize theme**
   - Go to: /dashboard/theme
   - Pick colors and styles

5. **Upload profile picture**
   - Go to: /dashboard/settings
   - Upload avatar image

### **Features to Test:**

6. **AI Chat** (if OPENROUTER_API_KEY is set)
   - Visitors can chat with AI on your page
   - View conversations in dashboard

7. **Analytics**
   - Go to: /dashboard/analytics
   - Track views, clicks, engagement

8. **Share your page**
   - Your URL: https://your-domain.com/username
   - Or: https://your-app.vercel.app/username

---

## 📖 Documentation Files

- **`SUPABASE_SETUP.md`** - Detailed setup guide with examples
- **`supabase/migrations/20240101000000_initial_schema.sql`** - Main migration file
- **`supabase/seed.sql`** - Sample data and testing queries

---

## ✨ Quick Tips

### **For Development:**

```sql
-- View your profile
SELECT * FROM users_profile WHERE id = auth.uid();

-- View your blocks
SELECT * FROM blocks WHERE user_id = auth.uid() ORDER BY order_index;

-- View your analytics
SELECT * FROM user_analytics_summary WHERE user_id = auth.uid();
```

### **For Testing:**

```sql
-- Insert test block
INSERT INTO blocks (user_id, type, content, order_index)
VALUES (
  auth.uid(),
  'link',
  '{"url": "https://github.com", "title": "GitHub"}'::jsonb,
  0
);
```

### **For Debugging:**

```sql
-- Check RLS policies
SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';

-- Check storage
SELECT * FROM storage.buckets;

-- View all users (if you're admin)
SELECT id, email, created_at FROM auth.users;
```

---

## 🎉 Success Checklist

- ✅ Migration ran successfully
- ✅ All 4 tables exist
- ✅ Storage buckets created
- ✅ Can signup/login
- ✅ Profile created after signup
- ✅ Can add content blocks
- ✅ Public page accessible
- ✅ Analytics tracking works

**If all checked, your database is fully operational!** 🚀

---

**Repository:** https://github.com/7gmnmsbwzx-ship-it/vario-platform  
**Commit:** `850c2ce` - Database schema and setup guide  
**Status:** ✅ Ready to use
