'use client'

import { Lightbulb, TrendUp, Fire, Brain, Heart, Target } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './Insights.module.css';

interface InsightsProps {
  userId: string;
}

interface Insight {
  id: string;
  type: 'pattern' | 'streak' | 'mood' | 'growth' | 'milestone';
  title: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
}

export default function Insights({ userId }: InsightsProps) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      generateInsights();
    }
  }, [userId]);

  const generateInsights = async () => {
    try {
      setLoading(true);

      // Fetch user's journal entries
      const { data: entries, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      const generatedInsights: Insight[] = [];

      // 1. Streak insight
      const streak = calculateStreak(entries || []);
      if (streak > 0) {
        generatedInsights.push({
          id: '1',
          type: 'streak',
          title: `${streak} Day Streak!`,
          description: streak >= 7 
            ? "You're on fire! Keep up the momentum." 
            : "Great start! Keep building your habit.",
          icon: Fire,
          color: '#ef4444',
          bgColor: 'rgba(239, 68, 68, 0.1)'
        });
      }

      // 2. Most active time pattern
      const mostActiveHour = findMostActiveHour(entries || []);
      if (mostActiveHour !== null) {
        const timeStr = formatHour(mostActiveHour);
        generatedInsights.push({
          id: '2',
          type: 'pattern',
          title: 'Your Peak Time',
          description: `You journal most around ${timeStr}. Consider scheduling reflection time then.`,
          icon: TrendUp,
          color: '#3b82f6',
          bgColor: 'rgba(59, 130, 246, 0.1)'
        });
      }

      // 3. Mood trend
      const moodTrend = analyzeMoodTrend(entries || []);
      if (moodTrend) {
        generatedInsights.push({
          id: '3',
          type: 'mood',
          title: moodTrend.title,
          description: moodTrend.description,
          icon: Heart,
          color: '#ec4899',
          bgColor: 'rgba(236, 72, 153, 0.1)'
        });
      }

      // 4. Consistency milestone
      const totalEntries = entries?.length || 0;
      if (totalEntries >= 10 && totalEntries % 10 === 0) {
        generatedInsights.push({
          id: '4',
          type: 'milestone',
          title: `${totalEntries} Entries!`,
          description: "You're building a powerful self-awareness practice.",
          icon: Target,
          color: '#10b981',
          bgColor: 'rgba(16, 185, 129, 0.1)'
        });
      }

      // 5. Writing depth insight
      const avgWordCount = calculateAvgWordCount(entries || []);
      if (avgWordCount > 200) {
        generatedInsights.push({
          id: '5',
          type: 'growth',
          title: 'Deep Reflector',
          description: `You average ${Math.round(avgWordCount)} words per entry. Your depth is impressive.`,
          icon: Brain,
          color: '#8b5cf6',
          bgColor: 'rgba(139, 92, 246, 0.1)'
        });
      }

      setInsights(generatedInsights.slice(0, 3)); // Show top 3 insights
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStreak = (entries: any[]): number => {
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

  const findMostActiveHour = (entries: any[]): number | null => {
    if (entries.length === 0) return null;

    const hourCounts: { [key: number]: number } = {};
    entries.forEach(entry => {
      const hour = new Date(entry.created_at).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    const maxCount = Math.max(...Object.values(hourCounts));
    const mostActiveHour = Object.entries(hourCounts)
      .find(([_, count]) => count === maxCount)?.[0];

    return mostActiveHour ? parseInt(mostActiveHour) : null;
  };

  const formatHour = (hour: number): string => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  };

  const analyzeMoodTrend = (entries: any[]): { title: string; description: string } | null => {
    const recentEntries = entries.slice(0, 7); // Last 7 entries
    if (recentEntries.length < 3) return null;

    const positiveMoods = ['Happy', 'Excited', 'Calm'];
    const positiveCount = recentEntries.filter(e => 
      positiveMoods.includes(e.primary_mood)
    ).length;

    const positiveRatio = positiveCount / recentEntries.length;

    if (positiveRatio >= 0.7) {
      return {
        title: 'Positive Momentum',
        description: 'Your recent entries show a positive trend. Keep nurturing this energy!'
      };
    } else if (positiveRatio <= 0.3) {
      return {
        title: 'Reflection Time',
        description: "You've been processing some heavy emotions. Remember, this too shall pass."
      };
    }

    return {
      title: 'Balanced Journey',
      description: 'Your emotional range is healthy. Keep embracing all your feelings.'
    };
  };

  const calculateAvgWordCount = (entries: any[]): number => {
    if (entries.length === 0) return 0;
    
    const totalWords = entries.reduce((sum, entry) => {
      const wordCount = entry.content?.split(/\s+/).filter((w: string) => w.length > 0).length || 0;
      return sum + wordCount;
    }, 0);

    return totalWords / entries.length;
  };

  if (loading) {
    return (
      <div className={styles.insights}>
        <h2 className={styles.title}>
          <Lightbulb size={24} weight="duotone" />
          Insights
        </h2>
        <div className={styles.loading}>Analyzing your patterns...</div>
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <div className={styles.insights}>
        <h2 className={styles.title}>
          <Lightbulb size={24} weight="duotone" />
          Insights
        </h2>
        <div className={styles.empty}>
          <p>Keep journaling to unlock personalized insights!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.insights}>
      <h2 className={styles.title}>
        <Lightbulb size={24} weight="duotone" />
        Insights
      </h2>
      <div className={styles.insightsList}>
        {insights.map((insight) => {
          const Icon = insight.icon;
          return (
            <div 
              key={insight.id} 
              className={styles.insightCard}
              style={{ 
                borderLeft: `3px solid ${insight.color}`
              }}
            >
              <div 
                className={styles.iconWrapper}
                style={{ 
                  backgroundColor: insight.bgColor,
                  color: insight.color 
                }}
              >
                <Icon size={20} weight="duotone" />
              </div>
              <div className={styles.content}>
                <h3 className={styles.insightTitle} style={{ color: insight.color }}>
                  {insight.title}
                </h3>
                <p className={styles.insightDescription}>{insight.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
