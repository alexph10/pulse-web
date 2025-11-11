import { useState } from 'react'
import { startOfDay, endOfDay, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'

export type DateRangePreset = 'today' | 'week' | 'month' | 'custom' | 'all'

export interface DateRange {
  start: Date
  end: Date
}

export function useDateRange(initialPreset: DateRangePreset = 'month') {
  const [preset, setPreset] = useState<DateRangePreset>(initialPreset)
  const [customRange, setCustomRange] = useState<DateRange | null>(null)

  const getDateRange = (): DateRange | null => {
    const now = new Date()

    switch (preset) {
      case 'today':
        return {
          start: startOfDay(now),
          end: endOfDay(now)
        }
      
      case 'week':
        return {
          start: startOfWeek(now),
          end: endOfWeek(now)
        }
      
      case 'month':
        return {
          start: startOfMonth(now),
          end: endOfMonth(now)
        }
      
      case 'custom':
        return customRange
      
      case 'all':
        return null
      
      default:
        return null
    }
  }

  const setDateRangePreset = (newPreset: DateRangePreset) => {
    setPreset(newPreset)
    if (newPreset !== 'custom') {
      setCustomRange(null)
    }
  }

  const setCustomDateRange = (range: DateRange) => {
    setCustomRange(range)
    setPreset('custom')
  }

  return {
    preset,
    dateRange: getDateRange(),
    setPreset: setDateRangePreset,
    setCustomRange: setCustomDateRange
  }
}
