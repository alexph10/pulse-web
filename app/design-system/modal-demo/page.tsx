'use client'

import { useState } from 'react'
import { Modal } from '@/app/components/ui/Modal'
import { Button } from '@/app/components/ui/Button'
import { Input } from '@/app/components/ui/Input'
import { Textarea } from '@/app/components/ui/Textarea'
import styles from './demo.module.css'

export default function ModalDemo() {
  const [simpleModal, setSimpleModal] = useState(false)
  const [formModal, setFormModal] = useState(false)
  const [confirmModal, setConfirmModal] = useState(false)
  const [largeModal, setLargeModal] = useState(false)

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Modal Component Demo</h1>
        <p className={styles.subtitle}>Examples of the Modal component with different configurations</p>

        <div className={styles.buttonGrid}>
          {/* Simple Modal */}
          <Button onClick={() => setSimpleModal(true)}>
            Simple Modal
          </Button>

          {/* Form Modal */}
          <Button onClick={() => setFormModal(true)}>
            Form Modal
          </Button>

          {/* Confirmation Modal */}
          <Button onClick={() => setConfirmModal(true)} variant="danger">
            Confirm Action
          </Button>

          {/* Large Modal */}
          <Button onClick={() => setLargeModal(true)} variant="secondary">
            Large Modal
          </Button>
        </div>

        {/* Simple Modal */}
        <Modal open={simpleModal} onOpenChange={setSimpleModal} size="sm">
          <Modal.Header>
            <Modal.Title>Simple Modal</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p style={{ margin: 0, color: '#e4ddd3', lineHeight: 1.5 }}>
              This is a simple modal with minimal content. It demonstrates the basic structure
              with a header, body, and footer.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="ghost" onClick={() => setSimpleModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Form Modal */}
        <Modal open={formModal} onOpenChange={setFormModal} size="md">
          <Modal.Header>
            <Modal.Title>Create Journal Entry</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="entry-title" className={styles.label}>
                  Title
                </label>
                <Input
                  id="entry-title"
                  placeholder="What's on your mind?"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="entry-content" className={styles.label}>
                  Content
                </label>
                <Textarea
                  id="entry-content"
                  placeholder="Write your thoughts here..."
                  rows={6}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="entry-mood" className={styles.label}>
                  Mood
                </label>
                <Input
                  id="entry-mood"
                  placeholder="How are you feeling?"
                />
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer align="between">
            <Button variant="ghost" onClick={() => setFormModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setFormModal(false)}>
              Save Entry
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Confirmation Modal */}
        <Modal open={confirmModal} onOpenChange={setConfirmModal} size="sm">
          <Modal.Header showClose={false}>
            <Modal.Title>Delete Goal?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p style={{ margin: 0, color: '#a39d96', lineHeight: 1.5 }}>
              Are you sure you want to delete this goal? This action cannot be undone.
            </p>
          </Modal.Body>
          <Modal.Footer align="between">
            <Button variant="ghost" onClick={() => setConfirmModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => setConfirmModal(false)}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Large Modal */}
        <Modal open={largeModal} onOpenChange={setLargeModal} size="lg">
          <Modal.Header>
            <Modal.Title>Analytics Overview</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className={styles.analyticsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Total Entries</div>
                <div className={styles.statValue}>156</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Goals Completed</div>
                <div className={styles.statValue}>42</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Current Streak</div>
                <div className={styles.statValue}>12</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Average Mood</div>
                <div className={styles.statValue}>7.8</div>
              </div>
            </div>
            <p style={{ marginTop: 24, color: '#a39d96', lineHeight: 1.6 }}>
              This large modal demonstrates how the component handles more complex layouts
              and larger amounts of content. The body area is scrollable if content exceeds
              the available space.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="ghost" onClick={() => setLargeModal(false)}>
              Close
            </Button>
            <Button onClick={() => setLargeModal(false)}>
              Export Data
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Usage Code Examples */}
        <div className={styles.codeSection}>
          <h2 className={styles.sectionTitle}>Usage Examples</h2>
          
          <div className={styles.codeBlock}>
            <h3 className={styles.codeTitle}>Basic Modal</h3>
            <pre className={styles.code}>{`<Modal open={isOpen} onOpenChange={setIsOpen} size="md">
  <Modal.Header>
    <Modal.Title>Modal Title</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {/* Your content here */}
  </Modal.Body>
  <Modal.Footer>
    <Button onClick={handleClose}>Close</Button>
  </Modal.Footer>
</Modal>`}</pre>
          </div>

          <div className={styles.codeBlock}>
            <h3 className={styles.codeTitle}>Sizes</h3>
            <pre className={styles.code}>{`size="sm"   // 400px max width
size="md"   // 600px max width (default)
size="lg"   // 800px max width
size="full" // 1200px max width`}</pre>
          </div>

          <div className={styles.codeBlock}>
            <h3 className={styles.codeTitle}>Footer Alignment</h3>
            <pre className={styles.code}>{`<Modal.Footer align="left">     // Left aligned
<Modal.Footer align="center">   // Center aligned
<Modal.Footer align="right">    // Right aligned (default)
<Modal.Footer align="between">  // Space between`}</pre>
          </div>
        </div>
      </div>
    </div>
  )
}

