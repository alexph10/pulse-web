'use client'

import { useState, useMemo } from 'react'
import styles from './insights.module.css'

interface ReflectionPrompt {
  id: string
  prompt: string
}

interface ReflectionCardProps {
  onJournalClick?: () => void
}

const allPrompts: ReflectionPrompt[] = [
  { id: '1', prompt: "What's one thing you could slow down on?" },
  { id: '2', prompt: "Who could you reach out to today?" },
  { id: '3', prompt: "What's one boundary you could set?" },
  { id: '4', prompt: "What small ritual could help you recharge?" },
  { id: '5', prompt: "What are three things you're thankful for?" },
  { id: '6', prompt: "What would you say to a friend in your situation?" },
  { id: '7', prompt: "What's one thing you could prepare ahead?" },
  { id: '8', prompt: "When did you last spend time outside?" },
  { id: '9', prompt: "What activity could you do alone this week?" },
  { id: '10', prompt: "What made you smile today?" }
]

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

  return (
    <div className={styles.reflectionCard}>
      {/* Header with three-dot menu */}
      <div className={styles.cardHeaderRow}>
        <span className={styles.cardLabel}>Reflect</span>
        <button className={styles.cardAction} onClick={onJournalClick}>
          <span className={styles.menuDots}>
            <span className={styles.menuDot} />
            <span className={styles.menuDot} />
            <span className={styles.menuDot} />
          </span>
        </button>
      </div>

      {/* Prompt */}
      <p className={styles.reflectionPrompt}>
        {currentPrompt.prompt}
      </p>

      {/* Dots */}
      <div className={styles.dotIndicators}>
        {dailyPrompts.map((_, index) => (
          <button
            key={index}
            className={`${styles.dotIndicator} ${index === currentIndex ? styles.dotActive : ''}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Prompt ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
