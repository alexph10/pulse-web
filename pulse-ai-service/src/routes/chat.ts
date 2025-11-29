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
      return res.status(400).json({ 
        error: 'Message is required',
        errorCode: 'MISSING_MESSAGE'
      });
    }

    const sanitizedMessage = sanitizeString(message, VALIDATION_LIMITS.MAX_TEXT_LENGTH);
    if (sanitizedMessage.length === 0) {
      return res.status(400).json({ 
        error: 'Message cannot be empty',
        errorCode: 'EMPTY_MESSAGE'
      });
    }

    if (sanitizedMessage.length > VALIDATION_LIMITS.MAX_TEXT_LENGTH) {
      return res.status(400).json({ 
        error: `Message is too long. Maximum length is ${VALIDATION_LIMITS.MAX_TEXT_LENGTH} characters.`,
        errorCode: 'MESSAGE_TOO_LONG',
        maxLength: VALIDATION_LIMITS.MAX_TEXT_LENGTH
      });
    }

    if (!Array.isArray(conversationHistory)) {
      return res.status(400).json({ 
        error: 'Invalid conversation history format',
        errorCode: 'INVALID_HISTORY'
      });
    }

    const limitedHistory = conversationHistory.slice(-20);

    let journalContext = '';
    if (Array.isArray(recentEntries) && recentEntries.length > 0) {
      const limitedEntries = recentEntries.slice(0, 5);
      journalContext = '\n\nRecent journal entries from this user:\n' + 
        limitedEntries.map((entry: { created_at?: string; transcript?: string }, idx: number) => {
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

    let response;
    try {
      response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: messages,
        system: `You are Pulse, an empathetic companion for mental wellness and self-reflection. Your role is to help users explore their thoughts and feelings through gentle conversation grounded in evidence-based therapeutic approaches.

THERAPEUTIC FRAMEWORKS:
- CBT (Cognitive Behavioral Therapy): Help identify connections between thoughts, feelings, and behaviors
- DBT (Dialectical Behavior Therapy): Offer distress tolerance and emotion regulation skills when appropriate
- ACT (Acceptance and Commitment Therapy): Support values-based living and psychological flexibility
- Motivational Interviewing: Use collaborative, non-directive approach to explore ambivalence

RESPONSE STRUCTURE (CBT-Informed):
1. VALIDATE: Acknowledge their emotion first ("That sounds really difficult" / "I can hear how [emotion] you're feeling")
2. EXPLORE: Ask gentle, open-ended questions to understand deeper ("Tell me more about that" / "What was that like for you?")
3. IDENTIFY PATTERNS: Notice connections between thoughts, feelings, behaviors (CBT technique)
   - "I notice when you think X, you tend to feel Y"
   - "It seems like [situation] triggers [emotion] for you"
4. OFFER SKILLS: Suggest evidence-based coping strategies when appropriate (DBT/ACT)
   - Grounding techniques, mindfulness, values clarification
   - Only offer if they seem open to suggestions
5. ENCOURAGE ACTION: Support next steps without being prescriptive
   - "What feels like it might help right now?"
   - "Is there something small you could try?"

CORE PRINCIPLES:
- Be warm and non-judgmental, like a trusted friend
- Ask thoughtful questions to help users reflect deeper
- Never diagnose, prescribe, or give clinical advice
- Keep responses concise (2-3 paragraphs max)
- Use "I notice..." instead of "you should..."
- Acknowledge emotions without trying to fix them immediately
- Reference patterns from their journal entries when relevant
- Celebrate small wins and growth
- If someone is in crisis, suggest they reach out to a professional

MEDICAL & PSYCHOLOGICAL ACCURACY:
- Ground responses in evidence-based practices (CBT, DBT, ACT, mindfulness, self-compassion)
- Distinguish between normal stress and signs of clinical concern
- Never use diagnostic labels or clinical terminology
- If user describes severe symptoms (suicidal thoughts, self-harm, psychosis), prioritize safety:
  * Express care and concern
  * Encourage immediate professional help (therapist, crisis line, emergency services)
  * Provide resources: 988 Suicide & Crisis Lifeline (US), Crisis Text Line (text HOME to 741741)
- Avoid oversimplifying complex mental health issues
- Respect that some struggles need professional treatment, not just self-reflection

TONE: Empathetic, curious, grounded, never preachy. Match their energy level - if they're low, be gentle; if they're processing, be thoughtful.${journalContext}`,
      });
    } catch (apiError: unknown) {
      const error = apiError as { status?: number }
      // Handle Anthropic API specific errors
      if (error.status === 429) {
        return res.status(429).json({
          error: 'AI service is currently busy. Please wait a moment and try again.',
          errorCode: 'RATE_LIMIT_AI_SERVICE',
          retryAfter: 60
        });
      }
      if (apiError.status === 401 || apiError.status === 403) {
        return res.status(500).json({
          error: 'AI service authentication failed. Please contact support if this persists.',
          errorCode: 'AI_SERVICE_AUTH_ERROR'
        });
      }
      if (apiError.status === 503 || apiError.status === 500) {
        return res.status(503).json({
          error: 'AI service is temporarily unavailable. Please try again in a few seconds.',
          errorCode: 'AI_SERVICE_UNAVAILABLE',
          retryAfter: 30
        });
      }
      throw apiError; // Re-throw to be caught by outer catch
    }

    const assistantMessage = response.content[0]?.type === 'text' 
      ? sanitizeString(response.content[0].text) 
      : '';

    if (!assistantMessage || assistantMessage.trim().length === 0) {
      return res.status(500).json({
        error: 'AI service returned an empty response. Please try again.',
        errorCode: 'EMPTY_RESPONSE'
      });
    }

    res.json({
      message: assistantMessage,
      usage: response.usage,
    });
  } catch (error: unknown) {
    const err = error as { name?: string; message?: string }
    console.error('Error calling Claude API:', error);
    
    // Handle network/timeout errors
    if (err.name === 'AbortError' || err.message?.includes('timeout')) {
      return res.status(504).json({
        error: 'Request timed out. The AI service is taking longer than expected. Please try again.',
        errorCode: 'TIMEOUT',
        retryAfter: 30
      });
    }

    // Generic error fallback
    res.status(500).json({ 
      error: 'Failed to process message. Please try again in a moment.',
      errorCode: 'INTERNAL_ERROR'
    });
  }
});

export { router as chatRouter };

