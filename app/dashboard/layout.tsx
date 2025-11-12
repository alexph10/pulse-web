'use client'

import { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar/sidebar';
import SubmoduleNav from '../components/submodule-nav/submodule-nav';
import '../globals.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  // Listen for sidebar state changes
  useEffect(() => {
    const handleSidebarToggle = (e: CustomEvent) => {
      setIsSidebarExpanded(e.detail.isExpanded);
    };

    window.addEventListener('sidebarToggle' as any, handleSidebarToggle);
    return () => {
      window.removeEventListener('sidebarToggle' as any, handleSidebarToggle);
    };
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar onToggle={setIsSidebarExpanded} />
      <main 
        style={{ 
          flex: 1,
          marginLeft: isSidebarExpanded ? '184px' : '55px', /* 240px * 0.85 * 0.9, 72px * 0.85 * 0.9 */
          width: isSidebarExpanded ? 'calc(100% - 184px)' : 'calc(100% - 55px)',
          minHeight: '100vh',
          background: 'var(--background)',
          transition: 'margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1), width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
        }}
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
            maxWidth: isSidebarExpanded ? '100%' : '1070px', /* 1400px * 0.85 * 0.9 ≈ 1070px */
            padding: '0',
          }}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
