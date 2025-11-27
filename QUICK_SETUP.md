# 🚀 Vario Quick Setup Guide

## ✅ Step 2: COMPLETED! ✅
Dependencies installed successfully!
- 367 packages installed
- Next.js 14.2.33 ✓
- React 18.3.1 ✓
- Supabase clients ✓
- TypeScript ✓
- All dependencies ready!

---

## 📋 Remaining Steps

### Step 3: Setup Supabase (10 minutes) ⏱️

#### 3.1 Create Supabase Account & Project

1. **Go to Supabase**
   - Visit: https://supabase.com
   - Click "Start your project"
   - Sign up (free tier is perfect)

2. **Create New Project**
   - Click "New Project"
   - **Project Name**: `vario-production`
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free
   - Click "Create new project"
   - ⏱️ Wait ~2 minutes for provisioning

#### 3.2 Run Database Schema

1. **Open SQL Editor**
   - In Supabase Dashboard, click "SQL Editor" in left sidebar
   - Click "+ New Query"

2. **Copy Schema File**
   - Open this file: `/home/user/bento-clone/supabase/schema.sql`
   - Copy ALL 343 lines (entire file)

3. **Run in Supabase**
   - Paste into SQL Editor
   - Click "Run" button (bottom right)
   - Wait for success message: "Success. No rows returned"

4. **Verify Tables Created**
   - Click "Table Editor" in left sidebar
   - You should see 5 tables:
     - ✓ users_profile
     - ✓ blocks
     - ✓ themes
     - ✓ page_analytics
     - ✓ ai_conversations

#### 3.3 Create Storage Buckets

1. **Navigate to Storage**
   - Click "Storage" in left sidebar
   - Click "Create a new bucket"

2. **Create Avatars Bucket**
   - **Name**: `avatars`
   - **Public bucket**: ✅ CHECK THIS BOX
   - Click "Create bucket"

3. **Create Block Images Bucket**
   - Click "Create a new bucket" again
   - **Name**: `block-images`
   - **Public bucket**: ✅ CHECK THIS BOX
   - Click "Create bucket"

4. **Set Storage Policies** (For each bucket)
   - Click on bucket name
   - Go to "Policies" tab
   - Click "New Policy" → "For full customization"
   
   **Policy 1: Public Read**
   ```sql
   -- Name: Public read access
   -- Operation: SELECT
   -- Policy:
   true
   ```
   
   **Policy 2: Authenticated Upload**
   ```sql
   -- Name: Authenticated users can upload
   -- Operation: INSERT
   -- Policy:
   auth.role() = 'authenticated'
   ```

#### 3.4 Get API Keys

1. **Navigate to Settings**
   - Click "Settings" (gear icon) in left sidebar
   - Click "API" under Project Settings

2. **Copy These 3 Values** (SAVE THEM!)
   - ✏️ **Project URL**: `https://xxxxx.supabase.co`
   - ✏️ **anon public key**: `eyJhbG...` (long string, ~400 chars)
   - ✏️ **service_role key**: `eyJhbG...` (even longer, KEEP SECRET!)

---

### Step 4: Configure Environment Variables (2 minutes) ⏱️

#### 4.1 Create .env.local File

Run this in terminal:

```bash
cd /home/user/bento-clone
cp .env.example .env.local
```

#### 4.2 Edit .env.local

Open the file and replace with YOUR values:

```env
# ==============================================
# SUPABASE CONFIGURATION
# ==============================================
# Replace these with YOUR values from Step 3.4

# Project URL (format: https://xxxxx.supabase.co)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co

# Anon/Public Key (starts with eyJhbG...)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...YOUR_KEY_HERE

# Service Role Key (starts with eyJhbG..., KEEP SECRET!)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...YOUR_KEY_HERE

# ==============================================
# OPENAI CONFIGURATION (Optional - skip for now)
# ==============================================
OPENAI_API_KEY=

# ==============================================
# APPLICATION URL
# ==============================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important:**
- ⚠️ NO quotes around values
- ⚠️ NO spaces before or after `=`
- ⚠️ Replace entire key values (very long strings)
- ⚠️ Save the file

---

### Step 5: Run Development Server (1 minute) ⏱️

#### 5.1 Start the Server

```bash
cd /home/user/bento-clone
npm run dev
```

**Expected Output:**
```
▲ Next.js 14.2.33
- Local:        http://localhost:3000
- Environments: .env.local
- Ready in 2.5s
```

#### 5.2 Open in Browser

Visit: **http://localhost:3000**

You should see:
- 🎨 Beautiful homepage with gradient background
- 📱 Responsive design
- 🚀 "Start For Free" and "View Demo" buttons
- ✨ Feature cards

---

### Step 6: Test Authentication (5 minutes) ⏱️

#### 6.1 Create Test Account

1. Click "Get Started" or "Sign Up"
2. Fill in the form:
   - **Email**: `test@example.com`
   - **Password**: `Test123456`
   - **Confirm Password**: `Test123456`
   - **Username**: `testuser` (lowercase, no spaces)
   - **Display Name**: `Test User`
3. Click "Sign Up"

**Expected:**
- If signup UI isn't built yet, you'll see structure
- Check Supabase for user creation

#### 6.2 Verify in Supabase

1. Go to Supabase Dashboard
2. Click "Table Editor"
3. Select `users_profile` table
4. You should see your new user!

#### 6.3 Manually Add Test Block

Since dashboard UI is pending, test backend via SQL:

```sql
-- Run in Supabase SQL Editor
-- Replace 'xxx' with your actual user ID from users_profile table

