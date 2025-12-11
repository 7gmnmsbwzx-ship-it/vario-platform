# 🚀 Vario Platform Setup Guide

## ✅ Current Status

Your **Vario Link-in-Bio Platform** is now fully configured and ready for deployment!

### 📦 Repository
- **GitHub**: https://github.com/7gmnmsbwzx-ship-it/vario-platform
- **Branch**: `main`
- **Latest Commit**: `72eaf97` - Route structure finalized

---

## 🌐 URL Structure (How It Works)

### Option 1: Using Vercel Domain (Current Setup)

When deployed to Vercel, your app works like this:

| URL | What It Shows | Status |
|-----|---------------|--------|
| `https://vario-platform46.vercel.app/` | Original homepage | ✅ Live |
| `https://vario-platform46.vercel.app/vario` | **Vario Platform landing page** | ✅ Live |
| `https://vario-platform46.vercel.app/john` | John's profile (if user `john` exists) | ✅ Dynamic |
| `https://vario-platform46.vercel.app/sarah` | Sarah's profile (if user `sarah` exists) | ✅ Dynamic |

### Option 2: Using Custom Domain (getearnly.com)

After you add `getearnly.com` to Vercel, the URLs will be:

| URL | What It Shows | Status |
|-----|---------------|--------|
| `https://getearnly.com/` | Original homepage | 🔜 Pending DNS |
| `https://getearnly.com/vario` | **Vario Platform landing page** | 🔜 Pending DNS |
| `https://getearnly.com/john` | John's profile page | 🔜 Pending DNS |
| `https://getearnly.com/sarah` | Sarah's profile page | 🔜 Pending DNS |

---

## 🎯 Key Features

### 1. **Vario Platform Landing Page** (`/vario`)
- Beautiful gradient design with hero section
- Feature showcase (Customizable Design, Analytics, AI Chat)
- Call-to-action buttons (Sign Up, Login)
- Mobile responsive
- **This is NOT a user profile** - it's the marketing page for Vario platform

### 2. **Dynamic User Profiles** (`/[username]`)
- Real users who sign up can claim their username
- Format: `getearnly.com/username`
- Displays user's avatar, bio, and content blocks
- Supports link blocks, text blocks, and image blocks
- SEO optimized with dynamic metadata

### 3. **Original Homepage** (`/`)
- Your existing homepage remains unchanged
- Shows "Your Perfect Link in Bio Page" messaging
- Feature grid with icons
- Sign up and login buttons

---

## 🔧 How to Deploy to getearnly.com

### Step 1: Add Custom Domain in Vercel

1. Go to your Vercel project: https://vercel.com/dashboard
2. Click on your project → **Settings** → **Domains**
3. Add `getearnly.com` and `www.getearnly.com`

### Step 2: Update DNS Records

Go to your domain registrar (where you bought `getearnly.com`) and add these DNS records:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | `76.76.21.21` | 3600 |
| CNAME | www | `cname.vercel-dns.com` | 3600 |

**Wait 15-60 minutes** for DNS propagation.

### Step 3: Verify Deployment

Once DNS is propagated, test these URLs:

```bash
# Test homepage
curl -I https://getearnly.com/

# Test Vario landing page
curl -I https://getearnly.com/vario

# Test dynamic route (will show 404 until a user is created)
curl -I https://getearnly.com/testuser
```

---

## 👤 How Users Claim Their Links

### For Real Users Who Sign Up

1. **User signs up** at `https://getearnly.com/signup`
2. **User creates profile** and chooses username (e.g., `john`)
3. **Their link-in-bio URL** is automatically available at:
   ```
   https://getearnly.com/john
   ```
4. **User adds blocks** (links, text, images) via dashboard
5. **User shares** their personalized link: `https://getearnly.com/john`

### Create a Test User (Via SQL)

To test the dynamic routes, run this in Supabase SQL Editor:

```sql
-- Insert a test user profile
INSERT INTO users_profile (id, username, display_name, bio, is_public)
VALUES (
  'test-user-id-123',
  'testuser',
  'Test User',
  'This is my awesome link-in-bio page! 🚀',
  true
);

-- Add a sample link block
INSERT INTO blocks (user_id, block_type, content, order_index, is_visible)
VALUES (
  'test-user-id-123',
  'link',
  '{"url": "https://github.com", "title": "My GitHub Profile"}',
  1,
  true
);
```

Then visit: `https://getearnly.com/testuser`

---

## 📊 Database Setup (REQUIRED)

### Step 1: Run the Migration

1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Open **SQL Editor** (left sidebar)
3. Copy the entire contents of `supabase/migrations/20240101000000_initial_schema.sql`
4. Paste and click **Run**

### Step 2: Verify Tables

Run this query to verify:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see:
- ✅ `users_profile`
- ✅ `blocks`
- ✅ `ai_conversations`
- ✅ `page_analytics`

