'use client'

interface Metric {
  label: string
  value: string | number
  sublabel?: string
}

interface MetricGridProps {
  metrics: Metric[]
  columns?: 2 | 3 | 4
}

export default function MetricGrid({ metrics, columns = 3 }: MetricGridProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: '1px',
        background: 'rgba(228, 221, 211, 0.12)',
        border: 'none',
      }}
    >
      {metrics.map((metric, idx) => (
        <div
          key={idx}
          style={{
            background: '#252c2c',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <span
            style={{
              fontSize: '11px',
              color: '#a39d96',
              fontFamily: 'var(--font-family-satoshi)',
              fontWeight: '400',
              letterSpacing: '-0.01em',
              lineHeight: '1.4',
            }}
          >
            {metric.label}
          </span>
          <span
            style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#e4ddd3',
              fontFamily: 'var(--font-family-satoshi)',
              lineHeight: '1',
              letterSpacing: '-0.02em',
            }}
          >
            {metric.value}
          </span>
          {metric.sublabel && (
            <span
              style={{
                fontSize: '11px',
                color: '#a39d96',
                fontFamily: 'var(--font-family-satoshi)',
                fontWeight: '400',
              }}
            >
              {metric.sublabel}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
