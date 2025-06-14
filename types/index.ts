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

export interface ConfessionEntry {
  id: string;
  date: string; // YYYY-MM-DD format
  spiritualGoals: string[];
  notes?: string;
  nextConfessionReminder?: string; // YYYY-MM-DD format
}

export interface ConfessionData {
  lastConfessionDate: string | null;
  entries: ConfessionEntry[];
  reminderEnabled: boolean;
  reminderFrequency: 'weekly' | 'monthly' | 'custom'; // How often to remind
  customReminderDays?: number; // For custom frequency
}

export interface RescueModeSettings {
  enabled: boolean;
  autoPlayAudio: boolean;
  showBreathingExercise: boolean;
  blockAppsEnabled: boolean;
  blockedApps: string[];
  emergencyContacts: string[];
  customPrayers: string[];
  rescueQuoteCategories: string[];
}

export interface RescueSession {
  id: string;
  startTime: string;
  endTime?: string;
  duration?: number; // in seconds
  quotesViewed: string[];
  prayerCompleted: boolean;
  breathingExerciseCompleted: boolean;
  notes?: string;
}

export interface PersonalInfo {
  name: string;
  age?: number;
  spiritualGoals: string[];
  hasSignedContract: boolean;
  signatureDate?: string;
}

export interface UserProfile {
  id?: string;
  name: string;
  email?: string;
  age?: number;
  profilePicture?: string;
  signInProvider?: 'google' | 'apple' | null;
  isSignedIn: boolean;
  signInDate?: string;
  spiritualGoals: string[];
  hasSignedContract: boolean;
  signatureDate?: string;
}

export interface SignInProvider {
  id: 'google' | 'apple';
  name: string;
  icon: string;
  color: string;
}