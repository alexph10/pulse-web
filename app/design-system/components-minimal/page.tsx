'use client'

import { useMemo } from 'react'
import StatCard from '@/app/components/analytics/StatCard'
import ProgressRing from '@/app/components/ui/ProgressRing'
import MetricGrid from '@/app/components/ui/MetricGrid'
import MoodHeatmap from '@/app/components/analytics/MoodHeatmap'
import { Calendar, Flame, TrendUp, Heart } from '@phosphor-icons/react'

export default function ComponentsPreview() {
  // Sample mood data for heatmap
  const moodData = useMemo(() => {
    const data = []
    const today = new Date()
    const randomSeed = 0.7823 // Fixed seed for consistent data
    for (let i = 0; i < 84; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      // Random mood data with some patterns
      if ((randomSeed + i * 0.1) % 1 > 0.3) {
        data.push({
          date: date.toISOString().split('T')[0],
          score: Math.floor((randomSeed + i * 0.123) % 1 * 5) + 5, // 5-10
          mood: ['joyful', 'calm', 'energized'][Math.floor((randomSeed + i * 0.456) % 1 * 3)]
        })
      }
    }
    return data
  }, [])

  const sampleMetrics = [
    { label: 'Total Entries', value: '142', sublabel: 'this month' },
    { label: 'Avg Mood', value: '7.8', sublabel: 'out of 10' },
    { label: 'Current Streak', value: '12', sublabel: 'days' },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--background)',
      padding: '64px 32px',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-family-satoshi)',
            marginBottom: '8px',
            letterSpacing: '-0.02em'
          }}>
            Minimalist Components
          </h1>
          <p style={{
            fontSize: '15px',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-family-satoshi)',
          }}>
            Clean, data-first design with no embellishments
          </p>
        </div>

        {/* StatCards Grid */}
        <section style={{ marginBottom: '64px' }}>
          <h2 style={{
            fontSize: '13px',
            fontWeight: '500',
            color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-family-satoshi)',
            marginBottom: '20px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Stat Cards
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
          }}>
            <StatCard
              title="Total Entries"
              value="142"
              subtitle="this month"
              icon={<Calendar size={20} weight="regular" />}
            />
            <StatCard
              title="Current Streak"
              value="12 days"
              subtitle="longest: 18"
              icon={<Flame size={20} weight="regular" />}
            />
            <StatCard
              title="Average Mood"
              value="7.8/10"
              subtitle="past 30 days"
              icon={<Heart size={20} weight="regular" />}
            />
            <StatCard
              title="Completion"
              value="87%"
              subtitle="goal progress"
              icon={<TrendUp size={20} weight="regular" />}
            />
          </div>
        </section>

        {/* Progress Rings */}
        <section style={{ marginBottom: '64px' }}>
          <h2 style={{
            fontSize: '13px',
            fontWeight: '500',
            color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-family-satoshi)',
            marginBottom: '20px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Progress Rings
          </h2>
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border-subtle)',
            padding: '32px',
            display: 'flex',
            gap: '48px',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <ProgressRing progress={25} size="sm" />
            <ProgressRing progress={50} size="md" />
            <ProgressRing progress={75} size="lg" />
            <ProgressRing progress={100} size="lg" label="Complete" />
          </div>
        </section>

        {/* Metric Grid */}
        <section style={{ marginBottom: '64px' }}>
          <h2 style={{
            fontSize: '13px',
            fontWeight: '500',
            color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-family-satoshi)',
            marginBottom: '20px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Metric Grid
          </h2>
          <MetricGrid metrics={sampleMetrics} columns={3} />
        </section>

        {/* Mood Heatmap */}
        <section style={{ marginBottom: '64px' }}>
          <h2 style={{
            fontSize: '13px',
            fontWeight: '500',
            color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-family-satoshi)',
            marginBottom: '20px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Mood Heatmap
          </h2>
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border-subtle)',
            padding: '32px',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <MoodHeatmap
              data={moodData}
              weeks={12}
              onCellClick={(data) => console.log('Clicked:', data)}
            />
          </div>
        </section>

        {/* Combined Example */}
        <section>
          <h2 style={{
            fontSize: '13px',
            fontWeight: '500',
            color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-family-satoshi)',
            marginBottom: '20px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Combined Layout
          </h2>
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border-subtle)',
            padding: '32px',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '32px',
            }}>
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-family-satoshi)',
                  marginBottom: '4px',
                  letterSpacing: '-0.01em'
                }}>
                  Your Progress
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-family-satoshi)',
                }}>
                  Last 12 weeks
                </p>
              </div>
              <ProgressRing progress={68} size="md" />
            </div>
            
            <MoodHeatmap
              data={moodData}
              weeks={12}
            />
          </div>
        </section>
      </div>
    </div>
  )
}
