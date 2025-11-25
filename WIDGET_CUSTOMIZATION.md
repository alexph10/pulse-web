# Dashboard Widget Customization

Your dashboard now supports drag-and-drop customization, similar to iPhone app icons! 🎨

## Features

### 1. **Drag & Drop Widgets**
- Click the "Customize Layout" button in the top-right corner
- Drag any widget to rearrange your dashboard
- Changes are saved automatically to `localStorage`

### 2. **Edit Mode Toggle**
- **View Mode** (default): Normal dashboard interaction
- **Edit Mode**: Enables drag-and-drop with visual indicators
- Toggle with the button in the dashboard header

### 3. **Persistent Layout**
- Your custom arrangement is saved locally
- Survives page refreshes and browser restarts
- Stored in: `localStorage['pulse-dashboard-layout']`

## How It Works

### Components

**`SortableWidget.tsx`**
- Wraps each widget to make it draggable
- Shows "Drag" indicator in edit mode
- Handles drag events and styling

**`widgetLayout.ts`**
- Defines all available widgets
- Manages layout configuration
- Handles save/load from localStorage

**`dashboard/page.tsx`**
- Main dashboard with DndContext
- Renders widgets in custom order
- Manages edit mode state

### Widget Configuration

Each widget has:
```typescript
{
  id: string              // Unique identifier
  type: string            // Component type
  enabled: boolean        // Show/hide widget
  size: 'small' | 'medium' | 'large' | 'full'
  order: number          // Display order
}
```

### Size Classes
- **small**: `240px` minimum (stat cards)
- **medium**: `300px` minimum (most widgets)
- **large**: `400px` minimum (complex charts)
- **full**: Full width (heatmaps, trends)

## Usage

### Basic Customization
1. Navigate to `/dashboard`
2. Click "Customize Layout" button
3. Drag widgets to reorder
4. Click "Done Editing" when finished

### Reset to Default
To reset the layout, open browser console and run:
```javascript
localStorage.removeItem('pulse-dashboard-layout')
location.reload()
```

Or call the helper function:
```typescript
import { resetWidgetLayout } from '@/app/lib/widgetLayout'
resetWidgetLayout()
```

## Future Enhancements

### Potential Features
- [ ] Widget visibility toggle (show/hide individual widgets)
- [ ] Multiple layout presets (Morning, Work, Evening)
- [ ] Widget resizing (change size on the fly)
- [ ] Export/import layouts (share with others)
- [ ] Cloud sync (save to Supabase)
- [ ] Responsive breakpoints (different layouts for mobile/tablet)
- [ ] Widget customization (edit titles, colors, data ranges)

### Adding New Widgets

1. **Create your widget component** in `app/components/analytics/`

2. **Add to widget configuration**:
```typescript
// In lib/widgetLayout.ts
{ 
  id: 'my-new-widget', 
  type: 'MyNewWidget', 
  enabled: true, 
  size: 'medium', 
  order: 26 
}
```

3. **Add render case**:
```typescript
// In dashboard/page.tsx
case 'MyNewWidget':
  return <MyNewWidget />
```

## Technical Details

### Libraries Used
- `@dnd-kit/core`: Core drag-and-drop functionality
- `@dnd-kit/sortable`: Sortable list/grid support
- `@dnd-kit/utilities`: CSS transform utilities

### Key Functions

**`handleDragEnd(event)`**
- Triggered when user drops a widget
- Reorders widgets array using `arrayMove()`
- Saves new layout to localStorage

**`renderWidget(widget)`**
- Maps widget config to React component
- Handles widget-specific props and data
- Returns null for disabled widgets

**`saveWidgetLayout(layout)`**
- Serializes layout to JSON
- Stores in localStorage
- Called automatically on drag end

**`loadWidgetLayout()`**
- Retrieves saved layout from localStorage
- Parses JSON safely with error handling
- Returns null if no saved layout exists

## Browser Support

Works in all modern browsers that support:
- CSS Grid
- CSS Transform
- localStorage
- ES6+ JavaScript

## Performance

- Drag operations use CSS transforms (GPU accelerated)
- Layout changes batched with React state
- No network calls during drag operations
- Minimal re-renders with proper React keys

## Accessibility

- Keyboard navigation support via `KeyboardSensor`
- Screen reader compatible
- Focus management during drag operations
- Visible focus indicators in edit mode

Enjoy customizing your dashboard! 🚀
