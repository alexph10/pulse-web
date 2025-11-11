'use client'

import DashboardNavbar from '../dashboard-navbar/dashboard-navbar'

interface DashboardLayoutProps {
  children: React.ReactNode
  isLoading?: boolean
}

export default function DashboardLayout({ children, isLoading = false }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen p-8" style={{
      background: 'var(--background)'
    }}>
      <DashboardNavbar isLoading={isLoading} />
      <div className="max-w-7xl mx-auto mt-16">
        {children}
      </div>
    </div>
  )
}
