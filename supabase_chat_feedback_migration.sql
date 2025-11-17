-- Create chat_feedback table
CREATE TABLE IF NOT EXISTS chat_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message_id TEXT NOT NULL, -- Identifier for the message (can be timestamp or UUID)
  user_message TEXT NOT NULL,
  assistant_message TEXT NOT NULL,
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('positive', 'negative')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index for user queries
CREATE INDEX IF NOT EXISTS idx_chat_feedback_user_id ON chat_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_feedback_created_at ON chat_feedback(created_at DESC);

-- Enable Row Level Security
ALTER TABLE chat_feedback ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own feedback" ON chat_feedback;
DROP POLICY IF EXISTS "Users can insert their own feedback" ON chat_feedback;

-- Create policies
CREATE POLICY "Users can view their own feedback" ON chat_feedback
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own feedback" ON chat_feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);

