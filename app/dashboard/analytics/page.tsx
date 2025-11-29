'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/AuthContext'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import MoodTrendChart from '../../components/analytics/MoodTrendChart'
import MoodDistribution from '../../components/analytics/MoodDistribution'
import JournalStreak from '../../components/analytics/JournalStreak'
import StatCard from '../../components/analytics/StatCard'
import DateRangePicker from '../../components/analytics/DateRangePicker'
import ExportButton from '../../components/analytics/ExportButton'
import EmptyState from '../../components/shared/EmptyState'
import { useDateRange } from '../../hooks/useDateRange'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { exportAnalyticsToPDF } from '../../utils/pdfExport'
import { isWithinInterval } from 'date-fns'

interface JournalEntry {
  id: string
  transcript: string
  primary_mood: string
  mood_score: number
  emotions: string[]
  sentiment: string
  insight: string
  created_at: string
}

export default function AnalyticsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const { preset, dateRange, setPreset, setCustomRange } = useDateRange('month')
  const isMobile = useMediaQuery('(max-width: 767px)')
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)')

  useEffect(() => {
    if (user) {
      fetchEntries()
    }
  }, [user])

  const fetchEntries = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/journal?userId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        const sortedEntries = Array.isArray(data) ? data.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ) : []
        
        setEntries(sortedEntries)
      }
    } catch (error) {
      console.error('Error fetching entries:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter entries by date range
  const filteredEntries = entries.filter(entry => {
    if (!dateRange) return true
    
    const entryDate = new Date(entry.created_at)
    return isWithinInterval(entryDate, { start: dateRange.start, end: dateRange.end })
  })

  // Calculate statistics
  const calculateStats = () => {
    if (filteredEntries.length === 0) return null

    const avgMood = filteredEntries.reduce((sum, e) => sum + e.mood_score, 0) / filteredEntries.length
    const moodCounts = filteredEntries.reduce((acc, e) => {
      acc[e.primary_mood] = (acc[e.primary_mood] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]
    
    // Calculate streak
    const sortedByDate = [...filteredEntries].sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
    
    let currentStreak = 0
    let maxStreak = 0
    let lastDate: Date | null = null
    
    sortedByDate.forEach(entry => {
      const entryDate = new Date(entry.created_at)
      entryDate.setHours(0, 0, 0, 0)
      
      if (!lastDate) {
        currentStreak = 1
        maxStreak = 1
      } else {
        const daysDiff = Math.floor((entryDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
        if (daysDiff === 1) {
          currentStreak++
          maxStreak = Math.max(maxStreak, currentStreak)
        } else if (daysDiff > 1) {
          currentStreak = 1
        }
      }
      lastDate = entryDate
    })

    // Check if streak is still active
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const lastEntryDate = lastDate ? new Date(lastDate) : null
    if (lastEntryDate) {
      const daysSinceLastEntry = Math.floor((today.getTime() - lastEntryDate.getTime()) / (1000 * 60 * 60 * 24))
      if (daysSinceLastEntry > 1) {
        currentStreak = 0
      }
    }

    return {
      avgMood: avgMood.toFixed(1),
      totalEntries: filteredEntries.length,
      topMood: topMood ? topMood[0] : 'N/A',
      currentStreak,
      maxStreak,
      moodDistribution: Object.entries(moodCounts).map(([mood, count]) => ({
        mood,
        count
      }))
    }
  }

  // Prepare data for heatmap
  const getHeatmapData = () => {
    const dateCounts: Record<string, number> = {}
    entries.forEach(entry => {
      const date = new Date(entry.created_at).toISOString().split('T')[0]
      dateCounts[date] = (dateCounts[date] || 0) + 1
    })
    return Object.entries(dateCounts).map(([date, count]) => ({ date, count }))
  }

  const stats = calculateStats()

  const handleExportPDF = async () => {
    await exportAnalyticsToPDF('analytics-content', {
      dateRange,
      stats: stats ? {
        totalEntries: stats.totalEntries,
        avgMood: parseFloat(stats.avgMood),
        topMood: stats.topMood,
        currentStreak: stats.currentStreak
      } : undefined
    })
  }

  return (
    <DashboardLayout isLoading={loading}>
      {/* Main Content */}
      <div style={{
        padding: isMobile ? '20px' : '32px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          marginBottom: '32px',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          justifyContent: 'space-between',
          gap: isMobile ? '16px' : '0'
        }}>
          <div>
            <h1 style={{
              fontSize: isMobile ? '28px' : '36px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-family-satoshi)',
              marginBottom: '8px'
            }}>
              Analytics
            </h1>
            <p style={{
              fontSize: '15px',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-family-satoshi)'
            }}>
              Insights into your emotional journey
            </p>
          </div>

          <ExportButton
            onExport={handleExportPDF}
            disabled={!stats || loading}
          />
        </div>

        {/* Date Range Picker */}
        <div style={{ marginBottom: '32px' }}>
          <DateRangePicker
            preset={preset}
            onPresetChange={setPreset}
            customRange={dateRange}
            onCustomRangeChange={setCustomRange}
          />
        </div>

        {loading ? (
          <EmptyState
            title="Loading..."
            description="Fetching your analytics data"
            illustration="loading"
          />
        ) : !stats || filteredEntries.length === 0 ? (
          <EmptyState
            title="No entries found"
            description="Start journaling to see your analytics, or adjust your date range to include more entries."
            illustration="noEntries"
            action={{
              text: "Start Journaling",
              onClick: () => router.push('/dashboard/journal')
            }}
          />
        ) : (
          <div id="analytics-content">
            {/* Stats Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile 
                ? '1fr' 
                : isTablet 
                ? 'repeat(2, 1fr)' 
                : 'repeat(4, 1fr)',
              gap: isMobile ? '12px' : '16px',
              marginBottom: '24px'
            }}>
              <StatCard
                title="Total Entries"
                value={stats.totalEntries}
                subtitle="in selected period"
              />
              <StatCard
                title="Average Mood"
                value={`${stats.avgMood}/10`}
                subtitle="overall score"
              />
              <StatCard
                title="Top Mood"
                value={stats.topMood}
                subtitle="most frequent"
              />
              <StatCard
                title="Current Streak"
                value={`${stats.currentStreak} days`}
                subtitle={`best: ${stats.maxStreak} days`}
              />
            </div>

            {/* Charts Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: isMobile ? '16px' : '20px',
              marginBottom: '24px'
            }}>
              {/* Mood Trend */}
              <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: isMobile ? '16px' : '20px',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <h2 style={{
                  fontSize: isMobile ? '14px' : '16px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-family-satoshi)',
                  marginBottom: '16px'
                }}>
                  Mood Trend
                </h2>
                <MoodTrendChart 
                  data={filteredEntries.map(e => ({
                    date: e.created_at,
                    mood_score: e.mood_score,
                    primary_mood: e.primary_mood
                  }))}
                  type="area"
                />
              </div>

              {/* Mood Distribution */}
              <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: isMobile ? '16px' : '20px',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <h2 style={{
                  fontSize: isMobile ? '14px' : '16px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-family-satoshi)',
                  marginBottom: '16px'
                }}>
                  Mood Distribution
                </h2>
                <MoodDistribution data={stats.moodDistribution} />
              </div>

              {/* Journal Streak Heatmap */}
              <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: isMobile ? '16px' : '20px',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <h2 style={{
                  fontSize: isMobile ? '14px' : '16px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-family-satoshi)',
                  marginBottom: '16px'
                }}>
                  Journaling Activity
                </h2>
                <JournalStreak entries={getHeatmapData()} />
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
