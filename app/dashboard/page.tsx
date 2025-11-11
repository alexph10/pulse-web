'use client'

import DashboardLayout from '../components/layouts/DashboardLayout';
import QuickGoalsWidget from '../components/quick-goals-widget/quick-goals-widget';
import { BadgeShowcase } from '../components/badges/BadgeShowcase';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const { user } = useAuth();
  const [lastVisit, setLastVisit] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'today' | 'week'>('today');
  const [entries, setEntries] = useState<any[]>([]);
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

      if (error) throw error;
      setEntries(data || []);
    } catch (err: any) {
      console.error('Error fetching entries:', err);
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

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    if (hour < 22) return 'Good evening';
    return 'Still up';
  };

  // Daily message that changes every 24 hours (business day basis)
  const getDailyMessage = () => {
    const today = new Date();
    // Use date string as seed for consistent message per day
    const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
    
    const messages = [
      { text: 'Ready to make today count?', color: '#9EF4D0' },
      { text: 'What will you create today?', color: '#B8A8D8' },
      { text: 'Let\'s build on yesterday\'s momentum', color: '#E091C5' },
      { text: 'Another chance to grow', color: '#9EF4D0' },
      { text: 'What\'s calling your attention today?', color: '#B8A8D8' }
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
  const greeting = getGreeting();
  const dailyMessage = getDailyMessage();

  return (
    <DashboardLayout isLoading={loading}>
      {/* Main Feature Card with Toggle and Graph */}
      <div className="mt-8 rounded-2xl overflow-hidden"
        style={{
          background: '#3D4A47',
          width: '100%'
        }}
      >
          {/* Main Content Area */}
          <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Section */}
            <div className="flex flex-col justify-between">
              <div>
                <h2 style={{
                  color: '#9EF4D0',
                  fontSize: '36px',
                  fontWeight: 500,
                  lineHeight: '1.2',
                  marginBottom: '8px',
                  fontFamily: 'var(--font-family-satoshi)'
                }}>
                  {greeting}, {firstName}
                </h2>
                <p style={{
                  color: dailyMessage.color,
                  fontSize: '15px',
                  lineHeight: '1.6',
                  fontFamily: 'var(--font-family-switzer)',
                  transition: 'color 0.3s ease'
                }}>
                  {dailyMessage.text}
                </p>
              </div>

              {/* Toggle Bar - Bottom Left */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveView('today')}
                  style={{
                    padding: '8px 18px',
                    background: activeView === 'today' ? '#9EF4D0' : 'transparent',
                    color: activeView === 'today' ? '#2D3A37' : 'rgba(255, 255, 255, 0.6)',
                    border: activeView === 'today' ? '2px dashed #2D3A37' : '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '6px',
                    fontFamily: 'var(--font-family-satoshi)',
                    fontWeight: activeView === 'today' ? 600 : 500,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Today
                </button>
                <button
                  onClick={() => setActiveView('week')}
                  style={{
                    padding: '8px 18px',
                    background: activeView === 'week' ? '#9EF4D0' : 'transparent',
                    color: activeView === 'week' ? '#2D3A37' : 'rgba(255, 255, 255, 0.6)',
                    border: activeView === 'week' ? '2px dashed #2D3A37' : '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '6px',
                    fontFamily: 'var(--font-family-satoshi)',
                    fontWeight: activeView === 'week' ? 600 : 500,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  This Week
                </button>
              </div>
            </div>

            {/* Right Section - Progress Stats */}
            <div className="flex flex-col justify-center" style={{
              minHeight: '240px',
              padding: '16px'
            }}>
              {loading ? (
                <div style={{
                  color: 'rgba(255, 255, 255, 0.3)',
                  fontFamily: 'var(--font-family-satoshi)',
                  fontSize: '14px',
                  textAlign: 'center'
                }}>
                  Loading...
                </div>
              ) : (
                <>
                  {activeView === 'today' ? (
                    <div>
                      <h3 style={{
                        color: '#9EF4D0',
                        fontSize: '20px',
                        fontWeight: 500,
                        marginBottom: '20px',
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
                            color: '#9EF4D0',
                            fontFamily: 'var(--font-family-satoshi)',
                            lineHeight: '1'
                          }}>
                            {getStats().todayCount}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.6)',
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
                            color: '#B8A8D8',
                            fontFamily: 'var(--font-family-satoshi)',
                            lineHeight: '1'
                          }}>
                            {getStats().streak}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.6)',
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
                            color: 'rgba(255, 255, 255, 0.6)',
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
                                        background: '#9EF4D0',
                                        borderRadius: '3px 3px 0 0',
                                        transition: 'all 0.3s ease'
                                      }}
                                      title={`${count} ${count === 1 ? 'entry' : 'entries'} at ${hour}:00`}
                                    />
                                    <span style={{
                                      fontSize: '9px',
                                      color: 'rgba(255, 255, 255, 0.5)',
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
                        color: '#9EF4D0',
                        fontSize: '20px',
                        fontWeight: 500,
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
                            color: '#9EF4D0',
                            fontFamily: 'var(--font-family-satoshi)',
                            lineHeight: '1'
                          }}>
                            {getStats().weekCount}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.6)',
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
                            color: '#E091C5',
                            fontFamily: 'var(--font-family-satoshi)',
                            lineHeight: '1'
                          }}>
                            {getStats().totalCount}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.6)',
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
                          color: 'rgba(255, 255, 255, 0.6)',
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
                                    background: isToday ? '#E091C5' : count > 0 ? '#9EF4D0' : 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: '3px 3px 0 0',
                                    transition: 'all 0.3s ease',
                                    border: isToday ? '2px solid #E091C5' : 'none'
                                  }}
                                  title={`${day}: ${count} ${count === 1 ? 'entry' : 'entries'}`}
                                />
                                <span style={{
                                  fontSize: '10px',
                                  color: isToday ? '#E091C5' : 'rgba(255, 255, 255, 0.5)',
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

      {/* Quick Goals Widget */}
      <div className="mt-8">
        <QuickGoalsWidget />
      </div>

      {/* Badge Showcase - Compact Mode */}
      {user && (
        <div className="mt-8">
          <BadgeShowcase userId={user.id} compact={true} />
        </div>
      )}
    </DashboardLayout>
  );
}
