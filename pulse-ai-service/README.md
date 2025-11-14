# Pulse AI Service

Separated AI service for Pulse mental wellness app. Handles all AI API integrations (OpenAI, Anthropic, ElevenLabs) with proper security and rate limiting.

## Features

- Mood analysis (OpenAI GPT-4)
- Pattern detection (Anthropic Claude)
- Therapeutic chat (Anthropic Claude)
- Speech-to-text transcription (OpenAI Whisper)
- Text-to-speech (ElevenLabs)
- JWT authentication
- Rate limiting
- CORS protection

## Setup

1. Copy `.env.example` to `.env` and fill in your API keys
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`
4. Build for production: `npm run build`
5. Start production server: `npm start`

## Environment Variables

See `.env.example` for required environment variables.

## API Endpoints

- `POST /api/analyze-mood` - Analyze mood from text
- `POST /api/analyze-patterns` - Analyze patterns from journal entries
- `POST /api/chat` - Therapeutic chat conversation
- `POST /api/transcribe` - Transcribe audio to text
- `POST /api/tts` - Text-to-speech conversion
- `GET /health` - Health check endpoint

## Authentication

All endpoints require JWT authentication. The main app should include a JWT token in the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

## Deployment

The service can be deployed as a Docker container or directly to a VPS.

### Docker

```bash
docker build -t pulse-ai-service .
docker run -p 3001:3001 --env-file .env pulse-ai-service
```

### VPS

1. Build the project: `npm run build`
2. Start with PM2: `pm2 start dist/server.js --name pulse-ai-service`
3. Setup reverse proxy (nginx) to forward requests to port 3001

