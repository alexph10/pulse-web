'use client'

interface QuickAction {
  label: string
  icon?: React.ReactNode
  onClick: () => void
  color?: string
}

interface QuickActionsProps {
  actions?: QuickAction[]
}

export default function QuickActions({ actions }: QuickActionsProps) {
  const defaultActions: QuickAction[] = actions || [
    {
      label: 'New Entry',
      onClick: () => console.log('New Entry'),
      color: '#2d5a3d'
    },
    {
      label: 'Log Goal',
      onClick: () => console.log('Log Goal'),
      color: '#d4774a'
    },
    {
      label: 'Daily Checkin',
      onClick: () => console.log('Daily Checkin'),
      color: '#8a9199'
    },
  ]

  const displayActions = actions || defaultActions

  return (
    <div style={{
      background: '#252c2c',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      {/* Header */}
      <div>
        <h3 style={{
          fontSize: '13px',
          fontWeight: '600',
          color: '#e4ddd3',
          fontFamily: 'var(--font-family-satoshi)',
          letterSpacing: '-0.01em'
        }}>
          Quick Actions
        </h3>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}>
        {displayActions.map((action, idx) => (
          <button
            key={idx}
            onClick={action.onClick}
            style={{
              width: '100%',
              padding: '10px 12px',
              background: 'rgba(228, 221, 211, 0.08)',
              border: '1px solid rgba(228, 221, 211, 0.12)',
              color: '#e4ddd3',
              fontSize: '12px',
              fontWeight: '500',
              fontFamily: 'var(--font-family-satoshi)',
              letterSpacing: '-0.01em',
              cursor: 'pointer',
              transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = action.color || '#2d5a3d'
              e.currentTarget.style.borderColor = action.color || '#2d5a3d'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(228, 221, 211, 0.08)'
              e.currentTarget.style.borderColor = 'rgba(228, 221, 211, 0.12)'
            }}
          >
            {action.icon}
            {action.label}
          </button>
        ))}
      </div>
    </div>
  )
}
