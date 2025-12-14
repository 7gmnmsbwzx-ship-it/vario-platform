-- ============================================================================
-- FIX: Add Missing Block Types to ENUM
-- ============================================================================
-- Problem: The block_type ENUM doesn't include 'button', 'social_links', 'ai_chat'
-- Solution: Add new values to the existing ENUM type
-- ============================================================================

-- Check if block_type enum exists and what values it has
DO $$
BEGIN
  RAISE NOTICE 'Current block_type enum values:';
  FOR rec IN 
    SELECT enumlabel 
    FROM pg_enum 
    WHERE enumtypid = 'block_type'::regtype 
    ORDER BY enumsortorder
  LOOP
    RAISE NOTICE '  - %', rec.enumlabel;
  END LOOP;
END $$;

-- Add new enum values (IF they don't already exist)
DO $$
BEGIN
  -- Add 'button' if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumtypid = 'block_type'::regtype 
    AND enumlabel = 'button'
  ) THEN
    ALTER TYPE block_type ADD VALUE 'button';
    RAISE NOTICE '✅ Added: button';
  ELSE
    RAISE NOTICE '⏭️  Skipped: button (already exists)';
  END IF;

  -- Add 'social_links' if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumtypid = 'block_type'::regtype 
    AND enumlabel = 'social_links'
  ) THEN
    ALTER TYPE block_type ADD VALUE 'social_links';
    RAISE NOTICE '✅ Added: social_links';
  ELSE
    RAISE NOTICE '⏭️  Skipped: social_links (already exists)';
  END IF;

  -- Add 'ai_chat' if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumtypid = 'block_type'::regtype 
    AND enumlabel = 'ai_chat'
  ) THEN
    ALTER TYPE block_type ADD VALUE 'ai_chat';
    RAISE NOTICE '✅ Added: ai_chat';
  ELSE
    RAISE NOTICE '⏭️  Skipped: ai_chat (already exists)';
  END IF;
END $$;

-- Verify the updated enum values
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '====================================';
  RAISE NOTICE 'Updated block_type enum values:';
  FOR rec IN 
    SELECT enumlabel 
    FROM pg_enum 
    WHERE enumtypid = 'block_type'::regtype 
    ORDER BY enumsortorder
  LOOP
    RAISE NOTICE '  ✓ %', rec.enumlabel;
  END LOOP;
  RAISE NOTICE '====================================';
  RAISE NOTICE '';
  RAISE NOTICE '🎉 Block type enum updated successfully!';
  RAISE NOTICE '✅ You can now create blocks with all types!';
END $$;
