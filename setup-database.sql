-- ============================================
-- Pulse Web - Database Setup Script
-- ============================================
-- Run this script in your Supabase SQL Editor
-- ============================================

-- 1. Create journal_entries table
CREATE TABLE IF NOT EXISTS public.journal_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    transcript TEXT NOT NULL,
    audio_url TEXT,
    primary_mood TEXT,
    mood_score INTEGER CHECK (mood_score >= 0 AND mood_score <= 10),
    emotions TEXT[],
    sentiment TEXT,
    keywords TEXT[],
    insight TEXT,
    follow_up_question TEXT,
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id 
ON public.journal_entries(user_id);

CREATE INDEX IF NOT EXISTS idx_journal_entries_created_at 
ON public.journal_entries(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_journal_entries_is_favorite 
ON public.journal_entries(is_favorite) 
WHERE is_favorite = true;

CREATE INDEX IF NOT EXISTS idx_journal_entries_primary_mood 
ON public.journal_entries(primary_mood);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies
-- Policy: Users can view their own journal entries
CREATE POLICY "Users can view own journal entries" 
ON public.journal_entries
FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Users can insert their own journal entries
CREATE POLICY "Users can insert own journal entries" 
ON public.journal_entries
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own journal entries
CREATE POLICY "Users can update own journal entries" 
ON public.journal_entries
FOR UPDATE 
USING (auth.uid() = user_id);

-- Policy: Users can delete their own journal entries
CREATE POLICY "Users can delete own journal entries" 
ON public.journal_entries
FOR DELETE 
USING (auth.uid() = user_id);

-- 5. Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Create trigger for updated_at
DROP TRIGGER IF EXISTS set_updated_at ON public.journal_entries;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.journal_entries
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 7. Add helpful comments
COMMENT ON TABLE public.journal_entries IS 'Stores user journal entries with mood analysis';
COMMENT ON COLUMN public.journal_entries.user_id IS 'References the user who created the entry';
COMMENT ON COLUMN public.journal_entries.transcript IS 'Transcribed text from voice recording or manual entry';
COMMENT ON COLUMN public.journal_entries.audio_url IS 'URL to the stored audio file in Supabase Storage';
COMMENT ON COLUMN public.journal_entries.primary_mood IS 'Primary detected mood (joyful, calm, anxious, sad, etc.)';
COMMENT ON COLUMN public.journal_entries.mood_score IS 'Mood intensity score from 0-10';
COMMENT ON COLUMN public.journal_entries.emotions IS 'Array of detected emotions';
COMMENT ON COLUMN public.journal_entries.sentiment IS 'Overall sentiment (positive, negative, neutral)';
COMMENT ON COLUMN public.journal_entries.keywords IS 'Key themes and topics extracted from the entry';
COMMENT ON COLUMN public.journal_entries.insight IS 'AI-generated insight about the entry';
COMMENT ON COLUMN public.journal_entries.follow_up_question IS 'AI-generated reflection question';
COMMENT ON COLUMN public.journal_entries.is_favorite IS 'User-marked favorite entries';

-- ============================================
-- Success! Your database is ready.
-- ============================================
