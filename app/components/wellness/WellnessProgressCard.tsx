'use client'

import { useState, useMemo } from 'react'
import styles from './WellnessProgressCard.module.css'

type PresetType = 'today' | 'week' | 'month' | 'all'

interface Entry {
  id: string
  created_at: Date | string
}

interface WellnessProgressCardProps {
  entries: Entry[]
}

// Helper to generate sample grid data
const generateGridData = (days: number) => {
  const cols = 7;
  const rows = Math.ceil(days / cols);
  
  return Array.from({ length: rows * cols }, (_, i) => {
    if (i >= days) return null;
    const intensity = Math.random();
    if (intensity > 0.7) return 'high';
    if (intensity > 0.4) return 'medium';
    return 'low';
  });
};

export default function WellnessProgressCard({ entries }: WellnessProgressCardProps) {
  const [preset, setPreset] = useState<PresetType>('today')

  // Calculate progress percentage based on entries
  const progress = useMemo(() => {
    if (!entries || entries.length === 0) return 0
    
    // Simple calculation: entries this period vs target
    const target = preset === 'today' ? 1 : preset === 'week' ? 7 : preset === 'month' ? 30 : 365
    const actual = entries.length
    return Math.min(Math.round((actual / target) * 100), 100)
  }, [entries, preset])

  // Generate grid data (7 columns x 4 rows = 28 days for monthly view)
  const gridData = useMemo(() => {
    const days = preset === 'today' ? 1 : preset === 'week' ? 7 : preset === 'month' ? 28 : 365
    return generateGridData(days)
  }, [preset])

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>Your Wellness Progress</h3>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={styles.icon}>
            <path d="M8 2L10 6L14 7L10 8L8 12L6 8L2 7L6 6L8 2Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          </svg>
        </div>
        <div className={styles.progressValue}>{progress}%</div>
      </div>

      <div className={styles.tabs}>
        {(['today', 'week', 'month', 'all'] as PresetType[]).map((tab) => (
          <button
            key={tab}
            className={`${styles.tab} ${preset === tab ? styles.tabActive : ''}`}
            onClick={() => setPreset(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {gridData.map((intensity, index) => (
          <div
            key={index}
            className={`${styles.gridCell} ${intensity ? styles[`intensity-${intensity}`] : styles.empty}`}
          />
        ))}
      </div>
    </div>
  )
}

