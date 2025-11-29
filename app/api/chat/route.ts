import { NextRequest, NextResponse } from 'next/server';
import { validateUserId } from '@/lib/auth';
import { generateAIServiceToken } from '@/lib/api/jwt';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequestBody {
  messages: ChatMessage[];
  mode?: 'general' | 'journal_insights';
}

const AI_SERVICE_URL_ENV = 'PULSE_AI_SERVICE_URL';

export async function POST(request: NextRequest) {
  try {
    const auth = await validateUserId(request, null);

    if (!auth) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const aiServiceUrl = process.env[AI_SERVICE_URL_ENV];
    if (!aiServiceUrl) {
      console.error(`${AI_SERVICE_URL_ENV} is not configured`);
      return NextResponse.json(
        { error: 'AI service is temporarily unavailable' },
        { status: 503 }
      );
    }

    const body = (await request.json()) as ChatRequestBody;

    if (!body?.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json(
        { error: 'messages array is required' },
        { status: 400 }
      );
    }

    const token = generateAIServiceToken(auth.userId);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    let aiResponse: Response;
    try {
      aiResponse = await fetch(`${aiServiceUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: auth.userId,
          messages: body.messages,
          mode: body.mode ?? 'general',
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text().catch(() => '');
      console.error('AI service error:', aiResponse.status, errorText);

      return NextResponse.json(
        { error: 'Failed to get response from AI assistant' },
        { status: 502 }
      );
    }

    const json = await aiResponse.json().catch(() => null);

    if (!json || typeof json.reply !== 'string') {
      console.error('Unexpected AI service response shape:', json);
      return NextResponse.json(
        { error: 'AI assistant returned an invalid response' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      reply: json.reply as string,
      requestId: json.requestId ?? null,
    });
  } catch (error: unknown) {
    if ((error as Error)?.name === 'AbortError') {
      console.error('AI service request timed out');
      return NextResponse.json(
        { error: 'The assistant is taking too long to respond. Please try again.' },
        { status: 504 }
      );
    }

    console.error('Chat route error:', error);
    return NextResponse.json(
      { error: 'Unexpected error while contacting AI assistant' },
      { status: 500 }
    );
  }
}






