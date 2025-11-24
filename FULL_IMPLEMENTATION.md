# 🎨 Complete Bento.me Clone - Full Implementation Guide

## 100% Feature Parity with Bento.me

**Stack**: Next.js 14, TypeScript, Supabase, Tailwind CSS, shadcn/ui

---

## 🚀 Step 1: Initial Setup (5 minutes)

### Create Next.js Project

\`\`\`bash
npx create-next-app@latest bento-clone --typescript --tailwind --app --no-src-dir --import-alias "@/*" --yes
cd bento-clone
\`\`\`

### Install Dependencies

\`\`\`bash
# Core dependencies
npm install @supabase/supabase-js @supabase/ssr zod react-hook-form @hookform/resolvers

# UI Components
npm install @radix-ui/react-avatar @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-select @radix-ui/react-slot @radix-ui/react-tabs @radix-ui/react-toast
npm install class-variance-authority clsx tailwind-merge lucide-react

# Drag and Drop
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

# Image Upload
npm install react-dropzone

# Optional: AI Features
npm install openai
\`\`\`

### Initialize shadcn/ui

\`\`\`bash
npx shadcn-ui@latest init -d

# Add components
npx shadcn-ui@latest add button input label card dialog dropdown-menu avatar textarea select tabs toast
\`\`\`

---

## 📊 Step 2: Supabase Database Setup (10 minutes)

### Complete SQL Migration

Run this in Supabase SQL Editor:

\`\`\`sql
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users Profile Table
CREATE TABLE public.users_profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  theme_id TEXT DEFAULT 'default',
  is_public BOOLEAN DEFAULT true,
  custom_css TEXT,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 30),
  CONSTRAINT username_format CHECK (username ~ '^[a-z0-9_-]+$')
);

-- Blocks Table
CREATE TABLE public.blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('text', 'image', 'button', 'social_links', 'embed', 'heading', 'divider', 'link', 'map')),
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  settings JSONB DEFAULT '{}'::jsonb,
  position_x INTEGER DEFAULT 0,
  position_y INTEGER DEFAULT 0,
  width INTEGER DEFAULT 1,
  height INTEGER DEFAULT 1,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Themes Table
CREATE TABLE public.themes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  config JSONB NOT NULL,
  preview_url TEXT,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics Table
CREATE TABLE public.page_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB,
  visitor_id TEXT,
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  country TEXT,
  city TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_blocks_user_order ON blocks(user_id, order_index);
CREATE INDEX idx_blocks_user_position ON blocks(user_id, position_y, position_x);
CREATE INDEX idx_users_profile_username ON users_profile(username);
CREATE INDEX idx_analytics_user_created ON page_analytics(user_id, created_at DESC);
CREATE INDEX idx_analytics_event ON page_analytics(event_type, created_at DESC);

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true), ('blocks', 'blocks', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public avatar access" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users upload own avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users update own avatar" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users delete own avatar" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Public block access" ON storage.objects FOR SELECT USING (bucket_id = 'blocks');
CREATE POLICY "Users upload own blocks" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'blocks' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users update own blocks" ON storage.objects FOR UPDATE USING (bucket_id = 'blocks' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users delete own blocks" ON storage.objects FOR DELETE USING (bucket_id = 'blocks' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Row Level Security
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_analytics ENABLE ROW LEVEL SECURITY;

-- Users Profile Policies
CREATE POLICY "Public profiles viewable" ON users_profile FOR SELECT USING (is_public = true);
CREATE POLICY "Users view own profile" ON users_profile FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own profile" ON users_profile FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users insert own profile" ON users_profile FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Blocks Policies
CREATE POLICY "Public blocks viewable" ON blocks FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users_profile
    WHERE users_profile.user_id = blocks.user_id
    AND users_profile.is_public = true
  ) AND is_visible = true
);
CREATE POLICY "Users view own blocks" ON blocks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own blocks" ON blocks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own blocks" ON blocks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own blocks" ON blocks FOR DELETE USING (auth.uid() = user_id);

-- Analytics Policies
CREATE POLICY "Users view own analytics" ON page_analytics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone insert analytics" ON page_analytics FOR INSERT WITH CHECK (true);

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_users_profile_updated_at BEFORE UPDATE ON users_profile FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_blocks_updated_at BEFORE UPDATE ON blocks FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Insert default themes
INSERT INTO themes (id, name, description, config) VALUES
('default', 'Default', 'Clean and minimal', '{
  "backgroundColor": "#ffffff",
  "textColor": "#000000",
  "primaryColor": "#3b82f6",
  "fontFamily": "Inter",
  "borderRadius": "12px",
  "cardBackground": "#f9fafb",
  "cardBorder": "#e5e7eb"
}'::jsonb),

('dark', 'Dark Mode', 'Easy on the eyes', '{
  "backgroundColor": "#0f172a",
  "textColor": "#f1f5f9",
  "primaryColor": "#6366f1",
  "fontFamily": "Inter",
  "borderRadius": "16px",
  "cardBackground": "#1e293b",
  "cardBorder": "#334155"
}'::jsonb),

('gradient', 'Gradient', 'Vibrant and modern', '{
  "backgroundColor": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "textColor": "#ffffff",
  "primaryColor": "#ffffff",
  "fontFamily": "Inter",
  "borderRadius": "20px",
  "cardBackground": "rgba(255,255,255,0.1)",
  "cardBorder": "rgba(255,255,255,0.2)"
}'::jsonb),

('minimal', 'Minimal', 'Simple elegance', '{
  "backgroundColor": "#fafafa",
  "textColor": "#171717",
  "primaryColor": "#000000",
  "fontFamily": "Inter",
  "borderRadius": "8px",
  "cardBackground": "#ffffff",
  "cardBorder": "#e5e5e5"
}'::jsonb),

('warm', 'Warm', 'Cozy and inviting', '{
  "backgroundColor": "#fef3c7",
  "textColor": "#78350f",
  "primaryColor": "#ea580c",
  "fontFamily": "Inter",
  "borderRadius": "16px",
  "cardBackground": "#ffffff",
  "cardBorder": "#fed7aa"
}'::jsonb);
\`\`\`

---

## 📁 Step 3: Project Structure

\`\`\`
bento-clone/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   ├── analytics/page.tsx
│   │   │   └── settings/page.tsx
│   │   └── layout.tsx
│   ├── [username]/
│   │   ├── page.tsx
│   │   └── opengraph-image.tsx
│   ├── api/
│   │   └── analytics/route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/                 # shadcn components
│   ├── blocks/            # Block components
│   ├── editor/            # Dashboard editor
│   ├── public/            # Public page
│   └── auth/              # Auth forms
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── actions/
│   │   ├── auth.ts
│   │   ├── profile.ts
│   │   ├── blocks.ts
│   │   └── analytics.ts
│   └── utils.ts
├── types/
│   ├── database.ts
│   └── blocks.ts
├── middleware.ts
├── next.config.js
├── tailwind.config.ts
└── package.json
\`\`\`

---

## 🔧 Step 4: Environment Variables

Create \`.env.local\`:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

---

## 📝 Step 5: Core Files

### \`types/database.ts\`

\`\`\`typescript
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type BlockType = 'text' | 'image' | 'button' | 'social_links' | 'embed' | 'heading' | 'divider' | 'link' | 'map'

export interface UserProfile {
  id: string
  user_id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  theme_id: string
  is_public: boolean
  custom_css: string | null
  meta_title: string | null
  meta_description: string | null
  created_at: string
  updated_at: string
}

export interface Block {
  id: string
  user_id: string
  type: BlockType
  content: BlockContent
  settings: BlockSettings
  position_x: number
  position_y: number
  width: number
  height: number
  order_index: number
  is_visible: boolean
  created_at: string
  updated_at: string
}

export interface BlockContent {
  [key: string]: any
}

export interface BlockSettings {
  backgroundColor?: string
  textColor?: string
  borderRadius?: string
  padding?: string
  alignment?: 'left' | 'center' | 'right'
}

export interface Theme {
  id: string
  name: string
  description: string | null
  config: ThemeConfig
  preview_url: string | null
  is_premium: boolean
}

export interface ThemeConfig {
  backgroundColor: string
  textColor: string
  primaryColor: string
  fontFamily: string
  borderRadius: string
  cardBackground: string
  cardBorder: string
}
\`\`\`

### \`lib/supabase/client.ts\`

\`\`\`typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
\`\`\`

### \`lib/supabase/server.ts\`

\`\`\`typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {}
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {}
        },
      },
    }
  )
}
\`\`\`

### \`middleware.ts\`

\`\`\`typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  await supabase.auth.getUser()
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
\`\`\`

---

*Continue to additional implementation files...*

## 🎯 Key Implementation Notes

1. **Bento Grid Layout**: Use CSS Grid with auto-placement
2. **Drag & Drop**: @dnd-kit for block reordering
3. **Real-time Preview**: Update dashboard preview instantly
4. **Image Upload**: Direct upload to Supabase Storage
5. **Analytics**: Track page views, clicks, geographic data
6. **SEO**: Dynamic metadata per user page
7. **Responsive**: Mobile-first with breakpoints

**Total Implementation Time**: 4-6 hours
**Total Files**: ~60 files
**Total Lines**: ~12,000 lines of code

Would you like me to continue with:
1. All component implementations?
2. Server actions code?
3. Complete dashboard editor?
4. Public page components?
5. Deploy to Vercel guide?
