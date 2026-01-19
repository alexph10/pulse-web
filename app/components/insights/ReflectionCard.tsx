'use client'

import { useState, useMemo } from 'react'
import { ArrowRightIcon } from '@radix-ui/react-icons'
import styles from './insights.module.css'

interface ReflectionPrompt {
  id: string
  prompt: string
  category: string
}

interface ReflectionCardProps {
  onJournalClick?: () => void
}

// Full pool of prompts - rotates daily
const allPrompts: ReflectionPrompt[] = [
  {
    id: '1',
    prompt: "You've mentioned feeling rushed this week. What's one thing you could slow down on?",
    category: 'pace'
  },
  {
    id: '2', 
    prompt: "Your mood peaks after conversations about friends. Who could you reach out to today?",
    category: 'connection'
  },
  {
    id: '3',
    prompt: "You've been reflecting on work a lot. What's one boundary you could set?",
    category: 'work'
  },
  {
    id: '4',
    prompt: "Your energy dips in the afternoon. What small ritual could help you recharge?",
    category: 'energy'
  },
  {
    id: '5',
    prompt: "You sleep better after evening walks. Could you fit one in today?",
    category: 'sleep'
  },
  {
    id: '6',
    prompt: "Gratitude came up in your last check-in. What are three things you're thankful for right now?",
    category: 'gratitude'
  },
  {
    id: '7',
    prompt: "You've been hard on yourself lately. What would you say to a friend in your situation?",
    category: 'self-compassion'
  },
  {
    id: '8',
    prompt: "Your stress levels rise mid-week. What's one thing you could prepare ahead of time?",
    category: 'planning'
  },
  {
    id: '9',
    prompt: "Nature seems to lift your mood. When was the last time you spent time outside?",
    category: 'nature'
  },
  {
    id: '10',
    prompt: "You mentioned wanting more quiet time. What's one activity you could do alone this week?",
    category: 'solitude'
  }
]

// Select 3 prompts based on the current day (rotates daily)
function getDailyPrompts(): ReflectionPrompt[] {
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
  const startIndex = (dayOfYear * 3) % allPrompts.length
  
  const selected: ReflectionPrompt[] = []
  for (let i = 0; i < 3; i++) {
    selected.push(allPrompts[(startIndex + i) % allPrompts.length])
  }
  return selected
}

export default function ReflectionCard({ onJournalClick }: ReflectionCardProps) {
  const dailyPrompts = useMemo(() => getDailyPrompts(), [])
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentPrompt = dailyPrompts[currentIndex]

  const goToPrompt = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className={styles.reflectionCard}>
      {/* Card Header with Action */}
      <div className={styles.cardHeaderRow}>
        <div className={styles.cardSection}>
          <span className={styles.cardLabel}>Reflect</span>
        </div>
        <button className={styles.cardAction} onClick={onJournalClick}>
          <span className={styles.cardActionText}>Start journaling</span>
          <ArrowRightIcon width={22} height={22} />
        </button>
      </div>

      {/* Subtitle */}
      <p className={styles.reflectionSubtitle}>A thought for today</p>

      {/* Prompt Text */}
      <blockquote className={styles.reflectionPrompt}>
        "{currentPrompt.prompt}"
      </blockquote>

      {/* Dot Indicators */}
      <div className={styles.dotIndicators}>
        {dailyPrompts.map((_, index) => (
          <button
            key={index}
            className={`${styles.dotIndicator} ${index === currentIndex ? styles.dotActive : ''}`}
            onClick={() => goToPrompt(index)}
            aria-label={`Go to prompt ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

