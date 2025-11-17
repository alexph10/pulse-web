'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '../../contexts/ToastContext';

interface Goal {
  id: string;
  title: string;
  description: string;
  target_value: number;
  current_value: number;
  unit: string;
  category: string;
  status: 'active' | 'completed' | 'archived' | 'paused';
  due_date: string | null;
  created_at: string;
  // Enhanced fields
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  tags?: string[];
  start_date?: string;
  completed_at?: string;
  reminder_enabled?: boolean;
  reminder_frequency?: 'daily' | 'weekly' | 'monthly' | null;
  last_updated_value_at?: string;
  why?: string;
  notes?: string;
  streak_count?: number;
  longest_streak?: number;
  last_streak_update?: string;
  is_public?: boolean;
  parent_goal_id?: string;
}

export default function Goals() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewGoalForm, setShowNewGoalForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('active');
  
  // Form state
  const [newGoal, setNewGoal] = useState<{
    title: string;
    description: string;
    target_value: number;
    current_value: number;
    unit: string;
    category: string;
    due_date: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    why: string;
    tags: string[];
  }>({
    title: '',
    description: '',
    target_value: 10,
    current_value: 0,
    unit: 'times',
    category: 'personal',
    due_date: '',
    priority: 'medium',
    why: '',
    tags: []
  });

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user, filterStatus]);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('goals')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      } else {
        query = query.neq('status', 'archived');
      }

      const { data, error } = await query;
      if (error) throw error;
      setGoals(data || []);
    } catch (err) {
      showToast('Failed to fetch goals. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const createGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('goals')
        .insert([{
          user_id: user?.id,
          ...newGoal,
          status: 'active'
        }]);

      if (error) throw error;
      
      setNewGoal({
        title: '',
        description: '',
        target_value: 10,
        current_value: 0,
        unit: 'times',
        category: 'personal',
        due_date: '',
        priority: 'medium',
        why: '',
        tags: []
      });
      setShowNewGoalForm(false);
      fetchGoals();
    } catch (err) {
      showToast('Failed to create goal. Please try again.', 'error');
    }
  };

  const updateGoalProgress = async (goalId: string, newValue: number, targetValue: number) => {
    try {
      const { error } = await supabase
        .from('goals')
        .update({ 
          current_value: newValue,
          status: newValue >= targetValue ? 'completed' : 'active'
        })
        .eq('id', goalId);

      if (error) throw error;
      fetchGoals();
    } catch (err) {
      showToast('Failed to update goal. Please try again.', 'error');
    }
  };

  const deleteGoal = async (goalId: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;
    
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', goalId);

      if (error) throw error;
      fetchGoals();
    } catch (err) {
      showToast('Failed to delete goal. Please try again.', 'error');
    }
  };

  const archiveGoal = async (goalId: string) => {
    try {
      const { error } = await supabase
        .from('goals')
        .update({ status: 'archived' })
        .eq('id', goalId);

      if (error) throw error;
      fetchGoals();
    } catch (err) {
      showToast('Failed to archive goal. Please try again.', 'error');
    }
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getDaysUntilDue = (dueDate: string | null) => {
    if (!dueDate) return null;
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen p-8" style={{ background: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-family-satoshi)',
              marginBottom: '8px'
            }}>
              Goals
            </h1>
            <p style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-family-switzer)'
            }}>
              Track and achieve your personal goals
            </p>
          </div>
          
          <button
            onClick={() => setShowNewGoalForm(!showNewGoalForm)}
            style={{
              padding: '10px 20px',
              background: showNewGoalForm ? 'transparent' : 'var(--accent-primary)',
              color: showNewGoalForm ? 'var(--accent-primary)' : 'var(--brand-white)',
              border: showNewGoalForm ? '2px solid var(--accent-primary)' : 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 600,
              fontFamily: 'var(--font-family-satoshi)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            {showNewGoalForm ? 'Cancel' : 'New Goal'}
          </button>
        </div>

        {/* Filter Tabs */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '32px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '0'
        }}>
          {(['all', 'active', 'completed'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              style={{
                padding: '12px 24px',
                background: 'transparent',
                color: filterStatus === status ? 'var(--text-primary)' : 'var(--text-tertiary)',
                border: 'none',
                borderBottom: filterStatus === status ? '2px solid var(--error)' : '2px solid transparent',
                fontSize: '14px',
                fontWeight: filterStatus === status ? 600 : 500,
                fontFamily: 'var(--font-family-satoshi)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'capitalize'
              }}
            >
              {status === 'all' ? 'All Goals' : `${status.charAt(0).toUpperCase() + status.slice(1)}`}
            </button>
          ))}
        </div>

        {/* New Goal Form */}
        {showNewGoalForm && (
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-lg)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: 'var(--brand-white)',
              fontFamily: 'var(--font-family-satoshi)',
              marginBottom: '24px'
            }}>
              Create New Goal
            </h3>
            
            <form onSubmit={createGoal}>
              <div style={{ display: 'grid', gap: '20px' }}>
                {/* Title */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--brand-white)',
                    fontFamily: 'var(--font-family-satoshi)',
                    marginBottom: '8px'
                  }}>
                    Goal Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    placeholder="e.g., Read 12 books this year"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'var(--overlay-white-overlay-subtle)',
                      border: '1px solid var(--overlay-white-overlay-light)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontFamily: 'var(--font-family-satoshi)',
                      color: 'var(--brand-white)',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Description */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-family-satoshi)',
                    marginBottom: '8px'
                  }}>
                    Description (optional)
                  </label>
                  <textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    placeholder="Add more details about your goal..."
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'var(--overlay-white-overlay-subtle)',
                      border: '1px solid var(--overlay-white-overlay-light)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontFamily: 'var(--font-family-satoshi)',
                      color: 'var(--brand-white)',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Target Value & Unit */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--brand-white)',
                      fontFamily: 'var(--font-family-satoshi)',
                      marginBottom: '8px'
                    }}>
                      Target Value
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newGoal.target_value}
                      onChange={(e) => setNewGoal({ ...newGoal, target_value: parseInt(e.target.value) })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontFamily: 'var(--font-family-satoshi)',
                        color: 'var(--brand-white)',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--brand-white)',
                      fontFamily: 'var(--font-family-satoshi)',
                      marginBottom: '8px'
                    }}>
                      Unit
                    </label>
                    <input
                      type="text"
                      required
                      value={newGoal.unit}
                      onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                      placeholder="books, miles, etc."
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontFamily: 'var(--font-family-satoshi)',
                        color: 'var(--brand-white)',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Category & Due Date */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--brand-white)',
                      fontFamily: 'var(--font-family-satoshi)',
                      marginBottom: '8px'
                    }}>
                      Category
                    </label>
                    <select
                      value={newGoal.category}
                      onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontFamily: 'var(--font-family-satoshi)',
                        color: 'var(--brand-white)',
                        outline: 'none'
                      }}
                    >
                      <option value="personal" style={{ background: 'var(--surface)' }}>Personal</option>
                      <option value="health" style={{ background: 'var(--surface)' }}>Health</option>
                      <option value="career" style={{ background: 'var(--surface)' }}>Career</option>
                      <option value="learning" style={{ background: 'var(--surface)' }}>Learning</option>
                      <option value="financial" style={{ background: 'var(--surface)' }}>Financial</option>
                      <option value="social" style={{ background: 'var(--surface)' }}>Social</option>
                    </select>
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--brand-white)',
                      fontFamily: 'var(--font-family-satoshi)',
                      marginBottom: '8px'
                    }}>
                      Due Date (optional)
                    </label>
                    <input
                      type="date"
                      value={newGoal.due_date}
                      onChange={(e) => setNewGoal({ ...newGoal, due_date: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontFamily: 'var(--font-family-satoshi)',
                        color: 'var(--brand-white)',
                        outline: 'none',
                        colorScheme: 'dark'
                      }}
                    />
                  </div>
                </div>

                {/* Priority & Why */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--brand-white)',
                      fontFamily: 'var(--font-family-satoshi)',
                      marginBottom: '8px'
                    }}>
                      Priority
                    </label>
                    <select
                      value={newGoal.priority}
                      onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value as 'low' | 'medium' | 'high' | 'urgent' })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontFamily: 'var(--font-family-satoshi)',
                        color: 'var(--brand-white)',
                        outline: 'none'
                      }}
                    >
                      <option value="low" style={{ background: 'var(--surface)' }}>Low</option>
                      <option value="medium" style={{ background: 'var(--surface)' }}>Medium</option>
                      <option value="high" style={{ background: 'var(--surface)' }}>High</option>
                      <option value="urgent" style={{ background: 'var(--surface)' }}>Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--brand-white)',
                      fontFamily: 'var(--font-family-satoshi)',
                      marginBottom: '8px'
                    }}>
                      Why is this important? (optional)
                    </label>
                    <input
                      type="text"
                      value={newGoal.why}
                      onChange={(e) => setNewGoal({ ...newGoal, why: e.target.value })}
                      placeholder="To improve my mental health..."
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontFamily: 'var(--font-family-satoshi)',
                        color: 'var(--brand-white)',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: 'var(--accent-primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-family-satoshi)',
                    cursor: 'pointer',
                    marginTop: '8px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.9';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Goals List */}
        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 0',
            color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-family-satoshi)',
            fontSize: '14px'
          }}>
            Loading goals...
          </div>
        ) : goals.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 0'
          }}>
            <p style={{
              fontSize: '16px',
              color: 'var(--text-tertiary)',
              fontFamily: 'var(--font-family-switzer)',
              marginBottom: '24px'
            }}>
              {filterStatus === 'active' ? 'No active goals yet' : 
               filterStatus === 'completed' ? 'No completed goals yet' : 
               'No goals yet'}
            </p>
            {!showNewGoalForm && (
              <button
                onClick={() => setShowNewGoalForm(true)}
                style={{
                  padding: '12px 24px',
                  background: 'var(--accent-primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-family-satoshi)',
                  cursor: 'pointer',
                  transition: 'opacity 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                Create Your First Goal
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {goals.map(goal => {
              const progress = getProgressPercentage(goal.current_value, goal.target_value);
              const daysUntilDue = getDaysUntilDue(goal.due_date);
              const isOverdue = daysUntilDue !== null && daysUntilDue < 0;
              const isDueSoon = daysUntilDue !== null && daysUntilDue <= 7 && daysUntilDue >= 0;

              return (
                <div
                  key={goal.id}
                  style={{
                    background: 'var(--surface)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid var(--border-subtle)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.08)';
                    e.currentTarget.style.borderColor = 'var(--border-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  }}
                >
                  {/* Header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '16px'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <h3 style={{
                          fontSize: '18px',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          fontFamily: 'var(--font-family-satoshi)',
                          margin: 0
                        }}>
                          {goal.title}
                        </h3>
                        {goal.priority && (
                          <span style={{
                            padding: '4px 12px',
                            background: 
                              goal.priority === 'urgent' ? 'var(--overlay-backdrop-subtle)' :
                              goal.priority === 'high' ? 'var(--overlay-backdrop-subtle)' :
                              goal.priority === 'medium' ? 'var(--overlay-backdrop-subtle)' :
                              'var(--overlay-white-overlay-subtle)',
                            color: 
                              goal.priority === 'urgent' ? 'var(--error)' :
                              goal.priority === 'high' ? 'var(--accent-primary)' :
                              goal.priority === 'medium' ? 'var(--error)' :
                              'var(--brand-white)',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 600,
                            fontFamily: 'var(--font-family-satoshi)',
                            textTransform: 'uppercase'
                          }}>
                            {goal.priority}
                          </span>
                        )}
                        {goal.status === 'completed' && (
                          <span style={{
                            padding: '4px 12px',
                            background: 'var(--overlay-backdrop-subtle)',
                            color: 'var(--error)',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 600,
                            fontFamily: 'var(--font-family-satoshi)'
                          }}>
                            Completed
                          </span>
                        )}
                      </div>
                      {goal.description && (
                        <p style={{
                          fontSize: '13px',
                          color: 'var(--text-secondary)',
                          fontFamily: 'var(--font-family-switzer)',
                          margin: 0,
                          lineHeight: '1.5'
                        }}>
                          {goal.description}
                        </p>
                      )}
                      {goal.why && (
                        <p style={{
                          fontSize: '13px',
                          color: 'var(--error)',
                          fontFamily: 'var(--font-family-switzer)',
                          margin: '8px 0 0 0',
                          lineHeight: '1.5',
                          fontStyle: 'italic'
                        }}>
                          Why: {goal.why}
                        </p>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                      <button
                        onClick={() => archiveGoal(goal.id)}
                        title="Archive goal"
                        style={{
                          padding: '8px 12px',
                          background: 'transparent',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '8px',
                          color: 'var(--text-tertiary)',
                          fontSize: '12px',
                          cursor: 'pointer',
                          fontFamily: 'var(--font-family-satoshi)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--text-secondary)';
                          e.currentTarget.style.color = 'var(--text-secondary)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--border-subtle)';
                          e.currentTarget.style.color = 'var(--text-tertiary)';
                        }}
                      >
                        Archive
                      </button>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        title="Delete goal"
                        style={{
                          padding: '8px 12px',
                          background: 'transparent',
                          border: '1px solid rgba(224, 145, 197, 0.3)',
                          borderRadius: '8px',
                          color: '#E091C5',
                          fontSize: '12px',
                          cursor: 'pointer',
                          fontFamily: 'var(--font-family-satoshi)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(224, 145, 197, 0.1)';
                          e.currentTarget.style.borderColor = '#E091C5';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.borderColor = 'rgba(224, 145, 197, 0.3)';
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Category & Due Date */}
                  <div style={{
                    display: 'flex',
                    gap: '16px',
                    marginBottom: '16px',
                    fontSize: '12px',
                    color: 'var(--text-tertiary)',
                    fontFamily: 'var(--font-family-switzer)'
                  }}>
                    <span style={{
                      padding: '4px 12px',
                      background: 'var(--surface-elevated)',
                      borderRadius: '6px',
                      textTransform: 'capitalize'
                    }}>
                      {goal.category}
                    </span>
                    {daysUntilDue !== null && (
                      <span style={{
                        padding: '4px 12px',
                        background: isOverdue ? 'rgba(224, 145, 197, 0.1)' : isDueSoon ? 'rgba(229, 168, 98, 0.1)' : 'var(--surface-elevated)',
                        color: isOverdue ? '#E091C5' : isDueSoon ? '#E5A862' : 'var(--text-tertiary)',
                        borderRadius: '6px',
                        fontWeight: 500
                      }}>
                        {isOverdue 
                          ? `${Math.abs(daysUntilDue)}d overdue` 
                          : daysUntilDue === 0 
                          ? 'Due today' 
                          : `${daysUntilDue}d left`}
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <span style={{
                        fontSize: '13px',
                        color: 'var(--text-secondary)',
                        fontFamily: 'var(--font-family-switzer)'
                      }}>
                        {goal.current_value} / {goal.target_value} {goal.unit}
                      </span>
                      <span style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: progress === 100 ? '#C84B4B' : '#B8A8D8',
                        fontFamily: 'var(--font-family-satoshi)'
                      }}>
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '12px',
                      background: 'var(--surface-elevated)',
                      borderRadius: '6px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${progress}%`,
                        height: '100%',
                        background: progress === 100 ? '#C84B4B' : '#8B2F2F',
                        borderRadius: '6px',
                        transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                      }} />
                    </div>
                  </div>

                  {/* Progress Controls */}
                  {goal.status === 'active' && (
                    <div style={{
                      display: 'flex',
                      gap: '8px'
                    }}>
                      <button
                        onClick={() => updateGoalProgress(goal.id, Math.max(0, goal.current_value - 1), goal.target_value)}
                        disabled={goal.current_value === 0}
                        style={{
                          flex: 1,
                          padding: '10px',
                          background: 'transparent',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '8px',
                          color: 'var(--text-secondary)',
                          fontSize: '13px',
                          fontWeight: 600,
                          fontFamily: 'var(--font-family-satoshi)',
                          cursor: goal.current_value === 0 ? 'not-allowed' : 'pointer',
                          opacity: goal.current_value === 0 ? 0.5 : 1,
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (goal.current_value > 0) {
                            e.currentTarget.style.background = 'var(--surface-elevated)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        -1
                      </button>
                      <button
                        onClick={() => updateGoalProgress(goal.id, goal.current_value + 1, goal.target_value)}
                        disabled={goal.current_value >= goal.target_value}
                        style={{
                          flex: 1,
                          padding: '10px',
                          background: goal.current_value >= goal.target_value ? 'transparent' : '#8B2F2F',
                          border: goal.current_value >= goal.target_value ? '1px solid var(--border-subtle)' : 'none',
                          borderRadius: '8px',
                          color: goal.current_value >= goal.target_value ? 'var(--text-secondary)' : '#FFFFFF',
                          fontSize: '13px',
                          fontWeight: 600,
                          fontFamily: 'var(--font-family-satoshi)',
                          cursor: goal.current_value >= goal.target_value ? 'not-allowed' : 'pointer',
                          opacity: goal.current_value >= goal.target_value ? 0.5 : 1,
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (goal.current_value < goal.target_value) {
                            e.currentTarget.style.opacity = '0.9';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = '1';
                        }}
                      >
                        +1
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
