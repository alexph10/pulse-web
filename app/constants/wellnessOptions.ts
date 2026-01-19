/**
 * Wellness Profile Options
 * Centralized configuration for all wellness-related dropdown/selection options
 */

export const lifeStageOptions = [
  { id: 'student', label: 'Student' },
  { id: 'working', label: 'Working professional' },
  { id: 'parent', label: 'Parent / Caregiver' },
  { id: 'retired', label: 'Retired' },
]

export const stressLevelOptions = [
  { id: 'low', label: 'Low' },
  { id: 'moderate', label: 'Moderate' },
  { id: 'high', label: 'High' },
  { id: 'severe', label: 'Severe' },
]

export const wellnessFocusOptions = [
  { id: 'anxiety', label: 'Managing anxiety' },
  { id: 'sleep', label: 'Improving sleep' },
  { id: 'stress', label: 'Reducing stress' },
  { id: 'mindfulness', label: 'Building mindfulness' },
  { id: 'energy', label: 'Boosting energy' },
  { id: 'focus', label: 'Improving focus' },
]

export const currentSupportOptions = [
  { id: 'therapy', label: 'Therapy / Counseling' },
  { id: 'meditation', label: 'Meditation apps' },
  { id: 'exercise', label: 'Regular exercise' },
  { id: 'neither', label: 'Neither' },
]

export const confidenceLabels = [
  'Not confident',
  'Slightly confident',
  'Somewhat confident',
  'Confident',
  'Very confident',
]

export const workLifeBalanceOptions = [
  { id: 'poor', label: 'Poor' },
  { id: 'fair', label: 'Fair' },
  { id: 'good', label: 'Good' },
  { id: 'excellent', label: 'Excellent' },
]

export const socialConnectionOptions = [
  { id: 'isolated', label: 'Isolated' },
  { id: 'somewhat', label: 'Somewhat connected' },
  { id: 'well', label: 'Well connected' },
  { id: 'very', label: 'Very supported' },
]

// Full pool of wellness focus items (rotates daily)
const allWellnessFocusItems = [
  // Reflections - all require input
  { 
    type: 'reflection' as const, 
    label: 'Reflection', 
    text: 'What brought you joy this week?', 
    description: 'Taking a moment to notice positive experiences helps build gratitude and emotional resilience.',
    isNew: true,
    inputRequired: true
  },
  { 
    type: 'reflection' as const, 
    label: 'Reflection', 
    text: "Notice one thing you're grateful for today", 
    description: 'Daily gratitude practice has been shown to improve mood and increase overall life satisfaction.',
    isNew: false,
    inputRequired: true
  },
  { 
    type: 'reflection' as const, 
    label: 'Reflection', 
    text: 'What made you smile recently?', 
    description: 'Recalling positive moments activates reward pathways in your brain and boosts your mood.',
    isNew: true,
    inputRequired: true
  },
  { 
    type: 'reflection' as const, 
    label: 'Reflection', 
    text: 'Who supported you this week?', 
    description: 'Acknowledging your support network strengthens social bonds and increases feelings of security.',
    isNew: false,
    inputRequired: true
  },
  { 
    type: 'reflection' as const, 
    label: 'Reflection', 
    text: 'What challenge did you overcome recently?', 
    description: 'Recognizing your resilience builds confidence and prepares you for future obstacles.',
    isNew: true,
    inputRequired: true
  },
  { 
    type: 'reflection' as const, 
    label: 'Reflection', 
    text: 'When did you feel most at peace today?', 
    description: 'Identifying calm moments helps you understand what environments and activities bring you tranquility.',
    isNew: false,
    inputRequired: true
  },
  // Tasks - some require input, some just actions
  { 
    type: 'task' as const, 
    label: 'Task', 
    text: 'Practice 5 minutes of mindful breathing', 
    description: 'Short breathing exercises can reduce stress hormones and activate your parasympathetic nervous system.',
    isNew: true,
    inputRequired: false
  },
  { 
    type: 'task' as const, 
    label: 'Task', 
    text: 'Take a 10-minute walk outside', 
    description: 'Brief outdoor walks combine gentle exercise with nature exposure, both proven mood boosters.',
    isNew: false,
    inputRequired: false
  },
  { 
    type: 'task' as const, 
    label: 'Task', 
    text: 'Drink a full glass of water', 
    description: 'Staying hydrated improves cognitive function, energy levels, and emotional regulation.',
    isNew: true,
    inputRequired: false
  },
  { 
    type: 'task' as const, 
    label: 'Task', 
    text: 'Stretch for 3 minutes', 
    description: 'Brief stretching releases physical tension and can interrupt stress patterns in your body.',
    isNew: false,
    inputRequired: false
  },
  { 
    type: 'task' as const, 
    label: 'Task', 
    text: 'Send a kind message to someone', 
    description: 'Acts of kindness release oxytocin and create positive connections with others.',
    isNew: true,
    inputRequired: false
  },
  { 
    type: 'task' as const, 
    label: 'Task', 
    text: 'Put your phone away for 30 minutes', 
    description: 'Digital breaks reduce cognitive overload and help you reconnect with the present moment.',
    isNew: false,
    inputRequired: false
  },
  { 
    type: 'task' as const, 
    label: 'Task', 
    text: 'Write down 3 things you accomplished today', 
    description: 'Documenting achievements reinforces self-efficacy and provides motivation for tomorrow.',
    isNew: true,
    inputRequired: true
  },
  { 
    type: 'task' as const, 
    label: 'Task', 
    text: 'Listen to a calming song', 
    description: 'Music therapy can lower cortisol levels and shift your emotional state in minutes.',
    isNew: false,
    inputRequired: false
  },
]

// Select 3 items based on the current day (rotates daily)
function getDailyWellnessItems() {
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
  
  // Separate reflections and tasks
  const reflections = allWellnessFocusItems.filter(item => item.type === 'reflection')
  const tasks = allWellnessFocusItems.filter(item => item.type === 'task')
  
  // Pick 1-2 reflections and 1-2 tasks for variety
  const reflectionIndex = dayOfYear % reflections.length
  const taskIndex1 = dayOfYear % tasks.length
  const taskIndex2 = (dayOfYear + 3) % tasks.length
  
  return [
    reflections[reflectionIndex],
    tasks[taskIndex1],
    tasks[taskIndex2 !== taskIndex1 ? taskIndex2 : (taskIndex2 + 1) % tasks.length],
  ]
}

// Wellness focus items (will be AI-generated later)
export const wellnessFocusItems = getDailyWellnessItems()

// Type exports for type safety
export type LifeStage = (typeof lifeStageOptions)[number]['id']
export type StressLevel = (typeof stressLevelOptions)[number]['id']
export type WellnessFocusId = (typeof wellnessFocusOptions)[number]['id']
export type CurrentSupport = (typeof currentSupportOptions)[number]['id']
export type WorkLifeBalance = (typeof workLifeBalanceOptions)[number]['id']
export type SocialConnection = (typeof socialConnectionOptions)[number]['id']
export type WellnessFocusItem = (typeof wellnessFocusItems)[number]
