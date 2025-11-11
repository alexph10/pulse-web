-- ==========================================
-- ENHANCED GOALS TABLE SETUP
-- ==========================================
-- Improved version with additional fields for better goal tracking

-- Create goals table with enhanced fields
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Core goal information
  title TEXT NOT NULL,
  description TEXT,
  
  -- Progress tracking
  target_value INTEGER NOT NULL,
  current_value INTEGER DEFAULT 0,
  unit TEXT NOT NULL,
  
  -- Organization
  category TEXT NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  tags TEXT[], -- Array of tags for flexible categorization
  
  -- Status and lifecycle
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived', 'paused')),
  
  -- Dates
  start_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  completed_at TIMESTAMPTZ,
  
  -- Reminders and tracking
  reminder_enabled BOOLEAN DEFAULT false,
  reminder_frequency TEXT CHECK (reminder_frequency IN ('daily', 'weekly', 'monthly', NULL)),
  last_updated_value_at TIMESTAMPTZ, -- Track when progress was last updated
  
  -- Motivation and notes
  why TEXT, -- Why is this goal important?
  notes TEXT, -- Additional notes or journal entries
  
  -- Streak tracking
  streak_count INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_streak_update DATE,
  
  -- Metadata
  is_public BOOLEAN DEFAULT false, -- For future social features
  parent_goal_id UUID REFERENCES goals(id) ON DELETE SET NULL, -- For sub-goals
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create comprehensive indexes
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON goals(status);
CREATE INDEX IF NOT EXISTS idx_goals_user_status ON goals(user_id, status);
CREATE INDEX IF NOT EXISTS idx_goals_category ON goals(category);
CREATE INDEX IF NOT EXISTS idx_goals_priority ON goals(priority);
CREATE INDEX IF NOT EXISTS idx_goals_due_date ON goals(due_date);
CREATE INDEX IF NOT EXISTS idx_goals_created_at ON goals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_goals_tags ON goals USING GIN(tags); -- For array searching
CREATE INDEX IF NOT EXISTS idx_goals_parent ON goals(parent_goal_id);

-- Enable Row Level Security
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Create policies for goals
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'goals' 
    AND policyname = 'Users can view their own goals'
  ) THEN
    CREATE POLICY "Users can view their own goals"
      ON goals FOR SELECT
      USING (auth.uid() = user_id OR is_public = true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'goals' 
    AND policyname = 'Users can insert their own goals'
  ) THEN
    CREATE POLICY "Users can insert their own goals"
      ON goals FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'goals' 
    AND policyname = 'Users can update their own goals'
  ) THEN
    CREATE POLICY "Users can update their own goals"
      ON goals FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'goals' 
    AND policyname = 'Users can delete their own goals'
  ) THEN
    CREATE POLICY "Users can delete their own goals"
      ON goals FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create update_updated_at_column function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-update completed_at when status changes to completed
CREATE OR REPLACE FUNCTION update_goal_completed_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
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

-- Add triggers
DROP TRIGGER IF EXISTS update_goals_updated_at ON goals;
CREATE TRIGGER update_goals_updated_at
  BEFORE UPDATE ON goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

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

-- Verify the table was created successfully
SELECT 'Enhanced goals table created successfully!' AS message;
