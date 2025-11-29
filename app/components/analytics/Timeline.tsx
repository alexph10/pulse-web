'use client'

interface Milestone {
  date: Date
  title: string
  description?: string
  type: 'journal' | 'goal' | 'habit'
}

interface TimelineProps {
  milestones?: Milestone[]
  title?: string
  subtitle?: string
}

// Generate sample milestones at module level
const generateSampleMilestones = (): Milestone[] => {
  const now = Date.now();
  return [
    {
      date: new Date(now - 2 * 60 * 60 * 1000),
      title: 'Completed daily reflection',
      description: 'Wrote 450 words about work-life balance',
      type: 'journal',
    },
    {
      date: new Date(now - 5 * 60 * 60 * 1000),
      title: 'Goal milestone reached',
      description: 'Read 10 books this quarter',
      type: 'goal',
    },
    {
      date: new Date(now - 24 * 60 * 60 * 1000),
      title: 'Habit streak: 15 days',
      description: 'Morning meditation streak',
      type: 'habit',
    },
    {
      date: new Date(now - 48 * 60 * 60 * 1000),
      title: 'Weekly review completed',
      description: 'Reflected on 7 days of progress',
      type: 'journal',
    },
  ];
};

const defaultSampleMilestones = generateSampleMilestones();

export default function Timeline({
  milestones,
  title = 'Recent Activity',
  subtitle = 'Your latest milestones',
}: TimelineProps) {
  const displayMilestones = milestones || defaultSampleMilestones

  const getTypeColor = (type: Milestone['type']) => {
    switch (type) {
      case 'journal':
        return '#2d5a3d'
      case 'goal':
        return '#d4774a'
      case 'habit':
        return '#8a9199'
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
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

      {/* Timeline */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0',
        position: 'relative',
      }}>
        {/* Vertical line */}
        <div style={{
          position: 'absolute',
          left: '6px',
          top: '12px',
          bottom: '12px',
          width: '1px',
          background: 'rgba(228, 221, 211, 0.12)',
        }} />

        {displayMilestones.map((milestone, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              gap: '16px',
              padding: '12px 0',
              position: 'relative',
            }}
          >
            {/* Dot */}
            <div style={{
              width: '12px',
              height: '12px',
              background: getTypeColor(milestone.type),
              border: '2px solid #252c2c',
              flexShrink: 0,
              marginTop: '4px',
              position: 'relative',
              zIndex: 1,
            }} />

            {/* Content */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '12px',
              }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#e4ddd3',
                  fontFamily: 'var(--font-family-satoshi)',
                  letterSpacing: '-0.01em',
                }}>
                  {milestone.title}
                </div>
                <div style={{
                  fontSize: '9px',
                  color: '#a39d96',
                  fontFamily: 'var(--font-family-satoshi)',
                  flexShrink: 0,
                }}>
                  {formatTimeAgo(milestone.date)}
                </div>
              </div>

              {milestone.description && (
                <div style={{
                  fontSize: '11px',
                  color: '#a39d96',
                  fontFamily: 'var(--font-family-satoshi)',
                  lineHeight: '1.5',
                }}>
                  {milestone.description}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
