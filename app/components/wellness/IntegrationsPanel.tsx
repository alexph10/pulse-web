'use client'

import { Plus } from '@phosphor-icons/react'
import styles from './IntegrationsPanel.module.css'

// Generate bar chart data at module level
const generateBarData = () => {
  const months = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month) => {
    const intensity = Math.random();
    return {
      month,
      intensity: intensity > 0.7 ? 'high' : intensity > 0.4 ? 'normal' : 'low',
      height: Math.random() * 60 + 20
    };
  });
};

const defaultBarData = generateBarData();

export default function IntegrationsPanel() {
  // Placeholder data - in real app, fetch from integrations API
  const integrations = [
    { name: 'Connected via Apple Health', icon: '🍎', time: '2 h ago', color: '#10B981' },
    { name: 'Real-time glucose tracking.', icon: '📊', time: '5 h ago', color: '#D97706' },
    { name: 'Body metrics made simple.', icon: '💪', time: 'today 08:24', color: '#8B5CF6' },
  ]

  const barData = defaultBarData

  // Helper function to get intensity class name
  const getIntensityClass = (intensity: string) => {
    if (intensity === 'low') return styles['intensity-low']
    if (intensity === 'normal') return styles['intensity-normal']
    if (intensity === 'high') return styles['intensity-high']
    return ''
  }

  return (
    <div className={styles.panel}>
      <div className={styles.background} />
      
      <div className={styles.content}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>Integrations & Sources Panel</h3>
            <p className={styles.subtitle}>Bring all your wellness signals together.</p>
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.chartSection}>
            <div className={styles.chart}>
              {barData.map((bar, index) => (
                <div key={index} className={styles.barContainer}>
                  <div
                    className={`${styles.bar} ${getIntensityClass(bar.intensity)}`}
                    style={{ height: `${bar.height}%` }}
                  />
                  <span className={styles.barLabel}>{bar.month}</span>
                </div>
              ))}
            </div>
            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <div className={`${styles.legendDot} ${styles['intensity-low']}`} />
                <span>low</span>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.legendDot} ${styles['intensity-normal']}`} />
                <span>normal</span>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.legendDot} ${styles['intensity-high']}`} />
                <span>high</span>
              </div>
            </div>
          </div>

          <div className={styles.integrationsList}>
            {integrations.map((integration, index) => (
              <div key={index} className={styles.integrationItem}>
                <div className={styles.integrationIcon} style={{ background: `${integration.color}20` }}>
                  {integration.icon}
                </div>
                <div className={styles.integrationInfo}>
                  <div className={styles.integrationName}>{integration.name}</div>
                  <div className={styles.integrationTime}>{integration.time}</div>
                </div>
              </div>
            ))}
            <button className={styles.addAppButton}>
              <Plus size={16} weight="regular" />
              <span>Add app</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

