/**
 * Types for Calendar Activity Overlay
 */

export interface ActivityData {
  [date: string]: {
    journalCount: number;
    goalsCount: number;
    totalActivity: number;
  };
}

export interface CalendarOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export type ViewMode = 'monthly' | 'daily';

export interface DayActivity {
  date: Date;
  dateString: string;
  journalCount: number;
  goalsCount: number;
  totalActivity: number;
  level: number;
}

