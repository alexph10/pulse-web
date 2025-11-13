'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useVoiceRecorder } from '../../hooks/useVoiceRecorder';
import styles from './notes.module.css';
import { 
  MagnifyingGlassIcon, 
  StopIcon,
  PlayIcon,
  PauseIcon,
  TrashIcon,
  Pencil1Icon,
  StarIcon,
  StarFilledIcon
} from '@radix-ui/react-icons';

export default function Notes() {
  const router = useRouter();
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [entries, setEntries] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showInsights, setShowInsights] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
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
  } = useVoiceRecorder();

  // Fetch journal entries
  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (err: any) {
      console.error('Error fetching entries:', err);
    }
  };

  const handleVoiceClick = async () => {
    if (!isRecording) {
      try {
        await startRecording();
      } catch (err) {
        setError('Could not access microphone');
      }
    } else if (isPaused) {
      resumeRecording();
    } else {
      pauseRecording();
    }
  };

  const handleStopRecording = () => {
    stopRecording();
  };

  const handleSaveRecording = async () => {
    if (!audioBlob || !user) return;

    setLoading(true);
    setError('');

    try {
      // 1. Upload audio to storage
      const fileName = `${user.id}/${Date.now()}.webm`;
      const { error: uploadError } = await supabase.storage
        .from('voice-recordings')
        .upload(fileName, audioBlob);

      if (uploadError) throw uploadError;

      // 2. Get public URL
      const { data: urlData } = supabase.storage
        .from('voice-recordings')
        .getPublicUrl(fileName);

      // 3. Transcribe with Whisper
      const formData = new FormData();
      formData.append('audio', audioBlob);

      const transcribeResponse = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!transcribeResponse.ok) throw new Error('Transcription failed');

      const { text: transcript } = await transcribeResponse.json();

      // 4. Save to database
      const { error: dbError } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          transcript,
          audio_url: urlData.publicUrl,
          duration_seconds: recordingTime,
        });

      if (dbError) throw dbError;

      // 5. Refresh entries and clear recording
      await fetchEntries();
      clearRecording();
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to save recording');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || chatLoading) return;

    const userMessage = input.trim();
    setInput('');
    setChatLoading(true);
    setError('');

    // Add user message to chat
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);

    try {
      // Get recent journal entries for context
      const recentEntries = entries.slice(0, 5);

      // Call chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: messages,
          recentEntries,
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();

      // Add assistant response to chat
      setMessages([...newMessages, { role: 'assistant', content: data.message }]);
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
      // Remove user message if request failed
      setMessages(messages);
    } finally {
      setChatLoading(false);
    }
  };

  // Delete entry
  const handleDeleteEntry = async (entryId: string) => {
    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', entryId);

      if (error) throw error;

      // Update local state
      setEntries(entries.filter(entry => entry.id !== entryId));
      setDeleteConfirmId(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete entry');
    }
  };

  // Toggle favorite
  const handleToggleFavorite = async (entryId: string, currentFavorite: boolean) => {
    try {
      const { error } = await supabase
        .from('journal_entries')
        .update({ is_favorite: !currentFavorite })
        .eq('id', entryId);

      if (error) throw error;

      // Update local state
      setEntries(entries.map(entry => 
        entry.id === entryId 
          ? { ...entry, is_favorite: !currentFavorite }
          : entry
      ));
    } catch (err: any) {
      setError(err.message || 'Failed to update favorite status');
    }
  };

  // Start editing
  const handleStartEdit = (entry: any) => {
    setEditingId(entry.id);
    setEditText(entry.transcript);
  };

  // Save edit
  const handleSaveEdit = async (entryId: string) => {
    if (!editText.trim()) return;

    try {
      const { error } = await supabase
        .from('journal_entries')
        .update({ transcript: editText.trim() })
        .eq('id', entryId);

      if (error) throw error;

      // Update local state
      setEntries(entries.map(entry => 
        entry.id === entryId 
          ? { ...entry, transcript: editText.trim() }
          : entry
      ));
      setEditingId(null);
      setEditText('');
    } catch (err: any) {
      setError(err.message || 'Failed to update entry');
    }
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleGenerateInsights = async () => {
    if (!user || entries.length < 3) {
      setError('You need at least 3 journal entries to generate insights.');
      return;
    }

    setInsightsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/analyze-patterns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          days: 30,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to generate insights');
      }

      const data = await response.json();
      setInsights(data);
      setShowInsights(true);
    } catch (err: any) {
      setError(err.message || 'Failed to generate insights');
    } finally {
      setInsightsLoading(false);
    }
  };

  // Filter entries based on search query
  const filteredEntries = searchQuery.trim() 
    ? entries.filter(entry => 
        entry.transcript?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : entries;

  // Highlight matching text in search results
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <mark key={index} style={{ 
            background: 'var(--accent-primary)', 
            color: '#2D3A37',
            padding: '2px 4px',
            borderRadius: '2px'
          }}>{part}</mark>
        : part
    );
  };

  return (
    <div className="min-h-screen p-8" style={{
      background: 'var(--background)'
    }}>
      
      <main className={styles.mainContent}>
        <div className={styles.centerContent}>
          {error && <div className={styles.error}>{error}</div>}

          {/* Insights Display */}
          {showInsights && insights && (
            <div className={styles.insightsContainer}>
              <div className={styles.insightsHeader}>
                <h2 className={styles.insightsTitle}>Your Insights</h2>
                <button 
                  onClick={() => setShowInsights(false)}
                  className={styles.closeButton}
                >
                  Close
                </button>
              </div>

              <p className={styles.insightsSummary}>{insights.analysis.summary}</p>

              {/* Themes */}
              {insights.analysis.themes && insights.analysis.themes.length > 0 && (
                <div className={styles.insightSection}>
                  <h3 className={styles.sectionTitle}>Recurring Themes</h3>
                  <div className={styles.insightCards}>
                    {insights.analysis.themes.map((theme: any, idx: number) => (
                      <div key={idx} className={styles.insightCard}>
                        <div className={styles.cardHeader}>
                          <span className={styles.cardTitle}>{theme.name}</span>
                          <span className={styles.cardFrequency}>
                            {Math.round(theme.frequency * 100)}%
                          </span>
                        </div>
                        <p className={styles.cardDescription}>{theme.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mood Patterns */}
              {insights.analysis.moodPatterns && insights.analysis.moodPatterns.length > 0 && (
                <div className={styles.insightSection}>
                  <h3 className={styles.sectionTitle}>Mood Patterns</h3>
                  <div className={styles.insightCards}>
                    {insights.analysis.moodPatterns.map((pattern: any, idx: number) => (
                      <div key={idx} className={styles.insightCard}>
                        <span className={styles.cardTitle}>{pattern.pattern}</span>
                        <p className={styles.cardDescription}>{pattern.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Triggers */}
              {insights.analysis.triggers && insights.analysis.triggers.length > 0 && (
                <div className={styles.insightSection}>
                  <h3 className={styles.sectionTitle}>Potential Triggers</h3>
                  <div className={styles.insightCards}>
                    {insights.analysis.triggers.map((trigger: any, idx: number) => (
                      <div key={idx} className={styles.insightCard}>
                        <span className={styles.cardTitle}>{trigger.trigger}</span>
                        <p className={styles.cardDescription}>{trigger.impact}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Growth */}
              {insights.analysis.growth && insights.analysis.growth.length > 0 && (
                <div className={styles.insightSection}>
                  <h3 className={styles.sectionTitle}>Signs of Growth</h3>
                  <div className={styles.insightCards}>
                    {insights.analysis.growth.map((growth: any, idx: number) => (
                      <div key={idx} className={styles.insightCard}>
                        <span className={styles.cardTitle}>{growth.area}</span>
                        <p className={styles.cardDescription}>{growth.evidence}</p>
                        <span className={styles.cardTrajectory}>{growth.trajectory}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Chat Messages */}
          {messages.length > 0 && (
            <div className={styles.chatMessages}>
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={msg.role === 'user' ? styles.userMessage : styles.assistantMessage}
                >
                  <div className={styles.messageContent}>{msg.content}</div>
                </div>
              ))}
              {chatLoading && (
                <div className={styles.assistantMessage}>
                  <div className={styles.messageContent}>
                    <span className={styles.typingIndicator}>Pulse is thinking...</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Recording Controls */}
          {(isRecording || audioBlob) && (
            <div className={styles.recordingCard}>
              <div className={styles.recordingHeader}>
                <span className={styles.recordingTime}>{formatTime(recordingTime)}</span>
                {isRecording && (
                  <span className={styles.recordingIndicator}>
                    {isPaused ? 'Paused' : 'Recording...'}
                  </span>
                )}
              </div>

              <div className={styles.recordingControls}>
                {isRecording && (
                  <>
                    <button 
                      onClick={handleVoiceClick} 
                      className={styles.controlButton}
                      title={isPaused ? 'Resume' : 'Pause'}
                    >
                      {isPaused ? <PlayIcon width={20} height={20} /> : <PauseIcon width={20} height={20} />}
                    </button>
                    <button 
                      onClick={handleStopRecording} 
                      className={styles.controlButton}
                      title="Stop"
                    >
                      <StopIcon width={20} height={20} />
                    </button>
                  </>
                )}

                {audioBlob && !isRecording && (
                  <>
                    <button 
                      onClick={handleSaveRecording} 
                      className={styles.saveButton}
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Entry'}
                    </button>
                    <button 
                      onClick={clearRecording} 
                      className={styles.controlButton}
                      title="Delete"
                    >
                      <TrashIcon width={20} height={20} />
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSubmit} className={styles.inputForm}>
            <div className={styles.inputContainer}>
              <div className={styles.leftActions}>
                <button 
                  type="button" 
                  className={styles.iconButton} 
                  title="Search notes"
                  onClick={() => setShowSearch(!showSearch)}
                  style={{
                    background: showSearch ? 'var(--accent-primary)' : 'transparent',
                    color: showSearch ? '#fff' : 'inherit'
                  }}
                >
                  <MagnifyingGlassIcon width={18} height={18} />
                </button>
                <button 
                  type="button"
                  onClick={handleGenerateInsights}
                  className={styles.insightsButton}
                  disabled={insightsLoading || entries.length < 3}
                  title={entries.length < 3 ? `Create ${3 - entries.length} more entries to unlock insights` : 'Generate Insights'}
                >
                  {insightsLoading ? 'Analyzing...' : 'Generate Insights'}
                </button>
              </div>
              
              {showSearch ? (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  flex: 1
                }}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search your notes..."
                    className={styles.input}
                    autoFocus
                    style={{ flex: 1 }}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className={styles.iconButton}
                      title="Clear search"
                    >
                      ×
                    </button>
                  )}
                </div>
              ) : (
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Write your thoughts..."
                  className={styles.input}
                  disabled={isRecording || chatLoading}
                />
              )}
              
              <div className={styles.rightActions}>
                <button 
                  type="button" 
                  className={`${styles.iconButton} ${isRecording ? styles.recording : ''}`}
                  onClick={handleVoiceClick}
                  title="Voice note"
                  disabled={audioBlob !== null || showSearch}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 1a3 3 0 0 1 3 3v8a3 3 0 0 1-6 0V4a3 3 0 0 1 3-3z" fill="currentColor"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2h2v2a5 5 0 0 0 10 0v-2h2z" fill="currentColor"/>
                    <path d="M13 21h-2v-3h2v3z" fill="currentColor"/>
                  </svg>
                </button>
                <button type="submit" className={styles.submitButton} disabled={isRecording || chatLoading || !input.trim() || showSearch}>
                  <span>↑</span>
                </button>
              </div>
            </div>
          </form>

          {/* Search Results Counter */}
          {searchQuery && (
            <div style={{
              textAlign: 'center',
              padding: '12px',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-family-switzer)',
              fontSize: '14px'
            }}>
              {filteredEntries.length === 0 ? (
                <span>No entries found for "{searchQuery}"</span>
              ) : (
                <span>
                  Found {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
                </span>
              )}
            </div>
          )}

          {/* Journal Entries */}
          <div className={styles.entriesList}>
            {filteredEntries.length === 0 && !searchQuery ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: 'rgba(var(--text-primary-rgb, 0, 0, 0), 0.5)',
                fontFamily: 'var(--font-family-switzer)',
                fontSize: '16px'
              }}>
                <p style={{ marginBottom: '12px', fontSize: '18px' }}>No entries yet</p>
                <p style={{ fontSize: '14px', opacity: 0.7 }}>Start writing or recording your first thought</p>
              </div>
            ) : filteredEntries.length === 0 && searchQuery ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: 'rgba(var(--text-primary-rgb, 0, 0, 0), 0.5)',
                fontFamily: 'var(--font-family-switzer)',
                fontSize: '16px'
              }}>
                <p style={{ marginBottom: '12px', fontSize: '18px' }}>No matches found</p>
                <p style={{ fontSize: '14px', opacity: 0.7 }}>Try a different search term</p>
              </div>
            ) : (
              filteredEntries.map((entry) => (
                <div 
                  key={entry.id} 
                  className={styles.entryCard}
                  data-favorite={entry.is_favorite || false}
                >
                  <div className={styles.entryHeader}>
                    <span className={styles.entryDate}>
                      {new Date(entry.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </span>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {entry.duration_seconds && (
                        <span className={styles.entryDuration}>
                          {formatTime(entry.duration_seconds)}
                        </span>
                      )}
                      
                      {/* Action Buttons */}
                      <button
                        onClick={() => handleToggleFavorite(entry.id, entry.is_favorite)}
                        className={styles.iconButton}
                        title={entry.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
                        style={{
                          color: entry.is_favorite ? '#9EF4D0' : 'var(--text-secondary)',
                          padding: '4px'
                        }}
                      >
                        {entry.is_favorite ? (
                          <StarFilledIcon width={16} height={16} />
                        ) : (
                          <StarIcon width={16} height={16} />
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleStartEdit(entry)}
                        className={styles.iconButton}
                        title="Edit entry"
                        style={{ padding: '4px' }}
                        disabled={editingId !== null}
                      >
                        <Pencil1Icon width={16} height={16} />
                      </button>
                      
                      <button
                        onClick={() => setDeleteConfirmId(entry.id)}
                        className={styles.iconButton}
                        title="Delete entry"
                        style={{ 
                          padding: '4px',
                          color: deleteConfirmId === entry.id ? '#E091C5' : 'var(--text-secondary)'
                        }}
                      >
                        <TrashIcon width={16} height={16} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Delete Confirmation */}
                  {deleteConfirmId === entry.id && (
                    <div style={{
                      padding: '12px',
                      background: 'rgba(224, 145, 197, 0.1)',
                      border: '1px solid rgba(224, 145, 197, 0.3)',
                      borderRadius: '8px',
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <span style={{
                        fontSize: '14px',
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-family-switzer)'
                      }}>
                        Delete this entry?
                      </span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          style={{
                            padding: '6px 16px',
                            background: '#E091C5',
                            color: '#2D3A37',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontFamily: 'var(--font-family-satoshi)'
                          }}
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          style={{
                            padding: '6px 16px',
                            background: 'transparent',
                            color: 'var(--text-secondary)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            fontFamily: 'var(--font-family-satoshi)'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Entry Text - Editable or Display */}
                  {editingId === entry.id ? (
                    <div>
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className={styles.input}
                        style={{
                          width: '100%',
                          minHeight: '100px',
                          marginBottom: '12px',
                          resize: 'vertical'
                        }}
                        autoFocus
                      />
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleSaveEdit(entry.id)}
                          style={{
                            padding: '8px 20px',
                            background: 'var(--accent-primary)',
                            color: '#2D3A37',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontFamily: 'var(--font-family-satoshi)'
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          style={{
                            padding: '8px 20px',
                            background: 'transparent',
                            color: 'var(--text-secondary)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            fontFamily: 'var(--font-family-satoshi)'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className={styles.entryText}>
                      {searchQuery ? highlightText(entry.transcript, searchQuery) : entry.transcript}
                    </p>
                  )}
                  
                  {entry.audio_url && (
                    <audio controls className={styles.audioPlayer}>
                      <source src={entry.audio_url} type="audio/webm" />
                    </audio>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
