'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './sidebar.module.css';

interface NavItem {
  icon: string;
  label: string;
  href: string;
}

const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeItem, setActiveItem] = useState('Home');

  const navItems: NavItem[] = [
    { icon: '', label: 'Home', href: '/dashboard' },
    { icon: '', label: 'Notes', href: '/dashboard/notes' },
    { icon: '', label: 'Journal', href: '/dashboard/journal' },
    { icon: '', label: 'Goals', href: '/dashboard/goals' },
    { icon: '', label: 'Habits', href: '/dashboard/habits' },
    { icon: '', label: 'Reflections', href: '/dashboard/reflections' },
    { icon: '', label: 'Progress', href: '/dashboard/progress' },
  ];

  return (
    <div 
      className={`${styles.sidebar} ${isExpanded ? styles.expanded : styles.collapsed}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>◇</div>
      </div>

      {/* Navigation Items */}
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`${styles.navItem} ${activeItem === item.label ? styles.active : ''}`}
            onClick={() => setActiveItem(item.label)}
          >
            <span className={styles.icon}>{item.icon}</span>
            {isExpanded && <span className={styles.label}>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Profile Icon at Bottom */}
      <div className={styles.profile}>
        <button className={styles.profileButton}>
          <div className={styles.profileIcon}></div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
