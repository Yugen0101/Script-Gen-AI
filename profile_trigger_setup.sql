-- =====================================================
-- Profile Creation Trigger Setup
-- =====================================================
-- This migration sets up automatic profile creation when users sign up
-- Safe to run multiple times (idempotent)

-- 1. Create or replace the trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert profile record with error handling
  INSERT INTO public.profiles (id, email, is_premium, usage_count)
  VALUES (NEW.id, NEW.email, false, 0)
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the user creation
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop existing trigger if it exists and create new one
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 3. Backfill profiles for existing users who don't have profiles
INSERT INTO public.profiles (id, email, is_premium, usage_count)
SELECT 
  au.id,
  au.email,
  false,
  0
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- 4. Verify the setup
DO $$
DECLARE
  trigger_count INTEGER;
  function_count INTEGER;
  users_without_profiles INTEGER;
BEGIN
  -- Check if trigger exists
  SELECT COUNT(*) INTO trigger_count
  FROM pg_trigger
  WHERE tgname = 'on_auth_user_created';
  
  -- Check if function exists
  SELECT COUNT(*) INTO function_count
  FROM pg_proc
  WHERE proname = 'handle_new_user';
  
  -- Check for users without profiles
  SELECT COUNT(*) INTO users_without_profiles
  FROM auth.users au
  LEFT JOIN public.profiles p ON au.id = p.id
  WHERE p.id IS NULL;
  
  -- Report results
  RAISE NOTICE '✓ Trigger exists: %', trigger_count > 0;
  RAISE NOTICE '✓ Function exists: %', function_count > 0;
  RAISE NOTICE '✓ Users without profiles: %', users_without_profiles;
  
  IF users_without_profiles = 0 THEN
    RAISE NOTICE '✓ All users have profiles!';
  END IF;
END $$;
