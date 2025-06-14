export interface Quote {
  id: string;
  text: string;
  reference: string;
  category: string;
  audioUrl: string;
  imageUrl: string;
  duration: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  quoteCount: number;
}

export interface PlayerState {
  currentQuote: Quote | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  playlist: Quote[];
  currentIndex: number;
  isLoading: boolean;
  volume: number;
  playbackRate: number;
}

export interface ConfessionData {
  lastConfessionDate: string | null;
  spiritualGoals: SpiritualGoal[];
  confessionReminder: boolean;
  reminderDays: number;
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

export interface CommonSin {
  id: string;
  sin: string;
  virtue: string;
  description: string;
  category: 'pride' | 'wrath' | 'envy' | 'greed' | 'sloth' | 'gluttony' | 'lust';
}