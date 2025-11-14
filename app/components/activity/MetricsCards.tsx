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
      color: '#c2593f', // crail
      bgColor: '#623e33' // quincy
    },
    {
      label: 'Current Streak',
      value: `${stats.currentStreak} ${stats.currentStreak === 1 ? 'day' : 'days'}`,
      color: '#b46c41', // brown-rust
      bgColor: '#623e33' // quincy
    },
    {
      label: 'Avg Words/Day',
      value: stats.avgWordsPerDay.toLocaleString(),
      color: '#c67b22', // ochre
      bgColor: '#5d3e39' // congo-brown
    },
    {
      label: 'Most Active Day',
      value: stats.mostActiveDay,
      color: '#8d503a', // potters-clay
      bgColor: '#5d3e39' // congo-brown
    },
    {
      label: 'Longest Entry',
      value: `${stats.longestEntry.toLocaleString()} words`,
      color: '#814837', // ironstone
      bgColor: '#623e33' // quincy
    },
    {
      label: 'Favorite Time',
      value: stats.favoriteTime,
      color: '#c2593f', // crail
      bgColor: '#5d3e39' // congo-brown
    }
  ];

  return (
    <div className={styles.metricsGrid}>
      {metrics.map((metric, index) => {
        return (
          <div key={index} className={styles.metricCard} style={{ backgroundColor: metric.bgColor }}>
            <div className={styles.metricContent}>
              <p className={styles.metricLabel}>{metric.label}</p>
              <p className={styles.metricValue} style={{ color: metric.color }}>
                {metric.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
