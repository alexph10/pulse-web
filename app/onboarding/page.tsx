'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Brand from '@/app/components/layout/Brand'
import ThemeToggle from '@/app/components/layout/ThemeToggle'
import { SelectionGrid, RankedList, ScrollPicker } from '@/app/components/onboarding'
import {
  confidenceLabels,
  currentSupportOptions,
  lifeStageOptions,
  socialConnectionOptions,
  stressLevelOptions,
  wellnessFocusOptions,
  workLifeBalanceOptions,
} from '@/app/constants/wellnessOptions'
import styles from './onboarding.module.css'

type WellnessFocusSelection = { id: string; priority: number }

export default function OnboardingPage() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)

  const [lifeStage, setLifeStage] = useState<string | null>(null)
  const [sleepAverage, setSleepAverage] = useState(7)
  const [stressLevel, setStressLevel] = useState<string | null>(null)
  const [wellnessFocus, setWellnessFocus] = useState<WellnessFocusSelection[]>([])
  const [currentSupport, setCurrentSupport] = useState<string | null>(null)
  const [wellnessConfidence, setWellnessConfidence] = useState(3)
  const [workLifeBalance, setWorkLifeBalance] = useState<string | null>(null)
  const [socialConnection, setSocialConnection] = useState<string | null>(null)

  const steps = useMemo(
    () => [
      {
        id: 'lifeStage',
        title: 'What is your life stage?',
        description: 'Select your current life stage.',
        body: (
          <SelectionGrid options={lifeStageOptions} selected={lifeStage} onChange={setLifeStage} />
        ),
        isValid: Boolean(lifeStage),
      },
      {
        id: 'sleepAverage',
        title: 'How much do you sleep?',
        description: 'How many hours do you sleep on average?',
        body: (
          <ScrollPicker
            value={sleepAverage}
            onChange={setSleepAverage}
            min={4}
            max={12}
            unit="hrs/night"
          />
        ),
        isValid: true,
      },
      {
        id: 'stressLevel',
        title: 'What is your stress level?',
        description: 'What is your current stress level?',
        body: (
          <SelectionGrid
            options={stressLevelOptions}
            selected={stressLevel}
            onChange={setStressLevel}
          />
        ),
        isValid: Boolean(stressLevel),
      },
      {
        id: 'wellnessFocus',
        title: 'What is your wellness focus?',
        description:
          'Choose up to 3 focus areas. Your goals help us prioritize recommendations and create a plan that aligns with what matters most.',
        body: (
          <RankedList
            options={wellnessFocusOptions}
            selected={wellnessFocus}
            onChange={setWellnessFocus}
            maxSelections={3}
          />
        ),
        isValid: wellnessFocus.length > 0,
      },
      {
        id: 'currentSupport',
        title: 'What support do you have?',
        description: 'What support do you currently have?',
        body: (
          <SelectionGrid
            options={currentSupportOptions}
            selected={currentSupport}
            onChange={setCurrentSupport}
          />
        ),
        isValid: Boolean(currentSupport),
      },
      {
        id: 'wellnessConfidence',
        title: 'How confident are you?',
        description: 'How confident are you in managing your wellness?',
        body: (
          <ScrollPicker
            value={wellnessConfidence}
            onChange={setWellnessConfidence}
            min={1}
            max={5}
            unit={confidenceLabels[wellnessConfidence - 1] ?? ''}
          />
        ),
        isValid: true,
      },
      {
        id: 'workLifeBalance',
        title: 'How is your work-life balance?',
        description: 'Your work-life balance affects stress levels, energy, and overall wellbeing.',
        body: (
          <SelectionGrid
            options={workLifeBalanceOptions}
            selected={workLifeBalance}
            onChange={setWorkLifeBalance}
          />
        ),
        isValid: Boolean(workLifeBalance),
      },
      {
        id: 'socialConnection',
        title: 'How connected do you feel?',
        description: 'Social connections are vital for mental health and emotional support.',
        body: (
          <SelectionGrid
            options={socialConnectionOptions}
            selected={socialConnection}
            onChange={setSocialConnection}
          />
        ),
        isValid: Boolean(socialConnection),
      },
    ],
    [
      lifeStage,
      sleepAverage,
      stressLevel,
      wellnessFocus,
      currentSupport,
      wellnessConfidence,
      workLifeBalance,
      socialConnection,
    ],
  )

  const totalSteps = steps.length
  const activeStep = steps[currentStep]
  const canContinue = activeStep?.isValid ?? false
  const isLastStep = currentStep === totalSteps - 1

  const handleNext = () => {
    if (!canContinue) return
    if (isLastStep) {
      const payload = {
        lifeStage,
        sleepAverage,
        stressLevel,
        wellnessFocus: wellnessFocus
          .sort((a, b) => a.priority - b.priority)
          .map((item) => item.id),
        currentSupport,
        wellnessConfidence,
        workLifeBalance,
        socialConnection,
      }
      console.info('Onboarding payload (pending persistence):', payload)
      return
    }
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1))
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  return (
    <div 
      className={styles.onboardingContainer}
      data-theme={isDarkMode ? 'dark' : 'light'}
    >
      <div className={styles.navBorder} />
      <div className={styles.leftOutline} />

      <div className={styles.dotIndicator}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`${styles.dot} ${index === currentStep ? styles.active : ''}`}
          />
        ))}
      </div>

      <Brand />
      <ThemeToggle isDarkMode={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />

      <div className={styles.onboardingContent}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep.id}
            className={styles.stepContent}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div className={styles.stepMeta}>
              Step {currentStep + 1} of {totalSteps}
            </div>
            <div className={styles.stepHeader}>
              <h1 className={styles.stepTitle}>{activeStep.title}</h1>
              <p className={styles.stepDescription}>{activeStep.description}</p>
            </div>
            <div className={styles.stepBody}>{activeStep.body}</div>
            <div className={styles.stepFooter} />
          </motion.div>
        </AnimatePresence>
      </div>
      <div
        style={{
          position: 'fixed',
          right: 32,
          bottom: 32,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 20,
        }}
      >
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 0}
          aria-label="Back"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '999px',
            border: '1px solid var(--border-emphasis)',
            background: 'var(--surface)',
            color: 'var(--text-primary)',
            display: 'grid',
            placeItems: 'center',
            cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
            opacity: currentStep === 0 ? 0.4 : 1,
            transition: 'all 150ms ease',
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 6L9 12L15 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!canContinue}
          style={{
            minWidth: '130px',
            height: '40px',
            borderRadius: '999px',
            border: '1px solid transparent',
            background: 'var(--text-primary)',
            color: 'var(--text-inverse)',
            fontSize: '0.9rem',
            fontWeight: 600,
            letterSpacing: '0.01em',
            cursor: canContinue ? 'pointer' : 'not-allowed',
            opacity: canContinue ? 1 : 0.4,
            transition: 'all 150ms ease',
          }}
        >
          {isLastStep ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  )
}
