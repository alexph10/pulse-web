'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useKeyboardShortcut } from '@/lib/hooks/useKeyboardShortcut'
import { MagnifyingGlass, X, ArrowRight } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import styles from './CommandPalette.module.css'

interface Command {
  id: string
  label: string
  description?: string
  shortcut?: string
  icon?: React.ComponentType<{ size?: number; weight?: string }>
  action: () => void
  category: string
  keywords?: string[]
}

interface CommandPaletteProps {
  commands?: Command[]
}

export function CommandPalette({ commands: customCommands }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter()
  const pathname = usePathname()
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Default commands
  const defaultCommands: Command[] = [
    {
      id: 'journal',
      label: 'New Journal Entry',
      description: 'Record your thoughts and feelings',
      shortcut: 'J',
      action: () => router.push('/dashboard/journal'),
      category: 'Create',
      keywords: ['journal', 'entry', 'record', 'voice'],
    },
    {
      id: 'notes',
      label: 'Quick Note',
      description: 'Jot down a quick thought',
      shortcut: 'N',
      action: () => router.push('/dashboard/notes'),
      category: 'Create',
      keywords: ['note', 'quick', 'thought'],
    },
    {
      id: 'goals',
      label: 'Set New Goal',
      description: 'Define what you want to achieve',
      shortcut: 'G',
      action: () => router.push('/dashboard/goals'),
      category: 'Create',
      keywords: ['goal', 'target', 'achieve'],
    },
    {
      id: 'reflections',
      label: 'Deep Reflection',
      description: 'Analyze your patterns and growth',
      shortcut: 'R',
      action: () => router.push('/dashboard/reflections'),
      category: 'Create',
      keywords: ['reflection', 'analyze', 'pattern'],
    },
    {
      id: 'activity',
      label: 'View Activity',
      description: 'See your journaling timeline',
      shortcut: 'A',
      action: () => router.push('/dashboard/activity'),
      category: 'View',
      keywords: ['activity', 'timeline', 'history'],
    },
    {
      id: 'insights',
      label: 'Insights',
      description: 'Discover patterns in your entries',
      shortcut: 'I',
      action: () => router.push('/dashboard/insights'),
      category: 'View',
      keywords: ['insight', 'pattern', 'analysis'],
    },
    {
      id: 'analytics',
      label: 'Analytics',
      description: 'View detailed analytics',
      shortcut: 'Y',
      action: () => router.push('/dashboard/analytics'),
      category: 'View',
      keywords: ['analytics', 'stats', 'data'],
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      description: 'Go to main dashboard',
      shortcut: 'D',
      action: () => router.push('/dashboard'),
      category: 'Navigate',
      keywords: ['dashboard', 'home', 'main'],
    },
  ]

  const commands = customCommands || defaultCommands

  // Open command palette with Cmd/Ctrl+K
  useKeyboardShortcut('k', () => {
    setIsOpen(true)
  }, { ctrl: true, preventDefault: true })

  // Listen for custom event to open command palette
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true)
    }
    window.addEventListener('openCommandPalette', handleOpen)
    return () => window.removeEventListener('openCommandPalette', handleOpen)
  }, [])

  // Close with Escape
  useKeyboardShortcut('Escape', () => {
    if (isOpen) {
      setIsOpen(false)
      setSearch('')
      setSelectedIndex(0)
    }
  }, { preventDefault: true })

  // Filter commands based on search
  const filteredCommands = commands.filter(cmd => {
    if (!search) return true
    const searchLower = search.toLowerCase()
    return (
      cmd.label.toLowerCase().includes(searchLower) ||
      cmd.description?.toLowerCase().includes(searchLower) ||
      cmd.category.toLowerCase().includes(searchLower) ||
      cmd.keywords?.some(kw => kw.toLowerCase().includes(searchLower))
    )
  })

  // Group commands by category
  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) {
      acc[cmd.category] = []
    }
    acc[cmd.category].push(cmd)
    return acc
  }, {} as Record<string, Command[]>)

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action()
          setIsOpen(false)
          setSearch('')
          setSelectedIndex(0)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filteredCommands, selectedIndex])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex])

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={() => setIsOpen(false)}>
      <div className={styles.palette} onClick={(e) => e.stopPropagation()}>
        {/* Search Input */}
        <div className={styles.search}>
          <MagnifyingGlass size={20} weight="regular" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setSelectedIndex(0)
            }}
            placeholder="Type a command or search..."
            className={styles.input}
          />
          <button
            onClick={() => setIsOpen(false)}
            className={styles.closeButton}
            aria-label="Close"
          >
            <X size={16} weight="regular" />
          </button>
        </div>

        {/* Results */}
        <div className={styles.results} ref={listRef}>
          {filteredCommands.length === 0 ? (
            <div className={styles.empty}>
              <p>No commands found</p>
              <p className={styles.emptyHint}>Try a different search term</p>
            </div>
          ) : (
            Object.entries(groupedCommands).map(([category, categoryCommands]) => (
              <div key={category} className={styles.category}>
                <div className={styles.categoryLabel}>{category}</div>
                {categoryCommands.map((cmd, index) => {
                  const globalIndex = filteredCommands.indexOf(cmd)
                  const isSelected = globalIndex === selectedIndex
                  const Icon = cmd.icon

                  return (
                    <button
                      key={cmd.id}
                      className={cn(styles.command, isSelected && styles.selected)}
                      onClick={() => {
                        cmd.action()
                        setIsOpen(false)
                        setSearch('')
                        setSelectedIndex(0)
                      }}
                    >
                      {Icon && (
                        <Icon size={20} weight="regular" className={styles.commandIcon} />
                      )}
                      <div className={styles.commandContent}>
                        <div className={styles.commandLabel}>{cmd.label}</div>
                        {cmd.description && (
                          <div className={styles.commandDescription}>{cmd.description}</div>
                        )}
                      </div>
                      {cmd.shortcut && (
                        <kbd className={styles.shortcut}>{cmd.shortcut}</kbd>
                      )}
                      {isSelected && (
                        <ArrowRight size={16} weight="regular" className={styles.arrow} />
                      )}
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.footerHint}>
            <kbd>↑</kbd>
            <kbd>↓</kbd>
            <span>Navigate</span>
          </div>
          <div className={styles.footerHint}>
            <kbd>Enter</kbd>
            <span>Select</span>
          </div>
          <div className={styles.footerHint}>
            <kbd>Esc</kbd>
            <span>Close</span>
          </div>
        </div>
      </div>
    </div>
  )
}

