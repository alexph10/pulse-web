/**
 * Entry Templates for Journaling
 * Pre-structured templates to help users get started
 */

export interface EntryTemplate {
  id: string
  name: string
  description: string
  content: string
  category: 'daily' | 'gratitude' | 'reflection' | 'growth' | 'goal'
}

export const entryTemplates: EntryTemplate[] = [
  {
    id: 'daily-checkin',
    name: 'Daily Check-in',
    description: 'Quick reflection on how you are feeling',
    content: 'How are you feeling today? What has been on your mind?\n\n',
    category: 'daily',
  },
  {
    id: 'gratitude',
    name: 'Gratitude Journal',
    description: 'Focus on what you are grateful for',
    content: 'What are three things you are grateful for today?\n\n1. \n2. \n3. \n\n',
    category: 'gratitude',
  },
  {
    id: 'goal-reflection',
    name: 'Goal Reflection',
    description: 'Reflect on your progress toward goals',
    content: 'How did you progress toward your goals today?\n\nWhat went well:\n\nWhat could be improved:\n\n',
    category: 'goal',
  },
  {
    id: 'deep-reflection',
    name: 'Deep Reflection',
    description: 'Explore patterns in your thoughts and feelings',
    content: 'What patterns do you notice in your thoughts and feelings lately?\n\nHow have these patterns affected your day?\n\n',
    category: 'reflection',
  },
  {
    id: 'growth-mindset',
    name: 'Growth Mindset',
    description: 'Reflect on what you learned about yourself',
    content: 'What did you learn about yourself today?\n\nHow can you apply this learning going forward?\n\n',
    category: 'growth',
  },
]

export function getTemplateById(id: string): EntryTemplate | undefined {
  return entryTemplates.find((template) => template.id === id)
}

export function getTemplateCategoryColor(category: EntryTemplate['category']): string {
  const colors: Record<EntryTemplate['category'], string> = {
    daily: 'var(--accent-primary)',
    gratitude: 'var(--accent-secondary)',
    reflection: 'var(--accent-muted)',
    growth: 'var(--accent-subtle)',
    goal: 'var(--accent-tertiary)',
  }
  return colors[category] || 'var(--accent-primary)'
}

