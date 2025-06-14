import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { usePlayerStore } from '@/store/playerStore';
import { useSettingsStore } from '@/store/settingsStore';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Flame, Target, Calendar, CheckCircle, Award, TrendingUp, BookOpen } from 'lucide-react-native';

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
      return "Your sins are forgiven my child 🙏";
    } else if (listened === 0) {
      return `Begin your spiritual journey - listen to ${goal} teachings for divine forgiveness`;
    } else if (listened < goal / 3) {
      return `Good start! Listen to ${remaining} more teachings for forgiveness`;
    } else if (listened < goal * 2/3) {
      return `You are on the right path - ${remaining} teachings remaining for blessing`;
    } else {
      return `Almost there! Just ${remaining} more teachings for divine forgiveness`;
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
          <Target size={20} color={theme.primary} />
          <Text style={[styles.title, { color: theme.text }]}>Daily Spiritual Goal</Text>
        </View>
        
        <View style={styles.streakContainer}>
          <Flame size={16} color="#FF6B35" />
          <Text style={[styles.streakText, { color: theme.text }]}>
            {streakData.currentStreak} days
          </Text>
        </View>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressLabel, { color: theme.text }]}>
            Teachings Listened Today
          </Text>
          <Text style={[styles.progressCount, { color: theme.primary }]}>
            {streakData.todayProgress.quotesListened} of {dailyGoal}
          </Text>
        </View>
        
        <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
          <View 
            style={[
              styles.progressFill, 
              { 
                backgroundColor: streakData.todayProgress.goalCompleted ? '#4CAF50' : theme.primary,
                width: `${progressPercentage}%` 
              }
            ]} 
          />
        </View>
        
        <Text style={[styles.progressText, { color: theme.secondary }]}>
          {getMotivationalMessage()}
        </Text>
      </View>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <View style={styles.statHeader}>
            <BookOpen size={16} color={theme.primary} />
            <Text style={[styles.statNumber, { color: theme.text }]}>
              {streakData.todayProgress.quotesListened}
            </Text>
          </View>
          <Text style={[styles.statLabel, { color: theme.secondary }]}>Listened Today</Text>
        </View>
        
        <View style={styles.statItem}>
          <View style={styles.statHeader}>
            <Flame size={16} color="#FF6B35" />
            <Text style={[styles.statNumber, { color: theme.text }]}>
              {streakData.currentStreak}
            </Text>
          </View>
          <Text style={[styles.statLabel, { color: theme.secondary }]}>Days in a Row</Text>
        </View>
        
        <View style={styles.statItem}>
          <View style={styles.statHeader}>
            <Award size={16} color="#D4AF37" />
            <Text style={[styles.statNumber, { color: theme.text }]}>
              {streakData.longestStreak}
            </Text>
          </View>
          <Text style={[styles.statLabel, { color: theme.secondary }]}>Best Streak</Text>
        </View>
        
        <View style={styles.statItem}>
          <View style={styles.statHeader}>
            <TrendingUp size={16} color={theme.primary} />
            <Text style={[styles.statNumber, { color: theme.text }]}>
              {streakData.totalQuotesListened || 0}
            </Text>
          </View>
          <Text style={[styles.statLabel, { color: theme.secondary }]}>All Time Total</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    marginLeft: 8,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  streakText: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    marginLeft: 4,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: '500',
  },
  progressCount: {
    fontSize: typography.sizes.sm,
    fontWeight: '700',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: typography.sizes.sm,
    textAlign: 'center',
    lineHeight: typography.sizes.sm * 1.3,
    fontStyle: 'italic',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statNumber: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    marginLeft: 4,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: '500',
    textAlign: 'center',
  },
});