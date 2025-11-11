# Pulse Web Application - Technical Documentation

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Core Features](#core-features)
5. [Components](#components)
6. [API Routes](#api-routes)
7. [Database Schema](#database-schema)
8. [Authentication](#authentication)
9. [State Management](#state-management)
10. [Styling](#styling)
11. [Development Guide](#development-guide)
12. [Deployment](#deployment)

## Overview

Pulse is a mental wellness journaling application built with Next.js 16 that combines voice journaling, mood tracking, analytics, and achievement systems to help users maintain consistent self-reflection habits.

### Key Features

- Voice-to-text journaling with AI-powered mood analysis
- Comprehensive analytics dashboard with customizable date ranges
- Achievement badge system with psychological progression design
- Goal tracking with habit formation support
- Real-time mood insights and pattern detection
- PDF export functionality for journal entries
- Responsive design optimized for all devices

## Technology Stack

### Frontend

- **Framework**: Next.js 16.0.1 with App Router
- **Language**: TypeScript 5.x
- **UI Libraries**: 
  - React 19.0.0
  - Framer Motion 11.x (animations)
  - React Three Fiber (3D graphics)
  - React Confetti (celebrations)
- **Charts**: Recharts 2.x
- **Date Handling**: date-fns 4.x, react-datepicker 7.x
- **PDF Generation**: jsPDF 2.x, html2canvas 1.x

### Backend

- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with Google OAuth
- **Storage**: Supabase Storage for audio files
- **API**: Next.js API Routes

### Development Tools

- **Package Manager**: npm
- **Linting**: ESLint
- **CSS**: CSS Modules, PostCSS, Tailwind CSS 3.x
- **Version Control**: Git with Git LFS for large assets

## Project Structure

```
pulse-web/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── analyze-mood/         # Mood analysis endpoint
│   │   ├── chat/                 # AI chat endpoint
│   │   ├── journal/              # Journal CRUD operations
│   │   └── transcribe/           # Audio transcription
│   ├── components/               # React Components
│   │   ├── analytics/            # Analytics-specific components
│   │   ├── badges/               # Badge system components
│   │   ├── dashboard-navbar/    # Navigation component
│   │   ├── layouts/              # Layout wrappers
│   │   ├── shared/               # Reusable components
│   │   └── ...                   # Other feature components
│   ├── contexts/                 # React Context providers
│   │   └── AuthContext.tsx       # Authentication state
│   ├── dashboard/                # Dashboard pages
│   │   ├── analytics/            # Analytics page
│   │   ├── goals/                # Goals tracking
│   │   ├── habits/               # Habit tracking
│   │   ├── journal/              # Voice journal
│   │   ├── notes/                # Written notes
│   │   ├── profile/              # User profile
│   │   ├── progress/             # Progress tracking
│   │   └── reflections/          # Reflections page
│   ├── hooks/                    # Custom React hooks
│   │   ├── useDateRange.ts       # Date range management
│   │   ├── useMediaQuery.ts      # Responsive breakpoints
│   │   └── useVoiceRecorder.ts   # Audio recording
│   ├── config/                   # Configuration files
│   │   └── badges.ts             # Badge definitions
│   ├── lib/                      # Utility libraries
│   │   ├── badgeEngine.ts        # Badge calculation logic
│   │   └── supabase.ts           # Supabase client
│   ├── types/                    # TypeScript type definitions
│   │   └── achievements.ts       # Badge system types
│   ├── utils/                    # Utility functions
│   │   └── pdfExport.ts          # PDF generation logic
│   ├── fonts.css                 # Custom font definitions
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── database/                     # Database schemas
│   └── achievements_schema.sql   # Badge system tables
├── public/                       # Static assets
│   ├── font/                     # Custom fonts
│   ├── Manier/                   # Manier font family
│   ├── Satoshi_Complete/         # Satoshi font family
│   └── Switzer_Complete/         # Switzer font family
├── .env.local                    # Environment variables (not in git)
├── .gitignore                    # Git ignore rules
├── .gitattributes                # Git LFS configuration
├── eslint.config.mjs             # ESLint configuration
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies
├── postcss.config.mjs            # PostCSS configuration
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # Project overview
```

## Core Features

### 1. Voice Journaling

**Location**: `app/dashboard/journal/page.tsx`

Users can record audio entries that are automatically transcribed and analyzed for mood patterns.

**Key Components**:
- `useVoiceRecorder` hook: Manages audio recording state
- Transcription API: Converts audio to text
- Mood Analysis API: Analyzes emotional content

**Workflow**:
1. User records audio via browser MediaRecorder API
2. Audio blob sent to `/api/transcribe` endpoint
3. Transcript analyzed via `/api/analyze-mood`
4. Entry saved to `journal_entries` table with mood metadata

### 2. Analytics Dashboard

**Location**: `app/dashboard/analytics/page.tsx`

Comprehensive mood tracking and pattern visualization.

**Features**:
- Mood distribution pie chart
- Mood trend line chart over time
- Journal streak calculation
- Custom date range selection
- PDF export with charts and statistics

**Components**:
- `DateRangePicker`: Custom date range selector with presets
- `MoodTrendChart`: Line chart using Recharts
- `MoodDistribution`: Pie chart for mood breakdown
- `JournalStreak`: Streak calculation and display
- `ExportButton`: PDF generation with charts
- `StatCard`: Reusable stat display card
- `EmptyState`: Placeholder for no data scenarios

### 3. Achievement Badge System

**Location**: `app/config/badges.ts`, `app/lib/badgeEngine.ts`

Gamification system with 18 badges across 5 categories and 5 tiers.

**Badge Categories**:
- Consistency: Streak-based achievements
- Depth: Word count and reflection quality
- Growth: Mood improvement patterns
- Discovery: Exploration and variety
- Resilience: Comeback and persistence

**Badge Tiers**:
- Bronze: Entry-level achievements
- Silver: Consistent progress
- Gold: Advanced milestones
- Platinum: Expert dedication
- Diamond: Master achievements

**Badge Engine Features**:
- Pattern detection algorithms
- Mood transition analysis
- Streak calculation with flexible gaps
- Word count analysis
- Time pattern recognition
- Diversity tracking
- Comeback detection
- Reflection depth analysis

**Components**:
- `BadgeIcon`: 16 procedurally-generated SVG icons
- `BadgeCard`: 3D badge display with mouse-responsive tilt
- `BadgeUnlock`: Celebration modal with confetti

### 4. Goal Tracking

**Location**: `app/dashboard/goals/page.tsx`

Users can set and track personal goals with habit formation support.

**Features**:
- Create, edit, delete goals
- Mark goals as complete
- Track progress over time
- Goal categorization

### 5. Notes System

**Location**: `app/dashboard/notes/page.tsx`

Quick note-taking functionality for brief thoughts and ideas.

**Features**:
- Rich text editing
- Note categorization
- Search and filter
- Timestamp tracking

## Components

### Layout Components

#### DashboardLayout

**Location**: `app/components/layouts/DashboardLayout.tsx`

Consistent wrapper for all dashboard pages.

**Props**:
- `children`: React nodes to render
- `isLoading` (optional): Loading state for navbar

**Features**:
- Integrated DashboardNavbar
- Consistent padding and max-width
- Responsive margins
- Background color theming

#### DashboardNavbar

**Location**: `app/components/dashboard-navbar/dashboard-navbar.tsx`

Primary navigation component with authentication.

**Features**:
- Logo with animation
- 8 navigation items (Dashboard, Notes, Journal, Goals, Habits, Reflections, Progress, Analytics)
- Theme toggle (light/dark mode)
- User profile dropdown
- Schedule button
- Logout functionality
- Bug report modal

### Badge Components

#### BadgeIcon

**Location**: `app/components/badges/BadgeIcon.tsx`

Generates 16 unique SVG icons for different badge types.

**Props**:
- `type`: Icon identifier
- `size`: Icon dimensions
- `color`: Fill color

**Icon Types**:
- sunrise, magnifier, phoenix, scroll, chain, lighthouse, network, compass, moon, calendar, tree, owl, sun, waveform, circle, pen

#### BadgeCard

**Location**: `app/components/badges/BadgeCard.tsx`

3D badge display with interactive effects.

**Props**:
- `badge`: Badge configuration object
- `earned`: Whether user has earned the badge
- `progress`: Current progress (0-100)
- `size`: Display size (small, medium, large)

**Features**:
- Mouse-responsive 3D tilt effect
- Metallic gradient backgrounds
- Animated shine overlay
- Progress bar with shimmer
- Locked state overlay for unearned badges
- Tier-based color schemes

#### BadgeUnlock

**Location**: `app/components/badges/BadgeUnlock.tsx`

Celebration modal when badge is unlocked.

**Props**:
- `badge`: Badge that was unlocked
- `onClose`: Callback when modal closes

**Features**:
- 300-piece confetti animation
- Scale and rotate entrance animation
- Floating icon with bounce effect
- Gradient background animation
- Rarity indicator for rare badges
- Auto-close after 8 seconds

### Analytics Components

#### DateRangePicker

**Location**: `app/components/analytics/DateRangePicker.tsx`

Custom date range selector with preset options.

**Props**:
- `startDate`: Selected start date
- `endDate`: Selected end date
- `onDateChange`: Callback for date changes

**Features**:
- Preset ranges (Today, Week, Month, Year, All Time)
- Custom range selection with calendar
- Responsive mobile/desktop layouts

#### MoodTrendChart

**Location**: `app/components/analytics/MoodTrendChart.tsx`

Line chart showing mood score trends over time.

**Props**:
- `data`: Array of date/mood score pairs
- `height`: Chart height (optional)

**Features**:
- Responsive design
- Color-coded mood zones (negative, neutral, positive)
- Tooltip with date and mood details
- Gradient fill under line

#### MoodDistribution

**Location**: `app/components/analytics/MoodDistribution.tsx`

Pie chart showing mood category breakdown.

**Props**:
- `data`: Array of mood counts

**Features**:
- Color-coded mood segments
- Percentage labels
- Hover tooltips
- Responsive sizing

### Shared Components

#### EmptyState

**Location**: `app/components/shared/EmptyState.tsx`

Reusable empty state placeholder.

**Props**:
- `title`: Main heading
- `description`: Supporting text
- `action`: Optional CTA button
- `illustration`: Illustration type (journal, analytics, general)

**Features**:
- Three illustration styles
- Custom color schemes
- Optional action button
- Responsive layouts

## API Routes

### POST /api/transcribe

Transcribes audio files to text.

**Request Body**:
```json
{
  "audio": "base64_encoded_audio_data"
}
```

**Response**:
```json
{
  "transcript": "transcribed text content"
}
```

### POST /api/analyze-mood

Analyzes text for mood and emotional content.

**Request Body**:
```json
{
  "text": "journal entry text"
}
```

**Response**:
```json
{
  "primaryMood": "happy",
  "moodScore": 75,
  "emotions": ["joy", "contentment"],
  "sentiment": "positive",
  "keywords": ["success", "achievement"],
  "insight": "Analysis insight text",
  "followUpQuestion": "Reflection prompt"
}
```

### GET /api/journal

Fetches journal entries for a user.

**Query Parameters**:
- `userId`: User ID (required)
- `limit`: Number of entries to return (optional)

**Response**:
```json
[
  {
    "id": "entry_id",
    "transcript": "entry text",
    "primary_mood": "happy",
    "mood_score": 75,
    "emotions": ["joy"],
    "sentiment": "positive",
    "insight": "Analysis insight",
    "created_at": "2025-11-11T10:00:00Z"
  }
]
```

### POST /api/journal

Creates a new journal entry.

**Request Body**:
```json
{
  "userId": "user_id",
  "transcript": "entry text",
  "primary_mood": "happy",
  "mood_score": 75,
  "emotions": ["joy"],
  "sentiment": "positive",
  "insight": "Analysis insight"
}
```

**Response**:
```json
{
  "success": true,
  "entryId": "new_entry_id"
}
```

### POST /api/chat

AI chat endpoint for follow-up questions.

**Request Body**:
```json
{
  "message": "user question",
  "context": "previous conversation context"
}
```

**Response**:
```json
{
  "response": "AI generated response"
}
```

## Database Schema

### journal_entries

Stores user journal entries and mood analysis.

```sql
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  transcript TEXT NOT NULL,
  primary_mood VARCHAR(50),
  mood_score INTEGER CHECK (mood_score >= 0 AND mood_score <= 100),
  emotions TEXT[],
  sentiment VARCHAR(20),
  insight TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_journal_entries_user_id ON journal_entries(user_id);
CREATE INDEX idx_journal_entries_created_at ON journal_entries(created_at);
```

### achievements

Stores badge definitions and metadata.

```sql
CREATE TABLE achievements (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  tier VARCHAR(20) NOT NULL,
  icon_type VARCHAR(50) NOT NULL,
  requirements JSONB NOT NULL,
  rarity_percentage INTEGER,
  is_hidden BOOLEAN DEFAULT FALSE,
  display_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### badge_progress

Tracks user progress toward badges.

```sql
CREATE TABLE badge_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  badge_id VARCHAR(50) REFERENCES achievements(id) NOT NULL,
  current_progress INTEGER DEFAULT 0,
  target_progress INTEGER NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

CREATE INDEX idx_badge_progress_user_id ON badge_progress(user_id);
CREATE INDEX idx_badge_progress_unlocked ON badge_progress(unlocked_at);
```

### profiles

Extended user profile information.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username VARCHAR(50) UNIQUE,
  email VARCHAR(255) UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### goals

User-defined goals and tracking.

```sql
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  target_date DATE,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_completed ON goals(is_completed);
```

## Authentication

### Supabase Auth

Authentication powered by Supabase with multiple providers.

**Supported Providers**:
- Email/Password
- Google OAuth

**Authentication Flow**:

1. User signs up or logs in via `/onboarding` page
2. Supabase Auth creates user in `auth.users` table
3. Profile created in `profiles` table via database trigger
4. Session token stored in browser
5. AuthContext provides user state throughout app

**AuthContext**:

**Location**: `app/contexts/AuthContext.tsx`

**Provides**:
- `user`: Current user object or null
- `loading`: Authentication check in progress
- `signOut`: Logout function

**Usage**:
```typescript
const { user, loading, signOut } = useAuth()
```

### Row Level Security (RLS)

All tables use RLS policies to ensure data isolation.

**Example Policy**:
```sql
CREATE POLICY "Users can view own journal entries"
  ON journal_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journal entries"
  ON journal_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

## State Management

### React Context

Authentication state managed via AuthContext.

### Component State

Local state managed with useState and useEffect hooks.

### Server State

Database queries cached by Next.js and Supabase client.

### Custom Hooks

#### useVoiceRecorder

**Location**: `app/hooks/useVoiceRecorder.ts`

Manages audio recording with MediaRecorder API.

**Returns**:
- `isRecording`: Whether recording is active
- `isPaused`: Whether recording is paused
- `recordingTime`: Duration in seconds
- `audioBlob`: Recorded audio data
- `startRecording`: Start recording function
- `stopRecording`: Stop and save recording
- `pauseRecording`: Pause recording
- `resumeRecording`: Resume recording
- `clearRecording`: Clear audio data

#### useDateRange

**Location**: `app/hooks/useDateRange.ts`

Manages date range selection for analytics.

**Returns**:
- `startDate`: Selected start date
- `endDate`: Selected end date
- `setDateRange`: Update date range
- `selectPreset`: Apply preset range

#### useMediaQuery

**Location**: `app/hooks/useMediaQuery.ts`

Detects responsive breakpoints.

**Parameters**:
- `query`: Media query string

**Returns**:
- `matches`: Boolean indicating if query matches

**Usage**:
```typescript
const isMobile = useMediaQuery('(max-width: 768px)')
```

## Styling

### Design System

**Colors**:
- Primary: #8B2F2F (burgundy red)
- Secondary: #1a3a2e (dark green)
- Accent: #9EF4D0 (mint green)
- Background: var(--background)
- Text: var(--text-primary), var(--text-secondary)

**Typography**:
- Headings: Satoshi (custom font)
- Body: Switzer (custom font)
- Display: Manier (custom font)

**Spacing Scale**:
- Base unit: 8px
- Scale: 8, 16, 24, 32, 40, 48, 56, 64

### CSS Modules

Component-specific styles use CSS Modules.

**Example**:
```typescript
import styles from './component.module.css'

export default function Component() {
  return <div className={styles.container}>Content</div>
}
```

### Tailwind CSS

Utility classes available for rapid styling.

**Configuration**: `tailwind.config.js`

### Global Styles

**Location**: `app/globals.css`

Defines CSS variables, resets, and base styles.

## Development Guide

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Git with Git LFS
- Supabase account

### Setup

1. Clone repository:
```bash
git clone https://github.com/alexph10/pulse-web.git
cd pulse-web
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run database migrations:
```bash
# Execute SQL files in Supabase SQL Editor:
# 1. database-migration.sql
# 2. database/achievements_schema.sql
# 3. goals-table-setup-clean.sql
```

5. Start development server:
```bash
npm run dev
```

6. Open http://localhost:3000

### Development Workflow

1. Create feature branch:
```bash
git checkout -b feature/feature-name
```

2. Make changes and test locally

3. Run linter:
```bash
npm run lint
```

4. Commit changes:
```bash
git add .
git commit -m "feat: description of changes"
```

5. Push to remote:
```bash
git push origin feature/feature-name
```

6. Create pull request on GitHub

### Code Style Guidelines

**TypeScript**:
- Use explicit types for function parameters and returns
- Prefer interfaces over types for object shapes
- Use enums for fixed sets of values

**React**:
- Functional components with hooks
- Organize hooks at top of component
- Extract reusable logic into custom hooks
- Use React.memo for expensive components

**File Naming**:
- Components: PascalCase (e.g., BadgeCard.tsx)
- Hooks: camelCase with 'use' prefix (e.g., useVoiceRecorder.ts)
- Utilities: camelCase (e.g., pdfExport.ts)
- Types: PascalCase (e.g., achievements.ts)

**Component Structure**:
```typescript
// 1. Imports
import { useState } from 'react'
import styles from './component.module.css'

// 2. Types/Interfaces
interface ComponentProps {
  prop1: string
  prop2?: number
}

// 3. Component
export default function Component({ prop1, prop2 }: ComponentProps) {
  // 4. State
  const [state, setState] = useState<string>('')
  
  // 5. Effects
  useEffect(() => {
    // effect logic
  }, [])
  
  // 6. Handlers
  const handleClick = () => {
    // handler logic
  }
  
  // 7. Render
  return (
    <div className={styles.container}>
      {/* JSX */}
    </div>
  )
}
```

## Deployment

### Vercel Deployment

Recommended platform for Next.js applications.

**Steps**:

1. Push code to GitHub

2. Connect repository to Vercel

3. Configure environment variables:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY

4. Deploy

**Build Command**: `npm run build`

**Output Directory**: `.next`

### Environment Variables

**Required**:
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key

**Optional**:
- `NEXT_PUBLIC_SITE_URL`: Production URL for redirects

### Database Migrations

Run SQL migrations in Supabase SQL Editor before deploying:

1. `database-migration.sql` - Core tables
2. `database/achievements_schema.sql` - Badge system
3. `goals-table-setup-clean.sql` - Goals functionality

### Post-Deployment

1. Test authentication flow
2. Verify database connections
3. Test API endpoints
4. Check analytics and badge calculations
5. Monitor error logs

## Performance Optimization

### Image Optimization

Next.js Image component used for automatic optimization.

### Code Splitting

Automatic route-based code splitting via Next.js App Router.

### Lazy Loading

Components loaded on-demand using React.lazy and Suspense.

### Caching

- Static pages cached at CDN edge
- Database queries cached by Supabase
- API responses cached where appropriate

## Security Considerations

### Authentication

- Secure token storage in httpOnly cookies
- OAuth integration for social login
- Session management via Supabase Auth

### Database Security

- Row Level Security on all tables
- Parameterized queries prevent SQL injection
- Input validation on all user inputs

### API Security

- CORS configured for known origins
- Rate limiting on sensitive endpoints
- Input sanitization on all API routes

## Testing

### Manual Testing

Test all features in development before committing:
- Authentication flows
- Journal entry creation
- Analytics calculations
- Badge unlocking
- Goal CRUD operations

### Browser Testing

Test across browsers:
- Chrome/Edge (Chromium)
- Firefox
- Safari

### Device Testing

Test responsive design on:
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

## Troubleshooting

### Common Issues

**Build Errors**:
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run type-check`

**Database Connection Issues**:
- Verify environment variables
- Check Supabase project status
- Confirm RLS policies allow access

**Authentication Issues**:
- Clear browser cookies
- Check Supabase Auth configuration
- Verify redirect URLs in Supabase dashboard

**Large File Issues**:
- Use Git LFS for files over 100MB
- Compress images and assets
- Host large media externally

## Contributing

### Pull Request Process

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Update documentation
5. Submit pull request with description

### Commit Message Format

Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions
- `chore:` Build process updates

## License

Copyright 2025 Pulse Web Application. All rights reserved.

## Support

For issues and questions:
- Create GitHub issue
- Check existing documentation
- Review code comments

## Changelog

### Version 1.0.0 (2025-11-11)

**Features**:
- Voice journaling with transcription
- Mood analysis and tracking
- Analytics dashboard with charts
- Badge achievement system
- Goal tracking
- PDF export functionality
- Responsive design
- Dark mode support

**Technical**:
- Next.js 16 with App Router
- Supabase authentication and database
- TypeScript throughout
- Git LFS for large assets
- Comprehensive component library
