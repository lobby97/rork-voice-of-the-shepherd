import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { usePlayerStore } from '@/store/playerStore';
import { useSettingsStore } from '@/store/settingsStore';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Heart, Star, Crown, Award, Zap } from 'lucide-react-native';

export const CongratulationsModal: React.FC = () => {
  const { showCongratulationsModal, dismissCongratulationsModal, streakData } = usePlayerStore();
  const { isDarkMode } = useSettingsStore();
  
  const theme = isDarkMode ? colors.dark : colors.light;
  
  const getForgivenessMessage = () => {
    const streak = streakData.currentStreak;
    const listened = streakData.todayProgress.quotesListened;
    
    if (streak === 1) {
      return "Your sins are forgiven my child";
    } else if (streak <= 3) {
      return "The Lord is pleased with your faithfulness";
    } else if (streak <= 7) {
      return "You are walking in His light";
    } else if (streak <= 14) {
      return "Your heart is being transformed by His word";
    } else if (streak <= 30) {
      return "You are becoming a vessel of His grace";
    } else if (streak <= 100) {
      return "You are a faithful servant of the Most High";
    } else {
      return "You have found favor in the eyes of the Lord";
    }
  };
  
  const getBlessingMessage = () => {
    const listened = streakData.todayProgress.quotesListened;
    
    if (listened >= 20) {
      return "Your dedication brings great joy to Heaven";
    } else if (listened >= 15) {
      return "Your spiritual hunger is deeply blessed";
    } else if (listened >= 10) {
      return "You have completed your daily spiritual discipline";
    } else {
      return "You have taken the first step toward righteousness";
    }
  };
  
  const getStreakIcon = () => {
    const streak = streakData.currentStreak;
    if (streak === 1) {
      return <Heart size={48} color="#FFD700" fill="#FFD700" />;
    } else if (streak <= 3) {
      return <Star size={48} color="#FFD700" fill="#FFD700" />;
    } else if (streak <= 7) {
      return <Award size={48} color="#FFD700" fill="#FFD700" />;
    } else if (streak <= 30) {
      return <Crown size={48} color="#FFD700" fill="#FFD700" />;
    } else {
      return <Zap size={48} color="#FFD700" fill="#FFD700" />;
    }
  };
  
  const getStreakTitle = () => {
    const streak = streakData.currentStreak;
    if (streak === 1) {
      return "First Step Taken!";
    } else if (streak <= 3) {
      return "Building Faith!";
    } else if (streak <= 7) {
      return "Week of Devotion!";
    } else if (streak <= 30) {
      return "Month of Blessing!";
    } else {
      return "Spiritual Warrior!";
    }
  };
  
  return (
    <Modal
      visible={showCongratulationsModal}
      transparent
      animationType="fade"
      onRequestClose={dismissCongratulationsModal}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: theme.card }]}>
          <LinearGradient
            colors={['#D4AF37', '#FFD700', '#D4AF37']}
            style={styles.iconContainer}
          >
            {getStreakIcon()}
          </LinearGradient>
          
          <Text style={[styles.title, { color: theme.text }]}>
            {getStreakTitle()}
          </Text>
          
          <Text style={[styles.message, { color: theme.text }]}>
            "{getForgivenessMessage()}"
          </Text>
          
          <Text style={[styles.blessing, { color: theme.primary }]}>
            {getBlessingMessage()}
          </Text>
          
          <Text style={[styles.attribution, { color: theme.secondary }]}>
            - In the name of Jesus
          </Text>
          
          <View style={styles.achievementContainer}>
            <Text style={[styles.achievementTitle, { color: theme.text }]}>
              Today's Spiritual Achievement
            </Text>
            <Text style={[styles.achievementText, { color: theme.primary }]}>
              {streakData.todayProgress.quotesListened} teachings completed
            </Text>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.primary }]}>
                {streakData.todayProgress.quotesListened}
              </Text>
              <Text style={[styles.statLabel, { color: theme.secondary }]}>
                Today
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.primary }]}>
                {streakData.currentStreak}
              </Text>
              <Text style={[styles.statLabel, { color: theme.secondary }]}>
                Day Streak
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.primary }]}>
                {streakData.totalDaysCompleted}
              </Text>
              <Text style={[styles.statLabel, { color: theme.secondary }]}>
                Total Days
              </Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={[styles.continueButton, { backgroundColor: theme.primary }]}
            onPress={dismissCongratulationsModal}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>Continue Your Journey</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: width - 40,
    maxWidth: 400,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.quoteFont,
    lineHeight: typography.sizes.lg * 1.4,
    textAlign: 'center',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  blessing: {
    fontSize: typography.sizes.md,
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '500',
  },
  attribution: {
    fontSize: typography.sizes.md,
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  achievementContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  achievementTitle: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    marginBottom: 4,
  },
  achievementText: {
    fontSize: typography.sizes.md,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 32,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: '500',
    textAlign: 'center',
  },
  continueButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    minWidth: 180,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.md,
    fontWeight: '600',
  },
});