'use client'

import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns'

interface MonthlyReviewProps {
  month?: Date
  totalEntries?: number
  avgMood?: number
  completionRate?: number
  topCategories?: { name: string; count: number; color: string }[]
  highlights?: string[]
}

export default function MonthlyReview({
  month = new Date(),
  totalEntries = 24,
  avgMood = 7.2,
  completionRate = 0.77,
  topCategories = [
    { name: 'Journal', count: 15, color: '#2d5a3d' },
    { name: 'Goals', count: 6, color: '#d4774a' },
    { name: 'Habits', count: 3, color: '#8a9199' },
  ],
  highlights = [
    'Maintained 12-day streak',
    'Most productive morning: 8 AM',
    'Highest mood: October 15th',
    'Best week: Oct 8-14 (7/7 days)',
  ],
}: MonthlyReviewProps) {
  const monthStart = startOfMonth(month)
  const monthEnd = endOfMonth(month)
  const monthName = format(month, 'MMMM yyyy')

  // Generate sample activity data for the month
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const activityData = days.map(day => ({
    date: day,
    hasActivity: Math.random() > 0.25,
  }))

  return (
    <div style={{
      background: '#252c2c',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    }}>
      {/* Header */}
      <div>
        <h3 style={{
          fontSize: '15px',
          fontWeight: '600',
          color: '#e4ddd3',
          fontFamily: 'var(--font-family-satoshi)',
          marginBottom: '2px',
          letterSpacing: '-0.01em'
        }}>
          Monthly Review
        </h3>
        <p style={{
          fontSize: '10px',
          color: '#a39d96',
          fontFamily: 'var(--font-family-satoshi)',
        }}>
          {monthName}
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1px',
        background: 'rgba(228, 221, 211, 0.12)',
      }}>
        <div style={{
          background: '#252c2c',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          alignItems: 'center',
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#e4ddd3',
            fontFamily: 'var(--font-family-satoshi)',
            letterSpacing: '-0.02em',
          }}>
            {totalEntries}
          </div>
          <div style={{
            fontSize: '9px',
            color: '#a39d96',
            fontFamily: 'var(--font-family-satoshi)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            Entries
          </div>
        </div>

        <div style={{
          background: '#252c2c',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          alignItems: 'center',
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#e4ddd3',
            fontFamily: 'var(--font-family-satoshi)',
            letterSpacing: '-0.02em',
          }}>
            {avgMood.toFixed(1)}
          </div>
          <div style={{
            fontSize: '9px',
            color: '#a39d96',
            fontFamily: 'var(--font-family-satoshi)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            Avg Mood
          </div>
        </div>

        <div style={{
          background: '#252c2c',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          alignItems: 'center',
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#e4ddd3',
            fontFamily: 'var(--font-family-satoshi)',
            letterSpacing: '-0.02em',
          }}>
            {Math.round(completionRate * 100)}%
          </div>
          <div style={{
            fontSize: '9px',
            color: '#a39d96',
            fontFamily: 'var(--font-family-satoshi)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            Active Days
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}>
        <h4 style={{
          fontSize: '11px',
          fontWeight: '600',
          color: '#e4ddd3',
          fontFamily: 'var(--font-family-satoshi)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          Activity Breakdown
        </h4>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          {topCategories.map((category, idx) => {
            const total = topCategories.reduce((sum, cat) => sum + cat.count, 0)
            const percentage = (category.count / total) * 100

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div style={{
                  minWidth: '60px',
                  fontSize: '11px',
                  color: '#e4ddd3',
                  fontFamily: 'var(--font-family-satoshi)',
                  fontWeight: '500',
                }}>
                  {category.name}
                </div>
                <div style={{
                  flex: 1,
                  height: '20px',
                  background: 'rgba(228, 221, 211, 0.08)',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: '8px',
                }}>
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '100%',
                    width: `${percentage}%`,
                    background: category.color,
                    transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }} />
                  <span style={{
                    position: 'relative',
                    fontSize: '9px',
                    color: '#e4ddd3',
                    fontFamily: 'var(--font-family-satoshi)',
                    fontWeight: '600',
                    mixBlendMode: 'difference',
                  }}>
                    {category.count}
                  </span>
                </div>
                <div style={{
                  minWidth: '40px',
                  textAlign: 'right',
                  fontSize: '10px',
                  color: '#a39d96',
                  fontFamily: 'var(--font-family-satoshi)',
                }}>
                  {Math.round(percentage)}%
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Month Calendar */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        <h4 style={{
          fontSize: '11px',
          fontWeight: '600',
          color: '#e4ddd3',
          fontFamily: 'var(--font-family-satoshi)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          Activity Overview
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '3px',
        }}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
            <div
              key={idx}
              style={{
                fontSize: '8px',
                color: '#a39d96',
                fontFamily: 'var(--font-family-satoshi)',
                fontWeight: '600',
                textAlign: 'center',
                padding: '4px 0',
              }}
            >
              {day}
            </div>
          ))}
          {activityData.map((day, idx) => (
            <div
              key={idx}
              style={{
                aspectRatio: '1',
                background: day.hasActivity 
                  ? '#2d5a3d' 
                  : 'rgba(228, 221, 211, 0.08)',
                border: isSameDay(day.date, new Date()) 
                  ? '1px solid #e4ddd3' 
                  : '1px solid rgba(228, 221, 211, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '9px',
                color: day.hasActivity ? '#e4ddd3' : '#a39d96',
                fontFamily: 'var(--font-family-satoshi)',
              }}
            >
              {format(day.date, 'd')}
            </div>
          ))}
        </div>
      </div>

      {/* Highlights */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}>
        <h4 style={{
          fontSize: '11px',
          fontWeight: '600',
          color: '#e4ddd3',
          fontFamily: 'var(--font-family-satoshi)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          Highlights
        </h4>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          {highlights.map((highlight, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'flex-start',
              }}
            >
              <div style={{
                width: '4px',
                height: '4px',
                background: '#2d5a3d',
                marginTop: '6px',
                flexShrink: 0,
              }} />
              <div style={{
                fontSize: '11px',
                color: '#a39d96',
                fontFamily: 'var(--font-family-satoshi)',
                lineHeight: '1.5',
              }}>
                {highlight}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
