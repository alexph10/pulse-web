import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { analyzeMoodRouter } from './routes/analyze-mood.js';
import { analyzePatternsRouter } from './routes/analyze-patterns.js';
import { chatRouter } from './routes/chat.js';
import { transcribeRouter } from './routes/transcribe.js';
import { ttsRouter } from './routes/tts.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/analyze-mood', analyzeMoodRouter);
app.use('/api/analyze-patterns', analyzePatternsRouter);
app.use('/api/chat', chatRouter);
app.use('/api/transcribe', transcribeRouter);
app.use('/api/tts', ttsRouter);

// Error handling middleware
app.use((err: Error & { status?: number }, req: express.Request, res: express.Response) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Pulse AI Service running on port ${PORT}`);
});

