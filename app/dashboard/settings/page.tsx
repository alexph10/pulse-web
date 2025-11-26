'use client'

import { useState } from 'react'

type SettingsSection = 'profile' | 'dashboard' | 'tracking' | 'notifications' | 'data' | 'about'

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile')

  const sections = [
    { id: 'profile', label: 'Profile', description: 'Personal information' },
    { id: 'dashboard', label: 'Dashboard', description: 'Customize your view' },
    { id: 'tracking', label: 'Tracking', description: 'Mood & habit settings' },
    { id: 'notifications', label: 'Notifications', description: 'Reminders & alerts' },
    { id: 'data', label: 'Data & Privacy', description: 'Export & security' },
    { id: 'about', label: 'About', description: 'App info & support' },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'transparent',
      fontFamily: 'var(--font-family-satoshi)',
      display: 'flex',
      justifyContent: 'center',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1000px',
        padding: '80px 20px 24px',
      }}>
        {/* Header */}
        <header style={{ marginBottom: '24px' }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#f9fafb',
            marginBottom: '6px',
            letterSpacing: '-0.02em',
          }}>
            Settings
          </h1>
          <p style={{
            fontSize: '13px',
            color: '#9ca3af',
          }}>
            Customize your wellness tracking experience
          </p>
        </header>

        {/* Two-column layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '220px 1fr',
          gap: '20px',
        }}>
          {/* Sidebar navigation */}
          <nav style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}>
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as SettingsSection)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '4px',
                  padding: '10px 12px',
                  background: activeSection === section.id 
                    ? 'rgba(219, 39, 119, 0.2)' 
                    : 'transparent',
                  border: activeSection === section.id
                    ? '1px solid rgba(219, 39, 119, 0.4)'
                    : '1px solid transparent',
                  color: activeSection === section.id ? '#fce7f3' : '#9ca3af',
                  fontSize: '14px',
                  fontWeight: activeSection === section.id ? '600' : '400',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                  fontFamily: 'var(--font-family-satoshi)',
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== section.id) {
                    e.currentTarget.style.background = 'rgba(219, 39, 119, 0.1)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== section.id) {
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                <span style={{ fontSize: '14px' }}>{section.label}</span>
                <span style={{ 
                  fontSize: '11px', 
                  color: '#6b7280',
                  fontWeight: '400',
                }}>
                  {section.description}
                </span>
              </button>
            ))}
          </nav>

          {/* Content area */}
          <main style={{
            background: 'transparent',
            border: 'none',
            padding: '0',
            minHeight: '500px',
          }}>
            {activeSection === 'profile' && <ProfileSection />}
            {activeSection === 'dashboard' && <DashboardSection />}
            {activeSection === 'tracking' && <TrackingSection />}
            {activeSection === 'notifications' && <NotificationsSection />}
            {activeSection === 'data' && <DataSection />}
            {activeSection === 'about' && <AboutSection />}
          </main>
        </div>
      </div>
    </div>
  )
}

// Profile Section
function ProfileSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#f9fafb',
          marginBottom: '6px',
        }}>
          Profile
        </h2>
        <p style={{
          fontSize: '12px',
          color: '#9ca3af',
        }}>
          Manage your personal information
        </p>
      </div>

      {/* Profile Picture */}
      <SettingCard title="Profile Picture">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0f3d3c 0%, #1f5c57 100%)',
            border: '2px solid rgba(219, 39, 119, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            fontWeight: '700',
            color: '#ffffff',
          }}>
            U
          </div>
          <div>
            <button style={{
              padding: '10px 20px',
              background: 'rgba(219, 39, 119, 0.2)',
              border: '1px solid rgba(219, 39, 119, 0.4)',
              color: '#fce7f3',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              marginBottom: '8px',
              display: 'block',
            }}>
              Change Photo
            </button>
            <p style={{ fontSize: '11px', color: '#6b7280' }}>
              JPG, PNG or GIF. Max 2MB.
            </p>
          </div>
        </div>
      </SettingCard>

      {/* Display Name */}
      <SettingCard title="Display Name">
        <input
          type="text"
          placeholder="Your name"
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
      </SettingCard>

      {/* Email */}
      <SettingCard title="Email Address">
        <input
          type="email"
          placeholder="your@email.com"
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
      </SettingCard>
    </div>
  )
}

