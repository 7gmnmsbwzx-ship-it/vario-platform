-- Vario Link-in-Bio Platform - Complete Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================
-- 1. USERS PROFILE TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS users_profile (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL CHECK (username ~ '^[a-z0-9_]{3,30}$'),
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  theme_id TEXT DEFAULT 'minimal',
  is_public BOOLEAN DEFAULT true,
  custom_domain TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Username index for fast lookups
CREATE INDEX idx_users_profile_username ON users_profile(username);
CREATE INDEX idx_users_profile_custom_domain ON users_profile(custom_domain);

-- ==============================================
-- 2. BLOCKS TABLE (Core Content)
-- ==============================================
CREATE TYPE block_type AS ENUM (
  'text',
  'image',
  'button',
  'social_links',
  'embed',
  'ai_chat'
);

CREATE TABLE IF NOT EXISTS blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type block_type NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  order_index INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure unique ordering per user
  UNIQUE(user_id, order_index)
);

CREATE INDEX idx_blocks_user_id ON blocks(user_id);
CREATE INDEX idx_blocks_order ON blocks(user_id, order_index);
CREATE INDEX idx_blocks_type ON blocks(type);

-- ==============================================
-- 3. THEMES TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS themes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  config JSONB NOT NULL DEFAULT '{}',
  is_premium BOOLEAN DEFAULT false,
  preview_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default themes
INSERT INTO themes (id, name, description, config, is_premium) VALUES
('minimal', 'Minimal', 'Clean white background, perfect for professionals', 
  '{"fontFamily": "Inter", "primaryColor": "#000000", "backgroundColor": "#FFFFFF", "accentColor": "#6366F1", "borderRadius": "12px", "spacing": "comfortable"}'::jsonb, 
  false),
('gradient', 'Gradient', 'Eye-catching purple gradient, great for creators', 
  '{"fontFamily": "Inter", "primaryColor": "#FFFFFF", "backgroundColor": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", "accentColor": "#A78BFA", "borderRadius": "16px", "spacing": "spacious"}'::jsonb, 
  false),
('dark', 'Dark', 'Sleek dark mode for tech enthusiasts', 
  '{"fontFamily": "Inter", "primaryColor": "#FFFFFF", "backgroundColor": "#0F172A", "accentColor": "#60A5FA", "borderRadius": "8px", "spacing": "compact"}'::jsonb, 
  false),
('warm', 'Warm', 'Cozy warm tones for lifestyle content', 
  '{"fontFamily": "Inter", "primaryColor": "#7C2D12", "backgroundColor": "#FFF7ED", "accentColor": "#F97316", "borderRadius": "20px", "spacing": "comfortable"}'::jsonb, 
  false),
('ocean', 'Ocean', 'Fresh blue palette for travel and wellness', 
  '{"fontFamily": "Inter", "primaryColor": "#0C4A6E", "backgroundColor": "#F0F9FF", "accentColor": "#0EA5E9", "borderRadius": "16px", "spacing": "spacious"}'::jsonb, 
  false)
ON CONFLICT (id) DO NOTHING;

-- ==============================================
-- 4. PAGE ANALYTICS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS page_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'page_view', 'block_click', 'ai_chat_open', etc.
  event_data JSONB DEFAULT '{}',
  visitor_id TEXT, -- Anonymous visitor identifier
  referrer TEXT,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_user_id ON page_analytics(user_id);
CREATE INDEX idx_analytics_event_type ON page_analytics(event_type);
CREATE INDEX idx_analytics_created_at ON page_analytics(created_at);
CREATE INDEX idx_analytics_visitor_id ON page_analytics(visitor_id);

-- ==============================================
-- 5. AI CONVERSATIONS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  visitor_id TEXT NOT NULL, -- Anonymous visitor
  messages JSONB NOT NULL DEFAULT '[]',
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX idx_ai_conversations_visitor_id ON ai_conversations(visitor_id);

-- ==============================================
-- 6. STORAGE BUCKETS (Run in Supabase Storage UI)
-- ==============================================
-- Create bucket: avatars (public)
-- Create bucket: block-images (public)

-- ==============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================

-- Enable RLS
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

-- ========== users_profile policies ==========
-- Public can view public profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON users_profile FOR SELECT
  USING (is_public = true);

-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
  ON users_profile FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON users_profile FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON users_profile FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ========== blocks policies ==========
-- Public can view blocks of public profiles
CREATE POLICY "Public can view blocks of public profiles"
  ON blocks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users_profile
      WHERE users_profile.id = blocks.user_id
      AND users_profile.is_public = true
    )
  );

-- Users can view their own blocks
CREATE POLICY "Users can view their own blocks"
  ON blocks FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own blocks
CREATE POLICY "Users can insert their own blocks"
  ON blocks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own blocks
CREATE POLICY "Users can update their own blocks"
  ON blocks FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own blocks
