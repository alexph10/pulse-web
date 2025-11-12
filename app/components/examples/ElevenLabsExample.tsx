'use client';

import React, { useState } from 'react';

/**
 * Example component demonstrating ElevenLabs integration
 * 
 * To use this component:
 * 1. Add NEXT_PUBLIC_ELEVENLABS_API_KEY to your .env.local
 * 2. Import and use in any page: <ElevenLabsExample />
 */
export function ElevenLabsExample() {
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!text.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/elevenlabs/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error('TTS Error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ 
      padding: '24px', 
      border: '1px solid var(--border-subtle)', 
      borderRadius: '8px',
      background: 'var(--surface)'
    }}>
      <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>
        ElevenLabs Text-to-Speech
      </h3>
      
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to convert to speech..."
        style={{
          width: '100%',
          padding: '12px',
          marginBottom: '12px',
          borderRadius: '6px',
          border: '1px solid var(--border-subtle)',
          background: 'var(--background)',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-family-satoshi)',
          fontSize: '14px',
          minHeight: '100px',
          resize: 'vertical'
        }}
      />
      
      <button
        onClick={handleGenerate}
        disabled={isGenerating || !text.trim()}
        style={{
          padding: '8px 20px',
          borderRadius: '6px',
          border: 'none',
          background: isGenerating || !text.trim() 
            ? 'var(--text-disabled)' 
            : 'var(--accent-primary)',
          color: '#ffffff',
          fontFamily: 'var(--font-family-satoshi)',
          fontSize: '13px',
          fontWeight: 600,
          cursor: isGenerating || !text.trim() ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        {isGenerating ? 'Generating...' : 'Generate Speech'}
      </button>
    </div>
  );
}
