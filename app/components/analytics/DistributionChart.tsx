'use client'

interface DistributionData {
  range: string
  count: number
  percentage: number
}

interface DistributionChartProps {
  data?: DistributionData[]
  title?: string
  subtitle?: string
}

export default function DistributionChart({
  data,
  title = 'Mood Distribution',
  subtitle = 'How often you feel each mood level',
}: DistributionChartProps) {
  // Sample data: mood score distribution (1-10)
  const sampleData: DistributionData[] = data || [
    { range: '1-2', count: 2, percentage: 3 },
    { range: '3-4', count: 5, percentage: 8 },
    { range: '5-6', count: 18, percentage: 28 },
    { range: '7-8', count: 28, percentage: 43 },
    { range: '9-10', count: 12, percentage: 18 },
  ]

  const displayData = data || sampleData
  const maxCount = Math.max(...displayData.map(d => d.count), 1)

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

      {/* Histogram */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '6px',
        height: '140px',
        paddingBottom: '4px',
      }}>
        {displayData.map((item, idx) => {
          const heightPercent = (item.count / maxCount) * 100
          const intensity = 0.3 + (item.count / maxCount) * 0.7

          return (
            <div
              key={idx}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                height: '100%',
              }}
            >
              {/* Bar */}
              <div
                style={{
                  flex: 1,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: `${heightPercent}%`,
                    background: `linear-gradient(180deg, rgba(45, 90, 61, ${intensity}) 0%, rgba(45, 90, 61, ${intensity * 0.8}) 100%)`,
                    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    cursor: 'pointer',
                    transformOrigin: 'bottom',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '6px 4px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `linear-gradient(180deg, #2d5a3d 0%, #234a31 100%)`
                    e.currentTarget.style.transform = 'scaleY(1.03)'
                    e.currentTarget.style.boxShadow = '0 -2px 12px rgba(45, 90, 61, 0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `linear-gradient(180deg, rgba(45, 90, 61, ${intensity}) 0%, rgba(45, 90, 61, ${intensity * 0.8}) 100%)`
                    e.currentTarget.style.transform = 'scaleY(1)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {/* Count */}
                  <div style={{
                    fontSize: '10px',
                    fontWeight: '600',
                    color: '#e4ddd3',
                    fontFamily: 'var(--font-family-satoshi)',
                    textAlign: 'center',
                  }}>
                    {item.count}
                  </div>

                  {/* Percentage */}
                  <div style={{
                    fontSize: '9px',
                    color: '#e4ddd3',
                    fontFamily: 'var(--font-family-satoshi)',
                    textAlign: 'center',
                    opacity: 0.7,
                  }}>
                    {item.percentage}%
                  </div>
                </div>
              </div>

              {/* Range label */}
              <div style={{
                fontSize: '10px',
                color: '#a39d96',
                fontFamily: 'var(--font-family-satoshi)',
                fontWeight: '500',
                textAlign: 'center',
              }}>
                {item.range}
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary stats */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        paddingTop: '12px',
        borderTop: '1px solid rgba(228, 221, 211, 0.12)',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
        }}>
          <div style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#e4ddd3',
            fontFamily: 'var(--font-family-satoshi)',
          }}>
            {displayData.reduce((sum, d) => sum + d.count, 0)}
          </div>
          <div style={{
            fontSize: '9px',
            color: '#a39d96',
            fontFamily: 'var(--font-family-satoshi)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            Total
          </div>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
        }}>
          <div style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#e4ddd3',
            fontFamily: 'var(--font-family-satoshi)',
          }}>
            {displayData.reduce((max, d, i) => 
              d.count > displayData[max].count ? i : max, 0
            ) * 2 + 1}-{displayData.reduce((max, d, i) => 
              d.count > displayData[max].count ? i : max, 0
            ) * 2 + 2}
          </div>
          <div style={{
            fontSize: '9px',
            color: '#a39d96',
            fontFamily: 'var(--font-family-satoshi)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            Most Common
          </div>
        </div>
      </div>
    </div>
  )
}
