'use client'

import React from 'react'
import { Skeleton } from '../ui'
import styles from './LoadingState.module.css'
import { cn } from '@/lib/utils'

type LoadingVariant = 'card' | 'list' | 'grid' | 'chart' | 'page'

interface LoadingStateProps {
  variant?: LoadingVariant
  count?: number
  className?: string
}

export default function LoadingState({ 
  variant = 'card', 
  count = 3,
  className 
}: LoadingStateProps) {
  const renderCard = () => (
    <div className={styles.cardsContainer}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={styles.cardContainer}>
          <Skeleton height="24px" width="60%" rounded />
          <Skeleton height="16px" width="80%" rounded />
          <Skeleton height="16px" width="40%" rounded />
        </div>
      ))}
    </div>
  )

  const renderList = () => (
    <div className={styles.listContainer}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={styles.listItem}>
          <Skeleton height="20px" width="100%" rounded />
          <Skeleton height="16px" width="70%" rounded />
        </div>
      ))}
    </div>
  )

  const renderGrid = () => (
    <div className={styles.gridContainer}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={styles.gridItem}>
          <Skeleton height="80px" rounded />
          <Skeleton height="20px" width="80%" rounded />
          <Skeleton height="16px" width="60%" rounded />
        </div>
      ))}
    </div>
  )

  const renderChart = () => (
    <div className={styles.chartContainer}>
      <Skeleton height="24px" width="40%" rounded />
      <div className={styles.chartSkeleton}>
        <Skeleton height="120px" rounded />
      </div>
    </div>
  )

  const renderPage = () => (
    <div className={styles.pageContainer}>
      <Skeleton height="32px" width="50%" rounded />
      <Skeleton height="24px" width="70%" rounded />
      <div className={styles.pageContent}>
        <Skeleton height="200px" rounded />
        <Skeleton height="16px" width="100%" rounded />
        <Skeleton height="16px" width="90%" rounded />
        <Skeleton height="16px" width="80%" rounded />
      </div>
    </div>
  )

  const renderContent = () => {
    switch (variant) {
      case 'card':
        return renderCard()
      case 'list':
        return renderList()
      case 'grid':
        return renderGrid()
      case 'chart':
        return renderChart()
      case 'page':
        return renderPage()
      default:
        return renderCard()
    }
  }

  return (
    <div 
      className={cn(styles.loadingState, className)}
      role="status"
      aria-label="Loading content"
      aria-live="polite"
    >
      {renderContent()}
    </div>
  )
}

