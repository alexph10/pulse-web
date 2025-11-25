'use client'

import { format, subDays } from 'date-fns'

interface DayData {
  date: Date
  completed: boolean
  count: number
}

interface WeeklySummaryProps {
  data?: DayData[]
}

export default function WeeklySummary({ data }: WeeklySummaryProps) {
  // Generate last 7 days
  const days = data || Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i)
    return {
      date,
      completed: Math.random() > 0.3,
      count: Math.floor(Math.random() * 5)
    }
  })

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
          This Week
        </h3>
        <p style={{
          fontSize: '10px',
          color: '#a39d96',
          fontFamily: 'var(--font-family-satoshi)',
        }}>
          Last 7 days
        </p>
      </div>

      {/* Days Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '8px',
      }}>
        {days.map((day, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {/* Day Label */}
            <span style={{
              fontSize: '10px',
              color: '#a39d96',
              fontFamily: 'var(--font-family-satoshi)',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
            }}>
              {format(day.date, 'EEE')}
            </span>

            {/* Completion Dot */}
            <div style={{
              width: '28px',
              height: '28px',
              background: day.completed 
                ? '#2d5a3d' 
                : 'rgba(228, 221, 211, 0.08)',
              border: '1px solid rgba(228, 221, 211, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'default',
            }}>
              {day.completed && (
                <span style={{
                  fontSize: '10px',
                  fontWeight: '600',
                  color: '#e4ddd3',
                  fontFamily: 'var(--font-family-satoshi)',
                }}>
                  {day.count}
                </span>
              )}
            </div>

            {/* Date */}
            <span style={{
              fontSize: '10px',
              color: day.completed ? '#e4ddd3' : '#a39d96',
              fontFamily: 'var(--font-family-satoshi)',
              fontWeight: day.completed ? '600' : '400',
            }}>
              {format(day.date, 'd')}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
