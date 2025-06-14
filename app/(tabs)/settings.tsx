import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSettingsStore } from '@/store/settingsStore';
import { usePlayerStore } from '@/store/playerStore';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Moon, Sun, Music, Bell, Heart, RotateCcw, Target } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NotificationService } from '@/services/notificationService';
import { NotificationTimeManager } from '@/components/NotificationTimeManager';
import { Platform } from 'react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const { 
    isDarkMode, 
    enableBackgroundMusic, 
    dailyNotifications,
    notificationTimes,
    toggleDarkMode,
    toggleBackgroundMusic,
    toggleDailyNotifications,
    resetOnboarding
  } = useSettingsStore();
  
  const { dailyGoal, setDailyGoal } = usePlayerStore();
  const insets = useSafeAreaInsets();
  const [notificationCount, setNotificationCount] = useState(0);
  
  const theme = isDarkMode ? colors.dark : colors.light;

  useEffect(() => {
    // Check scheduled notifications count
    const checkNotifications = async () => {
      const scheduled = await NotificationService.getScheduledNotifications();
      setNotificationCount(scheduled.length);
    };
    
    checkNotifications();
  }, [dailyNotifications, notificationTimes]);

  const handleNotificationToggle = async () => {
    if (Platform.OS === 'web') {
      Alert.alert(
        'Not Available',
        'Notifications are not supported on web browsers.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (!dailyNotifications) {
      // About to enable notifications
      const hasPermission = await NotificationService.requestPermissions();
      if (!hasPermission) {
        Alert.alert(
          'Permission Required',
          'Please enable notifications in your device settings to receive daily quotes.',
          [{ text: 'OK' }]
        );
        return;
      }
    }

    await toggleDailyNotifications();
  };

  const handleResetOnboarding = () => {
    Alert.alert(
      'Reset Onboarding',
      'This will show the welcome tutorial again when you restart the app. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            resetOnboarding();
            // Navigate to onboarding immediately
            router.replace('/onboarding/welcome');
          }
        }
      ]
    );
  };

  const handleDailyGoalChange = () => {
    Alert.alert(
      'Change Daily Goal',
      'Select your new daily teaching goal:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: '5 teachings', onPress: () => setDailyGoal(5) },
        { text: '10 teachings', onPress: () => setDailyGoal(10) },
        { text: '15 teachings', onPress: () => setDailyGoal(15) },
        { text: '20 teachings', onPress: () => setDailyGoal(20) },
      ]
    );
  };
  
  const enabledNotificationTimes = notificationTimes.filter(t => t.enabled);
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
        <Text style={[styles.subtitle, { color: theme.secondary }]}>
          Customize your spiritual journey
        </Text>
      </View>
      
      <View style={[styles.section, { borderBottomColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Spiritual Goals
        </Text>
        
        <TouchableOpacity 
          style={styles.settingRow}
          onPress={handleDailyGoalChange}
          activeOpacity={0.7}
        >
          <View style={styles.settingLabelContainer}>
            <Target size={22} color={theme.text} style={styles.settingIcon} />
            <View>
              <Text style={[styles.settingLabel, { color: theme.text }]}>
                Daily Teaching Goal
              </Text>
              <Text style={[styles.settingSubtext, { color: theme.secondary }]}>
                Currently set to {dailyGoal} teachings per day
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      
      <View style={[styles.section, { borderBottomColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Appearance
        </Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingLabelContainer}>
            {isDarkMode ? (
              <Moon size={22} color={theme.text} style={styles.settingIcon} />
            ) : (
              <Sun size={22} color={theme.text} style={styles.settingIcon} />
            )}
            <Text style={[styles.settingLabel, { color: theme.text }]}>
              Dark Mode
            </Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: '#767577', true: theme.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>
      
      <View style={[styles.section, { borderBottomColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Audio
        </Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingLabelContainer}>
            <Music size={22} color={theme.text} style={styles.settingIcon} />
            <Text style={[styles.settingLabel, { color: theme.text }]}>
              Background Music
            </Text>
          </View>
          <Switch
            value={enableBackgroundMusic}
            onValueChange={toggleBackgroundMusic}
            trackColor={{ false: '#767577', true: theme.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>
      
      <View style={[styles.section, { borderBottomColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Notifications
        </Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingLabelContainer}>
            <Bell size={22} color={theme.text} style={styles.settingIcon} />
            <View>
              <Text style={[styles.settingLabel, { color: theme.text }]}>
                Daily Notifications
              </Text>
              {Platform.OS !== 'web' && dailyNotifications && (
                <Text style={[styles.settingSubtext, { color: theme.secondary }]}>
                  {enabledNotificationTimes.length} times scheduled
                </Text>
              )}
              {Platform.OS === 'web' && (
                <Text style={[styles.settingSubtext, { color: theme.secondary }]}>
                  Not available on web
                </Text>
              )}
            </View>
          </View>
          <Switch
            value={dailyNotifications && Platform.OS !== 'web'}
            onValueChange={handleNotificationToggle}
            trackColor={{ false: '#767577', true: theme.primary }}
            thumbColor="#FFFFFF"
            disabled={Platform.OS === 'web'}
          />
        </View>
        
        {Platform.OS !== 'web' && dailyNotifications && (
          <NotificationTimeManager isDarkMode={isDarkMode} />
        )}
      </View>

      <View style={[styles.section, { borderBottomColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Help & Tutorial
        </Text>
        
        <TouchableOpacity 
          style={styles.settingRow}
          onPress={handleResetOnboarding}
          activeOpacity={0.7}
        >
          <View style={styles.settingLabelContainer}>
            <RotateCcw size={22} color={theme.text} style={styles.settingIcon} />
            <View>
              <Text style={[styles.settingLabel, { color: theme.text }]}>
                Show Welcome Tutorial
              </Text>
              <Text style={[styles.settingSubtext, { color: theme.secondary }]}>
                Replay the onboarding experience
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <View style={[styles.supportButton, { backgroundColor: theme.primary }]}>
          <View style={styles.supportContent}>
            <View style={styles.supportIconContainer}>
              <View style={[styles.heartIconWrapper, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <Heart size={40} color="#FF0000" fill="#FF0000" />
              </View>
            </View>
            
            <View style={styles.supportTextContainer}>
              <Text style={styles.supportTitle}>Pledge Your Support</Text>
              <Text style={styles.supportDescription}>
                Help us keep this app free. Your support makes a real difference in bringing God's word to more hearts.
              </Text>
              
              <View style={styles.supportFeatures}>
                <Text style={styles.supportFeature}>• Keep the app free</Text>
                <Text style={styles.supportFeature}>• Help us reach more people</Text>
                <Text style={styles.supportFeature}>• Add more teachings and categories</Text>
                <Text style={styles.supportFeature}>• Improve audio quality and features</Text>
              </View>
              
              <View style={styles.supportCta}>
                <Text style={styles.supportCtaText}>Every contribution counts 🙏</Text>
              </View>

              <TouchableOpacity 
                style={styles.donateButton}
                activeOpacity={0.8}
              >
                <Text style={styles.donateButtonText}>Donate</Text>
              </TouchableOpacity>
              
              <Text style={styles.stripeText}>Secure payment by Stripe</Text>
            </View>
          </View>
        </View>
      </View>
      
      <Text style={[styles.version, { color: theme.secondary }]}>
        Version 1.0.0
      </Text>
      
      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 180, // Extra space for bigger mini player and tab bar
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontFamily: typography.quoteFont,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    marginBottom: 16,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontSize: typography.sizes.md,
  },
  settingSubtext: {
    fontSize: typography.sizes.xs,
    marginTop: 2,
  },
  supportButton: {
    marginHorizontal: 16,
    borderRadius: 24,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
    overflow: 'hidden',
  },
  supportContent: {
    padding: 32,
  },
  supportIconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  heartIconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  supportTextContainer: {
    alignItems: 'center',
  },
  supportTitle: {
    color: '#FFFFFF',
    fontSize: typography.sizes.xxl,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: typography.quoteFont,
  },
  supportDescription: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: typography.sizes.md,
    lineHeight: typography.sizes.md * 1.6,
    marginBottom: 24,
    textAlign: 'center',
  },
  supportFeatures: {
    alignSelf: 'stretch',
    marginBottom: 24,
  },
  supportFeature: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: typography.sizes.sm,
    marginBottom: 8,
    fontWeight: '500',
    textAlign: 'center',
  },
  supportCta: {
    marginBottom: 20,
    alignItems: 'center',
  },
  supportCtaText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.lg,
    fontWeight: '600',
  },
  donateButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
  },
  donateButtonText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.lg,
    fontWeight: '600',
  },
  stripeText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: typography.sizes.sm,
    textAlign: 'center',
  },
  version: {
    textAlign: 'center',
    fontSize: typography.sizes.sm,
    marginTop: 16,
  },
  footer: {
    height: 20,
  },
});