'use client'

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  List, 
  House, 
  MagnifyingGlass,
  Plus,
  Bell, 
  Gear,
  Moon,
  Sun,
  Share,
  User,
  GridFour
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
  const router = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = prefersDark ? 'dark' : 'light';
      setTheme(initialTheme);
      document.documentElement.setAttribute('data-theme', initialTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

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

  return (
    <div className={styles.navbarWrapper}>
      <div className={styles.navbar}>
        {/* Left Section - Primary Actions */}
        <div className={styles.leftSection}>
          <Link href="/dashboard" className={styles.iconButton} title="Home">
            <House size={16} weight="regular" />
          </Link>
          <button 
            className={styles.iconButton} 
            title="Search (Cmd/Ctrl+K)"
            onClick={() => {
              // Dispatch custom event to open command palette
              window.dispatchEvent(new CustomEvent('openCommandPalette'));
            }}
          >
            <MagnifyingGlass size={16} weight="regular" />
          </button>
          <Link 
            href="/dashboard/journal" 
            className={styles.iconButton} 
            title="New Journal Entry"
          >
            <Plus size={16} weight="regular" />
          </Link>
          <button className={`${styles.iconButton} ${styles.notificationButton}`} title="Notifications">
            <Bell size={16} weight="regular" />
          </button>
          <button className={styles.iconButton} title="Settings">
            <Gear size={16} weight="regular" />
          </button>
          <button className={styles.iconButton} title="Menu">
            <List size={16} weight="regular" />
          </button>
        </div>

        {/* Center Section - Page Context Tabs */}
        {submodules.length > 0 && (
          <div className={styles.centerSection}>
            {submodules.map((submodule) => {
              const isActive = pathname === submodule.href;
              return (
                <Link
                  key={submodule.href}
                  href={submodule.href}
                  className={`${styles.modeButton} ${isActive ? styles.active : ''}`}
                >
                  {submodule.label}
                </Link>
              );
            })}
          </div>
        )}

        {/* Right Section - Utility Actions */}
        <div className={styles.rightSection}>
          <button 
            className={styles.iconButton} 
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            onClick={toggleTheme}
          >
            {theme === 'light' ? (
              <Moon size={16} weight="regular" />
            ) : (
              <Sun size={16} weight="regular" />
            )}
          </button>
          <button className={styles.iconButton} title="Share">
            <Share size={16} weight="regular" />
          </button>
          <button className={styles.iconButton} title="View Options">
            <GridFour size={16} weight="regular" />
          </button>
          <Link href="/dashboard/profile" className={styles.iconButton} title="Profile">
            <User size={16} weight="regular" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SubmoduleNav;
