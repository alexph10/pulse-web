# Modal Component

A flexible, accessible modal dialog component built with Radix UI and following the Pulse design system.

## Features

- Accessible (keyboard navigation, focus trap, ARIA attributes)
- Animated entrance/exit with framer-motion
- Click outside to close
- ESC key to close
- Compound component pattern for flexibility
- Multiple sizes (sm, md, lg, full)
- Responsive (mobile-optimized)
- Dark UI following design system

## Installation

The Modal component is already installed and ready to use.

## Basic Usage

```tsx
import { useState } from 'react'
import { Modal, Button } from '@/app/components/ui'

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Open Modal
      </Button>

      <Modal open={isOpen} onOpenChange={setIsOpen} size="md">
        <Modal.Header>
          <Modal.Title>Modal Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Your content here
        </Modal.Body>
        <Modal.Footer>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsOpen(false)}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
```

## API Reference

### Modal

Main container component.

**Props:**
- `open?: boolean` - Controls modal visibility
- `onOpenChange?: (open: boolean) => void` - Callback when modal opens/closes
- `size?: 'sm' | 'md' | 'lg' | 'full'` - Modal width (default: 'md')
- `children: ReactNode` - Modal content

**Sizes:**
- `sm` - 400px max width
- `md` - 600px max width (default)
- `lg` - 800px max width
- `full` - 1200px max width

### Modal.Header

Container for the modal header area.

**Props:**
- `children: ReactNode` - Header content
- `showClose?: boolean` - Show close button (default: true)

### Modal.Title

Styled title component with proper ARIA attributes.

**Props:**
- `children: ReactNode` - Title text

### Modal.Body

Scrollable content area.

**Props:**
- `children: ReactNode` - Body content

### Modal.Footer

Container for action buttons.

**Props:**
- `children: ReactNode` - Footer content (typically buttons)
- `align?: 'left' | 'center' | 'right' | 'between'` - Button alignment (default: 'right')

## Examples

### Simple Modal

```tsx
<Modal open={isOpen} onOpenChange={setIsOpen} size="sm">
  <Modal.Header>
    <Modal.Title>Notification</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <p>Your changes have been saved.</p>
  </Modal.Body>
  <Modal.Footer>
    <Button onClick={() => setIsOpen(false)}>OK</Button>
  </Modal.Footer>
</Modal>
```

### Form Modal

```tsx
<Modal open={isOpen} onOpenChange={setIsOpen} size="md">
  <Modal.Header>
    <Modal.Title>Create Journal Entry</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <form>
      <Input label="Title" placeholder="Entry title" />
      <Textarea label="Content" rows={6} />
      <Select label="Mood" options={moods} />
    </form>
  </Modal.Body>
  <Modal.Footer align="between">
    <Button variant="ghost" onClick={() => setIsOpen(false)}>
      Cancel
    </Button>
    <Button onClick={handleSave}>Save Entry</Button>
  </Modal.Footer>
</Modal>
```

### Confirmation Modal

```tsx
<Modal open={isOpen} onOpenChange={setIsOpen} size="sm">
  <Modal.Header showClose={false}>
    <Modal.Title>Delete Item?</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <p>This action cannot be undone.</p>
  </Modal.Body>
  <Modal.Footer align="between">
    <Button variant="ghost" onClick={() => setIsOpen(false)}>
      Cancel
    </Button>
    <Button variant="danger" onClick={handleDelete}>
      Delete
    </Button>
  </Modal.Footer>
</Modal>
```

### Without Header Close Button

```tsx
<Modal.Header showClose={false}>
  <Modal.Title>Important Action</Modal.Title>
</Modal.Header>
```

## Accessibility

The Modal component includes:

- Focus trap (focus stays within modal)
- ESC key closes modal
- Click outside closes modal
- Proper ARIA attributes
- Keyboard navigation
- Screen reader support

## Styling

The Modal follows modern fintech design patterns (Ramp, Linear, Stripe style):

- Background: `#252c2c` (card background)
- Border: `1px solid rgba(228, 221, 211, 0.2)` (subtle definition)
- Shadow: `0 2px 8px rgba(0, 0, 0, 0.12)` (minimal elevation)
- Text: `#e4ddd3` (primary), `#a39d96` (secondary)
- Overlay: `rgba(0, 0, 0, 0.5)` with 4px blur (lighter, more refined)
- Padding: 24-32px (balanced, refined)
- Border radius: 0 (sharp edges)
- Typography: 16px title (sophisticated sizing)
- Close button: Transparent with hover state
- Centered on all screen sizes
- Animations: 0.3s ease-out (subtle scale)

## Demo

Visit `/design-system/modal-demo` to see live examples.

## Design System

This component follows the design patterns defined in:
- `/COMPONENT_DESIGN_SYSTEM.md`
- `/app/components/ui/design-system.css`

