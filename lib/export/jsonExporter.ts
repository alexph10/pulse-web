/**
 * JSON Exporter
 * Exports journal entries as JSON format
 */

import { type JournalEntry, type ExportOptions, formatEntryForExport } from './exportUtils'

export function exportToJSON(
  entries: JournalEntry[],
  options: ExportOptions
): string {
  const formattedEntries = entries.map((entry) =>
    formatEntryForExport(entry, options)
  )

  const exportData = {
    export_date: new Date().toISOString(),
    total_entries: entries.length,
    entries: formattedEntries,
  }

  return JSON.stringify(exportData, null, 2)
}

