# UI Library Integration Guide

## Supabase UI Blocks

Supabase UI is a collection of pre-built blocks that integrate with your Supabase backend.

### Installation

Supabase UI blocks are installed via CLI commands (similar to shadcn). To add a block:

```bash
npx supabase-ui add [block-name]
```

### Available Blocks

#### Authentication
- **Password-Based Auth**: `npx supabase-ui add password-auth`
- **Social Auth**: `npx supabase-ui add social-auth`

#### File Management
- **Dropzone**: `npx supabase-ui add dropzone`

#### Realtime Features
- **Realtime Cursor**: `npx supabase-ui add realtime-cursor`
- **Realtime Avatar Stack**: `npx supabase-ui add realtime-avatar-stack`
- **Realtime Chat**: `npx supabase-ui add realtime-chat`

#### User Components
- **Current User Avatar**: `npx supabase-ui add current-user-avatar`

#### Data Hooks
- **Infinite Query Hook**: `npx supabase-ui add infinite-query-hook`

### Documentation
- Official Docs: https://supabase.com/ui/docs
- GitHub: https://github.com/supabase/supabase/tree/master/apps/ui-library

---

## ElevenLabs Integration

ElevenLabs provides API clients for text-to-speech and voice generation.

### Packages Installed
- `@elevenlabs/client` - Core API client
- `@elevenlabs/react` - React hooks and components

### Configuration

Add your API key to `.env.local`:

```env
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_api_key_here
```

### Usage

#### Text-to-Speech (Server/Client)

```typescript
import { textToSpeech, getVoices } from '@/lib/elevenlabs';

// Convert text to speech
const audio = await textToSpeech('Hello world!');

// Get available voices
const voices = await getVoices();
```

#### React Component (with @elevenlabs/react)

```tsx
'use client';

import { useElevenLabs } from '@elevenlabs/react';

export function VoiceComponent() {
  const { generate } = useElevenLabs({
    apiKey: process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY,
  });

  const handleSpeak = async () => {
    await generate({
      text: 'Hello from ElevenLabs!',
      voice: '21m00Tcm4TlvDq8ikWAM', // Rachel voice
    });
  };

  return <button onClick={handleSpeak}>Speak</button>;
}
```

### Common Voice IDs
- Rachel: `21m00Tcm4TlvDq8ikWAM`
- Domi: `AZnzlk1XvdvUeBnXmlld`
- Bella: `EXAVITQu4vr4xnSDxMaL`
- Antoni: `ErXwobaYiN019PkySvjV`

### Documentation
- API Docs: https://elevenlabs.io/docs
- NPM Package: https://www.npmjs.com/package/@elevenlabs/client

---

## Integration Benefits

### Why These Libraries?

1. **Built on shadcn/ui** - Both integrate seamlessly with your existing design system
2. **Type-safe** - Full TypeScript support
3. **Supabase Integration** - UI blocks connect directly to your existing Supabase backend
4. **Production-ready** - Used by thousands of projects

### Next Steps

1. Add Supabase UI blocks as needed for your features
2. Configure ElevenLabs API key for voice features
3. Use the utility functions in `lib/elevenlabs.ts`
4. All components will inherit your dark red accent theme
