'use client'

import { useState, useEffect } from 'react'
import { getRandomGreeting } from '@/app/constants'
import styles from './WelcomeCard.module.css'

interface WelcomeCardProps {
  firstName: string
  onAskQuestion: () => void
  onSeeInsights: () => void
}

export default function WelcomeCard({ firstName, onAskQuestion, onSeeInsights }: WelcomeCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [greeting, setGreeting] = useState<[string, string]>(['', ''])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setGreeting(getRandomGreeting(firstName))
    requestAnimationFrame(() => setIsVisible(true))
  }, [firstName])

  const [line1, line2] = greeting

  return (
    <div className={styles.secondaryCardInner}>
      <button
        className={styles.secondaryMoreButton}
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? 'Expand card' : 'Collapse card'}
      >
        {isCollapsed ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="5" r="1.5" fill="currentColor" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            <circle cx="12" cy="19" r="1.5" fill="currentColor" />
          </svg>
        )}
      </button>

      <div
        className={`${styles.secondaryContent} ${isCollapsed ? styles.secondaryContentHidden : ''} ${isVisible ? styles.secondaryContentVisible : ''}`}
      >
        <div className={styles.welcomeMessage}>
          <span>{line1}</span>
          <br />
          <span>{line2}</span>
        </div>

        <div className={styles.actionButtonsRow}>
          <button className={styles.actionButton} onClick={onAskQuestion}>
            <span>Ask a Question</span>
          </button>
          <button className={styles.actionButton} onClick={onSeeInsights}>
            <span>See Insights</span>
          </button>
        </div>
      </div>
    </div>
  )
}

