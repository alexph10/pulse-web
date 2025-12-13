'use client'

import { forwardRef } from 'react'
import styles from './CreateButton.module.css'

interface CreateButtonProps {
  onClick: () => void
}

const CreateButton = forwardRef<HTMLButtonElement, CreateButtonProps>(({ onClick }, ref) => {
  return (
    <button
      className={styles.plusButton}
      title="Create"
      aria-label="Create new"
      ref={ref}
      onClick={onClick}
    >
      <span aria-hidden="true">+</span>
    </button>
  )
})

CreateButton.displayName = 'CreateButton'

export default CreateButton

