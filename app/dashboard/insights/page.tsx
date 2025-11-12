'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { 
  Lightbulb, 
  TrendUp, 
  Fire, 
  Brain, 
  Heart, 
  Target,
  ChartLine,
  Clock,
  Calendar,
  ChatCircle
} from '@phosphor-icons/react';
import styles from './insights.module.css';

interface JournalEntry {
  id: string;
  created_at: string;
  content: string;
  primary_mood?: string;
  mood_score?: number;
}

interface Insight {
  id: string;
  category: 'streak' | 'pattern' | 'mood' | 'growth' | 'milestone' | 'recommendation';
  title: string;
  description: string;
  details: string[];
  icon: any;
  color: string;
  bgColor: string;
  priority: 'high' | 'medium' | 'low';
}

export default function InsightsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  useEffect(() => {
    if (user) {
      generateInsights();
    }
  }, [user]);

  const generateInsights = async () => {
    try {
      setLoading(true);

      const { data: entries, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const allInsights: Insight[] = [];

      // 1. Streak Insights
      const streak = calculateStreak(entries || []);
      const longestStreak = calculateLongestStreak(entries || []);
      
      if (streak > 0) {
        allInsights.push({
          id: 'streak-current',
          category: 'streak',
          title: `${streak} Day Streak!`,
          description: streak >= 7 
            ? "You're on fire! Your consistency is building a powerful habit." 
            : "Great start! Every day counts toward building lasting change.",
          details: [
            `Current streak: ${streak} days`,
            `Longest streak: ${longestStreak} days`,
            streak < longestStreak ? `You're ${longestStreak - streak} days from your record!` : "You're at your personal best!"
          ],
          icon: Fire,
          color: '#ef4444',
          bgColor: 'rgba(239, 68, 68, 0.1)',
          priority: 'high'
        });
      }

      // 2. Time Pattern Insights
      const timePatterns = analyzeTimePatterns(entries || []);
      if (timePatterns.mostActiveHour !== null) {
        const timeStr = formatHour(timePatterns.mostActiveHour);
        const timeOfDay = getTimeOfDay(timePatterns.mostActiveHour);
        
        allInsights.push({
          id: 'pattern-time',
          category: 'pattern',
          title: `You're a ${timeOfDay} Person`,
          description: `Most of your journaling happens around ${timeStr}. This is your natural reflection window.`,
          details: [
            `Peak journaling time: ${timeStr}`,
            `${timePatterns.morningEntries} morning entries`,
            `${timePatterns.eveningEntries} evening entries`,
            `${timePatterns.nightEntries} late night entries`
          ],
          icon: Clock,
          color: '#3b82f6',
          bgColor: 'rgba(59, 130, 246, 0.1)',
          priority: 'medium'
        });
      }

      // 3. Mood Insights
      const moodAnalysis = analyzeMoodPatterns(entries || []);
      if (moodAnalysis) {
        allInsights.push({
          id: 'mood-trend',
          category: 'mood',
          title: moodAnalysis.title,
          description: moodAnalysis.description,
          details: moodAnalysis.details,
          icon: Heart,
          color: '#ec4899',
          bgColor: 'rgba(236, 72, 153, 0.1)',
          priority: moodAnalysis.priority
        });
      }

      // 4. Writing Depth Insights
      const writingStats = analyzeWritingDepth(entries || []);
      if (writingStats.avgWords > 100) {
        const level = writingStats.avgWords > 500 ? 'Deep Thinker' 
                    : writingStats.avgWords > 300 ? 'Thoughtful Writer'
                    : 'Consistent Reflector';
        
        allInsights.push({
          id: 'growth-depth',
          category: 'growth',
          title: level,
          description: `You average ${Math.round(writingStats.avgWords)} words per entry. Your depth of reflection is impressive.`,
          details: [
            `Average: ${Math.round(writingStats.avgWords)} words`,
            `Longest entry: ${writingStats.longestEntry} words`,
            `Total words: ${writingStats.totalWords.toLocaleString()}`,
            `That's like writing ${Math.round(writingStats.totalWords / 500)} pages!`
          ],
          icon: Brain,
          color: '#8b5cf6',
          bgColor: 'rgba(139, 92, 246, 0.1)',
          priority: 'medium'
        });
      }

      // 5. Consistency Insights
      const consistencyScore = calculateConsistency(entries || []);
      if (entries && entries.length > 0) {
        allInsights.push({
          id: 'pattern-consistency',
          category: 'pattern',
          title: 'Consistency Score',
          description: `You journal ${consistencyScore.rate}% of days. ${consistencyScore.message}`,
          details: [
            `Active days: ${consistencyScore.activeDays} out of ${consistencyScore.totalDays}`,
            `${consistencyScore.activeDays} entries in the last month`,
            consistencyScore.rate >= 80 ? 'Exceptional consistency!' : 
            consistencyScore.rate >= 50 ? 'Good habit building' : 
            'Room to grow - try daily reminders'
          ],
          icon: Calendar,
          color: '#10b981',
          bgColor: 'rgba(16, 185, 129, 0.1)',
          priority: 'medium'
        });
      }

      // 6. Milestone Insights
      const totalEntries = entries?.length || 0;
      if (totalEntries >= 5) {
        const milestones = [5, 10, 25, 50, 100, 250, 500];
        const nextMilestone = milestones.find(m => m > totalEntries) || totalEntries + 50;
        const remaining = nextMilestone - totalEntries;

        allInsights.push({
          id: 'milestone-progress',
          category: 'milestone',
          title: `${totalEntries} Entries!`,
          description: `You've created ${totalEntries} journal entries. Only ${remaining} more to reach ${nextMilestone}!`,
          details: [
            `Total entries: ${totalEntries}`,
            `Next milestone: ${nextMilestone}`,
            `You're ${Math.round((totalEntries / nextMilestone) * 100)}% there`,
            'Each entry is a step toward self-awareness'
          ],
          icon: Target,
          color: '#f59e0b',
          bgColor: 'rgba(245, 158, 11, 0.1)',
          priority: 'low'
        });
      }

      // 7. Growth Recommendations
      if (entries && entries.length > 3) {
        const recentAvg = calculateRecentAvgWords(entries.slice(0, 7));
        const overallAvg = writingStats.avgWords;
        
        if (recentAvg > overallAvg * 1.2) {
          allInsights.push({
            id: 'recommend-depth',
            category: 'recommendation',
            title: 'Your Depth is Growing',
            description: `Recent entries are ${Math.round(((recentAvg / overallAvg) - 1) * 100)}% longer than your average. You're diving deeper.`,
            details: [
              `Recent average: ${Math.round(recentAvg)} words`,
              `Overall average: ${Math.round(overallAvg)} words`,
              'Keep exploring these deeper reflections',
              'Consider setting aside more time for journaling'
            ],
            icon: TrendUp,
            color: '#06b6d4',
            bgColor: 'rgba(6, 182, 212, 0.1)',
            priority: 'high'
          });
        }
      }

      // Sort by priority
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      allInsights.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

      setInsights(allInsights);
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const calculateStreak = (entries: JournalEntry[]): number => {
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

  const analyzeTimePatterns = (entries: JournalEntry[]) => {
    const hourCounts: { [key: number]: number } = {};
    let morningEntries = 0;
    let eveningEntries = 0;
    let nightEntries = 0;

    entries.forEach(entry => {
      const hour = new Date(entry.created_at).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;

      if (hour >= 5 && hour < 12) morningEntries++;
      else if (hour >= 17 && hour < 22) eveningEntries++;
      else if (hour >= 22 || hour < 5) nightEntries++;
    });

    const maxCount = Math.max(...Object.values(hourCounts));
    const mostActiveHour = Object.entries(hourCounts)
      .find(([_, count]) => count === maxCount)?.[0];

    return {
      mostActiveHour: mostActiveHour ? parseInt(mostActiveHour) : null,
      morningEntries,
      eveningEntries,
      nightEntries
    };
  };

  const analyzeMoodPatterns = (entries: JournalEntry[]) => {
    if (entries.length < 3) return null;

    const recentEntries = entries.slice(0, 10);
    const positiveMoods = ['Happy', 'Excited', 'Calm'];
    const negativeMoods = ['Stressed', 'Sad', 'Angry'];
    
    let positiveCount = 0;
    let negativeCount = 0;

    recentEntries.forEach(e => {
      if (positiveMoods.includes(e.primary_mood || '')) positiveCount++;
      if (negativeMoods.includes(e.primary_mood || '')) negativeCount++;
    });

    const positiveRatio = positiveCount / recentEntries.length;

    if (positiveRatio >= 0.7) {
      return {
        title: 'Positive Momentum',
        description: 'Your recent entries show strong positive energy. You\'re in a great mental space.',
        details: [
          `${positiveCount} positive moods in last 10 entries`,
          'Your outlook is optimistic',
          'This is a great time to set ambitious goals',
          'Consider what\'s contributing to this positive phase'
        ],
        priority: 'high' as const
      };
    } else if (positiveRatio <= 0.3) {
      return {
        title: 'Processing Difficult Emotions',
        description: 'You\'ve been working through challenging feelings. This reflection is valuable.',
        details: [
          `${negativeCount} tough days in recent entries`,
          'Journaling is helping you process',
          'Remember: emotions are temporary',
          'Consider reaching out to supportive people'
        ],
        priority: 'high' as const
      };
    }

    return {
      title: 'Balanced Emotional Range',
      description: 'You\'re experiencing a healthy mix of emotions and processing them mindfully.',
      details: [
        `${positiveCount} positive, ${negativeCount} challenging moods`,
        'Your emotional awareness is growing',
        'You\'re not avoiding difficult feelings',
        'This balance is a sign of emotional maturity'
      ],
      priority: 'medium' as const
    };
  };

  const analyzeWritingDepth = (entries: JournalEntry[]) => {
    let totalWords = 0;
    let longestEntry = 0;

    entries.forEach(entry => {
      const wordCount = entry.content?.split(/\s+/).filter((w: string) => w.length > 0).length || 0;
      totalWords += wordCount;
      longestEntry = Math.max(longestEntry, wordCount);
    });

    return {
      avgWords: entries.length > 0 ? totalWords / entries.length : 0,
      totalWords,
      longestEntry
    };
  };

  const calculateConsistency = (entries: JournalEntry[]) => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const recentEntries = entries.filter(e => 
      new Date(e.created_at) >= thirtyDaysAgo
    );

    const uniqueDays = new Set(
      recentEntries.map(e => {
        const date = new Date(e.created_at);
        date.setHours(0, 0, 0, 0);
        return date.toISOString();
      })
    ).size;

    const rate = Math.round((uniqueDays / 30) * 100);
    
    let message = '';
    if (rate >= 80) message = 'Outstanding dedication!';
    else if (rate >= 50) message = 'Great habit forming.';
    else message = 'Building consistency takes time.';

    return {
      activeDays: uniqueDays,
      totalDays: 30,
      rate,
      message
    };
  };

  const calculateRecentAvgWords = (entries: JournalEntry[]): number => {
    if (entries.length === 0) return 0;
    
    const totalWords = entries.reduce((sum, entry) => {
      return sum + (entry.content?.split(/\s+/).filter((w: string) => w.length > 0).length || 0);
    }, 0);

    return totalWords / entries.length;
  };

  const formatHour = (hour: number): string => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  };

  const getTimeOfDay = (hour: number): string => {
    if (hour >= 5 && hour < 12) return 'Morning';
    if (hour >= 12 && hour < 17) return 'Afternoon';
    if (hour >= 17 && hour < 22) return 'Evening';
    return 'Night Owl';
  };

  const categories = [
    { id: 'all', label: 'All Insights', icon: Lightbulb },
    { id: 'streak', label: 'Streaks', icon: Fire },
    { id: 'pattern', label: 'Patterns', icon: TrendUp },
    { id: 'mood', label: 'Mood', icon: Heart },
    { id: 'growth', label: 'Growth', icon: Brain },
    { id: 'milestone', label: 'Milestones', icon: Target },
    { id: 'recommendation', label: 'Tips', icon: ChatCircle }
  ];

  const filteredInsights = activeFilter === 'all' 
    ? insights 
    : insights.filter(i => i.category === activeFilter);

  return (
    <DashboardLayout isLoading={loading}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <Lightbulb size={32} weight="duotone" />
            Insights
          </h1>
          <p className={styles.subtitle}>
            Personalized patterns and recommendations from your journal
          </p>
        </div>
      </div>

      {/* Category Filters */}
      <div className={styles.filters}>
        {categories.map(cat => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              className={`${styles.filterBtn} ${activeFilter === cat.id ? styles.active : ''}`}
              onClick={() => setActiveFilter(cat.id)}
            >
              <Icon size={18} weight="duotone" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Insights Grid */}
      {filteredInsights.length === 0 ? (
        <div className={styles.empty}>
          <Lightbulb size={64} weight="duotone" />
          <h3>No insights yet</h3>
          <p>Keep journaling to unlock personalized insights about your patterns and growth!</p>
        </div>
      ) : (
        <div className={styles.insightsGrid}>
          {filteredInsights.map(insight => {
            const Icon = insight.icon;
            return (
              <div
                key={insight.id}
                className={styles.insightCard}
                style={{ borderLeft: `4px solid ${insight.color}` }}
              >
                <div 
                  className={styles.iconWrapper}
                  style={{ 
                    backgroundColor: insight.bgColor,
                    color: insight.color 
                  }}
                >
                  <Icon size={28} weight="duotone" />
                </div>
                <div className={styles.content}>
                  <div className={styles.badge} style={{ color: insight.color }}>
                    {insight.category}
                  </div>
                  <h3 className={styles.insightTitle} style={{ color: insight.color }}>
                    {insight.title}
                  </h3>
                  <p className={styles.description}>{insight.description}</p>
                  <ul className={styles.detailsList}>
                    {insight.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
