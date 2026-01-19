'use client'

import { motion } from 'framer-motion'
import styles from './TopNav.module.css'

export type ActivePage = 'home' | 'chat' | 'insights' | 'settings'

interface TopNavProps {
  activePage: ActivePage
  onNavigate: (page: ActivePage) => void
}

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'chat', label: 'Chat' },
  { id: 'insights', label: 'Insights' },
] as const

export default function TopNav({ activePage, onNavigate }: TopNavProps) {
  return (
    <nav className={styles.topNav}>
      {navItems.map((item, index) => (
        <motion.a
          key={item.id}
          href="#"
          onClick={(e) => {
            e.preventDefault()
            onNavigate(item.id as ActivePage)
          }}
          className={activePage === item.id ? styles.activeNavLink : ''}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            delay: index * 0.1,
            ease: 'easeOut'
          }}
        >
          {item.label}
        </motion.a>
      ))}
    </nav>
  )
}

