'use client'

interface DashboardLayoutProps {
  children: React.ReactNode
  isLoading?: boolean
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen p-8" style={{
      background: 'var(--background)'
    }}>
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  )
}
