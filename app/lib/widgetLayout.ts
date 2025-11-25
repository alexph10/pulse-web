export interface WidgetConfig {
  id: string
  type: string
  enabled: boolean
  size: 'small' | 'medium' | 'large' | 'full'
  order: number
  gridSpan?: string // Optional manual grid span override
  minWidth?: string // Optional min width override
}

export const DEFAULT_WIDGET_LAYOUT: WidgetConfig[] = [
  // Stat Cards
  { id: 'stat-total-entries', type: 'StatCard', enabled: true, size: 'small', order: 0 },
  { id: 'stat-streak', type: 'StatCard', enabled: true, size: 'small', order: 1 },
  { id: 'stat-mood', type: 'StatCard', enabled: true, size: 'small', order: 2 },
  
  // Mood Heatmap
  { id: 'mood-heatmap', type: 'MoodHeatmap', enabled: true, size: 'full', order: 3 },
  
  // Metric Grid
  { id: 'metric-grid', type: 'MetricGrid', enabled: true, size: 'full', order: 4 },
  
  // Row 1
  { id: 'weekly-summary', type: 'WeeklySummary', enabled: true, size: 'medium', order: 5 },
  { id: 'quick-actions', type: 'QuickActions', enabled: true, size: 'medium', order: 6 },
  { id: 'category-breakdown', type: 'CategoryBreakdown', enabled: true, size: 'medium', order: 7 },
  
  // Row 2
  { id: 'recent-entries', type: 'RecentEntries', enabled: true, size: 'medium', order: 8 },
  { id: 'active-goals', type: 'ActiveGoals', enabled: true, size: 'medium', order: 9 },
  
  // Mood Trend
  { id: 'mood-trend', type: 'MoodTrend', enabled: true, size: 'full', order: 10 },
  
  // Row 3
  { id: 'time-of-day-heatmap', type: 'TimeOfDayHeatmap', enabled: true, size: 'medium', order: 11 },
  { id: 'pattern-detection', type: 'PatternDetection', enabled: true, size: 'medium', order: 12 },
  
  // Monthly Review
  { id: 'monthly-review', type: 'MonthlyReview', enabled: true, size: 'full', order: 13 },
  
  // Row 4
  { id: 'bar-chart', type: 'BarChart', enabled: true, size: 'medium', order: 14 },
  { id: 'distribution-chart', type: 'DistributionChart', enabled: true, size: 'medium', order: 15 },
  
  // Row 5
  { id: 'correlation-chart', type: 'CorrelationChart', enabled: true, size: 'medium', order: 16 },
  { id: 'stacked-area-chart', type: 'StackedAreaChart', enabled: true, size: 'medium', order: 17 },
  
  // Row 6
  { id: 'comparison-card', type: 'ComparisonCard', enabled: true, size: 'medium', order: 18 },
  { id: 'goal-tracker', type: 'GoalTracker', enabled: true, size: 'medium', order: 19 },
  
  // Row 7
  { id: 'timeline', type: 'Timeline', enabled: true, size: 'medium', order: 20 },
  { id: 'tag-cloud', type: 'TagCloud', enabled: true, size: 'medium', order: 21 },
  
  // Focus Time
  { id: 'focus-time', type: 'FocusTime', enabled: true, size: 'full', order: 22 },
  
  // Row 8
  { id: 'streak-calendar', type: 'StreakCalendar', enabled: true, size: 'medium', order: 23 },
  { id: 'insights-card', type: 'InsightsCard', enabled: true, size: 'medium', order: 24 },
  
  // Signature Card
  { id: 'signature-card', type: 'SignatureCard', enabled: true, size: 'full', order: 25 },
]

export const WIDGET_SIZE_CLASSES = {
  small: {
    minWidth: '280px',
    gridSpan: 'auto',
  },
  medium: {
    minWidth: '320px',
    gridSpan: 'auto',
  },
  large: {
    minWidth: '400px',
    gridSpan: 'auto',
  },
  full: {
    minWidth: '100%',
    gridSpan: '1 / -1',
  },
}

export function saveWidgetLayout(layout: WidgetConfig[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('pulse-dashboard-layout', JSON.stringify(layout))
  }
}

export function loadWidgetLayout(): WidgetConfig[] | null {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('pulse-dashboard-layout')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse saved layout:', e)
        return null
      }
    }
  }
  return null
}

export function resetWidgetLayout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('pulse-dashboard-layout')
  }
}
