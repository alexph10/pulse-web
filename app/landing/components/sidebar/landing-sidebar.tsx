'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import styles from './landing-sidebar.module.css'

export const LANDING_NAV_ITEMS = [
  { label: 'Collections', href: '/collections' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Freebies', href: '/freebies' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Request', href: '/request' },
]

export function LandingSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) => pathname?.startsWith(href)

  return (
    <>
      <button
        type="button"
        className={styles.mobileToggle}
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
      >
        Menu
      </button>

      {open && <div className={styles.backdrop} onClick={() => setOpen(false)} />}

      <nav className={`${styles.sidebar} ${open ? styles.sidebarOpen : ''}`} aria-label="Primary">
        <Link href="/" className={styles.brand} onClick={() => setOpen(false)}>
          <span>Pulse</span>
          <div className={styles.logoMark} />
        </Link>

        <div className={styles.navList}>
          {LANDING_NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`${styles.navItem} ${isActive(item.href) ? styles.navItemActive : ''}`}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className={styles.ctaGroup}>
          <Link href="/login" className={styles.ghostButton} onClick={() => setOpen(false)}>
            Log in
          </Link>
        </div>
      </nav>
    </>
  )
}

