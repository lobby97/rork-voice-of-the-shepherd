import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSettingsStore } from '@/store/settingsStore';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Heart, BookOpen, Headphones } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  const router = useRouter();
  const { isDarkMode } = useSettingsStore();
  const insets = useSafeAreaInsets();
  const theme = isDarkMode ? colors.dark : colors.light;

  const handleContinue = () => {
    router.push('/onboarding/features');
  };

  const handleSkip = () => {
    // Skip directly to complete onboarding
    router.replace('/onboarding/complete');
  };

  return (
    <LinearGradient
      colors={['#2E5BBA', '#4A90E2', '#6BB6FF']}
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.iconWrapper}>
            <Heart size={48} color="#FFFFFF" fill="#FFFFFF" />
          </View>
        </View>

        <Text style={styles.title}>Voice of the Shepherd</Text>
        <Text style={styles.subtitle}>
          Welcome to your spiritual journey
        </Text>

        <Text style={styles.description}>
          Discover daily wisdom, build spiritual habits, and grow closer to God through carefully curated teachings and reflections.
        </Text>

        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <BookOpen size={24} color="rgba(255,255,255,0.9)" />
            <Text style={styles.featureText}>Daily Teachings</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Headphones size={24} color="rgba(255,255,255,0.9)" />
            <Text style={styles.featureText}>Audio Guidance</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Heart size={24} color="rgba(255,255,255,0.9)" />
            <Text style={styles.featureText}>Spiritual Growth</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>Begin Your Journey</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
            activeOpacity={0.7}
          >
            <Text style={styles.skipButtonText}>Skip Tutorial</Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            "Be still and know that I am God" - Psalm 46:10
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 32,
  },
  iconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: typography.sizes.xxxl,
    fontFamily: typography.quoteFont,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: typography.sizes.xl,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '500',
  },
  description: {
    fontSize: typography.sizes.md,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: typography.sizes.md * 1.6,
    marginBottom: 40,
    maxWidth: width - 80,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 48,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: typography.sizes.sm,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    width: '100%',
  },
  continueButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.lg,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  skipButtonText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: typography.sizes.md,
    fontWeight: '500',
  },
  footerText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: typography.sizes.sm,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});