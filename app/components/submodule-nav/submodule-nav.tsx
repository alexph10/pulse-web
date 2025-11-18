'use client'

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  House, 
  Share,
  Gear,
  ChatCircle,
  Cursor,
  User,
  DeviceMobile,
  Laptop,
  Monitor,
  GridFour,
  ArrowsOut,
  MagnifyingGlassMinus,
  MagnifyingGlassPlus
} from '@phosphor-icons/react';
import styles from './submodule-nav.module.css';

interface SubmoduleNavProps {
  isLoading?: boolean;
}

interface Submodule {
  label: string;
  href: string;
}

interface SubmoduleConfig {
  [key: string]: Submodule[];
}

const submoduleConfig: SubmoduleConfig = {
  '/dashboard': [
    { label: 'Overview', href: '/dashboard' },
    { label: 'Activity', href: '/dashboard/activity' },
    { label: 'Quick Actions', href: '/dashboard/quick-actions' },
    { label: 'Insights', href: '/dashboard/insights' },
  ],
  '/dashboard/notes': [
    { label: 'All Notes', href: '/dashboard/notes' },
    { label: 'Quick Notes', href: '/dashboard/notes/quick' },
    { label: 'Tagged', href: '/dashboard/notes/tagged' },
    { label: 'Archived', href: '/dashboard/notes/archived' },
  ],
  '/dashboard/journal': [
    { label: 'New Entry', href: '/dashboard/journal' },
    { label: 'Timeline', href: '/dashboard/journal/timeline' },
    { label: 'Mood Tracker', href: '/dashboard/journal/mood' },
    { label: 'Memories', href: '/dashboard/journal/memories' },
  ],
  '/dashboard/goals': [
    { label: 'Active', href: '/dashboard/goals' },
    { label: 'Completed', href: '/dashboard/goals/completed' },
    { label: 'Templates', href: '/dashboard/goals/templates' },
    { label: 'Milestones', href: '/dashboard/goals/milestones' },
  ],
  '/dashboard/habits': [
    { label: 'Tracker', href: '/dashboard/habits' },
    { label: 'Calendar', href: '/dashboard/habits/calendar' },
    { label: 'Statistics', href: '/dashboard/habits/statistics' },
    { label: 'Streaks', href: '/dashboard/habits/streaks' },
  ],
  '/dashboard/reflections': [
    { label: 'Today', href: '/dashboard/reflections' },
    { label: 'History', href: '/dashboard/reflections/history' },
    { label: 'Patterns', href: '/dashboard/reflections/patterns' },
  ],
  '/dashboard/progress': [
    { label: 'Overview', href: '/dashboard/progress' },
    { label: 'Reports', href: '/dashboard/progress/reports' },
  ],
};

