'use client'

import { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar/sidebar';
import SubmoduleNav from '../components/submodule-nav/submodule-nav';
import { MobileNav } from '../components/mobile/MobileNav';
import { PageTransition } from '../components/transitions/PageTransition';
import '../globals.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true); // Start expanded

  // Sync sidebar state
  const handleSidebarToggle = (expanded: boolean) => {
    setIsSidebarExpanded(expanded);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar onToggle={handleSidebarToggle} />
      <main 
        style={{ 
          flex: 1,
          marginLeft: isSidebarExpanded ? '240px' : '48px',
          width: isSidebarExpanded ? 'calc(100% - 240px)' : 'calc(100% - 48px)',
          minHeight: '100vh',
          background: 'var(--background)',
          transition: 'margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1), width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          paddingBottom: '80px', /* Space for mobile nav */
        }}
        className="main-content"
      >
        <SubmoduleNav />
        <div style={{
          flex: 1,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}>
          <div style={{
            width: '100%',
            maxWidth: isSidebarExpanded ? '100%' : '1070px',
            padding: '0',
          }}>
            <PageTransition>
              {children}
            </PageTransition>
          </div>
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
