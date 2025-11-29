'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import styles from './login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  // Handle OAuth callback with tokens in URL hash (fallback)
  useEffect(() => {
    const handleOAuthCallback = async () => {
      // Check if we have OAuth tokens in the URL hash
      if (window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (accessToken || refreshToken) {
          // Supabase client should automatically process these tokens
          // Wait a moment for it to process
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Check if we have a session now
          const { data: { session } } = await supabase.auth.getSession();

          if (session) {
            // Success! Clear the hash and redirect to dashboard
            window.history.replaceState(null, '', '/dashboard');
            router.push('/dashboard');
          }
        }
      }
    };

    handleOAuthCallback();
  }, [router]);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        // Validate password length
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }

        await signUp(formData.email, formData.password);
        // After signup, redirect to verify email page or dashboard
        router.push('/verify-email?email=' + encodeURIComponent(formData.email));
      } else {
        await signIn(formData.email, formData.password);
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      const error = err as Error
      setError(error.message || (mode === 'signup' ? 'Failed to sign up' : 'Failed to log in'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      await signInWithGoogle();
      // Redirect happens automatically via Supabase
    } catch (err: unknown) {
      const error = err as Error
      setError(error.message || 'Failed to sign in with Google');
    }
  };



  return (
    <div className={styles.container}>
      {/* Left Side - Form */}
      <div className={styles.leftSide}>
        <div className={styles.formContainer}>
          {/* Tab Toggle */}
          <div className={styles.tabContainer}>
            <button
              type="button"
              className={`${styles.tab} ${mode === 'login' ? styles.tabActive : ''}`}
              onClick={() => {
                setMode('login');
                setError('');
                setFormData({ email: '', password: '', confirmPassword: '' });
              }}
            >
              Log In
            </button>
            <button
              type="button"
              className={`${styles.tab} ${mode === 'signup' ? styles.tabActive : ''}`}
              onClick={() => {
                setMode('signup');
                setError('');
                setFormData({ email: '', password: '', confirmPassword: '' });
              }}
            >
              Sign Up
            </button>
            <div className={`${styles.tabIndicator} ${mode === 'signup' ? styles.tabIndicatorRight : ''}`} />
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}
            
            {/* Email */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>Email address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={styles.input}
                placeholder="your@email.com"
                required
              />
            </div>

            {/* Password */}
            <div className={styles.inputGroup}>
              <div className={styles.labelRow}>
                <label className={styles.label}>Password</label>
                {mode === 'login' && (
                  <a href="/forgot-password" className={styles.forgotLink}>
                    Forgot password?
                  </a>
                )}
              </div>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={styles.input}
                placeholder={mode === 'signup' ? 'At least 6 characters' : ''}
                required
              />
            </div>

            {/* Confirm Password (only for signup) */}
            {mode === 'signup' && (
              <div className={styles.inputGroup}>
                <label className={styles.label}>Confirm Password</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={styles.input}
                  placeholder="Re-enter your password"
                  required
                />
              </div>
            )}

            {/* Submit Button */}
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading 
                ? (mode === 'signup' ? 'Signing up...' : 'Logging in...') 
                : (mode === 'signup' ? 'Sign up' : 'Log in')
              }
            </button>

            {/* Divider */}
            <div className={styles.divider}>
              <span>or</span>
            </div>

            {/* Social Sign In Buttons */}
            <div className={styles.socialButtons}>
              <button type="button" className={styles.googleButton} onClick={handleGoogleSignIn}>
                <svg className={styles.googleIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Testimonial/Image */}
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

          <div className={styles.stats}>
            <div className={styles.stat}>
              <h3 className={styles.statNumber}>6 weeks</h3>
              <p className={styles.statLabel}>from discovery to onboarding</p>
            </div>
            <div className={styles.stat}>
              <h3 className={styles.statNumber}>5 hours</h3>
              <p className={styles.statLabel}>saved per week</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
