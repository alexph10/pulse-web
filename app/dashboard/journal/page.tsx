'use client'

import { useState, useEffect } from 'react'
import { useVoiceRecorder } from '@/app/hooks/useVoiceRecorder'
import { supabase } from '@/lib/supabase'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useToast } from '@/app/contexts/ToastContext'
import { MoodAnalysisPanel } from '../../components/journal/MoodAnalysisPanel'
import { JournalHistory } from '../../components/journal/JournalHistory'
import { ContextualPrompts } from '../../components/journal/ContextualPrompts'
import { EntryTemplates } from '../../components/journal/EntryTemplates'
import { useAutoSave } from '@/lib/hooks/useAutoSave'
import { getDraft, clearDraft, hasRecentDraft } from '@/lib/storage/draftStorage'
import { transcribeAudio, analyzeMood } from '@/lib/api/ai-client'

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

  // Get user ID and restore draft
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id)
        fetchEntries(user.id)
        
        // Restore draft if exists
        const draftKey = `journal_${user.id}`
        if (hasRecentDraft(draftKey)) {
          const draft = getDraft(draftKey)
          if (draft && draft.content) {
            setTranscript(draft.content)
            // Optionally show a toast that draft was restored
          }
        }
      }
    })
  }, [])

  // Auto-save transcript
  useAutoSave({
    key: userId ? `journal_${userId}` : 'journal_temp',
    data: transcript,
    enabled: !!userId && !!transcript && transcript.length > 0,
    intervalMs: 30000, // 30 seconds
  })

  // Fetch journal entries
  const fetchEntries = async (uid: string) => {
    try {
      const response = await fetch(`/api/journal?limit=20`)
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
      transcribeAudioHandler()
    }
  }, [audioBlob, isRecording])

  const transcribeAudioHandler = async () => {
    if (!audioBlob) return

    setIsTranscribing(true)

    try {
      const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' })
      const response = await transcribeAudio(audioFile)
      const data = response.data
      
      if (data.success) {
        setTranscript(data.text)
        analyzeMoodHandler(data.text)
      } else {
        showToast('Transcription failed. Please try again.', 'error')
      }
    } catch (error: any) {
      console.error('Transcription failed:', error)
      showToast(error.message || 'Failed to transcribe audio. Check your connection.', 'error')
    } finally {
      setIsTranscribing(false)
    }
  }

  const analyzeMoodHandler = async (text: string) => {
    setIsAnalyzing(true)

    try {
      const response = await analyzeMood(text)
      const data = response.data
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
    } catch (error: any) {
      console.error('Mood analysis failed:', error)
      showToast(error.message || 'Mood analysis failed', 'error')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const saveEntry = async () => {
    if (!userId || !transcript || !moodAnalysis || isSaving) return

    setIsSaving(true)

    try {
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
        
        // Clear draft
        if (userId) {
          clearDraft(`journal_${userId}`)
        }
        
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
      joyful: '#16A34A', // green
      content: '#22C55E', // light green
      calm: '#814837', // ironstone
      neutral: '#814837', // ironstone (replaces gray)
      anxious: '#c67b22', // ochre
      sad: '#8d503a', // potters-clay
      frustrated: '#c2593f', // crail
      angry: '#8d503a', // potters-clay (darker)
      overwhelmed: '#b46c41', // brown-rust
      excited: '#c67b22', // ochre
    }
    return colors[mood.toLowerCase()] || '#814837' // ironstone default
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
            fontFamily: 'var(--font-family-switzer)',
            lineHeight: '1.5'
          }}>
            Express your thoughts naturally through voice. We'll help you understand your emotional patterns and build self-awareness.
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
            {/* Entry Templates */}
            <EntryTemplates
              onTemplateSelect={(content) => setTranscript(content)}
              isVisible={!isRecording && !transcript}
            />

            {/* Contextual Prompts */}
            {!isRecording && !transcript && (
              <ContextualPrompts
                onPromptSelect={(promptText) => setTranscript(promptText)}
              />
            )}

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

            {/* Mood Analysis - Contextual UI (only shows after transcription) */}
            {transcript && moodAnalysis && (
              <MoodAnalysisPanel
                moodAnalysis={moodAnalysis}
                onDismiss={() => setMoodAnalysis(null)}
              />
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
          <JournalHistory
            entries={entries}
            onEntryClick={(entry) => {
              // Could open entry in a modal or navigate to detail view
              console.log('Entry clicked:', entry)
            }}
            onDelete={async (entryId) => {
              try {
                const response = await fetch(`/api/journal?id=${entryId}`, {
                  method: 'DELETE',
                })
                const data = await response.json()
                if (data.success) {
                  showToast('Entry deleted successfully', 'success')
                  if (userId) fetchEntries(userId)
                }
              } catch (error) {
                showToast('Failed to delete entry', 'error')
              }
            }}
            onExport={() => {
              // Export functionality
              const dataStr = JSON.stringify(entries, null, 2)
              const dataBlob = new Blob([dataStr], { type: 'application/json' })
              const url = URL.createObjectURL(dataBlob)
              const link = document.createElement('a')
              link.href = url
              link.download = `journal-entries-${new Date().toISOString().split('T')[0]}.json`
              link.click()
              URL.revokeObjectURL(url)
              showToast('Entries exported successfully', 'success')
            }}
          />
        )}
    </DashboardLayout>
  )
}
