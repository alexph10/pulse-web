/**
 * Blank starting page - 2560x1440 resolution
 * Light theme with light green background
 * All components and features remain intact in the codebase
 */

'use client'

import { useEffect } from 'react'
import styles from './page.module.css'

export default function BlankPage() {
  useEffect(() => {
    // Hide global components on blank page
    document.body.classList.add('blank-page-active')
    return () => {
      document.body.classList.remove('blank-page-active')
    }
  }, [])

  return (
    <div className={styles.blankContainer}>
      {/* Blank canvas - ready for new design */}
    </div>
  )
}

