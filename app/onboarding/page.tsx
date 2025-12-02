'use client'

import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls } from '@react-three/drei'
import { EffectComposer, Pixelation } from '@react-three/postprocessing'
import { Suspense, useState, FormEvent, useRef, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import * as THREE from 'three'

function PointCloud() {
  const { scene } = useGLTF('/recovering_oak_-_point_cloud_version.glb')
  
  // Increase saturation of materials
  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh
      const material = mesh.material as THREE.MeshStandardMaterial
      
      if (material.color) {
        const hsl = { h: 0, s: 0, l: 0 }
        material.color.getHSL(hsl)
        // Boost saturation by 50%
        hsl.s = Math.min(hsl.s * 1.5, 1)
        material.color.setHSL(hsl.h, hsl.s, hsl.l)
      }
      
      // Increase emissive for more vibrant look
      if (material.emissive) {
        material.emissiveIntensity = 0.3
      }
    }
  })
  
  return (
    <primitive 
      object={scene} 
      scale={2}
      position={[2, 0, 0]}
    />
  )
}

export default function OnboardingPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('signup')
  const [step, setStep] = useState<'initial' | 'details'>('initial')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkingEmail, setCheckingEmail] = useState(false)
  const [emailAvailable, setEmailAvailable] = useState(false)

  // Email validation regex
  const isValidEmailFormat = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Check email availability in real-time
  const checkEmailAvailability = async (emailValue: string) => {
    if (!isValidEmailFormat(emailValue)) {
      setEmailAvailable(false)
      return
    }

    setCheckingEmail(true)
    setError('')

    try {
      // Check if email exists in profiles
      const { data: profileData } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', emailValue)
        .single()

      if (profileData) {
        setEmailAvailable(false)
        return
      }

      // Check if email exists in auth users
      // Note: We can't directly query auth.users, so we'll rely on the sign-up attempt
      // For now, if not in profiles, assume available
      setEmailAvailable(true)
    } catch {
      // If no profile found, email is available
      setEmailAvailable(true)
    } finally {
      setCheckingEmail(false)
    }
  }

  // Handle email input change with debouncing
  const emailCheckTimeout = useRef<number | null>(null)

  useEffect(() => {
    // cleanup on unmount
    return () => {
      if (emailCheckTimeout.current) {
        clearTimeout(emailCheckTimeout.current)
      }
    }
  }, [])

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value
    setEmail(emailValue)
    setError('')
    setEmailAvailable(false)

    // Clear any pending timeout
    if (emailCheckTimeout.current) {
      clearTimeout(emailCheckTimeout.current)
    }

    // Check email availability after user stops typing
    if (emailValue.trim()) {
      emailCheckTimeout.current = window.setTimeout(() => {
        checkEmailAvailability(emailValue)
      }, 500)
    }
  }

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validate email format
    if (!isValidEmailFormat(email)) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    try {
      // Double-check email availability before proceeding
      const { data } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .single()

      if (data) {
        setError('Email is already in use')
        setEmailAvailable(false)
        setLoading(false)
        return
      }

      // If email doesn't exist, proceed to next step
      setStep('details')
    } catch {
      // If no profile found, that's good - proceed to next step
      setStep('details')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setError('')
    setLoading(true)

    try {
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })

      if (signInError) {
        setError(signInError.message)
        setLoading(false)
      }
    } catch {
      setError('Failed to connect to Google. Please try again.')
      setLoading(false)
    }
  }

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (signInError) {
        setError(signInError.message)
        setLoading(false)
        return
      }

      window.location.href = '/'
    } catch {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      })

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setError('Email is already in use')
        } else {
          setError(signUpError.message)
        }
        setLoading(false)
        return
      }

      // Check if email confirmation is required
      if (data?.user && !data.user.email_confirmed_at) {
        // Redirect to verification page with email
        // Note: Email will only be sent if email confirmation is enabled in Supabase
        window.location.href = `/verify-email?email=${encodeURIComponent(email)}`
      } else {
        // If no confirmation needed (or already confirmed), go to home
        window.location.href = '/'
      }
    } catch {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#1a3a2e',
      position: 'relative'
    }}>
      <style jsx>{`
        @keyframes spin {
          to {
            transform: translateY(-50%) rotate(360deg);
          }
        }
      `}</style>
      
      {/* 3D Canvas Background */}
      <Canvas
        camera={{ position: [0, 0, 2], fov: 50 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#1a3a2e']} />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#ff69b4" />
        
        {/* Point Cloud Model */}
        <Suspense fallback={null}>
          <PointCloud />
        </Suspense>
        
        {/* Horizontal Orbit Controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={true}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
          rotateSpeed={0.5}
        />
        
        {/* Pixelation Effect */}
        <EffectComposer>
          <Pixelation granularity={5} />
        </EffectComposer>
      </Canvas>

      {/* Overlay Card - Sign Up / Login */}
      <div style={{
        position: 'absolute',
        left: '80px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '720px',
        background: 'white',
        borderRadius: '32px',
        padding: '56px 64px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        zIndex: 10
      }}>
        {/* Title */}
        <h1 style={{
          fontSize: '36px',
          fontWeight: '600',
          color: '#2D3748',
          marginBottom: '6px',
          letterSpacing: '-0.02em',
          textAlign: 'center',
          transition: 'all 0.3s ease-in-out'
        }}>
          {mode === 'signup' ? 'Join Pulse' : 'Welcome to Pulse'}
        </h1>
        <p style={{
          fontSize: '15px',
          color: '#A0AEC0',
          marginBottom: '28px',
          textAlign: 'center',
          transition: 'all 0.3s ease-in-out'
        }}>
          {mode === 'signup' ? 'Create an account' : 'Enter your account or create a new one'}
        </p>

        {/* Toggle Bar - Only show on initial step */}
        {step === 'initial' && (
          <div style={{
            display: 'flex',
            gap: '24px',
            justifyContent: 'center',
            marginBottom: '28px',
            borderBottom: '2px solid #E2E8F0',
            paddingBottom: '12px',
            position: 'relative'
          }}>
            <button
              onClick={() => {
                setMode('login')
                setError('')
                setEmail('')
                setPassword('')
              }}
              style={{
                background: 'none',
                border: 'none',
                color: mode === 'login' ? '#8B2F2F' : '#A0AEC0',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                padding: '0',
                transition: 'color 0.3s ease-in-out',
                paddingBottom: '12px',
                position: 'relative'
              }}
            >
              Log In
              {mode === 'login' && (
                <div style={{
                  position: 'absolute',
                  bottom: '-14px',
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: '#8B2F2F',
                  transition: 'all 0.3s ease-in-out'
                }} />
              )}
            </button>
            <button
              onClick={() => {
                setMode('signup')
                setError('')
                setEmail('')
                setPassword('')
                setEmailAvailable(false)
              }}
              style={{
                background: 'none',
                border: 'none',
                color: mode === 'signup' ? '#8B2F2F' : '#A0AEC0',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                padding: '0',
                transition: 'color 0.3s ease-in-out',
                paddingBottom: '12px',
                position: 'relative'
              }}
            >
              Sign Up
              {mode === 'signup' && (
                <div style={{
                  position: 'absolute',
                  bottom: '-14px',
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: '#8B2F2F',
                  transition: 'all 0.3s ease-in-out'
                }} />
              )}
            </button>
          </div>
        )}

        {step === 'initial' ? (
          <>
            {/* Sign in with Google Button */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={loading}
              style={{
                width: '100%',
                background: 'white',
                border: '1px solid #E2E8F0',
                borderRadius: '14px',
                padding: '14px',
                color: '#2D3748',
                fontSize: '14px',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                transition: 'all 0.3s ease-in-out',
                opacity: loading ? 0.6 : 1
              }}
            >
              <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z" fill="#4285F4"/>
                <path d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z" fill="#34A853"/>
                <path d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z" fill="#FBBC04"/>
                <path d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z" fill="#EA4335"/>
              </svg>
              {mode === 'signup' ? 'Sign up with Google' : 'Sign in with Google'}
            </button>

            {/* Divider */}
            <div style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '28px'
            }}>
              <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }}></div>
              <span style={{ color: '#A0AEC0', fontSize: '13px' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }}></div>
            </div>

            {/* Login/Signup Form */}
            <form onSubmit={mode === 'login' ? handleLogin : handleEmailSubmit} style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  placeholder={mode === 'login' ? 'Enter email or username' : 'Enter email'}
                  value={email}
                  onChange={mode === 'login' ? (e) => setEmail(e.target.value) : handleEmailChange}
                  required
                  style={{
                    width: '100%',
                    background: '#F7FAFC',
                    border: error ? '1px solid #E53E3E' : '1px solid #E2E8F0',
                    borderRadius: '10px',
                    padding: '13px 16px',
                    paddingRight: (emailAvailable && !checkingEmail && mode === 'signup') ? '44px' : '16px',
                    color: '#2D3748',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.3s ease-in-out',
                    boxSizing: 'border-box'
                  }}
                />
                {mode === 'signup' && checkingEmail && (
                  <div
                    style={{
                      position: 'absolute',
                      right: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '18px',
                      height: '18px',
                      border: '2px solid #E2E8F0',
                      borderTopColor: '#8B2F2F',
                      borderRadius: '50%',
                      animation: 'spin 0.6s linear infinite'
                    }}
                  />
                )}
                {mode === 'signup' && emailAvailable && !checkingEmail && isValidEmailFormat(email) && (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      position: 'absolute',
                      right: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none'
                    }}
                  >
                    <path
                      d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z"
                      fill="#48BB78"
                    />
                  </svg>
                )}
              </div>

              {mode === 'login' && (
                <input
                  type="password"
                  placeholder="Password"
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
              )}

              {error && (
                <p style={{
                  color: '#E53E3E',
                  fontSize: '13px',
                  margin: '-8px 0 0 0',
                  transition: 'all 0.3s ease-in-out'
                }}>
                  {error}
                </p>
              )}

              {mode === 'login' && (
                <div style={{
                  textAlign: 'right',
                  marginTop: '-4px'
                }}>
                  <a
                    href="/forgot-password"
                    style={{
                      color: '#8B2F2F',
                      fontSize: '13px',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease-in-out'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.textDecoration = 'underline'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.textDecoration = 'none'
                    }}
                  >
                    Forgot password?
                  </a>
                </div>
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
                {loading ? (mode === 'login' ? 'Signing in...' : 'Checking...') : 'Continue'}
              </button>
            </form>
          </>
        ) : (
          <>
            {/* Back Button */}
            <button
              onClick={() => {
                setStep('initial')
                setError('')
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#A0AEC0',
                fontSize: '13px',
                cursor: 'pointer',
                marginBottom: '20px',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.3s ease-in-out'
              }}
            >
              ← Back
            </button>

            {/* Details Form */}
            <form onSubmit={handleSignUp} style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <input
                type="email"
                value={email}
                readOnly
                style={{
                  width: '100%',
                  background: '#F7FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '10px',
                  padding: '13px 16px',
                  paddingRight: '44px',
                  color: '#2D3748',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  position: 'relative'
                }}
              />

              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
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
                  margin: '-8px 0 0 0',
                  transition: 'all 0.3s ease-in-out'
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
                {loading ? 'Creating account...' : 'Continue'}
              </button>
            </form>
          </>
        )}

        {/* Terms */}
        <p style={{
          textAlign: 'center',
          marginTop: '20px',
          fontSize: '12px',
          color: '#A0AEC0',
          lineHeight: '1.6',
          transition: 'all 0.3s ease-in-out'
        }}>
          By continuing, you agree to Pulse Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}

