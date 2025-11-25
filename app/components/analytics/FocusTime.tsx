'use client'

interface Focus {
  hour: string
  score: number
  description: string
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
    { hour: '9 AM', score: 95, description: 'Peak productivity' },
    { hour: '2 PM', score: 82, description: 'Post-lunch focus' },
    { hour: '6 PM', score: 68, description: 'Evening wind-down' },
  ]

  const displayFocuses = focuses || sampleFocuses

  const getBarGradient = (score: number) => {
    if (score >= 80) return 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    if (score >= 60) return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
    return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    }}>
      {/* Header with icon */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#f9fafb',
            fontFamily: 'var(--font-family-satoshi)',
            marginBottom: '4px',
            letterSpacing: '-0.02em'
          }}>
            {title}
          </h3>
          <p style={{
            fontSize: '12px',
            color: '#9ca3af',
            fontFamily: 'var(--font-family-satoshi)',
          }}>
            {subtitle}
          </p>
        </div>
      </div>

      {/* Focus periods */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}>
        {displayFocuses.map((focus, idx) => {
          const gradient = getBarGradient(focus.score)

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'
                e.currentTarget.style.transform = 'translateX(4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
                e.currentTarget.style.transform = 'translateX(0)'
              }}
            >
              {/* Time with better styling */}
              <div style={{
                minWidth: '70px',
                fontSize: '14px',
                fontWeight: '700',
                color: '#f9fafb',
                fontFamily: 'var(--font-family-satoshi)',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '8px 12px',
                textAlign: 'center',
              }}>
                {focus.hour}
              </div>

              {/* Bar container */}
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}>
                {/* Bar with improved design */}
                <div style={{
                  height: '32px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
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
                    boxShadow: `0 2px 8px rgba(16, 185, 129, 0.3)`,
                  }} />
                  
                  {/* Score badge */}
                  <div style={{
                    position: 'relative',
                    marginLeft: '12px',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#ffffff',
                    fontFamily: 'var(--font-family-satoshi)',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                  }}>
                    {focus.score}%
                  </div>
                </div>

                {/* Description with icon */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  color: '#9ca3af',
                  fontFamily: 'var(--font-family-satoshi)',
                }}>
                  <span style={{ opacity: 0.5 }}>•</span>
                  {focus.description}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
