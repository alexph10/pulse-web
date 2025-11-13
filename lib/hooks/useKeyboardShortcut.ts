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
  key: string,
  callback: () => void,
  options: KeyboardShortcutOptions = {}
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
  }, [key, callback, options])
}

