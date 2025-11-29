/**
 * Blank dashboard page - 2560x1440 resolution
 * Light theme with light green background
 * All components and features remain intact in the codebase
 */

'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import TopBar from '../../components/shared/TopBar'
import SideNav from '../../components/shared/SideNav'
import styles from './page.module.css'

export default function BlankDashboardPage() {
  const pathname = usePathname()

  // Add class immediately before component mounts
  if (typeof document !== 'undefined') {
    document.body.classList.add('blank-dashboard-active')
  }

  useEffect(() => {
    // Mark dashboard as blank for styling
    if (pathname === '/dashboard' || pathname === '/dashboard/') {
      document.body.classList.add('blank-dashboard-active')
    }
    return () => {
      document.body.classList.remove('blank-dashboard-active')
    }
  }, [pathname])

  return (
    <div className={styles.blankContainer}>
      <TopBar />
      <SideNav />
    </div>
  )
}