// Dashboard Section - Widget customization
function DashboardSection() {
  const widgets = [
    { id: 'mood-trend', name: 'Mood Trend', enabled: true },
    { id: 'focus-time', name: 'Peak Focus Hours', enabled: true },
    { id: 'activity-overview', name: 'Activity Overview', enabled: true },
    { id: 'weekly-activity', name: 'Weekly Activity', enabled: true },
    { id: 'total-entries', name: 'Total Entries', enabled: true },
    { id: 'avg-mood', name: 'Average Mood', enabled: true },
    { id: 'current-streak', name: 'Current Streak', enabled: true },
    { id: 'productivity', name: 'Productivity Score', enabled: false },
    { id: 'sleep-quality', name: 'Sleep Quality', enabled: false },
    { id: 'water-intake', name: 'Water Intake', enabled: false },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#f9fafb',
          marginBottom: '6px',
        }}>
          Dashboard Customization
        </h2>
        <p style={{
          fontSize: '12px',
          color: '#9ca3af',
        }}>
          Choose which widgets appear on your dashboard
        </p>
      </div>

      <SettingCard title="Visible Widgets">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {widgets.map((widget) => (
            <div
              key={widget.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px',
                background: widget.enabled 
                  ? 'rgba(219, 39, 119, 0.2)' 
                  : 'rgba(219, 39, 119, 0.08)',
                border: widget.enabled
                  ? '1px solid rgba(219, 39, 119, 0.4)'
                  : '1px solid rgba(219, 39, 119, 0.2)',
              }}
            >
              <span style={{
                fontSize: '13px',
                color: '#f9fafb',
                fontFamily: 'var(--font-family-satoshi)',
              }}>
                {widget.name}
              </span>
              <label style={{
                position: 'relative',
                display: 'inline-block',
                width: '38px',
                height: '20px',
                cursor: 'pointer',
              }}>
                <input
                  type="checkbox"
                  defaultChecked={widget.enabled}
                  style={{ display: 'none' }}
                />
                <span style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: widget.enabled ? '#db2777' : '#374151',
                  transition: '0.3s',
                }}>
                  <span style={{
                    position: 'absolute',
                    height: '14px',
                    width: '14px',
                    left: widget.enabled ? '21px' : '3px',
                    bottom: '3px',
                    background: '#ffffff',
                    transition: '0.3s',
                  }} />
                </span>
              </label>
            </div>
          ))}
        </div>
      </SettingCard>

      <SettingCard title="Layout Density">
        <div style={{ display: 'flex', gap: '8px' }}>
          {['Compact', 'Comfortable', 'Spacious'].map((density) => (
            <button
              key={density}
              style={{
                flex: 1,
                padding: '10px',
                background: density === 'Comfortable' 
                  ? 'rgba(219, 39, 119, 0.2)'
                  : 'rgba(219, 39, 119, 0.08)',
                border: density === 'Comfortable'
                  ? '1px solid rgba(219, 39, 119, 0.4)'
                  : '1px solid rgba(219, 39, 119, 0.2)',
                color: '#f9fafb',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              {density}
            </button>
          ))}
        </div>
      </SettingCard>
    </div>
  )
}

// Tracking Section - Mood scales, habits
function TrackingSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#f9fafb',
          marginBottom: '6px',
        }}>
          Tracking Settings
        </h2>
        <p style={{
          fontSize: '12px',
          color: '#9ca3af',
        }}>
          Configure how you track your mood and habits
        </p>
      </div>

      <SettingCard title="Mood Scale">
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          {['1-5', '1-10', '1-100'].map((scale) => (
            <button
              key={scale}
              style={{
                flex: 1,
                padding: '10px',
                background: scale === '1-10' 
                  ? 'rgba(219, 39, 119, 0.2)'
                  : 'rgba(219, 39, 119, 0.08)',
                border: scale === '1-10'
                  ? '1px solid rgba(219, 39, 119, 0.4)'
                  : '1px solid rgba(219, 39, 119, 0.2)',
                color: '#f9fafb',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              {scale}
            </button>
          ))}
        </div>
        <p style={{ fontSize: '11px', color: '#6b7280' }}>
          Choose your preferred mood rating scale
        </p>
      </SettingCard>

      <SettingCard title="Daily Check-in Time">
        <input
          type="time"
          defaultValue="09:00"
          style={{
            padding: '12px 14px',
            background: 'rgba(219, 39, 119, 0.12)',
            border: '1px solid rgba(219, 39, 119, 0.3)',
            color: '#f9fafb',
            fontSize: '13px',
            fontFamily: 'var(--font-family-satoshi)',
            outline: 'none',
          }}
        />
        <p style={{ fontSize: '10px', color: '#6b7280', marginTop: '6px' }}>
          Get reminded to log your mood
        </p>
      </SettingCard>

      <SettingCard title="Streak Goals">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            color: '#f9fafb',
          }}>
            <input type="checkbox" defaultChecked />
            Journal entries
          </label>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            color: '#f9fafb',
          }}>
            <input type="checkbox" defaultChecked />
            Goal completions
          </label>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            color: '#f9fafb',
          }}>
            <input type="checkbox" />
            Habit tracking
          </label>
        </div>
      </SettingCard>
    </div>
  )
}

