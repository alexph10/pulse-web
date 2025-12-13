'use client'

import { forwardRef } from 'react'
import { Avatar } from 'radix-ui'
import styles from './ProfileButton.module.css'

interface ProfileButtonProps {
  firstName: string
  isOpen: boolean
  onClick: () => void
}

const ProfileButton = forwardRef<HTMLDivElement, ProfileButtonProps>(
  ({ firstName, isOpen, onClick }, ref) => {
    return (
      <div
        className={styles.profileCircle}
        role="button"
        aria-expanded={isOpen}
        onClick={onClick}
        ref={ref}
      >
        <Avatar.Root className={styles.avatarRoot}>
          <Avatar.Fallback className={styles.avatarFallback}>
            {firstName.charAt(0).toUpperCase()}
          </Avatar.Fallback>
        </Avatar.Root>
      </div>
    )
  }
)

ProfileButton.displayName = 'ProfileButton'

export default ProfileButton

