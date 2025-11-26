'use client'

import { Settings, Bell, User, LogOut } from 'lucide-react';
import { 
  House, 
  Note, 
  BookOpen, 
  Target, 
  ChartLine,
  ChartLineUp, 
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
  const [goalsCount, setGoalsCount] = useState(0);
  const [habitsCount, setHabitsCount] = useState(0);
  const [goalsLimit] = useState(20); // Free plan limit
  const [habitsLimit] = useState(3); // Free plan limit (packs)
  const { user } = useAuth();
  
  // Mock user for design preview
  const displayUser = user || { email: 'user@example.com' };

  const navItems = [
    { label: 'Home', href: '/dashboard', icon: House },
    { label: 'Insights', href: '/dashboard/analytics', icon: ChartLine },
    { label: 'Journal', href: '/dashboard/journal', icon: BookOpen },
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

  // Fetch user goals and habits count
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;

      try {
        // Fetch active goals count
        const { count: goalsTotal, error: goalsError } = await supabase
          .from('goals')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'active');

        if (goalsError) {
          console.error('Error fetching goals:', goalsError);
        } else {
          setGoalsCount(goalsTotal || 0);
        }

        // Fetch habits count
        const { count: habitsTotal, error: habitsError } = await supabase
          .from('habits')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        if (habitsError) {
          console.error('Error fetching habits:', habitsError);
        } else {
          setHabitsCount(habitsTotal || 0);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [user]);

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
            background: 'linear-gradient(135deg, #0f3d3c, #1f5c57)',
            borderRadius: '2px',
            boxShadow: '0 1px 4px rgba(15, 61, 60, 0.25)',
            animation: isLoading ? 'chaseSquare1 3s cubic-bezier(0.4, 0, 0.2, 1) infinite' : 'none',
            top: isLoading ? undefined : '0px',
            left: isLoading ? undefined : '16px',
            transition: isLoading ? 'none' : 'all 0.3s ease'
          }} />
          <div style={{
            position: 'absolute',
            width: '12px',
            height: '12px',
            background: 'linear-gradient(135deg, #1f5c57, #2a736d)',
            borderRadius: '2px',
            boxShadow: '0 1px 4px rgba(15, 61, 60, 0.2)',
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
                  color: isActive ? '#fefbf3' : 'var(--text-primary)',
                  fontWeight: 500,
                  backgroundColor: isActive ? '#0f3d3c' : 'transparent',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
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
        <button 
          className="px-6 py-2.5 rounded-md transition-all text-sm font-semibold flex items-center gap-2"
          style={{ 
            fontFamily: 'var(--font-family-satoshi)',
            backgroundColor: '#0f3d3c',
            color: '#fefbf3'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          Schedule
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-md transition-all"
          style={{ 
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)'
          }}
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

        {/* Profile Icon with Dropdown */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0f3d3c 0%, #1f5c57 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fefbf3',
              fontSize: '16px',
              fontWeight: 600,
              fontFamily: 'var(--font-family-satoshi)',
              cursor: 'pointer',
              border: '2px solid var(--border-subtle)',
              transition: 'all 0.3s ease'
            }}
            title={displayUser?.email || 'Profile'}
          >
            {displayUser?.email?.charAt(0).toUpperCase() || 'U'}
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
                  zIndex: 999,
                  background: 'transparent'
                }}
              />

              {/* Dropdown */}
              <div
                style={{
                  position: 'absolute',
                  top: '52px',
                  right: '0',
                  width: '320px',
                  background: '#1a1d24',
                  border: '1px solid #2a2e38',
                  borderRadius: '0',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.24)',
                  zIndex: 1000,
                  overflow: 'hidden'
                }}
              >
                {/* Menu Items */}
                <div style={{ padding: '16px 0' }}>
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setShowProfileMenu(false)}
                    style={{
                      display: 'block',
                      padding: '12px 24px',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#f9fafb',
                      fontFamily: 'var(--font-family-satoshi)',
                      background: 'transparent'
                    }}
                  >
                    View profile
                  </Link>

                  <Link
                    href="/dashboard/shortcuts"
                    onClick={() => setShowProfileMenu(false)}
                    style={{
                      display: 'block',
                      padding: '12px 24px',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#f9fafb',
                      fontFamily: 'var(--font-family-satoshi)',
                      background: 'transparent'
                    }}
                  >
                    Shortcuts
                  </Link>

                  <button
                    onClick={toggleTheme}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '12px 24px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#f9fafb',
                      fontFamily: 'var(--font-family-satoshi)',
                      background: 'transparent',
                      border: 'none',
                      textAlign: 'left'
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
                      padding: '12px 24px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#f9fafb',
                      fontFamily: 'var(--font-family-satoshi)',
                      background: 'transparent',
                      border: 'none',
                      textAlign: 'left'
                    }}
                  >
                    Logout
                  </button>

                  {/* Divider */}
                  <div style={{
                    height: '1px',
                    background: '#2a2e38',
                    margin: '12px 0'
                  }} />

                  <Link
                    href="/report-bug"
                    onClick={() => setShowProfileMenu(false)}
                    style={{
                      display: 'block',
                      padding: '12px 24px',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#f9fafb',
                      fontFamily: 'var(--font-family-satoshi)',
                      background: 'transparent'
                    }}
                  >
                    Report a bug
                  </Link>

                  <Link
                    href="/request-feature"
                    onClick={() => setShowProfileMenu(false)}
                    style={{
                      display: 'block',
                      padding: '12px 24px',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#f9fafb',
                      fontFamily: 'var(--font-family-satoshi)',
                      background: 'transparent'
                    }}
                  >
                    Request a feature
                  </Link>

                  <Link
                    href="/contact"
                    onClick={() => setShowProfileMenu(false)}
                    style={{
                      display: 'block',
                      padding: '12px 24px',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#f9fafb',
                      fontFamily: 'var(--font-family-satoshi)',
                      background: 'transparent'
                    }}
                  >
                    Contact us
                  </Link>

                  {/* Divider */}
                  <div style={{
                    height: '1px',
                    background: '#2a2e38',
                    margin: '12px 0'
                  }} />

                  {/* Free plan limits */}
                  <div style={{ padding: '12px 24px' }}>
                    <div style={{ 
                      marginBottom: '12px', 
                      fontWeight: 600,
                      fontSize: '13px',
                      color: '#9ca3af',
                      fontFamily: 'var(--font-family-satoshi)'
                    }}>Free plan limits</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px', color: '#6b7280' }}>
                      <span>{goalsCount}/{goalsLimit}</span><span style={{ fontWeight: 600, letterSpacing: '0.5px' }}>TRACKS</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px', color: '#6b7280' }}>
                      <span>{habitsCount}/{habitsLimit}</span><span style={{ fontWeight: 600, letterSpacing: '0.5px' }}>PACKS</span>
                    </div>
                    <div style={{ 
                      width: '100%', 
                      height: '6px', 
                      background: '#2a2e38',
                      marginBottom: '14px'
                    }}>
                      <div style={{ 
                        width: `${Math.min((goalsCount / goalsLimit) * 100, 100)}%`, 
                        height: '100%', 
                        background: 'linear-gradient(135deg, #db2777 0%, #f472b6 100%)'
                      }} />
                    </div>
                    <button style={{ 
                      width: '100%', 
                      padding: '10px 0', 
                      background: 'rgba(219, 39, 119, 0.12)', 
                      border: '1px solid rgba(219, 39, 119, 0.3)', 
                      color: '#f9a8d4', 
                      fontWeight: 600, 
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontFamily: 'var(--font-family-satoshi)',
                      transition: 'all 0.2s ease'
                    }}>Upgrade to Pro</button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
