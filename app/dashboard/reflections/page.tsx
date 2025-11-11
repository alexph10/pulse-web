'use client'

import { useState, useEffect } from 'react';
import DashboardNavbar from '../../components/dashboard-navbar/dashboard-navbar';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '@/lib/supabase';

type Mood = 'great' | 'good' | 'okay' | 'low' | 'tough';

interface Reflection {
  id: string;
  mood: Mood;
  energy_level: number;
  gratitude: string;
  note: string;
  created_at: string;
}

const moodOptions: { value: Mood; label: string; color: string }[] = [
  { value: 'great', label: 'Great', color: '#9EF4D0' },
  { value: 'good', label: 'Good', color: '#B8A8D8' },
  { value: 'okay', label: 'Okay', color: '#E5A862' },
  { value: 'low', label: 'Low', color: '#E091C5' },
  { value: 'tough', label: 'Tough', color: '#A1937F' },
];

export default function Reflections() {
  const { user } = useAuth();
  const [mood, setMood] = useState<Mood | null>(null);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [gratitude, setGratitude] = useState('');
  const [note, setNote] = useState('');
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [todayReflection, setTodayReflection] = useState<Reflection | null>(null);
  const [isEditingToday, setIsEditingToday] = useState(false);
  const [streak, setStreak] = useState(0);

  // Fetch reflections
  useEffect(() => {
    if (user) {
      fetchReflections();
    }
  }, [user]);

  const fetchReflections = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reflections')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(30);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      const allReflections = data || [];
      setReflections(allReflections);

      // Check if user already reflected today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayEntry = allReflections.find(r => {
        const reflectionDate = new Date(r.created_at);
        reflectionDate.setHours(0, 0, 0, 0);
        return reflectionDate.getTime() === today.getTime();
      });

      if (todayEntry) {
        setTodayReflection(todayEntry);
        setMood(todayEntry.mood);
        setEnergyLevel(todayEntry.energy_level);
        setGratitude(todayEntry.gratitude || '');
        setNote(todayEntry.note || '');
      } else {
        setTodayReflection(null);
      }

      // Calculate streak
      calculateStreak(allReflections);
    } catch (err: any) {
      console.error('Error fetching reflections:', err);
      setError(err?.message || 'Failed to load reflections');
    } finally {
      setLoading(false);
    }
  };

  const calculateStreak = (allReflections: Reflection[]) => {
    if (allReflections.length === 0) {
      setStreak(0);
      return;
    }

    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check each day going backwards
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      checkDate.setHours(0, 0, 0, 0);

      const hasReflection = allReflections.some(r => {
        const reflectionDate = new Date(r.created_at);
        reflectionDate.setHours(0, 0, 0, 0);
        return reflectionDate.getTime() === checkDate.getTime();
      });

      if (hasReflection) {
        currentStreak++;
      } else {
        // If we're checking today or yesterday and there's no reflection, continue checking
        // This allows for "today not done yet" scenario
        if (i === 0) continue;
        break;
      }
    }

    setStreak(currentStreak);
  };

  const handleSaveReflection = async () => {
    if (!mood || !user) {
      setError('Please select a mood');
      return;
    }

    try {
      setSaving(true);
      setError('');

      if (todayReflection) {
        // Update existing reflection
        const { error } = await supabase
          .from('reflections')
          .update({
            mood,
            energy_level: energyLevel,
            gratitude: gratitude.trim(),
            note: note.trim(),
          })
          .eq('id', todayReflection.id);

        if (error) throw error;
      } else {
        // Insert new reflection
        const { error } = await supabase
          .from('reflections')
          .insert({
            user_id: user.id,
            mood,
            energy_level: energyLevel,
            gratitude: gratitude.trim(),
            note: note.trim(),
          });

        if (error) throw error;
      }

      setIsEditingToday(false);

      // Refresh list
      fetchReflections();
    } catch (err: any) {
      setError(err.message || 'Failed to save reflection');
    } finally {
      setSaving(false);
    }
  };

  const getMoodColor = (moodValue: Mood) => {
    return moodOptions.find(m => m.value === moodValue)?.color || '#9EF4D0';
  };

  return (
    <div className="min-h-screen p-8" style={{ background: 'var(--background)' }}>
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.2);
          }
        }
      `}</style>
      
      <DashboardNavbar isLoading={saving} />

      <main style={{
        maxWidth: '680px',
        margin: '40px auto 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          {/* Streak Counter */}
          {streak > 0 && (
            <div style={{
              marginTop: '20px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: 'linear-gradient(135deg, rgba(158, 244, 208, 0.15), rgba(184, 168, 216, 0.15))',
              border: '2px solid rgba(158, 244, 208, 0.4)',
              borderRadius: '50px',
              fontSize: '16px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-family-satoshi)',
              boxShadow: '0 2px 8px rgba(158, 244, 208, 0.15)'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#9EF4D0',
                animation: 'pulse 2s ease-in-out infinite'
              }} />
              <span>{streak} day streak{streak !== 1 ? '' : ''}</span>
            </div>
          )}
        </div>

        {/* Today's Status Message */}
        {todayReflection && !isEditingToday && (
          <div style={{
            padding: '20px 24px',
            background: 'linear-gradient(135deg, rgba(158, 244, 208, 0.08), rgba(184, 168, 216, 0.08))',
            border: '1px solid rgba(158, 244, 208, 0.25)',
            borderRadius: '14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 1px 3px rgba(158, 244, 208, 0.1)'
          }}>
            <div>
              <p style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#9EF4D0',
                fontFamily: 'var(--font-family-satoshi)',
                marginBottom: '6px'
              }}>
                You've reflected today
              </p>
              <p style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-family-switzer)'
              }}>
                Mood: {moodOptions.find(m => m.value === todayReflection.mood)?.label} • Energy: {todayReflection.energy_level}/10
              </p>
            </div>
            <button
              onClick={() => setIsEditingToday(true)}
              style={{
                padding: '12px 24px',
                background: 'var(--surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-family-satoshi)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 1px 3px rgba(62, 53, 48, 0.05)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--surface-elevated)';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(62, 53, 48, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--surface)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(62, 53, 48, 0.05)';
              }}
            >
              Edit Today's Reflection
            </button>
          </div>
        )}

        {error && (
          <div style={{
            padding: '12px 16px',
            background: 'rgba(224, 145, 197, 0.1)',
            border: '1px solid rgba(224, 145, 197, 0.3)',
            borderRadius: '8px',
            color: 'var(--text-primary)',
            fontSize: '14px',
            fontFamily: 'var(--font-family-switzer)'
          }}>
            {error}
          </div>
        )}

        {/* Reflection Form Card - Only show if no today reflection OR editing */}
        {(!todayReflection || isEditingToday) && (
        <div style={{
          background: '#3D4A47',
          borderRadius: '20px',
          padding: '32px',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.12)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative paper texture overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 30%, rgba(160, 82, 45, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(160, 82, 45, 0.02) 0%, transparent 50%)',
            pointerEvents: 'none'
          }} />

          {/* Mood Selector */}
          <div style={{ marginBottom: '32px', position: 'relative', zIndex: 1 }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 600,
              color: '#FFFFFF',
              fontFamily: 'var(--font-family-satoshi)',
              marginBottom: '16px',
              letterSpacing: '-0.01em'
            }}>
              How are you feeling?
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '10px'
            }}>
              {moodOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setMood(option.value)}
                  style={{
                    padding: '12px 10px',
                    background: mood === option.value ? option.color : 'transparent',
                    color: mood === option.value ? '#2D3A37' : 'rgba(255, 255, 255, 0.6)',
                    border: mood === option.value 
                      ? '2px dashed #2D3A37' 
                      : '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    fontFamily: 'var(--font-family-satoshi)',
                    fontSize: '13px',
                    fontWeight: mood === option.value ? 600 : 500
                  }}
                  onMouseEnter={(e) => {
                    if (mood !== option.value) {
                      e.currentTarget.style.borderColor = option.color;
                      e.currentTarget.style.color = option.color;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (mood !== option.value) {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
                    }
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Energy Level */}
          <div style={{ marginBottom: '32px', position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <label style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#FFFFFF',
                fontFamily: 'var(--font-family-satoshi)',
                letterSpacing: '-0.01em'
              }}>
                Energy Level
              </label>
              <div style={{
                background: '#B8A8D8',
                padding: '4px 12px',
                borderRadius: '16px',
                fontSize: '14px',
                fontWeight: 700,
                color: '#2D3A37',
                fontFamily: 'var(--font-family-satoshi)'
              }}>
                {energyLevel}/10
              </div>
            </div>
            
            {/* Custom slider container */}
            <div style={{
              position: 'relative',
              padding: '16px 0'
            }}>
              <input
                type="range"
                min="1"
                max="10"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(Number(e.target.value))}
                style={{
                  width: '100%',
                  height: '8px',
                  borderRadius: '10px',
                  outline: 'none',
                  background: `linear-gradient(to right, 
                    #B8A8D8 0%, 
                    #B8A8D8 ${(energyLevel - 1) * 11.11}%, 
                    rgba(255, 255, 255, 0.2) ${(energyLevel - 1) * 11.11}%, 
                    rgba(255, 255, 255, 0.2) 100%)`,
                  cursor: 'pointer',
                  WebkitAppearance: 'none',
                  appearance: 'none'
                }}
              />
              
              {/* Energy level indicators */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '12px',
                padding: '0 4px'
              }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
                  <div
                    key={level}
                    style={{
                      fontSize: '11px',
                      color: energyLevel >= level ? '#B8A8D8' : 'rgba(255, 255, 255, 0.3)',
                      fontFamily: 'var(--font-family-satoshi)',
                      fontWeight: energyLevel === level ? 700 : 400,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {level}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Gratitude Input */}
          <div style={{ marginBottom: '32px', position: 'relative', zIndex: 1 }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 600,
              color: '#FFFFFF',
              fontFamily: 'var(--font-family-satoshi)',
              marginBottom: '12px',
              letterSpacing: '-0.01em'
            }}>
              What are you grateful for today?
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={gratitude}
                onChange={(e) => setGratitude(e.target.value)}
                placeholder="Something that brought you joy..."
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'var(--font-family-satoshi)',
                  color: '#FFFFFF',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#9EF4D0';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
              />
            </div>
          </div>

          {/* Optional Note */}
          <div style={{ marginBottom: '28px', position: 'relative', zIndex: 1 }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 600,
              color: '#FFFFFF',
              fontFamily: 'var(--font-family-satoshi)',
              marginBottom: '12px',
              letterSpacing: '-0.01em'
            }}>
              Any thoughts to capture? 
              <span style={{ 
                fontWeight: 400, 
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '12px',
                marginLeft: '6px'
              }}>
                (optional)
              </span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What's on your mind..."
              rows={4}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'var(--font-family-satoshi)',
                color: '#FFFFFF',
                outline: 'none',
                transition: 'all 0.3s ease',
                resize: 'vertical',
                lineHeight: '1.6'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#9EF4D0';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
            />
          </div>

          {/* Save Button */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <button
              onClick={handleSaveReflection}
              disabled={!mood || saving}
              style={{
                width: '100%',
                padding: '14px',
                background: mood ? '#9EF4D0' : 'rgba(255, 255, 255, 0.1)',
                color: mood ? '#2D3A37' : 'rgba(255, 255, 255, 0.3)',
                border: mood ? '2px dashed #2D3A37' : '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 700,
                fontFamily: 'var(--font-family-satoshi)',
                cursor: mood ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                letterSpacing: '-0.01em',
                opacity: saving ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (mood && !saving) {
                  e.currentTarget.style.opacity = '0.9';
                }
              }}
              onMouseLeave={(e) => {
                if (!saving) {
                  e.currentTarget.style.opacity = '1';
                }
              }}
            >
              {saving ? 'Saving...' : (todayReflection ? 'Update Reflection' : 'Save Reflection')}
            </button>

            {/* Cancel Button (only show when editing) */}
            {isEditingToday && (
              <button
                onClick={() => {
                  setIsEditingToday(false);
                  // Reset to today's values
                  if (todayReflection) {
                    setMood(todayReflection.mood);
                    setEnergyLevel(todayReflection.energy_level);
                    setGratitude(todayReflection.gratitude || '');
                    setNote(todayReflection.note || '');
                  }
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'transparent',
                  color: 'rgba(255, 255, 255, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-family-satoshi)',
                  cursor: 'pointer',
                  marginTop: '12px',
                  transition: 'all 0.3s ease',
                  letterSpacing: '-0.01em'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
        )}

        {/* Mood Trend Chart */}
        {reflections.length > 1 && (
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 2px 8px rgba(62, 53, 48, 0.04), 0 8px 24px rgba(62, 53, 48, 0.06)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-family-satoshi)',
                margin: 0
              }}>
                Mood Over Time
              </h2>
              <span style={{
                fontSize: '12px',
                color: 'var(--text-tertiary)',
                fontFamily: 'var(--font-family-switzer)'
              }}>
                Last {Math.min(reflections.length, 14)} days
              </span>
            </div>

            {/* Chart */}
            <div style={{
              height: '160px',
              position: 'relative',
              display: 'flex',
              alignItems: 'flex-end',
              gap: '6px',
              padding: '0 0 16px 0'
            }}>
              {reflections.slice(0, 14).reverse().map((reflection, index) => {
                const moodValue = { 'great': 5, 'good': 4, 'okay': 3, 'low': 2, 'tough': 1 }[reflection.mood];
                const height = (moodValue / 5) * 100;
                const color = getMoodColor(reflection.mood);
                const date = new Date(reflection.created_at);
                const isToday = date.toDateString() === new Date().toDateString();

                return (
                  <div
                    key={reflection.id}
                    style={{
                      flex: 1,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      position: 'relative'
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: `${height}%`,
                        background: isToday ? `linear-gradient(180deg, ${color}, ${color}cc)` : color,
                        borderRadius: '8px 8px 0 0',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        opacity: isToday ? 1 : 0.75,
                        cursor: 'pointer',
                        boxShadow: isToday ? `0 -2px 12px ${color}55, 0 0 0 2px ${color}33` : 'none',
                        position: 'relative'
                      }}
                      title={`${moodOptions.find(m => m.value === reflection.mood)?.label} - ${date.toLocaleDateString()}`}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '1';
                        e.currentTarget.style.transform = 'translateY(-6px)';
                        e.currentTarget.style.boxShadow = `0 -4px 16px ${color}66, 0 0 0 2px ${color}44`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = isToday ? '1' : '0.75';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = isToday ? `0 -2px 12px ${color}55, 0 0 0 2px ${color}33` : 'none';
                      }}
                    />
                    <span style={{
                      fontSize: '11px',
                      color: 'var(--text-tertiary)',
                      fontFamily: 'var(--font-family-switzer)',
                      marginTop: '8px',
                      fontWeight: isToday ? 600 : 400
                    }}>
                      {date.getDate()}/{date.getMonth() + 1}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '24px',
              marginTop: '20px',
              paddingTop: '20px',
              borderTop: '1px solid var(--border-subtle)'
            }}>
              {moodOptions.slice(0, 5).map(option => (
                <div key={option.value} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '4px',
                    background: option.color,
                    boxShadow: `0 0 0 3px ${option.color}22`
                  }} />
                  <span style={{
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-family-switzer)',
                    fontWeight: 500
                  }}>
                    {option.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Energy Level Graph */}
        {reflections.length > 1 && (
          <div style={{
            background: '#3D4A47',
            borderRadius: '24px',
            padding: '40px 48px',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.12)',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: '40px'
          }}>
            {/* Decorative paper texture overlay */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                radial-gradient(circle at 20% 50%, rgba(160, 82, 45, 0.03) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(160, 82, 45, 0.02) 0%, transparent 50%)
              `,
              pointerEvents: 'none',
              zIndex: 0
            }} />

            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: '32px',
              position: 'relative',
              zIndex: 1
            }}>
              <h2 style={{
                fontSize: '22px',
                fontWeight: 600,
                color: '#FFFFFF',
                fontFamily: 'var(--font-family-satoshi)',
                margin: 0,
                letterSpacing: '-0.01em'
              }}>
                Energy Levels
              </h2>
              <span style={{
                fontSize: '13px',
                color: 'rgba(255, 255, 255, 0.5)',
                fontFamily: 'var(--font-family-switzer)'
              }}>
                Last {Math.min(reflections.length, 14)} days
              </span>
            </div>

            {/* Chart */}
            <div style={{
              height: '220px',
              position: 'relative',
              display: 'flex',
              alignItems: 'flex-end',
              gap: '8px',
              padding: '0 0 20px 0',
              zIndex: 1
            }}>
              {(() => {
                const recentReflections = reflections.slice(0, 14).reverse();
                const avgEnergy = recentReflections.reduce((sum, r) => sum + r.energy_level, 0) / recentReflections.length;
                
                return recentReflections.map((reflection, index) => {
                  const height = (reflection.energy_level / 10) * 100;
                  const date = new Date(reflection.created_at);
                  const isToday = date.toDateString() === new Date().toDateString();
                  
                  // Color based on energy level
                  const getEnergyColor = (level: number) => {
                    if (level >= 8) return '#9EF4D0'; // Great - mint
                    if (level >= 6) return '#B8A8D8'; // Good - purple
                    if (level >= 4) return '#E5A862'; // Okay - orange
                    return '#E091C5'; // Low - pink
                  };
                  
                  const color = getEnergyColor(reflection.energy_level);

                  return (
                    <div
                      key={reflection.id}
                      style={{
                        flex: 1,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        position: 'relative'
                      }}
                    >
                      {/* Average line indicator */}
                      {index === 0 && (
                        <div style={{
                          position: 'absolute',
                          left: '-8px',
                          right: '-8px',
                          bottom: `${(avgEnergy / 10) * 100}%`,
                          height: '2px',
                          background: 'rgba(255, 255, 255, 0.2)',
                          borderTop: '1px dashed rgba(255, 255, 255, 0.3)',
                          zIndex: 0,
                          width: `${recentReflections.length * 100}%`
                        }}>
                          <span style={{
                            position: 'absolute',
                            right: '0',
                            top: '-8px',
                            fontSize: '10px',
                            color: 'rgba(255, 255, 255, 0.4)',
                            fontFamily: 'var(--font-family-switzer)',
                            background: '#3D4A47',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            whiteSpace: 'nowrap'
                          }}>
                            avg {avgEnergy.toFixed(1)}
                          </span>
                        </div>
                      )}
                      
                      <div
                        style={{
                          width: '100%',
                          height: `${height}%`,
                          background: isToday ? `linear-gradient(180deg, ${color}, ${color}cc)` : color,
                          borderRadius: '8px 8px 0 0',
                          transition: 'all 0.3s ease',
                          opacity: isToday ? 1 : 0.75,
                          cursor: 'pointer',
                          boxShadow: isToday ? `0 -2px 12px ${color}55, 0 0 0 2px ${color}33` : 'none',
                          position: 'relative',
                          zIndex: 1
                        }}
                        title={`Energy: ${reflection.energy_level}/10 - ${date.toLocaleDateString()}`}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = '1';
                          e.currentTarget.style.transform = 'translateY(-6px)';
                          e.currentTarget.style.boxShadow = `0 -4px 16px ${color}66, 0 0 0 2px ${color}44`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = isToday ? '1' : '0.75';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = isToday ? `0 -2px 12px ${color}55, 0 0 0 2px ${color}33` : 'none';
                        }}
                      >
                        {/* Energy value on hover */}
                        <span style={{
                          position: 'absolute',
                          top: '-24px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: '#FFFFFF',
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                          pointerEvents: 'none',
                          background: 'rgba(0, 0, 0, 0.8)',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.opacity = '1';
                        }}
                        >
                          {reflection.energy_level}/10
                        </span>
                      </div>
                      <span style={{
                        fontSize: '11px',
                        color: 'rgba(255, 255, 255, 0.4)',
                        fontFamily: 'var(--font-family-switzer)',
                        marginTop: '8px',
                        fontWeight: isToday ? 600 : 400
                      }}>
                        {date.getDate()}/{date.getMonth() + 1}
                      </span>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Legend */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '24px',
              marginTop: '20px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              position: 'relative',
              zIndex: 1
            }}>
              {[
                { range: '8-10', label: 'High Energy', color: '#9EF4D0' },
                { range: '6-7', label: 'Good Energy', color: '#B8A8D8' },
                { range: '4-5', label: 'Moderate', color: '#E5A862' },
                { range: '1-3', label: 'Low Energy', color: '#E091C5' }
              ].map(item => (
                <div key={item.range} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '4px',
                    background: item.color,
                    boxShadow: `0 0 0 3px ${item.color}22`
                  }} />
                  <span style={{
                    fontSize: '13px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontFamily: 'var(--font-family-switzer)',
                    fontWeight: 500
                  }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reflection History */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2 style={{
              fontSize: '22px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-family-satoshi)',
              margin: 0
            }}>
              Recent Reflections
            </h2>
            {reflections.length > 0 && (
              <span style={{
                fontSize: '14px',
                color: 'var(--text-tertiary)',
                fontFamily: 'var(--font-family-switzer)'
              }}>
                {reflections.length} {reflections.length === 1 ? 'entry' : 'entries'}
              </span>
            )}
          </div>

          {loading ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: 'var(--text-tertiary)',
              fontFamily: 'var(--font-family-switzer)'
            }}>
              Loading...
            </div>
          ) : reflections.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: 'var(--text-tertiary)',
              fontFamily: 'var(--font-family-switzer)',
              fontSize: '16px'
            }}>
              <p style={{ marginBottom: '8px', fontSize: '18px' }}>No reflections yet</p>
              <p style={{ fontSize: '14px', opacity: 0.7 }}>Start your daily check-in above</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {reflections.map((reflection) => (
                <div
                  key={reflection.id}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '20px 24px',
                    boxShadow: '0 1px 3px rgba(62, 53, 48, 0.03)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(62, 53, 48, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(62, 53, 48, 0.03)';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        background: getMoodColor(reflection.mood),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 0 0 4px ${getMoodColor(reflection.mood)}22`
                      }}>
                        <span style={{
                          fontSize: '16px',
                          fontWeight: 700,
                          color: '#2D3A37',
                          fontFamily: 'var(--font-family-satoshi)',
                          textTransform: 'uppercase'
                        }}>
                          {reflection.mood.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <span style={{
                          fontSize: '16px',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          fontFamily: 'var(--font-family-satoshi)',
                          textTransform: 'capitalize'
                        }}>
                          {reflection.mood}
                        </span>
                        <div style={{
                          fontSize: '13px',
                          color: 'var(--text-tertiary)',
                          fontFamily: 'var(--font-family-satoshi)',
                          marginTop: '2px'
                        }}>
                          Energy: {reflection.energy_level}/10
                        </div>
                      </div>
                    </div>
                    <span style={{
                      fontSize: '12px',
                      color: 'var(--text-tertiary)',
                      fontFamily: 'var(--font-family-satoshi)'
                    }}>
                      {new Date(reflection.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  {reflection.gratitude && (
                    <p style={{
                      fontSize: '15px',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-family-switzer)',
                      marginBottom: reflection.note ? '12px' : '0',
                      lineHeight: '1.6'
                    }}>
                      <span style={{ color: 'var(--text-tertiary)' }}>Grateful for: </span>
                      {reflection.gratitude}
                    </p>
                  )}

                  {reflection.note && (
                    <p style={{
                      fontSize: '16px',
                      color: 'var(--text-secondary)',
                      fontFamily: 'var(--font-family-garamond)',
                      lineHeight: '1.75',
                      fontStyle: 'italic'
                    }}>
                      {reflection.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
