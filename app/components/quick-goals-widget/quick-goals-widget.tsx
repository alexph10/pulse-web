'use client'

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';

interface Goal {
  id: string;
  title: string;
  description: string;
  target_value: number;
  current_value: number;
  unit: string;
  status: 'active' | 'completed' | 'archived' | 'paused';
  due_date: string | null;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  why?: string;
}

export default function QuickGoalsWidget() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user]);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setGoals(data || []);
    } catch (err) {
      console.error('Error fetching goals:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateGoalProgress = async (goalId: string, newValue: number) => {
    try {
      const goal = goals.find(g => g.id === goalId);
      if (!goal) return;

      const { error } = await supabase
        .from('goals')
        .update({ 
          current_value: newValue,
          status: newValue >= goal.target_value ? 'completed' : 'active'
        })
        .eq('id', goalId);

      if (error) throw error;
      fetchGoals();
    } catch (err) {
      console.error('Error updating goal:', err);
    }
  };

  const getProgressPercentage = (goal: Goal) => {
    if (!goal.target_value) return 0;
    return Math.min((goal.current_value / goal.target_value) * 100, 100);
  };

  const getDaysUntilDue = (dueDate: string | null) => {
    if (!dueDate) return null;
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div style={{
        background: 'var(--surface)',
        borderRadius: '20px',
        padding: '32px',
        boxShadow: '0 20px 40px rgba(15, 61, 60, 0.08)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          color: 'rgba(15, 61, 60, 0.4)',
          fontFamily: 'var(--font-family-satoshi)',
          fontSize: '14px',
          textAlign: 'center'
        }}>
          Loading goals...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'var(--surface)',
      borderRadius: '20px',
      padding: '32px',
      boxShadow: '0 20px 40px rgba(15, 61, 60, 0.08)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 30%, rgba(160, 82, 45, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(160, 82, 45, 0.02) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        position: 'relative',
        zIndex: 1
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-family-satoshi)',
          margin: 0,
          letterSpacing: '-0.01em'
        }}>
          Active Goals
        </h2>
        <Link 
          href="/dashboard/goals"
          style={{
            fontSize: '12px',
            color: 'var(--accent-primary)',
            fontFamily: 'var(--font-family-satoshi)',
            textDecoration: 'none',
            fontWeight: 500,
            transition: 'opacity 0.3s ease'
          }}
        >
          View All
        </Link>
      </div>

      {/* Goals List */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        position: 'relative',
        zIndex: 1
      }}>
        {goals.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '32px 0'
          }}>
            <p style={{
              fontSize: '14px',
              color: 'rgba(15, 61, 60, 0.55)',
              fontFamily: 'var(--font-family-switzer)',
              marginBottom: '16px'
            }}>
              No active goals yet
            </p>
            <Link
              href="/dashboard/goals"
              style={{
                display: 'inline-block',
                padding: '8px 16px',
                background: 'var(--accent-primary)',
                color: '#0f3d3c',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                fontFamily: 'var(--font-family-satoshi)',
                textDecoration: 'none',
                transition: 'opacity 0.3s ease'
              }}
            >
              Create Your First Goal
            </Link>
          </div>
        ) : (
          goals.map(goal => {
            const progress = getProgressPercentage(goal);
            const daysUntilDue = getDaysUntilDue(goal.due_date);
            const isOverdue = daysUntilDue !== null && daysUntilDue < 0;
            const isDueSoon = daysUntilDue !== null && daysUntilDue <= 7 && daysUntilDue >= 0;

            return (
              <div
                key={goal.id}
                style={{
                  background: 'rgba(15, 61, 60, 0.04)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid rgba(15, 61, 60, 0.12)',
                  transition: 'all 0.3s ease'
                }}
              >
                {/* Goal Title & Due Date */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px'
                }}>
                  <h3 style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-family-satoshi)',
                    margin: 0,
                    flex: 1
                  }}>
                    {goal.title}
                  </h3>
                  {daysUntilDue !== null && (
                    <span style={{
                      fontSize: '11px',
                      color: isOverdue ? '#E091C5' : isDueSoon ? '#E5A862' : 'rgba(15, 61, 60, 0.55)',
                      fontFamily: 'var(--font-family-switzer)',
                      fontWeight: 500,
                      marginLeft: '12px',
                      whiteSpace: 'nowrap'
                    }}>
                      {isOverdue 
                        ? `${Math.abs(daysUntilDue)}d overdue` 
                        : `${daysUntilDue}d left`}
                    </span>
                  )}
                </div>

                {/* Progress Bar */}
                <div style={{
                  marginBottom: '8px'
                }}>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: 'rgba(15, 61, 60, 0.08)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <div style={{
                      width: `${progress}%`,
                      height: '100%',
                      background: progress === 100 ? 'var(--accent-primary)' : 'var(--accent-secondary)',
                      borderRadius: '4px',
                      transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} />
                  </div>
                </div>

                {/* Progress Text & Increment Button */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{
                    fontSize: '12px',
                    color: 'rgba(15, 61, 60, 0.6)',
                    fontFamily: 'var(--font-family-switzer)'
                  }}>
                    {goal.current_value} / {goal.target_value} {goal.unit}
                  </span>
                  {progress < 100 && (
                    <button
                      onClick={() => updateGoalProgress(goal.id, goal.current_value + 1)}
                      style={{
                        background: 'transparent',
                        border: '1px solid rgba(15, 61, 60, 0.2)',
                        borderRadius: '6px',
                        padding: '4px 12px',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: 'var(--accent-secondary)',
                        fontFamily: 'var(--font-family-satoshi)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      +1
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