// Notifications Section
function NotificationsSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#f9fafb',
          marginBottom: '6px',
        }}>
          Notifications
        </h2>
        <p style={{
          fontSize: '12px',
          color: '#9ca3af',
        }}>
          Manage your reminders and alerts
        </p>
      </div>

      <SettingCard title="Daily Reminders">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ToggleOption 
            label="Morning check-in" 
            description="Remind me to log my morning mood"
            defaultChecked 
          />
          <ToggleOption 
            label="Evening reflection" 
            description="Prompt for end-of-day journaling"
            defaultChecked 
          />
          <ToggleOption 
            label="Goal reminders" 
            description="Nudge me about pending goals"
          />
        </div>
      </SettingCard>

      <SettingCard title="Streak Notifications">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ToggleOption 
            label="Streak milestones" 
            description="Celebrate when you hit streaks"
            defaultChecked 
          />
          <ToggleOption 
            label="Streak at risk" 
            description="Alert when about to break a streak"
            defaultChecked 
          />
        </div>
      </SettingCard>
    </div>
  )
}

// Data Section
function DataSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#f9fafb',
          marginBottom: '6px',
        }}>
          Data & Privacy
        </h2>
        <p style={{
          fontSize: '12px',
          color: '#9ca3af',
        }}>
          Manage your data and privacy settings
        </p>
      </div>

      <SettingCard title="Export Data">
        <button style={{
          padding: '12px 24px',
          background: 'rgba(219, 39, 119, 0.2)',
          border: '1px solid rgba(219, 39, 119, 0.4)',
          color: '#f9a8d4',
          fontSize: '13px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}>
          Download All Data (JSON)
        </button>
        <p style={{ fontSize: '10px', color: '#6b7280', marginTop: '6px' }}>
          Export all your entries, moods, and goals
        </p>
      </SettingCard>

      <SettingCard title="Data Retention">
        <select style={{
          padding: '12px 14px',
          background: 'rgba(219, 39, 119, 0.12)',
          border: '1px solid rgba(219, 39, 119, 0.3)',
          color: '#f9fafb',
          fontSize: '13px',
          width: '100%',
          fontFamily: 'var(--font-family-satoshi)',
          outline: 'none',
          cursor: 'pointer',
        }}>
          <option>Keep all data</option>
          <option>Delete after 1 year</option>
          <option>Delete after 2 years</option>
        </select>
      </SettingCard>

      <SettingCard title="Danger Zone">
        <button style={{
          padding: '12px 24px',
          background: 'rgba(239, 68, 68, 0.2)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          color: '#fca5a5',
          fontSize: '13px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}>
          Delete All Data
        </button>
        <p style={{ fontSize: '10px', color: '#6b7280', marginTop: '6px' }}>
          Permanently delete all your data. This cannot be undone.
        </p>
      </SettingCard>
    </div>
  )
}

// About Section
function AboutSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#f9fafb',
          marginBottom: '6px',
        }}>
          About Pulse
        </h2>
        <p style={{
          fontSize: '12px',
          color: '#9ca3af',
        }}>
          App information and support
        </p>
      </div>

      <SettingCard title="Version">
        <p style={{ fontSize: '14px', color: '#f9fafb' }}>1.0.0</p>
      </SettingCard>

      <SettingCard title="Links">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <a href="#" style={{ color: '#f9a8d4', fontSize: '14px', textDecoration: 'none' }}>Documentation</a>
          <a href="#" style={{ color: '#f9a8d4', fontSize: '14px', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="#" style={{ color: '#f9a8d4', fontSize: '14px', textDecoration: 'none' }}>Terms of Service</a>
          <a href="#" style={{ color: '#f9a8d4', fontSize: '14px', textDecoration: 'none' }}>Support</a>
        </div>
      </SettingCard>
    </div>
  )
}

// Helper Components
function SettingCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      padding: '16px',
      background: 'rgba(219, 39, 119, 0.12)',
      border: '1px solid rgba(219, 39, 119, 0.3)',
    }}>
      <label style={{
        display: 'block',
        fontSize: '12px',
        fontWeight: '600',
        color: '#f9fafb',
        marginBottom: '10px',
      }}>
        {title}
      </label>
      {children}
    </div>
  )
}

function ToggleOption({ label, description, defaultChecked }: { 
  label: string; 
  description: string; 
  defaultChecked?: boolean 
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div>
        <p style={{ fontSize: '13px', color: '#f9fafb', marginBottom: '3px' }}>
          {label}
        </p>
        <p style={{ fontSize: '11px', color: '#6b7280' }}>
          {description}
        </p>
      </div>
      <label style={{
        position: 'relative',
        display: 'inline-block',
        width: '38px',
        height: '20px',
        cursor: 'pointer',
      }}>
        <input
          type="checkbox"
          defaultChecked={defaultChecked}
          style={{ display: 'none' }}
        />
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
            height: '14px',
            width: '14px',
            left: defaultChecked ? '21px' : '3px',
            bottom: '3px',
            background: '#ffffff',
            transition: '0.3s',
          }} />
        </span>
      </label>
    </div>
  )
}
