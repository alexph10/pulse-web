'use client'

import { CaretDown, CaretUp, Copy } from '@phosphor-icons/react';
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
  color: string;
  bgColor: string;
}

export default function Insights({ userId }: InsightsProps) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);

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
          color: '#c2593f', // crail
          bgColor: '#623e33' // quincy
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
          color: '#b46c41', // brown-rust
          bgColor: '#5d3e39' // congo-brown
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
          color: '#c67b22', // ochre
          bgColor: '#623e33' // quincy
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
          color: '#8d503a', // potters-clay
          bgColor: '#5d3e39' // congo-brown
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
          color: '#814837', // ironstone
          bgColor: '#623e33' // quincy
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
          Insights
        </h2>
        <div className={styles.empty}>
          <p style={{ 
            fontSize: '15px',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-family-switzer)',
            marginBottom: '8px'
          }}>
            Your insights will appear here
          </p>
          <p style={{ 
            fontSize: '13px',
            color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-family-switzer)',
            fontStyle: 'italic'
          }}>
            Journal 5+ entries to unlock personalized wellness insights
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.insights}>
      <h2 className={styles.title}>
        Insights
      </h2>
      <div className={styles.insightsList}>
        {insights.map((insight) => {
          return (
            <div 
              key={insight.id} 
              className={`${styles.insightCard} ${expandedInsight === insight.id ? styles.expanded : ''}`}
              style={{ 
                borderLeft: `3px solid ${insight.color}`
              }}
              onClick={() => setExpandedInsight(expandedInsight === insight.id ? null : insight.id)}
            >
              <div className={styles.cardHeader}>
                <div className={styles.cardHeaderLeft}>
                  <div className={styles.content}>
                    <h3 className={styles.insightTitle} style={{ color: insight.color }}>
                      {insight.title}
                    </h3>
                    <p className={styles.insightDescription}>{insight.description}</p>
                  </div>
                </div>
                <div className={styles.cardActions}>
                  <button
                    className={styles.actionButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(`${insight.title}\n${insight.description}`);
                      // You could add a toast here
                    }}
                    title="Copy insight"
                  >
                    <Copy size={16} weight="regular" />
                  </button>
                  {expandedInsight === insight.id ? (
                    <CaretUp size={16} weight="regular" />
                  ) : (
                    <CaretDown size={16} weight="regular" />
                  )}
                </div>
              </div>
              {expandedInsight === insight.id && (
                <div className={styles.expandedContent}>
                  <div className={styles.insightDetails}>
                    <p className={styles.detailText}>
                      This insight is based on your recent journaling patterns. 
                      Keep up the great work!
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
