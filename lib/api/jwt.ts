import jwt from 'jsonwebtoken';

/**
 * Generate JWT token for AI service authentication
 * This token should be included in requests to the AI service
 */
export function generateAIServiceToken(userId: string): string {
  const secret = process.env.JWT_SECRET || process.env.NEXT_PUBLIC_JWT_SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET not configured. Set it in environment variables.');
  }

  return jwt.sign(
    { userId },
    secret,
    { expiresIn: '1h' } // Token expires in 1 hour
  );
}

/**
 * Get JWT token for current user
 * Should be called from client-side components
 */
export async function getAIServiceToken(): Promise<string | null> {
  try {
    // Get user from Supabase session
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user?.id) {
      return null;
    }

    // Call API route to generate token (server-side)
    const response = await fetch('/api/auth/ai-token', {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      return null;
    }

    const { token } = await response.json();
    return token;
  } catch (error) {
    console.error('Failed to get AI service token:', error);
    return null;
  }
}

