'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import styles from './submodule-nav.module.css';

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
    { label: 'Search', href: '/dashboard/notes/search' },
  ],
  '/dashboard/journal': [
    { label: 'New Entry', href: '/dashboard/journal' },
    { label: 'Timeline', href: '/dashboard/journal/timeline' },
    { label: 'Mood Tracker', href: '/dashboard/journal/mood' },
    { label: 'Memories', href: '/dashboard/journal/memories' },
    { label: 'Search', href: '/dashboard/journal/search' },
  ],
  '/dashboard/goals': [
    { label: 'Active', href: '/dashboard/goals' },
    { label: 'Completed', href: '/dashboard/goals/completed' },
    { label: 'Templates', href: '/dashboard/goals/templates' },
    { label: 'Milestones', href: '/dashboard/goals/milestones' },
    { label: 'Analytics', href: '/dashboard/goals/analytics' },
  ],
  '/dashboard/habits': [
    { label: 'Tracker', href: '/dashboard/habits' },
    { label: 'Calendar', href: '/dashboard/habits/calendar' },
    { label: 'Statistics', href: '/dashboard/habits/statistics' },
    { label: 'Streaks', href: '/dashboard/habits/streaks' },
    { label: 'Library', href: '/dashboard/habits/library' },
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

interface SubmoduleNavProps {
  isLoading?: boolean;
}

const SubmoduleNav: React.FC<SubmoduleNavProps> = ({ isLoading = false }) => {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { user } = useAuth();

  // Initialize theme from localStorage or system preference
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

  // Handle scroll effect - hide when scrolling down, only show when at top
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Only show navbar when at the very top of the page
      if (currentScrollY <= 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down and past threshold - hide navbar
        setIsVisible(false);
      }
      
      setScrolled(currentScrollY > 20);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Find the base route (e.g., /dashboard/notes from /dashboard/notes/quick)
  const getBaseRoute = (path: string): string => {
    // Exact match first
    if (submoduleConfig[path]) return path;
    
    // Check if it's a sub-path of a configured route
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
    <div className={`${styles.navbarWrapper} ${scrolled ? styles.scrolled : ''} ${!isVisible ? styles.hidden : ''}`}>
      <div className={styles.navbar}>
        {/* Logo and Submodule Navigation - Left Side */}
        <div className={styles.leftSection}>
          {/* Logo */}
          <div className={styles.logoContainer}>
            <div className={styles.logoSquare1} style={{
              animation: isLoading ? 'chaseSquare1 3s cubic-bezier(0.4, 0, 0.2, 1) infinite' : 'none',
              top: isLoading ? undefined : '0px',
              left: isLoading ? undefined : '16px',
              transition: isLoading ? 'none' : 'all 0.3s ease'
            }} />
            <div className={styles.logoSquare2} style={{
              animation: isLoading ? 'chaseSquare2 3s cubic-bezier(0.4, 0, 0.2, 1) infinite' : 'none',
              top: isLoading ? undefined : '16px',
              left: isLoading ? undefined : '0px',
              transition: isLoading ? 'none' : 'all 0.3s ease'
            }} />
          </div>

          {/* Submodule Navigation */}
          {submodules.length > 0 && (
            <nav className={styles.submoduleContainer}>
              {submodules.map((submodule) => {
                const isActive = pathname === submodule.href;
                return (
                  <Link
                    key={submodule.href}
                    href={submodule.href}
                    className={`${styles.submoduleLink} ${isActive ? styles.active : ''}`}
                  >
                    {submodule.label}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        {/* Right Section */}
        <div className={styles.rightSection}>
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className={styles.themeButton}
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            )}
          </button>

          <button className={styles.scheduleButton}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmoduleNav;
