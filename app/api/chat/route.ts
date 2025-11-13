import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { validateUserId, unauthorizedResponse } from '@/lib/auth';
import { sanitizeString, VALIDATION_LIMITS } from '@/lib/validation';
import { checkRateLimit, RATE_LIMITS, getRateLimitHeaders } from '@/lib/rateLimit';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const auth = await validateUserId(req, null);
    if (!auth) {
      return unauthorizedResponse('Authentication required');
    }

    // Rate limiting for AI endpoints
    const rateLimit = checkRateLimit(auth.userId, RATE_LIMITS.AI_ENDPOINTS);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { 
          status: 429,
          headers: getRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime),
        }
      );
    }

    const body = await req.json();
    const { message, conversationHistory = [], recentEntries = [] } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Sanitize message
    const sanitizedMessage = sanitizeString(message, VALIDATION_LIMITS.MAX_TEXT_LENGTH);
    if (sanitizedMessage.length === 0) {
      return NextResponse.json(
        { error: 'Message cannot be empty' },
        { status: 400 }
      );
    }

    // Validate conversation history format
    if (!Array.isArray(conversationHistory)) {
      return NextResponse.json(
        { error: 'Invalid conversation history format' },
        { status: 400 }
      );
    }

    // Limit conversation history size to prevent token explosion
    const limitedHistory = conversationHistory.slice(-20); // Last 20 messages max

    // Build context from recent journal entries (limit to prevent token explosion)
    let journalContext = '';
    if (Array.isArray(recentEntries) && recentEntries.length > 0) {
      const limitedEntries = recentEntries.slice(0, 5); // Max 5 recent entries
      journalContext = '\n\nRecent journal entries from this user:\n' + 
        limitedEntries.map((entry: any, idx: number) => {
          const date = entry.created_at ? new Date(entry.created_at).toLocaleDateString() : 'Unknown date';
          const transcript = sanitizeString(entry.transcript || '', 500); // Limit transcript length
          return `${idx + 1}. ${date}: "${transcript}"`;
        }).join('\n');
    }

    // Build messages array with conversation history
    const messages = [
      ...limitedHistory,
      {
        role: 'user',
        content: sanitizedMessage,
      },
    ];

    // Call Claude API with Pulse personality
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

    // Extract the text content from Claude's response
    const assistantMessage = response.content[0]?.type === 'text' 
      ? sanitizeString(response.content[0].text) 
      : '';

    return NextResponse.json(
      {
        message: assistantMessage,
        usage: response.usage,
      },
      {
        headers: getRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime),
      }
    );
  } catch (error) {
    console.error('Error calling Claude API:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
