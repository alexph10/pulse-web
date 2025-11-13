/**
 * Draft Storage Utilities
 * Handles auto-save and restore of draft content
 */

const DRAFT_PREFIX = 'pulse_draft_'

export interface DraftData {
  content: string
  timestamp: number
  metadata?: Record<string, any>
}

/**
 * Save draft to localStorage
 */
export function saveDraft(key: string, content: string, metadata?: Record<string, any>): void {
  try {
    const draft: DraftData = {
      content,
      timestamp: Date.now(),
      metadata,
    }
    localStorage.setItem(`${DRAFT_PREFIX}${key}`, JSON.stringify(draft))
  } catch (error) {
    console.error('Failed to save draft:', error)
  }
}

/**
 * Get draft from localStorage
 */
export function getDraft(key: string): DraftData | null {
  try {
    const stored = localStorage.getItem(`${DRAFT_PREFIX}${key}`)
    if (!stored) return null

    const draft: DraftData = JSON.parse(stored)
    return draft
  } catch (error) {
    console.error('Failed to get draft:', error)
    return null
  }
}

/**
 * Clear draft from localStorage
 */
export function clearDraft(key: string): void {
  try {
    localStorage.removeItem(`${DRAFT_PREFIX}${key}`)
  } catch (error) {
    console.error('Failed to clear draft:', error)
  }
}

/**
 * Check if draft exists and is recent (within 24 hours)
 */
export function hasRecentDraft(key: string, maxAgeHours: number = 24): boolean {
  const draft = getDraft(key)
  if (!draft) return false

  const ageHours = (Date.now() - draft.timestamp) / (1000 * 60 * 60)
  return ageHours < maxAgeHours
}

/**
 * Get all draft keys
 */
export function getAllDraftKeys(): string[] {
  const keys: string[] = []
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(DRAFT_PREFIX)) {
        keys.push(key.replace(DRAFT_PREFIX, ''))
      }
    }
  } catch (error) {
    console.error('Failed to get draft keys:', error)
  }
  return keys
}

