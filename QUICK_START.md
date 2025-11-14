# Quick Start Guide

## Setup AI Service

1. **Navigate to AI service directory:**
```bash
cd pulse-ai-service
```

2. **Install dependencies:**
```bash
npm install
```

3. **Setup environment variables:**
```bash
# Copy the example file (create .env manually if needed)
# See pulse-ai-service/ENV_SETUP.md for required variables
```

4. **Start the service:**
```bash
npm run dev
```

The service will run on `http://localhost:3001`

## Setup Main App

1. **Install dependencies:**
```bash
npm install
```

2. **Add environment variables to `.env.local`:**
```bash
NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:3001
JWT_SECRET=your_jwt_secret_here (must match AI service)
```

3. **Start the app:**
```bash
npm run dev
```

The app will run on `http://localhost:3000`

## Verify It Works

1. Login to the app
2. Go to Journal page
3. Record a voice entry
4. Verify transcription and mood analysis work
5. Test chat functionality in Notes page

## Troubleshooting

- **CORS errors**: Check `ALLOWED_ORIGINS` in AI service includes `http://localhost:3000`
- **Auth errors**: Verify `JWT_SECRET` matches in both services
- **Connection refused**: Make sure AI service is running on port 3001

