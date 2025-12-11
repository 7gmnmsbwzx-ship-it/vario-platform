-- Vario Platform - Seed Data
-- This file contains sample data for testing and development

-- Note: This seed data uses placeholder UUIDs
-- In production, users will be created via Supabase Auth
-- You can run this after creating a test user via signup

-- ============================================================================
-- EXAMPLE: How to create a test profile after signup
-- ============================================================================

-- After signing up with email/password in your app, you'll get a user ID
-- You can then insert a profile like this:

-- INSERT INTO public.users_profile (id, username, display_name, bio, is_public)
-- VALUES (
--   'YOUR_USER_ID_FROM_AUTH',  -- Replace with actual auth.users.id
--   'johndoe',
--   'John Doe',
--   'Welcome to my page! 👋',
--   true
-- );

-- ============================================================================
-- EXAMPLE: Sample blocks for testing
-- ============================================================================

-- After creating a profile, add some sample blocks:

-- INSERT INTO public.blocks (user_id, type, content, order_index, is_visible)
-- VALUES 
-- (
--   'YOUR_USER_ID',  -- Replace with your user ID
--   'link',
--   '{"url": "https://github.com/yourusername", "title": "GitHub Profile", "icon": "fab fa-github"}'::jsonb,
--   0,
--   true
-- ),
-- (
--   'YOUR_USER_ID',
--   'link',
--   '{"url": "https://twitter.com/yourusername", "title": "Twitter", "icon": "fab fa-twitter"}'::jsonb,
--   1,
--   true
-- ),
-- (
--   'YOUR_USER_ID',
--   'text',
--   '{"content": "Check out my latest project! 🚀"}'::jsonb,
--   2,
--   true
-- ),
-- (
--   'YOUR_USER_ID',
--   'link',
--   '{"url": "https://linkedin.com/in/yourusername", "title": "LinkedIn", "icon": "fab fa-linkedin"}'::jsonb,
--   3,
--   true
-- );

-- ============================================================================
-- TESTING QUERIES
-- ============================================================================

-- After running the migration, test with these queries:

-- 1. Check if tables were created
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- ORDER BY table_name;

-- 2. Check RLS policies
-- SELECT schemaname, tablename, policyname 
-- FROM pg_policies 
-- WHERE schemaname = 'public';

-- 3. Check storage buckets
-- SELECT * FROM storage.buckets;

-- 4. View your profile (replace with your user ID)
-- SELECT * FROM public.users_profile WHERE id = 'YOUR_USER_ID';

-- 5. View your blocks
-- SELECT * FROM public.blocks WHERE user_id = 'YOUR_USER_ID' ORDER BY order_index;

-- 6. View analytics summary
-- SELECT * FROM public.user_analytics_summary WHERE user_id = 'YOUR_USER_ID';

-- ============================================================================
-- USEFUL QUERIES FOR DEVELOPMENT
-- ============================================================================

-- Get all users with their block count
-- SELECT 
--   up.username,
--   up.display_name,
--   COUNT(b.id) as block_count
-- FROM public.users_profile up
-- LEFT JOIN public.blocks b ON b.user_id = up.id
-- GROUP BY up.id, up.username, up.display_name;

-- Get analytics for a specific user
-- SELECT 
--   event_type,
--   COUNT(*) as count
-- FROM public.page_analytics
-- WHERE user_id = 'YOUR_USER_ID'
-- GROUP BY event_type;

-- Get recent AI conversations
-- SELECT 
--   id,
--   visitor_id,
--   jsonb_array_length(messages) as message_count,
--   tokens_used,
--   created_at
-- FROM public.ai_conversations
-- WHERE user_id = 'YOUR_USER_ID'
-- ORDER BY created_at DESC
-- LIMIT 10;
