import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * MIDDLEWARE - Your App's Security Guard
 * 
 * What does this do?
 * - Runs BEFORE every page loads
 * - Checks if user is authenticated
 * - Protects API routes from unauthorized access
 * - Automatically handles auth redirects
 * 
 * Why do we need this?
 * Without it: We'd need auth checks on every single protected page and API route
 * With it: One file protects entire sections and API routes
 * 
 * How it works:
 * 1. User tries to visit protected routes
 * 2. Middleware checks authentication
 * 3. If logged in → Allow access
 * 4. If not logged in → Redirect to /login (for pages) or return 401 (for API)
 */

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  // Create Supabase client for middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // Do not mutate the incoming request's cookies. Set cookie on the response instead.
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          // Remove by setting an empty value (middleware context) on the response
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Get current user session
  const { data: { session } } = await supabase.auth.getSession()
  
  // Get the pathname (e.g., /app/journal)
  const { pathname } = req.nextUrl
  
  // ═══════════════════════════════════════════════════════════════════════════
  // RULE 1: Allow OAuth callback route (needs to run before session check)
  // ═══════════════════════════════════════════════════════════════════════════
  if (pathname === '/auth/callback') {
    // OAuth callback route - allow it to process the callback
    // Don't check session here as it's being set by the callback handler
    return response
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RULE 2: Protect API routes (except public ones)
  // ═══════════════════════════════════════════════════════════════════════════
  if (pathname.startsWith('/api/')) {
    // Public API routes that don't require authentication
    const publicRoutes = [
      '/api/health', // Add health check endpoint if needed
    ]
    
    const isPublicRoute = publicRoutes.some(route => pathname === route)
    
    if (!isPublicRoute && !session) {
      // Not logged in -> Return 401 for API routes
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Logged in or public route -> Allow access
    return response
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // RULE 3: Redirect logged-in users away from auth pages
  // ═══════════════════════════════════════════════════════════════════════════
  if (session && (pathname === '/login' || pathname === '/signup' || pathname === '/onboarding')) {
    // Already logged in but trying to access login/signup
    // → Redirect to home
    return NextResponse.redirect(new URL('/', req.url))
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RULE 4: Allow public routes
  // ═══════════════════════════════════════════════════════════════════════════
  // Routes like /, /about, /pricing are public
  return response
}

/**
 * MATCHER CONFIGURATION
 * 
 * Tells Next.js which routes to run middleware on
 * 
 * Why match specific paths?
 * - Performance: Don't run middleware on static files
 * - Efficiency: Skip _next, images, fonts, etc.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public files (images, fonts)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|otf)$).*)',
  ],
}

