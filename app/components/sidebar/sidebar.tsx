'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  House, 
  Notebook, 
  BookOpen, 
  Target, 
  CheckSquare, 
  Lightbulb, 
  ChartLine,
  ChartLineUp,
  User,
  SignOut,
  Lightning,
  Bug,
  ChatCircle
} from '@phosphor-icons/react';
import styles from './sidebar.module.css';
import { useAuth } from '@/app/contexts/AuthContext';

interface NavItem {
  icon: any;
  label: string;
  href: string;
  section?: 'main' | 'insights';
}

interface SidebarProps {
  onToggle?: (isExpanded: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onToggle }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const navItems: NavItem[] = [
    { icon: House, label: 'Home', href: '/dashboard', section: 'main' },
    { icon: Notebook, label: 'Notes', href: '/dashboard/notes', section: 'main' },
    { icon: BookOpen, label: 'Journal', href: '/dashboard/journal', section: 'main' },
    { icon: Target, label: 'Goals', href: '/dashboard/goals', section: 'main' },
    { icon: CheckSquare, label: 'Habits', href: '/dashboard/habits', section: 'main' },
    { icon: ChartLineUp, label: 'Activity', href: '/dashboard/activity', section: 'insights' },
    { icon: Lightbulb, label: 'Reflections', href: '/dashboard/reflections', section: 'insights' },
    { icon: ChartLine, label: 'Progress', href: '/dashboard/progress', section: 'insights' },
  ];

  const mainItems = navItems.filter(item => item.section === 'main');
  const insightItems = navItems.filter(item => item.section === 'insights');

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleSidebar = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    if (onToggle) {
      onToggle(newExpandedState);
    }
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  return (
    <div 
      className={`${styles.sidebar} ${isExpanded ? styles.expanded : styles.collapsed}`}
    >
      {/* Toggle Button */}
      <button 
        className={styles.toggleButton}
        onClick={toggleSidebar}
        aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        <span className={styles.toggleIcon}>☰</span>
      </button>

      {/* Navigation Items */}
      <nav className={styles.nav}>
        {/* Main Section */}
        <div className={styles.navSection}>
          {mainItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                title={!isExpanded ? item.label : undefined}
              >
                <Icon className={styles.icon} weight={isActive ? 'fill' : 'regular'} size={18} />
                {isExpanded && <span className={styles.label}>{item.label}</span>}
              </Link>
            );
          })}
        </div>

        {/* Insights Section */}
        <div className={styles.navSection}>
          {insightItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                title={!isExpanded ? item.label : undefined}
              >
                <Icon className={styles.icon} weight={isActive ? 'fill' : 'regular'} size={18} />
                {isExpanded && <span className={styles.label}>{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Profile & Settings at Bottom */}
      <div className={styles.footer}>
        <button 
          onClick={toggleProfileMenu}
          className={styles.profileButton}
          title={!isExpanded ? 'Profile' : undefined}
        >
          <div className={styles.profileAvatar}>
            {user?.email ? getInitials(user.email) : 'U'}
          </div>
          {isExpanded && (
            <div className={styles.profileInfo}>
              <div className={styles.profileName}>
                {user?.user_metadata?.username || user?.email?.split('@')[0] || 'User'}
              </div>
              <div className={styles.profileEmail}>
                {user?.email || 'user@example.com'}
              </div>
            </div>
          )}
        </button>

        {/* Profile Menu Overlay */}
        {isProfileMenuOpen && (
          <>
            <div className={styles.overlay} onClick={toggleProfileMenu} />
            <div className={styles.profileMenu}>
              {/* User Info Header */}
              <div className={styles.profileMenuHeader}>
                <div className={styles.profileHeaderContent}>
                  <div className={styles.profileAvatarLarge}>
                    {user?.email ? getInitials(user.email) : 'U'}
                  </div>
                  <div className={styles.profileHeaderInfo}>
                    <div className={styles.profileMenuName}>
                      {user?.user_metadata?.username || user?.email?.split('@')[0] || 'User'}
                    </div>
                    <div className={styles.profileMenuEmail}>
                      {user?.email || 'user@example.com'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className={styles.profileMenuItems}>
                <Link href="/dashboard/profile" onClick={toggleProfileMenu} className={styles.profileMenuItem}>
                  View profile
                </Link>
                <Link href="/dashboard/shortcuts" onClick={toggleProfileMenu} className={styles.profileMenuItem}>
                  Shortcuts
                </Link>
                <button 
                  onClick={() => {
                    const currentTheme = document.documentElement.getAttribute('data-theme');
                    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                    localStorage.setItem('theme', newTheme);
                    document.documentElement.setAttribute('data-theme', newTheme);
                  }}
                  className={styles.profileMenuItem}
                >
                  Switch to {document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light'} mode
                </button>
                <button
                  onClick={() => {
                    toggleProfileMenu();
                    handleSignOut();
                  }}
                  className={styles.profileMenuItem}
                >
                  Logout
                </button>

                <div className={styles.profileMenuDivider} />

                <Link href="/report-bug" onClick={toggleProfileMenu} className={styles.profileMenuItem}>
                  Report a bug
                </Link>
                <Link href="/request-feature" onClick={toggleProfileMenu} className={styles.profileMenuItem}>
                  Request a feature
                </Link>
                <Link href="/contact" onClick={toggleProfileMenu} className={styles.profileMenuItem}>
                  Contact us
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
