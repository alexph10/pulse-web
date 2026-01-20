'use client'

import styles from './insights.module.css'

interface WhatHelpsYouCardProps {
  onExploreClick?: () => void
}

export default function WhatHelpsYouCard({ onExploreClick }: WhatHelpsYouCardProps) {
  const correlations = [
    { text: 'You sleep 7+ hours', impact: '+23% mood' },
    { text: 'Morning check-ins', impact: '+18% mood' },
    { text: 'You journal', impact: '+15% mood' },
  ]

  return (
    <div className={styles.helpsCard}>
      <div className={styles.cardHeaderRow}>
        <span className={styles.cardLabel}>What Helps You</span>
        <button className={styles.cardAction} onClick={onExploreClick}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="5" r="1.5" fill="currentColor" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            <circle cx="12" cy="19" r="1.5" fill="currentColor" />
          </svg>
        </button>
      </div>

      <p className={styles.helpsIntro}>You feel better when...</p>

      <div className={styles.helpsList}>
        {correlations.map((item, index) => (
          <div key={index} className={styles.helpsItem}>
            <div className={styles.helpsItemLeft}>
              <span className={styles.helpsText}>{item.text}</span>
            </div>
            <span className={styles.helpsImpact}>{item.impact}</span>
          </div>
        ))}
      </div>

      <p className={styles.helpsNote}>Based on 45 entries</p>
    </div>
  )
}
