# Cloudflare Pages Deployment Guide for Vario Platform

## ✅ **COMPLETED STEPS**

1. **GitHub Repository Created**: ✅
   - Repository: https://github.com/7gmnmsbwzx-ship-it/vario-platform
   - All code pushed successfully
   - Main branch configured

2. **Build Configuration Added**: ✅
   - `.nvmrc` - Node version 18
   - `.node-version` - Node version 18  
   - `.cloudflare-build-config.json` - Build settings
   - `wrangler.jsonc` - Cloudflare configuration

3. **Cloudflare Pages Project Exists**: ✅
   - Project name: `earnly-ai`
   - URL: https://earnly-ai.pages.dev
   - Custom domain: https://getearnly.com
   - D1 Database configured

## 🔧 **REQUIRED: Connect GitHub to Cloudflare Pages**

Since GitHub OAuth integration requires dashboard access, follow these steps:

### Step 1: Access Cloudflare Dashboard
1. Go to https://dash.cloudflare.com
2. Log in with your account (joechai9632@gmail.com)
3. Navigate to **Workers & Pages**

### Step 2: Select Your Project
1. Find and click on the **`earnly-ai`** project
2. Go to **Settings** tab

### Step 3: Connect GitHub Repository
1. Scroll to **Source** section
2. Click **Connect to Git**
3. Choose **GitHub** and authorize Cloudflare Pages
4. Select repository: **7gmnmsbwzx-ship-it/vario-platform**
5. Configure build settings:

#### Build Configuration:
```
Framework preset: Next.js
Build command: npm install --legacy-peer-deps && npx @cloudflare/next-on-pages
Build output directory: .vercel/output/static
Root directory: /
Production branch: main
```

#### Environment Variables (REQUIRED):
Add these in **Settings → Environment Variables → Production**:
```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
NODE_VERSION=18
```

### Step 4: Deploy
1. Click **Save and Deploy**
2. Cloudflare will automatically build and deploy
3. Future git pushes will trigger automatic deployments

## 🚀 **ALTERNATIVE: Manual Deployment (Immediate)**

If you want to deploy immediately without GitHub connection:

### Option A: Direct Wrangler Deploy
```bash
cd /home/user/bento-clone
npm run pages:build
npx wrangler pages deploy .vercel/output/static --project-name=earnly-ai --commit-dirty=true
```

### Option B: Create New Project with Direct Upload
```bash
cd /home/user/bento-clone
npx wrangler pages project create vario-platform --production-branch=main
npm run pages:build
npx wrangler pages deploy .vercel/output/static --project-name=vario-platform
```

## 📊 **Deployment URLs**

After deployment, your app will be available at:
- **Production**: https://earnly-ai.pages.dev
- **Custom Domain**: https://getearnly.com
- **Branch deploys**: https://[branch].earnly-ai.pages.dev

## 🔍 **Troubleshooting**

### Build Fails with Next.js Version Error
If build fails, add this to `package.json` scripts:
```json
"pages:build": "npm install next@latest --legacy-peer-deps && npx @cloudflare/next-on-pages"
```

### D1 Database Not Accessible
Make sure D1 bindings are configured in **Settings → Functions → D1 database bindings**:
```
Binding name: DB
Database: <your-d1-database-id>
```

### Environment Variables Missing
Double-check all Supabase environment variables are set in production environment.

## 📝 **Post-Deployment Checklist**

- [ ] Access https://earnly-ai.pages.dev to verify deployment
- [ ] Test login functionality
- [ ] Test Supabase connection (sign up/sign in)
- [ ] Check D1 database connectivity
- [ ] Verify custom domain (https://getearnly.com)
- [ ] Test all dashboard features
- [ ] Verify block creation works

## 🆘 **Need Help?**

If you encounter issues:
1. Check **Deployment logs** in Cloudflare dashboard
2. Verify all environment variables are set
3. Ensure GitHub repository has latest code
4. Check build command output for errors

## 📚 **Additional Resources**

- Cloudflare Pages Docs: https://developers.cloudflare.com/pages/
- Next.js on Cloudflare: https://developers.cloudflare.com/pages/framework-guides/nextjs/
- @cloudflare/next-on-pages: https://github.com/cloudflare/next-on-pages
