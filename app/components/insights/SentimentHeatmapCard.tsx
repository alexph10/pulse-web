'use client'

import { useMemo } from 'react'
import { ArrowRightIcon } from '@radix-ui/react-icons'
import styles from './insights.module.css'

type EmotionType = 'joy' | 'calm' | 'anxiety' | 'sadness' | 'anger' | 'neutral'

interface SentimentDay {
  date: string
  dominantEmotion: EmotionType
  intensity: number // 0-1 for color saturation
}

interface SentimentHeatmapCardProps {
  data?: SentimentDay[]
  onExploreClick?: () => void
}

// Emotion color mapping
const EMOTION_COLORS: Record<EmotionType, string> = {
  joy: '#b3f9e5',
  calm: '#7dd4c0',
  neutral: 'rgba(179, 249, 229, 0.3)',
  anxiety: '#f9e5b3',
  sadness: '#b3d4f9',
  anger: '#f9b3b3',
}

// Generate mock data for the last 28 days
function generateMockData(): SentimentDay[] {
  const emotions: EmotionType[] = ['joy', 'calm', 'anxiety', 'sadness', 'anger', 'neutral']
  const data: SentimentDay[] = []
  const today = new Date()
  
  for (let i = 27; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    // Weight towards positive emotions
    const weights = [0.25, 0.25, 0.15, 0.1, 0.05, 0.2]
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
      dominantEmotion: selectedEmotion,
      intensity: 0.5 + Math.random() * 0.5, // 0.5 to 1.0
    })
  }
  
  return data
}

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

export default function SentimentHeatmapCard({ 
  data, 
  onExploreClick 
}: SentimentHeatmapCardProps) {
  // Generate mock data if none provided
  const sentimentData = useMemo(() => data || generateMockData(), [data])
  
  // Organize data into weeks (4 weeks, 7 days each)
  const weeks = useMemo(() => {
    const result: (SentimentDay | null)[][] = []
    let currentWeek: (SentimentDay | null)[] = []
    
    // Get the first date and find what day of week it is
    if (sentimentData.length > 0) {
      const firstDate = new Date(sentimentData[0].date)
      const dayOfWeek = (firstDate.getDay() + 6) % 7 // Convert to Monday = 0
      
      // Pad the first week with nulls
      for (let i = 0; i < dayOfWeek; i++) {
        currentWeek.push(null)
      }
    }
    
    sentimentData.forEach((day, index) => {
      currentWeek.push(day)
      
      if (currentWeek.length === 7) {
        result.push(currentWeek)
        currentWeek = []
      }
    })
    
    // Pad the last week if needed
    while (currentWeek.length > 0 && currentWeek.length < 7) {
      currentWeek.push(null)
    }
    if (currentWeek.length > 0) {
      result.push(currentWeek)
    }
    
    // Ensure we have exactly 4 weeks
    while (result.length < 4) {
      result.unshift(Array(7).fill(null))
    }
    
    return result.slice(-4) // Take last 4 weeks
  }, [sentimentData])
  
  // Calculate dominant emotion for the period
  const dominantEmotion = useMemo(() => {
    const counts: Record<EmotionType, number> = {
      joy: 0, calm: 0, anxiety: 0, sadness: 0, anger: 0, neutral: 0
    }
    
    sentimentData.forEach(day => {
      counts[day.dominantEmotion]++
    })
    
    let maxEmotion: EmotionType = 'neutral'
    let maxCount = 0
    
    Object.entries(counts).forEach(([emotion, count]) => {
      if (count > maxCount) {
        maxCount = count
        maxEmotion = emotion as EmotionType
      }
    })
    
    return maxEmotion
  }, [sentimentData])
  
  const emotionLabel = dominantEmotion.charAt(0).toUpperCase() + dominantEmotion.slice(1)
  
  return (
    <div className={styles.sentimentCard}>
      {/* Card Header with Action */}
      <div className={styles.cardHeaderRow}>
        <div className={styles.cardSection}>
          <span className={styles.cardLabel}>Sentiment trends</span>
        </div>
        <button className={styles.cardAction} onClick={onExploreClick}>
          <span className={styles.cardActionText}>Explore</span>
          <ArrowRightIcon width={22} height={22} />
        </button>
      </div>
      
      {/* Subtitle */}
      <p className={styles.sentimentSubtitle}>
        Mostly <span className={styles.emotionHighlight}>{emotionLabel}</span> this month
      </p>
      
      {/* Weekday Headers */}
      <div className={styles.sentimentWeekdays}>
        {WEEKDAYS.map(day => (
          <span key={day} className={styles.sentimentWeekday}>{day}</span>
        ))}
      </div>
      
      {/* Heatmap Grid */}
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
                title={day ? `${day.date}: ${day.dominantEmotion}` : ''}
              />
            ))}
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className={styles.sentimentLegend}>
        {Object.entries(EMOTION_COLORS).map(([emotion, color]) => (
          <div key={emotion} className={styles.legendItem}>
            <div 
              className={styles.legendColor} 
              style={{ backgroundColor: color }}
            />
            <span className={styles.legendLabel}>
              {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

