'use client'

import { ReactNode } from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import styles from './Tabs.module.css'

interface TabsProps {
  children: ReactNode
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
}

interface TabsListProps {
  children: ReactNode
  className?: string
}

interface TabsTriggerProps {
  children: ReactNode
  value: string
  disabled?: boolean
  className?: string
}

interface TabsContentProps {
  children: ReactNode
  value: string
  className?: string
}

// Main Tabs Component
export function Tabs({ children, defaultValue, value, onValueChange, className }: TabsProps) {
  return (
    <TabsPrimitive.Root
      className={`${styles.root} ${className || ''}`}
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
    >
      {children}
    </TabsPrimitive.Root>
  )
}

// Tabs List
function TabsList({ children, className }: TabsListProps) {
  return (
    <TabsPrimitive.List className={`${styles.list} ${className || ''}`}>
      {children}
    </TabsPrimitive.List>
  )
}

// Tabs Trigger (Tab Button)
function TabsTrigger({ children, value, disabled, className }: TabsTriggerProps) {
  return (
    <TabsPrimitive.Trigger
      className={`${styles.trigger} ${className || ''}`}
      value={value}
      disabled={disabled}
    >
      {children}
    </TabsPrimitive.Trigger>
  )
}

// Tabs Content
function TabsContent({ children, value, className }: TabsContentProps) {
  return (
    <TabsPrimitive.Content className={`${styles.content} ${className || ''}`} value={value}>
      {children}
    </TabsPrimitive.Content>
  )
}

// Attach compound components
Tabs.List = TabsList
Tabs.Trigger = TabsTrigger
Tabs.Content = TabsContent

// Export for convenience
export { TabsList, TabsTrigger, TabsContent }








