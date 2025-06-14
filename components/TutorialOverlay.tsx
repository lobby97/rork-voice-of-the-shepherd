import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { useSettingsStore } from '@/store/settingsStore';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { X, ArrowDown } from 'lucide-react-native';

interface TutorialOverlayProps {
  visible: boolean;
  title: string;
  description: string;
  targetPosition: { x: number; y: number; width: number; height: number };
  onDismiss: () => void;
  onNext?: () => void;
  isLast?: boolean;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  visible,
  title,
  description,
  targetPosition,
  onDismiss,
  onNext,
  isLast = false,
}) => {
  const { isDarkMode } = useSettingsStore();
  const theme = isDarkMode ? colors.dark : colors.light;
  const { width, height } = Dimensions.get('window');

  if (!visible) return null;

  const tooltipTop = targetPosition.y + targetPosition.height + 20;
  const tooltipLeft = Math.max(20, Math.min(width - 280, targetPosition.x - 100));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        {/* Highlight area */}
        <View
          style={[
            styles.highlight,
            {
              top: targetPosition.y - 8,
              left: targetPosition.x - 8,
              width: targetPosition.width + 16,
              height: targetPosition.height + 16,
            },
          ]}
        />

        {/* Tooltip */}
        <View
          style={[
            styles.tooltip,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
              top: tooltipTop,
              left: tooltipLeft,
            },
          ]}
        >
          <View style={styles.tooltipHeader}>
            <Text style={[styles.tooltipTitle, { color: theme.text }]}>
              {title}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onDismiss}
              activeOpacity={0.7}
            >
              <X size={20} color={theme.secondary} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.tooltipDescription, { color: theme.secondary }]}>
            {description}
          </Text>

          <View style={styles.tooltipFooter}>
            <TouchableOpacity
              style={styles.skipButton}
              onPress={onDismiss}
              activeOpacity={0.7}
            >
              <Text style={[styles.skipButtonText, { color: theme.secondary }]}>
                Skip Tutorial
              </Text>
            </TouchableOpacity>

            {onNext && (
              <TouchableOpacity
                style={[styles.nextButton, { backgroundColor: theme.primary }]}
                onPress={onNext}
                activeOpacity={0.8}
              >
                <Text style={styles.nextButtonText}>
                  {isLast ? 'Got it!' : 'Next'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Arrow pointing to target */}
        <View
          style={[
            styles.arrow,
            {
              top: tooltipTop - 10,
              left: tooltipLeft + 120,
            },
          ]}
        >
          <ArrowDown size={20} color={theme.card} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  highlight: {
    position: 'absolute',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#FFD700',
    backgroundColor: 'transparent',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  tooltip: {
    position: 'absolute',
    width: 260,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  tooltipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tooltipTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '600',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  tooltipDescription: {
    fontSize: typography.sizes.sm,
    lineHeight: typography.sizes.sm * 1.4,
    marginBottom: 16,
  },
  tooltipFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  skipButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: '500',
  },
  nextButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.sm,
    fontWeight: '600',
  },
  arrow: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});