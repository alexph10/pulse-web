'use client'

import { ReactNode, forwardRef } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './Modal.module.css'

interface ModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'full'
}

interface ModalHeaderProps {
  children: ReactNode
  showClose?: boolean
}

interface ModalTitleProps {
  children: ReactNode
}

interface ModalBodyProps {
  children: ReactNode
}

interface ModalFooterProps {
  children: ReactNode
  align?: 'left' | 'center' | 'right' | 'between'
}

// Main Modal Component
export function Modal({ open, onOpenChange, children, size = 'md' }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <AnimatePresence>
          {open && (
            <>
              {/* Overlay */}
              <Dialog.Overlay asChild>
                <motion.div
                  className={styles.overlay}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </Dialog.Overlay>

              {/* Content */}
              <Dialog.Content asChild>
                <motion.div
                  className={`${styles.content} ${styles[size]}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
                >
                  {children}
                </motion.div>
              </Dialog.Content>
            </>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

// Modal Header
function ModalHeader({ children, showClose = true }: ModalHeaderProps) {
  return (
    <div className={styles.header}>
      {children}
      {showClose && (
        <Dialog.Close className={styles.closeButton}>
          <X size={20} weight="bold" />
        </Dialog.Close>
      )}
    </div>
  )
}

// Modal Title
function ModalTitle({ children }: ModalTitleProps) {
  return (
    <Dialog.Title className={styles.title}>
      {children}
    </Dialog.Title>
  )
}

// Modal Body
function ModalBody({ children }: ModalBodyProps) {
  return (
    <div className={styles.body}>
      {children}
    </div>
  )
}

// Modal Footer
function ModalFooter({ children, align = 'right' }: ModalFooterProps) {
  return (
    <div className={`${styles.footer} ${styles[`align-${align}`]}`}>
      {children}
    </div>
  )
}

// Attach compound components
Modal.Header = ModalHeader
Modal.Title = ModalTitle
Modal.Body = ModalBody
Modal.Footer = ModalFooter

// Trigger component (optional - for button that opens modal)
interface ModalTriggerProps {
  children: ReactNode
  asChild?: boolean
}

export function ModalTrigger({ children, asChild }: ModalTriggerProps) {
  return (
    <Dialog.Trigger asChild={asChild}>
      {children}
    </Dialog.Trigger>
  )
}

// Export for convenience
export { Dialog }

