-- ============================================================================
-- COMPLETE FIX: Add Missing Block Types (Handles Both ENUM and TEXT+CHECK)
-- ============================================================================
-- This script automatically detects whether you're using:
--   1. ENUM type (block_type)
--   2. TEXT with CHECK constraint
-- And applies the appropriate fix
-- ============================================================================

DO $$
DECLARE
  is_enum BOOLEAN;
  has_check BOOLEAN;
BEGIN
  -- Check if block_type ENUM exists
  SELECT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'block_type'
  ) INTO is_enum;

  -- Check if there's a CHECK constraint
  SELECT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conrelid = 'public.blocks'::regclass 
    AND conname LIKE '%type%check%'
  ) INTO has_check;

  RAISE NOTICE '====================================';
  RAISE NOTICE 'Database Configuration Detected:';
  RAISE NOTICE '  ENUM type exists: %', is_enum;
  RAISE NOTICE '  CHECK constraint exists: %', has_check;
  RAISE NOTICE '====================================';
  RAISE NOTICE '';

  -- SCENARIO 1: Using ENUM type
  IF is_enum THEN
    RAISE NOTICE 'Fixing ENUM type block_type...';
    
    -- Add 'button' if missing
    IF NOT EXISTS (
      SELECT 1 FROM pg_enum 
      WHERE enumtypid = 'block_type'::regtype 
      AND enumlabel = 'button'
    ) THEN
      ALTER TYPE block_type ADD VALUE 'button';
      RAISE NOTICE '  ✅ Added: button';
    ELSE
      RAISE NOTICE '  ⏭️  Skipped: button (already exists)';
    END IF;

    -- Add 'social_links' if missing
    IF NOT EXISTS (
      SELECT 1 FROM pg_enum 
      WHERE enumtypid = 'block_type'::regtype 
      AND enumlabel = 'social_links'
    ) THEN
      ALTER TYPE block_type ADD VALUE 'social_links';
      RAISE NOTICE '  ✅ Added: social_links';
    ELSE
      RAISE NOTICE '  ⏭️  Skipped: social_links (already exists)';
    END IF;

    -- Add 'ai_chat' if missing
    IF NOT EXISTS (
      SELECT 1 FROM pg_enum 
      WHERE enumtypid = 'block_type'::regtype 
      AND enumlabel = 'ai_chat'
    ) THEN
      ALTER TYPE block_type ADD VALUE 'ai_chat';
      RAISE NOTICE '  ✅ Added: ai_chat';
    ELSE
      RAISE NOTICE '  ⏭️  Skipped: ai_chat (already exists)';
    END IF;

    RAISE NOTICE '';
    RAISE NOTICE 'Final ENUM values:';
    FOR rec IN 
      SELECT enumlabel 
      FROM pg_enum 
      WHERE enumtypid = 'block_type'::regtype 
      ORDER BY enumsortorder
    LOOP
      RAISE NOTICE '  ✓ %', rec.enumlabel;
    END LOOP;
  END IF;

  -- SCENARIO 2: Using TEXT with CHECK constraint
  IF has_check THEN
    RAISE NOTICE 'Fixing CHECK constraint...';
    
    -- Drop old constraint
    EXECUTE 'ALTER TABLE public.blocks DROP CONSTRAINT IF EXISTS blocks_type_check';
    RAISE NOTICE '  ✓ Dropped old constraint';
    
    -- Add new constraint with all types
    EXECUTE $sql$
      ALTER TABLE public.blocks 
      ADD CONSTRAINT blocks_type_check 
      CHECK (type IN (
        'link', 'text', 'image', 'embed', 'video', 'social',
        'button', 'social_links', 'ai_chat'
      ))
    $sql$;
    RAISE NOTICE '  ✅ Added new constraint with all 9 types';
  END IF;

  -- SCENARIO 3: Neither (shouldn't happen, but let's handle it)
  IF NOT is_enum AND NOT has_check THEN
    RAISE NOTICE '⚠️  WARNING: No ENUM or CHECK constraint found!';
    RAISE NOTICE '   The blocks table might not have type validation.';
  END IF;

  RAISE NOTICE '';
  RAISE NOTICE '====================================';
  RAISE NOTICE '🎉 Fix completed successfully!';
  RAISE NOTICE '====================================';
  RAISE NOTICE '';
  RAISE NOTICE '✅ You can now create blocks with these types:';
  RAISE NOTICE '   - text';
  RAISE NOTICE '   - image';
  RAISE NOTICE '   - button (NEW)';
  RAISE NOTICE '   - social_links (NEW)';
  RAISE NOTICE '   - embed';
  RAISE NOTICE '   - ai_chat (NEW)';
  RAISE NOTICE '   - link (if using TEXT)';
  RAISE NOTICE '   - video (if using TEXT)';
  RAISE NOTICE '   - social (if using TEXT)';

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE '❌ Error occurred: %', SQLERRM;
    RAISE NOTICE 'Please check the error message and try again.';
END $$;

-- Verification query to see current state
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_type WHERE typname = 'block_type')
    THEN 'ENUM'
    ELSE 'TEXT + CHECK'
  END as type_implementation,
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_type WHERE typname = 'block_type')
    THEN (
      SELECT array_agg(enumlabel ORDER BY enumsortorder)::text
      FROM pg_enum 
      WHERE enumtypid = 'block_type'::regtype
    )
    ELSE 'Check constraint - use previous query'
  END as allowed_values;
