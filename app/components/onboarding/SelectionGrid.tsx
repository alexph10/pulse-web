"use client"

import React from 'react'
import styles from './onboarding.module.css'

interface Option {
  id: string
  label: string
}

interface SelectionGridProps {
  options: Option[]
  selected: string | null
  onChange: (id: string) => void
}

export default function SelectionGrid({ options, selected, onChange }: SelectionGridProps) {
  return (
    <div className={styles.selectionGrid}>
      {options.map((option) => {
        const isSelected = selected === option.id
        return (
          <button
            key={option.id}
            className={`${styles.gridCard} ${isSelected ? styles.gridCardSelected : ''}`}
            onClick={() => onChange(option.id)}
            type="button"
          >
            {isSelected && (
              <span className={styles.gridCardCheck}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            )}
            <span className={styles.gridCardLabel}>{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}
