'use client'

import { Settings, Bell, User, LogOut } from 'lucide-react';
import { 
  House, 
  Note, 
  BookOpen, 
  Target, 
  ChartLine, 
  Trophy, 
  CheckCircle, 
  Lightbulb, 
  TrendUp 
} from '@phosphor-icons/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface DashboardNavbarProps {
  isLoading?: boolean;
}

export default function DashboardNavbar({ isLoading = false }: DashboardNavbarProps) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user } = useAuth();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: House },
    { label: 'Notes', href: '/dashboard/notes', icon: Note },
    { label: 'Journal', href: '/dashboard/journal', icon: BookOpen },
    { label: 'Goals', href: '/dashboard/goals', icon: Target },
    { label: 'Analytics', href: '/dashboard/analytics', icon: ChartLine },
    { label: 'Achievements', href: '/dashboard/achievements', icon: Trophy },
    { label: 'Habits', href: '/dashboard/habits', icon: CheckCircle },
    { label: 'Reflections', href: '/dashboard/reflections', icon: Lightbulb },
    { label: 'Progress', href: '/dashboard/progress', icon: TrendUp },
  ];
 
  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = prefersDark ? 'dark' : 'light';
      setTheme(initialTheme);
      document.documentElement.setAttribute('data-theme', initialTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="flex items-center justify-between py-2">
      {/* Logo and Navigation Menu - Left Side */}
      <div className="flex items-center gap-8">
        {/* Logo */}
        <div style={{
          width: '28px',
          height: '28px',
          position: 'relative',
          flexShrink: 0,
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            width: '12px',
            height: '12px',
            background: 'linear-gradient(135deg, #ff7a3d, #ff6b35)',
            borderRadius: '2px',
            boxShadow: '0 1px 4px rgba(255, 107, 53, 0.3)',
            animation: isLoading ? 'chaseSquare1 3s cubic-bezier(0.4, 0, 0.2, 1) infinite' : 'none',
            top: isLoading ? undefined : '0px',
            left: isLoading ? undefined : '16px',
            transition: isLoading ? 'none' : 'all 0.3s ease'
          }} />
          <div style={{
            position: 'absolute',
            width: '12px',
            height: '12px',
            background: 'linear-gradient(135deg, #ff6b35, #e55d37)',
            borderRadius: '2px',
            boxShadow: '0 1px 4px rgba(255, 107, 53, 0.3)',
            animation: isLoading ? 'chaseSquare2 3s cubic-bezier(0.4, 0, 0.2, 1) infinite' : 'none',
            top: isLoading ? undefined : '16px',
            left: isLoading ? undefined : '0px',
            transition: isLoading ? 'none' : 'all 0.3s ease'
          }} />
        </div>
        <style jsx>{`
          @keyframes chaseSquare1 {
            0% { 
              top: 0px; 
              left: 16px; 
            }
            25% { 
              top: 16px; 
              left: 16px; 
            }
            50% { 
              top: 16px; 
              left: 0px; 
            }
            75% { 
              top: 0px; 
              left: 0px; 
            }
            100% { 
              top: 0px; 
              left: 16px; 
            }
          }
          @keyframes chaseSquare2 {
            0% { 
              top: 16px; 
              left: 0px; 
            }
            25% { 
              top: 0px; 
              left: 0px; 
            }
            50% { 
              top: 0px; 
              left: 16px; 
            }
            75% { 
              top: 16px; 
              left: 16px; 
            }
            100% { 
              top: 16px; 
              left: 0px; 
            }
          }
        `}</style>

        {/* Navigation Menu */}
        <nav className="flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm"
                style={{ 
                  fontFamily: 'var(--font-family-satoshi)',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: 500,
                  backgroundColor: isActive ? 'var(--accent-primary)' : 'transparent',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
                    e.currentTarget.style.color = '#ffffff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                <Icon size={18} weight={isActive ? 'fill' : 'regular'} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Right Button */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-md transition-all"
          style={{ 
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? (
            // Moon icon for dark mode
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          ) : (
            // Sun icon for light mode
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          )}
        </button>

        <button 
          className="px-6 py-2.5 rounded-md transition-all text-sm font-semibold flex items-center gap-2"
          style={{ 
            fontFamily: 'var(--font-family-satoshi)',
            backgroundColor: 'var(--accent-primary)',
            color: '#ffffff'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-primary-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-primary)'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          Schedule
        </button>

        {/* Profile Icon with Dropdown */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-primary-hover) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: 600,
              fontFamily: 'var(--font-family-satoshi)',
              cursor: 'pointer',
              border: '2px solid var(--border-subtle)',
              transition: 'all 0.3s ease'
            }}
            title={user?.email || 'Profile'}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.borderColor = 'var(--accent-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
            }}
          >
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <>
              {/* Backdrop */}
              <div
                onClick={() => setShowProfileMenu(false)}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 999
                }}
              />

              {/* Dropdown */}
              <div
                style={{
                  position: 'absolute',
                  top: '52px',
                  right: '0',
                  width: '260px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                  zIndex: 1000,
                  overflow: 'hidden',
                  animation: 'slideDown 0.2s ease-out'
                }}
              >
                {/* User Info Header */}
                <div
                  style={{
                    padding: '20px 16px',
                    borderBottom: '1px solid var(--border-subtle)',
                    background: 'var(--background)'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-primary-hover) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                        fontSize: '16px',
                        fontWeight: 600,
                        fontFamily: 'var(--font-family-satoshi)',
                        flexShrink: 0
                      }}
                    >
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div
                        style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: 'var(--text-primary)',
                          fontFamily: 'var(--font-family-satoshi)',
                          marginBottom: '2px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {user?.user_metadata?.username || user?.email?.split('@')[0] || 'User'}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'var(--text-secondary)',
                          fontFamily: 'var(--font-family-satoshi)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {user?.email || 'user@example.com'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div style={{ padding: '8px' }}>
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setShowProfileMenu(false)}
                    style={{
                      display: 'block',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-family-satoshi)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--background)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    View profile
                  </Link>

                  <Link
                    href="/dashboard/shortcuts"
                    onClick={() => setShowProfileMenu(false)}
                    style={{
                      display: 'block',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-family-satoshi)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--background)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    Shortcuts
                  </Link>

                  <button
                    onClick={toggleTheme}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-family-satoshi)',
                      background: 'transparent',
                      border: 'none',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--background)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    Switch to {theme === 'light' ? 'dark' : 'light'} mode
                  </button>

                  <button
                    onClick={async () => {
                      await supabase.auth.signOut()
                      setShowProfileMenu(false)
                      window.location.href = '/onboarding'
                    }}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-family-satoshi)',
                      background: 'transparent',
                      border: 'none',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--background)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    Logout
                  </button>

                  {/* Divider */}
                  <div style={{
                    height: '1px',
                    background: 'var(--border-subtle)',
                    margin: '8px 0'
                  }} />

                  <Link
                    href="/report-bug"
                    onClick={() => setShowProfileMenu(false)}
                    style={{
                      display: 'block',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-family-satoshi)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--background)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    Report a bug
                  </Link>

                  <Link
                    href="/request-feature"
                    onClick={() => setShowProfileMenu(false)}
                    style={{
                      display: 'block',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-family-satoshi)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--background)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    Request a feature
                  </Link>

                  <Link
                    href="/contact"
                    onClick={() => setShowProfileMenu(false)}
                    style={{
                      display: 'block',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-family-satoshi)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--background)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    Contact us
                  </Link>
                </div>
              </div>

              <style jsx>{`
                @keyframes slideDown {
                  from {
                    opacity: 0;
                    transform: translateY(-8px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
              `}</style>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
