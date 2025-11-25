# Table Component

A flexible, accessible table component for displaying structured data with sorting, row selection, and multiple variants.

## Features

- Compound component pattern (Table.Header, Table.Body, etc.)
- Sortable columns
- Clickable rows with selection
- Multiple variants (default, bordered, striped)
- Text alignment options
- Fully responsive (stacks on mobile)
- Accessible

## Usage

```tsx
import { Table } from '@/app/components/ui'

<Table variant="default">
  <Table.Header>
    <Table.Row>
      <Table.Head>Column 1</Table.Head>
      <Table.Head align="right">Column 2</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.Cell>Data 1</Table.Cell>
      <Table.Cell align="right">Data 2</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>
```

## API

### Table
- `variant?: 'default' | 'bordered' | 'striped'` - Visual style
- `className?: string` - Additional CSS classes

### Table.Header
- `className?: string` - Additional CSS classes

### Table.Body
- `className?: string` - Additional CSS classes

### Table.Row
- `onClick?: () => void` - Click handler (makes row clickable)
- `selected?: boolean` - Selected state
- `className?: string` - Additional CSS classes

### Table.Head
- `align?: 'left' | 'center' | 'right'` - Text alignment
- `width?: string` - Column width
- `sortable?: boolean` - Enable sorting
- `onSort?: () => void` - Sort handler
- `sortDirection?: 'asc' | 'desc' | null` - Sort direction indicator
- `className?: string` - Additional CSS classes

### Table.Cell
- `align?: 'left' | 'center' | 'right'` - Text alignment
- `width?: string` - Cell width
- `className?: string` - Additional CSS classes

## Examples

### Basic Table
```tsx
<Table>
  <Table.Header>
    <Table.Row>
      <Table.Head>Name</Table.Head>
      <Table.Head>Email</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.Cell>John Doe</Table.Cell>
      <Table.Cell>john@example.com</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>
```

### With Sorting
```tsx
const [sortColumn, setSortColumn] = useState(null)
const [sortDirection, setSortDirection] = useState(null)

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
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {sortedData.map(item => (
      <Table.Row key={item.id}>
        <Table.Cell>{item.date}</Table.Cell>
      </Table.Row>
    ))}
  </Table.Body>
</Table>
```

### Clickable Rows with Selection
```tsx
const [selected, setSelected] = useState(null)

<Table>
  <Table.Body>
    {items.map(item => (
      <Table.Row 
        key={item.id}
        onClick={() => setSelected(item.id)}
        selected={selected === item.id}
      >
        <Table.Cell>{item.name}</Table.Cell>
      </Table.Row>
    ))}
  </Table.Body>
</Table>
```

### Variants
```tsx
<Table variant="bordered">    {/* Stronger borders */}
<Table variant="striped">     {/* Alternating row colors */}
```

### Alignment
```tsx
<Table.Head align="right">Amount</Table.Head>
<Table.Cell align="center">Status</Table.Cell>
```

## Styling

- Background: `#252c2c` (card background)
- Border: `1px solid rgba(228, 221, 211, 0.15)`
- Row hover: Subtle highlight
- Selected row: Orange tint
- Header: Uppercase, small font, muted color
- Fully responsive (stacks on mobile < 480px)

## Mobile Behavior

On screens < 480px:
- Headers are hidden
- Rows stack vertically
- Each cell shows its label
- Maintains full functionality

## Demo

Visit `/design-system/components-demo` to see live examples with sorting, selection, and all variants.






