import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { validateUserId, createAuthenticatedSupabaseClient, unauthorizedResponse } from '@/lib/auth';
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
    const { days = 30 } = body;

    // Validate days parameter
    const daysNum = typeof days === 'number' ? Math.min(Math.max(1, days), VALIDATION_LIMITS.MAX_DAYS_RANGE) : 30;

    // Fetch journal entries from last X days
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - daysNum);

    // Create authenticated Supabase client
    const supabase = await createAuthenticatedSupabaseClient(req);

    const { data: entries, error: fetchError } = await supabase
      .from('journal_entries')
      .select('transcript, created_at')
      .eq('user_id', auth.userId)
      .gte('created_at', daysAgo.toISOString())
      .order('created_at', { ascending: true });

    if (fetchError) {
      console.error('Database error:', fetchError);
      throw fetchError;
    }

    if (!entries || entries.length === 0) {
      return NextResponse.json({
        error: 'Not enough entries',
        message: 'You need at least 3 journal entries to generate insights.',
      }, { status: 400 });
    }

    if (entries.length < 3) {
      return NextResponse.json({
        error: 'Not enough entries',
        message: 'You need at least 3 journal entries to generate insights.',
      }, { status: 400 });
    }

    // Format entries for Claude (sanitize transcripts)
    const entriesText = entries.map((entry, idx) => {
      const date = entry.created_at ? new Date(entry.created_at).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      }) : 'Unknown date';
      const transcript = sanitizeString(entry.transcript || '', 2000); // Limit transcript length
      return `Entry ${idx + 1} (${date}):\n${transcript}`;
    }).join('\n\n---\n\n');

    // Call Claude for pattern analysis
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: `You are analyzing journal entries for mental wellness patterns. Review these ${entries.length} entries from the past ${days} days and identify meaningful patterns.

${entriesText}

Analyze and return ONLY a valid JSON object (no markdown, no explanation) with this exact structure:

{
  "themes": [
    {
      "name": "string (e.g., 'Work stress', 'Relationships')",
      "frequency": number (0-1, percentage of entries mentioning this),
      "description": "string (brief insight)",
      "examples": ["string (quote from entry)"]
    }
  ],
  "moodPatterns": [
    {
      "pattern": "string (e.g., 'More positive on weekends')",
      "confidence": number (0-1),
      "description": "string (brief explanation)"
    }
  ],
  "triggers": [
    {
      "trigger": "string (e.g., 'Meetings', 'Poor sleep')",
      "impact": "string (e.g., 'Increased anxiety')",
      "frequency": number (0-1)
    }
  ],
  "growth": [
    {
      "area": "string (e.g., 'Self-compassion', 'Emotional awareness')",
      "evidence": "string (what changed)",
      "trajectory": "string ('improving', 'steady', 'declining')"
    }
  ],
  "timePatterns": {
    "morning": "string (common themes in morning entries)",
    "afternoon": "string (common themes in afternoon entries)",
    "evening": "string (common themes in evening entries)"
  },
  "summary": "string (2-3 sentence overview of key insights)"
}

Requirements:
- Identify top 3-5 themes max
- Only include patterns with strong evidence
- Be specific and actionable
- Use non-clinical, empathetic language
- Focus on what's helpful for self-reflection`
      }],
    });

    // Parse Claude's response
    const analysisText = response.content[0]?.type === 'text' 
      ? response.content[0].text 
      : '';

    // Extract JSON from response (in case Claude adds explanation)
    let analysis;
    try {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else if (analysisText.trim()) {
        analysis = JSON.parse(analysisText);
      } else {
        throw new Error('Empty response from AI');
      }
    } catch (parseError) {
      console.error('Failed to parse Claude response:', parseError);
      console.error('Response text:', analysisText.substring(0, 500)); // Log first 500 chars
      return NextResponse.json(
        { error: 'Failed to parse analysis results. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        analysis,
        entryCount: entries.length,
        dateRange: {
          from: entries[0]?.created_at || null,
          to: entries[entries.length - 1]?.created_at || null,
        },
        generatedAt: new Date().toISOString(),
      },
      {
        headers: getRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime),
      }
    );

  } catch (error: any) {
    console.error('Error analyzing patterns:', error);
    return NextResponse.json(
      { error: 'Failed to analyze patterns' },
      { status: 500 }
    );
  }
}
