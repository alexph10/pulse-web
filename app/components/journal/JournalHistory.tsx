'use client'

import { useState } from 'react'
import { useSearch } from '@/lib/hooks/useSearch'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { MagnifyingGlass, Funnel, Export, Trash, Calendar, Tag } from '@phosphor-icons/react'
import { useAuth } from '@/app/contexts/AuthContext'
import styles from './JournalHistory.module.css'

interface JournalEntry {
  id: string
  transcript: string
  primary_mood?: string
  mood_score?: number
  created_at: string
}

interface JournalHistoryProps {
  entries: JournalEntry[]
  onEntryClick?: (entry: JournalEntry) => void
  onDelete?: (entryId: string) => void
  onExport?: () => void
}

export function JournalHistory({ entries, onEntryClick, onDelete, onExport }: JournalHistoryProps) {
  const { user } = useAuth()
  const [showFilters, setShowFilters] = useState(false)
  const [selectedEntries, setSelectedEntries] = useState<Set<string>>(new Set())

  const {
    query,
    setQuery,
    filters,
    setFilters,
    results,
    isSearching,
    search,
    clearSearch,
  } = useSearch({
    userId: user?.id || '',
    table: 'journal_entries',
    searchFields: ['transcript'],
  })

  // Use search results if searching, otherwise use all entries
  const displayEntries = query || filters.mood || filters.dateRange ? results : entries

  const handleSearch = () => {
    search()
  }

  const handleBulkDelete = () => {
    // Implementation for bulk delete
    selectedEntries.forEach(id => {
      if (onDelete) onDelete(id)
    })
    setSelectedEntries(new Set())
  }

  const toggleSelect = (entryId: string) => {
    const newSelected = new Set(selectedEntries)
    if (newSelected.has(entryId)) {
      newSelected.delete(entryId)
    } else {
      newSelected.add(entryId)
    }
    setSelectedEntries(newSelected)
  }

  const getMoodColor = (mood?: string): string => {
    const moodColors: Record<string, string> = {
      'joyful': '#10b981',
      'calm': '#3b82f6',
      'anxious': '#f59e0b',
      'frustrated': '#ef4444',
      'sad': '#6366f1',
      'excited': '#ec4899',
      'neutral': '#6b7280',
    }
    return mood ? moodColors[mood.toLowerCase()] || 'var(--accent-primary)' : 'var(--text-tertiary)'
  }

  return (
    <div className={styles.history}>
      {/* Search and Filters */}
      <div className={styles.searchSection}>
        <div className={styles.searchBar}>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search journal entries..."
            leftIcon={MagnifyingGlass}
          />
          <Button onClick={handleSearch} variant="primary" size="md">
            Search
          </Button>
        </div>

        <div className={styles.actions}>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="tertiary"
            size="sm"
            leftIcon={Funnel}
          >
            Filters
          </Button>
          {selectedEntries.size > 0 && (
            <Button
              onClick={handleBulkDelete}
              variant="danger"
              size="sm"
              leftIcon={Trash}
            >
              Delete ({selectedEntries.size})
            </Button>
          )}
          <Button
            onClick={onExport}
            variant="secondary"
            size="sm"
            leftIcon={Export}
          >
            Export
          </Button>
        </div>

        {showFilters && (
          <Card elevation={1} className={styles.filters}>
            <div className={styles.filterRow}>
              <label>Mood</label>
              <select
                value={filters.mood || ''}
                onChange={(e) => setFilters({ ...filters, mood: e.target.value || undefined })}
                className={styles.filterSelect}
              >
                <option value="">All moods</option>
                <option value="joyful">Joyful</option>
                <option value="calm">Calm</option>
                <option value="anxious">Anxious</option>
                <option value="frustrated">Frustrated</option>
                <option value="sad">Sad</option>
                <option value="excited">Excited</option>
              </select>
            </div>
            <div className={styles.filterRow}>
              <label>Date Range</label>
              <div className={styles.dateInputs}>
                <input
                  type="date"
                  value={filters.dateRange?.start || ''}
                  onChange={(e) => setFilters({
                    ...filters,
                    dateRange: { ...filters.dateRange, start: e.target.value } as any,
                  })}
                  className={styles.dateInput}
                />
                <span>to</span>
                <input
                  type="date"
                  value={filters.dateRange?.end || ''}
                  onChange={(e) => setFilters({
                    ...filters,
                    dateRange: { ...filters.dateRange, end: e.target.value } as any,
                  })}
                  className={styles.dateInput}
                />
              </div>
            </div>
            <div className={styles.filterActions}>
              <Button onClick={handleSearch} variant="primary" size="sm">
                Apply Filters
              </Button>
              <Button onClick={clearSearch} variant="ghost" size="sm">
                Clear
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Entries List */}
      <div className={styles.entriesList}>
        {displayEntries.length === 0 ? (
          <div className={styles.empty}>
            <p>No entries found</p>
            {query && <Button onClick={clearSearch} variant="ghost" size="sm">Clear search</Button>}
          </div>
        ) : (
          displayEntries.map((entry) => (
            <Card
              key={entry.id}
              elevation={1}
              hoverable
              className={styles.entryCard}
              onClick={() => onEntryClick?.(entry)}
            >
              <div className={styles.entryHeader}>
                <div className={styles.entryMeta}>
                  <div
                    className={styles.moodBadge}
                    style={{ backgroundColor: getMoodColor(entry.primary_mood) }}
                  >
                    {entry.primary_mood || 'Neutral'}
                  </div>
                  <span className={styles.date}>
                    {new Date(entry.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  {entry.mood_score !== undefined && (
                    <span className={styles.score}>
                      Score: {entry.mood_score}/10
                    </span>
                  )}
                </div>
                <input
                  type="checkbox"
                  checked={selectedEntries.has(entry.id)}
                  onChange={(e) => {
                    e.stopPropagation()
                    toggleSelect(entry.id)
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className={styles.checkbox}
                />
              </div>
              <p className={styles.preview}>
                {entry.transcript.substring(0, 200)}
                {entry.transcript.length > 200 && '...'}
              </p>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

