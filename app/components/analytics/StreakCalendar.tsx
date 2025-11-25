'use client'

import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek } from 'date-fns'

interface CalendarDay {
  date: Date
  hasActivity: boolean
  count?: number
}

interface StreakCalendarProps {
  data?: CalendarDay[]
  month?: Date
}

export default function StreakCalendar({ data, month = new Date() }: StreakCalendarProps) {
  const monthStart = startOfMonth(month)
  const monthEnd = endOfMonth(month)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  // Create activity map
  const activityMap = new Map<string, CalendarDay>()
  if (data) {
    data.forEach(day => {
      activityMap.set(format(day.date, 'yyyy-MM-dd'), day)
    })
  } else {
    // Sample data - 70% activity rate
    days.forEach(day => {
      if (isSameMonth(day, month) && Math.random() > 0.3) {
        activityMap.set(format(day, 'yyyy-MM-dd'), {
          date: day,
          hasActivity: true,
          count: Math.floor(Math.random() * 5) + 1
        })
      }
    })
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div style={{
      background: '#252c2c',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      {/* Header */}
      <div>
        <h3 style={{
          fontSize: '12px',
          fontWeight: '600',
          color: '#e4ddd3',
          fontFamily: 'var(--font-family-satoshi)',
          marginBottom: '2px',
          letterSpacing: '-0.01em'
        }}>
          {format(month, 'MMMM yyyy')}
        </h3>
        <p style={{
          fontSize: '9px',
          color: '#a39d96',
          fontFamily: 'var(--font-family-satoshi)',
        }}>
          Monthly activity
        </p>
      </div>

      {/* Calendar Grid */}
      <div>
        {/* Week day headers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '2px',
          marginBottom: '4px',
        }}>
          {weekDays.map(day => (
            <div
              key={day}
              style={{
                fontSize: '8px',
                color: '#a39d96',
                fontFamily: 'var(--font-family-satoshi)',
                fontWeight: '500',
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '2px',
        }}>
          {days.map((day, idx) => {
            const dateKey = format(day, 'yyyy-MM-dd')
            const activity = activityMap.get(dateKey)
            const isCurrentMonth = isSameMonth(day, month)
            const isToday = isSameDay(day, new Date())

            return (
              <div
                key={idx}
                style={{
                  aspectRatio: '1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: activity?.hasActivity 
                    ? '#2d5a3d' 
                    : isCurrentMonth 
                      ? 'rgba(228, 221, 211, 0.08)' 
                      : 'transparent',
                  border: isToday 
                    ? '1px solid #e4ddd3' 
                    : '1px solid rgba(228, 221, 211, 0.12)',
                  opacity: isCurrentMonth ? 1 : 0.3,
                  cursor: isCurrentMonth ? 'default' : 'not-allowed',
                  transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <span style={{
                  fontSize: '9px',
                  fontWeight: activity?.hasActivity ? '600' : '400',
                  color: activity?.hasActivity 
                    ? '#e4ddd3' 
                    : isCurrentMonth 
                      ? '#a39d96' 
                      : 'rgba(163, 157, 150, 0.5)',
                  fontFamily: 'var(--font-family-satoshi)',
                }}>
                  {format(day, 'd')}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '9px',
        color: '#a39d96',
        fontFamily: 'var(--font-family-satoshi)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '8px', height: '8px', background: '#2d5a3d' }} />
          <span>Active</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '8px', height: '8px', background: 'rgba(228, 221, 211, 0.08)', border: '1px solid rgba(228, 221, 211, 0.12)' }} />
          <span>Inactive</span>
        </div>
      </div>
    </div>
  )
}
