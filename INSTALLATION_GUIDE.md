# 🚀 Vario Installation Guide

## Complete Step-by-Step Setup (30 Minutes)

This guide will walk you through setting up Vario from scratch to production deployment.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Supabase Configuration](#supabase-configuration)
4. [Database Setup](#database-setup)
5. [Storage Configuration](#storage-configuration)
6. [Environment Variables](#environment-variables)
7. [Running the Application](#running-the-application)
8. [Production Deployment](#production-deployment)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm or pnpm** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- **Code Editor** - VS Code recommended

### Required Accounts
- **Supabase Account** (Free tier) - [Sign up](https://supabase.com)
- **Vercel Account** (Free tier) - [Sign up](https://vercel.com) *(for deployment)*
- **OpenAI Account** (Optional) - [Sign up](https://openai.com) *(for AI chat features)*

---

## Local Development Setup

### Step 1: Install Dependencies

```bash
cd /home/user/bento-clone

# Install all dependencies (this may take 2-3 minutes)
npm install

# Expected output: Added 300+ packages
```

### Step 2: Verify Installation

```bash
# Check if Next.js is installed correctly
npx next --version

# Expected output: 14.0.4 or higher
```

---

## Supabase Configuration

### Step 1: Create New Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in:
   - **Name**: `vario-production` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free
4. Click **"Create new project"**
5. Wait 2-3 minutes for provisioning

### Step 2: Get API Credentials

1. Once project is ready, go to **Settings → API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbG...` (long string)
   - **service_role key**: `eyJhbG...` (different long string)
3. Keep these safe - you'll need them soon

---

## Database Setup

### Step 1: Open SQL Editor

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **"New Query"**

### Step 2: Run Schema Migration

1. Open `/home/user/bento-clone/supabase/schema.sql` in your editor
2. Copy the ENTIRE contents (12,000+ characters)
3. Paste into Supabase SQL Editor
4. Click **"Run"** (bottom right)
5. Wait for success message: "Success. No rows returned"

### Step 3: Verify Tables Created

1. Go to **Table Editor** in Supabase Dashboard
2. You should see these tables:
   - `users_profile`
   - `blocks`
   - `themes`
   - `page_analytics`
   - `ai_conversations`
3. If any are missing, re-run the schema.sql

---

## Storage Configuration

### Step 1: Create Storage Buckets

1. Go to **Storage** in Supabase Dashboard
2. Click **"Create a new bucket"**

#### Create `avatars` Bucket
- **Name**: `avatars`
- **Public bucket**: ✅ Check this
- Click **"Create bucket"**

#### Create `block-images` Bucket
- **Name**: `block-images`
- **Public bucket**: ✅ Check this
- Click **"Create bucket"**

### Step 2: Set Storage Policies

For each bucket (`avatars` and `block-images`):

1. Click on the bucket name
2. Go to **Policies** tab
3. Click **"New Policy"**
4. Select **"For full customization"**
5. Create these policies:

**Policy 1: Public Read Access**
```sql
-- Name: Public read access
-- Allowed operation: SELECT
-- Policy definition:
true
```

**Policy 2: Authenticated Upload**
```sql
-- Name: Authenticated users can upload
-- Allowed operation: INSERT
-- Policy definition:
auth.role() = 'authenticated'
```

**Policy 3: Users can update their own files**
```sql
-- Name: Users can update own files
-- Allowed operation: UPDATE
-- Policy definition:
auth.uid()::text = (storage.foldername(name))[1]
```

---

## Environment Variables

### Step 1: Create .env.local File

```bash
cd /home/user/bento-clone
cp .env.example .env.local
```

### Step 2: Fill in Environment Variables

Edit `.env.local` with your values:

```env
# ==============================================
# SUPABASE CONFIGURATION
# ==============================================
# Get these from: Supabase Dashboard → Settings → API

# Project URL (format: https://xxxxx.supabase.co)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

# Anon/Public Key (starts with eyJhbG...)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Service Role Key (starts with eyJhbG..., KEEP SECRET!)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ==============================================
# OPENAI CONFIGURATION (Optional)
# ==============================================
# Get from: https://platform.openai.com/api-keys
# Only needed if you want AI chat features

OPENAI_API_KEY=sk-...

# ==============================================
# APPLICATION CONFIGURATION
# ==============================================
# Local development URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Production URL (after deployment)
# NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### Step 3: Verify Environment Variables

```bash
# Check if .env.local exists and is not empty
cat .env.local | grep -v "^#" | grep -v "^$"

# Expected output: Your actual values (without comments)
```

---

## Running the Application

### Step 1: Start Development Server

```bash
cd /home/user/bento-clone
npm run dev
```

Expected output:
```
▲ Next.js 14.0.4
- Local:        http://localhost:3000
- Ready in 2.5s
```

### Step 2: Open in Browser

Visit: [http://localhost:3000](http://localhost:3000)

You should see the Vario homepage.

### Step 3: Create Test Account

1. Click **"Get Started"** or **"Sign Up"**
2. Fill in:
   - **Email**: test@example.com
   - **Password**: Test123456
   - **Username**: testuser
   - **Display Name**: Test User
3. Click **"Sign Up"**
4. You should be redirected to `/dashboard`

### Step 4: Test Basic Features

1. **Dashboard**: Should load successfully
2. **Add a Text Block**:
   - Click "Add Block"
   - Select "Text"
   - Enter title and body
   - Click "Save"
3. **View Public Profile**: Visit `http://localhost:3000/testuser`
4. **Verify Block Appears**: Your text block should display

---

## Production Deployment

### Option 1: Deploy to Vercel (Recommended)

#### Step 1: Push to GitHub

```bash
cd /home/user/bento-clone

# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Vario link-in-bio platform"

# Create GitHub repository (via GitHub website or gh CLI)
# Then add remote and push
git remote add origin https://github.com/your-username/vario.git
git push -u origin main
```

#### Step 2: Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com)
2. Click **"New Project"**
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Add Environment Variables (same as `.env.local`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY` (optional)
   - `NEXT_PUBLIC_APP_URL` (use your Vercel URL)
6. Click **"Deploy"**
7. Wait 2-3 minutes for build to complete

#### Step 3: Update Supabase Settings

1. Go to Supabase Dashboard → **Authentication** → **URL Configuration**
2. Update these fields:
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs**: Add `https://your-app.vercel.app/**`
3. Click **"Save"**

#### Step 4: Test Production Deployment

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Sign up with a new account
3. Create a profile
4. Add blocks
5. View public profile at `/your-username`

---

### Option 2: Deploy to Other Platforms

Vario can also be deployed to:
- **Netlify** - Similar to Vercel
- **Cloudflare Pages** - Edge deployment
- **Railway** - Full-stack deployment
- **Your own VPS** - With Docker

See respective platform documentation for Next.js deployment.

---

## Troubleshooting

### Common Issues

#### 1. "Connection refused" when running npm run dev

**Solution:**
```bash
# Kill any process using port 3000
npx kill-port 3000

# Try again
npm run dev
```

#### 2. Supabase "Invalid API key" error

**Solution:**
- Double-check your `.env.local` file
- Make sure you copied the FULL key (very long string)
- No spaces or extra characters
- Restart dev server after changing env vars

#### 3. "Username already exists" when signing up

**Solution:**
- Try a different username
- Or clear database: Go to Supabase → Table Editor → users_profile → Delete all rows

#### 4. Images not uploading

**Solution:**
- Verify storage buckets are PUBLIC
- Check storage policies are set correctly
- Verify NEXT_PUBLIC_SUPABASE_URL is correct

#### 5. Build fails on Vercel

**Solution:**
```bash
# Test build locally first
npm run build

# If successful locally but fails on Vercel:
# - Check environment variables are set
# - Ensure Node version is 18+ in Vercel settings
```

#### 6. AI Chat not working

**Solution:**
- Verify OPENAI_API_KEY is set
- Check OpenAI account has credits
- See API route logs in Vercel dashboard

---

## Next Steps

### Customize Your Platform

1. **Add Custom Themes**
   - Edit `lib/utils/constants.ts`
   - Add new theme presets

2. **Modify Block Types**
   - Create new block components in `components/blocks/`
   - Update TypeScript types in `types/blocks.types.ts`
   - Add validation in `lib/utils/validators.ts`

3. **Enable OAuth Providers**
   - Go to Supabase → Authentication → Providers
   - Enable Google, GitHub, etc.
   - Add credentials

4. **Setup Custom Domain**
   - In Vercel: Settings → Domains
   - Add your domain
   - Update DNS records

### Monitoring & Analytics

1. **Vercel Analytics**
   - Enable in Vercel dashboard
   - Track page views, visitors

2. **Supabase Analytics**
   - View database usage
   - Monitor API calls

3. **Error Tracking**
   - Add Sentry integration
   - Monitor production errors

---

## Support

If you encounter issues:

1. Check this troubleshooting guide
2. Review Supabase logs: Dashboard → Logs
3. Check Vercel deployment logs
4. Review Next.js error messages
5. Open GitHub issue with details

---

## Checklist

Use this checklist to track your setup:

- [ ] Node.js 18+ installed
- [ ] Supabase account created
- [ ] Supabase project created
- [ ] Database schema executed
- [ ] Storage buckets created (avatars, block-images)
- [ ] Storage policies configured
- [ ] Environment variables configured
- [ ] Dependencies installed (`npm install`)
- [ ] Dev server runs (`npm run dev`)
- [ ] Can sign up and create account
- [ ] Can add blocks in dashboard
- [ ] Public profile page works
- [ ] Code pushed to GitHub
- [ ] Deployed to Vercel
- [ ] Production URL works
- [ ] Supabase redirect URLs updated

---

**Congratulations! 🎉 Your Vario platform is now live!**

Start sharing your `/username` link with the world!
