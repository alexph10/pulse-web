'use client'

import { useMemo } from 'react'

interface MoodData {
  date: Date | string // Support both Date objects and YYYY-MM-DD strings
  score: number // 0-10
  mood?: string
}

interface MoodHeatmapProps {
  data: MoodData[]
  weeks?: number // Number of weeks to show (default 12)
  onCellClick?: (data: MoodData) => void
}

export default function MoodHeatmap({ data, weeks = 12, onCellClick }: MoodHeatmapProps) {
  const { grid, months } = useMemo(() => {
    // Calculate dates for the grid
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - (weeks * 7))

    // Create a map of date strings to mood data
    const dataMap = new Map<string, MoodData>()
    data.forEach(d => {
      const dateStr = typeof d.date === 'string' 
        ? d.date 
        : d.date.toISOString().split('T')[0]
      dataMap.set(dateStr, d)
    })

    // Generate grid (7 rows for days of week, weeks columns)
    const gridData: (MoodData | null)[][] = Array(7).fill(null).map(() => [])
    const monthLabels: { month: string; column: number }[] = []
    let lastMonth = -1

    for (let week = 0; week < weeks; week++) {
      for (let day = 0; day < 7; day++) {
        const currentDate = new Date(startDate)
        currentDate.setDate(startDate.getDate() + (week * 7) + day)
        
        const dateStr = currentDate.toISOString().split('T')[0]
        const cellData = dataMap.get(dateStr)
        
        gridData[day][week] = cellData || null

        // Track month labels
        if (day === 0) {
          const month = currentDate.getMonth()
          if (month !== lastMonth) {
            monthLabels.push({
              month: currentDate.toLocaleDateString('en-US', { month: 'short' }),
              column: week
            })
            lastMonth = month
          }
        }
      }
    }

    return { grid: gridData, months: monthLabels }
  }, [data, weeks])

  const getCellColor = (score: number | undefined) => {
    if (score === undefined) return 'rgba(228, 221, 211, 0.08)'
    
    // Use signature card green color with intensity
    const intensity = score / 10
    const baseR = 45
    const baseG = 90
    const baseB = 61
    
    const r = Math.round(baseR * (0.3 + intensity * 0.7))
    const g = Math.round(baseG * (0.3 + intensity * 0.7))
    const b = Math.round(baseB * (0.3 + intensity * 0.7))
    
    return `rgba(${r}, ${g}, ${b}, ${0.4 + intensity * 0.6})`
  }

  const cellSize = 12
  const cellGap = 3

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <div style={{ minWidth: `${weeks * (cellSize + cellGap)}px` }}>
        {/* Month labels */}
        <div
          style={{
            display: 'flex',
            marginBottom: '8px',
            marginLeft: '28px',
            position: 'relative',
            height: '16px',
          }}
        >
          {months.map((m, idx) => (
            <span
              key={idx}
              style={{
                position: 'absolute',
                left: `${m.column * (cellSize + cellGap)}px`,
                fontSize: '11px',
                color: '#a39d96',
                fontFamily: 'var(--font-family-satoshi)',
              }}
            >
              {m.month}
            </span>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Day labels */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: `${cellGap}px`,
              fontSize: '10px',
              color: '#a39d96',
              fontFamily: 'var(--font-family-satoshi)',
              paddingTop: '2px',
            }}
          >
            <span style={{ height: `${cellSize}px`, lineHeight: `${cellSize}px` }}>Mon</span>
            <span style={{ height: `${cellSize}px`, lineHeight: `${cellSize}px`, opacity: 0 }}>Tue</span>
            <span style={{ height: `${cellSize}px`, lineHeight: `${cellSize}px` }}>Wed</span>
            <span style={{ height: `${cellSize}px`, lineHeight: `${cellSize}px`, opacity: 0 }}>Thu</span>
            <span style={{ height: `${cellSize}px`, lineHeight: `${cellSize}px` }}>Fri</span>
            <span style={{ height: `${cellSize}px`, lineHeight: `${cellSize}px`, opacity: 0 }}>Sat</span>
            <span style={{ height: `${cellSize}px`, lineHeight: `${cellSize}px` }}>Sun</span>
          </div>

          {/* Heatmap grid */}
          <div
            style={{
              display: 'flex',
              gap: `${cellGap}px`,
            }}
          >
            {grid[0].map((_, weekIdx) => (
              <div
                key={weekIdx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: `${cellGap}px`,
                }}
              >
                {grid.map((week, dayIdx) => {
                  const cellData = week[weekIdx]
                  return (
                    <div
                      key={`${weekIdx}-${dayIdx}`}
                      onClick={() => cellData && onCellClick?.(cellData)}
                      style={{
                        width: `${cellSize}px`,
                        height: `${cellSize}px`,
                        backgroundColor: getCellColor(cellData?.score),
                        border: '1px solid rgba(228, 221, 211, 0.12)',
                        cursor: cellData ? 'pointer' : 'default',
                        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                      onMouseEnter={(e) => {
                        if (cellData) {
                          e.currentTarget.style.transform = 'scale(1.2)'
                          e.currentTarget.style.borderColor = 'var(--border-emphasis)'
                          e.currentTarget.style.zIndex = '10'
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)'
                        e.currentTarget.style.borderColor = 'var(--border-subtle)'
                        e.currentTarget.style.zIndex = '1'
                      }}
                      title={
                        cellData
                          ? `${cellData.date}: ${cellData.mood || 'Score'} (${cellData.score}/10)`
                          : undefined
                      }
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '16px',
            marginLeft: '28px',
          }}
        >
          <span
            style={{
              fontSize: '11px',
              color: 'var(--text-tertiary)',
              fontFamily: 'var(--font-family-satoshi)',
            }}
          >
            Less
          </span>
          {[0, 2.5, 5, 7.5, 10].map((score) => (
            <div
              key={score}
              style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                backgroundColor: getCellColor(score),
                border: '1px solid var(--border-subtle)',
              }}
            />
          ))}
          <span
            style={{
              fontSize: '11px',
              color: 'var(--text-tertiary)',
              fontFamily: 'var(--font-family-satoshi)',
            }}
          >
            More
          </span>
        </div>
      </div>
    </div>
  )
}
