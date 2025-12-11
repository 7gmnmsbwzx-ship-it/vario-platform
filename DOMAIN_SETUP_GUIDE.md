# 🌐 Domain Setup Guide - getearnly.com/vario

## ✅ Good News!

Your app **already supports** `getearnly.com/vario` out of the box! The dynamic route `[username]` handles all usernames automatically.

**What works right now:**
- `your-app.vercel.app/vario` ✅
- `your-app.vercel.app/johndoe` ✅
- `your-app.vercel.app/alice` ✅

**To make `getearnly.com/vario` work, you just need to:**
1. Connect your custom domain to Vercel
2. Create a user with username `vario`

---

## 🚀 Quick Setup (3 Steps)

### **Step 1: Add Custom Domain to Vercel**

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Click **Settings** → **Domains**
4. Click **Add Domain**
5. Enter: `getearnly.com`
6. Click **Add**

Vercel will show you DNS records to add.

---

### **Step 2: Update DNS Records**

Go to your domain registrar (where you bought `getearnly.com`) and add these records:

#### **For Root Domain (getearnly.com):**

```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

#### **For WWW (www.getearnly.com):**

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

**Common Registrars:**
- **GoDaddy**: DNS Management → Add Record
- **Namecheap**: Advanced DNS → Add New Record
- **Cloudflare**: DNS → Add Record
- **Google Domains**: DNS → Manage Custom Records

**⏱️ DNS Propagation:** 5 minutes to 48 hours (usually ~15 minutes)

---

### **Step 3: Create "vario" Username**

Once your database is set up:

**Option A: Via Signup**
1. Go to: `https://getearnly.com/signup`
2. Sign up with email
3. Choose username: `vario`
4. Complete profile setup

**Option B: Via SQL (Manual)**
```sql
-- First, create auth user via Supabase Auth UI
-- Then create profile:
INSERT INTO users_profile (id, username, display_name, is_public)
VALUES (
  'YOUR_AUTH_USER_ID',  -- Replace with actual user ID
  'vario',
  'Vario Platform',
  true
);
```

---

## ✅ Verification

After DNS propagation (15-60 minutes):

### **Test These URLs:**

1. **Homepage:**
   - https://getearnly.com ✅
   - Should show your homepage

2. **Vario Profile:**
   - https://getearnly.com/vario ✅
   - Should show vario's profile page

3. **Other Users:**
   - https://getearnly.com/johndoe ✅
   - https://getearnly.com/alice ✅
   - Should show respective profiles

---

## 🎨 What the Profile Page Shows

Once database is set up and blocks are added:

### **Profile Header:**
- Avatar image
- Display name
- Username (@vario)
- Bio text

### **Content Blocks:**

**Link Blocks:**
```
┌─────────────────────────────────────┐
│  🔗  GitHub Profile           →     │
└─────────────────────────────────────┘
```

**Text Blocks:**
```
┌─────────────────────────────────────┐
│  Welcome to Vario! 👋              │
│  Check out my latest project        │
└─────────────────────────────────────┘
```

**Image Blocks:**
```
┌─────────────────────────────────────┐
│  [Your Image]                       │
│  Caption text here                  │
└─────────────────────────────────────┘
```

---

## 📝 How to Add Blocks

### **Method 1: Via Dashboard UI (Recommended)**

1. Login to: `https://getearnly.com/dashboard`
2. Go to: **Blocks** section
3. Click: **Add New Block**
4. Choose type: Link, Text, or Image
5. Fill in details
6. Click: **Save**

### **Method 2: Via SQL (Manual)**

```sql
-- Add a link block
INSERT INTO blocks (user_id, type, content, order_index, is_visible)
VALUES (
  auth.uid(),  -- Your user ID
  'link',
  '{
    "url": "https://github.com/username",
    "title": "GitHub Profile",
    "icon": "fab fa-github"
  }'::jsonb,
  0,
  true
);

-- Add a text block
INSERT INTO blocks (user_id, type, content, order_index, is_visible)
VALUES (
  auth.uid(),
  'text',
  '{
    "content": "Welcome to my page! 👋"
  }'::jsonb,
  1,
  true
);

-- Add an image block
INSERT INTO blocks (user_id, type, content, order_index, is_visible)
VALUES (
  auth.uid(),
  'image',
  '{
    "url": "https://example.com/image.jpg",
    "alt": "My photo",
    "caption": "Beautiful sunset"
  }'::jsonb,
  2,
  true
);
```

