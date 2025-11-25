'use client'

import { useEffect, useState, useMemo } from 'react'
import { format, subDays } from 'date-fns'
import { useAuth } from '@/app/contexts/AuthContext'
import styles from './completion-stats.module.css'

// Configuration constants
const DAYS_TO_ANALYZE = 7
const EXPECTED_TASKS_PER_DAY = 3 // 1 journal + 1 goal + 1 check-in

interface ActivityStats {
  journalEntries: number
  goalsCompleted: number
  dailyCheckins: number
  totalTasks: number
  completionRate: number
}

interface CategoryConfig {
  key: 'journal' | 'goals' | 'checkins'
  label: string
  dotClass: string
  barClass: string
  getValue: (stats: ActivityStats) => number
}

export default function CompletionStats() {
  const { user } = useAuth()
  const [stats, setStats] = useState<ActivityStats>({
    journalEntries: 0,
    goalsCompleted: 0,
    dailyCheckins: 0,
    totalTasks: 0,
    completionRate: 0,
  })

  // Dynamic category configuration
  const categories: CategoryConfig[] = useMemo(() => [
    {
      key: 'journal',
      label: 'Journal Entries\nCompleted',
      dotClass: styles.dotJournal,
      barClass: styles.barJournal,
      getValue: (stats) => stats.journalEntries,
    },
    {
      key: 'goals',
      label: 'Goals\nCompleted',
      dotClass: styles.dotGoals,
      barClass: styles.barGoals,
      getValue: (stats) => stats.goalsCompleted,
    },
    {
      key: 'checkins',
      label: 'Daily\nCheck-ins',
      dotClass: styles.dotCheckins,
      barClass: styles.barCheckins,
      getValue: (stats) => stats.dailyCheckins,
    },
  ], [])

  // Dynamic title based on days
  const title = useMemo(() => {
    if (DAYS_TO_ANALYZE === 7) return 'Weekly Task Completion'
    if (DAYS_TO_ANALYZE === 30) return 'Monthly Task Completion'
    return `${DAYS_TO_ANALYZE}-Day Task Completion`
  }, [])

  useEffect(() => {
    if (!user) return

    const fetchStats = async () => {
      try {
        const response = await fetch('/api/activity')
        if (response.ok) {
          const data = await response.json()
          
          let totalJournals = 0
          let totalGoals = 0
          let totalCheckins = 0

          // Calculate stats dynamically based on DAYS_TO_ANALYZE
          for (let i = 0; i < DAYS_TO_ANALYZE; i++) {
            const date = subDays(new Date(), i)
            const dateString = format(date, 'yyyy-MM-dd')
            const dayData = data.activities?.[dateString]
            
            totalJournals += dayData?.journalCount || 0
            totalGoals += dayData?.goalsCount || 0
            // Count check-ins as days with any activity
            if (dayData?.journalCount || dayData?.goalsCount) {
              totalCheckins++
            }
          }

          const totalTasks = totalJournals + totalGoals + totalCheckins
          // Calculate completion rate dynamically based on expected tasks
          const expectedTotal = DAYS_TO_ANALYZE * EXPECTED_TASKS_PER_DAY
          const completionRate = totalTasks > 0 ? Math.round((totalTasks / expectedTotal) * 100) : 0

          setStats({
            journalEntries: totalJournals,
            goalsCompleted: totalGoals,
            dailyCheckins: totalCheckins,
            totalTasks,
            completionRate,
          })
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    fetchStats()
  }, [user])

  // Calculate percentages dynamically for each category
  const categoryPercentages = useMemo(() => {
    if (stats.totalTasks === 0) {
      return categories.map(() => 0)
    }
    return categories.map(category => 
      Math.round((category.getValue(stats) / stats.totalTasks) * 100)
    )
  }, [stats, categories])

  return (
    <div className={styles.container}>
      {/* Header with main metric */}
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.mainMetric}>{stats.completionRate}%</div>
      </div>

      {/* Category breakdown - dynamically rendered */}
      <div className={styles.categories}>
        {categories.map((category, index) => {
          const percentage = categoryPercentages[index]
          return (
            <div key={category.key} className={styles.category}>
              <div className={styles.categoryHeader}>
                <span className={`${styles.dot} ${category.dotClass}`}></span>
                <span className={styles.categoryLabel}>
                  {category.label.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < category.label.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </span>
              </div>
              <div className={styles.categoryValue}>{percentage}%</div>
            </div>
          )
        })}
      </div>

      {/* Horizontal stacked bar chart - dynamically rendered */}
      <div className={styles.barContainer}>
        <div className={styles.bar}>
          {categories.map((category, index) => {
            const percentage = categoryPercentages[index]
            if (percentage === 0) return null
            return (
              <div
                key={category.key}
                className={`${styles.barSegment} ${category.barClass}`}
                style={{ width: `${percentage}%` }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

