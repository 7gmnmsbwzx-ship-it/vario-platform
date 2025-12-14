-- Migration: Add new block types (button, social_links, ai_chat)
-- This fixes the constraint error when creating these block types

-- Drop the old CHECK constraint
ALTER TABLE public.blocks DROP CONSTRAINT IF EXISTS blocks_type_check;

-- Add the new CHECK constraint with all block types
ALTER TABLE public.blocks 
ADD CONSTRAINT blocks_type_check 
CHECK (type IN ('link', 'text', 'image', 'embed', 'video', 'social', 'button', 'social_links', 'ai_chat'));

-- Update any existing 'social' type blocks to 'social_links' if needed
-- UPDATE public.blocks SET type = 'social_links' WHERE type = 'social';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Block types updated successfully!';
  RAISE NOTICE '📝 New allowed types: link, text, image, embed, video, social, button, social_links, ai_chat';
END $$;
