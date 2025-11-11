-- ==========================================
-- GOALS TABLE MIGRATION - Add Enhanced Fields
-- ==========================================
-- Run this to upgrade your existing goals table with new fields
-- This will NOT delete any existing data

-- Add new columns to existing goals table
ALTER TABLE goals 
  ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  ADD COLUMN IF NOT EXISTS tags TEXT[],
  ADD COLUMN IF NOT EXISTS start_date DATE DEFAULT CURRENT_DATE,
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reminder_enabled BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS reminder_frequency TEXT CHECK (reminder_frequency IN ('daily', 'weekly', 'monthly', NULL)),
  ADD COLUMN IF NOT EXISTS last_updated_value_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS why TEXT,
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS streak_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS longest_streak INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_streak_update DATE,
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS parent_goal_id UUID REFERENCES goals(id) ON DELETE SET NULL;

-- Update status check constraint to include 'paused'
ALTER TABLE goals DROP CONSTRAINT IF EXISTS goals_status_check;
ALTER TABLE goals ADD CONSTRAINT goals_status_check 
  CHECK (status IN ('active', 'completed', 'archived', 'paused'));

-- Create new indexes
CREATE INDEX IF NOT EXISTS idx_goals_category ON goals(category);
CREATE INDEX IF NOT EXISTS idx_goals_priority ON goals(priority);
CREATE INDEX IF NOT EXISTS idx_goals_due_date ON goals(due_date);
CREATE INDEX IF NOT EXISTS idx_goals_tags ON goals USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_goals_parent ON goals(parent_goal_id);

-- Function to auto-update completed_at when status changes to completed
CREATE OR REPLACE FUNCTION update_goal_completed_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    NEW.completed_at = NOW();
  ELSIF NEW.status != 'completed' THEN
    NEW.completed_at = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to track when progress value is updated
CREATE OR REPLACE FUNCTION update_goal_progress_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.current_value != OLD.current_value THEN
    NEW.last_updated_value_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add new triggers
DROP TRIGGER IF EXISTS update_goals_completed_at ON goals;
CREATE TRIGGER update_goals_completed_at
  BEFORE UPDATE ON goals
  FOR EACH ROW
  EXECUTE FUNCTION update_goal_completed_at();

DROP TRIGGER IF EXISTS update_goals_progress_timestamp ON goals;
CREATE TRIGGER update_goals_progress_timestamp
  BEFORE UPDATE ON goals
  FOR EACH ROW
  EXECUTE FUNCTION update_goal_progress_timestamp();

-- Update RLS policy to include public goals
DROP POLICY IF EXISTS "Users can view their own goals" ON goals;
CREATE POLICY "Users can view their own goals"
  ON goals FOR SELECT
  USING (auth.uid() = user_id OR is_public = true);

-- Create a view for active goals with calculated progress percentage
CREATE OR REPLACE VIEW active_goals_with_progress AS
SELECT 
  *,
  CASE 
    WHEN target_value > 0 THEN ROUND((current_value::NUMERIC / target_value::NUMERIC) * 100, 2)
    ELSE 0
  END AS progress_percentage,
  CASE 
    WHEN due_date IS NOT NULL THEN due_date - CURRENT_DATE
    ELSE NULL
  END AS days_until_due
FROM goals
WHERE status = 'active';

-- Verify the migration was successful
SELECT 'Goals table migration completed successfully! New fields added.' AS message;
