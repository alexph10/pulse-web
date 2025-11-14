import { Router, Response } from 'express';
import OpenAI from 'openai';
import multer from 'multer';
import { authenticateJWT, AuthRequest } from '../middleware/auth.js';
import { rateLimitMiddleware, RATE_LIMITS } from '../middleware/rateLimit.js';
import { validateFileSize, isValidAudioFile, VALIDATION_LIMITS } from '../middleware/validation.js';

const router = Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: VALIDATION_LIMITS.MAX_AUDIO_SIZE_BYTES,
  },
});

router.post('/', authenticateJWT, rateLimitMiddleware(RATE_LIMITS.TRANSCRIBE), upload.single('audio'), async (req: AuthRequest, res: Response) => {
  try {
    const audioFile = req.file;

    if (!audioFile) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    if (!validateFileSize(audioFile.size, VALIDATION_LIMITS.MAX_AUDIO_SIZE_BYTES)) {
      return res.status(400).json({
        error: `Audio file too large. Maximum size is ${VALIDATION_LIMITS.MAX_AUDIO_SIZE_MB}MB`,
      });
    }

    if (!isValidAudioFile({ type: audioFile.mimetype || '' })) {
      return res.status(400).json({ error: 'Invalid audio file type' });
    }

    // Convert multer file to format OpenAI expects
    // In Node.js, we need to use File.create() or pass FileData object
    // OpenAI SDK accepts FileData which is { name: string, data: Buffer | ReadStream }
    const fileData = {
      name: audioFile.originalname || 'audio.webm',
      data: audioFile.buffer,
    };

    const transcription = await openai.audio.transcriptions.create({
      file: fileData as any, // FileData type
      model: 'whisper-1',
      language: 'en',
      response_format: 'json',
    });

    res.json({
      text: transcription.text || '',
      success: true,
    });
  } catch (error: any) {
    console.error('Transcription error:', error);
    res.status(500).json({ error: 'Transcription failed' });
  }
});

export { router as transcribeRouter };

