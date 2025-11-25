'use client'

interface GoalProgress {
  id: string
  title: string
  target: number
  current: number
  deadline: Date
  category: 'journal' | 'goal' | 'habit'
}

interface GoalTrackerProps {
  goals?: GoalProgress[]
  title?: string
  subtitle?: string
}

export default function GoalTracker({
  goals,
  title = 'Goal Progress',
  subtitle = 'Track your objectives',
}: GoalTrackerProps) {
  const sampleGoals: GoalProgress[] = goals || [
    {
      id: '1',
      title: 'Write 50 journal entries',
      target: 50,
      current: 42,
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      category: 'journal',
    },
    {
      id: '2',
      title: 'Read 12 books',
      target: 12,
      current: 8,
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      category: 'goal',
    },
    {
      id: '3',
      title: 'Meditate 30 days',
      target: 30,
      current: 22,
      deadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      category: 'habit',
    },
  ]

  const displayGoals = goals || sampleGoals

  const getCategoryColor = (category: GoalProgress['category']) => {
    switch (category) {
      case 'journal':
        return '#2d5a3d'
      case 'goal':
        return '#d4774a'
      case 'habit':
        return '#8a9199'
    }
  }

  const getDaysUntil = (date: Date) => {
    const now = new Date()
    const diff = date.getTime() - now.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    
    if (days < 0) return 'Overdue'
    if (days === 0) return 'Today'
    if (days === 1) return '1 day'
    return `${days} days`
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

      {/* Goals */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}>
        {displayGoals.map((goal) => {
          const progress = (goal.current / goal.target) * 100
          const color = getCategoryColor(goal.category)

          return (
            <div
              key={goal.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              {/* Header */}
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
                  flex: 1,
                }}>
                  {goal.title}
                </div>
                <div style={{
                  fontSize: '9px',
                  color: '#a39d96',
                  fontFamily: 'var(--font-family-satoshi)',
                  flexShrink: 0,
                }}>
                  {getDaysUntil(goal.deadline)}
                </div>
              </div>

              {/* Progress bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
                <div style={{
                  flex: 1,
                  height: '8px',
                  background: 'rgba(228, 221, 211, 0.08)',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '100%',
                    width: `${Math.min(progress, 100)}%`,
                    background: `linear-gradient(90deg, ${color} 0%, ${color}dd 100%)`,
                    transition: 'width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    boxShadow: `0 0 8px ${color}33`,
                  }} />
                </div>

                <div style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#e4ddd3',
                  fontFamily: 'var(--font-family-satoshi)',
                  minWidth: '70px',
                  textAlign: 'right',
                }}>
                  {goal.current}/{goal.target}
                  <span style={{
                    fontSize: '9px',
                    color: '#a39d96',
                    marginLeft: '4px',
                  }}>
                    ({Math.round(progress)}%)
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
