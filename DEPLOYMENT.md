# 🚀 Vario Deployment Guide

## Quick Deployment to Production

This guide covers deploying your Vario link-in-bio platform to production.

---

## Prerequisites

Before deploying, ensure you have:
- ✅ Completed local setup (see `INSTALLATION_GUIDE.md`)
- ✅ Tested application locally
- ✅ GitHub account
- ✅ Vercel account
- ✅ Supabase project configured

---

## Deployment Options

### Option 1: Vercel (Recommended) ⭐

**Pros**: 
- Zero configuration
- Automatic SSL
- Edge network globally
- Free tier generous
- Perfect for Next.js

**Cons**:
- Vendor lock-in
- Function execution limits

### Option 2: Netlify

**Pros**:
- Similar to Vercel
- Good free tier
- Easy setup

**Cons**:
- Slightly slower builds
- Less Next.js optimization

### Option 3: Self-Hosted

**Pros**:
- Full control
- No vendor lock-in
- Can use Docker

**Cons**:
- More maintenance
- Need to manage servers
- SSL certificates

---

## Deploy to Vercel (Detailed Steps)

### Step 1: Prepare Repository

```bash
cd /home/user/bento-clone

# Initialize git if not done
git init

# Create .gitignore
cat > .gitignore << 'EOF'
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
EOF

# Add all files
git add .

# Commit
git commit -m "Initial commit: Vario link-in-bio platform

Features:
- Complete Next.js 14 + TypeScript setup
- Supabase authentication and database
- 6 block types (text, image, button, social, embed, AI)
- 5 theme presets
- Analytics tracking
- Image upload system
- Row Level Security
- AI chat integration ready
"
```

### Step 2: Push to GitHub

```bash
# Create repository on GitHub
# Then add remote
git remote add origin https://github.com/YOUR_USERNAME/vario.git

# Push code
git branch -M main
git push -u origin main
```

### Step 3: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub repository
5. Click **"Import"**

### Step 4: Configure Project

**Framework Preset**: Next.js (auto-detected)

**Build Settings**:
- Build Command: `npm run build` (default)
- Output Directory: `.next` (default)
- Install Command: `npm install` (default)

**Root Directory**: `./` (keep default)

### Step 5: Add Environment Variables

Click **"Environment Variables"** and add these:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# OpenAI (Optional)
OPENAI_API_KEY=sk-...

# App URL (will update after deployment)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

**Important**: 
- Copy exact values from your `.env.local`
- Double-check for typos
- Don't include quotes around values

### Step 6: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. You'll get a URL like: `https://vario-xxx.vercel.app`

### Step 7: Update Environment Variables

After first deployment:

1. Go to **Settings** → **Environment Variables**
2. Edit `NEXT_PUBLIC_APP_URL`
3. Set to your Vercel URL: `https://your-app.vercel.app`
4. Click **"Save"**
5. Redeploy: **Deployments** → **...** → **"Redeploy"**

### Step 8: Update Supabase Settings

1. Go to Supabase Dashboard
2. **Authentication** → **URL Configuration**
3. Update:
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs**: Add `https://your-app.vercel.app/**`
4. Click **"Save"**

### Step 9: Test Production

1. Visit your Vercel URL
2. Sign up with test account
3. Create profile and add blocks
4. Visit `/your-username` to see public page
5. Test all features

---

## Custom Domain Setup

### Step 1: Add Domain in Vercel

1. Go to **Settings** → **Domains**
2. Add your domain (e.g., `vario.com`)
3. Vercel will provide DNS records

### Step 2: Update DNS

Add these records at your DNS provider:

**For root domain (vario.com)**:
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain**:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Step 3: Wait for DNS Propagation

- Usually takes 5-60 minutes
- Can take up to 48 hours
- Check status in Vercel dashboard

### Step 4: Update URLs

Once domain is active:

1. Update `NEXT_PUBLIC_APP_URL` in Vercel env vars
2. Update Supabase redirect URLs
3. Redeploy

---

## Production Optimizations

### 1. Enable Vercel Analytics

```bash
# Install Vercel Analytics
npm install @vercel/analytics

# Add to app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### 2. Add Speed Insights

```bash
# Install Speed Insights
npm install @vercel/speed-insights

