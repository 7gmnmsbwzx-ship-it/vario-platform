# Cloudflare Pages Environment Variables

## 🔐 **REQUIRED Environment Variables for Production**

Add these in **Cloudflare Dashboard → Workers & Pages → earnly-ai → Settings → Environment Variables → Production**:

### Supabase Configuration

```bash
NEXT_PUBLIC_SUPABASE_URL=https://ifhmmsxrbrqsclfnevfx.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmaG1tc3hyYnJxc2NsZm5ldmZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNzE3MzAsImV4cCI6MjA3OTY0NzczMH0.GkQTlz2hSqpJ6askrr7hRdz2edDFetNqzneHIE_Et4I

SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmaG1tc3hyYnJxc2NsZm5ldmZ4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDA3MTczMCwiZXhwIjoyMDc5NjQ3NzMwfQ.DkjWvfN8dWyTojEghO_5kRJsNsjbb8W-78htbLIlJqU
```

### AI Configuration (OpenRouter with X.AI Grok)

```bash
OPENROUTER_API_KEY=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

OPENROUTER_MODEL=x-ai/grok-2-1212:free
```

### Application Configuration

```bash
NEXT_PUBLIC_APP_URL=https://earnly-ai.pages.dev
```

**OR if using custom domain:**

```bash
NEXT_PUBLIC_APP_URL=https://getearnly.com
```

### Node Version

```bash
NODE_VERSION=18
```

---

## 📋 **Step-by-Step: How to Add These**

1. **Go to Cloudflare Dashboard**
   - Visit: https://dash.cloudflare.com
   - Navigate to **Workers & Pages**

2. **Select Your Project**
   - Click on **`earnly-ai`**

3. **Access Environment Variables**
   - Go to **Settings** tab
   - Find **Environment variables** section
   - Click **Add variables**

4. **Add Each Variable**
   - Click **+ Add variable** for each one
   - Copy the **Variable name** exactly (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
   - Copy the **Value** exactly (e.g., `https://ifhmmsxrbrqsclfnevfx.supabase.co`)
   - Select **Production** environment
   - Click **Save**

5. **Repeat for All Variables**
   - Add all 7 variables listed above
   - Make sure there are no extra spaces or line breaks

6. **Deploy**
   - After adding all variables, trigger a new deployment
   - Or wait for next git push to auto-deploy

---

## 🔍 **Quick Copy-Paste List**

For easy copying, here are all the variables in one block:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ifhmmsxrbrqsclfnevfx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmaG1tc3hyYnJxc2NsZm5ldmZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNzE3MzAsImV4cCI6MjA3OTY0NzczMH0.GkQTlz2hSqpJ6askrr7hRdz2edDFetNqzneHIE_Et4I
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmaG1tc3hyYnJxc2NsZm5ldmZ4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDA3MTczMCwiZXhwIjoyMDc5NjQ3NzMwfQ.DkjWvfN8dWyTojEghO_5kRJsNsjbb8W-78htbLIlJqU
OPENROUTER_API_KEY=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
OPENROUTER_MODEL=x-ai/grok-2-1212:free
NEXT_PUBLIC_APP_URL=https://getearnly.com
NODE_VERSION=18
```

---

## 📊 **Supabase Project Details**

- **Project Reference**: ifhmmsxrbrqsclfnevfx
- **Project URL**: https://ifhmmsxrbrqsclfnevfx.supabase.co
- **Dashboard**: https://supabase.com/dashboard/project/ifhmmsxrbrqsclfnevfx

### Database Tables Required:
- `users_profile`
- `blocks`
- `themes`
- `page_analytics`
- `ai_conversations`

### Storage Buckets Required:
- `avatars`
- `block-images`

---

## ✅ **Verification**

After adding environment variables and deploying:

1. Check if app loads: https://earnly-ai.pages.dev
2. Try signing up with a new account
3. Check if Supabase connection works
4. Verify database operations (create profile, add blocks)
5. Test AI chat functionality

---

## 🚨 **Important Security Notes**

- ✅ `NEXT_PUBLIC_*` variables are safe to expose (frontend accessible)
- 🔒 `SUPABASE_SERVICE_ROLE_KEY` must be kept secret (backend only)
- 🔒 `OPENROUTER_API_KEY` must be kept secret (backend only)
- These keys are already committed to `.env.local` but that file should be in `.gitignore`

---

## 🔄 **If Keys Need Rotation**

To regenerate Supabase keys:
1. Go to https://supabase.com/dashboard/project/ifhmmsxrbrqsclfnevfx
2. Navigate to **Settings → API**
3. Copy new keys and update in Cloudflare
