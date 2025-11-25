'use client'

interface HourData {
  hour: number
  count: number
}

interface TimeOfDayHeatmapProps {
  data?: HourData[][]
}

export default function TimeOfDayHeatmap({ data }: TimeOfDayHeatmapProps) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const hours = Array.from({ length: 24 }, (_, i) => i)

  // Generate sample data: 7 days × 24 hours
  const sampleData: HourData[][] = data || days.map(() => 
    hours.map(hour => ({
      hour,
      count: Math.random() > 0.5 ? Math.floor(Math.random() * 8) : 0
    }))
  )

  const displayData = data || sampleData

  // Find max value for color scaling
  const maxCount = Math.max(
    ...displayData.flat().map(d => d.count),
    1
  )

  const getIntensity = (count: number) => {
    if (count === 0) return 0
    return (count / maxCount) * 0.8 + 0.2
  }

  const getTimeLabel = (hour: number) => {
    if (hour === 0) return '12a'
    if (hour === 12) return '12p'
    if (hour < 12) return `${hour}a`
    return `${hour - 12}p`
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
          Activity by Time
        </h3>
        <p style={{
          fontSize: '10px',
          color: '#a39d96',
          fontFamily: 'var(--font-family-satoshi)',
        }}>
          Entries by day and hour
        </p>
      </div>

      {/* Heatmap */}
      <div style={{
        display: 'flex',
        gap: '8px',
      }}>
        {/* Day labels */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          paddingTop: '16px',
        }}>
          {days.map(day => (
            <div
              key={day}
              style={{
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                fontSize: '9px',
                color: '#a39d96',
                fontFamily: 'var(--font-family-satoshi)',
                fontWeight: '500',
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          {/* Hour labels */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(24, 1fr)',
            gap: '2px',
          }}>
            {hours.filter((_, i) => i % 3 === 0).map(hour => (
              <div
                key={hour}
                style={{
                  gridColumn: `${hour + 1} / span 3`,
                  fontSize: '8px',
                  color: '#a39d96',
                  fontFamily: 'var(--font-family-satoshi)',
                  textAlign: 'center',
                }}
              >
                {getTimeLabel(hour)}
              </div>
            ))}
          </div>

          {/* Cells */}
          {displayData.map((dayData, dayIdx) => (
            <div
              key={dayIdx}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(24, 1fr)',
                gap: '2px',
              }}
            >
              {dayData.map((hourData, hourIdx) => {
                const intensity = getIntensity(hourData.count)
                return (
                  <div
                    key={hourIdx}
                    style={{
                      height: '16px',
                      background: intensity > 0 
                        ? `rgba(45, 90, 61, ${intensity})` 
                        : 'rgba(228, 221, 211, 0.08)',
                      border: '1px solid rgba(228, 221, 211, 0.12)',
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: intensity > 0 ? `inset 0 -1px 2px rgba(0, 0, 0, 0.1)` : 'none',
                    }}
                    title={`${days[dayIdx]} ${getTimeLabel(hourData.hour)}: ${hourData.count} entries`}
                    onMouseEnter={(e) => {
                      if (intensity > 0) {
                        e.currentTarget.style.transform = 'scale(1.15)'
                        e.currentTarget.style.boxShadow = `0 2px 8px rgba(45, 90, 61, ${intensity * 0.5}), inset 0 -1px 2px rgba(0, 0, 0, 0.1)`
                        e.currentTarget.style.zIndex = '10'
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)'
                      e.currentTarget.style.boxShadow = intensity > 0 ? `inset 0 -1px 2px rgba(0, 0, 0, 0.1)` : 'none'
                      e.currentTarget.style.zIndex = '1'
                    }}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
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
          Less
        </span>
        {[0, 0.25, 0.5, 0.75, 1].map((intensity, idx) => (
          <div
            key={idx}
            style={{
              width: '16px',
              height: '12px',
              background: intensity > 0 
                ? `rgba(45, 90, 61, ${intensity * 0.8 + 0.2})` 
                : 'rgba(228, 221, 211, 0.08)',
              border: '1px solid rgba(228, 221, 211, 0.12)',
            }}
          />
        ))}
        <span style={{
          fontSize: '9px',
          color: '#a39d96',
          fontFamily: 'var(--font-family-satoshi)',
        }}>
          More
        </span>
      </div>
    </div>
  )
}
