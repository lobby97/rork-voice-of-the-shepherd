import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, TextInput, ScrollView, Alert } from 'react-native';
import { useSettingsStore } from '@/store/settingsStore';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Heart, Plus, Calendar, Target, X, Check } from 'lucide-react-native';

export const ConfessionTracker: React.FC = () => {
  const { 
    isDarkMode, 
    confessionData, 
    addConfessionEntry, 
    getDaysSinceLastConfession,
    getUpcomingConfessionReminder 
  } = useSettingsStore();
  
  const [showModal, setShowModal] = useState(false);
  const [newGoals, setNewGoals] = useState<string[]>(['']);
  const [notes, setNotes] = useState('');
  
  const theme = isDarkMode ? colors.dark : colors.light;
  const daysSinceLastConfession = getDaysSinceLastConfession();
  const upcomingReminder = getUpcomingConfessionReminder();
  
  const handleAddGoal = () => {
    setNewGoals([...newGoals, '']);
  };
  
  const handleRemoveGoal = (index: number) => {
    if (newGoals.length > 1) {
      setNewGoals(newGoals.filter((_, i) => i !== index));
    }
  };
  
  const handleGoalChange = (index: number, value: string) => {
    const updatedGoals = [...newGoals];
    updatedGoals[index] = value;
    setNewGoals(updatedGoals);
  };
  
  const handleSaveConfession = () => {
    const validGoals = newGoals.filter(goal => goal.trim().length > 0);
    
    if (validGoals.length === 0) {
      Alert.alert('Please add at least one spiritual goal');
      return;
    }
    
    addConfessionEntry(validGoals, notes.trim() || undefined);
    setNewGoals(['']);
    setNotes('');
    setShowModal(false);
    
    Alert.alert(
      'Confession Recorded',
      'Your spiritual goals have been saved. May God bless your journey of growth.',
      [{ text: 'Amen', style: 'default' }]
    );
  };
  
  const getStatusMessage = () => {
    if (!confessionData.lastConfessionDate) {
      return "Begin your spiritual journey with confession";
    }
    
    if (daysSinceLastConfession === null) return "";
    
    if (daysSinceLastConfession === 0) {
      return "Confession completed today - walk in grace";
    } else if (daysSinceLastConfession === 1) {
      return "1 day since last confession";
    } else if (daysSinceLastConfession <= 7) {
      return `${daysSinceLastConfession} days since last confession`;
    } else if (daysSinceLastConfession <= 30) {
      return `${daysSinceLastConfession} days since last confession - consider scheduling soon`;
    } else {
      return `${daysSinceLastConfession} days since last confession - time for spiritual renewal`;
    }
  };
  
  const getStatusColor = () => {
    if (!daysSinceLastConfession) return theme.secondary;
    if (daysSinceLastConfession <= 7) return '#4CAF50';
    if (daysSinceLastConfession <= 30) return '#FF9800';
    return '#F44336';
  };
  
  return (
    <>
      <TouchableOpacity
        style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}
        onPress={() => setShowModal(true)}
        activeOpacity={0.8}
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Heart size={20} color="#E91E63" />
            <Text style={[styles.title, { color: theme.text }]}>Confession Tracker</Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: theme.primary }]}
            onPress={() => setShowModal(true)}
          >
            <Plus size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.statusContainer}>
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {getStatusMessage()}
          </Text>
          
          {confessionData.lastConfessionDate && (
            <Text style={[styles.lastDateText, { color: theme.secondary }]}>
              Last confession: {new Date(confessionData.lastConfessionDate).toLocaleDateString()}
            </Text>
          )}
        </View>
        
        {confessionData.entries.length > 0 && (
          <View style={styles.goalsContainer}>
            <Text style={[styles.goalsTitle, { color: theme.text }]}>Current Spiritual Goals:</Text>
            {confessionData.entries[0].spiritualGoals.slice(0, 2).map((goal, index) => (
              <Text key={index} style={[styles.goalText, { color: theme.secondary }]}>
                • {goal}
              </Text>
            ))}
            {confessionData.entries[0].spiritualGoals.length > 2 && (
              <Text style={[styles.moreGoalsText, { color: theme.primary }]}>
                +{confessionData.entries[0].spiritualGoals.length - 2} more goals
              </Text>
            )}
          </View>
        )}
      </TouchableOpacity>
      
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <X size={24} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Record Confession</Text>
            <TouchableOpacity onPress={handleSaveConfession}>
              <Check size={24} color={theme.primary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Spiritual Goals for Growth
            </Text>
            <Text style={[styles.sectionSubtitle, { color: theme.secondary }]}>
              Focus on positive changes and spiritual development
            </Text>
            
            {newGoals.map((goal, index) => (
              <View key={index} style={styles.goalInputContainer}>
                <TextInput
                  style={[styles.goalInput, { 
                    backgroundColor: theme.card, 
                    color: theme.text,
                    borderColor: theme.border 
                  }]}
                  placeholder={`Spiritual goal ${index + 1}...`}
                  placeholderTextColor={theme.secondary}
                  value={goal}
                  onChangeText={(text) => handleGoalChange(index, text)}
                  multiline
                />
                {newGoals.length > 1 && (
                  <TouchableOpacity 
                    style={styles.removeGoalButton}
                    onPress={() => handleRemoveGoal(index)}
                  >
                    <X size={16} color={theme.secondary} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            
            <TouchableOpacity 
              style={[styles.addGoalButton, { borderColor: theme.border }]}
              onPress={handleAddGoal}
            >
              <Plus size={16} color={theme.primary} />
              <Text style={[styles.addGoalText, { color: theme.primary }]}>Add Another Goal</Text>
            </TouchableOpacity>
            
            <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 24 }]}>
              Personal Notes (Optional)
            </Text>
            <TextInput
              style={[styles.notesInput, { 
                backgroundColor: theme.card, 
                color: theme.text,
                borderColor: theme.border 
              }]}
              placeholder="Reflections, prayers, or reminders..."
              placeholderTextColor={theme.secondary}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
            />
            
            <View style={styles.modalFooter}>
              <Text style={[styles.footerText, { color: theme.secondary }]}>
                This tracker helps you focus on spiritual growth and positive change. 
                Your privacy is protected - no sensitive information is stored.
              </Text>
            </View>
          </ScrollView>
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
    marginBottom: 12,
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
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusContainer: {
    marginBottom: 12,
  },
  statusText: {
    fontSize: typography.sizes.sm,
    fontWeight: '500',
    marginBottom: 4,
  },
  lastDateText: {
    fontSize: typography.sizes.xs,
    fontStyle: 'italic',
  },
  goalsContainer: {
    marginTop: 8,
  },
  goalsTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    marginBottom: 6,
  },
  goalText: {
    fontSize: typography.sizes.sm,
    marginBottom: 2,
    lineHeight: typography.sizes.sm * 1.3,
  },
  moreGoalsText: {
    fontSize: typography.sizes.xs,
    fontWeight: '500',
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: typography.sizes.sm,
    marginBottom: 16,
    lineHeight: typography.sizes.sm * 1.3,
  },
  goalInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  goalInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: typography.sizes.md,
    minHeight: 48,
    textAlignVertical: 'top',
  },
  removeGoalButton: {
    marginLeft: 8,
    marginTop: 12,
    padding: 4,
  },
  addGoalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  addGoalText: {
    fontSize: typography.sizes.sm,
    fontWeight: '500',
    marginLeft: 8,
  },
  notesInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: typography.sizes.md,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalFooter: {
    marginTop: 24,
    paddingTop: 16,
  },
  footerText: {
    fontSize: typography.sizes.xs,
    lineHeight: typography.sizes.xs * 1.4,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});