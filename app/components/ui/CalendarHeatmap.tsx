'use client'

import { useMemo, useState, useEffect } from 'react'
import styles from './CalendarHeatmap.module.css'

interface DayData {
  date: Date
  value: number // 0-4 intensity level
}

interface CalendarHeatmapProps {
  data?: DayData[]
  month?: Date
  onDayClick?: (date: Date, value: number) => void
}

// Purple color palette matching the reference design
const INTENSITY_COLORS = [
  'transparent',               // Level 0: No data - transparent
  '#E8E0F0',                   // Level 1: Lightest purple
  '#C9B8E0',                   // Level 2: Light purple
  '#9B7BC7',                   // Level 3: Medium purple
  '#6B4E9B',                   // Level 4: Deep purple
]

// Deterministic mock data based on day (no Math.random to avoid hydration issues)
const generateMockData = (month: Date): DayData[] => {
  const year = month.getFullYear()
  const monthIndex = month.getMonth()
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  
  const mockData: DayData[] = []
  
  // Deterministic pattern based on day number
  for (let day = 1; day <= daysInMonth; day++) {
    const dayOfWeek = new Date(year, monthIndex, day).getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    
    // Use day number to create deterministic pattern
    const hash = (day * 7 + monthIndex * 13) % 10
    const shouldHaveActivity = isWeekend ? hash < 3 : hash < 7
    
    if (shouldHaveActivity) {
      const intensity = ((day + monthIndex) % 4) + 1 // 1-4 deterministic
      mockData.push({
        date: new Date(year, monthIndex, day),
        value: intensity
      })
    }
  }
  
  return mockData
}

export default function CalendarHeatmap({ 
  data, 
  month = new Date(),
  onDayClick 
}: CalendarHeatmapProps) {
  
  // Use provided data or generate mock data
  const activityData = useMemo(() => {
    return data && data.length > 0 ? data : generateMockData(month)
  }, [data, month])
  
  const calendarData = useMemo(() => {
    const year = month.getFullYear()
    const monthIndex = month.getMonth()
    const firstDay = new Date(year, monthIndex, 1)
    const lastDay = new Date(year, monthIndex + 1, 0)
    const startDayOfWeek = firstDay.getDay()
    const daysInMonth = lastDay.getDate()
    
    // Create a map for quick lookup
    const dataMap = new Map<string, number>()
    activityData.forEach(d => {
      const key = `${d.date.getFullYear()}-${d.date.getMonth()}-${d.date.getDate()}`
      dataMap.set(key, d.value)
    })
    
    // Build calendar grid
    const weeks: (number | null)[][] = []
    let currentWeek: (number | null)[] = []
    
    // Add empty cells for days before the 1st
    for (let i = 0; i < startDayOfWeek; i++) {
      currentWeek.push(null)
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push(day)
      if (currentWeek.length === 7) {
        weeks.push(currentWeek)
        currentWeek = []
      }
    }
    
    // Fill remaining cells in last week
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null)
      }
      weeks.push(currentWeek)
    }
    
    return { weeks, year, monthIndex, dataMap, today: new Date() }
  }, [month, activityData])

  // Calculate total chats this month (hardcoded for now)
  const totalChats = 47
  const comparisonText = "+12 vs this time last month"

  const getIntensity = (day: number | null): number => {
    if (day === null) return -1
    const key = `${calendarData.year}-${calendarData.monthIndex}-${day}`
    return calendarData.dataMap.get(key) ?? 0
  }

  const isToday = (day: number | null): boolean => {
    if (day === null) return false
    const today = calendarData.today
    return today.getDate() === day && 
           today.getMonth() === calendarData.monthIndex && 
           today.getFullYear() === calendarData.year
  }

  const handleDayClick = (day: number | null) => {
    if (day === null || !onDayClick) return
    const date = new Date(calendarData.year, calendarData.monthIndex, day)
    const intensity = getIntensity(day)
    onDayClick(date, intensity)
  }

  const monthName = new Date(calendarData.year, calendarData.monthIndex)
    .toLocaleDateString('en-US', { month: 'long' })

  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className={styles.container}>
      {/* Toggle button - top right */}
      <button 
        className={styles.moreButton}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="5" r="1.5" fill="currentColor"/>
            <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
            <circle cx="12" cy="19" r="1.5" fill="currentColor"/>
          </svg>
        )}
      </button>

      {/* Content with fade transition */}
      <div className={`${styles.content} ${isCollapsed ? styles.contentHidden : ''}`}>
        {/* Header with stats */}
        <div className={styles.header}>
          <span className={styles.monthLabel}>{monthName} check-ins</span>
          <div className={styles.statValue}>{totalChats}</div>
          <div className={styles.comparison}>
            <span className={styles.comparisonArrow}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            {comparisonText}
          </div>
        </div>
        
        {/* Calendar grid */}
        <div className={styles.grid}>
          {calendarData.weeks.map((week, weekIndex) => (
            <div key={weekIndex} className={styles.week}>
              {week.map((day, dayIndex) => {
                const intensity = getIntensity(day)
                
                // Text color based on intensity
                const textColor = intensity === 0 
                    ? 'rgba(0, 0, 0, 0.4)'
                    : intensity >= 3 
                      ? 'rgba(255, 255, 255, 0.95)' 
                      : 'rgba(0, 0, 0, 0.7)'
                
                // Background color
                const bgColor = day !== null 
                    ? INTENSITY_COLORS[intensity] 
                    : 'transparent'
                
                return (
                  <div
                    key={dayIndex}
                    className={`${styles.day} ${day === null ? styles.empty : ''}`}
                    style={{
                      backgroundColor: bgColor,
                      color: textColor
                    }}
                    onClick={() => handleDayClick(day)}
                    aria-label={day ? `${monthName} ${day}` : undefined}
                  >
                    {day !== null && <span className={styles.dayNumber}>{day}</span>}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
