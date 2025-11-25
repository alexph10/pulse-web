'use client'

interface InsightItem {
  title: string
  description: string
  icon?: string
  type?: 'positive' | 'neutral' | 'action'
}

interface InsightsCardProps {
  insights?: InsightItem[]
}

export default function InsightsCard({ insights }: InsightsCardProps) {
  const sampleInsights: InsightItem[] = insights || [
    {
      title: 'Strong momentum',
      description: 'You\'ve logged entries 6 days this week. Keep the streak going!',
      type: 'positive'
    },
    {
      title: 'Peak productivity',
      description: 'Your most productive time is 9-11am. Schedule important tasks then.',
      type: 'neutral'
    },
    {
      title: 'Goal reminder',
      description: '3 goals are due this week. Focus on "Complete project milestone".',
      type: 'action'
    },
  ]

  const displayInsights = insights || sampleInsights

  const getIconColor = (type?: string) => {
    switch (type) {
      case 'positive': return '#2d5a3d'
      case 'action': return '#d4774a'
      case 'neutral': return '#8a9199'
      default: return '#a39d96'
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
          Insights
        </h3>
        <p style={{
          fontSize: '10px',
          color: '#a39d96',
          fontFamily: 'var(--font-family-satoshi)',
        }}>
          AI-powered suggestions
        </p>
      </div>

      {/* Insights List */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1px',
        background: 'rgba(228, 221, 211, 0.12)',
      }}>
        {displayInsights.map((insight, idx) => (
          <div
            key={idx}
            style={{
              background: '#252c2c',
              padding: '12px',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
            }}
          >
            {/* Type indicator */}
            <div style={{
              width: '2px',
              height: '100%',
              minHeight: '35px',
              background: getIconColor(insight.type),
              flexShrink: 0,
            }} />

            {/* Content */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '3px',
            }}>
              <div style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#e4ddd3',
                fontFamily: 'var(--font-family-satoshi)',
                letterSpacing: '-0.01em',
              }}>
                {insight.title}
              </div>
              <div style={{
                fontSize: '11px',
                color: '#a39d96',
                fontFamily: 'var(--font-family-satoshi)',
                lineHeight: '1.5',
                letterSpacing: '-0.01em',
              }}>
                {insight.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
