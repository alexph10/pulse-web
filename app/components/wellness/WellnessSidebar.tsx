'use client'

import { House, GridFour, Target, Bell, Heart, CaretRight } from '@phosphor-icons/react'
import styles from './WellnessSidebar.module.css'

export default function WellnessSidebar() {
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        <button className={styles.navItem} aria-label="Home">
          <House size={20} weight="regular" />
        </button>
        <button className={styles.navItem} aria-label="Apps">
          <GridFour size={20} weight="regular" />
        </button>
        <button className={styles.navItem} aria-label="Goals">
          <Target size={20} weight="regular" />
        </button>
        <button className={styles.navItem} aria-label="Notifications">
          <Bell size={20} weight="regular" />
        </button>
        <button className={styles.navItem} aria-label="Favorites">
          <Heart size={20} weight="regular" />
        </button>
      </nav>
      <button className={styles.expandButton} aria-label="Expand sidebar">
        <CaretRight size={16} weight="regular" />
      </button>
    </aside>
  )
}





