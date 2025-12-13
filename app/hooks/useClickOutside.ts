'use client'

import { useEffect, RefObject } from 'react'

/**
 * Hook that handles click outside of the passed refs
 * @param refs - Array of refs to check against
 * @param handler - Callback when click outside is detected
 * @param enabled - Whether the hook is active (default: true)
 */
export function useClickOutside(
  refs: RefObject<HTMLElement | null>[],
  handler: () => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      
      // Check if click is inside any of the refs
      const isInside = refs.some(ref => ref.current?.contains(target))
      
      if (!isInside) {
        handler()
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        handler()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [refs, handler, enabled])
}

