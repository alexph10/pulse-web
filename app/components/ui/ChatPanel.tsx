"use client"
import React from 'react'
import { motion } from 'framer-motion'
import styles from '@/app/page.module.css'

type Props = {
  onClose: () => void
}

export default function ChatPanel({ onClose }: Props) {
  return (
    <motion.div
      className={styles.chatPanel}
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{
        type: 'spring',
        damping: 30,
        stiffness: 300,
        mass: 0.8
      }}
      onClick={(e) => e.stopPropagation()}
    />
  )
}
