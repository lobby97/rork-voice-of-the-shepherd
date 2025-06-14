export interface Quote {
  id: string;
  text: string;
  attribution: string;
  category: string;
  explanation: string;
  imageUrl: string;
  audioUrl: string;
  reference: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface DailyProgress {
  date: string; // YYYY-MM-DD format
  quotesListened: number;
  completed: boolean; // true if reached 3+ quotes
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalDaysCompleted: number;
  dailyProgress: DailyProgress[];
  lastCompletedDate: string | null;
  todayProgress: DailyProgress;
}

export interface SpiritualGoal {
  id: string;
  sin: string;
  virtue: string;
  description: string;
  progress: number; // 0-100
  dateAdded: string;
  isActive: boolean;
}

export interface ConfessionData {
  lastConfessionDate: string | null;
  spiritualGoals: SpiritualGoal[];
  confessionReminder: boolean;
  reminderDays: number; // days between confession reminders
}

export interface CommonSin {
  id: string;
  sin: string;
  virtue: string;
  description: string;
  category: 'pride' | 'greed' | 'lust' | 'envy' | 'gluttony' | 'wrath' | 'sloth';
}