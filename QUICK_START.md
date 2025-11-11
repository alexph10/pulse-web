# 🚀 Pulse Web - Quick Setup Guide

## Welcome! Let's get your app running in 5 minutes.

---

## ✅ Step 1: Database Setup (CRITICAL)

Your journal and profile features need a database table.

### Run this SQL in Supabase:

1. Go to your **Supabase Dashboard** → **SQL Editor**
2. Open the file `setup-database.sql` in this project
3. Copy and paste the entire SQL script
4. Click **Run** ▶️

This creates:
- ✅ `journal_entries` table
- ✅ Indexes for fast queries
- ✅ Row Level Security (RLS) policies
- ✅ Automatic timestamp updates

**⏱️ Estimated time: 2 minutes**

---

## ✅ Step 2: Storage Setup (IMPORTANT)

Profile pictures and banners need a storage bucket.

### Option A: Supabase Dashboard (Easiest)

1. Go to **Supabase Dashboard** → **Storage**
2. Click **"New bucket"**
3. **Name**: `avatars`
4. **Public bucket**: ✅ Check this box
5. Click **"Create bucket"**

### Option B: SQL Editor

Run this in SQL Editor:

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;
```

**⏱️ Estimated time: 1 minute**

📖 For detailed instructions, see `STORAGE_SETUP.md`

---

## ✅ Step 3: Environment Variables

Make sure your `.env.local` has:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_key
```

**⏱️ Estimated time: 1 minute**

---

## ✅ Step 4: Install & Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**⏱️ Estimated time: 1 minute**

---

## 🎯 What Works Now?

After completing the setup:

✅ **Authentication**
- Email/password login and signup
- Google OAuth
- Password reset flow
- Email verification

✅ **Voice Journaling**
- Record voice notes
- Auto-transcription (OpenAI Whisper)
- AI mood analysis (GPT-4o-mini)
- Save and view journal history

✅ **Profile Page**
- Custom profile picture
- Custom banner image
- Edit username and bio
- View all journal entries

✅ **Dashboard**
- Navigation to all features
- Profile dropdown menu
- Theme toggle (prepared for dark mode)

---

## 🔧 Troubleshooting

### "entries.map is not a function"
- ✅ **Fixed!** The code now handles this automatically

### Images not uploading?
- Check that `avatars` bucket exists
- Verify bucket is set to **public**
- Check file size (max 5MB)

### Journal not saving?
- Run the `setup-database.sql` script
- Check that `journal_entries` table exists
- Verify RLS policies are enabled

### Transcription failing?
- Check `OPENAI_API_KEY` in `.env.local`
- Verify API key has access to Whisper API
- Check API quota/billing

---

## 📚 Next Steps

After basic setup works:

1. **Customize theme colors** in `app/globals.css`
2. **Test all features** (journal, profile, auth)
3. **Set up dark mode** (theme variables ready)
4. **Add more features** from your roadmap
5. **Deploy to Vercel** when ready

---

## 🆘 Need Help?

Common issues and solutions:

| Issue | Solution |
|-------|----------|
| Database errors | Run `setup-database.sql` |
| Upload errors | Create `avatars` bucket |
| Auth not working | Check Supabase URL/keys |
| Transcription fails | Verify OpenAI API key |

---

## ✨ You're All Set!

Your Pulse app is ready to use. Start journaling! 🎙️

**Happy coding!** 🚀
