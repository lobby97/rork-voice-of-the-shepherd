import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSettingsStore } from '@/store/settingsStore';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { BookmarkIcon, Play, Target, Bell, ArrowRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FeaturesScreen() {
  const router = useRouter();
  const { isDarkMode } = useSettingsStore();
  const insets = useSafeAreaInsets();
  const theme = isDarkMode ? colors.dark : colors.light;

  const handleContinue = () => {
    router.push('/onboarding/notifications');
  };

  const handleSkip = () => {
    router.push('/onboarding/complete');
  };

  const features = [
    {
      icon: <Play size={32} color={theme.primary} />,
      title: 'Audio Teachings',
      description: 'Listen to inspiring spiritual teachings with high-quality audio playback and peaceful background music.',
    },
    {
      icon: <BookmarkIcon size={32} color={theme.primary} />,
      title: 'Save Favorites',
      description: 'Bookmark your favorite teachings and create your personal collection for easy access anytime.',
    },
    {
      icon: <Target size={32} color={theme.primary} />,
      title: 'Daily Spiritual Goals',
      description: 'Set and achieve daily listening goals to build consistent spiritual habits and track your growth.',
    },
    {
      icon: <Bell size={32} color={theme.primary} />,
      title: 'Gentle Reminders',
      description: 'Receive thoughtful notifications throughout the day to help maintain your spiritual practice.',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Discover Features</Text>
          <Text style={[styles.subtitle, { color: theme.secondary }]}>
            Everything you need for spiritual growth
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View key={index} style={[styles.featureCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={[styles.featureIcon, { backgroundColor: `${theme.primary}15` }]}>
                {feature.icon}
              </View>
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, { color: theme.text }]}>
                  {feature.title}
                </Text>
                <Text style={[styles.featureDescription, { color: theme.secondary }]}>
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressDots}>
            <View style={[styles.dot, { backgroundColor: theme.secondary }]} />
            <View style={[styles.dot, styles.activeDot, { backgroundColor: theme.primary }]} />
            <View style={[styles.dot, { backgroundColor: theme.secondary }]} />
            <View style={[styles.dot, { backgroundColor: theme.secondary }]} />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          activeOpacity={0.7}
        >
          <Text style={[styles.skipButtonText, { color: theme.secondary }]}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.continueButton, { backgroundColor: theme.primary }]}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <ArrowRight size={20} color="#FFFFFF" style={styles.arrowIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 32,
    paddingTop: 32,
    paddingBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontFamily: typography.quoteFont,
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '700',
  },
  subtitle: {
    fontSize: typography.sizes.md,
    textAlign: 'center',
    lineHeight: typography.sizes.md * 1.4,
  },
  featuresContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  featureCard: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: typography.sizes.sm,
    lineHeight: typography.sizes.sm * 1.4,
  },
  progressContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  progressDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    height: 8,
    borderRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 24,
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  skipButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: '500',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.md,
    fontWeight: '600',
  },
  arrowIcon: {
    marginLeft: 8,
  },
});