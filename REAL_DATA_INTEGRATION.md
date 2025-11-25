# Real Data Integration & Signature Card Color Scheme

## Overview
Updated all dashboard components to use real data from the `/api/activity` endpoint and applied the signature card color scheme for visual consistency.

## Color Scheme Applied

### Signature Card Colors
- **Background**: `#252c2c` (charcoal gray)
- **Primary Text**: `#e4ddd3` (warm cream)
- **Secondary Text**: `#a39d96` (muted tan)
- **Borders**: `rgba(228, 221, 211, 0.12)` (12% opacity cream)

### Category Colors (from signature card)
- **Journal Green**: `#2d5a3d`
- **Goals Orange**: `#d4774a`
- **Checkins Gray**: `#8a9199`

## Components Updated

### 1. StatCard (`app/components/analytics/StatCard.tsx`)
**Color Changes:**
- Background: `#252c2c` (was `var(--surface)`)
- Title text: `#a39d96` (was `var(--text-tertiary)`)
- Value text: `#e4ddd3` (was `var(--text-primary)`)
- Subtitle text: `#a39d96` (was `var(--text-secondary)`)
- Icon color: `#a39d96`
- Removed border and box-shadow

**Usage:**
```tsx
<StatCard
  title="Total Entries"
  value={stats.totalEntries.toString()}
  subtitle="last 90 days"
  icon={<Calendar size={20} weight="regular" />}
/>
```

### 2. ProgressRing (`app/components/ui/ProgressRing.tsx`)
**Color Changes:**
- Background circle stroke: `rgba(228, 221, 211, 0.12)` (was `var(--border-base)`)
- Progress circle: `#2d5a3d` (journal green)
- Center label: `#e4ddd3` (was `var(--text-primary)`)
- Sublabel: `#a39d96` (was `var(--text-tertiary)`)

**Usage:**
```tsx
<ProgressRing progress={stats.completionRate} size="md" />
```

### 3. MoodHeatmap (`app/components/analytics/MoodHeatmap.tsx`)
**Color Changes:**
- Empty cells: `rgba(228, 221, 211, 0.08)` (8% opacity cream)
- Cell color intensity: Uses `#2d5a3d` (journal green) with intensity based on score
- Cell borders: `rgba(228, 221, 211, 0.12)`
- Month labels: `#a39d96`
- Day labels: `#a39d96`

**Data Structure:**
- Now accepts both `Date` objects and `YYYY-MM-DD` strings
- Score range: 0-10
- Color gradient: From 30% opacity at score 0 to 100% opacity at score 10

**Usage:**
```tsx
<MoodHeatmap
  data={stats.recentMood}
  weeks={12}
/>
```

### 4. MetricGrid (`app/components/ui/MetricGrid.tsx`)
**Color Changes:**
- Cell background: `#252c2c`
- Grid gap background: `rgba(228, 221, 211, 0.12)` (for borders)
- Label text: `#a39d96`
- Value text: `#e4ddd3`
- Sublabel text: `#a39d96`
- Removed external border

**Usage:**
```tsx
<MetricGrid metrics={[
  { label: 'Total Entries', value: '142', sublabel: 'last 90 days' },
  { label: 'Avg Mood', value: '7.8', sublabel: 'out of 10' },
  { label: 'Current Streak', value: '12', sublabel: 'days' },
]} columns={3} />
```

## Data Integration

### New Hook: `useDashboardData`
**Location:** `app/hooks/useDashboardData.ts`

**Features:**
- Fetches data from `/api/activity` endpoint
- Uses `useAuth()` context for user ID
- Analyzes last 90 days of activity
- Returns loading and error states

**Data Structure:**
```typescript
interface DashboardStats {
  totalEntries: number        // Total journal + goals entries
  currentStreak: number        // Days with at least 1 journal entry
  averageMood: number          // Average mood score (0-10)
  completionRate: number       // Percentage of days completed
  recentMood: Array<{          // Last 12 weeks of mood data
    date: Date
    score: number
  }>
}
```

**Calculations:**
- **Total Entries**: Sum of `journalCount + goalsCount` over 90 days
- **Current Streak**: Consecutive days with `journalCount > 0` starting from today
- **Average Mood**: Mean of all `moodScore` values where defined
- **Completion Rate**: `(days with journalCount > 0 / 90) * 100`
- **Recent Mood**: Last 84 days (12 weeks) with mood scores for heatmap

