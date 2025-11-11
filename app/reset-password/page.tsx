'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [validSession, setValidSession] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if we have a valid recovery session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setValidSession(true)
      }
    })
  }, [])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) throw error

      setSuccess(true)
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/onboarding')
      }, 2000)
    } catch (error: any) {
      setError(error.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  if (!validSession) {
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
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: '600',
            color: '#1a3a2e',
            marginBottom: '12px'
          }}>
            Invalid Link
          </h1>
          
          <p style={{
            fontSize: '14px',
            color: '#718096',
            marginBottom: '32px'
          }}>
            This password reset link is invalid or has expired. Please request a new one.
          </p>

          <Link
            href="/forgot-password"
            style={{
              display: 'inline-block',
              background: '#8B2F2F',
              color: '#ffffff',
              padding: '13px 24px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s ease-in-out'
            }}
          >
            Request New Link
          </Link>
        </div>
      </div>
    )
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
              Set New Password
            </h1>
            
            <p style={{
              fontSize: '14px',
              color: '#718096',
              marginBottom: '32px'
            }}>
              Enter your new password below.
            </p>

            <form onSubmit={handleResetPassword} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                {loading ? 'Resetting...' : 'Reset Password'}
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
              textAlign: 'center'
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
                <circle cx="12" cy="12" r="10" stroke="#48BB78" strokeWidth="2"/>
                <path
                  d="M9 12L11 14L15 10"
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
                Password Reset!
              </h1>
              
              <p style={{
                fontSize: '14px',
                color: '#718096',
                lineHeight: '1.6'
              }}>
                Your password has been successfully reset. Redirecting to login...
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
