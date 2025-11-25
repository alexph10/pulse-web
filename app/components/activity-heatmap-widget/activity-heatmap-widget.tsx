'use client'

import { useEffect, useState } from 'react'
import { format, subDays } from 'date-fns'
import { useAuth } from '@/app/contexts/AuthContext'
import styles from './activity-heatmap-widget.module.css'

interface ActivityLevel {
  date: Date
  level: number
}

export default function ActivityHeatmapWidget() {
  const { user } = useAuth()
  const [activityData, setActivityData] = useState<ActivityLevel[]>(() => {
    // Initialize with empty 30 days immediately
    const emptyDays: ActivityLevel[] = []
    for (let i = 29; i >= 0; i--) {
      const date = subDays(new Date(), i)
      emptyDays.push({ date, level: 0 })
    }
    return emptyDays
  })

  useEffect(() => {
    // Fetch real data if user is logged in
    if (!user) return

    const fetchActivity = async () => {
      try {
        const response = await fetch('/api/activity')
        if (response.ok) {
          const data = await response.json()
          
          // Update with actual activity
          const days: ActivityLevel[] = []
          for (let i = 29; i >= 0; i--) {
            const date = subDays(new Date(), i)
            const dateString = format(date, 'yyyy-MM-dd')
            const dayData = data.activities?.[dateString]
            
            // Calculate activity level (0-4) based on total activity
            const totalActivity = (dayData?.journalCount || 0) + (dayData?.goalsCount || 0)
            let level = 0
            if (totalActivity > 0) level = 1
            if (totalActivity >= 2) level = 2
            if (totalActivity >= 4) level = 3
            if (totalActivity >= 6) level = 4
            
            days.push({ date, level })
          }
          
          setActivityData(days)
        }
      } catch (error) {
        console.error('Error fetching activity:', error)
      }
    }

    fetchActivity()
  }, [user])

  return (
    <div className={styles.widget}>
      <div className={styles.grid}>
        {activityData.map((day, index) => (
          <div
            key={index}
            className={`${styles.square} ${styles[`level${day.level}`]}`}
            title={format(day.date, 'MMM d, yyyy')}
          />
        ))}
      </div>
    </div>
  )
}

