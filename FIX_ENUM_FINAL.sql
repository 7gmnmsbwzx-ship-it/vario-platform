-- ============================================================================
-- FINAL FIX: Update block_type ENUM to Match Application Code
-- ============================================================================
-- Problem: Database ENUM has old values, app code expects new values
-- 
-- OLD ENUM (in database):
--   'link', 'text', 'image', 'embed', 'video', 'social'
--
-- NEW ENUM (in app code):
--   'text', 'image', 'button', 'social_links', 'embed', 'ai_chat'
--
-- Solution: We need to:
--   1. Add missing values: 'button', 'social_links', 'ai_chat'
--   2. Keep old values for compatibility: 'link', 'video', 'social'
-- ============================================================================

-- Step 1: Show current enum values
DO $$
BEGIN
  RAISE NOTICE '====================================';
  RAISE NOTICE 'CURRENT block_type ENUM values:';
  FOR rec IN 
    SELECT enumlabel 
    FROM pg_enum 
    WHERE enumtypid = 'block_type'::regtype 
    ORDER BY enumsortorder
  LOOP
    RAISE NOTICE '  - %', rec.enumlabel;
  END LOOP;
  RAISE NOTICE '====================================';
  RAISE NOTICE '';
END $$;

-- Step 2: Add new enum values (if they don't exist)
DO $$
BEGIN
  RAISE NOTICE 'Adding new block types...';
  RAISE NOTICE '';

  -- Add 'button' if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumtypid = 'block_type'::regtype 
    AND enumlabel = 'button'
  ) THEN
    ALTER TYPE block_type ADD VALUE IF NOT EXISTS 'button';
    RAISE NOTICE '  ✅ Added: button';
  ELSE
    RAISE NOTICE '  ⏭️  Already exists: button';
  END IF;

  -- Add 'social_links' if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumtypid = 'block_type'::regtype 
    AND enumlabel = 'social_links'
  ) THEN
    ALTER TYPE block_type ADD VALUE IF NOT EXISTS 'social_links';
    RAISE NOTICE '  ✅ Added: social_links';
  ELSE
    RAISE NOTICE '  ⏭️  Already exists: social_links';
  END IF;

  -- Add 'ai_chat' if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumtypid = 'block_type'::regtype 
    AND enumlabel = 'ai_chat'
  ) THEN
    ALTER TYPE block_type ADD VALUE IF NOT EXISTS 'ai_chat';
    RAISE NOTICE '  ✅ Added: ai_chat';
  ELSE
    RAISE NOTICE '  ⏭️  Already exists: ai_chat';
  END IF;

  RAISE NOTICE '';
  RAISE NOTICE '====================================';
END $$;

-- Step 3: Show final enum values
DO $$
BEGIN
  RAISE NOTICE 'UPDATED block_type ENUM values:';
  RAISE NOTICE '';
  FOR rec IN 
    SELECT enumlabel 
    FROM pg_enum 
    WHERE enumtypid = 'block_type'::regtype 
    ORDER BY enumsortorder
  LOOP
    RAISE NOTICE '  ✓ %', rec.enumlabel;
  END LOOP;
  RAISE NOTICE '';
  RAISE NOTICE '====================================';
  RAISE NOTICE '🎉 Success!';
  RAISE NOTICE '====================================';
  RAISE NOTICE '';
  RAISE NOTICE '✅ You can now create blocks with ALL these types:';
  RAISE NOTICE '   - text ✓';
  RAISE NOTICE '   - image ✓';
  RAISE NOTICE '   - button ✓ (NEW)';
  RAISE NOTICE '   - social_links ✓ (NEW)';
  RAISE NOTICE '   - embed ✓';
  RAISE NOTICE '   - ai_chat ✓ (NEW)';
  RAISE NOTICE '   - link ✓ (legacy)';
  RAISE NOTICE '   - video ✓ (legacy)';
  RAISE NOTICE '   - social ✓ (legacy)';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Go create some blocks!';
END $$;
