-- Vario Platform - Initial Database Schema
-- This migration creates all tables, indexes, and Row Level Security policies

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS_PROFILE TABLE
-- Stores user profile information and settings
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.users_profile (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  theme_id INTEGER DEFAULT 1,
  is_public BOOLEAN DEFAULT true,
  custom_domain TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 30),
  CONSTRAINT username_format CHECK (username ~ '^[a-z0-9_-]+$'),
  CONSTRAINT display_name_length CHECK (char_length(display_name) >= 1 AND char_length(display_name) <= 50),
  CONSTRAINT bio_length CHECK (char_length(bio) <= 500)
);

-- Indexes for users_profile
CREATE INDEX IF NOT EXISTS idx_users_profile_username ON public.users_profile(username);
CREATE INDEX IF NOT EXISTS idx_users_profile_created_at ON public.users_profile(created_at);

-- RLS Policies for users_profile
ALTER TABLE public.users_profile ENABLE ROW LEVEL SECURITY;

-- Users can view public profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.users_profile
  FOR SELECT
  USING (is_public = true);

-- Users can view their own profile (even if not public)
CREATE POLICY "Users can view own profile"
  ON public.users_profile
  FOR SELECT
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON public.users_profile
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.users_profile
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can delete their own profile
CREATE POLICY "Users can delete own profile"
  ON public.users_profile
  FOR DELETE
  USING (auth.uid() = id);

-- ============================================================================
-- BLOCKS TABLE
-- Stores content blocks (links, text, images, embeds) for user profiles
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users_profile(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('link', 'text', 'image', 'embed', 'video', 'social')),
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for blocks
CREATE INDEX IF NOT EXISTS idx_blocks_user_id ON public.blocks(user_id);
CREATE INDEX IF NOT EXISTS idx_blocks_order_index ON public.blocks(order_index);
CREATE INDEX IF NOT EXISTS idx_blocks_is_visible ON public.blocks(is_visible);
CREATE INDEX IF NOT EXISTS idx_blocks_user_id_order ON public.blocks(user_id, order_index);

-- RLS Policies for blocks
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;

-- Anyone can view visible blocks for public profiles
CREATE POLICY "Public blocks are viewable by everyone"
  ON public.blocks
  FOR SELECT
  USING (
    is_visible = true 
    AND EXISTS (
      SELECT 1 FROM public.users_profile 
      WHERE users_profile.id = blocks.user_id 
      AND users_profile.is_public = true
    )
  );

-- Users can view all their own blocks
CREATE POLICY "Users can view own blocks"
  ON public.blocks
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own blocks
CREATE POLICY "Users can insert own blocks"
  ON public.blocks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own blocks
CREATE POLICY "Users can update own blocks"
  ON public.blocks
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own blocks
CREATE POLICY "Users can delete own blocks"
  ON public.blocks
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- AI_CONVERSATIONS TABLE
-- Stores AI chat conversations and message history
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users_profile(id) ON DELETE CASCADE,
  visitor_id TEXT NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for ai_conversations
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON public.ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_visitor_id ON public.ai_conversations(visitor_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_created_at ON public.ai_conversations(created_at);

-- RLS Policies for ai_conversations
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

-- Users can view their own conversations
CREATE POLICY "Users can view own conversations"
  ON public.ai_conversations
  FOR SELECT
  USING (auth.uid() = user_id);

-- Anyone can insert conversations (for visitor chat)
CREATE POLICY "Anyone can insert conversations"
  ON public.ai_conversations
  FOR INSERT
  WITH CHECK (true);

-- Users can update their own conversations
CREATE POLICY "Users can update own conversations"
  ON public.ai_conversations
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Anyone can update their visitor conversations
CREATE POLICY "Visitors can update own conversations"
  ON public.ai_conversations
  FOR UPDATE
  USING (visitor_id IS NOT NULL);

-- ============================================================================
-- PAGE_ANALYTICS TABLE
-- Stores page views, clicks, and interaction analytics
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.page_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users_profile(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('page_view', 'block_click', 'ai_chat_message', 'profile_share')),
  event_data JSONB DEFAULT '{}'::jsonb,
  visitor_id TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for page_analytics
CREATE INDEX IF NOT EXISTS idx_page_analytics_user_id ON public.page_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_page_analytics_event_type ON public.page_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_page_analytics_created_at ON public.page_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_page_analytics_visitor_id ON public.page_analytics(visitor_id);

-- RLS Policies for page_analytics
ALTER TABLE public.page_analytics ENABLE ROW LEVEL SECURITY;

-- Users can view their own analytics
CREATE POLICY "Users can view own analytics"
  ON public.page_analytics
  FOR SELECT
  USING (auth.uid() = user_id);

-- Anyone can insert analytics (for tracking)
CREATE POLICY "Anyone can insert analytics"
  ON public.page_analytics
  FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- USER_ANALYTICS_SUMMARY VIEW
-- Provides aggregated analytics for users
-- ============================================================================

CREATE OR REPLACE VIEW public.user_analytics_summary AS
SELECT 
  user_id,
  COUNT(CASE WHEN event_type = 'page_view' THEN 1 END) as total_page_views,
  COUNT(CASE WHEN event_type = 'block_click' THEN 1 END) as total_block_clicks,
  COUNT(CASE WHEN event_type = 'ai_chat_message' THEN 1 END) as total_ai_chats,
  COUNT(DISTINCT visitor_id) as unique_visitors,
  COUNT(DISTINCT DATE(created_at)) as active_days,
  MAX(created_at) as last_activity
FROM public.page_analytics
GROUP BY user_id;

-- Grant access to the view
GRANT SELECT ON public.user_analytics_summary TO authenticated;
GRANT SELECT ON public.user_analytics_summary TO anon;

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_profile_updated_at
  BEFORE UPDATE ON public.users_profile
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blocks_updated_at
  BEFORE UPDATE ON public.blocks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_conversations_updated_at
  BEFORE UPDATE ON public.ai_conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- STORAGE BUCKETS
-- For storing avatars and block images
-- ============================================================================

-- Create avatars bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create block-images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('block-images', 'block-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for block-images
CREATE POLICY "Block images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'block-images');

CREATE POLICY "Users can upload block images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'block-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their block images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'block-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their block images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'block-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================================
-- INITIAL DATA (Optional)
-- ============================================================================

-- You can add initial theme data or other seed data here if needed

-- ============================================================================
-- GRANTS
-- ============================================================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE public.users_profile IS 'Stores user profile information and settings';
COMMENT ON TABLE public.blocks IS 'Stores content blocks for user profiles';
COMMENT ON TABLE public.ai_conversations IS 'Stores AI chat conversations and history';
COMMENT ON TABLE public.page_analytics IS 'Stores analytics events and tracking data';
COMMENT ON VIEW public.user_analytics_summary IS 'Aggregated analytics summary per user';
