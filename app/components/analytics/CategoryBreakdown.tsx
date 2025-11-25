'use client'

interface CategoryData {
  label: string
  value: number
  percentage: number
  color: string
}

interface CategoryBreakdownProps {
  data?: CategoryData[]
}

export default function CategoryBreakdown({ data }: CategoryBreakdownProps) {
  const sampleData: CategoryData[] = data || [
    { label: 'Journal', value: 142, percentage: 45, color: '#2d5a3d' },
    { label: 'Goals', value: 98, percentage: 31, color: '#d4774a' },
    { label: 'Habits', value: 76, percentage: 24, color: '#8a9199' },
  ]

  const displayData = data || sampleData
  const total = displayData.reduce((sum, item) => sum + item.value, 0)

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
          Activity Breakdown
        </h3>
        <p style={{
          fontSize: '10px',
          color: '#a39d96',
          fontFamily: 'var(--font-family-satoshi)',
        }}>
          {total} total activities
        </p>
      </div>

      {/* Stacked Bar */}
      <div style={{
        width: '100%',
        height: '10px',
        background: 'rgba(228, 221, 211, 0.08)',
        display: 'flex',
        overflow: 'hidden',
      }}>
        {displayData.map((item, idx) => (
          <div
            key={idx}
            style={{
              width: `${item.percentage}%`,
              height: '100%',
              background: item.color,
              transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        ))}
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        {displayData.map((item, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                background: item.color,
              }} />
              <span style={{
                fontSize: '12px',
                color: '#e4ddd3',
                fontFamily: 'var(--font-family-satoshi)',
                fontWeight: '500',
                letterSpacing: '-0.01em',
              }}>
                {item.label}
              </span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <span style={{
                fontSize: '13px',
                color: '#a39d96',
                fontFamily: 'var(--font-family-satoshi)',
              }}>
                {item.value}
              </span>
              <span style={{
                fontSize: '13px',
                color: '#e4ddd3',
                fontFamily: 'var(--font-family-satoshi)',
                fontWeight: '600',
                minWidth: '40px',
                textAlign: 'right',
              }}>
                {item.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
