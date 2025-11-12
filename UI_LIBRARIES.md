# UI Library Integration Guide

This document provides comprehensive details on integrating **ElevenLabs UI** and **Supabase UI** into your project. Both libraries are built on top of shadcn/ui and work seamlessly with your existing design system.

---

## ElevenLabs UI Components

**Official Documentation**: https://ui.elevenlabs.io/docs/components

ElevenLabs UI is a collection of React components for building audio and conversational interfaces. All components are installed via their CLI.

### Installation

Install components using the ElevenLabs CLI:

```bash
npx @elevenlabs/cli@latest components add [component-name]
```

### Available Components

#### Audio Components

1. **Audio Player** - Customizable audio player with progress controls
   ```bash
   npx @elevenlabs/cli@latest components add audio-player
   ```
   - Features: Play/pause, progress bar, time display, playback speed control
   - Use cases: Music players, podcast players, voice playback
   - Components: `AudioPlayerProvider`, `AudioPlayerButton`, `AudioPlayerProgress`, `AudioPlayerTime`, `AudioPlayerDuration`, `AudioPlayerSpeed`

2. **Bar Visualizer** - Audio visualization with animated bars
   ```bash
   npx @elevenlabs/cli@latest components add bar-visualizer
   ```

3. **Live Waveform** - Real-time audio waveform visualization
   ```bash
   npx @elevenlabs/cli@latest components add live-waveform
   ```

4. **Scrub Bar** - Timeline scrubber for audio/video
   ```bash
   npx @elevenlabs/cli@latest components add scrub-bar
   ```

#### Conversational UI

5. **Conversation** - Scrolling chat container with auto-scroll
   ```bash
   npx @elevenlabs/cli@latest components add conversation
   ```
   - Features: Auto-scroll to bottom, sticky behavior, smooth scrolling
   - Components: `Conversation`, `ConversationContent`, `ConversationEmptyState`, `ConversationScrollButton`

6. **Conversation Bar** - Input bar for chat interfaces
   ```bash
   npx @elevenlabs/cli@latest components add conversation-bar
   ```

7. **Message** - Individual message component
   ```bash
   npx @elevenlabs/cli@latest components add message
   ```

8. **Response** - Response message component
   ```bash
   npx @elevenlabs/cli@latest components add response
   ```

9. **Transcript Viewer** - Display conversation transcripts
   ```bash
   npx @elevenlabs/cli@latest components add transcript-viewer
   ```

#### Voice & Recording

10. **Voice Button** - Voice recording/playback button
    ```bash
    npx @elevenlabs/cli@latest components add voice-button
    ```

11. **Mic Selector** - Microphone input selector
    ```bash
    npx @elevenlabs/cli@latest components add mic-selector
    ```

#### Visual Effects

12. **Orb** - Animated orb visualization
    ```bash
    npx @elevenlabs/cli@latest components add orb
    ```

13. **Matrix** - Matrix-style visual effect
    ```bash
    npx @elevenlabs/cli@latest components add matrix
    ```

14. **Shimmering Text** - Animated shimmering text effect
    ```bash
    npx @elevenlabs/cli@latest components add shimmering-text
    ```

### Example Usage - Audio Player

```tsx
import {
  AudioPlayerProvider,
  AudioPlayerButton,
  AudioPlayerProgress,
  AudioPlayerTime,
  AudioPlayerDuration,
  AudioPlayerSpeed
} from '@/components/ui/audio-player';

export function MyAudioPlayer() {
  const track = {
    id: 'track-1',
    src: '/audio/sample.mp3',
    data: { title: 'My Track' }
  };

  return (
    <AudioPlayerProvider>
      <div className="flex items-center gap-4">
        <AudioPlayerButton item={track} />
        <AudioPlayerTime />
        <AudioPlayerProgress className="flex-1" />
        <AudioPlayerDuration />
        <AudioPlayerSpeed />
      </div>
    </AudioPlayerProvider>
  );
}
```

### Example Usage - Conversation

```tsx
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton
} from '@/components/ui/conversation';

export function ChatInterface({ messages }) {
  return (
    <Conversation>
      <ConversationContent>
        {messages.length === 0 ? (
          <ConversationEmptyState
            title="No messages yet"
            description="Start a conversation"
          />
        ) : (
          messages.map((msg) => (
            <div key={msg.id}>{msg.content}</div>
          ))
        )}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
}
```

---

## Supabase UI Blocks

**Official Documentation**: https://supabase.com/ui/docs

Supabase UI is a collection of pre-built blocks that integrate with your Supabase backend. Components are installed via shadcn-style CLI.

### Installation

Install blocks using npx:

```bash
npx shadcn@latest add @supabase/[block-name]
```

### Available Blocks

#### Authentication

1. **Password-Based Auth** - Complete email/password authentication flow
   ```bash
   npx shadcn@latest add @supabase/password-based-auth-nextjs
   ```
   - Includes: Login, signup, forgot password, email confirmation
   - Pages: `/auth/login`, `/auth/sign-up`, `/auth/forgot-password`, `/auth/update-password`
   - Components: `LoginForm`, `SignUpForm`, `ForgotPasswordForm`, `UpdatePasswordForm`, `LogoutButton`

2. **Social Auth** (NEW) - OAuth providers integration
   ```bash
   npx shadcn@latest add @supabase/social-auth-nextjs
   ```
   - Providers: Google, GitHub, Twitter, Discord, etc.

#### File Management

