'use client'

import { useState } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Sparkle, CaretDown, CaretUp } from '@phosphor-icons/react'
import styles from './MoodAnalysisPanel.module.css'

interface MoodAnalysis {
  primaryMood: string
  moodScore: number
  emotions: string[]
  sentiment: string
  keywords: string[]
  insight: string
  followUpQuestion: string
}

interface MoodAnalysisPanelProps {
  moodAnalysis: MoodAnalysis
  onDismiss?: () => void
}

export function MoodAnalysisPanel({ moodAnalysis, onDismiss }: MoodAnalysisPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const getMoodColor = (mood: string): string => {
    const moodColors: Record<string, string> = {
      'joyful': '#10b981',
      'calm': '#3b82f6',
      'anxious': '#f59e0b',
      'frustrated': '#ef4444',
      'sad': '#6366f1',
      'excited': '#ec4899',
      'neutral': '#6b7280',
    }
    return moodColors[mood.toLowerCase()] || 'var(--accent-primary)'
  }

  return (
    <Card elevation={2} className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Sparkle size={20} weight="duotone" style={{ color: getMoodColor(moodAnalysis.primaryMood) }} />
          <h3 className={styles.title}>Mood Analysis</h3>
        </div>
        <div className={styles.headerRight}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={styles.toggleButton}
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <CaretUp size={16} /> : <CaretDown size={16} />}
          </button>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className={styles.dismissButton}
              aria-label="Dismiss"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className={styles.content}>
          {/* Primary Mood & Score */}
          <div className={styles.moodSection}>
            <div className={styles.moodBadge} style={{ backgroundColor: getMoodColor(moodAnalysis.primaryMood) }}>
              {moodAnalysis.primaryMood}
            </div>
            <div className={styles.score}>
              <span className={styles.scoreValue}>{moodAnalysis.moodScore}</span>
              <span className={styles.scoreMax}>/10</span>
            </div>
          </div>

          {/* Insight */}
          <div className={styles.insight}>
            <p className={styles.insightText}>{moodAnalysis.insight}</p>
          </div>

          {/* Follow-up Question */}
          {moodAnalysis.followUpQuestion && (
            <div className={styles.question}>
              <p className={styles.questionText}>{moodAnalysis.followUpQuestion}</p>
            </div>
          )}

          {/* Advanced Details (Collapsible) */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={styles.advancedToggle}
          >
            {showAdvanced ? 'Hide' : 'Show'} Details
            {showAdvanced ? <CaretUp size={14} /> : <CaretDown size={14} />}
          </button>

          {showAdvanced && (
            <div className={styles.advanced}>
              {/* Emotions */}
              {moodAnalysis.emotions.length > 0 && (
                <div className={styles.detailSection}>
                  <label className={styles.detailLabel}>Emotions</label>
                  <div className={styles.tags}>
                    {moodAnalysis.emotions.map((emotion, idx) => (
                      <span key={idx} className={styles.tag}>
                        {emotion}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Keywords */}
              {moodAnalysis.keywords.length > 0 && (
                <div className={styles.detailSection}>
                  <label className={styles.detailLabel}>Keywords</label>
                  <div className={styles.tags}>
                    {moodAnalysis.keywords.map((keyword, idx) => (
                      <span key={idx} className={styles.tag}>
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Sentiment */}
              <div className={styles.detailSection}>
                <label className={styles.detailLabel}>Sentiment</label>
                <span className={styles.sentiment}>{moodAnalysis.sentiment}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

