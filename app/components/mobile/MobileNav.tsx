'use client'

import { useMediaQuery } from '@/app/hooks/useMediaQuery'
import { House, BookOpen, ChartLine, User, Target, Lightbulb } from '@phosphor-icons/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './MobileNav.module.css'

export function MobileNav() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const pathname = usePathname()

  if (!isMobile) return null

  const navItems = [
    { href: '/dashboard', icon: House, label: 'Home' },
    { href: '/dashboard/journal', icon: BookOpen, label: 'Journal' },
    { href: '/dashboard/activity', icon: ChartLine, label: 'Activity' },
    { href: '/dashboard/goals', icon: Target, label: 'Goals' },
    { href: '/dashboard/insights', icon: Lightbulb, label: 'Insights' },
    { href: '/dashboard/profile', icon: User, label: 'Profile' },
  ]

  return (
    <nav className={styles.mobileNav}>
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href || 
          (item.href !== '/dashboard' && pathname.startsWith(item.href))
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            aria-label={item.label}
          >
            <Icon size={24} weight={isActive ? 'fill' : 'regular'} />
            <span className={styles.navLabel}>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

