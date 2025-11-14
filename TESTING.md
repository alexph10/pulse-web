# Testing Guide

## Local Development Setup

### 1. Start AI Service

```bash
cd pulse-ai-service
npm install
npm run dev
```

The service will run on `http://localhost:3001`

### 2. Start Main App

```bash
npm install
npm run dev
```

The app will run on `http://localhost:3000`

### 3. Configure Environment Variables

**Main App (.env.local):**
```
NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:3001
JWT_SECRET=test_jwt_secret_123
```

**AI Service (.env):**
```
PORT=3001
JWT_SECRET=test_jwt_secret_123
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
ELEVENLABS_API_KEY=your_elevenlabs_key
ALLOWED_ORIGINS=http://localhost:3000
```

## Testing Endpoints

### Health Check
```bash
curl http://localhost:3001/health
```

### Test Mood Analysis (with JWT token)
```bash
# First, get a JWT token from main app
# Then:
curl -X POST http://localhost:3001/api/analyze-mood \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text": "I feel great today!"}'
```

## End-to-End Testing

1. Start both services
2. Login to main app
3. Create a journal entry
4. Verify transcription works
5. Verify mood analysis works
6. Test chat functionality
7. Test pattern analysis

## Common Issues

### CORS Error
- Check `ALLOWED_ORIGINS` in AI service includes main app URL
- Verify CORS middleware is configured correctly

### Authentication Error
- Verify JWT_SECRET matches in both services
- Check token is being generated correctly
- Verify token is included in Authorization header

### Connection Refused
- Verify AI service is running on correct port
- Check firewall rules
- Verify NEXT_PUBLIC_AI_SERVICE_URL is correct

