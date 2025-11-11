'use client'

import { useState, useEffect } from 'react'
import { useVoiceRecorder } from '@/app/hooks/useVoiceRecorder'
import { supabase } from '@/lib/supabase'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useToast } from '@/app/contexts/ToastContext'

interface MoodAnalysis {
  primaryMood: string
  moodScore: number
  emotions: string[]
  sentiment: string
  keywords: string[]
  insight: string
  followUpQuestion: string
}

interface JournalEntry {
  id: string
  transcript: string
  primary_mood: string
  mood_score: number
  emotions: string[]
  sentiment: string
  insight: string
  created_at: string
}

export default function Journal() {
  const [transcript, setTranscript] = useState('')
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [moodAnalysis, setMoodAnalysis] = useState<MoodAnalysis | null>(null)
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [view, setView] = useState<'record' | 'history'>('record')

  // Toast hook for notifications
  const { showToast } = useToast()

  const {
    isRecording,
    isPaused,
    recordingTime,
    audioBlob,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    clearRecording,
  } = useVoiceRecorder()

  // Get user ID
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id)
        fetchEntries(user.id)
      }
    })
  }, [])

  // Fetch journal entries
  const fetchEntries = async (uid: string) => {
    try {
      const response = await fetch(`/api/journal?userId=${uid}&limit=20`)
      const data = await response.json()
      if (data.success) {
        setEntries(data.entries)
      }
    } catch (error) {
      console.error('Failed to fetch entries:', error)
    }
  }

  // Transcribe audio when recording stops
  useEffect(() => {
    if (audioBlob && !isRecording) {
      transcribeAudio()
    }
  }, [audioBlob, isRecording])

  const transcribeAudio = async () => {
    if (!audioBlob) return

    setIsTranscribing(true)
    const formData = new FormData()
    formData.append('audio', audioBlob, 'recording.webm')

    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (data.success) {
        setTranscript(data.text)
        analyzeMood(data.text)
      } else {
        showToast('Transcription failed. Please try again.', 'error')
      }
    } catch (error) {
      console.error('Transcription failed:', error)
      showToast('Failed to transcribe audio. Check your connection.', 'error')
    } finally {
      setIsTranscribing(false)
    }
  }

  const analyzeMood = async (text: string) => {
    setIsAnalyzing(true)

    try {
      const response = await fetch('/api/analyze-mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      const data = await response.json()
      if (data.success) {
        setMoodAnalysis({
          primaryMood: data.primaryMood,
          moodScore: data.moodScore,
          emotions: data.emotions,
          sentiment: data.sentiment,
          keywords: data.keywords,
          insight: data.insight,
          followUpQuestion: data.followUpQuestion,
        })
      }
    } catch (error) {
      console.error('Mood analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const saveEntry = async () => {
    if (!userId || !transcript || !moodAnalysis) return

    setIsSaving(true)

    try {
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          transcript,
          mood: moodAnalysis.primaryMood,
          moodScore: moodAnalysis.moodScore,
          emotions: moodAnalysis.emotions,
          sentiment: moodAnalysis.sentiment,
          keywords: moodAnalysis.keywords,
          insight: moodAnalysis.insight,
          followUpQuestion: moodAnalysis.followUpQuestion,
        }),
      })

      const data = await response.json()
      if (data.success) {
        // Success toast
        showToast('Journal entry saved successfully!', 'success')
        
        // Reset form
        setTranscript('')
        setMoodAnalysis(null)
        clearRecording()
        // Refresh entries
        fetchEntries(userId)
        // Show success briefly
        setTimeout(() => setView('history'), 500)
      } else {
        // Error from API
        showToast(data.error || 'Failed to save entry', 'error')
      }
    } catch (error) {
      console.error('Failed to save entry:', error)
      // Network or unexpected error
      showToast('Failed to save entry. Please try again.', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getMoodColor = (mood: string) => {
    const colors: Record<string, string> = {
      joyful: '#48BB78',
      content: '#68D391',
      calm: '#4FD1C5',
      neutral: '#A0AEC0',
      anxious: '#F6AD55',
      sad: '#90CDF4',
      frustrated: '#FC8181',
      angry: '#E53E3E',
      overwhelmed: '#ED8936',
      excited: '#9F7AEA',
    }
    return colors[mood.toLowerCase()] || '#A0AEC0'
  }

  const getMoodEmoji = (mood: string) => {
    // Return mood text instead of emoji
    return mood.charAt(0).toUpperCase() + mood.slice(1)
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div style={{
        marginBottom: '32px'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '600',
          color: 'var(--text-primary)',
          marginBottom: '8px',
          fontFamily: 'var(--font-family-satoshi)'
        }}>
          Voice Journal
        </h1>
          <p style={{
            fontSize: '15px',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-family-satoshi)'
          }}>
            Speak your thoughts, track your emotions
          </p>
        </div>

        {/* View Toggle */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '32px'
        }}>
          <button
            onClick={() => setView('record')}
            style={{
              padding: '10px 24px',
              background: view === 'record' ? 'var(--accent-primary)' : 'var(--surface)',
              color: view === 'record' ? '#ffffff' : 'var(--text-secondary)',
              border: '1px solid',
              borderColor: view === 'record' ? 'var(--accent-primary)' : 'var(--border-subtle)',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease-in-out',
              fontFamily: 'var(--font-family-satoshi)'
            }}
          >
            New Entry
          </button>
          <button
            onClick={() => setView('history')}
            style={{
              padding: '10px 24px',
              background: view === 'history' ? 'var(--accent-primary)' : 'var(--surface)',
              color: view === 'history' ? '#ffffff' : 'var(--text-secondary)',
              border: '1px solid',
              borderColor: view === 'history' ? 'var(--accent-primary)' : 'var(--border-subtle)',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease-in-out',
              fontFamily: 'var(--font-family-satoshi)'
            }}
          >
            History ({entries.length})
          </button>
        </div>

        {view === 'record' ? (
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '40px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {/* Recording Section */}
            <div style={{
              textAlign: 'center',
              marginBottom: '32px'
            }}>
              {/* Record Button */}
              <div style={{
                position: 'relative',
                width: '120px',
                height: '120px',
                margin: '0 auto 24px'
              }}>
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isTranscribing || isAnalyzing}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: isRecording ? '#E53E3E' : 'var(--accent-primary)',
                    border: 'none',
                    cursor: isTranscribing || isAnalyzing ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease-in-out',
                    boxShadow: isRecording ? '0 0 0 8px rgba(229, 62, 62, 0.2)' : 'var(--shadow-md)',
                    animation: isRecording ? 'pulse 2s infinite' : 'none'
                  }}
                >
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {isRecording ? (
                      <rect x="6" y="6" width="12" height="12" fill="#ffffff" rx="2"/>
                    ) : (
                      <path
                        d="M12 14C13.66 14 15 12.66 15 11V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 12.66 10.34 14 12 14ZM17 11C17 14 14.76 16.1 12 16.1C9.24 16.1 7 14 7 11H5C5 14.41 7.72 17.23 11 17.72V21H13V17.72C16.28 17.23 19 14.41 19 11H17Z"
                        fill="#ffffff"
                      />
                    )}
                  </svg>
                </button>

                {/* Animated ring */}
                {isRecording && (
                  <div style={{
                    position: 'absolute',
                    top: '-8px',
                    left: '-8px',
                    right: '-8px',
                    bottom: '-8px',
                    borderRadius: '50%',
                    border: '3px solid #E53E3E',
                    animation: 'spin 3s linear infinite',
                    opacity: 0.5
                  }} />
                )}
              </div>

              {/* Recording time */}
              {isRecording && (
                <div style={{
                  fontSize: '32px',
                  fontWeight: '600',
                  color: '#E53E3E',
                  marginBottom: '12px',
                  fontVariantNumeric: 'tabular-nums'
                }}>
                  {formatTime(recordingTime)}
                </div>
              )}

              {/* Status text */}
              <p style={{
                fontSize: '15px',
                color: isRecording ? '#E53E3E' : 'var(--text-secondary)',
                fontWeight: '500',
                fontFamily: 'var(--font-family-satoshi)'
              }}>
                {isRecording
                  ? 'Recording...'
                  : isTranscribing
                  ? 'Transcribing...'
                  : isAnalyzing
                  ? 'Analyzing mood...'
                  : 'Click to start recording'}
              </p>

              {/* Pause/Resume */}
              {isRecording && (
                <button
                  onClick={isPaused ? resumeRecording : pauseRecording}
                  style={{
                    marginTop: '16px',
                    padding: '8px 24px',
                    background: 'var(--surface)',
                    color: 'var(--accent-primary)',
                    border: '2px solid var(--accent-primary)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease-in-out',
                    fontFamily: 'var(--font-family-satoshi)'
                  }}
                >
                  {isPaused ? 'Resume' : 'Pause'}
                </button>
              )}
            </div>

            {/* Transcript */}
            {transcript && (
              <div style={{
                marginBottom: '32px'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: '12px',
                  fontFamily: 'var(--font-family-satoshi)'
                }}>
                  Transcript
                </h3>
                <div style={{
                  background: 'var(--background)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '20px',
                  fontSize: '15px',
                  lineHeight: '1.7',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-family-satoshi)'
                }}>
                  {transcript}
                </div>
              </div>
            )}

            {/* Mood Analysis */}
            {moodAnalysis && (
              <div style={{
                marginBottom: '32px'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: '16px',
                  fontFamily: 'var(--font-family-satoshi)'
                }}>
                  Mood Analysis
                </h3>

                {/* Mood Display */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '20px',
                  padding: '20px',
                  background: 'var(--background)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px'
                }}>
                  <div style={{
                    fontSize: '48px'
                  }}>
                    {getMoodEmoji(moodAnalysis.primaryMood)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: getMoodColor(moodAnalysis.primaryMood),
                      marginBottom: '4px',
                      textTransform: 'capitalize',
                      fontFamily: 'var(--font-family-satoshi)'
                    }}>
                      {moodAnalysis.primaryMood}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: 'var(--text-secondary)',
                      fontFamily: 'var(--font-family-satoshi)'
                    }}>
                      Score: {moodAnalysis.moodScore}/10
                    </div>
                  </div>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: `conic-gradient(${getMoodColor(moodAnalysis.primaryMood)} ${moodAnalysis.moodScore * 10}%, var(--border-subtle) 0)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: 'var(--surface)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-family-satoshi)'
                    }}>
                      {moodAnalysis.moodScore}
                    </div>
                  </div>
                </div>

                {/* Emotions */}
                {moodAnalysis.emotions.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'var(--text-secondary)',
                      marginBottom: '8px',
                      fontFamily: 'var(--font-family-satoshi)'
                    }}>
                      Detected Emotions
                    </div>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}>
                      {moodAnalysis.emotions.map((emotion, idx) => (
                        <span
                          key={idx}
                          style={{
                            padding: '6px 12px',
                            background: 'var(--background)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '20px',
                            fontSize: '13px',
                            fontWeight: '500',
                            fontFamily: 'var(--font-family-satoshi)'
                          }}
                        >
                          {emotion}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Insight */}
                <div style={{
                  padding: '16px',
                  background: 'var(--background)',
                  border: '1px solid var(--border-subtle)',
                  borderLeft: '4px solid var(--accent-primary)',
                  borderRadius: '8px',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    fontSize: '14px',
                    color: 'var(--text-primary)',
                    lineHeight: '1.6',
                    fontFamily: 'var(--font-family-satoshi)'
                  }}>
                    {moodAnalysis.insight}
                  </div>
                </div>

                {/* Follow-up Question */}
                <div style={{
                  padding: '16px',
                  background: 'var(--background)',
                  border: '1px solid var(--border-subtle)',
                  borderLeft: '4px solid #48BB78',
                  borderRadius: '8px'
                }}>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: 'var(--text-secondary)',
                    marginBottom: '4px',
                    fontFamily: 'var(--font-family-satoshi)'
                  }}>
                    Reflection Question
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: 'var(--text-primary)',
                    lineHeight: '1.6',
                    fontFamily: 'var(--font-family-satoshi)'
                  }}>
                    {moodAnalysis.followUpQuestion}
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            {transcript && moodAnalysis && (
              <button
                onClick={saveEntry}
                disabled={isSaving}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: isSaving ? 'var(--border-subtle)' : 'var(--accent-primary)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  fontFamily: 'var(--font-family-satoshi)'
                }}
              >
                {isSaving ? 'Saving...' : 'Save Journal Entry'}
              </button>
            )}
          </div>
        ) : (
          /* History View */
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {entries.length === 0 ? (
              <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                padding: '60px 40px',
                textAlign: 'center',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{
                  fontSize: '48px',
                  marginBottom: '16px',
                  fontWeight: '600',
                  color: 'var(--text-secondary)'
                }}>
                  Journal
                </div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: '8px',
                  fontFamily: 'var(--font-family-satoshi)'
                }}>
                  No entries yet
                </h3>
                <p style={{
                  fontSize: '15px',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-family-satoshi)'
                }}>
                  Start recording your first voice journal entry
                </p>
              </div>
            ) : (
              entries.map((entry) => (
                <div
                  key={entry.id}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.3s ease-in-out'
                  }}
                >
                  {/* Header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <span style={{ fontSize: '32px' }}>
                        {getMoodEmoji(entry.primary_mood)}
                      </span>
                      <div>
                        <div style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: getMoodColor(entry.primary_mood),
                          textTransform: 'capitalize',
                          fontFamily: 'var(--font-family-satoshi)'
                        }}>
                          {entry.primary_mood}
                        </div>
                        <div style={{
                          fontSize: '13px',
                          color: 'var(--text-secondary)',
                          fontFamily: 'var(--font-family-satoshi)'
                        }}>
                          {new Date(entry.created_at).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                    <div style={{
                      padding: '6px 16px',
                      background: 'var(--background)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-family-satoshi)'
                    }}>
                      {entry.mood_score}/10
                    </div>
                  </div>

                  {/* Transcript */}
                  <div style={{
                    fontSize: '15px',
                    lineHeight: '1.7',
                    color: 'var(--text-primary)',
                    marginBottom: '12px',
                    fontFamily: 'var(--font-family-satoshi)'
                  }}>
                    {entry.transcript}
                  </div>

                  {/* Emotions */}
                  {entry.emotions && entry.emotions.length > 0 && (
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px',
                      marginTop: '12px'
                    }}>
                      {entry.emotions.map((emotion, idx) => (
                        <span
                          key={idx}
                          style={{
                            padding: '4px 10px',
                            background: 'var(--background)',
                            color: 'var(--text-secondary)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontFamily: 'var(--font-family-satoshi)'
                          }}
                        >
                          {emotion}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Insight */}
                  {entry.insight && (
                    <div style={{
                      marginTop: '12px',
                      padding: '12px',
                      background: 'var(--background)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      fontSize: '13px',
                      color: 'var(--text-secondary)',
                      fontStyle: 'italic',
                      fontFamily: 'var(--font-family-satoshi)'
                    }}>
                      "{entry.insight}"
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
    </DashboardLayout>
  )
}
