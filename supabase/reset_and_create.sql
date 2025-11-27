-- Vario Link-in-Bio Platform - RESET AND CREATE DATABASE SCHEMA
-- This will DROP existing tables and recreate them from scratch
-- WARNING: This will delete all existing data!

-- ==============================================
-- STEP 1: DROP EXISTING TABLES (if they exist)
-- ==============================================

-- Drop views first
DROP VIEW IF EXISTS user_analytics_summary;

-- Drop tables in reverse order of dependencies
DROP TABLE IF EXISTS ai_conversations CASCADE;
DROP TABLE IF EXISTS page_analytics CASCADE;
DROP TABLE IF EXISTS blocks CASCADE;
DROP TABLE IF EXISTS themes CASCADE;
DROP TABLE IF EXISTS users_profile CASCADE;

-- Drop custom types
DROP TYPE IF EXISTS block_type CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- ==============================================
-- STEP 2: ENABLE UUID EXTENSION
-- ==============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================
-- STEP 3: CREATE USERS PROFILE TABLE
-- ==============================================
CREATE TABLE users_profile (
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
-- STEP 4: CREATE BLOCKS TABLE
-- ==============================================
CREATE TYPE block_type AS ENUM (
  'text',
  'image',
  'button',
  'social_links',
  'embed',
  'ai_chat'
);

CREATE TABLE blocks (
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
-- STEP 5: CREATE THEMES TABLE
-- ==============================================
CREATE TABLE themes (
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
  false);

-- ==============================================
-- STEP 6: CREATE PAGE ANALYTICS TABLE
-- ==============================================
CREATE TABLE page_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  visitor_id TEXT,
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
-- STEP 7: CREATE AI CONVERSATIONS TABLE
-- ==============================================
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  visitor_id TEXT NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]',
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX idx_ai_conversations_visitor_id ON ai_conversations(visitor_id);

-- ==============================================
-- STEP 8: ENABLE ROW LEVEL SECURITY
-- ==============================================
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- STEP 9: CREATE RLS POLICIES
-- ==============================================

-- users_profile policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON users_profile FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can view their own profile"
  ON users_profile FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users_profile FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON users_profile FOR INSERT
  WITH CHECK (auth.uid() = id);

-- blocks policies
CREATE POLICY "Public can view blocks of public profiles"
  ON blocks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users_profile
      WHERE users_profile.id = blocks.user_id
      AND users_profile.is_public = true
    )
  );

CREATE POLICY "Users can view their own blocks"
  ON blocks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own blocks"
  ON blocks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own blocks"
  ON blocks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own blocks"
  ON blocks FOR DELETE
  USING (auth.uid() = user_id);

-- themes policies
CREATE POLICY "Themes are viewable by everyone"
  ON themes FOR SELECT
  USING (true);

-- page_analytics policies
CREATE POLICY "Anyone can insert analytics"
  ON page_analytics FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own analytics"
  ON page_analytics FOR SELECT
  USING (auth.uid() = user_id);

-- ai_conversations policies
CREATE POLICY "Anyone can insert AI conversations"
  ON ai_conversations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their profile AI conversations"
  ON ai_conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can update their own conversation"
  ON ai_conversations FOR UPDATE
  USING (true);

-- ==============================================
-- STEP 10: CREATE FUNCTIONS AND TRIGGERS
-- ==============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_profile_updated_at BEFORE UPDATE ON users_profile
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blocks_updated_at BEFORE UPDATE ON blocks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_conversations_updated_at BEFORE UPDATE ON ai_conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- STEP 11: CREATE OPTIMIZED INDEXES
-- ==============================================
CREATE INDEX idx_blocks_user_visible ON blocks(user_id, is_visible, order_index);
CREATE INDEX idx_blocks_content_gin ON blocks USING GIN (content);
CREATE INDEX idx_analytics_event_data_gin ON page_analytics USING GIN (event_data);

-- ==============================================
-- STEP 12: CREATE ANALYTICS VIEW
-- ==============================================
CREATE VIEW user_analytics_summary AS
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

GRANT SELECT ON user_analytics_summary TO authenticated;

-- ==============================================
-- COMPLETION MESSAGE
-- ==============================================
DO $$
BEGIN
  RAISE NOTICE '✅ Database reset and recreated successfully!';
  RAISE NOTICE '📊 Created:';
  RAISE NOTICE '   - 5 tables (users_profile, blocks, themes, page_analytics, ai_conversations)';
  RAISE NOTICE '   - 15+ RLS policies';
  RAISE NOTICE '   - 5 default themes';
  RAISE NOTICE '   - Optimized indexes';
  RAISE NOTICE '   - Analytics view';
  RAISE NOTICE '';
  RAISE NOTICE '📝 Next steps:';
  RAISE NOTICE '   1. Create storage buckets: avatars, block-images (in Storage section)';
  RAISE NOTICE '   2. Test signup at your app URL';
END $$;
