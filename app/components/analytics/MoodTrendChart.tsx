'use client'

import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useMediaQuery } from '@/app/hooks/useMediaQuery'

interface MoodData {
  date: string
  mood_score: number
  primary_mood: string
}

interface MoodTrendChartProps {
  data: MoodData[]
  type?: 'line' | 'area'
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    payload: {
      date: string
      mood: string
    }
  }>
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
            marginBottom: '4px'
          }}>
            {payload[0].payload.date}
          </p>
          <p style={{
            margin: 0,
            fontSize: '13px',
            color: 'var(--text-secondary)'
          }}>
            Score: <strong>{payload[0].value}/10</strong>
          </p>
          <p style={{
            margin: 0,
            fontSize: '13px',
            color: 'var(--text-secondary)',
            textTransform: 'capitalize'
          }}>
            Mood: <strong>{payload[0].payload.mood}</strong>
          </p>
        </div>
      )
    }
    return null
  }

export default function MoodTrendChart({ data, type = 'area' }: MoodTrendChartProps) {
  const isMobile = useMediaQuery('(max-width: 767px)')
  
  // Format data for chart
  const chartData = data.map(entry => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: entry.mood_score,
    mood: entry.primary_mood
  }))

  return (
    <div style={{
      width: '100%',
      height: '100%',
      minHeight: isMobile ? '200px' : '240px'
    }}>
      <ResponsiveContainer width="100%" height="100%">
        {type === 'area' ? (
          <AreaChart data={chartData} margin={{ 
            top: 10, 
            right: isMobile ? 10 : 30, 
            left: isMobile ? -20 : 0, 
            bottom: 0 
          }}>
            <defs>
              <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1a3a2e" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#1a3a2e" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
            <XAxis 
              dataKey="date" 
              stroke="var(--text-secondary)"
              style={{ fontSize: isMobile ? '10px' : '12px' }}
              angle={isMobile ? -45 : 0}
              textAnchor={isMobile ? 'end' : 'middle'}
              height={isMobile ? 60 : 30}
            />
            <YAxis 
              domain={[0, 10]}
              stroke="var(--text-secondary)"
              style={{ fontSize: isMobile ? '10px' : '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="score" 
              stroke="#1a3a2e" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#moodGradient)" 
            />
          </AreaChart>
        ) : (
          <LineChart data={chartData} margin={{ 
            top: 10, 
            right: isMobile ? 10 : 30, 
            left: isMobile ? -20 : 0, 
            bottom: 0 
          }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
            <XAxis 
              dataKey="date" 
              stroke="var(--text-secondary)"
              style={{ fontSize: isMobile ? '10px' : '12px' }}
              angle={isMobile ? -45 : 0}
              textAnchor={isMobile ? 'end' : 'middle'}
              height={isMobile ? 60 : 30}
            />
            <YAxis 
              domain={[0, 10]}
              stroke="var(--text-secondary)"
              style={{ fontSize: isMobile ? '10px' : '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="#1a3a2e" 
              strokeWidth={3}
              dot={{ fill: '#1a3a2e', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}
