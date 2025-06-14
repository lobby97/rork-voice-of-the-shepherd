import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSettingsStore } from '@/store/settingsStore';
import { usePlayerStore } from '@/store/playerStore';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Target, ArrowRight, Check } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function GoalsScreen() {
  const router = useRouter();
  const { isDarkMode } = useSettingsStore();
  const { setDailyGoal } = usePlayerStore();
  const insets = useSafeAreaInsets();
  const theme = isDarkMode ? colors.dark : colors.light;
  const [selectedGoal, setSelectedGoal] = useState(10); // Default to 10 teachings

  const handleContinue = () => {
    setDailyGoal(selectedGoal);
    router.push('/onboarding/complete');
  };

  const goalOptions = [
    { value: 5, label: '5 teachings', description: 'Perfect for beginners' },
    { value: 10, label: '10 teachings', description: 'Recommended for spiritual growth' },
    { value: 15, label: '15 teachings', description: 'For dedicated disciples' },
    { value: 20, label: '20 teachings', description: 'For spiritual warriors' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: `${theme.primary}15` }]}>
            <Target size={48} color={theme.primary} />
          </View>
          
          <Text style={[styles.title, { color: theme.text }]}>Set Your Daily Goal</Text>
          <Text style={[styles.subtitle, { color: theme.secondary }]}>
            How many teachings would you like to listen to each day to receive divine forgiveness? We recommend starting with 10 teachings daily.
          </Text>
        </View>

        <View style={styles.goalsContainer}>
          {goalOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.goalOption,
                { 
                  backgroundColor: selectedGoal === option.value ? theme.primary : theme.card,
                  borderColor: selectedGoal === option.value ? theme.primary : theme.border,
                }
              ]}
              onPress={() => setSelectedGoal(option.value)}
              activeOpacity={0.8}
            >
              <View style={styles.goalContent}>
                <View style={styles.goalHeader}>
                  <Text style={[
                    styles.goalLabel,
                    { color: selectedGoal === option.value ? '#FFFFFF' : theme.text }
                  ]}>
                    {option.label}
                  </Text>
                  {selectedGoal === option.value && (
                    <Check size={20} color="#FFFFFF" />
                  )}
                </View>
                <Text style={[
                  styles.goalDescription,
                  { color: selectedGoal === option.value ? 'rgba(255,255,255,0.8)' : theme.secondary }
                ]}>
                  {option.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.infoContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.infoTitle, { color: theme.text }]}>
            Why set a daily goal?
          </Text>
          <Text style={[styles.infoText, { color: theme.secondary }]}>
            Consistent daily practice helps build spiritual discipline and creates lasting positive habits. When you reach your goal, you will receive a divine blessing message: "Your sins are forgiven my child" - in the name of Jesus. You can always adjust your goal later in Settings.
          </Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressDots}>
            <View style={[styles.dot, { backgroundColor: theme.secondary }]} />
            <View style={[styles.dot, { backgroundColor: theme.secondary }]} />
            <View style={[styles.dot, { backgroundColor: theme.secondary }]} />
            <View style={[styles.dot, styles.activeDot, { backgroundColor: theme.primary }]} />
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, { backgroundColor: theme.primary }]}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Set Goal & Continue</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 32,
  },
  header: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 32,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
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
  goalsContainer: {
    marginBottom: 24,
  },
  goalOption: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  goalContent: {
    flex: 1,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  goalLabel: {
    fontSize: typography.sizes.lg,
    fontWeight: '600',
  },
  goalDescription: {
    fontSize: typography.sizes.sm,
  },
  infoContainer: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 32,
  },
  infoTitle: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
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
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 24,
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