import { Router, Response } from 'express';
import { authenticateJWT, AuthRequest } from '../middleware/auth.js';
import { rateLimitMiddleware, RATE_LIMITS, getRateLimitHeaders } from '../middleware/rateLimit.js';
import { sanitizeString } from '../middleware/validation.js';

const router = Router();

const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;
if (!elevenLabsApiKey) {
  console.warn('ELEVENLABS_API_KEY not configured. TTS endpoint will not work.');
}

router.post('/', authenticateJWT, rateLimitMiddleware(RATE_LIMITS.AI_ENDPOINTS), async (req: AuthRequest, res: Response) => {
  try {
    const { text, voiceId } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (!elevenLabsApiKey) {
      return res.status(500).json({ error: 'ElevenLabs API key not configured' });
    }

    const sanitizedText = sanitizeString(text, 5000);
    if (sanitizedText.length === 0) {
      return res.status(400).json({ error: 'Text cannot be empty' });
    }

    const sanitizedVoiceId = voiceId ? sanitizeString(voiceId) : '21m00Tcm4TlvDq8ikWAM'; // Default to Rachel voice

    // Call ElevenLabs API directly via REST
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${sanitizedVoiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': elevenLabsApiKey,
      },
      body: JSON.stringify({
        text: sanitizedText,
        model_id: 'eleven_multilingual_v2',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
    }

    const audioBuffer = Buffer.from(await response.arrayBuffer());

    const headers = {
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length.toString(),
      ...getRateLimitHeaders(
        parseInt(res.getHeader('X-RateLimit-Remaining') as string || '0'),
        parseInt(res.getHeader('X-RateLimit-Reset') as string || '0')
      ),
    };

    res.set(headers);
    res.send(audioBuffer);
  } catch (error) {
    console.error('ElevenLabs API Error:', error);
    res.status(500).json({ error: 'Failed to generate speech' });
  }
});

export { router as ttsRouter };