# Add to app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
```

### 3. Configure Image Optimization

Update `next.config.js`:

```javascript
const nextConfig = {
  images: {
    domains: ['your-project.supabase.co'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
}
```

### 4. Enable Compression

Vercel automatically enables:
- Gzip compression
- Brotli compression
- Image optimization
- CDN caching

### 5. Set Cache Headers

Create `middleware.ts` at root:

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Cache static assets for 1 year
  if (request.nextUrl.pathname.startsWith('/static/')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }
  
  return response
}
```

---

## Monitoring & Maintenance

### 1. Vercel Dashboard

Monitor:
- Deployments status
- Build logs
- Function logs
- Analytics data

### 2. Supabase Dashboard

Check:
- Database usage
- Storage usage
- API calls
- Active users

### 3. Error Tracking

Install Sentry:

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### 4. Uptime Monitoring

Use services like:
- UptimeRobot (free)
- Pingdom
- StatusCake

---

## Troubleshooting

### Build Fails

**Check**:
1. TypeScript errors: `npm run build` locally
2. Environment variables set correctly
3. Dependencies installed: Clear cache and reinstall
4. Node version: Vercel uses Node 18 by default

**Fix**:
```bash
# Add to package.json
"engines": {
  "node": ">=18.0.0"
}
```

### 404 on Dynamic Routes

**Check**:
1. `app/[username]/page.tsx` exists
2. No typos in file name
3. Rebuild and redeploy

### Authentication Not Working

**Check**:
1. Supabase redirect URLs include Vercel domain
2. Environment variables correct
3. Supabase project active
4. Check Vercel function logs

### Images Not Loading

**Check**:
1. Supabase storage buckets are public
2. `next.config.js` includes Supabase domain
3. Storage policies correct
4. File uploaded successfully

### Slow Performance

**Optimize**:
1. Enable Vercel Edge Network
2. Add Next.js Image component
3. Lazy load components
4. Reduce bundle size
5. Use CDN for static assets

---

## Scaling Considerations

### Database

**Supabase Free Tier Limits**:
- 500MB database
- 1GB file storage
- 50,000 monthly active users

**When to upgrade**:
- Database > 400MB → Pro plan ($25/mo)
- Storage > 800MB → Pro plan
- > 40,000 MAU → Pro plan

### Hosting

**Vercel Free Tier Limits**:
- 100GB bandwidth/month
- 6,000 build minutes/month
- 100 deployments/day

**When to upgrade**:
- > 80GB bandwidth → Pro plan ($20/mo)
- Need team collaboration → Team plan
- Need SLA → Enterprise

### Performance

**Optimization Checklist**:
- [ ] Enable Redis cache (Vercel KV)
- [ ] Use Incremental Static Regeneration
- [ ] Implement pagination
- [ ] Add database indexes
- [ ] Optimize images
- [ ] Lazy load components
- [ ] Use React Server Components

---

## Backup Strategy

### 1. Database Backups

Supabase automatically backs up:
- Daily backups (7 days retention on free tier)
- Point-in-time recovery (Pro plan)

**Manual backup**:
```bash
# Export database
npx supabase db dump > backup-$(date +%Y%m%d).sql

# Save to S3 or GitHub
```

### 2. Code Backups

- Git repository (GitHub)
- Multiple branches
- Regular commits

### 3. Storage Backups

- Supabase Storage has built-in redundancy
- Consider downloading important assets

---

## Security Checklist

Before going live:

- [ ] All environment variables are secret
- [ ] Supabase RLS policies enabled
- [ ] API routes protected
- [ ] Input validation on all forms
- [ ] Rate limiting configured
- [ ] CORS configured properly
- [ ] HTTPS only (Vercel default)
- [ ] Security headers set
- [ ] Dependencies updated
- [ ] No secrets in code
- [ ] .env files in .gitignore
- [ ] Service role key not exposed

---

## Post-Deployment

### Day 1
- [ ] Test all features in production
- [ ] Sign up with real account
- [ ] Create test profile
- [ ] Add all block types
- [ ] Test image uploads
- [ ] Verify analytics tracking
- [ ] Check email notifications (if enabled)
- [ ] Test on mobile devices

### Week 1
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Review analytics data
- [ ] Gather user feedback
- [ ] Fix critical bugs

### Month 1
- [ ] Review costs
- [ ] Optimize slow queries
- [ ] Add missing features
- [ ] Improve documentation
- [ ] Plan next features

---

## Rollback Plan

If deployment goes wrong:

### Quick Rollback (Vercel)

1. Go to **Deployments**
2. Find last working deployment
3. Click **"..."** → **"Promote to Production"**
4. Instant rollback (< 1 minute)

### Database Rollback

```bash
# Restore from backup
psql your-database < backup-20240101.sql

# Or use Supabase dashboard:
# Settings → Database → Restore from backup
```

---

## Success Metrics

Track these metrics:

### Technical
- Build time < 2 minutes
- Page load time < 2 seconds
- 99.9% uptime
- Zero critical errors

### Business
- User signups
- Active profiles
- Page views
- Block clicks
- Storage usage

---

## Congratulations! 🎉

Your Vario platform is now live in production!

**Next Steps**:
1. Share with beta users
2. Gather feedback
3. Iterate and improve
4. Scale as needed

**Support**:
- Vercel Discord
- Supabase Discord
- GitHub Issues

---

**Happy Deploying! 🚀**
