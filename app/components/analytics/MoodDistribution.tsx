'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useMediaQuery } from '@/app/hooks/useMediaQuery'

interface MoodDistributionProps {
  data: {
    mood: string
    count: number
  }[]
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    payload: {
      mood: string
      count: number
      percentage: number
    }
  }>
}

const MOOD_COLORS: Record<string, string> = {
  joyful: '#10B981',
  content: '#6EE7B7',
  calm: '#34D399',
  neutral: '#9CA3AF',
  anxious: '#FBBF24',
  sad: '#60A5FA',
  frustrated: '#F59E0B',
  angry: '#EF4444',
  overwhelmed: '#DC2626',
  excited: '#8B5CF6',
  grateful: '#10B981',
  hopeful: '#3B82F6'
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'white',
          padding: '12px 16px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid var(--border-subtle)'
        }}>
          <p style={{
            margin: 0,
            fontSize: '14px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            textTransform: 'capitalize',
            marginBottom: '4px'
          }}>
            {payload[0].payload.mood}
          </p>
          <p style={{
            margin: 0,
            fontSize: '13px',
            color: 'var(--text-secondary)'
          }}>
            {payload[0].value} entries ({Math.round(payload[0].payload.percentage)}%)
          </p>
        </div>
      )
    }
    return null
  }

export default function MoodDistribution({ data }: MoodDistributionProps) {
  const isMobile = useMediaQuery('(max-width: 767px)')
  
  // Sort by count descending
  const sortedData = [...data].sort((a, b) => b.count - a.count)

  // Calculate percentages
  const total = sortedData.reduce((sum, item) => sum + item.count, 0)
  const dataWithPercentage = sortedData.map(item => ({
    ...item,
    percentage: (item.count / total) * 100
  }))

  return (
    <div style={{
      width: '100%',
      height: '100%',
      minHeight: isMobile ? '200px' : '240px'
    }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={dataWithPercentage}
          margin={{ 
            top: 10, 
            right: isMobile ? 10 : 30, 
            left: isMobile ? -20 : 0, 
            bottom: isMobile ? 40 : 0 
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
          <XAxis 
            dataKey="mood" 
            stroke="var(--text-secondary)"
            style={{ fontSize: isMobile ? '10px' : '12px', textTransform: 'capitalize' }}
            angle={-45}
            textAnchor="end"
            height={isMobile ? 70 : 80}
          />
          <YAxis 
            stroke="var(--text-secondary)"
            style={{ fontSize: isMobile ? '10px' : '12px' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
            {dataWithPercentage.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={MOOD_COLORS[entry.mood.toLowerCase()] || '#1a3a2e'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
