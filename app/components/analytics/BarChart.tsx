'use client'

interface BarData {
  label: string
  value: number
  color?: string
}

interface BarChartProps {
  data: BarData[]
  title?: string
  subtitle?: string
  showValues?: boolean
}

export default function BarChart({ 
  data, 
  title = 'Comparison',
  subtitle,
  showValues = true 
}: BarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value), 1)

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
        {subtitle && (
          <p style={{
            fontSize: '10px',
            color: '#a39d96',
            fontFamily: 'var(--font-family-satoshi)',
          }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Chart */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '12px',
        height: '180px',
        paddingTop: '20px',
      }}>
        {data.map((item, idx) => {
          const heightPercent = (item.value / maxValue) * 100
          const color = item.color || '#2d5a3d'

          return (
            <div
              key={idx}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                height: '100%',
              }}
            >
              {/* Value label */}
              {showValues && (
                <div style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#e4ddd3',
                  fontFamily: 'var(--font-family-satoshi)',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'flex-end',
                }}>
                  {item.value}
                </div>
              )}

              {/* Bar */}
              <div
                style={{
                  flex: 1,
                  width: '100%',
                  display: 'flex',
                  alignItems: 'flex-end',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: `${heightPercent}%`,
                    background: `linear-gradient(180deg, ${color} 0%, ${color}dd 100%)`,
                    boxShadow: `0 -2px 8px ${color}33`,
                    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scaleY(1.02) translateY(-2px)'
                    e.currentTarget.style.boxShadow = `0 -4px 16px ${color}55`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scaleY(1) translateY(0)'
                    e.currentTarget.style.boxShadow = `0 -2px 8px ${color}33`
                  }}
                />
              </div>

              {/* Label */}
              <div style={{
                fontSize: '10px',
                color: '#a39d96',
                fontFamily: 'var(--font-family-satoshi)',
                textAlign: 'center',
                fontWeight: '500',
              }}>
                {item.label}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
