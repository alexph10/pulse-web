'use client'

interface Pattern {
  type: 'positive' | 'warning' | 'insight'
  title: string
  description: string
  confidence: number
}

interface PatternDetectionProps {
  patterns?: Pattern[]
}

export default function PatternDetection({ patterns }: PatternDetectionProps) {
  const samplePatterns: Pattern[] = patterns || [
    {
      type: 'positive',
      title: 'Consistent Morning Routine',
      description: 'You consistently journal between 7-9 AM on weekdays with 85% reliability',
      confidence: 0.85,
    },
    {
      type: 'warning',
      title: 'Weekend Activity Drop',
      description: 'Your engagement decreases by 60% on weekends, consider setting reminders',
      confidence: 0.73,
    },
    {
      type: 'insight',
      title: 'Mood Correlation Detected',
      description: 'Higher mood scores correlate with exercise completion (r=0.67)',
      confidence: 0.67,
    },
    {
      type: 'positive',
      title: 'Building Momentum',
      description: 'Your entry length has increased 40% over the past month',
      confidence: 0.92,
    },
  ]

  const displayPatterns = patterns || samplePatterns

  const getTypeColor = (type: Pattern['type']) => {
    switch (type) {
      case 'positive':
        return '#2d5a3d'
      case 'warning':
        return '#d4774a'
      case 'insight':
        return '#8a9199'
    }
  }

  const getTypeLabel = (type: Pattern['type']) => {
    switch (type) {
      case 'positive':
        return 'Positive Pattern'
      case 'warning':
        return 'Attention Needed'
      case 'insight':
        return 'Insight'
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
          Detected Patterns
        </h3>
        <p style={{
          fontSize: '10px',
          color: '#a39d96',
          fontFamily: 'var(--font-family-satoshi)',
        }}>
          Behavioral insights from your data
        </p>
      </div>

      {/* Patterns */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1px',
        background: 'rgba(228, 221, 211, 0.12)',
      }}>
        {displayPatterns.map((pattern, idx) => (
          <div
            key={idx}
            style={{
              background: '#252c2c',
              padding: '16px',
              display: 'flex',
              gap: '12px',
              transition: 'background 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'default',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(45, 90, 61, 0.08)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#252c2c'
            }}
          >
            {/* Type indicator with glow */}
            <div style={{
              width: '4px',
              background: `linear-gradient(180deg, ${getTypeColor(pattern.type)} 0%, ${getTypeColor(pattern.type)}aa 100%)`,
              borderRadius: '0',
              flexShrink: 0,
              boxShadow: `2px 0 8px ${getTypeColor(pattern.type)}44`,
            }} />

            {/* Content */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}>
              {/* Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
              }}>
                <h4 style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#e4ddd3',
                  fontFamily: 'var(--font-family-satoshi)',
                  letterSpacing: '-0.01em',
                }}>
                  {pattern.title}
                </h4>
                <span style={{
                  fontSize: '9px',
                  color: getTypeColor(pattern.type),
                  fontFamily: 'var(--font-family-satoshi)',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  flexShrink: 0,
                }}>
                  {getTypeLabel(pattern.type)}
                </span>
              </div>

              {/* Description */}
              <p style={{
                fontSize: '11px',
                color: '#a39d96',
                fontFamily: 'var(--font-family-satoshi)',
                lineHeight: '1.5',
              }}>
                {pattern.description}
              </p>

              {/* Confidence */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <div style={{
                  flex: 1,
                  height: '4px',
                  background: 'rgba(228, 221, 211, 0.12)',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '100%',
                    width: `${pattern.confidence * 100}%`,
                    background: `linear-gradient(90deg, ${getTypeColor(pattern.type)} 0%, ${getTypeColor(pattern.type)}dd 100%)`,
                    boxShadow: `0 0 4px ${getTypeColor(pattern.type)}33`,
                    transition: 'width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }} />
                </div>
                <span style={{
                  fontSize: '9px',
                  color: '#a39d96',
                  fontFamily: 'var(--font-family-satoshi)',
                  fontWeight: '500',
                  minWidth: '32px',
                  textAlign: 'right',
                }}>
                  {Math.round(pattern.confidence * 100)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
