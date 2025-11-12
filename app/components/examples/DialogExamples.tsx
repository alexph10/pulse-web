'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

/**
 * Example Dialog Component
 * Demonstrates various dialog patterns with toast notifications
 */
export function DialogExamples() {
  const [habitName, setHabitName] = useState('');
  const [goalTitle, setGoalTitle] = useState('');

  const handleCreateHabit = () => {
    if (!habitName.trim()) {
      toast.error('Please enter a habit name');
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      toast.success(`Habit "${habitName}" created successfully!`, {
        description: 'Your habit has been added to your tracker',
      });
      setHabitName('');
    }, 500);
  };

  const handleDeleteConfirmation = () => {
    toast.warning('Item deleted', {
      description: 'This action cannot be undone',
    });
  };

  return (
    <div style={{
      padding: '24px',
      border: '1px solid var(--border-subtle)',
      borderRadius: '8px',
      background: 'var(--surface)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    }}>
      <h2 style={{ 
        fontSize: '18px', 
        fontWeight: 600, 
        color: 'var(--text-primary)',
        marginBottom: '8px' 
      }}>
        Dialog & Toast Examples
      </h2>

      {/* Example 1: Create Habit Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <button style={{
            padding: '8px 20px',
            borderRadius: '6px',
            border: 'none',
            background: 'var(--accent-primary)',
            color: '#ffffff',
            fontFamily: 'var(--font-family-satoshi)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}>
            Create New Habit
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Habit</DialogTitle>
            <DialogDescription>
              Add a new habit to track. You can edit this later.
            </DialogDescription>
          </DialogHeader>
          <div style={{ padding: '16px 0' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--text-secondary)',
            }}>
              Habit Name
            </label>
            <input
              type="text"
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              placeholder="e.g., Morning meditation"
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-subtle)',
                background: 'var(--background)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-family-satoshi)',
                fontSize: '13px',
              }}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <button style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid var(--border-subtle)',
                background: 'transparent',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-family-satoshi)',
                fontSize: '13px',
                cursor: 'pointer',
              }}>
                Cancel
              </button>
            </DialogClose>
            <button
              onClick={handleCreateHabit}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                background: 'var(--accent-primary)',
                color: '#ffffff',
                fontFamily: 'var(--font-family-satoshi)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Create Habit
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Example 2: Delete Confirmation Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <button style={{
            padding: '8px 20px',
            borderRadius: '6px',
            border: '1px solid var(--border-subtle)',
            background: 'transparent',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-family-satoshi)',
            fontSize: '13px',
            cursor: 'pointer',
          }}>
            Delete Confirmation Example
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your item.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <button style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid var(--border-subtle)',
                background: 'transparent',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-family-satoshi)',
                fontSize: '13px',
                cursor: 'pointer',
              }}>
                Cancel
              </button>
            </DialogClose>
            <DialogClose asChild>
              <button
                onClick={handleDeleteConfirmation}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#EF4444',
                  color: '#ffffff',
                  fontFamily: 'var(--font-family-satoshi)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toast Examples */}
      <div style={{
        marginTop: '16px',
        padding: '16px',
        background: 'var(--background-secondary)',
        borderRadius: '6px',
      }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: '12px',
        }}>
          Toast Notifications
        </h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => toast.success('Success!', { description: 'Your changes have been saved' })}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              border: 'none',
              background: '#10B981',
              color: '#ffffff',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            Success Toast
          </button>
          <button
            onClick={() => toast.error('Error!', { description: 'Something went wrong' })}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              border: 'none',
              background: '#EF4444',
              color: '#ffffff',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            Error Toast
          </button>
          <button
            onClick={() => toast.warning('Warning!', { description: 'Please check your input' })}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              border: 'none',
              background: '#F59E0B',
              color: '#ffffff',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            Warning Toast
          </button>
          <button
            onClick={() => toast.info('Info', { description: 'This is an informational message' })}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              border: 'none',
              background: '#3B82F6',
              color: '#ffffff',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            Info Toast
          </button>
          <button
            onClick={() => toast.loading('Loading...', { description: 'Please wait' })}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              border: '1px solid var(--border-subtle)',
              background: 'var(--surface)',
              color: 'var(--text-primary)',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            Loading Toast
          </button>
        </div>
      </div>
    </div>
  );
}
