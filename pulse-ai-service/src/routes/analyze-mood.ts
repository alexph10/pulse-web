import { Router, Response } from 'express';
import OpenAI from 'openai';
import { authenticateJWT, AuthRequest } from '../middleware/auth.js';
import { rateLimitMiddleware, RATE_LIMITS } from '../middleware/rateLimit.js';
import { sanitizeString, VALIDATION_LIMITS } from '../middleware/validation.js';

const router = Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/', authenticateJWT, rateLimitMiddleware(RATE_LIMITS.AI_ENDPOINTS), async (req: AuthRequest, res: Response) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    const sanitizedText = sanitizeString(text, VALIDATION_LIMITS.MAX_TEXT_LENGTH);
    if (sanitizedText.length === 0) {
      return res.status(400).json({ error: 'Text cannot be empty' });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a compassionate mental wellness assistant analyzing journal entries. Analyze the emotional content and return ONLY a valid JSON object (no markdown, no explanation) with this exact structure:

{
  "primaryMood": "string (one of: joyful, content, calm, neutral, anxious, sad, frustrated, angry, overwhelmed, excited)",
  "moodScore": number (0-10, where 0 is very negative, 5 is neutral, 10 is very positive),
  "emotions": ["array of detected emotions as strings"],
  "sentiment": "string (positive, negative, neutral, or mixed)",
  "keywords": ["array of significant emotional keywords from the text"],
  "insight": "string (one brief, empathetic sentence about what they're experiencing)",
  "followUpQuestion": "string (one thoughtful question to help them reflect deeper)"
}`
        },
        {
          role: 'user',
          content: sanitizedText
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const responseText = completion.choices[0]?.message?.content?.trim() || '';
    
    if (!responseText) {
      return res.status(500).json({ error: 'No response from AI service' });
    }

    let analysis;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        analysis = JSON.parse(responseText);
      }
    } catch (parseError) {
      console.error('Failed to parse mood analysis response:', parseError);
      console.error('Response text:', responseText.substring(0, 500));
      return res.status(500).json({ error: 'Failed to parse mood analysis. Please try again.' });
    }

    if (!analysis.primaryMood || typeof analysis.moodScore !== 'number') {
      console.error('Invalid analysis structure:', analysis);
      return res.status(500).json({ error: 'Invalid analysis response format' });
    }

    res.json({
      ...analysis,
      success: true,
    });
  } catch (error: unknown) {
    console.error('Mood analysis error:', error);
    res.status(500).json({ error: 'Mood analysis failed' });
  }
});

export { router as analyzeMoodRouter };

