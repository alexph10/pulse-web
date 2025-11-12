# Habits Feature Setup Guide

## Database Setup Required

The habits feature needs two database tables. Follow these steps:

### Step 1: Access Supabase Dashboard

1. Go to [supabase.com](https://supabase.com)
2. Sign in and select your project
3. Click on **SQL Editor** in the left sidebar

### Step 2: Run the Migration

1. Click **New Query**
2. Copy the entire contents of `supabase_habits_migration.sql`
3. Paste into the SQL editor
4. Click **Run** (or press Ctrl/Cmd + Enter)

### Step 3: Verify Tables Created

1. Go to **Table Editor** in the left sidebar
2. You should see two new tables:
   - `habits`
   - `habit_completions`

### What the Migration Does

- Creates `habits` table to store user habits
- Creates `habit_completions` table to track daily completions
- Sets up Row Level Security (RLS) policies
- Creates indexes for better performance
- Ensures users can only see their own data

### After Setup

Once the migration runs successfully:
1. Refresh your app
2. The console errors will disappear
3. Click "Add Default Habits" to get started
4. Or create your own custom habits

## Troubleshooting

**Error: "relation 'habits' does not exist"**
- The database tables haven't been created yet
- Run the SQL migration in Supabase dashboard

**Error: "permission denied"**
- RLS policies may not be set up correctly
- Re-run the migration (it will drop and recreate policies)

**No habits showing up**
- Check if you're logged in (user must be authenticated)
- Open browser console to see any error messages
