import { Router, Response } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { authenticateJWT, AuthRequest } from '../middleware/auth.js';
import { rateLimitMiddleware, RATE_LIMITS } from '../middleware/rateLimit.js';
import { sanitizeString, VALIDATION_LIMITS } from '../middleware/validation.js';
import { supabase } from '../lib/supabase.js';

const router = Router();
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

router.post('/', authenticateJWT, rateLimitMiddleware(RATE_LIMITS.AI_ENDPOINTS), async (req: AuthRequest, res: Response) => {
  try {
    const { days = 30, userId } = req.body;

    if (!userId || userId !== req.userId) {
      return res.status(403).json({ error: 'User ID mismatch' });
    }

    const daysNum = typeof days === 'number' ? Math.min(Math.max(1, days), VALIDATION_LIMITS.MAX_DAYS_RANGE) : 30;

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - daysNum);

    const { data: entries, error: fetchError } = await supabase
      .from('journal_entries')
      .select('transcript, created_at')
      .eq('user_id', userId)
      .gte('created_at', daysAgo.toISOString())
      .order('created_at', { ascending: true });

    if (fetchError) {
      console.error('Database error:', fetchError);
      return res.status(500).json({ error: 'Failed to fetch journal entries' });
    }

    if (!entries || entries.length === 0 || entries.length < 3) {
      return res.status(400).json({
        error: 'Not enough entries',
        message: 'You need at least 3 journal entries to generate insights.',
      });
    }

    const entriesText = entries.map((entry, idx) => {
      const date = entry.created_at ? new Date(entry.created_at).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      }) : 'Unknown date';
      const transcript = sanitizeString(entry.transcript || '', 2000);
      return `Entry ${idx + 1} (${date}):\n${transcript}`;
    }).join('\n\n---\n\n');

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

    const analysisText = response.content[0]?.type === 'text' 
      ? response.content[0].text 
      : '';

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
      console.error('Response text:', analysisText.substring(0, 500));
      return res.status(500).json({ error: 'Failed to parse analysis results. Please try again.' });
    }

    res.json({
      analysis,
      entryCount: entries.length,
      dateRange: {
        from: entries[0]?.created_at || null,
        to: entries[entries.length - 1]?.created_at || null,
      },
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error analyzing patterns:', error);
    res.status(500).json({ error: 'Failed to analyze patterns' });
  }
});

export { router as analyzePatternsRouter };

