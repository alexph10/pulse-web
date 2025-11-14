'use client'

import Link from 'next/link';
import styles from './QuickActions.module.css';

export default function QuickActions() {
  const actions = [
    {
      id: 'journal',
      label: 'New Journal Entry',
      description: 'Record your thoughts and feelings',
      href: '/dashboard/journal',
      color: '#c2593f', // crail
      bgColor: '#623e33', // quincy
      borderColor: '#5d3e39' // congo-brown
    },
    {
      id: 'activity',
      label: 'View Activity',
      description: 'Track your journaling patterns',
      href: '/dashboard/activity',
      color: '#b46c41', // brown-rust
      bgColor: '#623e33', // quincy
      borderColor: '#5d3e39' // congo-brown
    },
    {
      id: 'goal',
      label: 'Set Wellness Goal',
      description: 'Define what you want to achieve',
      href: '/dashboard/goals',
      color: '#c67b22', // ochre
      bgColor: '#5d3e39', // congo-brown
      borderColor: '#814837' // ironstone
    },
    {
      id: 'reflection',
      label: 'Deep Reflection',
      description: 'Explore your patterns and growth',
      href: '/dashboard/reflections',
      color: '#8d503a', // potters-clay
      bgColor: '#623e33', // quincy
      borderColor: '#5d3e39' // congo-brown
    },
    {
      id: 'habit',
      label: 'Track Habits',
      description: 'Build consistent wellness practices',
      href: '/dashboard/habits',
      color: '#814837', // ironstone
      bgColor: '#5d3e39', // congo-brown
      borderColor: '#8d503a' // potters-clay
    },
    {
      id: 'progress',
      label: 'View Progress',
      description: 'See your wellness journey',
      href: '/dashboard/progress',
      color: '#c2593f', // crail
      bgColor: '#5d3e39', // congo-brown
      borderColor: '#814837' // ironstone
    }
  ];

  return (
    <div className={styles.quickActions}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-lg)' }}>
        <div>
          <h2 className={styles.title}>
            Quick Actions
          </h2>
          <p style={{
            fontSize: 'var(--font-size-small)',
            color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-family-switzer)',
            fontStyle: 'italic',
            marginTop: '4px',
            marginLeft: '36px'
          }}>
            Your wellness tools
          </p>
        </div>
      </div>
      <div className={styles.actionGrid}>
        {actions.map((action) => {
          return (
            <Link
              key={action.id}
              href={action.href}
              className={styles.actionCard}
              style={{
                borderLeft: `2px solid ${action.color}`,
                backgroundColor: action.bgColor,
                borderColor: action.borderColor
              }}
            >
              <div className={styles.content}>
                <h3 className={styles.actionLabel} style={{ color: action.color }}>{action.label}</h3>
                <p className={styles.actionDescription}>{action.description}</p>
              </div>
              <div 
                className={styles.arrow}
                style={{ color: action.color }}
              >
                →
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
