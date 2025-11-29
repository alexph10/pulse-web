'use client'

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  MagnifyingGlass,
  Sparkle,
  Plus,
  CalendarBlank,
  UserCircle,
  Moon,
  Sun
} from '@phosphor-icons/react';
import { PulseAIChatPanel } from '../ui';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import styles from './submodule-nav.module.css';

interface SubmoduleNavProps {
  isLoading?: boolean;
}

// Unused configuration - kept for reference
/*
const submoduleConfig = {
  '/dashboard': [...],
  '/dashboard/notes': [...],
  '/dashboard/journal': [...],
  '/dashboard/goals': [...],
  '/dashboard/habits': [...],
  '/dashboard/reflections': [...],
  '/dashboard/progress': [...],
};
*/

const mainPages = [
  { label: 'Home', href: '/dashboard' },
  { label: 'Insights', href: '/dashboard/insights' },
  { label: 'Journal', href: '/dashboard/journal' },
  { label: 'Analytics', href: '/dashboard/analytics' },
];

const SubmoduleNav: React.FC<SubmoduleNavProps> = () => {
  const pathname = usePathname();
  const [searchValue, setSearchValue] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'dark';
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) return savedTheme;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });
  const [goalsCount, setGoalsCount] = useState(0);
  const [habitsCount, setHabitsCount] = useState(0);
  const [goalsLimit] = useState(20); // Free plan limit
  const [habitsLimit] = useState(3); // Free plan limit (packs)
  const { user } = useAuth();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Fetch user goals and habits count
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;

      try {
        // Fetch active goals count
        const { count: goalsTotal, error: goalsError } = await supabase
          .from('goals')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'active');

        if (goalsError) {
          console.error('Error fetching goals:', goalsError);
        } else {
          setGoalsCount(goalsTotal || 0);
        }

        // Fetch habits count
        const { count: habitsTotal, error: habitsError } = await supabase
          .from('habits')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        if (habitsError) {
          console.error('Error fetching habits:', habitsError);
        } else {
          setHabitsCount(habitsTotal || 0);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [user]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

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
          <MagnifyingGlass size={14} weight="regular" className={styles.searchIcon} />
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
          <button
            className={styles.askAiButton}
            aria-label="Ask AI"
            type="button"
            onClick={() => setShowAiPanel(true)}
          >
            <Sparkle size={14} weight="regular" />
            Ask AI
          </button>
          
          <button className={styles.upgradeButton} aria-label="Upgrade">
            Upgrade
          </button>
          
          <button className={styles.iconButton} aria-label="Add new" title="Add new">
            <Plus size={18} weight="regular" />
          </button>
          
          <button 
            className={styles.iconButton} 
            aria-label="Calendar" 
            title="Calendar"
            onClick={() => setShowCalendar(!showCalendar)}
          >
            <CalendarBlank size={18} weight="regular" />
          </button>
          
          {/* Theme Toggle */}
          <button 
            className={styles.iconButton} 
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            onClick={toggleTheme}
          >
            {theme === 'light' ? <Moon size={18} weight="regular" /> : <Sun size={18} weight="regular" />}
          </button>
          
          {/* Profile Icon with Dropdown */}
          <div style={{ position: 'relative' }}>
            <button 
              className={styles.userAvatar} 
              aria-label="Profile"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <UserCircle size={28} weight="fill" />
            </button>
            
            {showProfileMenu && (
              <>
                <div
                  onClick={() => setShowProfileMenu(false)}
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 999,
                    background: 'transparent'
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '48px',
                    right: '0',
                    width: '280px',
                    background: '#1a1d24',
                    border: '1px solid #2a2e38',
                    borderRadius: '0',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.24)',
                    zIndex: 1000,
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ padding: '12px 0' }}>
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setShowProfileMenu(false)}
                      style={{
                        display: 'block',
                        padding: '10px 20px',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#f9fafb',
                        fontFamily: 'var(--font-family-satoshi)',
                        background: 'transparent'
                      }}
                    >
                      View profile
                    </Link>
                    <Link
                      href="/dashboard/shortcuts"
                      onClick={() => setShowProfileMenu(false)}
                      style={{
                        display: 'block',
                        padding: '10px 20px',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#f9fafb',
                        fontFamily: 'var(--font-family-satoshi)',
                        background: 'transparent'
                      }}
                    >
                      Shortcuts
                    </Link>
                    <button
                      onClick={toggleTheme}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '10px 20px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#f9fafb',
                        fontFamily: 'var(--font-family-satoshi)',
                        background: 'transparent',
                        border: 'none',
                        textAlign: 'left'
                      }}
                    >
                      Switch to {theme === 'light' ? 'dark' : 'light'} mode
                    </button>
                    <button
                      onClick={async () => {
                        await supabase.auth.signOut()
                        setShowProfileMenu(false)
                        window.location.href = '/onboarding'
                      }}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '10px 20px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#f9fafb',
                        fontFamily: 'var(--font-family-satoshi)',
                        background: 'transparent',
                        border: 'none',
                        textAlign: 'left'
                      }}
                    >
                      Logout
                    </button>
                    <div style={{
                      height: '1px',
                      background: '#2a2e38',
                      margin: '10px 0'
                    }} />
                    <Link
                      href="/report-bug"
                      onClick={() => setShowProfileMenu(false)}
                      style={{
                        display: 'block',
                        padding: '10px 20px',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#f9fafb',
                        fontFamily: 'var(--font-family-satoshi)',
                        background: 'transparent'
                      }}
                    >
                      Report a bug
                    </Link>
                    <Link
                      href="/request-feature"
                      onClick={() => setShowProfileMenu(false)}
                      style={{
                        display: 'block',
                        padding: '10px 20px',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#f9fafb',
                        fontFamily: 'var(--font-family-satoshi)',
                        background: 'transparent'
                      }}
                    >
                      Request a feature
                    </Link>
                    <Link
                      href="/contact"
                      onClick={() => setShowProfileMenu(false)}
                      style={{
                        display: 'block',
                        padding: '10px 20px',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#f9fafb',
                        fontFamily: 'var(--font-family-satoshi)',
                        background: 'transparent'
                      }}
                    >
                      Contact us
                    </Link>
                    <div style={{
                      height: '1px',
                      background: '#2a2e38',
                      margin: '10px 0'
                    }} />
                    <div style={{ padding: '10px 20px' }}>
                      <div style={{ 
                        marginBottom: '12px', 
                        fontWeight: 600,
                        fontSize: '13px',
                        color: '#9ca3af',
                        fontFamily: 'var(--font-family-satoshi)'
                      }}>Free plan limits</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px', color: '#6b7280' }}>
                        <span>{goalsCount}/{goalsLimit}</span><span style={{ fontWeight: 600, letterSpacing: '0.5px' }}>TRACKS</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px', color: '#6b7280' }}>
                        <span>{habitsCount}/{habitsLimit}</span><span style={{ fontWeight: 600, letterSpacing: '0.5px' }}>PACKS</span>
                      </div>
                      <div style={{ 
                        width: '100%', 
                        height: '6px', 
                        background: '#2a2e38',
                        marginBottom: '14px'
                      }}>
                        <div style={{ 
                          width: `${Math.min((goalsCount / goalsLimit) * 100, 100)}%`, 
                          height: '100%', 
                          background: 'linear-gradient(135deg, #111827 0%, #1F2937 100%)'
                        }} />
                      </div>
                      <button style={{ 
                        width: '100%', 
                        padding: '10px 0', 
                        background: 'rgba(217, 119, 6, 0.12)', 
                        border: '1px solid rgba(217, 119, 6, 0.3)', 
                        color: '#111827', 
                        fontWeight: 600, 
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontFamily: 'var(--font-family-satoshi)',
                        transition: 'all 0.2s ease'
                      }}>Upgrade to Pro</button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
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
      <PulseAIChatPanel isOpen={showAiPanel} onClose={() => setShowAiPanel(false)} />
    </div>
  );
};

export default SubmoduleNav;
