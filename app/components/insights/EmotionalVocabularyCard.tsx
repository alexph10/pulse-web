'use client'

import { useMemo } from 'react'
import { ArrowRightIcon } from '@radix-ui/react-icons'
import styles from './insights.module.css'

interface VocabularyWord {
  word: string
  isNew: boolean
}

interface VocabularyCategory {
  id: string
  category: string
  words: VocabularyWord[]
}

interface EmotionalVocabularyCardProps {
  data?: VocabularyCategory[]
  onExploreClick?: () => void
}

const mockVocabularyData: VocabularyCategory[] = [
  { id: 'joy', category: 'Joy', words: [
    { word: 'happy', isNew: false },
    { word: 'grateful', isNew: false },
    { word: 'hopeful', isNew: true }
  ]},
  { id: 'calm', category: 'Calm', words: [
    { word: 'peaceful', isNew: false },
    { word: 'relaxed', isNew: false },
    { word: 'serene', isNew: true }
  ]},
  { id: 'energy', category: 'Energy', words: [
    { word: 'motivated', isNew: false },
    { word: 'focused', isNew: false },
    { word: 'driven', isNew: true }
  ]}
]

const CategoryIcon = ({ category }: { category: string }) => {
  const icons: Record<string, JSX.Element> = {
    joy: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /></svg>,
    calm: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>,
    energy: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
  }
  return icons[category.toLowerCase()] || <circle cx="12" cy="12" r="10" />
}

export default function EmotionalVocabularyCard({ 
  data = mockVocabularyData, 
  onExploreClick 
}: EmotionalVocabularyCardProps) {
  const totalWords = useMemo(() => 
    data.reduce((sum, cat) => sum + cat.words.length, 0), [data])
  
  return (
    <div className={styles.vocabularyCard}>
      {/* Header */}
      <div className={styles.cardHeaderRow}>
        <span className={styles.cardLabel}>Vocabulary</span>
        <button className={styles.cardAction} onClick={onExploreClick}>
          <ArrowRightIcon width={18} height={18} />
        </button>
      </div>
      
      {/* Hero metric */}
      <div className={styles.heroMetric}>
        <span className={styles.heroNumber}>{totalWords}</span>
        <span className={styles.heroLabel}>words</span>
      </div>
      
      {/* Grid - 3 categories, 3 words each */}
      <div className={styles.vocabularyGrid}>
        {data.slice(0, 3).map(category => (
          <div key={category.id} className={styles.vocabCategory}>
            <div className={styles.vocabCategoryHeader}>
              <span className={styles.vocabCategoryIcon}>
                <CategoryIcon category={category.category} />
              </span>
              <span className={styles.vocabCategoryName}>{category.category}</span>
            </div>
            <div className={styles.vocabWordList}>
              {category.words.slice(0, 3).map((word, index) => (
                <span 
                  key={index} 
                  className={`${styles.vocabWord} ${word.isNew ? styles.vocabWordNew : ''}`}
                >
                  {word.word}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
