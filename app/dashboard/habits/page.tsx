'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '../../contexts/ToastContext';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { 
  Plus, 
  CheckCircle, 
  Circle, 
  Trash, 
  PencilSimple,
  Flame,
  Calendar,
  TrendUp
} from '@phosphor-icons/react';
import { format, isToday, isYesterday, startOfWeek, eachDayOfInterval, parseISO } from 'date-fns';

interface Habit {
  id: string;
  name: string;
  description: string | null;
  category: 'health' | 'productivity' | 'mindfulness' | 'social' | 'custom';
  icon: string;
  color: string;
  created_at: string;
}

interface HabitCompletion {
  id: string;
  habit_id: string;
  completed_date: string;
  created_at: string;
}

interface HabitWithStats extends Habit {
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  totalCompletions: number;
  completedToday: boolean;
  completedDates: string[];
}

const categoryColors: Record<string, string> = {
  health: '#10b981',
  productivity: '#3b82f6',
  mindfulness: '#8b5cf6',
  social: '#f59e0b',
  custom: '#E8B86D'
};

const defaultHabits = [
  { name: 'Morning Meditation', description: 'Start your day with mindfulness', category: 'mindfulness' as const, icon: '', color: '#8b5cf6' },
  { name: 'Exercise', description: '30 minutes of physical activity', category: 'health' as const, icon: '', color: '#10b981' },
  { name: 'Read for 30 minutes', description: 'Expand your knowledge', category: 'productivity' as const, icon: '', color: '#3b82f6' },
  { name: 'Drink 8 glasses of water', description: 'Stay hydrated', category: 'health' as const, icon: '', color: '#10b981' },
  { name: 'Journal Entry', description: 'Reflect on your day', category: 'mindfulness' as const, icon: '', color: '#8b5cf6' },
  { name: 'No Social Media', description: 'Digital detox', category: 'productivity' as const, icon: '', color: '#3b82f6' },
];

