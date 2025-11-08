'use client'

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import styles from './verify-email.module.css';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyOtp, resendOtp } = useAuth();
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
      await verifyOtp(email, code);
      router.push('/dashboard/notes');
    } catch (err: any) {
      setError(err.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setResendSuccess(false);
    setResendLoading(true);

    try {
      await resendOtp(email);
      setResendSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to resend code');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        <div className={styles.formContainer}>
          <div className={styles.header}>
            <h1 className={styles.title}>Check your email</h1>
            <p className={styles.subtitle}>
              We sent a verification code to <strong>{email}</strong>
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}
            {resendSuccess && <div className={styles.success}>Code resent successfully!</div>}

            <div className={styles.inputGroup}>
              <label className={styles.label}>Verification code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className={styles.input}
                placeholder="000000"
                maxLength={6}
                required
                autoFocus
              />
              <p className={styles.hint}>Enter the 6-digit code from your email</p>
            </div>

            <button type="submit" className={styles.submitButton} disabled={loading || code.length !== 6}>
              {loading ? 'Verifying...' : 'Verify email'}
            </button>

            <div className={styles.resendContainer}>
              <p className={styles.resendText}>Didn&apos;t receive the code?</p>
              <button 
                type="button" 
                onClick={handleResend} 
                className={styles.resendButton}
                disabled={resendLoading}
              >
                {resendLoading ? 'Sending...' : 'Resend code'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className={styles.rightSide}>
        <div className={styles.testimonialContainer}>
          <div className={styles.imagePlaceholder}>
            <span className={styles.logoMark}>Pulse.</span>
          </div>
          
          <div className={styles.testimonial}>
            <p className={styles.quote}>
              &ldquo;It&apos;s really important that we have a platform like Pulse that encourages us to keep evolving, it&apos;s good for the team and it&apos;s good for the business.&rdquo;
            </p>
            <p className={styles.author}>Mental Wellness User</p>
          </div>
        </div>
      </div>
    </div>
  );
}
