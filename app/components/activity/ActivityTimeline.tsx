'use client'

import { useState, useEffect, useRef } from 'react';
import { Clock, FileText, Microphone } from '@phosphor-icons/react';
import styles from './ActivityTimeline.module.css';

interface JournalEntry {
  id: string;
  created_at: string;
  content: string;
  primary_mood?: string;
  mood_score?: number;
  audio_url?: string;
}

interface TimelineGroup {
  label: string;
  entries: JournalEntry[];
}

interface ActivityTimelineProps {
  entries: JournalEntry[];
}

export default function ActivityTimeline({ entries }: ActivityTimelineProps) {
  const [visibleEntries, setVisibleEntries] = useState(20);
  const observerRef = useRef<HTMLDivElement>(null);

  // Group entries by time period
  const groupedEntries = groupEntriesByTime(entries);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleEntries(prev => Math.min(prev + 20, entries.length));
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [entries.length]);

  function groupEntriesByTime(entries: JournalEntry[]): TimelineGroup[] {
    const groups: Record<string, JournalEntry[]> = {};
    const now = new Date();

    entries.forEach(entry => {
      const entryDate = new Date(entry.created_at);
      const diffMs = now.getTime() - entryDate.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      let label: string;
      
      if (diffDays === 0) {
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        if (diffHours === 0) {
          label = 'Just now';
        } else if (diffHours < 6) {
          label = 'Earlier today';
        } else if (entryDate.getHours() >= 12) {
          label = 'This afternoon';
        } else {
          label = 'This morning';
        }
      } else if (diffDays === 1) {
        label = 'Yesterday';
      } else if (diffDays < 7) {
        label = entryDate.toLocaleDateString('en-US', { weekday: 'long' });
      } else if (diffDays < 30) {
        label = `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
      } else if (diffDays < 365) {
        const monthsAgo = Math.floor(diffDays / 30);
        label = `${monthsAgo} month${monthsAgo > 1 ? 's' : ''} ago`;
      } else {
        label = entryDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      }

      if (!groups[label]) {
        groups[label] = [];
      }
      groups[label].push(entry);
    });

    return Object.entries(groups).map(([label, entries]) => ({
      label,
      entries: entries.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    }));
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

  function getEntryPreview(content: string, maxLength: number = 120): string {
    const text = content.replace(/<[^>]*>/g, '').trim();
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  function getWordCount(content: string): number {
    return content.split(/\s+/).filter(w => w.length > 0).length;
  }

  // Show only visible entries for performance
  const displayedGroups = groupedEntries.map(group => ({
    ...group,
    entries: group.entries.slice(0, visibleEntries)
  })).filter(group => group.entries.length > 0);

  const totalDisplayed = displayedGroups.reduce((sum, g) => sum + g.entries.length, 0);

  return (
    <div className={styles.timeline}>
      <h2 className={styles.timelineTitle}>Timeline</h2>
      
      {displayedGroups.map((group, groupIndex) => (
        <div key={groupIndex} className={styles.timelineGroup}>
          <div className={styles.groupLabel}>{group.label}</div>
          
          <div className={styles.entriesList}>
            {group.entries.map((entry) => (
              <div
                key={entry.id}
                className={styles.entryCard}
                style={{
                  borderLeft: `3px solid ${getMoodColor(entry.primary_mood)}`
                }}
              >
                <div className={styles.entryHeader}>
                  <div className={styles.entryMeta}>
                    <div 
                      className={styles.moodBadge}
                      style={{ backgroundColor: getMoodColor(entry.primary_mood) }}
                    >
                      {entry.primary_mood || 'Neutral'}
                    </div>
                    <span className={styles.entryTime}>
                      <Clock size={14} weight="regular" />
                      {new Date(entry.created_at).toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  
                  <div className={styles.entryIcons}>
                    {entry.audio_url && (
                      <div className={styles.iconBadge} title="Voice entry">
                        <Microphone size={16} weight="fill" />
                      </div>
                    )}
                    {!entry.audio_url && (
                      <div className={styles.iconBadge} title="Text entry">
                        <FileText size={16} weight="regular" />
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.entryContent}>
                  <p className={styles.entryPreview}>
                    {getEntryPreview(entry.content)}
                  </p>
                  <div className={styles.entryStats}>
                    {getWordCount(entry.content)} words
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Infinite scroll trigger */}
      {totalDisplayed < entries.length && (
        <div ref={observerRef} className={styles.loadMore}>
          Loading more...
        </div>
      )}

      {entries.length === 0 && (
        <div className={styles.emptyState}>
          <p>No entries yet. Start journaling to see your activity!</p>
        </div>
      )}
    </div>
  );
}
