import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Quote } from '@/types';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  totalDaysCompleted: number;
  todayProgress: {
    quotesListened: number;
    date: string;
    goalCompleted: boolean;
  };
  weeklyStreak: number;
  monthlyStreak: number;
  totalQuotesListened: number;
}

interface PlayerState {
  currentQuote: Quote | null;
  playlist: Quote[];
  currentIndex: number;
  isPlaying: boolean;
  favorites: string[];
  history: string[];
  streakData: StreakData;
  dailyGoal: number;
  showCongratulationsModal: boolean;
  
  // Actions
  playQuote: (quote: Quote, playlist?: Quote[]) => void;
  pauseQuote: () => void;
  resumeQuote: () => void;
  nextQuote: () => void;
  previousQuote: () => void;
  toggleFavorite: (quoteId: string) => void;
  addToHistory: (quoteId: string) => void;
  setDailyGoal: (goal: number) => void;
  incrementListenedCount: () => void;
  resetDailyProgressIfNeeded: () => void;
  dismissCongratulationsModal: () => void;
}

const today = new Date().toISOString().split('T')[0];

const initialStreakData: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastCompletedDate: null,
  totalDaysCompleted: 0,
  todayProgress: {
    quotesListened: 0,
    date: today,
    goalCompleted: false,
  },
  weeklyStreak: 0,
  monthlyStreak: 0,
  totalQuotesListened: 0,
};

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      currentQuote: null,
      playlist: [],
      currentIndex: 0,
      isPlaying: false,
      favorites: [],
      history: [],
      streakData: initialStreakData,
      dailyGoal: 10, // Default to 10 teachings per day
      showCongratulationsModal: false,

      playQuote: (quote, playlist = []) => {
        const newPlaylist = playlist.length > 0 ? playlist : [quote];
        const index = newPlaylist.findIndex(q => q.id === quote.id);
        
        set({
          currentQuote: quote,
          playlist: newPlaylist,
          currentIndex: index >= 0 ? index : 0,
          isPlaying: true,
        });
      },

      pauseQuote: () => set({ isPlaying: false }),
      
      resumeQuote: () => set({ isPlaying: true }),

      nextQuote: () => {
        const { playlist, currentIndex } = get();
        if (playlist.length > 0) {
          const nextIndex = (currentIndex + 1) % playlist.length;
          const nextQuote = playlist[nextIndex];
          set({
            currentQuote: nextQuote,
            currentIndex: nextIndex,
          });
        }
      },

      previousQuote: () => {
        const { playlist, currentIndex } = get();
        if (playlist.length > 0) {
          const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
          const prevQuote = playlist[prevIndex];
          set({
            currentQuote: prevQuote,
            currentIndex: prevIndex,
          });
        }
      },

      toggleFavorite: (quoteId) => {
        set((state) => ({
          favorites: state.favorites.includes(quoteId)
            ? state.favorites.filter(id => id !== quoteId)
            : [...state.favorites, quoteId]
        }));
      },

      addToHistory: (quoteId) => {
        set((state) => {
          const newHistory = [quoteId, ...state.history.filter(id => id !== quoteId)];
          return { history: newHistory.slice(0, 50) }; // Keep last 50 items
        });
      },

      setDailyGoal: (goal) => {
        set({ dailyGoal: goal });
      },

      incrementListenedCount: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        
        // Reset progress if it's a new day
        if (state.streakData.todayProgress.date !== today) {
          state.resetDailyProgressIfNeeded();
        }
        
        const newListenedCount = state.streakData.todayProgress.quotesListened + 1;
        const goalCompleted = newListenedCount >= state.dailyGoal;
        
        // Check if this completes the daily goal for the first time today
        const shouldShowCongratulations = goalCompleted && !state.streakData.todayProgress.goalCompleted;
        
        let newStreakData = { ...state.streakData };
        
        // Update total quotes listened
        newStreakData.totalQuotesListened += 1;
        
        if (goalCompleted && !state.streakData.todayProgress.goalCompleted) {
          // Goal completed for the first time today
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          
          if (state.streakData.lastCompletedDate === yesterdayStr) {
            // Consecutive day
            newStreakData.currentStreak += 1;
          } else if (state.streakData.lastCompletedDate !== today) {
            // New streak or broken streak
            newStreakData.currentStreak = 1;
          }
          
          newStreakData.lastCompletedDate = today;
          newStreakData.totalDaysCompleted += 1;
          newStreakData.longestStreak = Math.max(newStreakData.longestStreak, newStreakData.currentStreak);
          
          // Update weekly and monthly streaks
          const currentDate = new Date();
          const weekStart = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
          const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
          
          if (newStreakData.currentStreak % 7 === 0) {
            newStreakData.weeklyStreak += 1;
          }
          if (newStreakData.currentStreak % 30 === 0) {
            newStreakData.monthlyStreak += 1;
          }
        }
        
        newStreakData.todayProgress = {
          quotesListened: newListenedCount,
          date: today,
          goalCompleted,
        };
        
        set({
          streakData: newStreakData,
          showCongratulationsModal: shouldShowCongratulations,
        });
      },

      resetDailyProgressIfNeeded: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        
        if (state.streakData.todayProgress.date !== today) {
          set({
            streakData: {
              ...state.streakData,
              todayProgress: {
                quotesListened: 0,
                date: today,
                goalCompleted: false,
              },
            },
          });
        }
      },

      dismissCongratulationsModal: () => {
        set({ showCongratulationsModal: false });
      },
    }),
    {
      name: 'player-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        favorites: state.favorites,
        history: state.history,
        streakData: state.streakData,
        dailyGoal: state.dailyGoal,
      }),
    }
  )
);