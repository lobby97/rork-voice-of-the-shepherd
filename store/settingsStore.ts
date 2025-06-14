import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NotificationService } from '@/services/notificationService';

export interface NotificationTime {
  id: string;
  hour: number;
  minute: number;
  label: string;
  enabled: boolean;
}

interface SettingsState {
  isDarkMode: boolean;
  enableBackgroundMusic: boolean;
  dailyNotifications: boolean;
  notificationTimes: NotificationTime[];
  hasCompletedOnboarding: boolean;
  showTutorialOverlays: boolean;
  toggleDarkMode: () => void;
  toggleBackgroundMusic: () => void;
  toggleDailyNotifications: () => void;
  addNotificationTime: (hour: number, minute: number, label: string) => void;
  removeNotificationTime: (id: string) => void;
  toggleNotificationTime: (id: string) => void;
  updateNotificationTime: (id: string, hour: number, minute: number, label: string) => void;
  resetToDefaultTimes: () => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  dismissTutorialOverlays: () => void;
}

const defaultNotificationTimes: NotificationTime[] = [
  {
    id: '1',
    hour: 8,
    minute: 0,
    label: 'Morning Reflection',
    enabled: true,
  },
  {
    id: '2',
    hour: 12,
    minute: 0,
    label: 'Midday Wisdom',
    enabled: true,
  },
  {
    id: '3',
    hour: 20,
    minute: 0,
    label: 'Evening Peace',
    enabled: true,
  },
];

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      isDarkMode: false,
      enableBackgroundMusic: false,
      dailyNotifications: true,
      notificationTimes: defaultNotificationTimes,
      hasCompletedOnboarding: false,
      showTutorialOverlays: true,
      
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      
      toggleBackgroundMusic: () => set((state) => ({ 
        enableBackgroundMusic: !state.enableBackgroundMusic 
      })),
      
      toggleDailyNotifications: async () => {
        const currentState = get().dailyNotifications;
        const newState = !currentState;
        
        set({ dailyNotifications: newState });
        
        if (newState) {
          const { notificationTimes } = get();
          await NotificationService.scheduleCustomNotifications(notificationTimes);
        } else {
          await NotificationService.cancelAllNotifications();
        }
      },

      addNotificationTime: (hour, minute, label) => {
        const newTime: NotificationTime = {
          id: Date.now().toString(),
          hour,
          minute,
          label,
          enabled: true,
        };
        
        const notificationTimes = [...get().notificationTimes, newTime];
        set({ notificationTimes });
        
        // Reschedule notifications if they're enabled
        if (get().dailyNotifications) {
          NotificationService.scheduleCustomNotifications(notificationTimes);
        }
      },

      removeNotificationTime: (id) => {
        const notificationTimes = get().notificationTimes.filter(time => time.id !== id);
        set({ notificationTimes });
        
        // Reschedule notifications if they're enabled
        if (get().dailyNotifications) {
          NotificationService.scheduleCustomNotifications(notificationTimes);
        }
      },

      toggleNotificationTime: (id) => {
        const notificationTimes = get().notificationTimes.map(time =>
          time.id === id ? { ...time, enabled: !time.enabled } : time
        );
        set({ notificationTimes });
        
        // Reschedule notifications if they're enabled
        if (get().dailyNotifications) {
          NotificationService.scheduleCustomNotifications(notificationTimes);
        }
      },

      updateNotificationTime: (id, hour, minute, label) => {
        const notificationTimes = get().notificationTimes.map(time =>
          time.id === id ? { ...time, hour, minute, label } : time
        );
        set({ notificationTimes });
        
        // Reschedule notifications if they're enabled
        if (get().dailyNotifications) {
          NotificationService.scheduleCustomNotifications(notificationTimes);
        }
      },

      resetToDefaultTimes: () => {
        set({ notificationTimes: defaultNotificationTimes });
        
        // Reschedule notifications if they're enabled
        if (get().dailyNotifications) {
          NotificationService.scheduleCustomNotifications(defaultNotificationTimes);
        }
      },

      completeOnboarding: () => {
        set({ hasCompletedOnboarding: true });
      },

      resetOnboarding: () => {
        set({ hasCompletedOnboarding: false, showTutorialOverlays: true });
      },

      dismissTutorialOverlays: () => {
        set({ showTutorialOverlays: false });
      },
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        // Schedule notifications if they're enabled when the app loads
        if (state?.dailyNotifications && state?.notificationTimes) {
          console.log('Rehydrating notifications...');
          NotificationService.scheduleCustomNotifications(state.notificationTimes);
        }
      },
    }
  )
);