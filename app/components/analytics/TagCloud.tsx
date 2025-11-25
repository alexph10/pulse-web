'use client'

interface Tag {
  name: string
  count: number
}

interface TagCloudProps {
  tags?: Tag[]
  title?: string
  subtitle?: string
}

export default function TagCloud({
  tags,
  title = 'Common Themes',
  subtitle = 'Most used tags',
}: TagCloudProps) {
  const sampleTags: Tag[] = tags || [
    { name: 'productivity', count: 28 },
    { name: 'mindfulness', count: 22 },
    { name: 'growth', count: 18 },
    { name: 'career', count: 15 },
    { name: 'wellness', count: 14 },
    { name: 'relationships', count: 12 },
    { name: 'learning', count: 10 },
    { name: 'creativity', count: 8 },
    { name: 'fitness', count: 7 },
    { name: 'finance', count: 5 },
  ]

  const displayTags = tags || sampleTags

  // Calculate sizes
  const maxCount = Math.max(...displayTags.map(t => t.count), 1)
  const minCount = Math.min(...displayTags.map(t => t.count), 1)

  const getSize = (count: number) => {
    const ratio = (count - minCount) / (maxCount - minCount)
    return 10 + ratio * 8 // 10px to 18px
  }

  const getOpacity = (count: number) => {
    const ratio = (count - minCount) / (maxCount - minCount)
    return 0.5 + ratio * 0.5 // 0.5 to 1
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

      {/* Tag Cloud */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px 0',
      }}>
        {displayTags.map((tag, idx) => (
          <div
            key={idx}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              background: 'rgba(228, 221, 211, 0.08)',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              border: '1px solid rgba(228, 221, 211, 0.12)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(45, 90, 61, 0.15)'
              e.currentTarget.style.borderColor = 'rgba(45, 90, 61, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(228, 221, 211, 0.08)'
              e.currentTarget.style.borderColor = 'rgba(228, 221, 211, 0.12)'
            }}
          >
            <span style={{
              fontSize: `${getSize(tag.count)}px`,
              fontWeight: '500',
              color: '#e4ddd3',
              fontFamily: 'var(--font-family-satoshi)',
              opacity: getOpacity(tag.count),
            }}>
              {tag.name}
            </span>
            <span style={{
              fontSize: '9px',
              color: '#a39d96',
              fontFamily: 'var(--font-family-satoshi)',
              fontWeight: '600',
            }}>
              {tag.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
