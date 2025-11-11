import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * MIDDLEWARE - Your App's Security Guard
 * 
 * What does this do?
 * - Runs BEFORE every page loads
 * - Checks if user is authenticated
 * - Protects dashboard routes from unauthorized access
 * - Automatically redirects to login if not authenticated
 * 
 * Why do we need this?
 * Without it: We'd need auth checks on every single dashboard page
 * With it: One file protects entire dashboard section
 * 
 * How it works:
 * 1. User tries to visit /dashboard/*
 * 2. Middleware checks authentication
 * 3. If logged in → Allow access
 * 4. If not logged in → Redirect to /login
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
          req.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
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
  
  // Get the pathname (e.g., /dashboard/journal)
  const { pathname } = req.nextUrl
  
  // ═══════════════════════════════════════════════════════════════════════════
  // RULE 1: Protect all /dashboard routes
  // ═══════════════════════════════════════════════════════════════════════════
  if (pathname.startsWith('/dashboard')) {
    if (!session) {
      // Not logged in -> Redirect to login
      const loginUrl = new URL('/login', req.url)
      // Add 'redirect' parameter so we can send them back after login
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    // Logged in -> Allow access
    return response
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // RULE 2: Redirect logged-in users away from auth pages
  // ═══════════════════════════════════════════════════════════════════════════
  if (session && (pathname === '/login' || pathname === '/signup')) {
    // Already logged in but trying to access login/signup
    // → Redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // RULE 3: Allow public routes
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