---

## 🔧 Advanced Configuration

### **Multiple Domains**

You can add multiple domains to the same Vercel project:

```
getearnly.com      → Main domain
www.getearnly.com  → Redirects to main
vario.app          → Alternative domain
```

### **Custom Domain Per User (Future)**

To give each user their own custom domain:

1. Update `users_profile` table (already has `custom_domain` field)
2. Add domain to Vercel via API
3. Update middleware to handle custom domains
4. Set up CNAME records for users

---

## 🚀 Current Features

### **What Already Works:**

✅ **Dynamic Routes**
- `getearnly.com/[any-username]` automatically works
- No code changes needed for new users

✅ **Profile Pages**
- Display avatar, name, username, bio
- Show all user's blocks
- Responsive design

✅ **Block Types**
- Links (with icons)
- Text content
- Images (with captions)
- More types can be added easily

✅ **SEO Optimization**
- Dynamic meta titles
- Profile descriptions
- Proper Open Graph tags

---

## 📊 Example Profile

Once set up, `getearnly.com/vario` will look like:

```
┌────────────────────────────────────────────┐
│                                            │
│              [Avatar Image]                │
│                                            │
│           Vario Platform                   │
│              @vario                        │
│                                            │
│    Your all-in-one link-in-bio platform   │
│                                            │
├────────────────────────────────────────────┤
│  🔗  GitHub                           →    │
├────────────────────────────────────────────┤
│  🐦  Twitter                          →    │
├────────────────────────────────────────────┤
│  Welcome to Vario! 🚀                     │
│  Create your own link-in-bio page          │
├────────────────────────────────────────────┤
│  💼  LinkedIn                         →    │
└────────────────────────────────────────────┘
```

---

## 🐛 Troubleshooting

### **"Profile Not Found" Error**

**Cause:** User with username `vario` doesn't exist yet

**Solution:**
1. Run database migration first
2. Create user via signup
3. Or manually insert profile via SQL

### **"Page Not Loading" Error**

**Cause:** DNS not propagated yet

**Solution:**
1. Wait 15-60 minutes
2. Check DNS with: `nslookup getearnly.com`
3. Clear browser cache
4. Try incognito mode

### **"No Content Yet" Message**

**Cause:** User has no blocks added

**Solution:**
1. Login to dashboard
2. Go to Blocks section
3. Add content blocks
4. Refresh profile page

### **Blocks Not Showing**

**Cause:** Blocks marked as invisible or database not set up

**Solution:**
```sql
-- Check if blocks exist
SELECT * FROM blocks WHERE user_id = auth.uid();

-- Make blocks visible
UPDATE blocks 
SET is_visible = true 
WHERE user_id = auth.uid();
```

---

## ✅ Checklist

Before `getearnly.com/vario` will work:

- [ ] Run database migration (4 tables created)
- [ ] Add custom domain to Vercel
- [ ] Update DNS records (A + CNAME)
- [ ] Wait for DNS propagation (15-60 min)
- [ ] Create user with username `vario`
- [ ] Add content blocks
- [ ] Test profile page

---

## 🎯 Current Status

**What's Ready:**
- ✅ Dynamic route `[username]` implemented
- ✅ Profile page displays blocks
- ✅ Link, text, image blocks supported
- ✅ Responsive design
- ✅ SEO optimized
- ✅ Code deployed to GitHub

**What's Needed:**
1. Add `getearnly.com` to Vercel Domains
2. Update DNS records
3. Run database migration
4. Create `vario` user
5. Add content blocks

**Estimated Time:** 30 minutes (mostly DNS propagation)

---

## 📚 Related Documentation

- `DATABASE_SETUP_CHECKLIST.md` - Database setup
- `SUPABASE_SETUP.md` - Full database docs
- Vercel Docs: https://vercel.com/docs/concepts/projects/domains

---

## 🎉 Next Steps

1. **Add domain to Vercel** (5 min)
2. **Update DNS records** (5 min)
3. **Wait for propagation** (15-60 min)
4. **Run database migration** (5 min)
5. **Create vario user** (2 min)
6. **Add blocks** (5 min)
7. **Test!** `https://getearnly.com/vario` ✅

**Your Vario platform will be live at getearnly.com!** 🚀
