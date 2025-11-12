'use client'

import { Notebook, Fire, PenNib, Calendar, Article, Clock } from '@phosphor-icons/react';
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
      icon: Notebook,
      label: 'Total Entries',
      value: stats.totalEntries.toLocaleString(),
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)'
    },
    {
      icon: Fire,
      label: 'Current Streak',
      value: `${stats.currentStreak} ${stats.currentStreak === 1 ? 'day' : 'days'}`,
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.1)'
    },
    {
      icon: PenNib,
      label: 'Avg Words/Day',
      value: stats.avgWordsPerDay.toLocaleString(),
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)'
    },
    {
      icon: Calendar,
      label: 'Most Active Day',
      value: stats.mostActiveDay,
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)'
    },
    {
      icon: Article,
      label: 'Longest Entry',
      value: `${stats.longestEntry.toLocaleString()} words`,
      color: '#6366f1',
      bgColor: 'rgba(99, 102, 241, 0.1)'
    },
    {
      icon: Clock,
      label: 'Favorite Time',
      value: stats.favoriteTime,
      color: '#ec4899',
      bgColor: 'rgba(236, 72, 153, 0.1)'
    }
  ];

  return (
    <div className={styles.metricsGrid}>
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <div key={index} className={styles.metricCard}>
            <div 
              className={styles.iconWrapper}
              style={{ 
                backgroundColor: metric.bgColor,
                color: metric.color 
              }}
            >
              <Icon size={24} weight="duotone" />
            </div>
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
