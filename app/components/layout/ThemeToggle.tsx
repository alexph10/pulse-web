'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SunIcon, MoonIcon } from '@radix-ui/react-icons'
import styles from './ThemeToggle.module.css'

interface ThemeToggleProps {
  isDarkMode: boolean
  onToggle: () => void
}

export default function ThemeToggle({ isDarkMode, onToggle }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent hydration mismatch by rendering a placeholder until mounted
  if (!mounted) {
    return (
      <button className={styles.themeToggle} aria-label="Toggle theme">
        <SunIcon />
      </button>
    )
  }

  return (
    <motion.button
      className={styles.themeToggle}
      onClick={onToggle}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {isDarkMode ? <SunIcon /> : <MoonIcon />}
    </motion.button>
  )
}
