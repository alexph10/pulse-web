/**
 * TXT Exporter
 * Exports journal entries as plain text format
 */

import { type JournalEntry, type ExportOptions, formatEntryForExport } from './exportUtils'

export function exportToTXT(
  entries: JournalEntry[],
  options: ExportOptions
): string {
  const formattedEntries = entries.map((entry) =>
    formatEntryForExport(entry, options)
  )

  const lines: string[] = []
  lines.push('Pulse Journal Export')
  lines.push('='.repeat(50))
  lines.push(`Export Date: ${new Date().toLocaleString()}`)
  lines.push(`Total Entries: ${entries.length}`)
  lines.push('')
  lines.push('='.repeat(50))
  lines.push('')

  formattedEntries.forEach((entry, index) => {
    lines.push(`Entry ${index + 1}`)
    lines.push('-'.repeat(30))

    if (options.includeTimestamps && entry.created_at) {
      const date = new Date(entry.created_at)
      lines.push(`Date: ${date.toLocaleDateString()}`)
      lines.push(`Time: ${date.toLocaleTimeString()}`)
      lines.push('')
    }

    lines.push('Content:')
    lines.push(entry.content || '')
    lines.push('')

    if (options.includeMoodAnalysis) {
      if (entry.primary_mood) {
        lines.push(`Mood: ${entry.primary_mood}`)
      }
      if (entry.mood_score !== undefined) {
        lines.push(`Mood Score: ${entry.mood_score}/10`)
      }
      if (entry.sentiment) {
        lines.push(`Sentiment: ${entry.sentiment}`)
      }
      lines.push('')
    }

    if (options.includeEmotions && entry.emotions) {
      lines.push(`Emotions: ${entry.emotions}`)
      lines.push('')
    }

    if (options.includeInsights) {
      if (entry.insight) {
        lines.push(`Insight: ${entry.insight}`)
      }
      if (entry.follow_up_question) {
        lines.push(`Follow-up: ${entry.follow_up_question}`)
      }
      if (entry.keywords) {
        lines.push(`Keywords: ${entry.keywords}`)
      }
      lines.push('')
    }

    lines.push('')
    lines.push('='.repeat(50))
    lines.push('')
  })

  return lines.join('\n')
}

