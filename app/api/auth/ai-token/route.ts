import { NextRequest, NextResponse } from 'next/server';
import { validateUserId } from '@/lib/auth';
import { generateAIServiceToken } from '@/lib/api/jwt';

/**
 * API route to generate JWT token for AI service
 * This is called from client-side to get a token for AI service requests
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await validateUserId(request, null);
    
    if (!auth) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = generateAIServiceToken(auth.userId);

    return NextResponse.json({ token });
  } catch (error: unknown) {
    console.error('Error generating AI service token:', error);
    return NextResponse.json(
      { error: 'Failed to generate token' },
      { status: 500 }
    );
  }
}