3. **Dropzone** - Drag-and-drop file upload
   ```bash
   npx shadcn@latest add @supabase/dropzone-nextjs
   ```
   - Features: Multiple files, file size limits, file type validation
   - Integrates with Supabase Storage

#### Realtime Features

4. **Realtime Cursor** - Show live cursor positions
   ```bash
   npx shadcn@latest add @supabase/realtime-cursor-nextjs
   ```

5. **Realtime Avatar Stack** - Live user presence avatars
   ```bash
   npx shadcn@latest add @supabase/realtime-avatar-stack-nextjs
   ```

6. **Realtime Chat** - Live messaging component
   ```bash
   npx shadcn@latest add @supabase/realtime-chat-nextjs
   ```

#### User Components

7. **Current User Avatar** - Display logged-in user's avatar
   ```bash
   npx shadcn@latest add @supabase/current-user-avatar-nextjs
   ```

#### Data Hooks

8. **Infinite Query Hook** (NEW) - Infinite scroll data fetching
   ```bash
   npx shadcn@latest add @supabase/infinite-query-hook
   ```

### Folder Structure (Example - Password Auth)

After installation, you'll get:

```
app/
  auth/
    confirm/route.ts          # Email confirmation handler
    error/page.tsx           # Error display page
    forgot-password/page.tsx # Password reset request
    login/page.tsx           # Login page
    sign-up/page.tsx         # Registration page
    sign-up-success/page.tsx # Post-signup confirmation
    update-password/page.tsx # Password update form
  protected/page.tsx         # Example protected route
components/
  forgot-password-form.tsx   # Forgot password form component
  login-form.tsx            # Login form component
  logout-button.tsx         # Logout button component
  sign-up-form.tsx          # Signup form component
  update-password-form.tsx  # Update password form component
lib/
  supabase/
    client.ts               # Client-side Supabase client
    middleware.ts           # Middleware Supabase client
    server.ts               # Server-side Supabase client
middleware.ts               # Auth middleware
```

### Setup Requirements

1. **Environment Variables** (`.env.local`):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your_anon_key
   ```

2. **Email Templates**: Configure in Supabase Dashboard
   - Sign-up confirmation template
   - Password reset template

3. **URL Configuration**: Set site URL and redirect URLs in Supabase Dashboard

### Example Usage - Client Setup

```tsx
// Already installed! Check lib/supabase.ts
import { createClient } from '@/lib/supabase/client';

export function MyComponent() {
  const supabase = createClient();
  
  // Use the client
  const { data, error } = await supabase
    .from('your_table')
    .select('*');
}
```

---

## ElevenLabs API Integration

For voice generation and text-to-speech functionality.

### Packages Installed
- `@elevenlabs/client` - Core API client
- `@elevenlabs/react` - React hooks and components

### Configuration

Add your API key to `.env.local`:

```env
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_api_key_here
```

### Usage Files

- `lib/elevenlabs.ts` - Configuration and utilities
- `app/api/elevenlabs/tts/route.ts` - TTS API endpoint
- `app/components/examples/ElevenLabsExample.tsx` - Example component

### Common Voice IDs
- Rachel: `21m00Tcm4TlvDq8ikWAM`
- Domi: `AZnzlk1XvdvUeBnXmlld`
- Bella: `EXAVITQu4vr4xnSDxMaL`
- Antoni: `ErXwobaYiN019PkySvjV`

---

## Integration Benefits

### Why These Libraries?

1. **Built on shadcn/ui** - Seamless integration with your existing design system
2. **Type-safe** - Full TypeScript support
3. **Customizable** - All code is in your repo, modify as needed
4. **Production-ready** - Battle-tested components
5. **Theme-compatible** - Inherits your dark red accent colors

### Design System Compatibility

Both libraries:
- Use CSS variables (compatible with your theme)
- Support light/dark mode
- Work with Tailwind CSS
- Follow shadcn/ui patterns
- Can be styled with your existing color palette

---

## Recommended Installation Order

For a typical app, install in this order:

### Phase 1: Foundation
1. ✅ shadcn/ui (already installed)
2. Supabase Client (if using auth blocks)
3. Password-Based Auth block

### Phase 2: Features
4. Dropzone (file uploads)
5. Current User Avatar
6. Audio Player (if needed)
7. Conversation (if building chat)

### Phase 3: Advanced
8. Realtime features (cursor, chat, avatars)
9. Voice components (Voice Button, Mic Selector)
10. Visual effects (Orb, Shimmering Text)

---

## Quick Start Commands

```bash
# Install Supabase Auth
npx shadcn@latest add @supabase/password-based-auth-nextjs

# Install Audio Player
npx @elevenlabs/cli@latest components add audio-player

# Install File Upload
npx shadcn@latest add @supabase/dropzone-nextjs

# Install Chat Interface
npx @elevenlabs/cli@latest components add conversation

# Install Realtime Chat
npx shadcn@latest add @supabase/realtime-chat-nextjs
```

---

## Resources

### ElevenLabs UI
- Docs: https://ui.elevenlabs.io/docs
- GitHub: https://github.com/elevenlabs/ui
- Components: https://ui.elevenlabs.io/docs/components

### Supabase UI
- Docs: https://supabase.com/ui/docs
- GitHub: https://github.com/supabase/supabase/tree/master/apps/ui-library
- Blocks: https://supabase.com/ui/docs/nextjs

### ElevenLabs API
- API Docs: https://elevenlabs.io/docs
- NPM: https://www.npmjs.com/package/@elevenlabs/client

