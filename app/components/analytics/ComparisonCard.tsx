'use client'

import { ArrowUp, ArrowDown, Minus } from '@phosphor-icons/react'

interface Metric {
  label: string
  value: string | number
  change?: number
  trend?: 'up' | 'down' | 'neutral'
}

interface ComparisonCardProps {
  title?: string
  subtitle?: string
  metrics?: Metric[]
}

export default function ComparisonCard({
  title = 'This Week vs Last Week',
  subtitle = 'Performance comparison',
  metrics,
}: ComparisonCardProps) {
  const sampleMetrics: Metric[] = metrics || [
    { label: 'Entries', value: 18, change: 12.5, trend: 'up' },
    { label: 'Avg Mood', value: '7.8', change: -5.2, trend: 'down' },
    { label: 'Streak', value: 7, change: 0, trend: 'neutral' },
    { label: 'Completion', value: '86%', change: 8.3, trend: 'up' },
  ]

  const displayMetrics = metrics || sampleMetrics

  const getTrendIcon = (trend: Metric['trend']) => {
    switch (trend) {
      case 'up':
        return <ArrowUp size={12} weight="bold" />
      case 'down':
        return <ArrowDown size={12} weight="bold" />
      default:
        return <Minus size={12} weight="bold" />
    }
  }

  const getTrendColor = (trend: Metric['trend']) => {
    switch (trend) {
      case 'up':
        return '#2d5a3d'
      case 'down':
        return '#d4774a'
      default:
        return '#8a9199'
    }
  }

  return (
    <div style={{
      background: '#252c2c',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    }}>
      {/* Header */}
      <div>
        <h3 style={{
          fontSize: '13px',
          fontWeight: '600',
          color: '#e4ddd3',
          fontFamily: 'var(--font-family-satoshi)',
          marginBottom: '2px',
          letterSpacing: '-0.01em'
        }}>
          {title}
        </h3>
        <p style={{
          fontSize: '10px',
          color: '#a39d96',
          fontFamily: 'var(--font-family-satoshi)',
        }}>
          {subtitle}
        </p>
      </div>

      {/* Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1px',
        background: 'rgba(228, 221, 211, 0.12)',
      }}>
        {displayMetrics.map((metric, idx) => (
          <div
            key={idx}
            style={{
              background: '#252c2c',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {/* Value */}
            <div style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#e4ddd3',
              fontFamily: 'var(--font-family-satoshi)',
              letterSpacing: '-0.02em',
              lineHeight: '1',
            }}>
              {metric.value}
            </div>

            {/* Label and Change */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '8px',
            }}>
              <div style={{
                fontSize: '9px',
                color: '#a39d96',
                fontFamily: 'var(--font-family-satoshi)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                {metric.label}
              </div>

              {metric.change !== undefined && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  color: getTrendColor(metric.trend),
                  fontSize: '9px',
                  fontWeight: '600',
                  fontFamily: 'var(--font-family-satoshi)',
                }}>
                  {getTrendIcon(metric.trend)}
                  {metric.change !== 0 && `${Math.abs(metric.change)}%`}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
