/**
 * Achievement System Database Schema
 * 
 * Run this in your Supabase SQL editor to create the achievements table
 */

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  progress INTEGER NOT NULL DEFAULT 100,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Prevent duplicate badges per user
  UNIQUE(user_id, badge_id)
);

-- Create badge_progress table for tracking incomplete badges
CREATE TABLE IF NOT EXISTS badge_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL,
  current_value INTEGER NOT NULL DEFAULT 0,
  target_value INTEGER NOT NULL,
  progress_percentage INTEGER NOT NULL DEFAULT 0,
  last_checked TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_complete BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- One progress record per badge per user
  UNIQUE(user_id, badge_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_badge_id ON achievements(badge_id);
CREATE INDEX IF NOT EXISTS idx_achievements_earned_at ON achievements(earned_at DESC);
CREATE INDEX IF NOT EXISTS idx_badge_progress_user_id ON badge_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_badge_progress_incomplete ON badge_progress(user_id, is_complete) WHERE is_complete = false;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to achievements table
DROP TRIGGER IF EXISTS update_achievements_updated_at ON achievements;
CREATE TRIGGER update_achievements_updated_at
  BEFORE UPDATE ON achievements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to badge_progress table
DROP TRIGGER IF EXISTS update_badge_progress_updated_at ON badge_progress;
CREATE TRIGGER update_badge_progress_updated_at
  BEFORE UPDATE ON badge_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE badge_progress ENABLE ROW LEVEL SECURITY;

-- Achievements policies
CREATE POLICY "Users can view their own achievements"
  ON achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements"
  ON achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own achievements"
  ON achievements FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Badge progress policies
CREATE POLICY "Users can view their own badge progress"
  ON badge_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own badge progress"
  ON badge_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own badge progress"
  ON badge_progress FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Helper function to get user's badge stats
CREATE OR REPLACE FUNCTION get_user_badge_stats(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_badges', COUNT(*),
    'bronze_badges', COUNT(*) FILTER (WHERE metadata->>'tier' = 'bronze'),
    'silver_badges', COUNT(*) FILTER (WHERE metadata->>'tier' = 'silver'),
    'gold_badges', COUNT(*) FILTER (WHERE metadata->>'tier' = 'gold'),
    'platinum_badges', COUNT(*) FILTER (WHERE metadata->>'tier' = 'platinum'),
    'diamond_badges', COUNT(*) FILTER (WHERE metadata->>'tier' = 'diamond'),
    'journey_badges', COUNT(*) FILTER (WHERE metadata->>'category' = 'journey'),
    'resilience_badges', COUNT(*) FILTER (WHERE metadata->>'category' = 'resilience'),
    'insight_badges', COUNT(*) FILTER (WHERE metadata->>'category' = 'insight'),
    'connection_badges', COUNT(*) FILTER (WHERE metadata->>'category' = 'connection'),
    'hidden_badges', COUNT(*) FILTER (WHERE metadata->>'category' = 'hidden'),
    'latest_badge_earned_at', MAX(earned_at)
  ) INTO result
  FROM achievements
  WHERE user_id = p_user_id;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get in-progress badges
CREATE OR REPLACE FUNCTION get_in_progress_badges(p_user_id UUID, p_limit INTEGER DEFAULT 5)
RETURNS TABLE (
  badge_id TEXT,
  current_value INTEGER,
  target_value INTEGER,
  progress_percentage INTEGER,
  last_checked TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bp.badge_id,
    bp.current_value,
    bp.target_value,
    bp.progress_percentage,
    bp.last_checked
  FROM badge_progress bp
  WHERE bp.user_id = p_user_id
    AND bp.is_complete = false
  ORDER BY bp.progress_percentage DESC, bp.last_checked DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to award badge
CREATE OR REPLACE FUNCTION award_badge(
  p_user_id UUID,
  p_badge_id TEXT,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  v_achievement_id UUID;
BEGIN
  -- Insert achievement
  INSERT INTO achievements (user_id, badge_id, metadata)
  VALUES (p_user_id, p_badge_id, p_metadata)
  ON CONFLICT (user_id, badge_id) DO NOTHING
  RETURNING id INTO v_achievement_id;
  
  -- Mark progress as complete
  UPDATE badge_progress
  SET is_complete = true, 
      progress_percentage = 100,
      updated_at = NOW()
  WHERE user_id = p_user_id 
    AND badge_id = p_badge_id;
  
  RETURN v_achievement_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to update badge progress
CREATE OR REPLACE FUNCTION update_badge_progress(
  p_user_id UUID,
  p_badge_id TEXT,
  p_current_value INTEGER,
  p_target_value INTEGER,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS VOID AS $$
DECLARE
  v_progress_percentage INTEGER;
BEGIN
  v_progress_percentage := LEAST(100, (p_current_value * 100 / NULLIF(p_target_value, 0)));
  
  INSERT INTO badge_progress (
    user_id, 
    badge_id, 
    current_value, 
    target_value, 
    progress_percentage,
    metadata
  )
  VALUES (
    p_user_id,
    p_badge_id,
    p_current_value,
    p_target_value,
    v_progress_percentage,
    p_metadata
  )
  ON CONFLICT (user_id, badge_id) DO UPDATE
  SET 
    current_value = p_current_value,
    target_value = p_target_value,
    progress_percentage = v_progress_percentage,
    metadata = p_metadata,
    last_checked = NOW(),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
