'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      setSuccess(true)
    } catch (error: any) {
      setError(error.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1a3a2e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        padding: '48px',
        width: '100%',
        maxWidth: '500px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        {!success ? (
          <>
            <h1 style={{
              fontSize: '36px',
              fontWeight: '600',
              color: '#1a3a2e',
              marginBottom: '12px'
            }}>
              Reset Password
            </h1>
            
            <p style={{
              fontSize: '14px',
              color: '#718096',
              marginBottom: '32px'
            }}>
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleResetPassword} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  background: '#F7FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '10px',
                  padding: '13px 16px',
                  color: '#2D3748',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.3s ease-in-out',
                  boxSizing: 'border-box'
                }}
              />

              {error && (
                <p style={{
                  color: '#E53E3E',
                  fontSize: '13px',
                  margin: '-8px 0 0 0'
                }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  background: loading ? '#A0AEC0' : '#8B2F2F',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '13px',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  boxSizing: 'border-box'
                }}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <div style={{
              marginTop: '24px',
              textAlign: 'center'
            }}>
              <Link
                href="/onboarding"
                style={{
                  color: '#8B2F2F',
                  fontSize: '13px',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease-in-out'
                }}
              >
                Back to Login
              </Link>
            </div>
          </>
        ) : (
          <>
            <div style={{
              textAlign: 'center',
              marginBottom: '32px'
            }}>
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  margin: '0 auto 24px'
                }}
              >
                <path
                  d="M9 11L12 14L22 4"
                  stroke="#48BB78"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16"
                  stroke="#48BB78"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <h1 style={{
                fontSize: '36px',
                fontWeight: '600',
                color: '#1a3a2e',
                marginBottom: '12px'
              }}>
                Check Your Email
              </h1>
              
              <p style={{
                fontSize: '14px',
                color: '#718096',
                lineHeight: '1.6'
              }}>
                We've sent a password reset link to <strong>{email}</strong>. 
                Click the link in the email to reset your password.
              </p>
            </div>

            <div style={{
              marginTop: '32px',
              textAlign: 'center'
            }}>
              <Link
                href="/onboarding"
                style={{
                  color: '#8B2F2F',
                  fontSize: '13px',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease-in-out'
                }}
              >
                Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
