'use client'

import { useState } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { type JournalEntry as ExportJournalEntry } from '@/lib/export/exportUtils'
import { exportToJSON } from '@/lib/export/jsonExporter'
import { exportToCSV } from '@/lib/export/csvExporter'
import { exportToTXT } from '@/lib/export/txtExporter'
import { exportToPDF } from '@/lib/export/pdfExporter'
import { generateFileName } from '@/lib/export/exportUtils'
import { type ExportOptions } from '@/lib/export/exportUtils'
import styles from './ExportModal.module.css'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  entries: any[] // Journal entries from the app
  selectedEntryIds?: Set<string>
}

export function ExportModal({
  isOpen,
  onClose,
  entries,
  selectedEntryIds,
}: ExportModalProps) {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'json',
    includeTimestamps: true,
    includeMoodAnalysis: true,
    includeEmotions: true,
    includeInsights: true,
    includeAudioUrls: false,
  })
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: '',
  })
  const [exportScope, setExportScope] = useState<'all' | 'selected' | 'range'>(
    selectedEntryIds && selectedEntryIds.size > 0 ? 'selected' : 'all'
  )
  const [isExporting, setIsExporting] = useState(false)

  if (!isOpen) return null

  // Filter entries based on scope
  const getFilteredEntries = (): JournalEntry[] => {
    let filtered = entries

    if (exportScope === 'selected' && selectedEntryIds) {
      filtered = filtered.filter((entry) => selectedEntryIds.has(entry.id))
    } else if (exportScope === 'range') {
      if (dateRange.start) {
        filtered = filtered.filter(
          (entry) => new Date(entry.created_at) >= new Date(dateRange.start)
        )
      }
      if (dateRange.end) {
        filtered = filtered.filter(
          (entry) => new Date(entry.created_at) <= new Date(dateRange.end)
        )
      }
    }

    return filtered
  }

  const handleExport = async () => {
    setIsExporting(true)

    try {
      const filteredEntries = getFilteredEntries()

      if (filteredEntries.length === 0) {
        alert('No entries to export')
        setIsExporting(false)
        return
      }

      // Map entries to export format
      const exportEntries: ExportJournalEntry[] = filteredEntries.map((entry) => ({
        id: entry.id,
        transcript: entry.transcript || '',
        primary_mood: entry.primary_mood,
        mood_score: entry.mood_score,
        emotions: entry.emotions,
        sentiment: entry.sentiment,
        keywords: entry.keywords,
        insight: entry.insight,
        follow_up_question: entry.follow_up_question,
        audio_url: entry.audio_url,
        created_at: entry.created_at,
      }))

      let content: string | Blob
      let mimeType: string
      let fileExtension: string

      switch (exportOptions.format) {
        case 'json':
          content = exportToJSON(exportEntries, exportOptions)
          mimeType = 'application/json'
          fileExtension = 'json'
          break
        case 'csv':
          content = exportToCSV(exportEntries, exportOptions)
          mimeType = 'text/csv'
          fileExtension = 'csv'
          break
        case 'txt':
          content = exportToTXT(exportEntries, exportOptions)
          mimeType = 'text/plain'
          fileExtension = 'txt'
          break
        case 'pdf':
          content = await exportToPDF(exportEntries, exportOptions)
          mimeType = 'application/pdf'
          fileExtension = 'pdf'
          break
        default:
          content = exportToJSON(exportEntries, exportOptions)
          mimeType = 'application/json'
          fileExtension = 'json'
      }

      // Create download
      const blob =
        typeof content === 'string'
          ? new Blob([content], { type: mimeType })
          : content
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = generateFileName(fileExtension)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      onClose()
    } catch (error) {
      console.error('Export failed:', error)
      alert('Failed to export entries. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const filteredEntries = getFilteredEntries()

  return (
    <div className={styles.overlay} onClick={onClose}>
      <Card
        elevation={3}
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>Export Journal Entries</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close export modal"
          >
            ×
          </button>
        </div>

        <div className={styles.content}>
          {/* Export Scope */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Export Options</h3>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="scope"
                  value="all"
                  checked={exportScope === 'all'}
                  onChange={() => setExportScope('all')}
                  className={styles.radioInput}
                />
                <span>All entries ({entries.length})</span>
              </label>
              {selectedEntryIds && selectedEntryIds.size > 0 && (
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="scope"
                    value="selected"
                    checked={exportScope === 'selected'}
                    onChange={() => setExportScope('selected')}
                    className={styles.radioInput}
                  />
                  <span>Selected entries ({selectedEntryIds.size})</span>
                </label>
              )}
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="scope"
                  value="range"
                  checked={exportScope === 'range'}
                  onChange={() => setExportScope('range')}
                  className={styles.radioInput}
                />
                <span>Date range</span>
              </label>
            </div>

            {exportScope === 'range' && (
              <div className={styles.dateRange}>
                <div className={styles.dateInputGroup}>
                  <label className={styles.dateLabel}>From</label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, start: e.target.value })
                    }
                    className={styles.dateInput}
                  />
                </div>
                <div className={styles.dateInputGroup}>
                  <label className={styles.dateLabel}>To</label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, end: e.target.value })
                    }
                    className={styles.dateInput}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Format Selection */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Format</h3>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="format"
                  value="json"
                  checked={exportOptions.format === 'json'}
                  onChange={() =>
                    setExportOptions({ ...exportOptions, format: 'json' })
                  }
                  className={styles.radioInput}
                />
                <span>JSON</span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="format"
                  value="csv"
                  checked={exportOptions.format === 'csv'}
                  onChange={() =>
                    setExportOptions({ ...exportOptions, format: 'csv' })
                  }
                  className={styles.radioInput}
                />
                <span>CSV</span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="format"
                  value="pdf"
                  checked={exportOptions.format === 'pdf'}
                  onChange={() =>
                    setExportOptions({ ...exportOptions, format: 'pdf' })
                  }
                  className={styles.radioInput}
                />
                <span>PDF</span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="format"
                  value="txt"
                  checked={exportOptions.format === 'txt'}
                  onChange={() =>
                    setExportOptions({ ...exportOptions, format: 'txt' })
                  }
                  className={styles.radioInput}
                />
                <span>TXT</span>
              </label>
            </div>
          </div>

          {/* Include Options */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Include</h3>
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={exportOptions.includeTimestamps}
                  onChange={(e) =>
                    setExportOptions({
                      ...exportOptions,
                      includeTimestamps: e.target.checked,
                    })
                  }
                  className={styles.checkboxInput}
                />
                <span>Timestamps</span>
              </label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={exportOptions.includeMoodAnalysis}
                  onChange={(e) =>
                    setExportOptions({
                      ...exportOptions,
                      includeMoodAnalysis: e.target.checked,
                    })
                  }
                  className={styles.checkboxInput}
                />
                <span>Mood analysis</span>
              </label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={exportOptions.includeEmotions}
                  onChange={(e) =>
                    setExportOptions({
                      ...exportOptions,
                      includeEmotions: e.target.checked,
                    })
                  }
                  className={styles.checkboxInput}
                />
                <span>Emotions</span>
              </label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={exportOptions.includeInsights}
                  onChange={(e) =>
                    setExportOptions({
                      ...exportOptions,
                      includeInsights: e.target.checked,
                    })
                  }
                  className={styles.checkboxInput}
                />
                <span>Insights</span>
              </label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={exportOptions.includeAudioUrls}
                  onChange={(e) =>
                    setExportOptions({
                      ...exportOptions,
                      includeAudioUrls: e.target.checked,
                    })
                  }
                  className={styles.checkboxInput}
                />
                <span>Audio URLs</span>
              </label>
            </div>
          </div>

          {/* Preview */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              Preview ({filteredEntries.length} entries selected)
            </h3>
            <div className={styles.preview}>
              {filteredEntries.length === 0 ? (
                <p className={styles.previewEmpty}>
                  No entries match your selection
                </p>
              ) : (
                <ul className={styles.previewList}>
                  {filteredEntries.slice(0, 5).map((entry) => (
                    <li key={entry.id} className={styles.previewItem}>
                      {new Date(entry.created_at).toLocaleDateString()} -{' '}
                      {entry.transcript?.substring(0, 50)}...
                    </li>
                  ))}
                  {filteredEntries.length > 5 && (
                    <li className={styles.previewItem}>
                      ...and {filteredEntries.length - 5} more
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isExporting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleExport}
            disabled={isExporting || filteredEntries.length === 0}
            isLoading={isExporting}
          >
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </div>
      </Card>
    </div>
  )
}

