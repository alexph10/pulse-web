'use client'

import { useState, ReactNode } from 'react'
import styles from './MediumCard.module.css'

interface MediumCardProps {
  title: string
  children: ReactNode
}

export default function MediumCard({ title, children }: MediumCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className={styles.mediumCardInner}>
      <button
        className={styles.mediumCardToggle}
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

      <div className={`${styles.mediumCardContent} ${isCollapsed ? styles.mediumCardContentHidden : ''}`}>
        <h2 className={styles.mediumCardTitle}>{title}</h2>
        {children}
      </div>
    </div>
  )
}

