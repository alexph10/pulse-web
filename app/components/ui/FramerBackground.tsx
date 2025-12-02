"use client"

import { useEffect, useState } from 'react'
import styles from './FramerBackground.module.css'

interface Props {
  src?: string
}

export default function FramerBackground({ src = 'https://framer.com/m/AnimatedPrism-prod-23la' }: Props) {
  const [currentSrc, setCurrentSrc] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  // Candidate URL variants to try (some Framer projects use /m/, /share/ or /embed/)
  const makeVariants = (base: string) => {
    try {
      const url = new URL(base)
      const path = url.pathname
      const host = url.origin
      const name = path.replace(/\/$/, '')
      const variants = [
        `${host}${name}?embed=1`,
        `${host}${name}&embed=1`,
        `${host}/share${name.replace(/^\//, '')}?embed=1`,
        `${host}/embed${name.replace(/^\//, '')}`,
        base,
      ]
      // Deduplicate
      return Array.from(new Set(variants))
    } catch (e) {
      return [base]
    }
  }

  useEffect(() => {
    if (!src) return
    setAttempt(0)
    setLoaded(false)
    setFailed(false)
    const variants = makeVariants(src)
    setCurrentSrc(variants[0])

    let idx = 0
    let timer: number | undefined

    const tryNext = () => {
      idx += 1
      if (idx >= variants.length) {
        setFailed(true)
        setCurrentSrc(null)
        return
      }
      setAttempt(idx)
      setCurrentSrc(variants[idx])
      timer = window.setTimeout(() => tryNext(), 2500)
    }

    // Start fallback timer for first attempt
    timer = window.setTimeout(() => tryNext(), 3000)

    return () => {
      if (timer) window.clearTimeout(timer)
    }
  }, [src])

  // iframe load handler
  const onLoad = () => {
    setLoaded(true)
    setFailed(false)
  }

  const onError = () => {
    // mark failed so we show the local fallback
    setFailed(true)
    setCurrentSrc(null)
  }

  // Show fallback UI if none of the variants loaded
  if (failed) {
    return (
      <div className={styles.container} aria-hidden="true">
        <div className={styles.fallback} />
        <div className={styles.tint} />
      </div>
    )
  }

  return (
    <div className={styles.container} aria-hidden="true">
      {currentSrc && (
        <iframe
          className={styles.iframe}
          src={currentSrc}
          title="Framer Background"
          frameBorder="0"
          onLoad={onLoad}
          onError={onError}
          style={{ visibility: loaded ? 'visible' : 'hidden' }}
          allow="autoplay; fullscreen; accelerometer; gyroscope; picture-in-picture"
        />
      )}
      {/* Tint overlay using project palette to integrate the Framer scene visually */}
      <div className={styles.tint} />
    </div>
  )
}
