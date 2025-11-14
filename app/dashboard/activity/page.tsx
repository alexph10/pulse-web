'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import ActivityTimeline from '../../components/activity/ActivityTimeline';
import ActivityHeatmap from '../../components/activity/ActivityHeatmap';
import MetricsCards from '../../components/activity/MetricsCards';

interface JournalEntry {
  id: string;
  created_at: string;
  content: string;
  primary_mood?: string;
  mood_score?: number;
  audio_url?: string;
}

interface ActivityData {
  entries: JournalEntry[];
  stats: {
    totalEntries: number;
    currentStreak: number;
    longestStreak: number;
    avgWordsPerDay: number;
    mostActiveDay: string;
    longestEntry: number;
    favoriteTime: string;
  };
}

export default function Activity() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activityData, setActivityData] = useState<ActivityData | null>(null);

  useEffect(() => {
    // Fetch data even if user is null (for testing with bypassed auth)
    fetchActivityData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchActivityData = async () => {
    try {
      setLoading(true);

      // If no user, set empty data and return early
      if (!user?.id) {
        const emptyStats = {
          totalEntries: 0,
          currentStreak: 0,
          longestStreak: 0,
          avgWordsPerDay: 0,
          mostActiveDay: 'N/A',
          longestEntry: 0,
          favoriteTime: 'N/A'
        };
        setActivityData({
          entries: [],
          stats: emptyStats
        });
        setLoading(false);
        return;
      }

      // Fetch journal entries with pagination (limit to last 1000 for performance)
      // For stats calculation, we need a reasonable sample size
      const { data: entries, error } = await supabase
        .from('journal_entries')
        .select('id, created_at, transcript, primary_mood, mood_score, emotions')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1000); // Limit to prevent memory issues

      if (error) {
        // Log detailed error information
        console.error('Supabase error:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          fullError: error
        });
        throw error;
      }

      // Calculate stats
      const stats = calculateStats(entries || []);

      setActivityData({
        entries: entries || [],
        stats
      });
    } catch (error: any) {
      // Improved error logging
      const errorDetails = error?.message 
        ? { message: error.message, details: error.details, code: error.code }
        : { error: String(error), type: typeof error };
      
      console.error('Error fetching activity data:', errorDetails);
      
      // Set empty data on error to prevent UI breaking
      const emptyStats = {
        totalEntries: 0,
        currentStreak: 0,
        longestStreak: 0,
        avgWordsPerDay: 0,
        mostActiveDay: 'N/A',
        longestEntry: 0,
        favoriteTime: 'N/A'
      };
      setActivityData({
        entries: [],
        stats: emptyStats
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (entries: JournalEntry[]) => {
    const totalEntries = entries.length;
    
    // Calculate current streak
    const currentStreak = calculateCurrentStreak(entries);
    const longestStreak = calculateLongestStreak(entries);
    
    // Calculate average words per day
    // Use transcript field instead of content
    const totalWords = entries.reduce((sum, entry) => {
      const text = (entry as any).transcript || entry.content || '';
      return sum + (text.split(/\s+/).filter((w: string) => w.length > 0).length || 0);
    }, 0);
    const avgWordsPerDay = totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0;

    // Find most active day of week
    const dayCount: Record<string, number> = {};
    entries.forEach(entry => {
      const day = new Date(entry.created_at).toLocaleDateString('en-US', { weekday: 'long' });
      dayCount[day] = (dayCount[day] || 0) + 1;
    });
    const mostActiveDay = Object.entries(dayCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    // Find longest entry
    const longestEntry = Math.max(...entries.map(e => {
      const text = (e as any).transcript || e.content || '';
      return text.split(/\s+/).filter((w: string) => w.length > 0).length || 0;
    }), 0);

    // Find favorite time (hour with most entries)
    const hourCount: Record<number, number> = {};
    entries.forEach(entry => {
      const hour = new Date(entry.created_at).getHours();
      hourCount[hour] = (hourCount[hour] || 0) + 1;
    });
    const favoriteHour = Object.entries(hourCount).sort((a, b) => b[1] - a[1])[0]?.[0] || '0';
    const favoriteTime = formatTime(parseInt(favoriteHour));

    return {
      totalEntries,
      currentStreak,
      longestStreak,
      avgWordsPerDay,
      mostActiveDay,
      longestEntry,
      favoriteTime
    };
  };

  const calculateCurrentStreak = (entries: JournalEntry[]): number => {
    if (entries.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    let currentDate = new Date(today);

    const entryDates = entries.map(e => {
      const date = new Date(e.created_at);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    });

    const uniqueDates = [...new Set(entryDates)].sort((a, b) => b - a);

    for (let i = 0; i < uniqueDates.length; i++) {
      const entryDate = new Date(uniqueDates[i]);
      const diffDays = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 0 || (streak > 0 && diffDays === 1)) {
        streak++;
        currentDate = entryDate;
      } else if (diffDays > 1) {
        break;
      }
    }

    return streak;
  };

  const calculateLongestStreak = (entries: JournalEntry[]): number => {
    if (entries.length === 0) return 0;

    const entryDates = entries.map(e => {
      const date = new Date(e.created_at);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    });

    const uniqueDates = [...new Set(entryDates)].sort((a, b) => a - b);

    let maxStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < uniqueDates.length; i++) {
      const diffDays = Math.floor((uniqueDates[i] - uniqueDates[i - 1]) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    return maxStreak;
  };

  const formatTime = (hour: number): string => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  };

  return (
    <DashboardLayout isLoading={loading}>
      <div style={{ marginBottom: '32px', padding: '0 24px' }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: '8px',
          fontFamily: 'var(--font-family-satoshi)'
        }}>
          Activity
        </h1>
        <p style={{
          fontSize: '14px',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-family-switzer)'
        }}>
          Understand your wellness patterns and build consistency
        </p>
      </div>

      {activityData && (
        <>
          {/* Metrics Cards */}
          <MetricsCards stats={activityData.stats} />

          {/* Activity Heatmap */}
          <div style={{ marginBottom: '32px' }}>
            <ActivityHeatmap entries={activityData.entries} />
          </div>

          {/* Activity Timeline */}
          <ActivityTimeline entries={activityData.entries} />
        </>
      )}

      {!loading && (!activityData || activityData.entries.length === 0) && (
        <div style={{
          textAlign: 'center',
          padding: '64px 24px',
          color: 'var(--text-secondary)'
        }}>
          <p style={{ 
            fontSize: '18px', 
            marginBottom: '8px',
            fontFamily: 'var(--font-family-satoshi)',
            fontWeight: '500',
            color: 'var(--text-primary)'
          }}>
            Your wellness journey starts here
          </p>
          <p style={{ 
            fontSize: '14px',
            fontFamily: 'var(--font-family-switzer)',
            color: 'var(--text-tertiary)',
            marginBottom: '24px'
          }}>
            Start journaling to track your emotional patterns and build self-awareness
          </p>
          <a 
            href="/dashboard/journal"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: 'var(--accent-primary)',
              color: '#FFFFFF',
              borderRadius: 'var(--border-radius-md)',
              textDecoration: 'none',
              fontFamily: 'var(--font-family-satoshi)',
              fontWeight: '500',
              fontSize: '14px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--accent-primary-hover)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--accent-primary)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Record Your First Entry
          </a>
        </div>
      )}
    </DashboardLayout>
  );
}
