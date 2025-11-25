'use client'

interface Goal {
  id: string
  title: string
  progress: number
  target?: number
  current?: number
  category?: 'journal' | 'goals' | 'habits'
  dueDate?: Date | string
}

interface ActiveGoalsProps {
  goals?: Goal[]
  onGoalClick?: (id: string) => void
}

export default function ActiveGoals({ goals, onGoalClick }: ActiveGoalsProps) {
  // Sample data if none provided
  const sampleGoals: Goal[] = goals || [
    {
      id: '1',
      title: 'Complete 30 journal entries',
      progress: 73,
      current: 22,
      target: 30,
      category: 'journal'
    },
    {
      id: '2',
      title: 'Exercise 5 times per week',
      progress: 60,
      current: 3,
      target: 5,
      category: 'habits'
    },
    {
      id: '3',
      title: 'Read 3 books this month',
      progress: 33,
      current: 1,
      target: 3,
      category: 'goals'
    },
    {
      id: '4',
      title: 'Daily meditation streak',
      progress: 85,
      current: 17,
      target: 20,
      category: 'habits'
    },
    {
      id: '5',
      title: 'Complete project milestone',
      progress: 45,
      current: 9,
      target: 20,
      category: 'goals'
    },
  ]

  const displayGoals = goals || sampleGoals

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'journal': return '#2d5a3d'
      case 'goals': return '#d4774a'
      case 'habits': return '#8a9199'
      default: return '#2d5a3d'
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
          Active Goals
        </h3>
        <p style={{
          fontSize: '10px',
          color: '#a39d96',
          fontFamily: 'var(--font-family-satoshi)',
        }}>
          Current progress
        </p>
      </div>

      {/* Goals List */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        {displayGoals.slice(0, 5).map((goal) => (
          <div
            key={goal.id}
            onClick={() => onGoalClick?.(goal.id)}
            style={{
              cursor: onGoalClick ? 'pointer' : 'default',
              transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {/* Goal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '6px',
              gap: '12px',
            }}>
              <span style={{
                fontSize: '12px',
                color: '#e4ddd3',
                fontFamily: 'var(--font-family-satoshi)',
                fontWeight: '500',
                lineHeight: '1.4',
                letterSpacing: '-0.01em',
                flex: 1,
              }}>
                {goal.title}
              </span>
              <span style={{
                fontSize: '12px',
                color: '#e4ddd3',
                fontFamily: 'var(--font-family-satoshi)',
                fontWeight: '600',
                letterSpacing: '-0.01em',
                flexShrink: 0,
              }}>
                {goal.progress}%
              </span>
            </div>

            {/* Progress Bar */}
            <div style={{
              width: '100%',
              height: '5px',
              background: 'rgba(228, 221, 211, 0.08)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: `${goal.progress}%`,
                background: getCategoryColor(goal.category),
                transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }} />
            </div>

            {/* Progress Details */}
            {goal.current !== undefined && goal.target !== undefined && (
              <div style={{
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <span style={{
                  fontSize: '9px',
                  color: '#a39d96',
                  fontFamily: 'var(--font-family-satoshi)',
                }}>
                  {goal.current} / {goal.target}
                </span>
                {goal.category && (
                  <>
                    <span style={{
                      fontSize: '10px',
                      color: '#a39d96',
                    }}>
                      •
                    </span>
                    <span style={{
                      fontSize: '10px',
                      color: '#a39d96',
                      fontFamily: 'var(--font-family-satoshi)',
                      textTransform: 'capitalize',
                    }}>
                      {goal.category}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
