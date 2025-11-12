'use client';

import { useState } from 'react';
import { DialogExamples } from '@/app/components/examples/DialogExamples';
import { Conversation, ConversationContent, ConversationEmptyState, ConversationScrollButton } from '@/components/ui/conversation';
import { ConversationBar } from '@/components/ui/conversation-bar';
import { Matrix } from '@/components/ui/matrix';
import { Message } from '@/components/ui/message';
import { MicSelector } from '@/components/ui/mic-selector';
import { Orb } from '@/components/ui/orb';
import { LiveWaveform } from '@/components/ui/live-waveform';

export default function ComponentTestPage() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant' as const, content: 'Hello! How can I help you today?', timestamp: new Date(Date.now() - 120000) },
    { id: 2, role: 'user' as const, content: 'I want to test the conversation components', timestamp: new Date(Date.now() - 60000) },
    { id: 3, role: 'assistant' as const, content: 'Great! These components support chat interfaces with auto-scrolling behavior.', timestamp: new Date() },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedMic, setSelectedMic] = useState<string>();
  const [audioData, setAudioData] = useState<Uint8Array>();

  const handleSend = () => {
    if (inputValue.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        role: 'user',
        content: inputValue,
        timestamp: new Date()
      }]);
      setInputValue('');
    }
  };

  // Simulate audio data for waveform
  const simulateAudioData = () => {
    const data = new Uint8Array(128);
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() * 255;
    }
    setAudioData(data);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--background)',
      padding: '40px 24px',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '12px',
        }}>
          Component Testing
        </h1>
        <p style={{
          fontSize: '14px',
          color: 'var(--text-secondary)',
          marginBottom: '32px',
        }}>
          Testing all shadcn/ui and ElevenLabs UI components
        </p>

        {/* Dialog & Toast Components */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '16px',
          }}>
            Dialog & Toast
          </h2>
          <DialogExamples />
        </section>

        {/* Conversation Components */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '16px',
          }}>
            Conversation (Auto-scroll Chat)
          </h2>
          <div style={{
            border: '1px solid var(--border)',
            borderRadius: '8px',
            overflow: 'hidden',
            height: '400px',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <Conversation>
              <ConversationContent>
                {messages.length === 0 ? (
                  <ConversationEmptyState>
                    <p style={{ color: 'var(--text-secondary)' }}>No messages yet</p>
                  </ConversationEmptyState>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
                    {messages.map((msg) => (
                      <Message
                        key={msg.id}
                        role={msg.role}
                        timestamp={msg.timestamp}
                        showTimestamp
                      >
                        {msg.content}
                      </Message>
                    ))}
                  </div>
                )}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>
            <ConversationBar
              value={inputValue}
              onChange={setInputValue}
              onSend={handleSend}
              isRecording={isRecording}
              onVoiceStart={() => setIsRecording(true)}
              onVoiceStop={() => setIsRecording(false)}
              placeholder="Type a message..."
            />
          </div>
        </section>

        {/* Message Component Standalone */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '16px',
          }}>
            Message Component
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Message role="user" showTimestamp timestamp={new Date()}>
              This is a user message with timestamp
            </Message>
            <Message role="assistant" showTimestamp timestamp={new Date()}>
              This is an assistant message with different styling
            </Message>
            <Message role="system">
              System message (no timestamp)
            </Message>
          </div>
        </section>

        {/* Mic Selector */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '16px',
          }}>
            Microphone Selector
          </h2>
          <MicSelector
            selectedDeviceId={selectedMic}
            onDeviceChange={setSelectedMic}
          />
          <p style={{
            fontSize: '12px',
            color: 'var(--text-secondary)',
            marginTop: '8px',
          }}>
            {selectedMic ? `Selected: ${selectedMic}` : 'No microphone selected'}
          </p>
        </section>

        {/* Orb Visualization */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '16px',
          }}>
            Orb Visualization
          </h2>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Animated (default)</p>
              <Orb size={150} color="#B91C1C" intensity={1} animated />
            </div>
            <div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Static</p>
              <Orb size={150} color="#10B981" intensity={1} animated={false} />
            </div>
            <div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>High Intensity</p>
              <Orb size={150} color="#3B82F6" intensity={2} animated />
            </div>
          </div>
        </section>

        {/* Live Waveform */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '16px',
          }}>
            Live Waveform
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>No audio data (idle state)</p>
              <LiveWaveform width={600} height={100} barCount={50} />
            </div>
            <div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>With simulated audio data</p>
              <LiveWaveform width={600} height={100} barCount={50} audioData={audioData} />
              <button
                onClick={simulateAudioData}
                style={{
                  marginTop: '8px',
                  padding: '8px 16px',
                  background: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                Simulate Audio
              </button>
            </div>
          </div>
        </section>

        {/* Matrix Effect */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '16px',
          }}>
            Matrix Rain Effect
          </h2>
          <div style={{
            border: '1px solid var(--border)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}>
            <Matrix
              style={{ width: '100%', height: '300px' }}
              fontSize={14}
              speed={50}
              density={0.95}
              color="#0F0"
            />
          </div>
        </section>

      </div>
    </div>
  );
}
