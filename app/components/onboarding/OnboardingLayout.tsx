"use client"

import React from 'react'
import styles from './onboarding.module.css'

interface OnboardingLayoutProps {
  title: string
  helperText?: string
  onBack?: () => void
  onContinue: () => void
  continueDisabled?: boolean
  continueLabel?: string
  children: React.ReactNode
}

export default function OnboardingLayout({
  title,
  helperText,
  onBack,
  onContinue,
  continueDisabled = false,
  continueLabel = 'Save',
  children,
}: OnboardingLayoutProps) {
  return (
    <div className={styles.layout}>
      {/* Header */}
      <div className={styles.header}>
        {onBack && (
          <button 
            className={styles.backButton} 
            onClick={onBack}
            aria-label="Go back"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
        <h1 className={styles.title}>{title}</h1>
      </div>

      {/* Helper text */}
      {helperText && (
        <p className={styles.helperText}>{helperText}</p>
      )}

      {/* Content */}
      <div className={styles.content}>
        {children}
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <button
          className={styles.continueButton}
          onClick={onContinue}
          disabled={continueDisabled}
        >
          {continueLabel}
        </button>
      </div>
    </div>
  )
}
