'use client'

import { useMemo } from 'react'
import styles from './insights.module.css'

interface MoodDataPoint {
  date: string
  score: number
}

interface MoodTrendChartProps {
  data: MoodDataPoint[]
}

function pointsToSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return ''
  
  const tension = 0.3
  let path = `M ${points[0].x} ${points[0].y}`
  
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[Math.min(points.length - 1, i + 2)]
    
    const cp1x = p1.x + (p2.x - p0.x) * tension
    const cp1y = p1.y + (p2.y - p0.y) * tension
    const cp2x = p2.x - (p3.x - p1.x) * tension
    const cp2y = p2.y - (p3.y - p1.y) * tension
    
    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
  }
  
  return path
}

export default function MoodTrendChart({ data }: MoodTrendChartProps) {
  const viewBoxWidth = 400
  const viewBoxHeight = 80
  const padding = { top: 8, right: 16, bottom: 16, left: 16 }
  
  const chartWidth = viewBoxWidth - padding.left - padding.right
  const chartHeight = viewBoxHeight - padding.top - padding.bottom
  
  const { linePath, areaPath, minDate, maxDate, firstPoint, lastPoint } = useMemo(() => {
    if (data.length === 0) {
      return { linePath: '', areaPath: '', minDate: '', maxDate: '', firstPoint: null, lastPoint: null }
    }
    
    const minScore = Math.min(...data.map(d => d.score)) - 1
    const maxScore = Math.max(...data.map(d => d.score)) + 1
    const scoreRange = maxScore - minScore
    
    const pts = data.map((d, i) => ({
      x: padding.left + (i / (data.length - 1)) * chartWidth,
      y: padding.top + chartHeight - ((d.score - minScore) / scoreRange) * chartHeight
    }))
    
    const line = pointsToSmoothPath(pts)
    
    const first = pts[0]
    const last = pts[pts.length - 1]
    const area = `${line} L ${last.x} ${viewBoxHeight - padding.bottom} L ${first.x} ${viewBoxHeight - padding.bottom} Z`
    
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
    
    return {
      linePath: line,
      areaPath: area,
      minDate: formatDate(data[0].date),
      maxDate: formatDate(data[data.length - 1].date),
      firstPoint: first,
      lastPoint: last
    }
  }, [data, chartWidth, chartHeight, padding.left, padding.top, padding.bottom])
  
  if (data.length === 0) {
    return (
      <div className={styles.moodTrendContainer}>
        <div className={styles.moodTrendEmpty}>No mood data yet</div>
      </div>
    )
  }
  
  return (
    <div className={styles.moodTrendContainer}>
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        preserveAspectRatio="xMidYMid meet"
        className={styles.moodTrendSvg}
      >
        <defs>
          <linearGradient id="moodTrendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8172b9" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#8172b9" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#8172b9" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Area fill */}
        <path
          d={areaPath}
          fill="url(#moodTrendGradient)"
        />
        
        {/* Line stroke */}
        <path
          d={linePath}
          fill="none"
          stroke="#8172b9"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Circle endpoint - end only (minimalist) */}
        {lastPoint && (
          <circle
            cx={lastPoint.x}
            cy={lastPoint.y}
            r="5"
            fill="#E8E0F0"
            stroke="#8172b9"
            strokeWidth="2.5"
          />
        )}
      </svg>
      
      {/* Date labels only - minimal */}
      <div className={styles.moodTrendLabels}>
        <span className={styles.moodTrendDate}>{minDate}</span>
        <span className={styles.moodTrendDate}>{maxDate}</span>
      </div>
    </div>
  )
}
