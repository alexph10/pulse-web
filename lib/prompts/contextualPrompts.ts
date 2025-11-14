/**
 * Contextual Prompts for Journaling
 * Time-based and usage-aware prompt suggestions
 */

export interface Prompt {
  id: string
  text: string
  category: 'reflection' | 'gratitude' | 'check-in' | 'growth' | 'emotional'
  timeOfDay: ('morning' | 'afternoon' | 'evening' | 'night')[]
  usageCount?: number
  lastUsed?: Date
}

export const contextualPrompts: Prompt[] = [
  // Morning prompts
  {
    id: 'morning-1',
    text: 'What are you looking forward to today?',
    category: 'check-in',
    timeOfDay: ['morning'],
  },
  {
    id: 'morning-2',
    text: 'How did you sleep? What dreams or thoughts stayed with you?',
    category: 'reflection',
    timeOfDay: ['morning'],
  },
  {
    id: 'morning-3',
    text: 'What intention do you want to set for today?',
    category: 'growth',
    timeOfDay: ['morning'],
  },
  {
    id: 'morning-4',
    text: 'What made you smile when you woke up?',
    category: 'gratitude',
    timeOfDay: ['morning'],
  },

  // Afternoon prompts
  {
    id: 'afternoon-1',
    text: 'How is your day going so far? What stands out?',
    category: 'check-in',
    timeOfDay: ['afternoon'],
  },
  {
    id: 'afternoon-2',
    text: 'What challenge are you facing right now?',
    category: 'emotional',
    timeOfDay: ['afternoon'],
  },
  {
    id: 'afternoon-3',
    text: 'What have you learned about yourself today?',
    category: 'growth',
    timeOfDay: ['afternoon'],
  },

  // Evening prompts
  {
    id: 'evening-1',
    text: 'What are you grateful for from today?',
    category: 'gratitude',
    timeOfDay: ['evening'],
  },
  {
    id: 'evening-2',
    text: 'What is weighing on your mind right now?',
    category: 'emotional',
    timeOfDay: ['evening'],
  },
  {
    id: 'evening-3',
    text: 'How did today differ from what you expected?',
    category: 'reflection',
    timeOfDay: ['evening'],
  },
  {
    id: 'evening-4',
    text: 'What would you like to let go of before tomorrow?',
    category: 'emotional',
    timeOfDay: ['evening'],
  },

  // Night prompts
  {
    id: 'night-1',
    text: 'What thoughts are keeping you up?',
    category: 'emotional',
    timeOfDay: ['night'],
  },
  {
    id: 'night-2',
    text: 'What are you proud of from today?',
    category: 'gratitude',
    timeOfDay: ['night'],
  },
  {
    id: 'night-3',
    text: 'How do you want tomorrow to feel?',
    category: 'growth',
    timeOfDay: ['night'],
  },

  // Anytime prompts
  {
    id: 'anytime-1',
    text: 'What patterns do you notice in your thoughts lately?',
    category: 'reflection',
    timeOfDay: ['morning', 'afternoon', 'evening', 'night'],
  },
  {
    id: 'anytime-2',
    text: 'What emotion are you feeling most strongly right now?',
    category: 'emotional',
    timeOfDay: ['morning', 'afternoon', 'evening', 'night'],
  },
  {
    id: 'anytime-3',
    text: 'What do you need to hear right now?',
    category: 'emotional',
    timeOfDay: ['morning', 'afternoon', 'evening', 'night'],
  },
]

export function getPromptsForTimeOfDay(
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night',
  limit: number = 3
): Prompt[] {
  const relevantPrompts = contextualPrompts.filter(
    (prompt) =>
      prompt.timeOfDay.includes(timeOfDay) ||
      prompt.timeOfDay.length === 4 // Anytime prompts
  )

  // Sort by usage (less used first) and return limited results
  return relevantPrompts
    .sort((a, b) => (a.usageCount || 0) - (b.usageCount || 0))
    .slice(0, limit)
}

export function getPromptCategoryColor(category: Prompt['category']): string {
  const colors: Record<Prompt['category'], string> = {
    reflection: 'var(--accent-primary)',
    gratitude: 'var(--accent-secondary)',
    'check-in': 'var(--accent-muted)',
    growth: 'var(--accent-subtle)',
    emotional: 'var(--accent-tertiary)',
  }
  return colors[category] || 'var(--accent-primary)'
}

