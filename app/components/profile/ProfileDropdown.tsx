'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { PersonIcon, GearIcon, ExitIcon } from '@radix-ui/react-icons'
import { Avatar } from 'radix-ui'
import styles from './ProfileDropdown.module.css'

interface ProfileDropdownProps {
  isOpen: boolean
  firstName: string
  lastName: string
  email: string
  onProfile: () => void
  onSettings: () => void
  onSignOut: () => void
}

const ProfileDropdown = forwardRef<HTMLDivElement, ProfileDropdownProps>(
  ({ isOpen, firstName, lastName, email, onProfile, onSettings, onSignOut }, ref) => {
    if (!isOpen) return null

    return (
      <motion.div
        className={styles.profileDropdown}
        ref={ref}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.profileDropdownContent}>
          <div className={styles.profileDropdownHeader}>
            <Avatar.Root className={styles.profileDropdownAvatar}>
              <Avatar.Fallback className={styles.avatarFallbackLarge}>
                {firstName.charAt(0).toUpperCase()}
              </Avatar.Fallback>
            </Avatar.Root>
            <div className={styles.profileDropdownInfo}>
              <div className={styles.profileDropdownName}>
                {firstName} {lastName}
              </div>
              <div className={styles.profileDropdownEmail}>{email}</div>
            </div>
          </div>

          <div className={styles.profileDropdownDivider} />

          <button className={styles.profileDropdownItem} onClick={onProfile}>
            <PersonIcon />
            Profile
          </button>

          <button className={styles.profileDropdownItem} onClick={onSettings}>
            <GearIcon />
            Settings
          </button>

          <div className={styles.profileDropdownDivider} />

          <button className={styles.profileDropdownItem} onClick={onSignOut}>
            <ExitIcon />
            Sign out
          </button>
        </div>
      </motion.div>
    )
  }
)

ProfileDropdown.displayName = 'ProfileDropdown'

export default ProfileDropdown

