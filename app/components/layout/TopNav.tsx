'use client'

import styles from './TopNav.module.css'

export type ActivePage = 'home' | 'chat' | 'insights' | 'settings'

interface TopNavProps {
  activePage: ActivePage
  onNavigate: (page: ActivePage) => void
}

export default function TopNav({ activePage, onNavigate }: TopNavProps) {
  return (
    <nav className={styles.topNav}>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault()
          onNavigate('home')
        }}
        className={activePage === 'home' ? styles.activeNavLink : ''}
      >
        Home
      </a>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault()
          onNavigate('chat')
        }}
        className={activePage === 'chat' ? styles.activeNavLink : ''}
      >
        Chat
      </a>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault()
          onNavigate('insights')
        }}
        className={activePage === 'insights' ? styles.activeNavLink : ''}
      >
        Insights
      </a>
    </nav>
  )
}

