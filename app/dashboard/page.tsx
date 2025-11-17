'use client'

import DashboardLayout from '../components/layouts/DashboardLayout';
import QuickGoalsWidget from '../components/quick-goals-widget/quick-goals-widget';
import Insights from '../components/insights/Insights';
import QuickActions from '../components/quick-actions/QuickActions';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '../contexts/ToastContext';
import { useContextualUI } from '@/lib/hooks/useContextualUI';
import { PageTransition } from '../components/transitions/PageTransition';
import { Skeleton } from '../components/ui';

export default function Dashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const contextualUI = useContextualUI();
  const [lastVisit, setLastVisit] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'today' | 'week'>('today');
  interface JournalEntry {
    id: string;
    transcript: string;
    created_at: string;
    [key: string]: unknown;
  }
  
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch journal entries
  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase journal_entries error:', error);
        throw new Error(error.message || 'Unable to fetch journal entries');
      }
      setEntries((data as JournalEntry[]) || []);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch entries. Please try again.';
      console.error('Failed to fetch entries:', err);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const getStats = () => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
    weekStart.setHours(0, 0, 0, 0);

    const todayEntries = entries.filter(entry => 
      new Date(entry.created_at) >= todayStart
    );

    const weekEntries = entries.filter(entry => 
      new Date(entry.created_at) >= weekStart
    );

    // Calculate streak (consecutive days with at least one entry)
    let streak = 0;
    let checkDate = new Date(todayStart);
    
    while (streak < 365) { // Max check 1 year
      const dayEntries = entries.filter(entry => {
        const entryDate = new Date(entry.created_at);
        return entryDate.getFullYear() === checkDate.getFullYear() &&
               entryDate.getMonth() === checkDate.getMonth() &&
               entryDate.getDate() === checkDate.getDate();
      });
      
      if (dayEntries.length === 0) break;
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    return {
      todayCount: todayEntries.length,
      weekCount: weekEntries.length,
      totalCount: entries.length,
      streak,
      todayEntries,
      weekEntries
    };
  };

  // Get hourly breakdown for today
  const getTodayHourlyData = () => {
    const stats = getStats();
    const hourCounts: { [key: number]: number } = {};
    
    // Initialize hours
    for (let i = 0; i < 24; i++) {
      hourCounts[i] = 0;
    }
    
    // Count entries per hour
    stats.todayEntries.forEach(entry => {
      const hour = new Date(entry.created_at).getHours();
      hourCounts[hour]++;
    });
    
    return hourCounts;
  };

  // Get daily breakdown for this week
  const getWeeklyData = () => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayCounts = days.map((day, index) => {
      const dayDate = new Date(weekStart);
      dayDate.setDate(weekStart.getDate() + index);
      
      const count = entries.filter(entry => {
        const entryDate = new Date(entry.created_at);
        return entryDate.getFullYear() === dayDate.getFullYear() &&
               entryDate.getMonth() === dayDate.getMonth() &&
               entryDate.getDate() === dayDate.getDate();
      }).length;
      
      return { day, count, isToday: index === now.getDay() };
    });
    
    return dayCounts;
  };
  
  // Get user's first name from Google metadata, fallback to email username
  const getFirstName = () => {
    if (user?.user_metadata?.given_name) {
      return user.user_metadata.given_name;
    }
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ')[0];
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'there';
  };

  // Use contextual UI greeting
  const greeting = contextualUI.greeting;

  // Daily message that changes every 24 hours (business day basis)
  const getDailyMessage = () => {
    const today = new Date();
    // Use date string as seed for consistent message per day
    const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
    
    const messages = [
      { text: 'Ready to make today count?', color: '#FB923C' },
      { text: 'What will you create today?', color: '#EA580C' },
      { text: 'Let\'s build on yesterday\'s momentum', color: '#F97316' },
      { text: 'Another chance to grow', color: '#C2410C' },
      { text: 'What\'s calling your attention today?', color: '#FB923C' }
    ];
    
    // Use modulo to cycle through messages based on day
    return messages[daysSinceEpoch % messages.length];
  };

  // Track visit
  useEffect(() => {
    const storedLastVisit = localStorage.getItem('lastVisit');
    setLastVisit(storedLastVisit);
    localStorage.setItem('lastVisit', new Date().toISOString());
  }, []);

  const firstName = getFirstName();
  const dailyMessage = getDailyMessage();

  return (
    <DashboardLayout isLoading={loading}>
      {/* Main Feature Card with Toggle and Graph */}
      <div className="mt-8 rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, var(--surface) 0%, var(--surface-elevated) 100%)',
          width: '100%',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-md)'
        }}
      >
          {/* Main Content Area */}
          <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Section */}
            <div className="flex flex-col justify-between">
              <div>
                <h2 style={{
                  color: 'var(--text-primary)',
                  fontSize: 'var(--font-size-h2)',
                  fontWeight: 'var(--font-weight-semibold)',
                  lineHeight: 'var(--line-height-tight)',
                  marginBottom: 'var(--spacing-sm)',
                  fontFamily: 'var(--font-family-satoshi)'
                }}>
                  {contextualUI.greeting}, {firstName}
                </h2>
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: 'var(--font-size-small)',
                  lineHeight: 'var(--line-height-relaxed)',
                  fontFamily: 'var(--font-family-switzer)',
                  transition: 'color var(--animation-timing-smooth) var(--animation-easing-easeOut)',
                  marginBottom: 'var(--spacing-md)'
                }}>
                  {dailyMessage.text}
                </p>
                {getStats().totalCount === 0 && (
                  <p style={{
                    color: 'var(--text-tertiary)',
                    fontSize: 'var(--font-size-small)',
                    fontFamily: 'var(--font-family-switzer)',
                    fontStyle: 'italic',
                    marginTop: 'var(--spacing-sm)'
                  }}>
                    Start your wellness journey with your first journal entry
                  </p>
                )}
              </div>

              {/* Toggle Bar - Bottom Left */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveView('today')}
                  style={{
                    padding: 'var(--spacing-sm) var(--spacing-xl)',
                    background: activeView === 'today' ? 'var(--accent-primary)' : 'transparent',
                    color: activeView === 'today' ? 'var(--brand-white)' : 'var(--text-secondary)',
                    border: activeView === 'today' ? 'var(--border-width-medium) solid var(--accent-primary)' : 'var(--border-width-thin) solid var(--border-subtle)',
                    borderRadius: 'var(--border-radius-sm)',
                    fontFamily: 'var(--font-family-satoshi)',
                    fontWeight: activeView === 'today' ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
                    fontSize: 'var(--font-size-small)',
                    cursor: 'pointer',
                    transition: 'all var(--animation-timing-smooth) var(--animation-easing-easeOut)'
                  }}
                >
                  Today
                </button>
                <button
                  onClick={() => setActiveView('week')}
                  style={{
                    padding: 'var(--spacing-sm) var(--spacing-xl)',
                    background: activeView === 'week' ? 'var(--accent-primary)' : 'transparent',
                    color: activeView === 'week' ? 'var(--brand-white)' : 'var(--text-secondary)',
                    border: activeView === 'week' ? 'var(--border-width-medium) solid var(--accent-primary)' : 'var(--border-width-thin) solid var(--border-subtle)',
                    borderRadius: 'var(--border-radius-sm)',
                    fontFamily: 'var(--font-family-satoshi)',
                    fontWeight: activeView === 'week' ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
                    fontSize: 'var(--font-size-small)',
                    cursor: 'pointer',
                    transition: 'all var(--animation-timing-smooth) var(--animation-easing-easeOut)'
                  }}
                >
                  This Week
                </button>
              </div>
            </div>

            {/* Right Section - Progress Stats */}
            <div className="flex flex-col justify-center" style={{
              minHeight: '240px',
              padding: 'var(--spacing-lg)'
            }}>
              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                  <Skeleton height="24px" width="60%" rounded />
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-lg)' }}>
                    <Skeleton height="80px" rounded />
                    <Skeleton height="80px" rounded />
                  </div>
                  <Skeleton height="120px" rounded />
                </div>
              ) : (
                <>
                  {activeView === 'today' ? (
                    <div>
                      <h3 style={{
                        color: 'var(--text-primary)',
                        fontSize: 'var(--font-size-h4)',
                        fontWeight: 'var(--font-weight-medium)',
                        marginBottom: 'var(--spacing-xl)',
                        fontFamily: 'var(--font-family-satoshi)'
                      }}>
                        Today's Activity
                      </h3>
                      
                      {/* Stats Grid */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '16px',
                        marginBottom: '24px'
                      }}>
                        <div>
                          <div style={{
                            fontSize: '36px',
                            fontWeight: 600,
                            color: 'var(--accent-primary)',
                            fontFamily: 'var(--font-family-satoshi)',
                            lineHeight: '1'
                          }}>
                            {getStats().todayCount}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: '#A1937F',
                            marginTop: '6px',
                            fontFamily: 'var(--font-family-switzer)'
                          }}>
                            Entries Today
                          </div>
                        </div>
                        
                        <div>
                          <div style={{
                            fontSize: '36px',
                            fontWeight: 600,
                            color: 'var(--text-secondary)',
                            fontFamily: 'var(--font-family-satoshi)',
                            lineHeight: '1'
                          }}>
                            {getStats().streak}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: '#A1937F',
                            marginTop: '6px',
                            fontFamily: 'var(--font-family-switzer)'
                          }}>
                            Day Streak
                          </div>
                        </div>
                      </div>
                      
                      {/* Hourly Activity Chart */}
                      {getStats().todayCount > 0 && (
                        <div style={{ marginTop: '20px' }}>
                          <div style={{
                            fontSize: '12px',
                            color: '#A1937F',
                            marginBottom: '10px',
                            fontFamily: 'var(--font-family-switzer)'
                          }}>
                            Activity Timeline
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            gap: '3px',
                            height: '60px'
                          }}>
                            {Object.entries(getTodayHourlyData())
                              .filter(([_, count]) => count > 0)
                              .map(([hour, count]) => {
                                const maxCount = Math.max(...Object.values(getTodayHourlyData()));
                                const height = (count / maxCount) * 100;
                                return (
                                  <div
                                    key={hour}
                                    style={{
                                      flex: 1,
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                      gap: '3px'
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: '100%',
                                        height: `${height}%`,
                                        background: '#FB923C',
                                        borderRadius: '3px 3px 0 0',
                                        transition: 'all 0.3s ease'
                                      }}
                                      title={`${count} ${count === 1 ? 'entry' : 'entries'} at ${hour}:00`}
                                    />
                                    <span style={{
                                      fontSize: '9px',
                                      color: '#A1937F',
                                      fontFamily: 'var(--font-family-satoshi)'
                                    }}>
                                      {hour}h
                                    </span>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      )}
                      
                      {/* Progress Message */}
                      <div style={{
                        padding: '12px',
                        background: 'rgba(158, 244, 208, 0.1)',
                        borderRadius: '8px',
                        border: '1px solid rgba(158, 244, 208, 0.2)',
                        marginTop: '20px'
                      }}>
                        <p style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontFamily: 'var(--font-family-switzer)',
                          lineHeight: '1.6'
                        }}>
                          {getStats().todayCount === 0 
                            ? 'Start your day with a reflection' 
                            : getStats().todayCount === 1 
                            ? 'Great start! Keep the momentum going' 
                            : `${getStats().todayCount} entries today - you're on fire!`}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 style={{
                        color: 'var(--text-primary)',
                        fontSize: 'var(--font-size-h4)',
                        fontWeight: 'var(--font-weight-medium)',
                        marginBottom: '20px',
                        fontFamily: 'var(--font-family-satoshi)'
                      }}>
                        This Week's Progress
                      </h3>
                      
                      {/* Stats Grid */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '16px',
                        marginBottom: '24px'
                      }}>
                        <div>
                          <div style={{
                            fontSize: '36px',
                            fontWeight: 600,
                            color: 'var(--accent-primary)',
                            fontFamily: 'var(--font-family-satoshi)',
                            lineHeight: '1'
                          }}>
                            {getStats().weekCount}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: '#A1937F',
                            marginTop: '6px',
                            fontFamily: 'var(--font-family-switzer)'
                          }}>
                            Entries This Week
                          </div>
                        </div>
                        
                        <div>
                          <div style={{
                            fontSize: '36px',
                            fontWeight: 600,
                            color: '#F97316',
                            fontFamily: 'var(--font-family-satoshi)',
                            lineHeight: '1'
                          }}>
                            {getStats().totalCount}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: '#A1937F',
                            marginTop: '6px',
                            fontFamily: 'var(--font-family-switzer)'
                          }}>
                            Total Entries
                          </div>
                        </div>
                      </div>
                      
                      {/* Weekly Bar Chart */}
                      <div style={{ marginTop: '20px' }}>
                        <div style={{
                          fontSize: '12px',
                          color: '#A1937F',
                          marginBottom: '10px',
                          fontFamily: 'var(--font-family-switzer)'
                        }}>
                          Daily Breakdown
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'flex-end',
                          gap: '6px',
                          height: '80px'
                        }}>
                          {getWeeklyData().map(({ day, count, isToday }) => {
                            const maxCount = Math.max(...getWeeklyData().map(d => d.count), 1);
                            const height = count > 0 ? (count / maxCount) * 100 : 5;
                            return (
                              <div
                                key={day}
                                style={{
                                  flex: 1,
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}
                              >
                                <div
                                  style={{
                                    width: '100%',
                                    height: `${height}%`,
                                    background: isToday ? '#F97316' : count > 0 ? '#FB923C' : '#2D1F14',
                                    borderRadius: '3px 3px 0 0',
                                    transition: 'all 0.3s ease',
                                    border: isToday ? '2px solid #F97316' : '1px solid #3A2E24'
                                  }}
                                  title={`${day}: ${count} ${count === 1 ? 'entry' : 'entries'}`}
                                />
                                <span style={{
                                  fontSize: '10px',
                                  color: isToday ? '#F97316' : '#A1937F',
                                  fontFamily: 'var(--font-family-satoshi)',
                                  fontWeight: isToday ? 600 : 400
                                }}>
                                  {day}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* Progress Message */}
                      <div style={{
                        padding: '12px',
                        background: 'rgba(158, 244, 208, 0.1)',
                        borderRadius: '8px',
                        border: '1px solid rgba(158, 244, 208, 0.2)',
                        marginTop: '20px'
                      }}>
                        <p style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontFamily: 'var(--font-family-switzer)',
                          lineHeight: '1.6'
                        }}>
                          {getStats().weekCount === 0 
                            ? 'Start building your weekly habit' 
                            : getStats().weekCount < 7 
                            ? `${getStats().weekCount} entries this week - keep going!` 
                            : 'Amazing consistency this week!'}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <QuickActions />
      </div>

      {/* Insights */}
      {user && (
        <div className="mt-8">
          <Insights userId={user.id} />
        </div>
      )}

      {/* Quick Goals Widget */}
      <div className="mt-8">
        <QuickGoalsWidget />
      </div>
    </DashboardLayout>
  );
}
