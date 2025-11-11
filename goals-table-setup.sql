-- ==========================================
-- GOALS TABLE SETUP
-- ==========================================
-- Copy and paste this into your Supabase SQL Editor
-- Navigate to: Supabase Dashboard > SQL Editor > New Query

-- Create goals table for goal tracking
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_value INTEGER NOT NULL,
  current_value INTEGER DEFAULT 0,
  unit TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON goals(status);
CREATE INDEX IF NOT EXISTS idx_goals_user_status ON goals(user_id, status);
CREATE INDEX IF NOT EXISTS idx_goals_created_at ON goals(created_at DESC);

-- Enable Row Level Security
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for clean setup)
DROP POLICY IF EXISTS "Users can view their own goals" ON goals;
DROP POLICY IF EXISTS "Users can insert their own goals" ON goals;
DROP POLICY IF EXISTS "Users can update their own goals" ON goals;
DROP POLICY IF EXISTS "Users can delete their own goals" ON goals;

-- Create policies for goals
CREATE POLICY "Users can view their own goals"
  ON goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goals"
  ON goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals"
  ON goals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals"
  ON goals FOR DELETE
  USING (auth.uid() = user_id);

-- Add updated_at trigger for goals
-- Note: This uses the function created in your reflections migration
-- If you haven't created it yet, uncomment the lines below:

/*
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
*/

CREATE TRIGGER update_goals_updated_at
  BEFORE UPDATE ON goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Optional: Add some sample goals for testing (replace 'YOUR_USER_ID' with your actual user ID)
-- You can find your user ID in Supabase Auth > Users
/*
INSERT INTO goals (user_id, title, description, target_value, current_value, unit, category, due_date) VALUES
  ('YOUR_USER_ID', 'Read 12 Books', 'Read one book per month this year', 12, 3, 'books', 'learning', '2025-12-31'),
  ('YOUR_USER_ID', 'Exercise 100 Times', 'Workout at least 100 times this year', 100, 25, 'workouts', 'health', '2025-12-31'),
  ('YOUR_USER_ID', 'Save $5000', 'Emergency fund savings goal', 5000, 1200, 'dollars', 'financial', '2025-12-31');
*/

-- Verify the table was created successfully
SELECT 'Goals table created successfully!' AS message;
