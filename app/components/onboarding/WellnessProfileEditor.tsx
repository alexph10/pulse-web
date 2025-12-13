"use client"

import React, { useState } from 'react'
import OnboardingLayout from './OnboardingLayout'
import SelectionGrid from './SelectionGrid'
import RankedList from './RankedList'
import ScrollPicker from '../shared/ScrollPicker'
import HexagonGauge from './HexagonGauge'

// Profile data types
export interface WellnessProfile {
  lifeStage: string | null
  sleepHours: number
  stressLevel: number
  wellnessFocus: { id: string; priority: number }[]
  currentSupport: string | null
  wellnessConfidence: number
}

interface WellnessProfileEditorProps {
  initialProfile?: Partial<WellnessProfile>
  onSave: (profile: WellnessProfile) => void
  onClose: () => void
}

// Options
const LIFE_STAGE_OPTIONS = [
  { id: 'student', label: 'Student' },
  { id: 'professional', label: 'Professional' },
  { id: 'parent', label: 'Parent' },
  { id: 'other', label: 'Other' },
]

const WELLNESS_FOCUS_OPTIONS = [
  { id: 'anxiety', label: 'Managing anxiety' },
  { id: 'sleep', label: 'Improving sleep' },
  { id: 'stress', label: 'Reducing stress' },
  { id: 'confidence', label: 'Building confidence' },
  { id: 'emotions', label: 'Processing emotions' },
  { id: 'habits', label: 'Developing healthy habits' },
]

const SUPPORT_OPTIONS = [
  { id: 'therapist', label: 'Therapist' },
  { id: 'medication', label: 'Medication' },
  { id: 'both', label: 'Both' },
  { id: 'neither', label: 'Neither' },
]

const STRESS_LABELS = [
  'Very low',
  'Manageable',
  'Moderate',
  'High',
  'Overwhelming',
]

const CONFIDENCE_LABELS = [
  'Just starting',
  'Learning basics',
  'Somewhat confident',
  'Fairly confident',
  'Very confident',
]

type Step = 'lifeStage' | 'sleep' | 'stress' | 'focus' | 'support' | 'confidence'

const STEPS: Step[] = ['lifeStage', 'sleep', 'stress', 'focus', 'support', 'confidence']

export default function WellnessProfileEditor({ 
  initialProfile, 
  onSave, 
  onClose 
}: WellnessProfileEditorProps) {
  const [currentStep, setCurrentStep] = useState<Step>('lifeStage')
  const [profile, setProfile] = useState<WellnessProfile>({
    lifeStage: initialProfile?.lifeStage ?? null,
    sleepHours: initialProfile?.sleepHours ?? 7,
    stressLevel: initialProfile?.stressLevel ?? 3,
    wellnessFocus: initialProfile?.wellnessFocus ?? [],
    currentSupport: initialProfile?.currentSupport ?? null,
    wellnessConfidence: initialProfile?.wellnessConfidence ?? 3,
  })

  const currentIndex = STEPS.indexOf(currentStep)
  const isFirstStep = currentIndex === 0
  const isLastStep = currentIndex === STEPS.length - 1

  const goBack = () => {
    if (isFirstStep) {
      onClose()
    } else {
      setCurrentStep(STEPS[currentIndex - 1])
    }
  }

  const goNext = () => {
    if (isLastStep) {
      onSave(profile)
    } else {
      setCurrentStep(STEPS[currentIndex + 1])
    }
  }

  const canContinue = (): boolean => {
    switch (currentStep) {
      case 'lifeStage':
        return profile.lifeStage !== null
      case 'sleep':
        return true
      case 'stress':
        return true
      case 'focus':
        return profile.wellnessFocus.length > 0
      case 'support':
        return profile.currentSupport !== null
      case 'confidence':
        return true
      default:
        return false
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 'lifeStage':
        return (
          <OnboardingLayout
            title="Life stage"
            helperText="What best describes you right now? Your life context helps us tailor advice and understand your daily pressures."
            onBack={goBack}
            onContinue={goNext}
            continueDisabled={!canContinue()}
          >
            <SelectionGrid
              options={LIFE_STAGE_OPTIONS}
              selected={profile.lifeStage}
              onChange={(id) => setProfile({ ...profile, lifeStage: id })}
            />
          </OnboardingLayout>
        )

      case 'sleep':
        return (
          <OnboardingLayout
            title="Sleep average"
            helperText="How much sleep do you typically get? Sleep is foundational to mental wellness."
            onBack={goBack}
            onContinue={goNext}
            continueDisabled={!canContinue()}
          >
            <ScrollPicker
              value={profile.sleepHours}
              onChange={(value) => setProfile({ ...profile, sleepHours: value })}
              min={3}
              max={12}
              unit=" hrs/night"
            />
          </OnboardingLayout>
        )

      case 'stress':
        return (
          <OnboardingLayout
            title="Current stress level"
            helperText="How would you rate your current stress? This helps us calibrate the intensity of support."
            onBack={goBack}
            onContinue={goNext}
            continueDisabled={!canContinue()}
          >
            <HexagonGauge
              value={profile.stressLevel}
              onChange={(value) => setProfile({ ...profile, stressLevel: value })}
              labels={STRESS_LABELS}
            />
          </OnboardingLayout>
        )

      case 'focus':
        return (
          <OnboardingLayout
            title="Wellness focus"
            helperText="What do you want to work on? Choose a primary and secondary focus to help us prioritize."
            onBack={goBack}
            onContinue={goNext}
            continueDisabled={!canContinue()}
          >
            <RankedList
              options={WELLNESS_FOCUS_OPTIONS}
              selected={profile.wellnessFocus}
              onChange={(selected) => setProfile({ ...profile, wellnessFocus: selected })}
              maxSelections={2}
            />
          </OnboardingLayout>
        )

      case 'support':
        return (
          <OnboardingLayout
            title="Current support"
            helperText="Are you currently receiving any support? This helps us understand your situation."
            onBack={goBack}
            onContinue={goNext}
            continueDisabled={!canContinue()}
          >
            <SelectionGrid
              options={SUPPORT_OPTIONS}
              selected={profile.currentSupport}
              onChange={(id) => setProfile({ ...profile, currentSupport: id })}
            />
          </OnboardingLayout>
        )

      case 'confidence':
        return (
          <OnboardingLayout
            title="Wellness confidence"
            helperText="How confident do you feel about managing your mental health? This helps us calibrate guidance."
            onBack={goBack}
            onContinue={goNext}
            continueLabel="Save Profile"
            continueDisabled={!canContinue()}
          >
            <HexagonGauge
              value={profile.wellnessConfidence}
              onChange={(value) => setProfile({ ...profile, wellnessConfidence: value })}
              labels={CONFIDENCE_LABELS}
            />
          </OnboardingLayout>
        )

      default:
        return null
    }
  }

  return renderStep()
}
