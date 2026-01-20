'use client'

import styles from './insights.module.css'

interface WordsCardProps {
  onExploreClick?: () => void
}

// Words extracted from journal entries - no categories, just reflection
const mockWords = [
  { word: 'grateful', isNew: false },
  { word: 'tired', isNew: false },
  { word: 'hopeful', isNew: true },
  { word: 'coffee', isNew: false },
  { word: 'Sam', isNew: false },
  { word: 'peaceful', isNew: true },
  { word: 'work', isNew: false },
  { word: 'morning', isNew: false },
]

export default function EmotionalVocabularyCard({ onExploreClick }: WordsCardProps) {
  const newWordsCount = mockWords.filter(w => w.isNew).length
  
  return (
    <div className={styles.wordsCard}>
      {/* Header */}
      <div className={styles.cardHeaderRow}>
        <span className={styles.cardLabel}>Words</span>
        <button className={styles.cardAction} onClick={onExploreClick}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="5" r="1.5" fill="currentColor" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            <circle cx="12" cy="19" r="1.5" fill="currentColor" />
          </svg>
        </button>
      </div>

      {/* Words displayed as a flowing list */}
      <div className={styles.wordCloud}>
        {mockWords.map((item, index) => (
          <span 
            key={index} 
            className={`${styles.wordItem} ${item.isNew ? styles.wordItemNew : ''}`}
          >
            {item.word}
          </span>
        ))}
      </div>

      {/* Subtle note about new words */}
      {newWordsCount > 0 && (
        <p className={styles.wordsNote}>
          {newWordsCount} new {newWordsCount === 1 ? 'word' : 'words'} this week
        </p>
      )}
    </div>
  )
}
