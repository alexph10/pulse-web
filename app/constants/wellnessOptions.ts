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

// Wellness focus items (will be AI-generated later)
export const wellnessFocusItems = [
  { 
    type: 'reflection' as const, 
    label: 'Reflection', 
    text: 'What brought you joy this week?', 
    description: 'Taking a moment to notice positive experiences helps build gratitude and emotional resilience.',
    isNew: true 
  },
  { 
    type: 'task' as const, 
    label: 'Task', 
    text: 'Practice 5 minutes of mindful breathing', 
    description: 'Short breathing exercises can reduce stress hormones and activate your parasympathetic nervous system.',
    isNew: true 
  },
  { 
    type: 'reflection' as const, 
    label: 'Reflection', 
    text: "Notice one thing you're grateful for today", 
    description: 'Daily gratitude practice has been shown to improve mood and increase overall life satisfaction.',
    isNew: false 
  },
]

// Type exports for type safety
export type LifeStage = (typeof lifeStageOptions)[number]['id']
export type StressLevel = (typeof stressLevelOptions)[number]['id']
export type WellnessFocusId = (typeof wellnessFocusOptions)[number]['id']
export type CurrentSupport = (typeof currentSupportOptions)[number]['id']
export type WorkLifeBalance = (typeof workLifeBalanceOptions)[number]['id']
export type SocialConnection = (typeof socialConnectionOptions)[number]['id']
export type WellnessFocusItem = (typeof wellnessFocusItems)[number]
