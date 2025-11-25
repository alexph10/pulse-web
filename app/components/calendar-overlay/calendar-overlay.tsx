'use client'

import React, { useState, useEffect, useRef } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, subMonths, addMonths, startOfWeek, endOfWeek } from 'date-fns';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/app/contexts/AuthContext';
import { CalendarOverlayProps, ActivityData, DayActivity } from './types';
import styles from './calendar-overlay.module.css';

export default function CalendarOverlay({ isOpen, onClose }: CalendarOverlayProps) {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [activityData, setActivityData] = useState<ActivityData>({});
  const [loading, setLoading] = useState(false);
  const [hoveredDay, setHoveredDay] = useState<DayActivity | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && user) {
      fetchActivityData();
    }
  }, [isOpen, user, selectedMonth]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const fetchActivityData = async () => {
    setLoading(true);
    try {
      // Fetch last 3 months
      const endDate = endOfMonth(new Date());
      const startDate = startOfMonth(subMonths(endDate, 2));

      const response = await fetch(
        `/api/activity?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );

      if (response.ok) {
        const result = await response.json();
        setActivityData(result.data || {});
      }
    } catch (error) {
      console.error('Error fetching activity data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityLevel = (count: number): number => {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 4) return 2;
    if (count <= 6) return 3;
    if (count <= 9) return 4;
    return 5;
  };

  const generateMonthlyCalendar = (): DayActivity[] => {
    const monthStart = startOfMonth(selectedMonth);
    const monthEnd = endOfMonth(selectedMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    return days.map((date) => {
      const dateString = format(date, 'yyyy-MM-dd');
      const activity = activityData[dateString] || { journalCount: 0, goalsCount: 0, totalActivity: 0 };
      
      return {
        date,
        dateString,
        journalCount: activity.journalCount,
        goalsCount: activity.goalsCount,
        totalActivity: activity.totalActivity,
        level: getActivityLevel(activity.totalActivity),
      };
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setSelectedMonth((current) => 
      direction === 'prev' ? subMonths(current, 1) : addMonths(current, 1)
    );
  };

  const renderNavButton = (direction: 'prev' | 'next') => (
    <button 
      className={styles.navButton}
      onClick={() => navigateMonth(direction)}
      aria-label={direction === 'prev' ? 'Previous month' : 'Next month'}
    >
      {direction === 'prev' ? <CaretLeft size={12} weight="regular" /> : <CaretRight size={12} weight="regular" />}
    </button>
  );

  const renderMonthlyCalendar = () => {
    const days = generateMonthlyCalendar();
    const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    return (
      <div className={styles.monthlyCalendar}>
        <div className={styles.calendarHeader}>
          {renderNavButton('prev')}
          <h3 className={styles.monthTitle}>
            {format(selectedMonth, 'MMM yy')}
          </h3>
          {renderNavButton('next')}
        </div>

        <div className={styles.weekDaysHeader}>
          {weekDays.map((day, index) => (
            <div key={`weekday-${index}`} className={styles.weekDay}>{day}</div>
          ))}
        </div>

        <div className={styles.daysGrid}>
          {days.map((day) => {
            const isCurrentMonth = day.date.getMonth() === selectedMonth.getMonth();
            const isToday = format(day.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
            
            return (
              <div
                key={day.dateString}
                className={`${styles.dayCell} ${!isCurrentMonth ? styles.otherMonth : ''} ${isToday ? styles.today : ''}`}
                onMouseEnter={() => setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                <span className={styles.dayNumber}>{format(day.date, 'd')}</span>
                {day.totalActivity > 0 && (
                  <div className={`${styles.activityIndicator} ${styles[`level${day.level}`]}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          className={styles.overlay}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className={styles.content}>
            {loading ? (
              <div className={styles.loading}>Loading activity...</div>
            ) : (
              renderMonthlyCalendar()
            )}
          </div>

          {hoveredDay && hoveredDay.totalActivity > 0 && (
            <div className={styles.tooltip}>
              <div className={styles.tooltipDate}>
                {format(hoveredDay.date, 'MMM d, yyyy')}
              </div>
              <div className={styles.tooltipStats}>
                {hoveredDay.journalCount > 0 && (
                  <span>{hoveredDay.journalCount} journal {hoveredDay.journalCount === 1 ? 'entry' : 'entries'}</span>
                )}
                {hoveredDay.goalsCount > 0 && (
                  <span>{hoveredDay.goalsCount} goal{hoveredDay.goalsCount === 1 ? '' : 's'} completed</span>
                )}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

