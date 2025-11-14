import { Router, Response } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { authenticateJWT, AuthRequest } from '../middleware/auth.js';
import { rateLimitMiddleware, RATE_LIMITS } from '../middleware/rateLimit.js';
import { sanitizeString, VALIDATION_LIMITS } from '../middleware/validation.js';

const router = Router();
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

router.post('/', authenticateJWT, rateLimitMiddleware(RATE_LIMITS.AI_ENDPOINTS), async (req: AuthRequest, res: Response) => {
  try {
    const { message, conversationHistory = [], recentEntries = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const sanitizedMessage = sanitizeString(message, VALIDATION_LIMITS.MAX_TEXT_LENGTH);
    if (sanitizedMessage.length === 0) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    if (!Array.isArray(conversationHistory)) {
      return res.status(400).json({ error: 'Invalid conversation history format' });
    }

    const limitedHistory = conversationHistory.slice(-20);

    let journalContext = '';
    if (Array.isArray(recentEntries) && recentEntries.length > 0) {
      const limitedEntries = recentEntries.slice(0, 5);
      journalContext = '\n\nRecent journal entries from this user:\n' + 
        limitedEntries.map((entry: any, idx: number) => {
          const date = entry.created_at ? new Date(entry.created_at).toLocaleDateString() : 'Unknown date';
          const transcript = sanitizeString(entry.transcript || '', 500);
          return `${idx + 1}. ${date}: "${transcript}"`;
        }).join('\n');
    }

    const messages = [
      ...limitedHistory,
      {
        role: 'user' as const,
        content: sanitizedMessage,
      },
    ];

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: messages,
      system: `You are Pulse, an empathetic companion for mental wellness and self-reflection. Your role is to help users explore their thoughts and feelings through gentle conversation.

Core principles:
- Be warm and non-judgmental, like a trusted friend
- Ask thoughtful questions to help users reflect deeper
- Never diagnose, prescribe, or give clinical advice
- Keep responses concise (2-3 paragraphs max)
- Use "I notice..." instead of "you should..."
- Acknowledge emotions without trying to fix them
- Reference patterns from their journal entries when relevant
- Celebrate small wins and growth
- If someone is in crisis, suggest they reach out to a professional

Medical & Psychological Accuracy:
- Ground responses in evidence-based practices (CBT, mindfulness, self-compassion)
- Distinguish between normal stress and signs of clinical concern
- Never use diagnostic labels or clinical terminology
- If user describes severe symptoms (suicidal thoughts, self-harm, psychosis), prioritize safety:
  * Express care and concern
  * Encourage immediate professional help (therapist, crisis line, emergency services)
  * Provide resources: 988 Suicide & Crisis Lifeline (US), Crisis Text Line (text HOME to 741741)
- Avoid oversimplifying complex mental health issues
- Respect that some struggles need professional treatment, not just self-reflection

Tone: Empathetic, curious, grounded, never preachy${journalContext}`,
    });

    const assistantMessage = response.content[0]?.type === 'text' 
      ? sanitizeString(response.content[0].text) 
      : '';

    res.json({
      message: assistantMessage,
      usage: response.usage,
    });
  } catch (error) {
    console.error('Error calling Claude API:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

export { router as chatRouter };

