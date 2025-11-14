'use client'

import { useState, useMemo } from 'react';
import { Flame, TrendUp } from '@phosphor-icons/react';
import styles from './ActivityHeatmap.module.css';

interface JournalEntry {
  id: string;
  created_at: string;
  content: string;
  primary_mood?: string;
  mood_score?: number;
}

interface ActivityHeatmapProps {
  entries: JournalEntry[];
}

type ViewMode = 'count' | 'mood' | 'words';

interface DayData {
  date: Date;
  count: number;
  avgMoodScore: number;
  totalWords: number;
  entries: JournalEntry[];
}

export default function ActivityHeatmap({ entries }: ActivityHeatmapProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('count');
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);

  // Generate heatmap data for the last 365 days
  const heatmapData = useMemo(() => {
    const data: Map<string, DayData> = new Map();
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 364); // 365 days including today

    // Initialize all days
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateKey = d.toISOString().split('T')[0];
      data.set(dateKey, {
        date: new Date(d),
        count: 0,
        avgMoodScore: 0,
        totalWords: 0,
        entries: []
      });
    }

    // Populate with entry data
    entries.forEach(entry => {
      const dateKey = entry.created_at.split('T')[0];
      const dayData = data.get(dateKey);
      
      if (dayData) {
        dayData.count++;
        dayData.entries.push(entry);
        
        if (entry.mood_score) {
          dayData.avgMoodScore = 
            (dayData.avgMoodScore * (dayData.count - 1) + entry.mood_score) / dayData.count;
        }
        
        const wordCount = entry.content?.split(/\s+/).filter(w => w.length > 0).length || 0;
        dayData.totalWords += wordCount;
      }
    });

    return data;
  }, [entries]);

  // Group days into weeks
  const weeks = useMemo(() => {
    const weeksArray: DayData[][] = [];
    let currentWeek: DayData[] = [];
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 364);
    
    // Pad to start on Sunday
    const dayOfWeek = startDate.getDay();
    for (let i = 0; i < dayOfWeek; i++) {
      currentWeek.push({
        date: new Date(0),
        count: 0,
        avgMoodScore: 0,
        totalWords: 0,
        entries: []
      });
    }

    heatmapData.forEach((dayData) => {
      currentWeek.push(dayData);
      
      if (currentWeek.length === 7) {
        weeksArray.push([...currentWeek]);
        currentWeek = [];
      }
    });

    // Pad last week if needed
    while (currentWeek.length < 7 && currentWeek.length > 0) {
      currentWeek.push({
        date: new Date(0),
        count: 0,
        avgMoodScore: 0,
        totalWords: 0,
        entries: []
      });
    }
    if (currentWeek.length > 0) {
      weeksArray.push(currentWeek);
    }

    return weeksArray;
  }, [heatmapData]);

  // Calculate intensity color based on view mode
  const getIntensity = (day: DayData): number => {
    if (day.date.getTime() === 0) return -1; // Empty padding cell

    switch (viewMode) {
      case 'count':
        if (day.count === 0) return 0;
        if (day.count === 1) return 1;
        if (day.count === 2) return 2;
        if (day.count >= 3) return 3;
        return 0;
      
      case 'mood':
        if (day.count === 0) return 0;
        const moodScore = day.avgMoodScore;
        if (moodScore >= 8) return 3;
        if (moodScore >= 6) return 2;
        if (moodScore >= 4) return 1;
        return 0;
      
      case 'words':
        if (day.totalWords === 0) return 0;
        const avgWords = day.totalWords / day.count;
        if (avgWords >= 500) return 3;
        if (avgWords >= 300) return 2;
        if (avgWords >= 100) return 1;
        return 0;
      
      default:
        return 0;
    }
  };

  // Calculate current streak
  const currentStreak = useMemo(() => {
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateKey = checkDate.toISOString().split('T')[0];
      const dayData = heatmapData.get(dateKey);
      
      if (dayData && dayData.count > 0) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    return streak;
  }, [heatmapData]);

  const handleDayClick = (day: DayData) => {
    if (day.date.getTime() === 0 || day.count === 0) return;
    setSelectedDay(day);
  };

  const getTooltipText = (day: DayData): string => {
    if (day.date.getTime() === 0) return '';
    
    const dateStr = day.date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });

    if (day.count === 0) {
      return `${dateStr}: No entries`;
    }

    switch (viewMode) {
      case 'count':
        return `${dateStr}: ${day.count} ${day.count === 1 ? 'entry' : 'entries'}`;
      case 'mood':
        return `${dateStr}: ${day.count} ${day.count === 1 ? 'entry' : 'entries'}, Avg mood: ${day.avgMoodScore.toFixed(1)}/10`;
      case 'words':
        return `${dateStr}: ${day.totalWords} words`;
      default:
        return dateStr;
    }
  };

  return (
    <div className={styles.heatmap}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h2 className={styles.title}>Activity Heatmap</h2>
          {currentStreak > 0 && (
            <div className={styles.streak}>
              <Flame size={20} weight="fill" className={styles.streakIcon} />
              <span className={styles.streakText}>{currentStreak} day streak</span>
            </div>
          )}
        </div>
        
        <div className={styles.viewToggle}>
          <button
            className={`${styles.toggleBtn} ${viewMode === 'count' ? styles.active : ''}`}
            onClick={() => setViewMode('count')}
          >
            Entries
          </button>
          <button
            className={`${styles.toggleBtn} ${viewMode === 'mood' ? styles.active : ''}`}
            onClick={() => setViewMode('mood')}
          >
            Mood
          </button>
          <button
            className={`${styles.toggleBtn} ${viewMode === 'words' ? styles.active : ''}`}
            onClick={() => setViewMode('words')}
          >
            Words
          </button>
        </div>
      </div>

      <div className={styles.calendar}>
        <div className={styles.monthLabels}>
          {getMonthLabels(weeks)}
        </div>
        
        <div className={styles.grid}>
          <div className={styles.dayLabels}>
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>
          
          <div className={styles.weeks}>
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className={styles.week}>
                {week.map((day, dayIndex) => {
                  const dateKey = day.date.getTime() === 0 ? `empty-${weekIndex}-${dayIndex}` : day.date.toISOString();
                  const intensity = getIntensity(day);
                  
                  return (
                    <div
                      key={dateKey}
                      className={`${styles.day} ${intensity >= 0 ? styles[`intensity${intensity}`] : styles.empty}`}
                      onClick={() => handleDayClick(day)}
                      onMouseEnter={() => setHoveredDay(dateKey)}
                      onMouseLeave={() => setHoveredDay(null)}
                      title={getTooltipText(day)}
                    >
                      {hoveredDay === dateKey && day.date.getTime() !== 0 && (
                        <div className={styles.tooltip}>
                          {getTooltipText(day)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.legend}>
          <span className={styles.legendLabel}>Less</span>
          <div className={`${styles.legendBox} ${styles.intensity0}`}></div>
          <div className={`${styles.legendBox} ${styles.intensity1}`}></div>
          <div className={`${styles.legendBox} ${styles.intensity2}`}></div>
          <div className={`${styles.legendBox} ${styles.intensity3}`}></div>
          <span className={styles.legendLabel}>More</span>
        </div>
      </div>

      {selectedDay && (
        <div className={styles.modal} onClick={() => setSelectedDay(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>
              {selectedDay.date.toLocaleDateString('en-US', { 
                weekday: 'long',
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
              })}
            </h3>
            <p className={styles.modalStats}>
              {selectedDay.count} {selectedDay.count === 1 ? 'entry' : 'entries'} • {selectedDay.totalWords} words
            </p>
            <div className={styles.modalEntries}>
              {selectedDay.entries.map(entry => (
                <div key={entry.id} className={styles.modalEntry}>
                  <div className={styles.modalEntryMood} style={{ 
                    backgroundColor: getMoodColor(entry.primary_mood) 
                  }}>
                    {entry.primary_mood || 'Neutral'}
                  </div>
                  <p className={styles.modalEntryText}>
                    {entry.content.substring(0, 150)}...
                  </p>
                </div>
              ))}
            </div>
            <button className={styles.closeBtn} onClick={() => setSelectedDay(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function getMonthLabels(weeks: DayData[][]): React.ReactElement[] {
  const labels: React.ReactElement[] = [];
  let currentMonth = -1;
  
  weeks.forEach((week, weekIndex) => {
    const firstDay = week.find(d => d.date.getTime() !== 0);
    if (firstDay) {
      const month = firstDay.date.getMonth();
      if (month !== currentMonth) {
        currentMonth = month;
        labels.push(
          <span 
            key={weekIndex} 
            style={{ gridColumn: weekIndex + 1 }}
          >
            {firstDay.date.toLocaleDateString('en-US', { month: 'short' })}
          </span>
        );
      }
    }
  });
  
  return labels;
}

function getMoodColor(mood?: string): string {
  const moodColors: Record<string, string> = {
    'Happy': '#10b981',
    'Excited': '#f59e0b',
    'Calm': '#3b82f6',
    'Neutral': '#814837', // ironstone (replaces gray)
    'Stressed': '#ef4444',
    'Sad': '#6366f1',
    'Angry': '#dc2626'
  };
  return mood ? moodColors[mood] || '#814837' : '#814837'; // ironstone default
}