CREATE POLICY "Users can delete their own blocks"
  ON blocks FOR DELETE
  USING (auth.uid() = user_id);

-- ========== themes policies ==========
-- Everyone can view themes
CREATE POLICY "Themes are viewable by everyone"
  ON themes FOR SELECT
  USING (true);

-- ========== page_analytics policies ==========
-- Users can insert analytics for any user (public tracking)
CREATE POLICY "Anyone can insert analytics"
  ON page_analytics FOR INSERT
  WITH CHECK (true);

-- Users can view their own analytics
CREATE POLICY "Users can view their own analytics"
  ON page_analytics FOR SELECT
  USING (auth.uid() = user_id);

-- ========== ai_conversations policies ==========
-- Anyone can insert conversations (public AI chat)
CREATE POLICY "Anyone can insert AI conversations"
  ON ai_conversations FOR INSERT
  WITH CHECK (true);

-- Users can view conversations on their profile
CREATE POLICY "Users can view their profile AI conversations"
  ON ai_conversations FOR SELECT
  USING (auth.uid() = user_id);

-- Anyone can update their own conversation (by visitor_id)
CREATE POLICY "Anyone can update their own conversation"
  ON ai_conversations FOR UPDATE
  USING (true); -- Additional check in application layer

-- ==============================================
-- FUNCTIONS AND TRIGGERS
-- ==============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to relevant tables
CREATE TRIGGER update_users_profile_updated_at BEFORE UPDATE ON users_profile
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blocks_updated_at BEFORE UPDATE ON blocks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_conversations_updated_at BEFORE UPDATE ON ai_conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- SAMPLE DATA (Optional - for testing)
-- ==============================================

-- Note: You'll need to insert real user IDs after authentication
-- This is just example structure

/*
-- Example: Insert a test profile (after user signs up)
INSERT INTO users_profile (id, username, display_name, bio, theme_id)
VALUES (
  'your-user-uuid-here',
  'alexjohnson',
  'Alex Johnson',
  'Tech enthusiast & creator 🚀',
  'gradient'
);

-- Example: Insert sample blocks
INSERT INTO blocks (user_id, type, content, order_index) VALUES
(
  'your-user-uuid-here',
  'text',
  '{"title": "Hey, I''m Alex! 👋", "body": "Welcome to my link-in-bio page. Find all my content and products here."}'::jsonb,
  0
),
(
  'your-user-uuid-here',
  'social_links',
  '{"links": [
    {"platform": "instagram", "url": "https://instagram.com/alexjohnson", "handle": "@alexjohnson"},
    {"platform": "youtube", "url": "https://youtube.com/@alexjohnson", "handle": "@alexjohnson"},
    {"platform": "twitter", "url": "https://twitter.com/alexjohnson", "handle": "@alexjohnson"}
  ]}'::jsonb,
  1
),
(
  'your-user-uuid-here',
  'button',
  '{"label": "Shop My Favorites", "url": "https://example.com/shop", "style": "primary"}'::jsonb,
  2
),
(
  'your-user-uuid-here',
  'ai_chat',
  '{"greeting": "Hi! Ask me anything about my content or products.", "systemPrompt": "You are Alex Johnson''s AI assistant..."}'::jsonb,
  3
);
*/

-- ==============================================
-- INDEXING OPTIMIZATIONS
-- ==============================================

-- Composite index for common queries
CREATE INDEX idx_blocks_user_visible ON blocks(user_id, is_visible, order_index);

-- GIN index for JSONB content search
CREATE INDEX idx_blocks_content_gin ON blocks USING GIN (content);
CREATE INDEX idx_analytics_event_data_gin ON page_analytics USING GIN (event_data);

-- ==============================================
-- VIEWS FOR ANALYTICS
-- ==============================================

CREATE OR REPLACE VIEW user_analytics_summary AS
SELECT 
  user_id,
  COUNT(*) FILTER (WHERE event_type = 'page_view') as total_page_views,
  COUNT(*) FILTER (WHERE event_type = 'block_click') as total_block_clicks,
  COUNT(*) FILTER (WHERE event_type = 'ai_chat_open') as total_ai_chats,
  COUNT(DISTINCT visitor_id) as unique_visitors,
  COUNT(DISTINCT DATE(created_at)) as active_days,
  MAX(created_at) as last_activity
FROM page_analytics
GROUP BY user_id;

-- Grant access to authenticated users
GRANT SELECT ON user_analytics_summary TO authenticated;

-- ==============================================
-- COMPLETION MESSAGE
-- ==============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Vario database schema created successfully!';
  RAISE NOTICE '📝 Next steps:';
  RAISE NOTICE '   1. Create storage buckets: avatars, block-images';
  RAISE NOTICE '   2. Set storage policies to public read';
  RAISE NOTICE '   3. Enable authentication providers in Supabase Auth';
  RAISE NOTICE '   4. Copy your API keys to .env.local';
END $$;
