'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

/**
 * OAuth Callback Content Component
 * Uses useSearchParams which requires Suspense boundary
 */
function AuthCallbackContent() {
  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  const next = searchParams.get('next') || '/dashboard'
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')
  const hasRedirected = useRef(false)

  useEffect(() => {
    const handleCallback = async () => {
      // Prevent multiple redirects
      if (hasRedirected.current) return
      
      try {
        // Check if we have a code parameter (server-side flow fallback)
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code)
          
          if (error) {
            console.error('Error exchanging code:', error)
            setStatus('error')
            hasRedirected.current = true
            setTimeout(() => {
              window.location.href = '/login?error=oauth_error'
            }, 1500)
            return
          }

          if (data.session) {
            setStatus('success')
            hasRedirected.current = true
            // Clear hash and redirect
            window.history.replaceState(null, '', next)
            setTimeout(() => {
              window.location.href = next
            }, 500)
            return
          }
        }

        // Supabase client automatically processes tokens in URL hash
        // Wait a moment for it to process, then check for session
        await new Promise(resolve => setTimeout(resolve, 1500))

        // Check if we have a session (Supabase should have processed hash tokens)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Error getting session:', sessionError)
          setStatus('error')
          hasRedirected.current = true
          setTimeout(() => {
            window.location.href = '/login?error=oauth_error'
          }, 1500)
          return
        }

        if (session) {
          setStatus('success')
          hasRedirected.current = true
          // Clear hash and redirect using window.location for hard redirect
          window.history.replaceState(null, '', next)
          setTimeout(() => {
            window.location.href = next
          }, 500)
        } else {
          // No session found after processing, redirect to login
          setStatus('error')
          hasRedirected.current = true
          setTimeout(() => {
            window.location.href = '/login?error=oauth_error'
          }, 1500)
        }
      } catch (error) {
        console.error('OAuth callback error:', error)
        setStatus('error')
        hasRedirected.current = true
        setTimeout(() => {
          window.location.href = '/login?error=oauth_error'
        }, 1500)
      }
    }

    handleCallback()
  }, [code, next])

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'Satoshi, sans-serif',
      backgroundColor: '#ffffff'
    }}>
      <div style={{ textAlign: 'center' }}>
        {status === 'processing' && (
          <>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid #f3f3f3',
              borderTop: '3px solid #8B4513',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }} />
            <p style={{ color: '#666', fontSize: '0.875rem' }}>Completing sign in...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <span style={{ color: 'white', fontSize: '24px' }}>✓</span>
            </div>
            <p style={{ color: '#666', fontSize: '0.875rem' }}>Sign in successful! Redirecting...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <span style={{ color: 'white', fontSize: '24px' }}>✕</span>
            </div>
            <p style={{ color: '#666', fontSize: '0.875rem' }}>Sign in failed. Redirecting to login...</p>
          </>
        )}
      </div>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

/**
 * OAuth Callback Page (Client Component)
 * 
 * This handles OAuth callbacks that come with tokens in the URL hash.
 * Supabase redirects with tokens in the hash fragment, and the Supabase
 * client automatically processes them when getSession() is called.
 */
export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontFamily: 'Satoshi, sans-serif',
        backgroundColor: '#ffffff'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #8B4513',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{ color: '#666', fontSize: '0.875rem' }}>Loading...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}

