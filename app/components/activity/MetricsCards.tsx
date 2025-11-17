'use client'

import styles from './MetricsCards.module.css';

interface Stats {
  totalEntries: number;
  currentStreak: number;
  longestStreak: number;
  avgWordsPerDay: number;
  mostActiveDay: string;
  longestEntry: number;
  favoriteTime: string;
}

interface MetricsCardsProps {
  stats: Stats;
}

export default function MetricsCards({ stats }: MetricsCardsProps) {
  const metrics = [
    {
      label: 'Total Entries',
      value: stats.totalEntries.toLocaleString(),
      variant: 'primary'
    },
    {
      label: 'Current Streak',
      value: `${stats.currentStreak} ${stats.currentStreak === 1 ? 'day' : 'days'}`,
      variant: 'hover'
    },
    {
      label: 'Avg Words/Day',
      value: stats.avgWordsPerDay.toLocaleString(),
      variant: 'secondary'
    },
    {
      label: 'Most Active Day',
      value: stats.mostActiveDay,
      variant: 'active'
    },
    {
      label: 'Longest Entry',
      value: `${stats.longestEntry.toLocaleString()} words`,
      variant: 'muted'
    },
    {
      label: 'Favorite Time',
      value: stats.favoriteTime,
      variant: 'primary'
    }
  ];

  return (
    <div className={styles.metricsGrid}>
      {metrics.map((metric, index) => {
        return (
          <div key={index} className={`${styles.metricCard} ${styles[metric.variant]}`}>
            <div className={styles.metricContent}>
              <p className={styles.metricLabel}>{metric.label}</p>
              <p className={styles.metricValue}>
                {metric.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
