# 🌟 Pulse Web - AI-Powered Voice Journaling Platform

A modern, full-stack web application for voice journaling with AI-powered mood analysis. Built with Next.js 16, Supabase, and OpenAI.

![Next.js](https://img.shields.io/badge/Next.js-16.0.1-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Supabase](https://img.shields.io/badge/Supabase-2.x-green)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991)

---

## ✨ Features

### 🎙️ Voice Journaling
- **Real-time voice recording** with pause/resume
- **Automatic transcription** using OpenAI Whisper
- **AI mood analysis** powered by GPT-4o-mini
- **Mood visualization** with emojis, scores, and emotion tags
- **Journal history** with searchable entries

### 🧠 AI Mood Analysis
- Detects 10+ mood types (joyful, calm, anxious, sad, etc.)
- Mood intensity scoring (0-10)
- Emotion keyword extraction
- Sentiment analysis (positive/negative/neutral)
- AI-generated insights and reflection questions

### 👤 User Profiles
- Custom profile pictures
- Custom banner images
- Editable username and bio
- View all journal entries on profile

### 🔐 Authentication
- Email/password authentication
- Google OAuth integration
- Password reset flow
- Email verification
- Protected routes with middleware

### 🎨 Modern UI/UX
- Clean, minimalist design
- Responsive layouts
- Smooth animations and transitions
- Custom fonts (Satoshi, Switzer)
- Theme system (dark mode ready)
- 3D point cloud visualization on landing

---

## 🚀 Quick Start

**⏱️ Total setup time: ~5 minutes**

### Prerequisites
- Node.js 18+ installed
- Supabase account
- OpenAI API key

### 1. Clone & Install
```bash
git clone https://github.com/alexph10/pulse-web.git
cd pulse-web
npm install
```

### 2. Environment Setup
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_key
```

### 3. Database Setup
Run `setup-database.sql` in your Supabase SQL Editor

### 4. Storage Setup
Create an `avatars` bucket in Supabase Storage (set to public)

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

📖 **Detailed instructions:** See [QUICK_START.md](./QUICK_START.md)

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16.0.1 (App Router)
- **Language:** TypeScript
- **Styling:** CSS Modules + inline styles
- **3D Graphics:** Three.js + React Three Fiber
- **Fonts:** Satoshi, Switzer

### Backend
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage
- **APIs:** Next.js API Routes

### AI/ML
- **Transcription:** OpenAI Whisper-1
- **Mood Analysis:** OpenAI GPT-4o-mini
- **Voice Recording:** MediaRecorder API

---

## 📁 Project Structure

```
pulse-web/
├── app/
│   ├── api/                    # API routes
│   │   ├── transcribe/        # Whisper transcription
│   │   ├── analyze-mood/      # GPT mood analysis
│   │   └── journal/           # Journal CRUD
│   ├── components/            # React components
│   │   ├── dashboard-navbar/
│   │   ├── sidebar/
│   │   └── ...
│   ├── contexts/              # React contexts
│   │   └── AuthContext.tsx
│   ├── dashboard/             # Dashboard pages
│   │   ├── journal/          # Voice journaling
│   │   ├── profile/          # User profile
│   │   ├── notes/            # Notes feature
│   │   └── ...
│   ├── hooks/                # Custom hooks
│   │   └── useVoiceRecorder.ts
│   ├── onboarding/           # Auth pages
│   ├── globals.css           # Global styles
│   └── layout.tsx            # Root layout
├── lib/
│   └── supabase.ts           # Supabase client
├── public/                   # Static assets
├── setup-database.sql        # Database setup
├── QUICK_START.md           # Setup guide
└── STORAGE_SETUP.md         # Storage guide
```

---

## 🎯 Key Features Deep Dive

### Voice Recording
- Uses browser MediaRecorder API
- Records in WebM format
- Real-time timer with pause/resume
- Visual recording indicator with pulse animation

### AI Mood Analysis
Analyzes journal entries for:
- **Primary Mood:** joyful, calm, anxious, sad, angry, excited, grateful, hopeful, frustrated, content
- **Mood Score:** 0-10 intensity rating
- **Emotions:** Array of detected emotions
- **Sentiment:** Overall positive/negative/neutral
- **Keywords:** Key themes and topics
- **Insight:** AI-generated understanding
- **Follow-up Question:** Reflection prompt

### Profile Customization
- Upload profile picture (max 5MB)
- Upload banner image (max 5MB)
- Images stored in Supabase Storage
- Public URLs for fast access
- Automatic file validation

---

## 🔒 Security

- **Row Level Security (RLS)** on all database tables
- **Authentication required** for protected routes
- **User isolation** - users can only access their own data
- **Secure file uploads** with validation
- **API route protection** with Supabase Auth
- **Environment variables** for sensitive keys

---

## 📊 Database Schema

### journal_entries
```sql
- id (UUID, primary key)
- user_id (UUID, foreign key)
- transcript (TEXT)
- audio_url (TEXT, nullable)
- primary_mood (TEXT)
- mood_score (INTEGER, 0-10)
- emotions (TEXT[])
- sentiment (TEXT)
- keywords (TEXT[])
- insight (TEXT)
- follow_up_question (TEXT)
- is_favorite (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

---

## 🚧 Roadmap

- [ ] Dark mode toggle
- [ ] Advanced mood analytics/charts
- [ ] Export journal entries
- [ ] Voice note playback
- [ ] Mobile app (React Native)
- [ ] Mood trends and insights
- [ ] Journal search and filters
- [ ] Tags and categories
- [ ] Reminder notifications
- [ ] Data export (PDF, CSV)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📝 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **Next.js** - React framework
- **Supabase** - Backend infrastructure
- **OpenAI** - AI models
- **Three.js** - 3D graphics
- **Vercel** - Hosting platform

---

## 📧 Contact

Questions or feedback? Open an issue or reach out!

**Built with ❤️ by the Pulse team**
