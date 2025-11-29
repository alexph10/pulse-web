'use client'

import { formatDistanceToNow } from 'date-fns'

interface JournalEntry {
  id: string
  title?: string
  content: string
  created_at: Date | string
  mood?: string
}

interface RecentEntriesProps {
  entries?: JournalEntry[]
  onEntryClick?: (id: string) => void
}

// Generate sample data once at module level
const generateSampleEntries = (): JournalEntry[] => {
  const now = Date.now();
  return [
    {
      id: '1',
      content: 'Had a really productive day working on the new dashboard. Feeling accomplished and energized.',
      created_at: new Date(now - 2 * 60 * 60 * 1000),
      mood: 'energized'
    },
    {
      id: '2',
      content: 'Morning meditation session was peaceful. Starting to see the benefits of consistency.',
      created_at: new Date(now - 8 * 60 * 60 * 1000),
      mood: 'calm'
    },
    {
      id: '3',
      content: 'Team meeting went well. Everyone is aligned on the project goals for next quarter.',
      created_at: new Date(now - 26 * 60 * 60 * 1000),
      mood: 'focused'
    },
    {
      id: '4',
      content: 'Completed the workout routine. Pushed through even though I was tired.',
      created_at: new Date(now - 50 * 60 * 60 * 1000),
      mood: 'determined'
    },
    {
      id: '5',
      content: 'Spending quality time with family. Grateful for these moments.',
      created_at: new Date(now - 72 * 60 * 60 * 1000),
      mood: 'grateful'
    },
  ];
};

const defaultSampleEntries = generateSampleEntries();

export default function RecentEntries({ entries, onEntryClick }: RecentEntriesProps) {
  const displayEntries = entries || defaultSampleEntries

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength).trim() + '...'
  }

  return (
    <div style={{
      background: '#252c2c',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    }}>
      {/* Header */}
      <div>
        <h3 style={{
          fontSize: '13px',
          fontWeight: '600',
          color: '#e4ddd3',
          fontFamily: 'var(--font-family-satoshi)',
          marginBottom: '2px',
          letterSpacing: '-0.01em'
        }}>
          Recent Entries
        </h3>
        <p style={{
          fontSize: '10px',
          color: '#a39d96',
          fontFamily: 'var(--font-family-satoshi)',
        }}>
          Last 5 journal entries
        </p>
      </div>

      {/* Entries List */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1px',
        background: 'rgba(228, 221, 211, 0.12)',
      }}>
        {displayEntries.slice(0, 5).map((entry) => (
          <div
            key={entry.id}
            onClick={() => onEntryClick?.(entry.id)}
            style={{
              background: '#252c2c',
              padding: '12px',
              cursor: onEntryClick ? 'pointer' : 'default',
              transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseEnter={(e) => {
              if (onEntryClick) {
                e.currentTarget.style.background = 'rgba(45, 90, 61, 0.15)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#252c2c'
            }}
          >
            {/* Content */}
            <p style={{
              fontSize: '12px',
              color: '#e4ddd3',
              fontFamily: 'var(--font-family-satoshi)',
              lineHeight: '1.5',
              marginBottom: '6px',
              letterSpacing: '-0.01em'
            }}>
              {truncateText(entry.content)}
            </p>

            {/* Footer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{
                fontSize: '9px',
                color: '#a39d96',
                fontFamily: 'var(--font-family-satoshi)',
              }}>
                {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
              </span>
              {entry.mood && (
                <>
                  <span style={{
                    fontSize: '10px',
                    color: '#a39d96',
                  }}>
                    •
                  </span>
                  <span style={{
                    fontSize: '10px',
                    color: '#a39d96',
                    fontFamily: 'var(--font-family-satoshi)',
                    textTransform: 'capitalize',
                  }}>
                    {entry.mood}
                  </span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
