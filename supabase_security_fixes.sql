/**
 * Supabase Security Fixes
 * 
 * This migration fixes security warnings from Supabase Database Linter:
 * 1. Function Search Path Mutable - Sets search_path for trigger functions
 * 2. Instructions for enabling Leaked Password Protection
 * 
 * Run this in your Supabase SQL Editor
 */

-- ============================================================================
-- 1. Fix Function Search Path Mutable Issues
-- ============================================================================
-- These functions need SET search_path to prevent search_path injection attacks
-- Reference: https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable

-- Fix update_updated_at_column function
-- This function is used by triggers on tables with updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Fix update_goal_completed_at function (if it exists in your database)
-- Only run this if you have a goals table and this function exists
CREATE OR REPLACE FUNCTION update_goal_completed_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update completed_at when status changes to 'completed'
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    NEW.completed_at = NOW();
  END IF;
  RETURN NEW;
END;
$$;

-- Fix update_goal_progress_timestamp function (if it exists in your database)
-- Only run this if you have a goals table and this function exists
CREATE OR REPLACE FUNCTION update_goal_progress_timestamp()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update last_updated_value_at when current_value changes
  IF NEW.current_value != OLD.current_value THEN
    NEW.last_updated_value_at = NOW();
  END IF;
  RETURN NEW;
END;
$$;

-- Fix handle_new_user function
-- IMPORTANT: This function may have custom logic in your database.
-- Before running this, check your current function definition:
-- SELECT pg_get_functiondef('public.handle_new_user'::regproc);
--
-- Then replace the function body below with your actual implementation,
-- or this will create a basic version that just returns NEW.
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- TODO: Replace this with your actual handle_new_user logic
  -- Common implementations:
  -- 1. Create a profile record
  -- 2. Initialize user settings
  -- 3. Set up default data
  
  -- Example (uncomment and customize if needed):
  -- INSERT INTO public.profiles (id, email, created_at, updated_at)
  -- VALUES (NEW.id, NEW.email, NOW(), NOW())
  -- ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- ============================================================================
-- 2. Verification Queries
-- ============================================================================
-- Run these to verify the fixes worked:

-- Check function search_path settings
SELECT 
  p.proname AS function_name,
  CASE 
    WHEN pg_get_functiondef(p.oid) LIKE '%SET search_path%' THEN ' Has search_path set'
    ELSE ' Missing search_path'
  END AS security_status
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.proname IN (
    'update_updated_at_column',
    'update_goal_completed_at',
    'update_goal_progress_timestamp',
    'handle_new_user'
  )
ORDER BY p.proname;

-- ============================================================================
-- 3. Instructions for Leaked Password Protection
-- ============================================================================
/*
 * To enable Leaked Password Protection in Supabase:
 * 
 * 1. Go to your Supabase Dashboard
 * 2. Navigate to: Authentication > Settings > Password
 * 3. Enable "Leaked Password Protection"
 * 
 * This feature checks passwords against HaveIBeenPwned.org database
 * to prevent users from using compromised passwords.
 * 
 * Reference: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection
 * 
 * Note: This setting is configured in the Supabase Dashboard, not via SQL.
 */
