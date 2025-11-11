'use client'

import DashboardLayout from '../../components/layouts/DashboardLayout'
import { BadgeShowcase } from '../../components/badges/BadgeShowcase'
import { useAuth } from '../../contexts/AuthContext'

export default function AchievementsPage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <DashboardLayout>
        <div style={{
          padding: '48px',
          textAlign: 'center',
          color: 'var(--text-secondary)'
        }}>
          Please log in to view your achievements
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div style={{
        marginBottom: '32px'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '600',
          color: 'var(--text-primary)',
          marginBottom: '8px',
          fontFamily: 'var(--font-family-satoshi)'
        }}>
          Your Achievements
        </h1>
        <p style={{
          fontSize: '16px',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-family-switzer)'
        }}>
          Track your progress and unlock new badges as you journal
        </p>
      </div>

      <BadgeShowcase userId={user.id} compact={false} />
    </DashboardLayout>
  )
}
