'use client'

import { 
  PenNib, 
  Target, 
  CheckSquare, 
  Lightbulb, 
  ChartLine,
  Lightning
} from '@phosphor-icons/react';
import Link from 'next/link';
import styles from './QuickActions.module.css';

export default function QuickActions() {
  const actions = [
    {
      id: 'journal',
      icon: PenNib,
      label: 'New Entry',
      description: 'Journal your thoughts',
      href: '/dashboard/journal',
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)'
    },
    {
      id: 'goal',
      icon: Target,
      label: 'Set Goal',
      description: 'Define a new target',
      href: '/dashboard/goals',
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)'
    },
    {
      id: 'habit',
      icon: CheckSquare,
      label: 'Track Habit',
      description: 'Check off today',
      href: '/dashboard/habits',
      color: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.1)'
    },
    {
      id: 'reflection',
      icon: Lightbulb,
      label: 'Reflect',
      description: 'Deep dive analysis',
      href: '/dashboard/reflections',
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)'
    },
    {
      id: 'progress',
      icon: ChartLine,
      label: 'View Progress',
      description: 'See your growth',
      href: '/dashboard/progress',
      color: '#ec4899',
      bgColor: 'rgba(236, 72, 153, 0.1)'
    },
    {
      id: 'activity',
      icon: Lightning,
      label: 'Activity',
      description: 'Check patterns',
      href: '/dashboard/activity',
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.1)'
    }
  ];

  return (
    <div className={styles.quickActions}>
      <h2 className={styles.title}>
        <Lightning size={24} weight="duotone" />
        Quick Actions
      </h2>
      <div className={styles.actionGrid}>
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.id}
              href={action.href}
              className={styles.actionCard}
              style={{
                borderTop: `2px solid ${action.color}`
              }}
            >
              <div
                className={styles.iconWrapper}
                style={{
                  backgroundColor: action.bgColor,
                  color: action.color
                }}
              >
                <Icon size={24} weight="duotone" />
              </div>
              <div className={styles.content}>
                <h3 className={styles.actionLabel}>{action.label}</h3>
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
