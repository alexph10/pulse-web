'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '../../contexts/ToastContext';
import styles from './page.module.css';
import { cn } from '@/lib/utils';
import LoadingState from '../../components/shared/LoadingState';
import EmptyState from '../../components/shared/EmptyState';

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
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>
              Goals
            </h1>
            <p className={styles.subtitle}>
              Track and achieve your personal goals
            </p>
          </div>
          
          <button
            onClick={() => setShowNewGoalForm(!showNewGoalForm)}
            className={cn(
              styles.newGoalButton,
              showNewGoalForm && styles.newGoalButtonCancel
            )}
            aria-label={showNewGoalForm ? 'Cancel creating new goal' : 'Create new goal'}
          >
            {showNewGoalForm ? 'Cancel' : 'New Goal'}
          </button>
        </div>

        {/* Filter Tabs */}
        <div className={styles.filterTabs}>
          {(['all', 'active', 'completed'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={cn(
                styles.filterTab,
                filterStatus === status && styles.filterTabActive
              )}
              aria-label={`Filter goals by ${status}`}
              aria-pressed={filterStatus === status}
            >
              {status === 'all' ? 'All Goals' : `${status.charAt(0).toUpperCase() + status.slice(1)}`}
            </button>
          ))}
        </div>

        {/* New Goal Form */}
        {showNewGoalForm && (
          <div className={styles.newGoalForm}>
            <h3 className={styles.formTitle}>
              Create New Goal
            </h3>
            
            <form onSubmit={createGoal}>
              <div className={styles.formGrid}>
                {/* Title */}
                <div className={styles.formField}>
                  <label className={styles.formLabel} htmlFor="goal-title">
                    Goal Title
                  </label>
                  <input
                    id="goal-title"
                    type="text"
                    required
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    placeholder="e.g., Read 12 books this year"
                    className={styles.formInput}
                    aria-label="Goal title"
                    aria-required="true"
                  />
                </div>

                {/* Description */}
                <div className={styles.formField}>
                  <label className={styles.formLabel} htmlFor="goal-description">
                    Description (optional)
                  </label>
                  <textarea
                    id="goal-description"
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    placeholder="Add more details about your goal..."
                    rows={3}
                    className={styles.formTextarea}
                    aria-label="Goal description"
                  />
                </div>

                {/* Target Value & Unit */}
                <div className={styles.formGridTwoCol}>
                  <div className={styles.formField}>
                    <label className={styles.formLabel} htmlFor="goal-target">
                      Target Value
                    </label>
                    <input
                      id="goal-target"
                      type="number"
                      required
                      min="1"
                      value={newGoal.target_value}
                      onChange={(e) => setNewGoal({ ...newGoal, target_value: parseInt(e.target.value) })}
                      className={styles.formInput}
                      aria-label="Target value"
                      aria-required="true"
                    />
                  </div>
                  <div className={styles.formField}>
                    <label className={styles.formLabel} htmlFor="goal-unit">
                      Unit
                    </label>
                    <input
                      id="goal-unit"
                      type="text"
                      required
                      value={newGoal.unit}
                      onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                      placeholder="books, miles, etc."
                      className={styles.formInput}
                      aria-label="Unit of measurement"
                      aria-required="true"
                    />
                  </div>
                </div>

                {/* Category & Due Date */}
                <div className={styles.formGridEqual}>
                  <div className={styles.formField}>
                    <label className={styles.formLabel} htmlFor="goal-category">
                      Category
                    </label>
                    <select
                      id="goal-category"
                      value={newGoal.category}
                      onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                      className={styles.formSelect}
                      aria-label="Goal category"
                    >
                      <option value="personal">Personal</option>
                      <option value="health">Health</option>
                      <option value="career">Career</option>
                      <option value="learning">Learning</option>
                      <option value="financial">Financial</option>
                      <option value="social">Social</option>
                    </select>
                  </div>
                  <div className={styles.formField}>
                    <label className={styles.formLabel} htmlFor="goal-due-date">
                      Due Date (optional)
                    </label>
                    <input
                      id="goal-due-date"
                      type="date"
                      value={newGoal.due_date}
                      onChange={(e) => setNewGoal({ ...newGoal, due_date: e.target.value })}
                      className={styles.formInput}
                      aria-label="Goal due date"
                    />
                  </div>
                </div>

                {/* Priority & Why */}
                <div className={styles.formGridPriority}>
                  <div className={styles.formField}>
                    <label className={styles.formLabel} htmlFor="goal-priority">
                      Priority
                    </label>
                    <select
                      id="goal-priority"
                      value={newGoal.priority}
                      onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value as 'low' | 'medium' | 'high' | 'urgent' })}
                      className={styles.formSelect}
                      aria-label="Goal priority"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div className={styles.formField}>
                    <label className={styles.formLabel} htmlFor="goal-why">
                      Why is this important? (optional)
                    </label>
                    <input
                      id="goal-why"
                      type="text"
                      value={newGoal.why}
                      onChange={(e) => setNewGoal({ ...newGoal, why: e.target.value })}
                      placeholder="To improve my mental health..."
                      className={styles.formInput}
                      aria-label="Why this goal is important"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className={styles.formButtonGroup}>
                  <button
                    type="submit"
                    className={styles.formButton}
                    aria-label="Create goal"
                  >
                    Create Goal
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Goals List */}
        {loading ? (
          <LoadingState variant="card" count={3} />
        ) : goals.length === 0 ? (
          <EmptyState
            title={
              filterStatus === 'active' ? 'No active goals yet' : 
              filterStatus === 'completed' ? 'No completed goals yet' : 
              'No goals yet'
            }
            description="Start tracking your progress by creating your first goal"
            illustration="goals"
            action={!showNewGoalForm ? {
              text: 'Create Your First Goal',
              onClick: () => setShowNewGoalForm(true)
            } : undefined}
          />
        ) : (
          <div className={styles.goalsList}>
            {goals.map(goal => {
              const progress = getProgressPercentage(goal.current_value, goal.target_value);
              const daysUntilDue = getDaysUntilDue(goal.due_date);
              const isOverdue = daysUntilDue !== null && daysUntilDue < 0;
              const isDueSoon = daysUntilDue !== null && daysUntilDue <= 7 && daysUntilDue >= 0;

              return (
                <div
                  key={goal.id}
                  className={styles.goalCard}
                >
                  {/* Header */}
                  <div className={styles.goalCardHeader}>
                    <div className={styles.goalCardContent}>
                      <div className={styles.goalTitleRow}>
                        <h3 className={styles.goalTitle}>
                          {goal.title}
                        </h3>
                        {goal.priority && (
                          <span className={cn(
                            styles.priorityBadge,
                            goal.priority === 'high' && styles.priorityBadgeHigh,
                            goal.priority === 'medium' && styles.priorityBadgeMedium,
                            goal.priority === 'low' && styles.priorityBadgeLow
                          )}>
                            {goal.priority}
                          </span>
                        )}
                        {goal.status === 'completed' && (
                          <span className={styles.statusBadge}>
                            Completed
                          </span>
                        )}
                      </div>
                      {goal.description && (
                        <p className={styles.goalDescription}>
                          {goal.description}
                        </p>
                      )}
                      {goal.why && (
                        <p className={styles.goalWhy}>
                          Why: {goal.why}
                        </p>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className={styles.goalActions}>
                      <button
                        onClick={() => archiveGoal(goal.id)}
                        className={styles.actionButton}
                        aria-label="Archive goal"
                        title="Archive goal"
                      >
                        Archive
                      </button>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className={cn(styles.actionButton, styles.actionButtonDelete)}
                        aria-label="Delete goal"
                        title="Delete goal"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Category & Due Date */}
                  <div className={styles.categoryInfo}>
                    <span className={styles.categoryBadge}>
                      {goal.category}
                    </span>
                    {daysUntilDue !== null && (
                      <span className={cn(
                        styles.dueDateBadge,
                        isOverdue && styles.dueDateBadgeOverdue,
                        isDueSoon && !isOverdue && styles.dueDateBadgeSoon
                      )}>
                        {isOverdue 
                          ? `${Math.abs(daysUntilDue)}d overdue` 
                          : daysUntilDue === 0 
                          ? 'Due today' 
                          : `${daysUntilDue}d left`}
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className={styles.progressSection}>
                    <div className={styles.progressHeader}>
                      <span className={styles.progressLabel}>
                        {goal.current_value} / {goal.target_value} {goal.unit}
                      </span>
                      <span className={cn(
                        styles.progressValue,
                        progress === 100 && styles.progressPercentageComplete
                      )}>
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressBarFill}
                        style={{ width: `${progress}%` }}
                        role="progressbar"
                        aria-valuenow={progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`Progress: ${Math.round(progress)}%`}
                      />
                    </div>
                  </div>

                  {/* Progress Controls */}
                  {goal.status === 'active' && (
                    <div className={styles.valueControls}>
                      <button
                        onClick={() => updateGoalProgress(goal.id, Math.max(0, goal.current_value - 1), goal.target_value)}
                        disabled={goal.current_value === 0}
                        className={cn(styles.valueButton, styles.valueButtonDecrease)}
                        aria-label="Decrease progress by 1"
                      >
                        -1
                      </button>
                      <button
                        onClick={() => updateGoalProgress(goal.id, goal.current_value + 1, goal.target_value)}
                        disabled={goal.current_value >= goal.target_value}
                        className={cn(styles.valueButton, styles.valueButtonIncrease)}
                        aria-label="Increase progress by 1"
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
