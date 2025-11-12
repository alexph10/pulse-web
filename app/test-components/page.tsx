'use client';

import { DialogExamples } from '@/app/components/examples/DialogExamples';

export default function ComponentTestPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--background)',
      padding: '40px 24px',
    }}>
      <div style={{
        maxWidth: '800px',
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
          Testing Dialog and Toast components with your dark red theme
        </p>

        <DialogExamples />
      </div>
    </div>
  );
}
