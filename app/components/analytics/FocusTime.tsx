'use client'

interface Focus {
  hour: string
  score: number
  description: string
  trend?: 'up' | 'down' | 'stable'
}

interface FocusTimeProps {
  focuses?: Focus[]
  title?: string
  subtitle?: string
}

export default function FocusTime({
  focuses,
  title = 'Peak Focus Hours',
  subtitle = 'When you work best',
}: FocusTimeProps) {
  const sampleFocuses: Focus[] = focuses || [
    { hour: '9 AM', score: 95, description: 'Peak productivity', trend: 'up' },
    { hour: '2 PM', score: 82, description: 'Post-lunch focus', trend: 'stable' },
    { hour: '6 PM', score: 68, description: 'Evening wind-down', trend: 'down' },
  ]

  const displayFocuses = focuses || sampleFocuses

  const bestFocus = displayFocuses.reduce((best, current) => 
    current.score > best.score ? current : best
  )

  const getBarGradient = (score: number) => {
    if (score >= 80) return 'linear-gradient(135deg, #0f3d3c 0%, #1f5c57 100%)'
    if (score >= 60) return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
    return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
  }

  const getBarColor = (score: number) => {
    if (score >= 80) return '#0f3d3c'
    if (score >= 60) return '#f59e0b'
    return '#6b7280'
  }

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return '↗'
    if (trend === 'down') return '↘'
    return '→'
  }

  const getTrendColor = (trend?: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return '#0f3d3c'
    if (trend === 'down') return '#ef4444'
    return '#9ca3af'
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle corner accent (Linear style) */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle at top right, rgba(219, 39, 119, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Header with status indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px',
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#f9fafb',
              fontFamily: 'var(--font-family-satoshi)',
              letterSpacing: '-0.02em',
              lineHeight: '1.2',
            }}>
              {title}
            </h3>
            {/* Live indicator */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 8px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
            }}>
              <div style={{
                width: '4px',
                height: '4px',
                background: '#10b981',
                boxShadow: '0 0 4px #10b981',
              }} />
              <span style={{
                fontSize: '10px',
                color: '#10b981',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Live
              </span>
            </div>
          </div>
          <p style={{
            fontSize: '13px',
            color: '#9ca3af',
            fontFamily: 'var(--font-family-satoshi)',
            lineHeight: '1.5',
          }}>
            {subtitle}
          </p>
        </div>
      </div>

      {/* Insight card */}
      <div style={{
        padding: '16px',
        background: 'rgba(219, 39, 119, 0.08)',
        border: '1px solid rgba(219, 39, 119, 0.2)',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '3px',
          background: 'linear-gradient(180deg, #db2777 0%, #be185d 100%)',
        }} />
        <div style={{
          paddingLeft: '12px',
        }}>
          <p style={{
            fontSize: '13px',
            color: '#fce7f3',
            fontWeight: '600',
            marginBottom: '4px',
          }}>
            Peak Performance
          </p>
          <p style={{
            fontSize: '12px',
            color: '#9ca3af',
            lineHeight: '1.5',
          }}>
            You're most focused around <strong style={{ color: '#10b981' }}>{bestFocus.hour}</strong> with a {bestFocus.score}% productivity score
          </p>
        </div>
      </div>

      {/* Focus periods with enhanced design */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        {displayFocuses.map((focus, idx) => {
          const gradient = getBarGradient(focus.score)
          const color = getBarColor(focus.score)
          const isTopPerformer = focus.score === bestFocus.score

          return (
            <div
              key={idx}
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr 40px',
                alignItems: 'center',
                gap: '16px',
                padding: '14px 16px',
                background: isTopPerformer 
                  ? 'rgba(16, 185, 129, 0.05)' 
                  : 'rgba(255, 255, 255, 0.03)',
                border: isTopPerformer
                  ? '1px solid rgba(16, 185, 129, 0.2)'
                  : '1px solid rgba(255, 255, 255, 0.05)',
                transition: 'all 0.25s ease',
                cursor: 'pointer',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = isTopPerformer 
                  ? 'rgba(16, 185, 129, 0.08)'
                  : 'rgba(255, 255, 255, 0.06)'
                e.currentTarget.style.transform = 'translateX(4px)'
                e.currentTarget.style.boxShadow = `0 4px 12px ${color}20`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isTopPerformer 
                  ? 'rgba(16, 185, 129, 0.05)'
                  : 'rgba(255, 255, 255, 0.03)'
                e.currentTarget.style.transform = 'translateX(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Top performer badge */}
              {isTopPerformer && (
                <div style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '16px',
                  padding: '2px 8px',
                  background: '#10b981',
                  fontSize: '9px',
                  fontWeight: '700',
                  color: '#ffffff',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  Best
                </div>
              )}

              {/* Time badge */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
              }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#f9fafb',
                  fontFamily: 'var(--font-family-satoshi)',
                  letterSpacing: '-0.01em',
                }}>
                  {focus.hour}
                </div>
                {focus.trend && (
                  <div style={{
                    fontSize: '12px',
                    color: getTrendColor(focus.trend),
                  }}>
                    {getTrendIcon(focus.trend)}
                  </div>
                )}
              </div>

              {/* Progress visualization */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}>
                {/* Bar with animation */}
                <div style={{
                  position: 'relative',
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '100%',
                    width: `${focus.score}%`,
                    background: gradient,
                    transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    boxShadow: `0 0 12px ${color}40`,
                  }} />
                </div>

                {/* Description */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  <div style={{
                    width: '3px',
                    height: '3px',
                    background: '#6b7280',
                  }} />
                  <span style={{
                    fontSize: '11px',
                    color: '#9ca3af',
                    fontFamily: 'var(--font-family-satoshi)',
                  }}>
                    {focus.description}
                  </span>
                </div>
              </div>

              {/* Score badge */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '15px',
                fontWeight: '700',
                color: color,
                fontFamily: 'var(--font-family-satoshi)',
              }}>
                {focus.score}
                <span style={{
                  fontSize: '10px',
                  marginLeft: '1px',
                  opacity: 0.7,
                }}>
                  %
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer hint */}
      <div style={{
        paddingTop: '12px',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      }}>
        <p style={{
          fontSize: '11px',
          color: '#6b7280',
          textAlign: 'center',
          fontFamily: 'var(--font-family-satoshi)',
        }}>
          Click any time slot to see detailed activity breakdown
        </p>
      </div>
    </div>
  )
}
