import { useEffect, useRef } from 'react'
import { saveDraft, clearDraft } from '@/lib/storage/draftStorage'

interface UseAutoSaveOptions {
  key: string
  data: unknown
  enabled?: boolean
  intervalMs?: number
  onSave?: (data: unknown) => void
}

/**
 * Hook to auto-save data to localStorage
 */
export function useAutoSave({
  key,
  data,
  enabled = true,
  intervalMs = 30000, // 30 seconds
  onSave,
}: UseAutoSaveOptions) {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const lastSavedRef = useRef<unknown>(null)

  useEffect(() => {
    if (!enabled || !data) return

    // Don't save if data hasn't changed
    if (JSON.stringify(data) === JSON.stringify(lastSavedRef.current)) {
      return
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      const content = typeof data === 'string' ? data : JSON.stringify(data)
      saveDraft(key, content)
      lastSavedRef.current = data
      
      if (onSave) {
        onSave(data)
      }
    }, intervalMs)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [key, data, enabled, intervalMs, onSave])

  // Clear draft when component unmounts (optional - can be called manually)
  const clear = () => {
    clearDraft(key)
    lastSavedRef.current = null
  }

  return { clear }
}

