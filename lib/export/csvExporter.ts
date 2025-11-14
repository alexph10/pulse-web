/**
 * CSV Exporter
 * Exports journal entries as CSV format
 */

import { type JournalEntry, type ExportOptions, formatEntryForExport } from './exportUtils'

export function exportToCSV(
  entries: JournalEntry[],
  options: ExportOptions
): string {
  if (entries.length === 0) {
    return ''
  }

  const formattedEntries = entries.map((entry) =>
    formatEntryForExport(entry, options)
  )

  // Get all unique keys from all entries
  const allKeys = new Set<string>()
  formattedEntries.forEach((entry) => {
    Object.keys(entry).forEach((key) => allKeys.add(key))
  })

  const headers = Array.from(allKeys)

  // Create CSV header row
  const headerRow = headers.map((header) => `"${header}"`).join(',')

  // Create CSV data rows
  const dataRows = formattedEntries.map((entry) => {
    return headers
      .map((header) => {
        const value = entry[header]
        if (value === null || value === undefined) {
          return '""'
        }
        // Escape quotes and wrap in quotes
        const stringValue = String(value).replace(/"/g, '""')
        return `"${stringValue}"`
      })
      .join(',')
  })

  return [headerRow, ...dataRows].join('\n')
}

