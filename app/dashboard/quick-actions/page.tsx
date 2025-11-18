'use client'

import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import styles from './quick-actions.module.css';

export default function QuickActionsPage() {
  const { user } = useAuth();

  const actionCategories = [
    {
      title: 'Create',
      description: 'Start something new',
      actions: [
        {
          id: 'journal',
          label: 'New Journal Entry',
          description: 'Record your thoughts and feelings',
          href: '/dashboard/journal',
          color: '#3b82f6',
          bgColor: 'rgba(59, 130, 246, 0.1)',
          shortcut: 'J'
        },
        {
          id: 'note',
          label: 'Quick Note',
          description: 'Jot down a quick thought',
          href: '/dashboard/notes',
          color: '#6366f1',
          bgColor: 'rgba(99, 102, 241, 0.1)',
          shortcut: 'N'
        },
        {
          id: 'goal',
          label: 'Set New Goal',
          description: 'Define what you want to achieve',
          href: '/dashboard/goals',
          color: '#10b981',
          bgColor: 'rgba(16, 185, 129, 0.1)',
          shortcut: 'G'
        },
        {
          id: 'reflection',
          label: 'Deep Reflection',
          description: 'Analyze your patterns and growth',
          href: '/dashboard/reflections',
          color: '#f59e0b',
          bgColor: 'rgba(245, 158, 11, 0.1)',
          shortcut: 'R'
        }
      ]
    },
    {
      title: 'Track',
      description: 'Monitor your progress',
      actions: [
        {
          id: 'habits',
          label: 'Check Habits',
          description: 'Mark off today\'s routines',
          href: '/dashboard/habits',
          color: '#8b5cf6',
          bgColor: 'rgba(139, 92, 246, 0.1)',
          shortcut: 'H'
        },
        {
          id: 'activity',
          label: 'View Activity',
          description: 'See your journaling patterns',
          href: '/dashboard/activity',
          color: '#ef4444',
          bgColor: 'rgba(239, 68, 68, 0.1)',
          shortcut: 'A'
        },
        {
          id: 'progress',
          label: 'Check Progress',
          description: 'Review your analytics',
          href: '/dashboard/progress',
          color: '#ec4899',
          bgColor: 'rgba(236, 72, 153, 0.1)',
          shortcut: 'P'
        }
      ]
    },
    {
      title: 'Discover',
      description: 'Learn about yourself',
      actions: [
        {
          id: 'insights',
          label: 'View Insights',
          description: 'Get personalized recommendations',
          href: '/dashboard/insights',
          color: '#06b6d4',
          bgColor: 'rgba(6, 182, 212, 0.1)',
          shortcut: 'I'
        },
        {
          id: 'streak',
          label: 'Streak Status',
          description: 'Check your consistency',
          href: '/dashboard/activity',
          color: '#f97316',
          bgColor: 'rgba(249, 115, 22, 0.1)',
          shortcut: 'S'
        },
        {
          id: 'profile',
          label: 'Profile Settings',
          description: 'Manage your account',
          href: '/dashboard/profile',
          color: '#814837', // ironstone (replaces gray)
          bgColor: 'rgba(100, 116, 139, 0.1)',
          shortcut: '.'
        }
      ]
    }
  ];

  return (
    <DashboardLayout isLoading={false}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Quick Actions
          </h1>
          <p className={styles.subtitle}>
            Fast access to everything you need
          </p>
        </div>
      </div>

      {/* Popular Actions */}
      <div className={styles.popularSection}>
        <h2 className={styles.sectionTitle}>Most Used</h2>
        <div className={styles.popularGrid}>
          {actionCategories[0].actions.slice(0, 2).map(action => {
            return (
              <Link
                key={action.id}
                href={action.href}
                className={styles.popularCard}
                style={{ borderTop: `3px solid ${action.color}` }}
              >
                <div className={styles.popularAccent} aria-hidden="true" />
                <div className={styles.popularContent}>
                  <h3 className={styles.popularLabel}>{action.label}</h3>
                  <p className={styles.popularDesc}>{action.description}</p>
                </div>
                <div className={styles.shortcut}>{action.shortcut}</div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* All Actions by Category */}
      {actionCategories.map((category, categoryIndex) => (
        <div key={categoryIndex} className={styles.category}>
          <div className={styles.categoryHeader}>
            <h2 className={styles.categoryTitle}>{category.title}</h2>
            <p className={styles.categoryDesc}>{category.description}</p>
          </div>
          <div className={styles.actionGrid}>
            {category.actions.map((action) => {
              return (
                <Link
                  key={action.id}
                  href={action.href}
                  className={styles.actionCard}
                >
                  <div className={styles.actionIndicator} aria-hidden="true" />
                  <div className={styles.content}>
                    <h3 className={styles.actionLabel}>{action.label}</h3>
                    <p className={styles.actionDescription}>{action.description}</p>
                  </div>
                  <div className={styles.actionFooter}>
                    <span className={styles.shortcutBadge}>
                      {action.shortcut}
                    </span>
                    <span className={styles.arrow}>
                      →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ))}

      {/* Keyboard Shortcuts Info */}
      <div className={styles.infoCard}>
        <div className={styles.infoIcon} aria-hidden="true" />
        <div className={styles.infoContent}>
          <h3 className={styles.infoTitle}>Keyboard Shortcuts</h3>
          <p className={styles.infoText}>
            Press <kbd>Ctrl</kbd> + <kbd>K</kbd> then the action shortcut letter to quickly navigate anywhere.
            For example: <kbd>Ctrl</kbd> + <kbd>K</kbd>, <kbd>J</kbd> opens the Journal.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
