'use client'

import { entryTemplates, getTemplateCategoryColor, type EntryTemplate } from '@/lib/prompts/entryTemplates'
import { useState } from 'react'
import styles from './EntryTemplates.module.css'

interface EntryTemplatesProps {
  onTemplateSelect: (templateContent: string) => void
  isVisible?: boolean
}

export function EntryTemplates({ onTemplateSelect, isVisible = true }: EntryTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [showTemplates, setShowTemplates] = useState(false)

  if (!isVisible) {
    return null
  }

  const handleTemplateClick = (template: EntryTemplate) => {
    setSelectedTemplate(template.id)
    onTemplateSelect(template.content)
    setShowTemplates(false)
  }

  return (
    <div className={styles.container}>
      <button
        className={styles.toggleButton}
        onClick={() => setShowTemplates(!showTemplates)}
        aria-label={showTemplates ? 'Hide templates' : 'Show templates'}
      >
        {showTemplates ? 'Hide templates' : 'Choose a template (optional)'}
      </button>

      {showTemplates && (
        <div className={styles.templatesGrid}>
          <button
            className={`${styles.templateCard} ${selectedTemplate === null ? styles.selected : ''}`}
            onClick={() => {
              setSelectedTemplate(null)
              onTemplateSelect('')
              setShowTemplates(false)
            }}
          >
            <div className={styles.templateContent}>
              <h4 className={styles.templateName}>Start from scratch</h4>
              <p className={styles.templateDescription}>Write freely without a template</p>
            </div>
          </button>

          {entryTemplates.map((template) => {
            const accentColor = getTemplateCategoryColor(template.category)
            return (
              <button
                key={template.id}
                className={`${styles.templateCard} ${selectedTemplate === template.id ? styles.selected : ''}`}
                onClick={() => handleTemplateClick(template)}
                style={{
                  borderLeftColor: accentColor,
                }}
              >
                <div className={styles.templateContent}>
                  <h4 className={styles.templateName}>{template.name}</h4>
                  <p className={styles.templateDescription}>{template.description}</p>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

