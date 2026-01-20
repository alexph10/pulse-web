'use client'

import styles from './insights.module.css'

interface Observation {
  id: string
  text: string
}

interface PatternInsightsCardProps {
  onExploreClick?: () => void
}

// Plain language observations - no percentages, no confidence scores
const mockObservations: Observation[] = [
  { id: '1', text: 'Exercise days feel lighter' },
  { id: '2', text: 'Mornings tend to be heavier' },
  { id: '3', text: 'Conversations lift your mood' },
]

export default function PatternInsightsCard({ onExploreClick }: PatternInsightsCardProps) {
  return (
    <div className={styles.noticedCard}>
      {/* Header */}
      <div className={styles.cardHeaderRow}>
        <span className={styles.cardLabel}>Noticed</span>
        <button className={styles.cardAction} onClick={onExploreClick}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="5" r="1.5" fill="currentColor" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            <circle cx="12" cy="19" r="1.5" fill="currentColor" />
          </svg>
        </button>
      </div>

      {/* Observations list - simple, no icons needed */}
      <div className={styles.observationList}>
        {mockObservations.map((observation) => (
          <p key={observation.id} className={styles.observationText}>
            {observation.text}
          </p>
        ))}
      </div>
    </div>
  )
}
