# Supabase Security Fixes

This document addresses the security warnings from Supabase Database Linter.

## Issues Fixed

### 1. Function Search Path Mutable (3 functions)

**Problem:** Database functions without a fixed `search_path` are vulnerable to search_path injection attacks.

**Functions Fixed:**
- `update_updated_at_column()`
- `update_goal_completed_at()`
- `update_goal_progress_timestamp()`

**Solution:** Added `SET search_path = public` to all functions to prevent search_path manipulation.

**How to Apply:**
1. Open your Supabase Dashboard
2. Go to SQL Editor
3. Run the `supabase_security_fixes.sql` migration file
4. Verify the fixes by running the verification queries at the end of the migration

### 2. Leaked Password Protection Disabled

**Problem:** Supabase Auth is not checking passwords against HaveIBeenPwned.org database.

**Solution:** Enable this feature in the Supabase Dashboard.

**How to Enable:**
1. Go to your Supabase Dashboard
2. Navigate to: **Authentication** → **Settings** → **Password**
3. Enable **"Leaked Password Protection"**
4. Save changes

**Reference:** 
- [Supabase Password Security Documentation](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)

## Additional Security Best Practices

### All SECURITY DEFINER Functions

All functions with `SECURITY DEFINER` should have `SET search_path` to prevent injection attacks. The migration file fixes all existing functions in the codebase.

### Regular Security Audits

1. Run Supabase Database Linter regularly:
   - Go to Database → Linter in Supabase Dashboard
   - Review all warnings and errors
   - Fix critical security issues immediately

2. Review function permissions:
   - Ensure functions only have necessary permissions
   - Use `SECURITY DEFINER` sparingly
   - Always set `search_path` for `SECURITY DEFINER` functions

## Verification

After running the migration, verify the fixes:

```sql
-- Check that functions have search_path set
SELECT 
  p.proname AS function_name,
  pg_get_functiondef(p.oid) AS function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.proname IN (
    'update_updated_at_column',
    'update_goal_completed_at',
    'update_goal_progress_timestamp'
  );
```

Look for `SET search_path = public` in the function definitions.

## References

- [Supabase Database Linter Documentation](https://supabase.com/docs/guides/database/database-linter)
- [Function Search Path Security](https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable)
- [Password Security Best Practices](https://supabase.com/docs/guides/auth/password-security)

