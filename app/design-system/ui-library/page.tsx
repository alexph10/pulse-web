'use client'

import { useState } from 'react'
import { 
  Modal, Divider, Table, Button, Input, Textarea, Select, Card,
  Badge, Toggle, Tooltip, Tabs
} from '@/app/components/ui'
import styles from './library.module.css'

// Sample data
const journalEntries = [
  { id: '1', date: '2024-11-24', mood: 'Calm', sentiment: 'Positive', preview: 'Had a productive day working on...' },
  { id: '2', date: '2024-11-23', mood: 'Energetic', sentiment: 'Positive', preview: 'Great workout session this morning...' },
  { id: '3', date: '2024-11-22', mood: 'Reflective', sentiment: 'Neutral', preview: 'Thinking about future goals...' },
]

export default function UILibrary() {
  // Modal states
  const [simpleModal, setSimpleModal] = useState(false)
  const [formModal, setFormModal] = useState(false)
  const [confirmModal, setConfirmModal] = useState(false)
  
  // Table states
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null)
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null)
  
  // Toggle states
  const [toggle1, setToggle1] = useState(false)
  const [toggle2, setToggle2] = useState(true)
  
  // Tabs state
  const [activeTab, setActiveTab] = useState('overview')

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
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>Pulse UI Library</h1>
          <p className={styles.subtitle}>Complete component library following modern fintech design patterns</p>
        </header>

        {/* Component Sections */}
        
        {/* Modal Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Modal</h2>
          <p className={styles.description}>
            Accessible dialog component with multiple sizes and compound pattern
          </p>
          
          <div className={styles.componentDemo}>
            <div className={styles.buttonGroup}>
              <Button onClick={() => setSimpleModal(true)}>Simple Modal</Button>
              <Button onClick={() => setFormModal(true)} variant="secondary">Form Modal</Button>
              <Button onClick={() => setConfirmModal(true)} variant="danger">Confirm Modal</Button>
            </div>

            <div className={styles.codeBlock}>
              <pre className={styles.code}>{`<Modal open={isOpen} onOpenChange={setIsOpen} size="md">
  <Modal.Header>
    <Modal.Title>Title</Modal.Title>
  </Modal.Header>
  <Modal.Body>Content</Modal.Body>
  <Modal.Footer>
    <Button>Action</Button>
  </Modal.Footer>
</Modal>`}</pre>
            </div>
          </div>
        </section>

        <Divider spacing="lg" />

        {/* Button Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Button</h2>
          <p className={styles.description}>
            Primary action component with multiple variants and states
          </p>
          
          <div className={styles.componentDemo}>
            <div className={styles.buttonGroup}>
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="tertiary">Tertiary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button isLoading>Loading</Button>
            </div>

            <div className={styles.codeBlock}>
              <pre className={styles.code}>{`<Button variant="primary">Click me</Button>
<Button variant="secondary" isLoading>Loading...</Button>`}</pre>
            </div>
          </div>
        </section>

        <Divider spacing="lg" />

        {/* Table Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Table</h2>
          <p className={styles.description}>
            Data table with sorting, selection, and responsive design
          </p>
          
          <div className={styles.componentDemo}>
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

            <div className={styles.codeBlock}>
              <pre className={styles.code}>{`<Table>
  <Table.Header>
    <Table.Row>
      <Table.Head sortable onSort={handler}>Column</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row onClick={handler} selected={bool}>
      <Table.Cell>Data</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>`}</pre>
            </div>
          </div>
        </section>

        <Divider spacing="lg" />

        {/* Form Inputs Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Form Inputs</h2>
          <p className={styles.description}>
            Input, Textarea, and Select components for forms
          </p>
          
          <div className={styles.componentDemo}>
            <div className={styles.formGrid}>
              <Input placeholder="Enter text..." />
              <Input placeholder="With label" />
              <Textarea placeholder="Longer text..." rows={4} />
              <Select options={[
                { value: '', label: 'Select option' },
                { value: 'option1', label: 'Option 1' },
                { value: 'option2', label: 'Option 2' }
              ]} />
            </div>

            <div className={styles.codeBlock}>
              <pre className={styles.code}>{`<Input placeholder="Enter text" />
<Textarea placeholder="Long text" rows={4} />
<Select options={[
  { value: '', label: 'Choose...' }
]} />`}</pre>
            </div>
          </div>
        </section>

        <Divider spacing="lg" />

        {/* Divider Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Divider</h2>
          <p className={styles.description}>
            Visual separator for content sections
          </p>
          
          <div className={styles.componentDemo}>
            <div className={styles.dividerExamples}>
              <p className={styles.text}>Content above</p>
              <Divider />
              <p className={styles.text}>Content below</p>
              
              <Divider spacing="lg" />
              
              <Divider label="With Label" />
              
              <Divider spacing="lg" />
              
              <div style={{ display: 'flex', alignItems: 'center', height: '40px' }}>
                <span className={styles.text}>Left</span>
                <Divider orientation="vertical" />
                <span className={styles.text}>Right</span>
              </div>
            </div>

            <div className={styles.codeBlock}>
              <pre className={styles.code}>{`<Divider />
<Divider label="Section" />
<Divider spacing="lg" />
<Divider orientation="vertical" />`}</pre>
            </div>
          </div>
        </section>

        <Divider spacing="lg" />

        {/* Badge Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Badge</h2>
          <p className={styles.description}>
            Status indicator with multiple variants and sizes
          </p>
          
          <div className={styles.componentDemo}>
            <div className={styles.badgeGroup}>
              <Badge>Default</Badge>
              <Badge variant="success">Active</Badge>
              <Badge variant="warning">Pending</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="info">Info</Badge>
            </div>
            
            <div className={styles.badgeGroup}>
              <Badge size="sm">Small</Badge>
              <Badge size="md">Medium</Badge>
              <Badge size="lg">Large</Badge>
            </div>

            <div className={styles.codeBlock}>
              <pre className={styles.code}>{`<Badge variant="success">Active</Badge>
<Badge variant="warning" size="sm">Pending</Badge>`}</pre>
            </div>
          </div>
        </section>

        <Divider spacing="lg" />

        {/* Toggle Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Toggle</h2>
          <p className={styles.description}>
            Switch component for binary choices
          </p>
          
          <div className={styles.componentDemo}>
            <div className={styles.toggleGroup}>
              <Toggle checked={toggle1} onCheckedChange={setToggle1} />
              <Toggle checked={toggle2} onCheckedChange={setToggle2} />
              <Toggle disabled />
            </div>
            
            <div className={styles.toggleGroup}>
              <Toggle label="Enable notifications" checked={toggle1} onCheckedChange={setToggle1} />
              <Toggle label="Dark mode" checked={toggle2} onCheckedChange={setToggle2} labelPosition="left" />
            </div>
            
            <div className={styles.toggleGroup}>
              <Toggle size="sm" />
              <Toggle size="md" />
            </div>

            <div className={styles.codeBlock}>
              <pre className={styles.code}>{`<Toggle checked={enabled} onCheckedChange={setEnabled} />
<Toggle label="Enable feature" checked={enabled} />`}</pre>
            </div>
          </div>
        </section>

        <Divider spacing="lg" />

        {/* Tooltip Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Tooltip</h2>
          <p className={styles.description}>
            Contextual information on hover
          </p>
          
          <div className={styles.componentDemo}>
            <div className={styles.tooltipGroup}>
              <Tooltip content="This is a helpful tooltip">
                <Button>Hover me</Button>
              </Tooltip>
              
              <Tooltip content="Delete this item permanently" side="right">
                <Button variant="danger">Delete</Button>
              </Tooltip>
              
              <Tooltip content="View details" side="bottom">
                <Button variant="secondary">Info</Button>
              </Tooltip>
            </div>

            <div className={styles.codeBlock}>
              <pre className={styles.code}>{`<Tooltip content="Helpful text" side="top">
  <Button>Hover me</Button>
</Tooltip>`}</pre>
            </div>
          </div>
        </section>

        <Divider spacing="lg" />

        {/* Tabs Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Tabs</h2>
          <p className={styles.description}>
            Organize content into separate views
          </p>
          
          <div className={styles.componentDemo}>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <Tabs.List>
                <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
                <Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
                <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
                <Tabs.Trigger value="disabled" disabled>Disabled</Tabs.Trigger>
              </Tabs.List>
              
              <Tabs.Content value="overview">
                <p className={styles.text}>Overview content goes here. This is the main dashboard view.</p>
              </Tabs.Content>
              
              <Tabs.Content value="analytics">
                <p className={styles.text}>Analytics and metrics data would be displayed here.</p>
              </Tabs.Content>
              
              <Tabs.Content value="settings">
                <p className={styles.text}>Settings and configuration options.</p>
              </Tabs.Content>
            </Tabs>

            <div className={styles.codeBlock}>
              <pre className={styles.code}>{`<Tabs defaultValue="tab1">
  <Tabs.List>
    <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
    <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab1">Content 1</Tabs.Content>
  <Tabs.Content value="tab2">Content 2</Tabs.Content>
</Tabs>`}</pre>
            </div>
          </div>
        </section>

        <Divider spacing="lg" />

        {/* Card Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Card</h2>
          <p className={styles.description}>
            Container component with elevation variants
          </p>
          
          <div className={styles.componentDemo}>
            <div className={styles.cardGrid}>
              <Card>
                <h3 className={styles.cardTitle}>Default Card</h3>
                <p className={styles.cardText}>Card content goes here</p>
              </Card>
              <Card elevation={2} hoverable>
                <h3 className={styles.cardTitle}>Hoverable Card</h3>
                <p className={styles.cardText}>Hover to see effect</p>
              </Card>
            </div>

            <div className={styles.codeBlock}>
              <pre className={styles.code}>{`<Card elevation={1} hoverable>
  <h3>Title</h3>
  <p>Content</p>
</Card>`}</pre>
            </div>
          </div>
        </section>

        {/* Modals */}
        <Modal open={simpleModal} onOpenChange={setSimpleModal} size="sm">
          <Modal.Header>
            <Modal.Title>Simple Modal</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p style={{ margin: 0, color: '#e4ddd3', lineHeight: 1.5 }}>
              This is a simple modal with minimal content.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="ghost" onClick={() => setSimpleModal(false)}>Close</Button>
          </Modal.Footer>
        </Modal>

        <Modal open={formModal} onOpenChange={setFormModal} size="md">
          <Modal.Header>
            <Modal.Title>Create Journal Entry</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <Input placeholder="Entry title..." />
              <Textarea placeholder="Write your thoughts..." rows={6} />
              <Select options={[
                { value: '', label: 'Select mood' },
                { value: 'calm', label: 'Calm' },
                { value: 'energetic', label: 'Energetic' },
                { value: 'reflective', label: 'Reflective' }
              ]} />
            </div>
          </Modal.Body>
          <Modal.Footer align="between">
            <Button variant="ghost" onClick={() => setFormModal(false)}>Cancel</Button>
            <Button onClick={() => setFormModal(false)}>Save Entry</Button>
          </Modal.Footer>
        </Modal>

        <Modal open={confirmModal} onOpenChange={setConfirmModal} size="sm">
          <Modal.Header showClose={false}>
            <Modal.Title>Delete Entry?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p style={{ margin: 0, color: '#a39d96', lineHeight: 1.5 }}>
              This action cannot be undone.
            </p>
          </Modal.Body>
          <Modal.Footer align="between">
            <Button variant="ghost" onClick={() => setConfirmModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => setConfirmModal(false)}>Delete</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  )
}