const SubmoduleNav: React.FC<SubmoduleNavProps> = ({ isLoading = false }) => {
  const pathname = usePathname();
  const [viewMode, setViewMode] = useState<'mobile' | 'tablet' | 'desktop'>('tablet');
  const [zoomLevel, setZoomLevel] = useState(100);

  // Find the base route for submodules
  const getBaseRoute = (path: string): string => {
    if (submoduleConfig[path]) return path;
    const sortedRoutes = Object.keys(submoduleConfig).sort((a, b) => b.length - a.length);
    for (const route of sortedRoutes) {
      if (path.startsWith(route)) {
        return route;
      }
    }
    return '/dashboard';
  };

  const baseRoute = getBaseRoute(pathname);
  const submodules = submoduleConfig[baseRoute] || [];

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 10, 50));
  };

  return (
    <div className={styles.navbarWrapper}>
      <div className={styles.navbar}>
        {/* Left Section - Primary Actions */}
        <div className={styles.leftSection}>
          <Link 
            href="/dashboard" 
            className={`${styles.iconButton} ${pathname === '/dashboard' ? styles.activeIcon : ''}`}
            title="Home"
            aria-label="Navigate to dashboard home"
            aria-current={pathname === '/dashboard' ? 'page' : undefined}
          >
            <House size={18} weight={pathname === '/dashboard' ? 'fill' : 'regular'} aria-hidden="true" />
          </Link>
          <button 
            className={styles.iconButton} 
            title="Share"
            aria-label="Share current page"
          >
            <Share size={18} weight="regular" aria-hidden="true" />
          </button>
          <button 
            className={styles.iconButton} 
            title="Settings"
            aria-label="Open settings"
          >
            <Gear size={18} weight="regular" aria-hidden="true" />
          </button>
          
          <div className={styles.separator} aria-hidden="true" />
          
          <Link
            href="/dashboard/notes"
            className={`${styles.iconButton} ${pathname.startsWith('/dashboard/notes') ? styles.activeIcon : ''}`}
            title="Notes"
            aria-label="View notes"
            aria-current={pathname.startsWith('/dashboard/notes') ? 'page' : undefined}
          >
            <ChatCircle size={18} weight={pathname.startsWith('/dashboard/notes') ? 'fill' : 'regular'} aria-hidden="true" />
          </Link>
          <button 
            className={styles.iconButton} 
            title="Select"
            aria-label="Selection tool"
          >
            <Cursor size={18} weight="regular" aria-hidden="true" />
          </button>
          
          <div className={styles.separator} aria-hidden="true" />
          
          <Link 
            href="/dashboard/profile" 
            className={`${styles.iconButton} ${pathname === '/dashboard/profile' ? styles.activeIcon : ''}`}
            title="Profile"
            aria-label="View profile"
            aria-current={pathname === '/dashboard/profile' ? 'page' : undefined}
          >
            <User size={18} weight={pathname === '/dashboard/profile' ? 'fill' : 'regular'} aria-hidden="true" />
          </Link>
        </div>

        {/* Center Section - Page Context Tabs */}
        {submodules.length > 0 && (() => {
          const activeHref = submodules.reduce<string | null>((best, current) => {
            const matchesExact = pathname === current.href;
            const matchesNested = pathname.startsWith(`${current.href}/`);
            if (!matchesExact && !matchesNested) return best;
            if (!best) return current.href;
            return current.href.length > best.length ? current.href : best;
          }, null);

          return (
            <nav className={styles.centerSection} aria-label="Page navigation">
              {submodules.map((submodule) => {
                const isActive = activeHref === submodule.href || (!activeHref && pathname === submodule.href);
                return (
                  <Link
                    key={submodule.href}
                    href={submodule.href}
                    className={`${styles.modeButton} ${isActive ? styles.active : ''}`}
                    aria-label={`Navigate to ${submodule.label}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {submodule.label}
                  </Link>
                );
              })}
            </nav>
          );
        })()}

        {/* Right Section - View Controls */}
        <div className={styles.rightSection}>
          <div className={styles.separator} aria-hidden="true" />
          
          <button 
            className={`${styles.iconButton} ${viewMode === 'mobile' ? styles.activeIcon : ''}`}
            title="Mobile View"
            aria-label="Switch to mobile view"
            aria-pressed={viewMode === 'mobile'}
            onClick={() => setViewMode('mobile')}
          >
            <DeviceMobile size={18} weight={viewMode === 'mobile' ? 'fill' : 'regular'} aria-hidden="true" />
          </button>
          <button 
            className={`${styles.iconButton} ${viewMode === 'tablet' ? styles.activeIcon : ''}`}
            title="Tablet View"
            aria-label="Switch to tablet view"
            aria-pressed={viewMode === 'tablet'}
            onClick={() => setViewMode('tablet')}
          >
            <Laptop size={18} weight={viewMode === 'tablet' ? 'fill' : 'regular'} aria-hidden="true" />
            {viewMode === 'tablet' && <span className={styles.indicator} aria-hidden="true" />}
          </button>
          <button 
            className={`${styles.iconButton} ${viewMode === 'desktop' ? styles.activeIcon : ''}`}
            title="Desktop View"
            aria-label="Switch to desktop view"
            aria-pressed={viewMode === 'desktop'}
            onClick={() => setViewMode('desktop')}
          >
            <Monitor size={18} weight={viewMode === 'desktop' ? 'fill' : 'regular'} aria-hidden="true" />
          </button>
          
          <div className={styles.separator} aria-hidden="true" />
          
          <button 
            className={styles.iconButton} 
            title="Grid View"
            aria-label="Toggle grid view"
          >
            <GridFour size={18} weight="regular" aria-hidden="true" />
          </button>
          <button 
            className={styles.iconButton} 
            title="Fullscreen"
            aria-label="Toggle fullscreen"
          >
            <ArrowsOut size={18} weight="regular" aria-hidden="true" />
          </button>
          
          <div className={styles.separator} aria-hidden="true" />
          
          <button 
            className={styles.iconButton} 
            title="Zoom Out"
            aria-label="Zoom out"
            onClick={handleZoomOut}
            disabled={zoomLevel <= 50}
          >
            <MagnifyingGlassMinus size={18} weight="regular" aria-hidden="true" />
          </button>
          <span className={styles.zoomLevel} aria-label={`Zoom level: ${zoomLevel}%`}>
            {zoomLevel}%
          </span>
          <button 
            className={styles.iconButton} 
            title="Zoom In"
            aria-label="Zoom in"
            onClick={handleZoomIn}
            disabled={zoomLevel >= 200}
          >
            <MagnifyingGlassPlus size={18} weight="regular" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmoduleNav;
