"use client"

import React from 'react'
import styles from './onboarding.module.css'

interface Option {
  id: string
  label: string
}

interface SelectedItem {
  id: string
  priority: number
}

interface RankedListProps {
  options: Option[]
  selected: SelectedItem[]
  onChange: (selected: SelectedItem[]) => void
  maxSelections?: number
}

export default function RankedList({ 
  options, 
  selected, 
  onChange, 
  maxSelections = 2 
}: RankedListProps) {
  
  const handleClick = (id: string) => {
    const existingIndex = selected.findIndex(s => s.id === id)
    
    if (existingIndex !== -1) {
      // Remove and reorder priorities
      const newSelected = selected
        .filter(s => s.id !== id)
        .map((s, i) => ({ ...s, priority: i + 1 }))
      onChange(newSelected)
    } else if (selected.length < maxSelections) {
      // Add with next priority
      onChange([...selected, { id, priority: selected.length + 1 }])
    }
  }

  const getPriority = (id: string): number | null => {
    const item = selected.find(s => s.id === id)
    return item ? item.priority : null
  }

  return (
    <div className={styles.rankedList}>
      {options.map((option) => {
        const priority = getPriority(option.id)
        let itemClass = styles.rankedItem
        if (priority === 1) itemClass += ` ${styles.rankedItemSelected1}`
        else if (priority === 2) itemClass += ` ${styles.rankedItemSelected2}`
        else if (priority === 3) itemClass += ` ${styles.rankedItemSelected3}`
        
        return (
          <button
            key={option.id}
            className={itemClass}
            onClick={() => handleClick(option.id)}
            type="button"
          >
            <span className={styles.rankedItemLabel}>{option.label}</span>
            {priority && (
              <span className={styles.rankedItemPriority}>{priority}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
