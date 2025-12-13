'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import CalendarHeatmap from '../ui/CalendarHeatmap'
import MediumCard from './MediumCard'
import WelcomeCard from './WelcomeCard'
import styles from './HomeCarousel.module.css'

interface HomeCarouselProps {
  firstName: string
  onAskQuestion: () => void
  onSeeInsights: () => void
}

export default function HomeCarousel({ firstName, onAskQuestion, onSeeInsights }: HomeCarouselProps) {
  const [activeSlide, setActiveSlide] = useState(0)

  return (
    <div className={styles.carouselWrapper}>
      <div className={styles.carouselContent}>
        {/* Slide 1: Heatmap + Welcome */}
        <motion.div
          className={`${styles.carouselSlide} ${activeSlide === 0 ? styles.carouselSlideActive : ''}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: activeSlide === 0 ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className={styles.cardsCarousel}>
            <motion.div
              className={styles.insightCard}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <CalendarHeatmap />
            </motion.div>

            <motion.div
              className={styles.secondaryCard}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <WelcomeCard firstName={firstName} onAskQuestion={onAskQuestion} onSeeInsights={onSeeInsights} />
            </motion.div>
          </div>

          <div className={styles.mediumCardsRow}>
            <div className={styles.mediumCard}>
              <MediumCard title="Quick Fixes">
                <p className={styles.recommendationsParagraph}>
                  <span className={styles.textLight}>We&apos;ll analyze your </span>
                  <span className={styles.textMedium}>wellness patterns </span>
                  <span className={styles.textLight}>to generate </span>
                  <span className={styles.textDark}>personalized insights </span>
                  <span className={styles.textLight}>and </span>
                  <span className={styles.textDark}>recommendations </span>
                  <span className={styles.textLight}>tailored to your mental health journey.</span>
                </p>
              </MediumCard>
            </div>
            <div className={styles.mediumCard}>
              <MediumCard title="Daily Goals">
                <p className={styles.recommendationsParagraph}>
                  <span className={styles.textLight}>Track your </span>
                  <span className={styles.textDark}>daily progress </span>
                  <span className={styles.textLight}>and build </span>
                  <span className={styles.textMedium}>healthy habits </span>
                  <span className={styles.textLight}>that support your </span>
                  <span className={styles.textDark}>mental wellbeing.</span>
                </p>
              </MediumCard>
            </div>
          </div>
        </motion.div>

        {/* Slide 2: Wellness Visualizations */}
        <motion.div
          className={`${styles.carouselSlide} ${activeSlide === 1 ? styles.carouselSlideActive : ''}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: activeSlide === 1 ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className={styles.cardsCarousel}>
            <div className={styles.wellnessTrendCard}></div>
            <div className={styles.habitStreakCard}></div>
            <div className={`${styles.correlationCard} ${styles.correlationCardLarge}`}></div>
          </div>
        </motion.div>
      </div>

      {/* Dot navigation */}
      <div className={styles.carouselDots}>
        {[0, 1].map((index) => (
          <button
            key={index}
            className={`${styles.carouselDot} ${activeSlide === index ? styles.carouselDotActive : ''}`}
            onClick={() => setActiveSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

