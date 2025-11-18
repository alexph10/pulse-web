'use client'

import Link from 'next/link';
import styles from './QuickActions.module.css';

export default function QuickActions() {
  const actions = [
    {
      id: 'journal',
      category: 'Journal',
      label: 'New Journal Entry',
      description: 'Record your thoughts and feelings',
      href: '/dashboard/journal',
      variant: 'journal',
      icon: null
    },
    {
      id: 'activity',
      category: 'Activity',
      label: 'View Activity',
      description: 'Track your journaling patterns',
      href: '/dashboard/activity',
      variant: 'activity',
      icon: null
    },
    {
      id: 'goal',
      category: 'Goals',
      label: 'Set Wellness Goal',
      description: 'Define what you want to achieve',
      href: '/dashboard/goals',
      variant: 'goal'
    },
    {
      id: 'reflection',
      category: 'Reflection',
      label: 'Deep Reflection',
      description: 'Explore your patterns and growth',
      href: '/dashboard/reflections',
      variant: 'reflection'
    },
    {
      id: 'habit',
      category: 'Habits',
      label: 'Track Habits',
      description: 'Build consistent wellness practices',
      href: '/dashboard/habits',
      variant: 'habit'
    },
    {
      id: 'progress',
      category: 'Progress',
      label: 'View Progress',
      description: 'See your wellness journey',
      href: '/dashboard/progress',
      variant: 'progress'
    }
  ];

  return (
    <div className={styles.quickActions}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>
            Quick Actions
          </h2>
          <p className={styles.subtitle}>
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
              className={`${styles.actionCard} ${styles[action.variant]}`}
            >
              <div className={styles.cardHeader}>
                <span className={styles.categoryTag}>{action.category}</span>
              </div>
            <div className={styles.content}>
              <h3 className={styles.actionLabel}>{action.label}</h3>
              <p className={styles.actionDescription}>{action.description}</p>
            </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