### Step 3: Set Environment Variables

Make sure these are set in Vercel:

| Variable | Where to Get It |
|----------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Project Settings → API |

---

## 🧪 Testing the Complete Flow

### 1. Test the Vario Landing Page
```bash
# Should show the purple gradient landing page
curl https://getearnly.com/vario
```

### 2. Test User Signup
1. Go to `https://getearnly.com/signup`
2. Create an account
3. Choose a username (e.g., `myusername`)
4. Visit `https://getearnly.com/myusername` → Should show your profile!

### 3. Test Dashboard
1. Login at `https://getearnly.com/login`
2. Go to Dashboard
3. Add a link block:
   ```json
   {
     "url": "https://twitter.com/myhandle",
     "title": "Follow me on Twitter"
   }
   ```
4. Visit your profile page → Link should appear!

---

## 🎨 Route Priority (How Next.js Resolves URLs)

Next.js resolves routes in this order:

1. **Static routes** (e.g., `/vario`, `/login`, `/signup`) - **Highest priority**
2. **Dynamic routes** (e.g., `/[username]`) - Lower priority
3. **404 page** - If nothing matches

This means:
- ✅ `getearnly.com/vario` → Always shows Vario landing page (static route)
- ✅ `getearnly.com/john` → Shows John's profile IF user exists (dynamic route)
- ✅ `getearnly.com/nonexistent` → Shows 404 page (no match)

**No conflicts!** The `/vario` route is static and always takes precedence over the `[username]` dynamic route.

---

## 📂 Project Structure

```
app/
├── page.tsx                    # Homepage (getearnly.com/)
├── vario/
│   └── page.tsx               # Vario landing page (getearnly.com/vario)
├── [username]/
│   └── page.tsx               # User profiles (getearnly.com/username)
├── login/
│   └── page.tsx               # Login page
├── signup/
│   └── page.tsx               # Signup page
├── dashboard/
│   ├── page.tsx               # Dashboard home
│   ├── blocks/page.tsx        # Manage blocks
│   ├── analytics/page.tsx     # View analytics
│   ├── settings/page.tsx      # Profile settings
│   └── theme/page.tsx         # Customize theme
└── api/
    ├── ai-chat/route.ts       # AI chat endpoint
    └── analytics/route.ts     # Analytics tracking
```

---

## 🚨 Important Notes

### Reserved Usernames

These usernames **cannot be claimed** by users (they're static routes):

- `vario` (Vario platform landing page)
- `login` (Login page)
- `signup` (Signup page)
- `dashboard` (Dashboard)
- `api` (API routes)
- `_next` (Next.js internal)

### Username Validation

When users sign up, validate their username to prevent conflicts:

```typescript
const RESERVED_USERNAMES = ['vario', 'login', 'signup', 'dashboard', 'api', 'admin', 'app', 'www']

function isUsernameValid(username: string): boolean {
  return !RESERVED_USERNAMES.includes(username.toLowerCase())
}
```

---

## ✅ Final Checklist

- [x] TypeScript build passes (0 errors)
- [x] All routes configured correctly
- [x] Database schema created
- [x] Middleware configured with error handling
- [x] Dynamic routes support user profiles
- [x] Static `/vario` route for platform landing page
- [x] Original homepage preserved at `/`
- [x] GitHub repository updated
- [ ] DNS configured for `getearnly.com`
- [ ] Database migration executed in Supabase
- [ ] Environment variables set in Vercel
- [ ] Test user created and verified

---

## 🎉 What's Next?

1. **Run the database migration** in Supabase (see Database Setup above)
2. **Configure DNS** to point `getearnly.com` to Vercel
3. **Redeploy on Vercel** to pull the latest code
4. **Create a test user** to verify `getearnly.com/username` works
5. **Test the signup flow** to ensure users can claim their usernames

---

## 🔗 Quick Links

- **GitHub Repository**: https://github.com/7gmnmsbwzx-ship-it/vario-platform
- **Current Live Site**: https://vario-platform46.vercel.app/
- **Vario Landing Page**: https://vario-platform46.vercel.app/vario
- **Database Setup Guide**: `DATABASE_SETUP_CHECKLIST.md`
- **Domain Setup Guide**: `DOMAIN_SETUP_GUIDE.md`

---

## 🆘 Troubleshooting

### Issue: `/vario` shows 404
- **Solution**: Verify `app/vario/page.tsx` exists and redeploy

### Issue: User profiles don't load
- **Solution**: Check database migration was run and `users_profile` table exists

### Issue: Domain not working
- **Solution**: Wait for DNS propagation (15-60 minutes) and verify DNS records

### Issue: Middleware errors
- **Solution**: Verify Supabase environment variables are set in Vercel

---

**🎊 Your Vario platform is ready! Deploy and start creating amazing link-in-bio pages!**
