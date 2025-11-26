'use client'

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  MagnifyingGlass,
  Sparkle,
  Plus,
  CalendarBlank,
  UserCircle
} from '@phosphor-icons/react';
import CalendarOverlay from '../calendar-overlay/calendar-overlay';
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

const mainPages = [
  { label: 'Home', href: '/dashboard' },
  { label: 'Insights', href: '/dashboard/insights' },
  { label: 'Journal', href: '/dashboard/journal' },
];

const SubmoduleNav: React.FC<SubmoduleNavProps> = ({ isLoading = false }) => {
  const pathname = usePathname();
  const [searchValue, setSearchValue] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <div className={styles.navbarWrapper}>
      <div className={styles.navbar}>
        {/* Logo */}
        <Link href="/dashboard" className={styles.logo} aria-label="Pulse Home">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12L7 8L11 14L15 6L19 10L21 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>

        {/* Search Bar */}
        <div className={styles.searchContainer}>
          <MagnifyingGlass size={16} weight="regular" className={styles.searchIcon} />
          <input 
            type="text"
            placeholder="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className={styles.searchInput}
            aria-label="Search"
          />
          <span className={styles.searchHint}>Ctrl + K</span>
        </div>

        {/* Right Actions */}
        <div className={styles.rightActions}>
          <button className={styles.askAiButton} aria-label="Ask AI">
            <Sparkle size={16} weight="regular" />
            Ask AI
          </button>
          
          <button className={styles.upgradeButton} aria-label="Upgrade">
            Upgrade
          </button>
          
          <button className={styles.iconButton} aria-label="Add new" title="Add new">
            <Plus size={20} weight="regular" />
          </button>
          
          <div className={styles.calendarButtonWrapper}>
            <button 
              className={styles.iconButton} 
              aria-label="Calendar" 
              title="Calendar"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              <CalendarBlank size={20} weight="regular" />
            </button>
            <CalendarOverlay 
              isOpen={showCalendar} 
              onClose={() => setShowCalendar(false)} 
            />
          </div>
          
          <Link href="/dashboard/profile" className={styles.userAvatar} aria-label="Profile">
            <UserCircle size={32} weight="fill" />
          </Link>
        </div>
      </div>

      {/* Page Navigation Toggle */}
      <div className={styles.pageToggle}>
        {mainPages.map((page) => {
          const isActive = pathname === page.href;
          return (
            <Link
              key={page.href}
              href={page.href}
              className={`${styles.pageLink} ${isActive ? styles.pageLinkActive : ''}`}
            >
              {page.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SubmoduleNav;
