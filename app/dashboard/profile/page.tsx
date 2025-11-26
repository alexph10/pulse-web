'use client'

import { useState } from 'react'
import { X, User, Bell, Lock, Palette, Database, Info } from '@phosphor-icons/react'

export default function ProfilePage() {
  const [showOverlay, setShowOverlay] = useState(false)
  const [activeTab, setActiveTab] = useState('account')

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'transparent',
        padding: '80px 24px 24px',
        fontFamily: 'var(--font-family-satoshi)',
      }}
    >
      <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#fce7f3', marginBottom: '24px' }}>Profile</h2>
      {/* Add static profile info or summary here if needed */}
    </div>
  )
}

function NotificationsTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#fce7f3', marginBottom: '8px' }}>Notification Preferences</h3>
      <ToggleOption label="Daily reminders" description="Get reminded to log your mood" defaultChecked />
      <ToggleOption label="Weekly reports" description="Receive weekly wellness summaries" defaultChecked />
      <ToggleOption label="Goal notifications" description="Alerts for goal progress" />
      <ToggleOption label="Streak alerts" description="Don't break your streak" defaultChecked />
    </div>
  )
}

function PrivacyTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#fce7f3', marginBottom: '8px' }}>Privacy & Security</h3>
      <ToggleOption label="Profile visibility" description="Make your profile public" />
      <ToggleOption label="Share analytics" description="Help improve the app" defaultChecked />
      <ToggleOption label="Two-factor authentication" description="Extra security for your account" />
    </div>
  )
}

function AppearanceTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#fce7f3', marginBottom: '8px' }}>Appearance</h3>
      <div>
        <label style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '8px', display: 'block' }}>Theme</label>
        <div style={{ display: 'flex', gap: '12px' }}>
          {['Dark', 'Light', 'Auto'].map((theme) => (
            <button
              key={theme}
              style={{
                flex: 1,
                padding: '12px',
                background: theme === 'Dark' ? 'rgba(219, 39, 119, 0.2)' : 'rgba(219, 39, 119, 0.08)',
                border: theme === 'Dark' ? '1px solid rgba(219, 39, 119, 0.4)' : '1px solid rgba(219, 39, 119, 0.2)',
                color: '#f9fafb',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function DataTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#fce7f3', marginBottom: '8px' }}>Data Management</h3>
      <div>
        <button style={{
          padding: '12px 24px',
          background: 'rgba(219, 39, 119, 0.2)',
          border: '1px solid rgba(219, 39, 119, 0.4)',
          color: '#f9a8d4',
          fontSize: '13px',
          fontWeight: '500',
          cursor: 'pointer',
        }}>
          Export All Data
        </button>
        <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '8px' }}>Download your data in JSON format</p>
      </div>
      <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(239, 68, 68, 0.3)' }}>
        <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#fca5a5', marginBottom: '12px' }}>Danger Zone</h4>
        <button style={{
          padding: '12px 24px',
          background: 'rgba(239, 68, 68, 0.2)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          color: '#fca5a5',
          fontSize: '13px',
          fontWeight: '500',
          cursor: 'pointer',
        }}>
          Delete Account
        </button>
      </div>
    </div>
  )
}

function AboutTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#fce7f3', marginBottom: '8px' }}>About Pulse</h3>
      <div>
        <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '8px' }}>Version</p>
        <p style={{ fontSize: '14px', color: '#f9fafb' }}>1.0.0</p>
      </div>
      <div>
        <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '12px' }}>Links</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <a href="#" style={{ color: '#f9a8d4', fontSize: '13px', textDecoration: 'none' }}>Documentation</a>
          <a href="#" style={{ color: '#f9a8d4', fontSize: '13px', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="#" style={{ color: '#f9a8d4', fontSize: '13px', textDecoration: 'none' }}>Terms of Service</a>
          <a href="#" style={{ color: '#f9a8d4', fontSize: '13px', textDecoration: 'none' }}>Support</a>
        </div>
      </div>
    </div>
  )
}

// Helper Components
function InputField({ label, placeholder, type = 'text' }: { label: string; placeholder: string; type?: string }) {
  return (
    <div>
      <label style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '8px', display: 'block', fontWeight: '500' }}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '12px 14px',
          background: 'rgba(219, 39, 119, 0.12)',
          border: '1px solid rgba(219, 39, 119, 0.3)',
          color: '#f9fafb',
          fontSize: '13px',
          fontFamily: 'var(--font-family-satoshi)',
          outline: 'none',
        }}
      />
    </div>
  )
}

function ToggleOption({ label, description, defaultChecked }: { label: string; description: string; defaultChecked?: boolean }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px',
      background: 'rgba(219, 39, 119, 0.08)',
      border: '1px solid rgba(219, 39, 119, 0.2)',
    }}>
      <div>
        <p style={{ fontSize: '13px', color: '#f9fafb', marginBottom: '4px', fontWeight: '500' }}>{label}</p>
        <p style={{ fontSize: '11px', color: '#6b7280' }}>{description}</p>
      </div>
      <label style={{
        position: 'relative',
        display: 'inline-block',
        width: '44px',
        height: '24px',
        cursor: 'pointer',
      }}>
        <input type="checkbox" defaultChecked={defaultChecked} style={{ display: 'none' }} />
        <span style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: defaultChecked ? '#db2777' : '#374151',
          transition: '0.3s',
        }}>
          <span style={{
            position: 'absolute',
            height: '18px',
            width: '18px',
            left: defaultChecked ? '23px' : '3px',
            bottom: '3px',
            background: '#ffffff',
            transition: '0.3s',
          }} />
        </span>
      </label>
    </div>
  )
}
