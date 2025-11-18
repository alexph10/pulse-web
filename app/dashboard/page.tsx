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
import styles from './page.module.css';
import { cn } from '@/lib/utils';

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
    const checkDate = new Date(todayStart);
    
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
      { text: 'Ready to make today count?' },
      { text: 'What will you create today?' },
      { text: 'Let\'s build on yesterday\'s momentum' },
      { text: 'Another chance to grow' },
      { text: 'What\'s calling your attention today?' }
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
      <div className={styles.mainCard}>
          {/* Main Content Area */}
          <div className={styles.contentGrid}>
            {/* Left Section */}
            <div className={styles.leftSection}>
              <div>
                <h2 className={styles.greeting}>
                  {contextualUI.greeting}, {firstName}
                </h2>
                <p className={styles.dailyMessage}>
                  {dailyMessage.text}
                </p>
                {getStats().totalCount === 0 && (
                  <p className={styles.emptyStateMessage}>
                    Start your wellness journey with your first journal entry
                  </p>
                )}
              </div>

              {/* Toggle Bar - Bottom Left */}
              <div className={styles.toggleBar}>
                <button
                  onClick={() => setActiveView('today')}
                  className={cn(
                    styles.toggleButton,
                    activeView === 'today' && styles.toggleButtonActive
                  )}
                  aria-label="View today's activity"
                  aria-pressed={activeView === 'today'}
                >
                  Today
                </button>
                <button
                  onClick={() => setActiveView('week')}
                  className={cn(
                    styles.toggleButton,
                    activeView === 'week' && styles.toggleButtonActive
                  )}
                  aria-label="View this week's activity"
                  aria-pressed={activeView === 'week'}
                >
                  This Week
                </button>
              </div>
            </div>

            {/* Right Section - Progress Stats */}
            <div className={styles.rightSection}>
              {loading ? (
                <div className={styles.loadingContainer}>
                  <Skeleton height="24px" width="60%" rounded />
                  <div className={styles.loadingSkeletonGrid}>
                    <Skeleton height="80px" rounded />
                    <Skeleton height="80px" rounded />
                  </div>
                  <Skeleton height="120px" rounded />
                </div>
              ) : (
                <>
                  {activeView === 'today' ? (
                    <div>
                      <h3 className={styles.sectionTitle}>
                        Today's Activity
                      </h3>
                      
                      {/* Stats Grid */}
                      <div className={styles.statsGrid}>
                        <div>
                          <div className={styles.statValue}>
                            {getStats().todayCount}
                          </div>
                          <div className={styles.statLabel}>
                            Entries Today
                          </div>
                        </div>
                        
                        <div>
                          <div className={cn(styles.statValue, styles.statValueSecondary)}>
                            {getStats().streak}
                          </div>
                          <div className={styles.statLabel}>
                            Day Streak
                          </div>
                        </div>
                      </div>
                      
                      {/* Hourly Activity Chart */}
                      {getStats().todayCount > 0 && (
                        <div className={styles.chartContainer}>
                          <div className={styles.chartTitle}>
                            Activity Timeline
                          </div>
                          <div 
                            className={styles.hourlyChart}
                            role="img"
                            aria-label="Hourly activity chart showing journal entries throughout the day"
                          >
                            {Object.entries(getTodayHourlyData())
                              .filter(([_, count]) => count > 0)
                              .map(([hour, count]) => {
                                const maxCount = Math.max(...Object.values(getTodayHourlyData()));
                                const height = (count / maxCount) * 100;
                                return (
                                  <div
                                    key={hour}
                                    className={styles.chartBarContainer}
                                  >
                                    <div
                                      className={styles.chartBar}
                                      style={{ height: `${height}%` }}
                                      role="img"
                                      aria-label={`${count} ${count === 1 ? 'entry' : 'entries'} at ${hour}:00`}
                                      title={`${count} ${count === 1 ? 'entry' : 'entries'} at ${hour}:00`}
                                    />
                                    <span className={styles.chartLabel}>
                                      {hour}h
                                    </span>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      )}
                      
                      {/* Progress Message */}
                      <div className={styles.progressMessage}>
                        <p className={styles.progressMessageText}>
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
                      <h3 className={styles.sectionTitle}>
                        This Week's Progress
                      </h3>
                      
                      {/* Stats Grid */}
                      <div className={styles.statsGrid}>
                        <div>
                          <div className={styles.statValue}>
                            {getStats().weekCount}
                          </div>
                          <div className={styles.statLabel}>
                            Entries This Week
                          </div>
                        </div>
                        
                        <div>
                          <div className={cn(styles.statValue, styles.statValueTotal)}>
                            {getStats().totalCount}
                          </div>
                          <div className={styles.statLabel}>
                            Total Entries
                          </div>
                        </div>
                      </div>
                      
                      {/* Weekly Bar Chart */}
                      <div className={styles.chartContainer}>
                        <div className={styles.chartTitle}>
                          Daily Breakdown
                        </div>
                        <div 
                          className={styles.weeklyChart}
                          role="img"
                          aria-label="Weekly activity chart showing journal entries for each day of the week"
                        >
                          {getWeeklyData().map(({ day, count, isToday }) => {
                            const maxCount = Math.max(...getWeeklyData().map(d => d.count), 1);
                            const height = count > 0 ? (count / maxCount) * 100 : 5;
                            return (
                              <div
                                key={day}
                                className={styles.chartBarContainer}
                              >
                                <div
                                  className={cn(
                                    styles.chartBar,
                                    isToday ? styles.chartBarToday : count > 0 ? styles.chartBarFilled : styles.chartBarEmpty
                                  )}
                                  style={{ height: `${height}%` }}
                                  role="img"
                                  aria-label={`${day}: ${count} ${count === 1 ? 'entry' : 'entries'}`}
                                  title={`${day}: ${count} ${count === 1 ? 'entry' : 'entries'}`}
                                />
                                <span className={cn(styles.chartLabel, isToday && styles.chartLabelToday)}>
                                  {day}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* Progress Message */}
                      <div className={styles.progressMessage}>
                        <p className={styles.progressMessageText}>
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
      <div className={styles.sectionSpacing}>
        <QuickActions />
      </div>

      {/* Insights */}
      {user && (
        <div className={styles.sectionSpacing}>
          <Insights userId={user.id} />
        </div>
      )}

      {/* Quick Goals Widget */}
      <div className={styles.sectionSpacing}>
        <QuickGoalsWidget />
      </div>
    </DashboardLayout>
  );
}
