import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { usePlayerStore } from '@/store/playerStore';
import { useSettingsStore } from '@/store/settingsStore';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Flame, Target, Award, TrendingUp, BookOpen, CheckCircle } from 'lucide-react-native';

interface StreakProgressProps {
  onPress?: () => void;
}

export const StreakProgress: React.FC<StreakProgressProps> = ({ onPress }) => {
  const { streakData, dailyGoal } = usePlayerStore();
  const { isDarkMode } = useSettingsStore();
  
  const theme = isDarkMode ? colors.dark : colors.light;
  
  const progressPercentage = Math.min((streakData.todayProgress.quotesListened / dailyGoal) * 100, 100);
  const remaining = Math.max(dailyGoal - streakData.todayProgress.quotesListened, 0);
  
  const getMotivationalMessage = () => {
    const listened = streakData.todayProgress.quotesListened;
    const goal = dailyGoal;
    
    if (streakData.todayProgress.goalCompleted) {
      return "🙏 Your daily spiritual goal is complete! Well done.";
    } else if (listened === 0) {
      return `Begin your spiritual journey today - ${goal} teachings await`;
    } else if (listened < goal / 3) {
      return `Great start! ${remaining} more teachings to reach your goal`;
    } else if (listened < goal * 2/3) {
      return `You're making progress! ${remaining} teachings remaining`;
    } else {
      return `Almost there! Just ${remaining} more to complete your goal`;
    }
  };
  
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
            <Target size={20} color={theme.primary} />
          </View>
          <View>
            <Text style={[styles.title, { color: theme.text }]}>Daily Spiritual Goal</Text>
            <Text style={[styles.subtitle, { color: theme.secondary }]}>
              Stay consistent in your faith journey
            </Text>
          </View>
        </View>
        
        <View style={[styles.streakContainer, { backgroundColor: '#FF6B35' + '20' }]}>
          <Flame size={16} color="#FF6B35" />
          <Text style={[styles.streakText, { color: theme.text }]}>
            {streakData.currentStreak}
          </Text>
        </View>
      </View>
      
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressLabel, { color: theme.text }]}>
            Today's Progress
          </Text>
          <View style={styles.progressCount}>
            {streakData.todayProgress.goalCompleted && (
              <CheckCircle size={16} color={theme.success} />
            )}
            <Text style={[styles.progressNumbers, { color: theme.primary }]}>
              {streakData.todayProgress.quotesListened} / {dailyGoal}
            </Text>
          </View>
        </View>
        
        <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
          <View 
            style={[
              styles.progressFill, 
              { 
                backgroundColor: streakData.todayProgress.goalCompleted ? theme.success : theme.primary,
                width: `${progressPercentage}%` 
              }
            ]} 
          />
        </View>
        
        <Text style={[styles.motivationText, { color: theme.secondary }]}>
          {getMotivationalMessage()}
        </Text>
      </View>
      
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: theme.primary + '15' }]}>
            <BookOpen size={16} color={theme.primary} />
          </View>
          <Text style={[styles.statNumber, { color: theme.text }]}>
            {streakData.todayProgress.quotesListened}
          </Text>
          <Text style={[styles.statLabel, { color: theme.secondary }]}>Today</Text>
        </View>
        
        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: '#FF6B35' + '15' }]}>
            <Flame size={16} color="#FF6B35" />
          </View>
          <Text style={[styles.statNumber, { color: theme.text }]}>
            {streakData.currentStreak}
          </Text>
          <Text style={[styles.statLabel, { color: theme.secondary }]}>Streak</Text>
        </View>
        
        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: theme.accent + '15' }]}>
            <Award size={16} color={theme.accent} />
          </View>
          <Text style={[styles.statNumber, { color: theme.text }]}>
            {streakData.longestStreak}
          </Text>
          <Text style={[styles.statLabel, { color: theme.secondary }]}>Best</Text>
        </View>
        
        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: theme.success + '15' }]}>
            <TrendingUp size={16} color={theme.success} />
          </View>
          <Text style={[styles.statNumber, { color: theme.text }]}>
            {streakData.totalQuotesListened || 0}
          </Text>
          <Text style={[styles.statLabel, { color: theme.secondary }]}>Total</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  streakText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    marginLeft: 6,
  },
  progressSection: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
  progressCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  progressNumbers: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  motivationText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    textAlign: 'center',
    lineHeight: typography.lineHeights.relaxed * typography.sizes.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    textAlign: 'center',
  },
});