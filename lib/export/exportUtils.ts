/**
 * Export Utilities
 * Helper functions for exporting journal entries
 */

export interface ExportOptions {
  format: 'json' | 'csv' | 'pdf' | 'txt'
  includeTimestamps: boolean
  includeMoodAnalysis: boolean
  includeEmotions: boolean
  includeInsights: boolean
  includeAudioUrls: boolean
}

export interface JournalEntry {
  id: string
  transcript: string
  primary_mood?: string
  mood_score?: number
  emotions?: string[]
  sentiment?: string
  keywords?: string[]
  insight?: string
  follow_up_question?: string
  audio_url?: string
  created_at: string
}

export function formatEntryForExport(
  entry: JournalEntry,
  options: ExportOptions
): Record<string, any> {
  const formatted: Record<string, any> = {
    id: entry.id,
    content: entry.transcript,
  }

  if (options.includeTimestamps) {
    formatted.created_at = entry.created_at
    formatted.date = new Date(entry.created_at).toLocaleDateString()
    formatted.time = new Date(entry.created_at).toLocaleTimeString()
  }

  if (options.includeMoodAnalysis) {
    formatted.primary_mood = entry.primary_mood
    formatted.mood_score = entry.mood_score
    formatted.sentiment = entry.sentiment
  }

  if (options.includeEmotions && entry.emotions) {
    formatted.emotions = entry.emotions.join(', ')
  }

  if (options.includeInsights) {
    formatted.insight = entry.insight
    formatted.follow_up_question = entry.follow_up_question
    if (entry.keywords) {
      formatted.keywords = entry.keywords.join(', ')
    }
  }

  if (options.includeAudioUrls && entry.audio_url) {
    formatted.audio_url = entry.audio_url
  }

  return formatted
}

export function generateFileName(format: string, prefix: string = 'pulse-journal-export'): string {
  const now = new Date()
  const dateStr = now.toISOString().slice(0, 19).replace(/[:-]/g, '').replace('T', '-')
  return `${prefix}-${dateStr}.${format}`
}

