'use client'

import { useState, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import SignatureCard from '../components/signature-card/signature-card'
import StatCard from '../components/analytics/StatCard'
import ProgressRing from '../components/ui/ProgressRing'
import MoodHeatmap from '../components/analytics/MoodHeatmap'
import MetricGrid from '../components/ui/MetricGrid'
import WeeklySummary from '../components/analytics/WeeklySummary'
import RecentEntries from '../components/analytics/RecentEntries'
import ActiveGoals from '../components/analytics/ActiveGoals'
import QuickActions from '../components/analytics/QuickActions'
import CategoryBreakdown from '../components/analytics/CategoryBreakdown'
import MoodTrend from '../components/analytics/MoodTrend'
import StreakCalendar from '../components/analytics/StreakCalendar'
import InsightsCard from '../components/analytics/InsightsCard'
import TimeOfDayHeatmap from '../components/analytics/TimeOfDayHeatmap'
import PatternDetection from '../components/analytics/PatternDetection'
import MonthlyReview from '../components/analytics/MonthlyReview'
import BarChart from '../components/analytics/BarChart'
import DistributionChart from '../components/analytics/DistributionChart'
import CorrelationChart from '../components/analytics/CorrelationChart'
import StackedAreaChart from '../components/analytics/StackedAreaChart'
import ComparisonCard from '../components/analytics/ComparisonCard'
import Timeline from '../components/analytics/Timeline'
import TagCloud from '../components/analytics/TagCloud'
import GoalTracker from '../components/analytics/GoalTracker'
import FocusTime from '../components/analytics/FocusTime'
import SortableWidget from '../components/ui/SortableWidget'
import { Calendar, Flame, Heart } from '@phosphor-icons/react'
import { useDashboardData } from '../hooks/useDashboardData'
import { DEFAULT_WIDGET_LAYOUT, loadWidgetLayout, saveWidgetLayout, WidgetConfig } from '../lib/widgetLayout'
import { gridSystem, getGridSpan } from '../lib/gridSystem'
import styles from './page.module.css'

export default function DashboardPage() {
  const { stats, loading, error } = useDashboardData()
  const [widgetLayout, setWidgetLayout] = useState<WidgetConfig[]>(DEFAULT_WIDGET_LAYOUT)

  // Load saved layout on mount
  useEffect(() => {
    const savedLayout = loadWidgetLayout()
    if (savedLayout) {
      setWidgetLayout(savedLayout)
    }
  }, [])

  // Setup drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setWidgetLayout((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        
        const newLayout = arrayMove(items, oldIndex, newIndex).map((item, index) => ({
          ...item,
          order: index,
        }))
        
        saveWidgetLayout(newLayout)
        return newLayout
      })
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          color: '#a39d96',
          fontSize: '14px',
          fontFamily: 'var(--font-family-satoshi)',
        }}>
          Loading dashboard...
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className={styles.container}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          color: '#a39d96',
          fontSize: '14px',
          fontFamily: 'var(--font-family-satoshi)',
        }}>
          {error || 'Failed to load dashboard data'}
        </div>
      </div>
    )
  }

  const metrics = [
    { label: 'Total Entries', value: stats.totalEntries.toString(), sublabel: 'last 90 days' },
    { label: 'Avg Mood', value: stats.averageMood.toFixed(1), sublabel: 'out of 10' },
    { label: 'Current Streak', value: stats.currentStreak.toString(), sublabel: 'days' },
  ]

  // Render widget based on type
  const renderWidget = (widget: WidgetConfig) => {
    if (!widget.enabled) return null

    switch (widget.type) {
      case 'StatCard':
        if (widget.id === 'stat-total-entries') {
          return (
            <StatCard
              title="Total Entries"
              value={stats.totalEntries.toString()}
              subtitle="last 90 days"
              icon={<Calendar size={20} weight="regular" />}
            />
          )
        }
        if (widget.id === 'stat-streak') {
          return (
            <StatCard
              title="Current Streak"
              value={`${stats.currentStreak} days`}
              subtitle="keep it going"
              icon={<Flame size={20} weight="regular" />}
            />
          )
        }
        if (widget.id === 'stat-mood') {
          return (
            <StatCard
              title="Average Mood"
              value={`${stats.averageMood.toFixed(1)}/10`}
              subtitle="last 90 days"
              icon={<Heart size={20} weight="regular" />}
            />
          )
        }
        return null

      case 'MoodHeatmap':
        return (
          <div style={{
            background: '#252c2c',
            border: 'none',
            padding: '20px',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '24px',
            }}>
              <div>
                <h3 style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#e4ddd3',
                  fontFamily: 'var(--font-family-satoshi)',
                  marginBottom: '2px',
                  letterSpacing: '-0.01em'
                }}>
                  Activity Overview
                </h3>
                <p style={{
                  fontSize: '10px',
                  color: '#a39d96',
                  fontFamily: 'var(--font-family-satoshi)',
                }}>
                  Last 12 weeks
                </p>
              </div>
              <ProgressRing progress={stats.completionRate} size="md" />
            </div>
            <MoodHeatmap data={stats.recentMood} weeks={12} />
          </div>
        )

      case 'MetricGrid':
        return <MetricGrid metrics={metrics} columns={3} />

      case 'WeeklySummary':
        return <WeeklySummary />

      case 'QuickActions':
        return <QuickActions />

      case 'CategoryBreakdown':
        return <CategoryBreakdown />

      case 'RecentEntries':
        return <RecentEntries />

      case 'ActiveGoals':
        return <ActiveGoals />

      case 'MoodTrend':
        return <MoodTrend />

      case 'TimeOfDayHeatmap':
        return <TimeOfDayHeatmap />

      case 'PatternDetection':
        return <PatternDetection />

      case 'MonthlyReview':
        return <MonthlyReview />

      case 'BarChart':
        return (
          <BarChart 
            data={[
              { label: 'Mon', value: 5, color: '#2d5a3d' },
              { label: 'Tue', value: 8, color: '#2d5a3d' },
              { label: 'Wed', value: 6, color: '#2d5a3d' },
              { label: 'Thu', value: 9, color: '#2d5a3d' },
              { label: 'Fri', value: 7, color: '#2d5a3d' },
              { label: 'Sat', value: 3, color: '#2d5a3d' },
              { label: 'Sun', value: 2, color: '#2d5a3d' },
            ]}
            title="Entries by Day"
            subtitle="This week"
          />
        )

      case 'DistributionChart':
        return <DistributionChart />

      case 'CorrelationChart':
        return <CorrelationChart />

      case 'StackedAreaChart':
        return <StackedAreaChart />

      case 'ComparisonCard':
        return <ComparisonCard />

      case 'GoalTracker':
        return <GoalTracker />

      case 'Timeline':
        return <Timeline />

      case 'TagCloud':
        return <TagCloud />

      case 'FocusTime':
        return <FocusTime />

      case 'StreakCalendar':
        return <StreakCalendar />

      case 'InsightsCard':
        return <InsightsCard />

      case 'SignatureCard':
        return <SignatureCard />

      default:
        return null
    }
  }

  // Group widgets by size for layout
  const getGridColumns = (size: WidgetConfig['size']) => {
    switch (size) {
      case 'small':
        return 'repeat(auto-fit, minmax(240px, 1fr))'
      case 'medium':
        return 'repeat(auto-fit, minmax(300px, 1fr))'
      case 'large':
        return 'repeat(auto-fit, minmax(400px, 1fr))'
      case 'full':
        return '1fr'
      default:
        return 'repeat(auto-fit, minmax(300px, 1fr))'
    }
  }

  return (
    <div className={styles.container}>
      {/* Dashboard Header */}
      <div style={{
        marginBottom: gridSystem.gaps.lg,
      }}>
        <h2 style={{
          fontSize: '15px',
          fontWeight: '600',
          color: '#e4ddd3',
          fontFamily: 'var(--font-family-satoshi)',
          letterSpacing: '-0.01em',
          marginBottom: '4px',
        }}>
          Dashboard Analytics
        </h2>
        <p style={{
          fontSize: '11px',
          color: '#a39d96',
          fontFamily: 'var(--font-family-satoshi)',
        }}>
          Hover over any widget to drag and rearrange
        </p>
      </div>

      {/* Dashboard Widgets */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={widgetLayout.map(w => w.id)}
          strategy={rectSortingStrategy}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
            gap: '16px',
            width: '100%',
          }}>
            {widgetLayout
              .filter(widget => widget.enabled)
              .sort((a, b) => a.order - b.order)
              .map((widget) => (
                <SortableWidget
                  key={widget.id}
                  id={widget.id}
                >
                  <div style={{
                    gridColumn: widget.size === 'full' ? '1 / -1' : 'auto',
                  }}>
                    {renderWidget(widget)}
                  </div>
                </SortableWidget>
              ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