export default function Habits() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [habits, setHabits] = useState<HabitWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewHabitForm, setShowNewHabitForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    category: 'custom' as const,
    icon: '',
    color: '#E8B86D'
  });

  useEffect(() => {
    if (user) {
      fetchHabits();
    }
  }, [user, selectedDate]);

  const fetchHabits = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch habits
      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (habitsError) throw habitsError;

      // Fetch completions for the current week
      const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const { data: completionsData, error: completionsError } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('user_id', user.id)
        .gte('completed_date', format(weekStart, 'yyyy-MM-dd'))
        .lte('completed_date', format(weekEnd, 'yyyy-MM-dd'));

      if (completionsError) throw completionsError;

      // Calculate stats for each habit
      const habitsWithStats: HabitWithStats[] = await Promise.all(
        (habitsData || []).map(async (habit) => {
          // Get all completions for this habit
          const { data: allCompletions } = await supabase
            .from('habit_completions')
            .select('completed_date')
            .eq('habit_id', habit.id)
            .eq('user_id', user.id)
            .order('completed_date', { ascending: false });

          const completedDates = (allCompletions || []).map(c => c.completed_date);
          const todayStr = format(new Date(), 'yyyy-MM-dd');
          const completedToday = completedDates.includes(todayStr);

          // Calculate current streak
          let currentStreak = 0;
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          for (let i = 0; i < 365; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(checkDate.getDate() - i);
            const dateStr = format(checkDate, 'yyyy-MM-dd');

            if (completedDates.includes(dateStr)) {
              currentStreak++;
            } else {
              if (i === 0) continue; // Don't break if today isn't completed yet
              break;
            }
          }

          // Calculate longest streak
          let longestStreak = 0;
          let tempStreak = 0;
          const sortedDates = [...completedDates].sort();

          for (let i = 0; i < sortedDates.length; i++) {
            if (i === 0) {
              tempStreak = 1;
            } else {
              const prevDate = parseISO(sortedDates[i - 1]);
              const currDate = parseISO(sortedDates[i]);
              const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

              if (diffDays === 1) {
                tempStreak++;
              } else {
                longestStreak = Math.max(longestStreak, tempStreak);
                tempStreak = 1;
              }
            }
          }
          longestStreak = Math.max(longestStreak, tempStreak);

          // Calculate completion rate (last 30 days)
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          const recentCompletions = completedDates.filter(
            date => parseISO(date) >= thirtyDaysAgo
          ).length;
          const completionRate = Math.round((recentCompletions / 30) * 100);

          // Get completions for selected week
          const weekCompletions = (completionsData || [])
            .filter(c => c.habit_id === habit.id)
            .map(c => c.completed_date);

          return {
            ...habit,
            currentStreak,
            longestStreak,
            completionRate,
            totalCompletions: completedDates.length,
            completedToday,
            completedDates: weekCompletions
          };
        })
      );

      setHabits(habitsWithStats);
    } catch (err) {
      showToast('Failed to fetch habits. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const createHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase
        .from('habits')
        .insert([{
          user_id: user.id,
          ...newHabit
        }]);

      if (error) throw error;

      setNewHabit({
        name: '',
        description: '',
        category: 'custom',
        icon: '',
        color: '#E8B86D'
      });
      setShowNewHabitForm(false);
      fetchHabits();
    } catch (err) {
      showToast('Failed to create habit. Please try again.', 'error');
    }
  };

  const addDefaultHabits = async () => {
    if (!user) return;
    if (!confirm('Add all default habits to your list?')) return;

    try {
      const habitsToAdd = defaultHabits.map(habit => ({
        user_id: user.id,
        ...habit
      }));

      const { error } = await supabase
        .from('habits')
        .insert(habitsToAdd);

      if (error) throw error;
      fetchHabits();
    } catch (err) {
      showToast('Failed to add default habits. Some may already exist.', 'error');
    }
  };

  const toggleHabitCompletion = async (habitId: string, date: Date) => {
    if (!user) return;

    const dateStr = format(date, 'yyyy-MM-dd');
    const habit = habits.find(h => h.id === habitId);
    const isCompleted = habit?.completedDates.includes(dateStr);

    try {
      if (isCompleted) {
        // Remove completion
        const { error } = await supabase
          .from('habit_completions')
          .delete()
          .eq('habit_id', habitId)
          .eq('user_id', user.id)
          .eq('completed_date', dateStr);

        if (error) throw error;
      } else {
        // Add completion
        const { error } = await supabase
          .from('habit_completions')
          .insert([{
            habit_id: habitId,
            user_id: user.id,
            completed_date: dateStr
          }]);

        if (error) throw error;
      }

      fetchHabits();
    } catch (err) {
      showToast('Failed to update habit. Please try again.', 'error');
    }
  };

  const deleteHabit = async (habitId: string) => {
    if (!confirm('Are you sure you want to delete this habit?')) return;

    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', habitId);

      if (error) throw error;
      fetchHabits();
    } catch (err) {
      showToast('Failed to delete habit. Please try again.', 'error');
    }
  };

  const getWeekDays = () => {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    return eachDayOfInterval({
      start: weekStart,
      end: new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000)
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white/60">Loading habits...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen p-8" style={{ background: 'var(--background)' }}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: '8px',
                fontFamily: 'var(--font-family-satoshi)'
              }}>
                Habits
              </h1>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '0.9rem'
              }}>
                Build consistency, one day at a time
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {habits.length === 0 && (
                <button
                  onClick={addDefaultHabits}
                  style={{
                    padding: '10px 20px',
                    background: 'var(--accent-secondary)',
                    color: 'var(--text-primary)',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Plus size={18} weight="bold" />
                  Add Default Habits
                </button>
              )}
              <button
                onClick={() => setShowNewHabitForm(!showNewHabitForm)}
                style={{
                  padding: '10px 20px',
                  background: 'var(--accent-primary)',
                  color: 'var(--text-primary)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Plus size={18} weight="bold" />
                New Habit
              </button>
            </div>
          </div>

          {/* New Habit Form */}
          {showNewHabitForm && (
            <div style={{
              background: 'var(--surface)',
              padding: '24px',
              borderRadius: '12px',
              marginBottom: '24px',
              border: '1px solid var(--border-subtle)'
            }}>
              <form onSubmit={createHabit}>
                <div style={{ display: 'grid', gap: '16px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem',
                      fontWeight: 500
                    }}>
                      Habit Name *
                    </label>
                    <input
                      type="text"
                      value={newHabit.name}
                      onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                      required
                      placeholder="e.g., Morning Meditation"
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: 'var(--background-secondary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem',
                      fontWeight: 500
                    }}>
                      Description
                    </label>
                    <textarea
                      value={newHabit.description}
                      onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                      placeholder="Optional description"
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: 'var(--background-secondary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        fontWeight: 500
                      }}>
                        Category
                      </label>
                      <select
                        value={newHabit.category}
                        onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value as any })}
                        style={{
                          width: '100%',
                          padding: '12px',
                          background: 'var(--background-secondary)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '8px',
                          color: 'var(--text-primary)',
                          fontSize: '0.95rem'
                        }}
                      >
                        <option value="health">Health</option>
                        <option value="productivity">Productivity</option>
                        <option value="mindfulness">Mindfulness</option>
                        <option value="social">Social</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        fontWeight: 500
                      }}>
                        Icon
                      </label>
                      <input
                        type="text"
                        value={newHabit.icon}
                        onChange={(e) => setNewHabit({ ...newHabit, icon: e.target.value })}
                        placeholder="Icon"
                        maxLength={2}
                        style={{
                          width: '100%',
                          padding: '12px',
                          background: 'var(--background-secondary)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '8px',
                          color: 'var(--text-primary)',
                          fontSize: '1.2rem',
                          textAlign: 'center'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => setShowNewHabitForm(false)}
                      style={{
                        padding: '10px 20px',
                        background: 'transparent',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{
                        padding: '10px 20px',
                        background: 'var(--accent-primary)',
                        color: 'var(--text-primary)',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: 500
                      }}
                    >
                      Create Habit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Habits List */}
          {habits.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: 'var(--surface)',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📋</div>
              <h3 style={{
                fontSize: '1.5rem',
                color: 'var(--text-primary)',
                marginBottom: '8px'
              }}>
                No habits yet
              </h3>
              <p style={{
                color: 'var(--text-secondary)',
                marginBottom: '24px'
              }}>
                Start building good habits by creating your first one
              </p>
              <button
                onClick={addDefaultHabits}
                style={{
                  padding: '12px 24px',
                  background: 'var(--accent-primary)',
                  color: 'var(--text-primary)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 500
                }}
              >
                Add Default Habits
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {habits.map((habit) => {
                const weekDays = getWeekDays();
                return (
                  <div
                    key={habit.id}
                    style={{
                      background: 'var(--surface)',
                      padding: '24px',
                      borderRadius: '12px',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    {/* Habit Header */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '20px'
                    }}>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flex: 1 }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          background: `${habit.color}20`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '24px',
                          border: `2px solid ${habit.color}40`
                        }}>
                          {habit.icon || ''}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3 style={{
                            fontSize: '1.25rem',
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                            marginBottom: '4px'
                          }}>
                            {habit.name}
                          </h3>
                          {habit.description && (
                            <p style={{
                              color: 'var(--text-secondary)',
                              fontSize: '0.9rem',
                              marginBottom: '12px'
                            }}>
                              {habit.description}
                            </p>
                          )}
                          <div style={{
                            display: 'flex',
                            gap: '16px',
                            flexWrap: 'wrap',
                            marginTop: '12px'
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              color: 'var(--text-secondary)',
                              fontSize: '0.85rem'
                            }}>
                              <Flame size={16} weight="fill" color={habit.completedToday ? '#ef4444' : 'var(--text-disabled)'} />
                              <span style={{ fontWeight: 500 }}>{habit.currentStreak} day streak</span>
                            </div>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              color: 'var(--text-secondary)',
                              fontSize: '0.85rem'
                            }}>
                              <TrendUp size={16} weight="fill" />
                              <span>{habit.completionRate}% completion rate</span>
                            </div>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              color: 'var(--text-secondary)',
                              fontSize: '0.85rem'
                            }}>
                              <Calendar size={16} weight="fill" />
                              <span>{habit.totalCompletions} total</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteHabit(habit.id)}
                        style={{
                          padding: '8px',
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Delete habit"
                      >
                        <Trash size={18} weight="regular" />
                      </button>
                    </div>

                    {/* Week Calendar */}
                    <div>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: '8px',
                        marginTop: '16px'
                      }}>
                        {weekDays.map((day, index) => {
                          const dateStr = format(day, 'yyyy-MM-dd');
                          const isCompleted = habit.completedDates.includes(dateStr);
                          const isDayToday = isToday(day);
                          const isDayYesterday = isYesterday(day);

                          return (
                            <button
                              key={index}
                              onClick={() => toggleHabitCompletion(habit.id, day)}
                              style={{
                                aspectRatio: '1',
                                borderRadius: '8px',
                                border: isDayToday 
                                  ? `2px solid ${habit.color}` 
                                  : `1px solid var(--border-subtle)`,
                                background: isCompleted 
                                  ? habit.color 
                                  : 'var(--background-secondary)',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '4px',
                                transition: 'all 0.2s',
                                position: 'relative'
                              }}
                              onMouseEnter={(e) => {
                                if (!isCompleted) {
                                  e.currentTarget.style.background = `${habit.color}30`;
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isCompleted) {
                                  e.currentTarget.style.background = 'var(--background-secondary)';
                                }
                              }}
                              title={format(day, 'EEEE, MMMM d')}
                            >
                              {isCompleted ? (
                                <CheckCircle size={20} weight="fill" color="white" />
                              ) : (
                                <Circle size={20} weight="regular" color="var(--text-disabled)" />
                              )}
                              <span style={{
                                fontSize: '0.7rem',
                                color: isCompleted ? 'white' : 'var(--text-secondary)',
                                fontWeight: isDayToday ? 600 : 400
                              }}>
                                {format(day, 'd')}
                              </span>
                              {isDayToday && (
                                <span style={{
                                  position: 'absolute',
                                  bottom: '2px',
                                  fontSize: '0.6rem',
                                  color: habit.color,
                                  fontWeight: 600
                                }}>
                                  Today
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: '8px',
                        marginTop: '8px',
                        paddingTop: '8px',
                        borderTop: '1px solid var(--border-subtle)'
                      }}>
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                          <div
                            key={index}
                            style={{
                              textAlign: 'center',
                              fontSize: '0.75rem',
                              color: 'var(--text-tertiary)',
                              fontWeight: 500
                            }}
                          >
                            {day}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
