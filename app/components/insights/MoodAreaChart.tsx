'use client'

import { useMemo } from 'react'
import styles from './insights.module.css'

export interface MoodDataPoint {
  date: string
  score: number
}

interface MoodAreaChartProps {
  data: MoodDataPoint[]
  height?: number
  showLabels?: boolean
}

export interface ChartDates {
  startDate: string
  endDate: string
}

/**
 * Convert points to smooth bezier curve path
 * Uses Catmull-Rom to Bezier conversion for smooth curves
 */
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

export default function MoodAreaChart({ data, height = 120, showLabels = true }: MoodAreaChartProps) {
  const viewBoxWidth = 400
  const viewBoxHeight = 100
  const padding = { top: 8, right: 8, bottom: 8, left: 8 }
  
  const chartWidth = viewBoxWidth - padding.left - padding.right
  const chartHeight = viewBoxHeight - padding.top - padding.bottom
  
  const { linePath, areaPath, firstPoint, lastPoint, minDate, maxDate } = useMemo(() => {
    if (data.length === 0) {
      return { linePath: '', areaPath: '', firstPoint: null, lastPoint: null, minDate: '', maxDate: '' }
    }
    
    const minScore = Math.min(...data.map(d => d.score)) - 1
    const maxScore = Math.max(...data.map(d => d.score)) + 1
    const scoreRange = maxScore - minScore
    
    const pts = data.map((d, i) => ({
      x: padding.left + (i / (data.length - 1)) * chartWidth,
      y: padding.top + chartHeight - ((d.score - minScore) / scoreRange) * chartHeight
    }))
    
    const line = pointsToSmoothPath(pts)
    
    // Create area path by closing the line path
    const first = pts[0]
    const last = pts[pts.length - 1]
    const area = `${line} L ${last.x} ${viewBoxHeight - padding.bottom} L ${first.x} ${viewBoxHeight - padding.bottom} Z`
    
    // Format dates for labels
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
    
    // Convert SVG coordinates to percentages for CSS positioning
    const firstPercent = {
      x: (first.x / viewBoxWidth) * 100,
      y: (first.y / viewBoxHeight) * 100
    }
    const lastPercent = {
      x: (last.x / viewBoxWidth) * 100,
      y: (last.y / viewBoxHeight) * 100
    }
    
    return {
      linePath: line,
      areaPath: area,
      firstPoint: firstPercent,
      lastPoint: lastPercent,
      minDate: formatDate(data[0].date),
      maxDate: formatDate(data[data.length - 1].date)
    }
  }, [data, chartWidth, chartHeight, padding.left, padding.top, padding.bottom])
  
  if (data.length === 0) {
    return (
      <div className={styles.chartContainer} style={{ height }}>
        <div className={styles.chartEmpty}>No mood data yet</div>
      </div>
    )
  }
  
  return (
    <div className={styles.chartContainer} style={{ height }}>
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        preserveAspectRatio="none"
        className={styles.chartSvg}
      >
        <defs>
          <linearGradient id="moodGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" className={styles.gradientStart} />
            <stop offset="100%" className={styles.gradientEnd} />
          </linearGradient>
        </defs>
        
        {/* Area fill */}
        <path
          d={areaPath}
          fill="url(#moodGradient)"
          className={styles.chartArea}
        />
        
        {/* Line stroke */}
        <path
          d={linePath}
          fill="none"
          className={styles.chartLine}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      
      {/* Circular dots positioned with CSS (outside SVG to stay circular) */}
      {firstPoint && (
        <div 
          className={styles.chartDotCircle}
          style={{ left: `${firstPoint.x}%`, top: `${firstPoint.y}%` }}
        />
      )}
      {lastPoint && (
        <div 
          className={styles.chartDotCircle}
          style={{ left: `${lastPoint.x}%`, top: `${lastPoint.y}%` }}
        />
      )}
      
      {/* X-axis labels */}
      {showLabels && (
        <div className={styles.chartLabels}>
          <span className={styles.chartLabel}>{minDate}</span>
          <span className={styles.chartLabel}>{maxDate}</span>
        </div>
      )}
    </div>
  )
}

// Helper to format dates for external use
export function formatChartDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

