'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import TopBar from '../components/shared/TopBar'
import SideNav from '../components/shared/SideNav'

export default function DashboardPage() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname === '/dashboard' || pathname === '/dashboard/') {
      document.body.classList.add('blank-dashboard-active')
    }
    return () => {
      document.body.classList.remove('blank-dashboard-active')
    }
  }, [pathname])

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: '#fdfdef',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <TopBar />
      <SideNav />
    </div>
  )
}