INSERT INTO blocks (user_id, type, content, order_index)
VALUES (
  'your-user-id-from-users_profile-table',
  'text',
  '{"title": "Welcome! 👋", "body": "This is my test block from Vario"}'::jsonb,
  0
);
```

---

## ✅ Setup Complete Checklist

Use this to track your progress:

- [x] **Step 1**: Project downloaded/created
- [x] **Step 2**: Dependencies installed (`npm install`) ✅
- [ ] **Step 3**: Supabase setup
  - [ ] Account created
  - [ ] Project created
  - [ ] Schema executed (343 lines)
  - [ ] Storage buckets created
  - [ ] API keys copied
- [ ] **Step 4**: Environment configured
  - [ ] `.env.local` created
  - [ ] Supabase URL added
  - [ ] Anon key added
  - [ ] Service role key added
- [ ] **Step 5**: Dev server running
  - [ ] `npm run dev` successful
  - [ ] Visited localhost:3000
  - [ ] Homepage displays
- [ ] **Step 6**: Testing
  - [ ] Can access signup page
  - [ ] User created in database
  - [ ] Block added successfully

---

## 🎯 What You Can Do Now

### ✅ Already Working:
- ✅ Homepage (beautiful design)
- ✅ Database (5 tables with RLS)
- ✅ Authentication backend
- ✅ Server actions (auth, profile, blocks)
- ✅ Storage system
- ✅ Type definitions
- ✅ Validation schemas

### 🚧 Needs UI Implementation (~10-13 hours):
- Dashboard editor interface
- Block renderers for public pages
- Drag-and-drop functionality
- Theme switcher UI
- Analytics dashboard
- AI chat modal

---

## 🆘 Troubleshooting

### "Connection refused" to Supabase
**Solution:**
- Check `.env.local` has correct values
- Ensure no extra spaces or quotes
- Restart server: `Ctrl+C` then `npm run dev`

### "Table already exists" error in SQL
**Solution:**
- Schema already run successfully
- Skip SQL step or use `DROP TABLE` first (⚠️ destroys data)

### Port 3000 already in use
**Solution:**
```bash
npx kill-port 3000
npm run dev
```

### "Invalid API key" error
**Solution:**
- Copy FULL key from Supabase (very long)
- Check for hidden characters
- Ensure no quotes in `.env.local`

---

## 📚 Next Steps After Setup

1. **Explore Documentation**
   - `README.md` - Features overview
   - `PROJECT_SUMMARY.md` - Technical details
   - `INSTALLATION_GUIDE.md` - Detailed reference

2. **Study the Code**
   - `/lib/actions/` - Server actions
   - `/lib/supabase/` - Database clients
   - `/types/` - TypeScript definitions

3. **Build the UI** (Optional)
   - Install shadcn/ui components
   - Create auth pages
   - Build dashboard
   - Implement block renderers

4. **Deploy to Production**
   - Push to GitHub
   - Deploy to Vercel
   - See `DEPLOYMENT.md`

---

## 📊 Your Progress

```
Setup Progress: ███████░░░░░░░░░░░░░ 35%

✅ Project Structure
✅ Dependencies Installed
⏳ Supabase Configuration
⏳ Environment Setup
⏳ Development Server
⏳ Testing & Verification
```

---

## 🎉 Almost There!

You're making great progress! 

**Current Status:**
- ✅ 367 packages installed
- ✅ All source code ready
- ✅ Database schema prepared
- ⏳ Waiting for Supabase setup

**Time Remaining:** ~15 minutes to fully working backend!

---

## 🚀 Quick Command Reference

```bash
# Navigate to project
cd /home/user/bento-clone

# Install dependencies (DONE ✓)
npm install

# Create env file
cp .env.example .env.local

# Edit env file
nano .env.local  # or vim, code, etc.

# Start dev server
npm run dev

# Stop server
Ctrl + C

# Build for production
npm run build

# Check what's installed
npm list --depth=0
```

---

**Need help?** Check the documentation files or re-read this guide!

**Ready to continue?** Start with Step 3: Setup Supabase! 🎯
