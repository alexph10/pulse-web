import { useEffect } from 'react'

interface KeyboardShortcutOptions {
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
  preventDefault?: boolean
  stopPropagation?: boolean
}

/**
 * Hook to handle keyboard shortcuts
 * @param key - The key to listen for (e.g., 'k', 'Enter', 'Escape')
 * @param callback - Function to call when shortcut is pressed
 * @param options - Additional options for modifier keys
 */
export function useKeyboardShortcut(
  key: string | undefined,
  callback: () => void,
  options: KeyboardShortcutOptions = {}
) {
  useEffect(() => {
    // Don't set up listener if key is undefined
    if (!key) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Safety check for e.key
      if (!e.key || !key) return
      
      const keyMatch = e.key.toLowerCase() === key.toLowerCase()
      const ctrlMatch = !options.ctrl || e.ctrlKey || e.metaKey
      const shiftMatch = !options.shift || e.shiftKey
      const altMatch = !options.alt || e.altKey
      const metaMatch = !options.meta || e.metaKey

      if (keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch) {
        if (options.preventDefault) {
          e.preventDefault()
        }
        if (options.stopPropagation) {
          e.stopPropagation()
        }
        callback()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [key, callback, options.ctrl, options.shift, options.alt, options.meta, options.preventDefault, options.stopPropagation])
}

