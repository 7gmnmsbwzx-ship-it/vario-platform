-- ============================================================================
-- FIX: Add Missing Block Types to Database
-- ============================================================================
-- Problem: The blocks table has a CHECK constraint that doesn't include
--          'button', 'social_links', and 'ai_chat' block types
--
-- Solution: Update the constraint to allow all block types
-- ============================================================================

-- Step 1: Drop the old constraint
ALTER TABLE public.blocks DROP CONSTRAINT IF EXISTS blocks_type_check;

-- Step 2: Add new constraint with all block types
ALTER TABLE public.blocks 
ADD CONSTRAINT blocks_type_check 
CHECK (type IN (
  'link',         -- Link buttons (original)
  'text',         -- Text content (original)
  'image',        -- Images (original)
  'embed',        -- Embeds (original)
  'video',        -- Videos (original)
  'social',       -- Social links (original)
  'button',       -- Button links (NEW)
  'social_links', -- Social links grid (NEW)
  'ai_chat'       -- AI Chat widget (NEW)
));

-- ============================================================================
-- Verification Query
-- Run this to confirm the fix worked:
-- ============================================================================

-- This should return the new constraint definition
SELECT 
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.blocks'::regclass
  AND conname = 'blocks_type_check';

-- ============================================================================
-- Test Query (Optional)
-- Try inserting a test block to verify it works:
-- ============================================================================

/*
-- Replace YOUR_USER_ID with your actual user UUID
INSERT INTO public.blocks (user_id, type, content, order_index)
VALUES (
  'YOUR_USER_ID'::uuid,
  'ai_chat',
  '{"title": "Test AI Chat", "description": "Test description"}'::jsonb,
  999
);

-- If the insert works, delete the test block:
DELETE FROM public.blocks WHERE order_index = 999;
*/

-- ============================================================================
-- Success!
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Block type constraint updated successfully!';
  RAISE NOTICE '📝 Allowed block types:';
  RAISE NOTICE '   - link (original)';
  RAISE NOTICE '   - text (original)';
  RAISE NOTICE '   - image (original)';
  RAISE NOTICE '   - embed (original)';
  RAISE NOTICE '   - video (original)';
  RAISE NOTICE '   - social (original)';
  RAISE NOTICE '   - button (NEW) ✨';
  RAISE NOTICE '   - social_links (NEW) ✨';
  RAISE NOTICE '   - ai_chat (NEW) ✨';
  RAISE NOTICE '';
  RAISE NOTICE '🎉 You can now create blocks with all types!';
END $$;
