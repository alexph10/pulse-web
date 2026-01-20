'use client'

import { useMemo } from 'react'
import styles from './insights.module.css'

type EmotionType = 'joy' | 'calm' | 'anxiety' | 'sadness' | 'anger' | 'neutral'

interface SentimentDay {
  date: string
  dayOfMonth: number
  dominantEmotion: EmotionType
  intensity: number
}

interface SentimentHeatmapCardProps {
  data?: SentimentDay[]
  onExploreClick?: () => void
}

const EMOTION_COLORS: Record<EmotionType, string> = {
  joy: '#b3f9e5',
  calm: '#7dd4c0',
  neutral: 'rgba(179, 249, 229, 0.3)',
  anxiety: '#f9e5b3',
  sadness: '#b3d4f9',
  anger: '#f9b3b3',
}

function generateMockData(): SentimentDay[] {
  const emotions: EmotionType[] = ['joy', 'calm', 'anxiety', 'sadness', 'anger', 'neutral']
  const weights = [0.3, 0.25, 0.15, 0.1, 0.05, 0.15]
  const data: SentimentDay[] = []
  const today = new Date()
  
  for (let i = 27; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    const random = Math.random()
    let cumulative = 0
    let selectedEmotion: EmotionType = 'neutral'
    
    for (let j = 0; j < weights.length; j++) {
      cumulative += weights[j]
      if (random <= cumulative) {
        selectedEmotion = emotions[j]
        break
      }
    }
    
    data.push({
      date: date.toISOString().split('T')[0],
      dayOfMonth: date.getDate(),
      dominantEmotion: selectedEmotion,
      intensity: 0.6 + Math.random() * 0.4,
    })
  }
  
  return data
}

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export default function SentimentHeatmapCard({ data, onExploreClick }: SentimentHeatmapCardProps) {
  const sentimentData = useMemo(() => data || generateMockData(), [data])
  
  const weeks = useMemo(() => {
    const result: (SentimentDay | null)[][] = []
    let currentWeek: (SentimentDay | null)[] = []
    
    if (sentimentData.length > 0) {
      const firstDate = new Date(sentimentData[0].date)
      const dayOfWeek = (firstDate.getDay() + 6) % 7
      for (let i = 0; i < dayOfWeek; i++) currentWeek.push(null)
    }
    
    sentimentData.forEach((day) => {
      currentWeek.push(day)
      if (currentWeek.length === 7) {
        result.push(currentWeek)
        currentWeek = []
      }
    })
    
    while (currentWeek.length > 0 && currentWeek.length < 7) currentWeek.push(null)
    if (currentWeek.length > 0) result.push(currentWeek)
    while (result.length < 4) result.unshift(Array(7).fill(null))
    
    return result.slice(-4)
  }, [sentimentData])
  
  const dominantEmotion = useMemo(() => {
    const counts: Record<EmotionType, number> = { joy: 0, calm: 0, anxiety: 0, sadness: 0, anger: 0, neutral: 0 }
    sentimentData.forEach(day => counts[day.dominantEmotion]++)
    
    let maxEmotion: EmotionType = 'neutral'
    let maxCount = 0
    Object.entries(counts).forEach(([emotion, count]) => {
      if (count > maxCount) { maxCount = count; maxEmotion = emotion as EmotionType }
    })
    return maxEmotion
  }, [sentimentData])
  
  return (
    <div className={styles.sentimentCard}>
      {/* Header with three-dot menu */}
      <div className={styles.cardHeaderRow}>
        <span className={styles.cardLabel}>Sentiment</span>
        <button className={styles.cardAction} onClick={onExploreClick}>
          <span className={styles.menuDots}>
            <span className={styles.menuDot} />
            <span className={styles.menuDot} />
            <span className={styles.menuDot} />
          </span>
        </button>
      </div>
      
      {/* Hero emotion */}
      <div className={styles.sentimentHero}>{dominantEmotion}</div>
      
      {/* Weekdays */}
      <div className={styles.sentimentWeekdays}>
        {WEEKDAYS.map((day, i) => (
          <span key={i} className={styles.sentimentWeekday}>{day}</span>
        ))}
      </div>
      
      {/* Heatmap with date numbers */}
      <div className={styles.sentimentGrid}>
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className={styles.sentimentWeek}>
            {week.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className={`${styles.sentimentCell} ${!day ? styles.sentimentCellEmpty : ''}`}
                style={day ? {
                  backgroundColor: EMOTION_COLORS[day.dominantEmotion],
                  opacity: day.intensity,
                } : undefined}
              >
                {day && <span className={styles.cellDate}>{day.dayOfMonth}</span>}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
