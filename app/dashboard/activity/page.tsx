'use client'

import TopBar from '../../components/shared/TopBar'
import SideNav from '../../components/shared/SideNav'

export default function ActivityPage() {
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
      {/* Blank Activity Page */}
    </div>
  )
}
