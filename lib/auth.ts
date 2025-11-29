import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

function getSupabaseCredentials() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase credentials are missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
    throw new Error('Supabase is not configured');
  }

  return { supabaseUrl, supabaseAnonKey };
}

/**
 * Get authenticated user from request
 * Returns user ID if authenticated, null otherwise
 */
export async function getAuthenticatedUser(request: NextRequest): Promise<{ userId: string; user: { id: string; email?: string } } | null> {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseCredentials();

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set() {
          // In API routes, we can't set cookies directly
          // This is handled by the client
        },
        remove() {
          // In API routes, we can't remove cookies directly
          // This is handled by the client
        },
      },
    }
  );

  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session || !session.user) {
    return null;
  }

  return {
    userId: session.user.id,
    user: session.user,
  };
}

/**
 * Validate that userId from request matches authenticated user
 */
export async function validateUserId(request: NextRequest, providedUserId: string | null | undefined): Promise<{ userId: string; user: { id: string; email?: string } } | null> {
  const auth = await getAuthenticatedUser(request);
  
  if (!auth) {
    return null;
  }

  // If userId is provided, it must match the authenticated user
  if (providedUserId && providedUserId !== auth.userId) {
    return null;
  }

  return auth;
}

/**
 * Create an authenticated Supabase client for API routes
 */
export async function createAuthenticatedSupabaseClient(request: NextRequest) {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseCredentials();

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set() {
          // In API routes, we can't set cookies directly
          // This is handled by the client
        },
        remove() {
          // In API routes, we can't remove cookies directly
          // This is handled by the client
        },
      },
    }
  );
}

/**
 * Helper to return 401 Unauthorized response
 */
export function unauthorizedResponse(message: string = 'Unauthorized') {
  return NextResponse.json(
    { error: message },
    { status: 401 }
  );
}

/**
 * Helper to return 403 Forbidden response
 */
export function forbiddenResponse(message: string = 'Forbidden') {
  return NextResponse.json(
    { error: message },
    { status: 403 }
  );
}

