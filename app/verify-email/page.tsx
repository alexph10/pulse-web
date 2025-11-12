'use client'

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    // Get email from URL params (passed from signup page)
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'signup'
      });

      if (verifyError) {
        setError(verifyError.message);
        setLoading(false);
        return;
      }

      // Success - redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid verification code');
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setResendSuccess(false);
    setResendLoading(true);

    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });

      if (resendError) {
        setError(resendError.message);
        setResendLoading(false);
        return;
      }

      setResendSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to resend code');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#1a3a2e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
      {/* Verification Card */}
      <div style={{
        width: '500px',
        background: 'white',
        borderRadius: '32px',
        padding: '56px 64px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Title */}
        <h1 style={{
          fontSize: '36px',
          fontWeight: '600',
          color: '#2D3748',
          marginBottom: '6px',
          letterSpacing: '-0.02em',
          textAlign: 'center'
        }}>
          Check your email
        </h1>
        <p style={{
          fontSize: '15px',
          color: '#A0AEC0',
          marginBottom: '32px',
          textAlign: 'center'
        }}>
          We sent a verification code to <strong>{email}</strong>
        </p>

        <form onSubmit={handleSubmit} style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {error && (
            <div style={{
              background: '#FED7D7',
              border: '1px solid #FC8181',
              borderRadius: '10px',
              padding: '12px',
              color: '#E53E3E',
              fontSize: '13px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          {resendSuccess && (
            <div style={{
              background: '#C6F6D5',
              border: '1px solid #68D391',
              borderRadius: '10px',
              padding: '12px',
              color: '#2F855A',
              fontSize: '13px',
              textAlign: 'center'
            }}>
              Code resent successfully!
            </div>
          )}

          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#2D3748',
              marginBottom: '8px'
            }}>
              Verification code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              required
              autoFocus
              style={{
                width: '100%',
                background: '#F7FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                padding: '13px 16px',
                color: '#2D3748',
                fontSize: '18px',
                letterSpacing: '0.5em',
                textAlign: 'center',
                outline: 'none',
                transition: 'all 0.3s ease-in-out',
                boxSizing: 'border-box'
              }}
            />
            <p style={{
              fontSize: '12px',
              color: '#A0AEC0',
              marginTop: '6px',
              textAlign: 'center'
            }}>
              Enter the 6-digit code from your email
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || code.length !== 6}
            style={{
              width: '100%',
              background: (loading || code.length !== 6) ? '#A0AEC0' : '#8B2F2F',
              border: 'none',
              borderRadius: '10px',
              padding: '13px',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: (loading || code.length !== 6) ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease-in-out',
              boxSizing: 'border-box'
            }}
          >
            {loading ? 'Verifying...' : 'Verify email'}
          </button>

          <div style={{
            textAlign: 'center',
            marginTop: '12px'
          }}>
            <p style={{
              fontSize: '13px',
              color: '#A0AEC0',
              marginBottom: '8px'
            }}>
              Didn't receive the code?
            </p>
            <button
              type="button"
              onClick={handleResend}
              disabled={resendLoading}
              style={{
                background: 'none',
                border: 'none',
                color: '#8B2F2F',
                fontSize: '14px',
                fontWeight: '600',
                cursor: resendLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease-in-out',
                textDecoration: 'underline'
              }}
            >
              {resendLoading ? 'Sending...' : 'Resend code'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
