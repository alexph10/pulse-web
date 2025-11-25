'use client'

import Scene3D from './3d-scene'
import styles from './hero-overlay.module.css'

export default function HeroOverlay() {
  return (
    <div className={styles.frame}>
      <div className={styles.canvas}>
        <div className={styles.canvasInner}>
          <Scene3D />
        </div>
      </div>
      <div className={styles.gridLines} aria-hidden="true" />
    </div>
  )
}

