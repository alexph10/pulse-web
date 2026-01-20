'use client'

import styles from './insights.module.css'

interface Pattern {
  id: string
  insight: string
  category: 'activity' | 'sleep' | 'social' | 'work' | 'health'
}

interface PatternInsightsCardProps {
  onExploreClick?: () => void
}

const mockPatterns: Pattern[] = [
  { id: '1', insight: "Exercise days: 40% better mood", category: 'activity' },
  { id: '2', insight: "Sleep < 6hrs: mood dips next day", category: 'sleep' },
  { id: '3', insight: "Friend conversations boost energy", category: 'social' }
]

const CategoryIcon = ({ category }: { category: Pattern['category'] }) => {
  const icons: Record<string, JSX.Element> = {
    activity: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    sleep: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
    social: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
      </svg>
    ),
    work: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    health: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    )
  }
  return icons[category] || <circle cx="12" cy="12" r="10" />
}

export default function PatternInsightsCard({ onExploreClick }: PatternInsightsCardProps) {
  return (
    <div className={styles.patternCard}>
      {/* Header with three-dot menu */}
      <div className={styles.cardHeaderRow}>
        <span className={styles.cardLabel}>Patterns</span>
        <button className={styles.cardAction} onClick={onExploreClick}>
          <span className={styles.menuDots}>
            <span className={styles.menuDot} />
            <span className={styles.menuDot} />
            <span className={styles.menuDot} />
          </span>
        </button>
      </div>

      {/* Hero metric */}
      <div className={styles.heroMetric}>
        <span className={styles.heroNumber}>{mockPatterns.length}</span>
        <span className={styles.heroLabel}>detected</span>
      </div>

      {/* Pattern list */}
      <div className={styles.patternList}>
        {mockPatterns.map((pattern) => (
          <div key={pattern.id} className={styles.patternItem}>
            <div className={styles.patternIcon}>
              <CategoryIcon category={pattern.category} />
            </div>
            <p className={styles.patternText}>{pattern.insight}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
