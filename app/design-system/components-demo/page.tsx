'use client'

import { useState } from 'react'
import { Divider, Table, Button } from '@/app/components/ui'
import styles from './demo.module.css'

// Sample data for table
const journalEntries = [
  { id: '1', date: '2024-11-24', mood: 'Calm', sentiment: 'Positive', preview: 'Had a productive day working on...' },
  { id: '2', date: '2024-11-23', mood: 'Energetic', sentiment: 'Positive', preview: 'Great workout session this morning...' },
  { id: '3', date: '2024-11-22', mood: 'Reflective', sentiment: 'Neutral', preview: 'Thinking about future goals...' },
  { id: '4', date: '2024-11-21', mood: 'Content', sentiment: 'Positive', preview: 'Spent quality time with family...' },
  { id: '5', date: '2024-11-20', mood: 'Stressed', sentiment: 'Negative', preview: 'Tight deadline at work today...' },
]

const goals = [
  { id: '1', title: 'Complete project proposal', deadline: '2024-12-01', status: 'In Progress', progress: 75 },
  { id: '2', title: 'Learn TypeScript', deadline: '2024-12-15', status: 'In Progress', progress: 40 },
  { id: '3', title: 'Exercise 3x per week', deadline: '2024-12-31', status: 'Active', progress: 60 },
  { id: '4', title: 'Read 2 books', deadline: '2024-12-31', status: 'Active', progress: 50 },
]

export default function ComponentsDemo() {
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null)
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null)

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : sortDirection === 'desc' ? null : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Components Demo</h1>
        <p className={styles.subtitle}>Divider and Table components showcase</p>

        {/* Divider Examples */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Divider Component</h2>
          
          <div className={styles.dividerSection}>
            <h3 className={styles.exampleTitle}>Horizontal Divider</h3>
            <p className={styles.text}>Content above</p>
            <Divider />
            <p className={styles.text}>Content below</p>
          </div>

          <div className={styles.dividerSection}>
            <h3 className={styles.exampleTitle}>With Label</h3>
            <Divider label="Analytics" />
          </div>

          <div className={styles.dividerSection}>
            <h3 className={styles.exampleTitle}>Spacing Variants</h3>
            <p className={styles.text}>Small spacing</p>
            <Divider spacing="sm" />
            <p className={styles.text}>Medium spacing (default)</p>
            <Divider spacing="md" />
            <p className={styles.text}>Large spacing</p>
            <Divider spacing="lg" />
            <p className={styles.text}>End</p>
          </div>

          <div className={styles.dividerSection}>
            <h3 className={styles.exampleTitle}>Vertical Divider</h3>
            <div style={{ display: 'flex', alignItems: 'center', height: '40px' }}>
              <span className={styles.text}>Left</span>
              <Divider orientation="vertical" />
              <span className={styles.text}>Middle</span>
              <Divider orientation="vertical" />
              <span className={styles.text}>Right</span>
            </div>
          </div>
        </section>

        <Divider spacing="lg" />

        {/* Table Examples */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Table Component</h2>

          <div className={styles.tableSection}>
            <h3 className={styles.exampleTitle}>Journal Entries</h3>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head 
                    sortable 
                    onSort={() => handleSort('date')}
                    sortDirection={sortColumn === 'date' ? sortDirection : null}
                  >
                    Date
                  </Table.Head>
                  <Table.Head>Mood</Table.Head>
                  <Table.Head>Sentiment</Table.Head>
                  <Table.Head>Preview</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {journalEntries.map((entry) => (
                  <Table.Row 
                    key={entry.id}
                    onClick={() => setSelectedEntry(entry.id)}
                    selected={selectedEntry === entry.id}
                  >
                    <Table.Cell>{entry.date}</Table.Cell>
                    <Table.Cell>{entry.mood}</Table.Cell>
                    <Table.Cell>{entry.sentiment}</Table.Cell>
                    <Table.Cell>{entry.preview}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>

          <Divider />

          <div className={styles.tableSection}>
            <h3 className={styles.exampleTitle}>Goals Tracker</h3>
            <Table variant="striped">
              <Table.Header>
                <Table.Row>
                  <Table.Head>Title</Table.Head>
                  <Table.Head>Deadline</Table.Head>
                  <Table.Head>Status</Table.Head>
                  <Table.Head align="right">Progress</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {goals.map((goal) => (
                  <Table.Row key={goal.id}>
                    <Table.Cell>{goal.title}</Table.Cell>
                    <Table.Cell>{goal.deadline}</Table.Cell>
                    <Table.Cell>{goal.status}</Table.Cell>
                    <Table.Cell align="right">{goal.progress}%</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>

          <Divider />

          <div className={styles.tableSection}>
            <h3 className={styles.exampleTitle}>Bordered Table</h3>
            <Table variant="bordered">
              <Table.Header>
                <Table.Row>
                  <Table.Head>Metric</Table.Head>
                  <Table.Head align="center">This Week</Table.Head>
                  <Table.Head align="center">Last Week</Table.Head>
                  <Table.Head align="right">Change</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Journal Entries</Table.Cell>
                  <Table.Cell align="center">5</Table.Cell>
                  <Table.Cell align="center">4</Table.Cell>
                  <Table.Cell align="right">+25%</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Goals Completed</Table.Cell>
                  <Table.Cell align="center">3</Table.Cell>
                  <Table.Cell align="center">2</Table.Cell>
                  <Table.Cell align="right">+50%</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Daily Check-ins</Table.Cell>
                  <Table.Cell align="center">7</Table.Cell>
                  <Table.Cell align="center">6</Table.Cell>
                  <Table.Cell align="right">+17%</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </div>
        </section>

        {/* Usage Code */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Usage Examples</h2>
          
          <div className={styles.codeBlock}>
            <h3 className={styles.codeTitle}>Divider</h3>
            <pre className={styles.code}>{`import { Divider } from '@/app/components/ui'

// Basic
<Divider />

// With label
<Divider label="Section Title" />

// Spacing variants
<Divider spacing="sm" />  // 16px margin
<Divider spacing="md" />  // 24px margin (default)
<Divider spacing="lg" />  // 32px margin

// Vertical
<Divider orientation="vertical" />`}</pre>
          </div>

          <div className={styles.codeBlock}>
            <h3 className={styles.codeTitle}>Table</h3>
            <pre className={styles.code}>{`import { Table } from '@/app/components/ui'

<Table variant="default"> {/* or "bordered" or "striped" */}
  <Table.Header>
    <Table.Row>
      <Table.Head sortable onSort={handleSort}>
        Column Title
      </Table.Head>
      <Table.Head align="right">Amount</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row onClick={handleClick} selected={isSelected}>
      <Table.Cell>Data</Table.Cell>
      <Table.Cell align="right">$123</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>`}</pre>
          </div>
        </section>
      </div>
    </div>
  )
}








