# 🚀 Vario Platform - Cloudflare Pages Manual Deployment Guide

## ⚠️ Important Update

The `@cloudflare/next-on-pages` adapter has been **deprecated** and recommends using OpenNext instead. Given the complexities with Next.js versions and adapter compatibility, the **best approach** is to deploy via the Cloudflare Dashboard with GitHub integration.

---

## ✅ **Recommended Deployment Method: GitHub + Cloudflare Dashboard**

This method allows Cloudflare to handle the build process automatically.

### Step 1: Push Latest Code to GitHub

```bash
cd /home/user/bento-clone
git add .
git commit -m "chore: Prepare for Cloudflare Pages deployment"
git push origin main
```

**Note**: GitHub push may require authentication setup.

---

### Step 2: Connect GitHub to Cloudflare Pages

1. **Go to Cloudflare Dashboard**
   - URL: `https://dash.cloudflare.com`
   - Login: `joechai9632@gmail.com`

2. **Create New Pages Project**
   - Navigate: **Workers & Pages**
   - Click: **Create application**
   - Select: **Pages** tab
   - Click: **Connect to Git**

3. **Authorize GitHub**
   - Click: **GitHub**
   - Authorize: Cloudflare to access your repositories
   - Select repository: `7gmnmsbwzx-ship-it/vario-platform`

4. **Configure Build Settings**
   ```
   Project name: vario-platform
   Production branch: main
   Framework preset: Next.js
   Build command: npm install --legacy-peer-deps && npm run build
   Build output directory: .next
   Root directory: (leave empty or /)
   ```

5. **Environment Variables**
   Click **Add variable** for each:
   
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://ifhmmsxrbrqsclfnevfx.supabase.co
   
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmaG1tc3hyYnJxc2NsZm5ldmZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNzE3MzAsImV4cCI6MjA3OTY0NzczMH0.GkQTlz2hSqpJ6askrr7hRdz2edDFetNqzneHIE_Et4I
   
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmaG1tc3hyYnJxc2NsZm5ldmZ4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDA3MTczMCwiZXhwIjoyMDc5NjQ3NzMwfQ.DkjWvfN8dWyTojEghO_5kRJsNsjbb8W-78htbLIlJqU
   
   OPENROUTER_API_KEY=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
   
   OPENROUTER_MODEL=x-ai/grok-2-1212:free
   
   NEXT_PUBLIC_APP_URL=https://vario-platform.pages.dev
   
   NODE_VERSION=18
   ```

6. **Deploy**
   - Click: **Save and Deploy**
   - Wait: 5-10 minutes for build

7. **Get Your URL**
   - Production: `https://vario-platform.pages.dev`
   - Preview: `https://[commit-hash].vario-platform.pages.dev`

---

## 🔄 Alternative: Direct Upload (If GitHub Connection Fails)

If you cannot connect GitHub or prefer manual deployment:

### Option A: Use Wrangler CLI (Simpler)

```bash
cd /home/user/bento-clone

# Build the project
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy .next --project-name vario-platform
```

### Option B: Create Production Build Archive

```bash
cd /home/user/bento-clone

# Build the project
npm run build

# Create deployment archive
tar -czf vario-platform-deploy.tar.gz .next next.config.js package.json public

# Then upload via Cloudflare Dashboard > Pages > Upload assets
```

---

## 📋 After Successful Deployment

### Step 1: Get Your Production URL

After deployment completes, you'll receive:
- Production URL: `https://vario-platform.pages.dev`
- Or custom domain if configured

### Step 2: Update earnly-ai Redirect

```bash
cd /home/user/earnly-ai-2.0
```

Edit `src/index.tsx` (Line 1710-1714):
```typescript
app.get('/vario', (c) => {
  // Redirect to the new Vario link-in-bio platform
  return c.redirect('https://vario-platform.pages.dev')
})
```

Rebuild and deploy:
```bash
npm run build
npx wrangler pages deploy dist --project-name earnly-ai --commit-dirty=true
```

### Step 3: Test Everything

1. **Test Vario Platform**:
   - Visit: `https://vario-platform.pages.dev`
   - Sign up/login
   - Create profile
   - Add blocks

2. **Test Redirect**:
   - Visit: `https://getearnly.com/vario`
   - Should redirect to: `https://vario-platform.pages.dev`

---

## 🎯 Custom Domain Setup (Optional)

To use `vario.getearnly.com` instead of `.pages.dev`:

1. **In Cloudflare Pages Project**:
   - Go to: Settings → Custom domains
   - Click: **Set up a custom domain**
   - Enter: `vario.getearnly.com`
   - Click: **Activate domain**

2. **DNS Configuration** (Automatic):
   - Cloudflare will automatically configure DNS
   - Wait 1-2 minutes for propagation

3. **Update Redirect**:
   ```typescript
   return c.redirect('https://vario.getearnly.com')
   ```

---

## ⚠️ Troubleshooting

### Build Fails

**Issue**: `@cloudflare/next-on-pages` adapter errors

**Solution**: Don't use the adapter. Deploy with standard Next.js build:
- Build command: `npm install --legacy-peer-deps && npm run build`
- Build output: `.next`
- Let Cloudflare handle the deployment

### Environment Variables Not Working

**Issue**: App can't connect to Supabase

**Solution**:
1. Check all 7 environment variables are added
2. Verify no extra spaces in values
3. Redeploy after adding variables

### GitHub Connection Fails

**Issue**: Can't authorize Cloudflare to access GitHub

**Solution**:
1. Go to GitHub Settings → Applications → Cloudflare Pages
2. Grant access to `vario-platform` repository
3. Or use Wrangler CLI direct upload instead

### Next.js Version Issues

**Issue**: Adapter requires specific Next.js version

**Solution**: Use the standard Next.js build without the Cloudflare adapter:
```json
{
  "scripts": {
    "build": "next build"
  }
}
```

---

## 📊 Build Configuration Comparison

| Method | Complexity | Speed | Recommended |
|--------|------------|-------|-------------|
| GitHub + Dashboard | Easy | Fast | ✅ **YES** |
| Wrangler CLI | Medium | Fast | ⚠️ If GitHub fails |
| Manual Upload | Hard | Slow | ❌ Last resort |
| Cloudflare Adapter | Complex | N/A | ❌ Deprecated |

---

## 🎯 Recommended Actions

###  **Immediate: Set Up GitHub Connection**

This is the cleanest, most maintainable approach:

1. ✅ Code is ready in: `https://github.com/7gmnmsbwzx-ship-it/vario-platform`
2. ⏳ Connect repo to Cloudflare Pages via dashboard
3. ⏳ Add environment variables
4. ⏳ Deploy (automatic)
5. ⏳ Update redirect in earnly-ai project

### **Fallback: Wrangler CLI**

If GitHub connection doesn't work:

```bash
cd /home/user/bento-clone
npm run build
npx wrangler pages deploy .next --project-name vario-platform
```

---

## 📞 Next Steps

**Would you like me to:**

1. **Guide you through GitHub + Dashboard deployment** (recommended)
2. **Try Wrangler CLI direct upload** (faster but manual)
3. **Set up custom domain** (vario.getearnly.com)
4. **Deploy to Vercel instead** (easier alternative)

Let me know which approach you'd like to take!

---

**Created**: December 7, 2025  
**Status**: Ready for deployment  
**Method**: GitHub + Cloudflare Dashboard (recommended)  
**Fallback**: Wrangler CLI direct upload
