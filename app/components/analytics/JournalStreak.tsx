'use client'

import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'
import { useState } from 'react'

interface JournalStreakProps {
  entries: {
    date: string
    count: number
  }[]
}

interface HeatmapValue {
  date: string
  count: number
}

export default function JournalStreak({ entries }: JournalStreakProps) {
  const [tooltipData, setTooltipData] = useState<{ date: string; count: number } | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  // Get date range (last 6 months)
  const endDate = new Date()
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - 6)

  // Format entries for heatmap
  const heatmapData = entries.map(entry => ({
    date: entry.date,
    count: entry.count
  }))

  const handleMouseEnter = (event: React.MouseEvent, value: HeatmapValue | null) => {
    if (value && value.count > 0) {
      setTooltipData({
        date: new Date(value.date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: 'numeric'
        }),
        count: value.count
      })
      setTooltipPosition({
        x: event.clientX,
        y: event.clientY
      })
    } else {
      setTooltipData(null)
    }
  }

  return (
    <div style={{
      width: '100%',
      position: 'relative'
    }}>
      <style jsx global>{`
        .react-calendar-heatmap {
          font-family: var(--font-family-satoshi);
        }
        
        .react-calendar-heatmap text {
          font-size: 10px;
          fill: var(--text-secondary);
        }

        .react-calendar-heatmap .react-calendar-heatmap-month-label {
          font-size: 12px;
          fill: var(--text-primary);
          font-weight: 500;
        }

        .react-calendar-heatmap rect {
          rx: 3;
        }

        .react-calendar-heatmap .color-empty {
          fill: var(--border-subtle);
        }

        .react-calendar-heatmap .color-scale-1 {
          fill: #d1fae5;
        }

        .react-calendar-heatmap .color-scale-2 {
          fill: #6ee7b7;
        }

        .react-calendar-heatmap .color-scale-3 {
          fill: #34d399;
        }

        .react-calendar-heatmap .color-scale-4 {
          fill: #10b981;
        }

        .react-calendar-heatmap rect:hover {
          stroke: var(--text-primary);
          stroke-width: 2;
        }
      `}</style>

      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={heatmapData}
        classForValue={(value) => {
          if (!value || value.count === 0) {
            return 'color-empty'
          }
          if (value.count === 1) return 'color-scale-1'
          if (value.count === 2) return 'color-scale-2'
          if (value.count === 3) return 'color-scale-3'
          return 'color-scale-4'
        }}
        showWeekdayLabels
        onMouseOver={handleMouseEnter}
      />

      {/* Custom Tooltip */}
      {tooltipData && (
        <div style={{
          position: 'fixed',
          left: `${tooltipPosition.x + 10}px`,
          top: `${tooltipPosition.y - 10}px`,
          background: 'white',
          padding: '8px 12px',
          borderRadius: '6px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          border: '1px solid var(--border-subtle)',
          fontSize: '13px',
          fontFamily: 'var(--font-family-satoshi)',
          pointerEvents: 'none',
          zIndex: 1000
        }}>
          <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '2px' }}>
            {tooltipData.date}
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>
            {tooltipData.count} {tooltipData.count === 1 ? 'entry' : 'entries'}
          </div>
        </div>
      )}

      {/* Legend */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginTop: '16px',
        fontSize: '12px',
        color: 'var(--text-secondary)',
        fontFamily: 'var(--font-family-satoshi)'
      }}>
        <span>Less</span>
        <div style={{ width: '12px', height: '12px', background: 'var(--border-subtle)', borderRadius: '2px' }} />
        <div style={{ width: '12px', height: '12px', background: '#d1fae5', borderRadius: '2px' }} />
        <div style={{ width: '12px', height: '12px', background: '#6ee7b7', borderRadius: '2px' }} />
        <div style={{ width: '12px', height: '12px', background: '#34d399', borderRadius: '2px' }} />
        <div style={{ width: '12px', height: '12px', background: '#10b981', borderRadius: '2px' }} />
        <span>More</span>
      </div>
    </div>
  )
}
