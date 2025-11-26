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
  Lightning,
  Bug,
  ChatCircle,
  CaretDown,
  CaretRight,
  MagnifyingGlass,
  FileText
} from '@phosphor-icons/react';
import styles from './sidebar.module.css';
import { useAuth } from '@/app/contexts/AuthContext';

interface NavItem {
  icon: any;
  label: string;
  href: string;
  section?: 'main' | 'insights';
  badge?: number | string;
}

interface SidebarProps {
  onToggle?: (isExpanded: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onToggle }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['main', 'insights']));
  const pathname = usePathname();

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

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const toggleSidebar = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    if (onToggle) {
      onToggle(newExpandedState);
    }
  };

  return (
    <div 
      className={`${styles.sidebar} ${isExpanded ? styles.expanded : styles.collapsed}`}
    >
      {/* Header - Figma Style */}
      {isExpanded && (
        <div className={styles.header}>
          <div className={styles.headerActions}>
            <button className={styles.headerIconButton} title="Search">
              <MagnifyingGlass size={16} weight="regular" />
            </button>
            <button className={styles.headerIconButton} title="Files">
              <FileText size={16} weight="regular" />
            </button>
          </div>
        </div>
      )}

      {/* Navigation Items - Figma Style with Collapsible Sections */}
      <nav className={styles.nav}>
        {/* Main Section - Collapsible */}
        {isExpanded && (
          <div className={styles.navSection}>
            <button 
              className={styles.sectionHeader}
              onClick={() => toggleSection('main')}
            >
              {expandedSections.has('main') ? (
                <CaretDown size={12} weight="bold" className={styles.sectionChevron} />
              ) : (
                <CaretRight size={12} weight="bold" className={styles.sectionChevron} />
              )}
              <span className={styles.sectionLabel}>Pages</span>
            </button>
            
            {expandedSections.has('main') && (
              <div className={styles.sectionItems}>
                {mainItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                    >
                      <Icon 
                        className={styles.icon} 
                        weight={isActive ? 'fill' : 'regular'} 
                        size={16} 
                      />
                      <span className={styles.label}>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Insights Section - Collapsible */}
        {isExpanded && (
          <div className={styles.navSection}>
            <button 
              className={styles.sectionHeader}
              onClick={() => toggleSection('insights')}
            >
              {expandedSections.has('insights') ? (
                <CaretDown size={12} weight="bold" className={styles.sectionChevron} />
              ) : (
                <CaretRight size={12} weight="bold" className={styles.sectionChevron} />
              )}
              <span className={styles.sectionLabel}>Insights</span>
            </button>
            
            {expandedSections.has('insights') && (
              <div className={styles.sectionItems}>
                {insightItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                    >
                      <Icon 
                        className={styles.icon} 
                        weight={isActive ? 'fill' : 'regular'} 
                        size={16} 
                      />
                      <span className={styles.label}>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Collapsed State - Icons Only */}
        {!isExpanded && (
          <div className={styles.collapsedNav}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`${styles.navItemCollapsed} ${isActive ? styles.activeCollapsed : ''}`}
                  title={item.label}
                >
                  <Icon 
                    weight={isActive ? 'fill' : 'regular'} 
                    size={16} 
                  />
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* Toggle Button */}
      <button 
        className={styles.toggleButton}
        onClick={toggleSidebar}
        aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {isExpanded ? (
          <CaretRight size={16} weight="bold" />
        ) : (
          <CaretRight size={16} weight="bold" style={{ transform: 'rotate(180deg)' }} />
        )}
      </button>

      {/* Profile & Settings at Bottom */}
      <div className={styles.footer}>
        {/* Profile section removed - use navbar profile menu instead */}
      </div>
    </div>
  );
};

export default Sidebar;
