'use client'

import { ArrowRightIcon } from '@radix-ui/react-icons'
import styles from './insights.module.css'

interface Pattern {
  id: string
  insight: string
  category: 'activity' | 'sleep' | 'social' | 'work' | 'mood' | 'health'
  confidence: number // 0-100
  trend: 'positive' | 'negative' | 'neutral'
}

interface PatternInsightsCardProps {
  onExploreClick?: () => void
}

// Mock patterns - would come from AI analysis in production
const mockPatterns: Pattern[] = [
  {
    id: '1',
    insight: "You feel 40% better on days you exercise",
    category: 'activity',
    confidence: 85,
    trend: 'positive'
  },
  {
    id: '2',
    insight: "Your mood dips after sleeping less than 6 hours",
    category: 'sleep',
    confidence: 78,
    trend: 'negative'
  },
  {
    id: '3',
    insight: "Conversations about friends boost your energy",
    category: 'social',
    confidence: 72,
    trend: 'positive'
  }
]

// Category icons
const CategoryIcon = ({ category }: { category: Pattern['category'] }) => {
  switch (category) {
    case 'activity':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      )
    case 'sleep':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )
    case 'social':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    case 'work':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      )
    case 'health':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      )
    default:
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
        </svg>
      )
  }
}

export default function PatternInsightsCard({ onExploreClick }: PatternInsightsCardProps) {
  return (
    <div className={styles.patternCard}>
      {/* Card Header with Action */}
      <div className={styles.cardHeaderRow}>
        <div className={styles.cardSection}>
          <span className={styles.cardLabel}>Patterns</span>
        </div>
        <button className={styles.cardAction} onClick={onExploreClick}>
          <span className={styles.cardActionText}>Explore all</span>
          <ArrowRightIcon width={22} height={22} />
        </button>
      </div>

      {/* Subtitle */}
      <p className={styles.patternSubtitle}>What we've learned about you</p>

      {/* Pattern List */}
      <div className={styles.patternList}>
        {mockPatterns.map((pattern, index) => (
          <div key={pattern.id} className={styles.patternItem}>
            <div className={styles.patternIcon}>
              <CategoryIcon category={pattern.category} />
            </div>
            <div className={styles.patternContent}>
              <p className={styles.patternText}>{pattern.insight}</p>
              <div className={styles.patternMeta}>
                <div className={styles.confidenceBar}>
                  <div 
                    className={styles.confidenceFill} 
                    style={{ width: `${pattern.confidence}%` }}
                  />
                </div>
                <span className={styles.confidenceLabel}>{pattern.confidence}% confident</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

