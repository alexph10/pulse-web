/**
 * Color Palette Preview Page
 * Displays all Pulse colors for design reference
 */

'use client'

import { pulseColors, getMoodColor, getMoodBgColor } from '@/app/lib/colors/pulse-colors'
import { Card } from '@/app/components/ui/Card'
import styles from './colors.module.css'

export default function ColorsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Pulse Color System</h1>
        <p className={styles.description}>
          Comprehensive color palette for mental wellness UI and data visualization
        </p>
      </div>

      {/* Brand Colors */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Brand Colors</h2>
        <p className={styles.sectionDesc}>Primary brand identity colors</p>
        <div className={styles.colorGrid}>
          {Object.entries(pulseColors.brand).map(([name, color]) => (
            <ColorCard
              key={name}
              name={name}
              color={color}
              showBorder={name === 'subtle'}
            />
          ))}
        </div>
      </section>

      {/* Mood Colors */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Mood Colors</h2>
        <p className={styles.sectionDesc}>Used for journal entries and mood tracking</p>
        <div className={styles.moodGrid}>
          {Object.entries(pulseColors.mood).map(([name, colors]) => (
            <MoodCard key={name} name={name} colors={colors} />
          ))}
        </div>
      </section>

      {/* Semantic Colors */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Semantic Colors</h2>
        <p className={styles.sectionDesc}>Status and feedback colors</p>
        <div className={styles.moodGrid}>
          {Object.entries(pulseColors.semantic).map(([name, colors]) => (
            <SemanticCard key={name} name={name} colors={colors} />
          ))}
        </div>
      </section>

      {/* Dark Theme Colors */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Dark Theme Palette</h2>
        <p className={styles.sectionDesc}>Primary theme colors</p>
        
        <div className={styles.subsection}>
          <h3 className={styles.subsectionTitle}>Backgrounds</h3>
          <div className={styles.colorGrid}>
            {Object.entries(pulseColors.dark.background).map(([name, color]) => (
              <ColorCard key={name} name={name} color={color} showBorder />
            ))}
          </div>
        </div>

        <div className={styles.subsection}>
          <h3 className={styles.subsectionTitle}>Text</h3>
          <div className={styles.colorGrid}>
            {Object.entries(pulseColors.dark.text).map(([name, color]) => (
              <ColorCard key={name} name={name} color={color} isText />
            ))}
          </div>
        </div>

        <div className={styles.subsection}>
          <h3 className={styles.subsectionTitle}>Borders</h3>
          <div className={styles.colorGrid}>
            {Object.entries(pulseColors.dark.border).map(([name, color]) => (
              <ColorCard key={name} name={name} color={color} showBorder isBorder />
            ))}
          </div>
        </div>
      </section>

      {/* Chart Colors */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Chart Colors</h2>
        <p className={styles.sectionDesc}>Data visualization palettes</p>
        
        <div className={styles.subsection}>
          <h3 className={styles.subsectionTitle}>Primary Scale</h3>
          <div className={styles.scaleGrid}>
            {pulseColors.charts.primary.map((color, index) => (
              <ColorCard key={index} name={`Step ${index + 1}`} color={color} />
            ))}
          </div>
        </div>

        <div className={styles.subsection}>
          <h3 className={styles.subsectionTitle}>Sequential</h3>
          <div className={styles.scaleGrid}>
            {pulseColors.charts.sequential.map((color, index) => (
              <ColorCard key={index} name={`Color ${index + 1}`} color={color} />
            ))}
          </div>
        </div>

        <div className={styles.subsection}>
          <h3 className={styles.subsectionTitle}>Categorical</h3>
          <div className={styles.scaleGrid}>
            {pulseColors.charts.categorical.map((color, index) => (
              <ColorCard key={index} name={`Cat ${index + 1}`} color={color} />
            ))}
          </div>
        </div>
      </section>

      {/* Gradients */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Gradients</h2>
        <p className={styles.sectionDesc}>Background and overlay gradients</p>
        <div className={styles.gradientGrid}>
          {Object.entries(pulseColors.gradients).map(([name, gradient]) => (
            <GradientCard key={name} name={name} gradient={gradient} />
          ))}
        </div>
      </section>

      {/* Shadows */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Shadows</h2>
        <p className={styles.sectionDesc}>Elevation and depth system</p>
        <div className={styles.shadowGrid}>
          {Object.entries(pulseColors.shadows).map(([name, shadow]) => (
            <ShadowCard key={name} name={name} shadow={shadow} />
          ))}
        </div>
      </section>
    </div>
  )
}

// === COMPONENT: Color Card ===
interface ColorCardProps {
  name: string
  color: string
  showBorder?: boolean
  isText?: boolean
  isBorder?: boolean
}

function ColorCard({ name, color, showBorder, isText, isBorder }: ColorCardProps) {
  return (
    <Card className={styles.colorCard}>
      <div
        className={styles.colorSwatch}
        style={{
          background: isText ? pulseColors.dark.background.surface : color,
          color: isText ? color : undefined,
          border: showBorder ? `2px solid ${isBorder ? color : 'var(--border-subtle)'}` : undefined,
        }}
      >
        {isText && <span className={styles.textSample}>Aa</span>}
      </div>
      <div className={styles.colorInfo}>
        <div className={styles.colorName}>{name}</div>
        <div className={styles.colorValue}>{color}</div>
      </div>
    </Card>
  )
}

// === COMPONENT: Mood Card ===
interface MoodCardProps {
  name: string
  colors: {
    base: string
    light: string
    dark: string
    bg: string
  }
}

function MoodCard({ name, colors }: MoodCardProps) {
  return (
    <Card className={styles.moodCard}>
      <div className={styles.moodHeader}>
        <div
          className={styles.moodIcon}
          style={{ background: colors.base }}
        />
        <div className={styles.moodName}>{name}</div>
      </div>
      <div className={styles.moodColors}>
        <div className={styles.moodColorItem}>
          <div
            className={styles.moodColorSwatch}
            style={{ background: colors.light }}
          />
          <span>Light</span>
        </div>
        <div className={styles.moodColorItem}>
          <div
            className={styles.moodColorSwatch}
            style={{ background: colors.base }}
          />
          <span>Base</span>
        </div>
        <div className={styles.moodColorItem}>
          <div
            className={styles.moodColorSwatch}
            style={{ background: colors.dark }}
          />
          <span>Dark</span>
        </div>
      </div>
      <div className={styles.moodBg} style={{ background: colors.bg }}>
        Background
      </div>
    </Card>
  )
}

// === COMPONENT: Semantic Card ===
interface SemanticCardProps {
  name: string
  colors: {
    base: string
    light: string
    dark: string
    bg: string
    border: string
  }
}

function SemanticCard({ name, colors }: SemanticCardProps) {
  return (
    <Card className={styles.moodCard}>
      <div className={styles.moodHeader}>
        <div
          className={styles.moodIcon}
          style={{ background: colors.base }}
        />
        <div className={styles.moodName}>{name}</div>
      </div>
      <div className={styles.moodColors}>
        <div className={styles.moodColorItem}>
          <div
            className={styles.moodColorSwatch}
            style={{ background: colors.light }}
          />
          <span>Light</span>
        </div>
        <div className={styles.moodColorItem}>
          <div
            className={styles.moodColorSwatch}
            style={{ background: colors.base }}
          />
          <span>Base</span>
        </div>
        <div className={styles.moodColorItem}>
          <div
            className={styles.moodColorSwatch}
            style={{ background: colors.dark }}
          />
          <span>Dark</span>
        </div>
      </div>
    </Card>
  )
}

// === COMPONENT: Gradient Card ===
interface GradientCardProps {
  name: string
  gradient: string
}

function GradientCard({ name, gradient }: GradientCardProps) {
  return (
    <Card className={styles.gradientCard}>
      <div
        className={styles.gradientSwatch}
        style={{ background: gradient }}
      />
      <div className={styles.colorInfo}>
        <div className={styles.colorName}>{name}</div>
        <div className={styles.colorValue}>{gradient}</div>
      </div>
    </Card>
  )
}

// === COMPONENT: Shadow Card ===
interface ShadowCardProps {
  name: string
  shadow: string
}

function ShadowCard({ name, shadow }: ShadowCardProps) {
  return (
    <Card className={styles.shadowCard}>
      <div
        className={styles.shadowSwatch}
        style={{ boxShadow: shadow }}
      />
      <div className={styles.colorInfo}>
        <div className={styles.colorName}>{name}</div>
        <div className={styles.colorValue}>{shadow}</div>
      </div>
    </Card>
  )
}
