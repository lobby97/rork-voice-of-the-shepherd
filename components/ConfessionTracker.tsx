import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Modal, TextInput, Alert } from 'react-native';
import { useConfessionStore, commonSins } from '@/store/confessionStore';
import { useSettingsStore } from '@/store/settingsStore';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Heart, Plus, Calendar, Target, CheckCircle, X, Trash2, Edit3 } from 'lucide-react-native';

export const ConfessionTracker: React.FC = () => {
  const { isDarkMode } = useSettingsStore();
  const {
    lastConfessionDate,
    spiritualGoals,
    setLastConfessionDate,
    addSpiritualGoal,
    removeSpiritualGoal,
    updateGoalProgress,
    toggleGoalActive,
    getDaysSinceLastConfession,
    shouldShowConfessionReminder
  } = useConfessionStore();
  
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [showCommonSinsModal, setShowCommonSinsModal] = useState(false);
  const [customSin, setCustomSin] = useState('');
  const [customVirtue, setCustomVirtue] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  
  const theme = isDarkMode ? colors.dark : colors.light;
  
  const daysSinceConfession = getDaysSinceLastConfession();
  const activeGoals = spiritualGoals.filter(goal => goal.isActive);
  const showReminder = shouldShowConfessionReminder();
  
  const handleSetConfessionDate = () => {
    const today = new Date().toISOString().split('T')[0];
    Alert.alert(
      'Record Confession',
      'Mark today as your last confession date?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => {
            setLastConfessionDate(today);
            Alert.alert('Recorded', 'Your confession date has been recorded. May God bless your spiritual journey.');
          }
        }
      ]
    );
  };
  
  const handleAddCustomGoal = () => {
    if (!customSin.trim() || !customVirtue.trim()) {
      Alert.alert('Missing Information', 'Please enter both a sin to overcome and its corresponding virtue.');
      return;
    }
    
    addSpiritualGoal(customSin.trim(), customVirtue.trim(), customDescription.trim());
    setCustomSin('');
    setCustomVirtue('');
    setCustomDescription('');
    setShowAddGoalModal(false);
  };
  
  const handleAddCommonSin = (sin: typeof commonSins[0]) => {
    addSpiritualGoal(sin.sin, sin.virtue, sin.description);
    setShowCommonSinsModal(false);
  };
  
  const handleProgressUpdate = (goalId: string, currentProgress: number) => {
    Alert.alert(
      'Update Progress',
      'How is your progress with this spiritual goal?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Struggling (25%)', onPress: () => updateGoalProgress(goalId, 25) },
        { text: 'Making Progress (50%)', onPress: () => updateGoalProgress(goalId, 50) },
        { text: 'Good Progress (75%)', onPress: () => updateGoalProgress(goalId, 75) },
        { text: 'Excellent (100%)', onPress: () => updateGoalProgress(goalId, 100) },
      ]
    );
  };
  
  const getConfessionMessage = () => {
    if (!lastConfessionDate) {
      return "Begin your spiritual journey by recording your first confession";
    }
    
    if (daysSinceConfession === 0) {
      return "You confessed today. Peace be with you 🙏";
    } else if (daysSinceConfession === 1) {
      return "You confessed yesterday. Continue your spiritual growth";
    } else if (daysSinceConfession! <= 7) {
      return `${daysSinceConfession} days since confession. Keep growing in virtue`;
    } else if (daysSinceConfession! <= 30) {
      return `${daysSinceConfession} days since confession. Consider scheduling another soon`;
    } else {
      return `${daysSinceConfession} days since confession. Your soul thirsts for reconciliation`;
    }
  };
  
  return (
    <>
      <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Heart size={20} color="#8B5CF6" />
            <Text style={[styles.title, { color: theme.text }]}>Confession Tracker</Text>
          </View>
          
          {showReminder && (
            <View style={styles.reminderBadge}>
              <Text style={styles.reminderText}>!</Text>
            </View>
          )}
        </View>
        
        <View style={styles.confessionSection}>
          <View style={styles.confessionHeader}>
            <Calendar size={16} color={theme.primary} />
            <Text style={[styles.confessionLabel, { color: theme.text }]}>
              Last Confession
            </Text>
            <TouchableOpacity
              style={[styles.recordButton, { backgroundColor: theme.primary }]}
              onPress={handleSetConfessionDate}
            >
              <Text style={styles.recordButtonText}>Record Today</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.confessionMessage, { color: theme.secondary }]}>
            {getConfessionMessage()}
          </Text>
        </View>
        
        <View style={styles.goalsSection}>
          <View style={styles.goalsHeader}>
            <View style={styles.goalsTitle}>
              <Target size={16} color={theme.primary} />
              <Text style={[styles.goalsLabel, { color: theme.text }]}>
                Spiritual Goals ({activeGoals.length})
              </Text>
            </View>
            
            <View style={styles.addButtons}>
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: theme.muted }]}
                onPress={() => setShowCommonSinsModal(true)}
              >
                <Text style={[styles.addButtonText, { color: theme.text }]}>Common</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: theme.primary }]}
                onPress={() => setShowAddGoalModal(true)}
              >
                <Plus size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
          
          {activeGoals.length === 0 ? (
            <Text style={[styles.emptyText, { color: theme.secondary }]}>
              Add spiritual goals to track your growth in virtue
            </Text>
          ) : (
            <ScrollView style={styles.goalsList} showsVerticalScrollIndicator={false}>
              {activeGoals.slice(0, 3).map(goal => (
                <TouchableOpacity
                  key={goal.id}
                  style={[styles.goalItem, { backgroundColor: theme.muted }]}
                  onPress={() => handleProgressUpdate(goal.id, goal.progress)}
                >
                  <View style={styles.goalContent}>
                    <View style={styles.goalInfo}>
                      <Text style={[styles.goalSin, { color: theme.text }]}>{goal.sin}</Text>
                      <Text style={[styles.goalVirtue, { color: theme.primary }]}>→ {goal.virtue}</Text>
                    </View>
                    
                    <View style={styles.goalProgress}>
                      <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
                        <View 
                          style={[
                            styles.progressFill, 
                            { 
                              backgroundColor: goal.progress >= 75 ? '#4CAF50' : theme.primary,
                              width: `${goal.progress}%` 
                            }
                          ]} 
                        />
                      </View>
                      <Text style={[styles.progressText, { color: theme.secondary }]}>
                        {goal.progress}%
                      </Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity
                    style={styles.goalAction}
                    onPress={() => removeSpiritualGoal(goal.id)}
                  >
                    <X size={16} color={theme.secondary} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
              
              {activeGoals.length > 3 && (
                <Text style={[styles.moreGoalsText, { color: theme.secondary }]}>
                  +{activeGoals.length - 3} more goals
                </Text>
              )}
            </ScrollView>
          )}
        </View>
      </View>
      
      {/* Add Custom Goal Modal */}
      <Modal
        visible={showAddGoalModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddGoalModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Add Spiritual Goal</Text>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>Sin to Overcome</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: theme.muted, color: theme.text }]}
                value={customSin}
                onChangeText={setCustomSin}
                placeholder="e.g., Pride, Anger, Laziness"
                placeholderTextColor={theme.secondary}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>Virtue to Develop</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: theme.muted, color: theme.text }]}
                value={customVirtue}
                onChangeText={setCustomVirtue}
                placeholder="e.g., Humility, Patience, Diligence"
                placeholderTextColor={theme.secondary}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>Description (Optional)</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: theme.muted, color: theme.text }]}
                value={customDescription}
                onChangeText={setCustomDescription}
                placeholder="How will you practice this virtue?"
                placeholderTextColor={theme.secondary}
                multiline
                numberOfLines={2}
              />
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.muted }]}
                onPress={() => setShowAddGoalModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: theme.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.primary }]}
                onPress={handleAddCustomGoal}
              >
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>Add Goal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Common Sins Modal */}
      <Modal
        visible={showCommonSinsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCommonSinsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Common Sins & Virtues</Text>
            
            <ScrollView style={styles.commonSinsList} showsVerticalScrollIndicator={false}>
              {commonSins.map(sin => (
                <TouchableOpacity
                  key={sin.id}
                  style={[styles.commonSinItem, { backgroundColor: theme.muted }]}
                  onPress={() => handleAddCommonSin(sin)}
                >
                  <View style={styles.commonSinContent}>
                    <Text style={[styles.commonSinName, { color: theme.text }]}>{sin.sin}</Text>
                    <Text style={[styles.commonSinVirtue, { color: theme.primary }]}>→ {sin.virtue}</Text>
                    <Text style={[styles.commonSinDescription, { color: theme.secondary }]}>
                      {sin.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: theme.muted, marginTop: 16 }]}
              onPress={() => setShowCommonSinsModal(false)}
            >
              <Text style={[styles.modalButtonText, { color: theme.text }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
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
  reminderBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reminderText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.xs,
    fontWeight: '700',
  },
  confessionSection: {
    marginBottom: 16,
  },
  confessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  confessionLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
  recordButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  recordButtonText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.xs,
    fontWeight: '600',
  },
  confessionMessage: {
    fontSize: typography.sizes.sm,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  goalsSection: {
    flex: 1,
  },
  goalsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalsTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalsLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: '500',
    marginLeft: 8,
  },
  addButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 32,
    height: 32,
  },
  addButtonText: {
    fontSize: typography.sizes.xs,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: typography.sizes.sm,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 16,
  },
  goalsList: {
    maxHeight: 200,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  goalContent: {
    flex: 1,
  },
  goalInfo: {
    marginBottom: 8,
  },
  goalSin: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    marginBottom: 2,
  },
  goalVirtue: {
    fontSize: typography.sizes.xs,
    fontWeight: '500',
  },
  goalProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: typography.sizes.xs,
    fontWeight: '500',
    minWidth: 32,
  },
  goalAction: {
    padding: 4,
  },
  moreGoalsText: {
    fontSize: typography.sizes.xs,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: typography.sizes.sm,
    marginBottom: 8,
    fontWeight: '500',
  },
  textInput: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: typography.sizes.md,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
  },
  commonSinsList: {
    maxHeight: 400,
  },
  commonSinItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  commonSinContent: {
    flex: 1,
  },
  commonSinName: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    marginBottom: 2,
  },
  commonSinVirtue: {
    fontSize: typography.sizes.xs,
    fontWeight: '500',
    marginBottom: 4,
  },
  commonSinDescription: {
    fontSize: typography.sizes.xs,
  },
});