### Dashboard Page Updates
**Location:** `app/dashboard/page.tsx`

**Changes:**
1. Added `useDashboardData()` hook
2. Added loading state UI
3. Added error state UI
4. Replaced all hardcoded values with real data
5. Updated Activity Overview card background to `#252c2c`
6. Updated all text colors to match signature card

**Loading State:**
```tsx
if (loading) {
  return <div>Loading dashboard...</div>
}
```

**Error State:**
```tsx
if (error || !stats) {
  return <div>{error || 'Failed to load dashboard data'}</div>
}
```

## API Endpoint Requirements

### `/api/activity` Response Format
```typescript
{
  activities: {
    "2025-01-15": {
      journalCount: 2,
      goalsCount: 3,
      moodScore?: 7.5  // Optional mood score (0-10)
    },
    "2025-01-14": {
      journalCount: 1,
      goalsCount: 2,
      moodScore?: 8.2
    },
    // ... more dates
  }
}
```

**Required Fields:**
- `journalCount`: Number of journal entries for that date
- `goalsCount`: Number of goals completed for that date

**Optional Fields:**
- `moodScore`: Mood score from 0-10 (used for heatmap)

## Typography Consistency

All components now use consistent typography from signature card:

- **Labels**: 11px, `#a39d96`, regular weight, -0.01em letter-spacing
- **Values**: 24-40px (depending on context), `#e4ddd3`, 600 weight, -0.02em letter-spacing
- **Sublabels**: 11px, `#a39d96`, regular weight
- **Headings**: 16px, `#e4ddd3`, 600 weight, -0.01em letter-spacing

## Design System Notes

### Key Differences from Original Dark Theme
- **Background**: Now using `#252c2c` (charcoal) instead of `#000000` (true black)
- **Text Colors**: Warm cream palette (`#e4ddd3`, `#a39d96`) instead of pure whites/grays
- **Borders**: Very subtle cream-tinted borders instead of pure white with opacity
- **Accent**: Journal green (`#2d5a3d`) for primary accent instead of brand red

### Signature Card Aesthetic
- **No borders**: Cards blend into background with subtle shadows
- **Minimal spacing**: Tighter gaps between elements
- **Data-first**: Large prominent numbers, minimal labels
- **Muted palette**: Warm, low-contrast colors for comfortable extended viewing

## Next Steps

### Potential Enhancements
1. **Add skeleton loaders** during data fetching
2. **Implement refresh mechanism** for manual data updates
3. **Add error retry UI** with "Try Again" button
4. **Enhance mood tracking** with mood type labels (joyful, calm, etc.)
5. **Add streak history** to show longest streak vs current
6. **Implement date range selector** for flexible analysis periods

### Additional Metrics to Consider
- **Completion trends**: Week-over-week comparison
- **Best performing times**: Time of day analysis
- **Category breakdown**: Percentage by activity type
- **Consistency score**: Distribution of activities across days

## Testing Checklist

- [ ] Verify `/api/activity` returns expected data structure
- [ ] Test loading state appears during data fetch
- [ ] Test error state appears on API failure
- [ ] Verify all colors match signature card
- [ ] Test with no data (empty activities object)
- [ ] Test with partial data (some missing mood scores)
- [ ] Test streak calculation with gaps in data
- [ ] Test heatmap displays 12 weeks correctly
- [ ] Test mobile responsiveness
- [ ] Verify authentication context works

## Files Modified

1. `app/components/analytics/StatCard.tsx` - Applied colors
2. `app/components/ui/ProgressRing.tsx` - Applied colors
3. `app/components/analytics/MoodHeatmap.tsx` - Applied colors, fixed date type
4. `app/components/ui/MetricGrid.tsx` - Applied colors
5. `app/hooks/useDashboardData.ts` - Created new hook
6. `app/dashboard/page.tsx` - Integrated real data

## Dependencies
- `date-fns`: Date manipulation (subDays, format, parseISO)
- `@phosphor-icons/react`: Icons (Calendar, Flame, Heart)
- `contexts/AuthContext`: User authentication

---

**Last Updated**: January 2025
**Status**: ✅ Complete - All components using real data with signature card colors
