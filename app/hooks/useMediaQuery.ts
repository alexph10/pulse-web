import { useState, useEffect } from 'react'

interface MediaQueryOptions {
  minWidth?: number
  maxWidth?: number
}

export function useMediaQuery(options: MediaQueryOptions): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const queries: string[] = []
    
    if (options.minWidth !== undefined) {
      queries.push(`(min-width: ${options.minWidth}px)`)
    }
    
    if (options.maxWidth !== undefined) {
      queries.push(`(max-width: ${options.maxWidth}px)`)
    }

    const mediaQuery = window.matchMedia(queries.join(' and '))
    
    setMatches(mediaQuery.matches)

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    mediaQuery.addEventListener('change', handler)

    return () => {
      mediaQuery.removeEventListener('change', handler)
    }
  }, [options.minWidth, options.maxWidth])

  return matches
}
