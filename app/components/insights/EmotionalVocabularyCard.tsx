'use client'

import { useMemo } from 'react'
import { ArrowRightIcon } from '@radix-ui/react-icons'
import styles from './insights.module.css'

interface VocabularyWord {
  word: string
  count: number
  isNew: boolean
}

interface VocabularyCategory {
  id: string
  category: string
  words: VocabularyWord[]
  totalCount: number
}

interface EmotionalVocabularyCardProps {
  data?: VocabularyCategory[]
  onExploreClick?: () => void
}

// Mock data for demonstration
const mockVocabularyData: VocabularyCategory[] = [
  {
    id: 'joy',
    category: 'Joy',
    words: [
      { word: 'happy', count: 12, isNew: false },
      { word: 'grateful', count: 9, isNew: false },
      { word: 'excited', count: 7, isNew: false },
      { word: 'hopeful', count: 5, isNew: true },
    ],
    totalCount: 33,
  },
  {
    id: 'calm',
    category: 'Calm',
    words: [
      { word: 'peaceful', count: 8, isNew: false },
      { word: 'relaxed', count: 5, isNew: false },
      { word: 'serene', count: 3, isNew: true },
      { word: 'content', count: 3, isNew: false },
    ],
    totalCount: 19,
  },
  {
    id: 'anxiety',
    category: 'Anxiety',
    words: [
      { word: 'worried', count: 6, isNew: false },
      { word: 'stressed', count: 5, isNew: false },
      { word: 'nervous', count: 4, isNew: false },
      { word: 'overwhelmed', count: 2, isNew: true },
    ],
    totalCount: 17,
  },
  {
    id: 'sadness',
    category: 'Sadness',
    words: [
      { word: 'lonely', count: 4, isNew: false },
      { word: 'tired', count: 3, isNew: false },
      { word: 'down', count: 2, isNew: false },
      { word: 'melancholy', count: 1, isNew: true },
    ],
    totalCount: 10,
  },
  {
    id: 'frustration',
    category: 'Frustration',
    words: [
      { word: 'annoyed', count: 3, isNew: false },
      { word: 'stuck', count: 2, isNew: false },
      { word: 'impatient', count: 2, isNew: true },
    ],
    totalCount: 7,
  },
  {
    id: 'energy',
    category: 'Energy',
    words: [
      { word: 'motivated', count: 6, isNew: false },
      { word: 'energized', count: 4, isNew: false },
      { word: 'focused', count: 3, isNew: false },
      { word: 'driven', count: 2, isNew: true },
    ],
    totalCount: 15,
  },
]

// Category icons
const CategoryIcon = ({ category }: { category: string }) => {
  switch (category.toLowerCase()) {
    case 'joy':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      )
    case 'calm':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )
    case 'anxiety':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      )
    case 'sadness':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
          <path d="M8.5 16.5s1.5-2 3.5-2 3.5 2 3.5 2" />
        </svg>
      )
    case 'frustration':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
        </svg>
      )
    case 'energy':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
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

export default function EmotionalVocabularyCard({ 
  data = mockVocabularyData, 
  onExploreClick 
}: EmotionalVocabularyCardProps) {
  // Calculate total unique words and new words
  const stats = useMemo(() => {
    let totalWords = 0
    let newWords = 0
    
    data.forEach(category => {
      category.words.forEach(word => {
        totalWords++
        if (word.isNew) newWords++
      })
    })
    
    return { totalWords, newWords }
  }, [data])
  
  return (
    <div className={styles.vocabularyCard}>
      {/* Card Header with Action */}
      <div className={styles.cardHeaderRow}>
        <div className={styles.cardSection}>
          <span className={styles.cardLabel}>Emotional vocabulary</span>
        </div>
        <button className={styles.cardAction} onClick={onExploreClick}>
          <span className={styles.cardActionText}>See all</span>
          <ArrowRightIcon width={22} height={22} />
        </button>
      </div>
      
      {/* Subtitle with stats */}
      <p className={styles.vocabularySubtitle}>
        <span className={styles.vocabStat}>{stats.totalWords}</span> unique words
        {stats.newWords > 0 && (
          <span className={styles.vocabNew}> • {stats.newWords} new this week</span>
        )}
      </p>
      
      {/* Category Grid */}
      <div className={styles.vocabularyGrid}>
        {data.map(category => (
          <div key={category.id} className={styles.vocabCategory}>
            {/* Category Header */}
            <div className={styles.vocabCategoryHeader}>
              <span className={styles.vocabCategoryIcon}>
                <CategoryIcon category={category.category} />
              </span>
              <span className={styles.vocabCategoryName}>{category.category}</span>
              <span className={styles.vocabCategoryCount}>({category.totalCount})</span>
            </div>
            
            {/* Word List */}
            <div className={styles.vocabWordList}>
              {category.words.slice(0, 4).map((word, index) => (
                <div key={index} className={styles.vocabWordItem}>
                  <span className={`${styles.vocabWord} ${word.isNew ? styles.vocabWordNew : ''}`}>
                    {word.word}
                  </span>
                  <span className={styles.vocabWordCount}>{word.count}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

