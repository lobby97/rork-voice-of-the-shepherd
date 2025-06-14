import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react-native';
import { usePlayerStore } from '@/store/playerStore';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { useSettingsStore } from '@/store/settingsStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const MiniPlayer: React.FC = () => {
  const { 
    currentQuote, 
    isPlaying, 
    currentPlaylist,
    pauseQuote, 
    resumeQuote,
    nextQuote,
    previousQuote
  } = usePlayerStore();
  const { isDarkMode } = useSettingsStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const theme = isDarkMode ? colors.dark : colors.light;
  
  if (!currentQuote) return null;
  
  const handlePlayPause = () => {
    isPlaying ? pauseQuote() : resumeQuote();
  };
  
  const handlePress = () => {
    router.push(`/quote/${currentQuote.id}`);
  };
  
  const handleNext = () => {
    nextQuote();
  };
  
  const handlePrevious = () => {
    previousQuote();
  };
  
  const tabBarHeight = Platform.select({
    ios: 65 + insets.bottom,
    android: 65,
    web: 70,
    default: 70,
  });
  
  const showPlaylistControls = currentPlaylist.length > 1;
  
  return (
    <View style={[styles.container, { bottom: tabBarHeight + 12 }]}>
      <TouchableOpacity
        style={[
          styles.playerContainer, 
          { 
            backgroundColor: theme.card, 
            borderColor: theme.border,
          }
        ]}
        onPress={handlePress}
        activeOpacity={0.95}
      >
        <Image
          source={{ uri: currentQuote.imageUrl }}
          style={styles.image}
          contentFit="cover"
        />
        <View style={styles.content}>
          <Text 
            style={[styles.text, { color: theme.text }]} 
            numberOfLines={1}
          >
            {currentQuote.text}
          </Text>
          <Text style={[styles.category, { color: theme.secondary }]}>
            {currentQuote.category}
          </Text>
        </View>
        
        <View style={styles.controls}>
          {showPlaylistControls && (
            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: theme.muted }]}
              onPress={handlePrevious}
            >
              <SkipBack size={16} color={theme.text} />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[styles.playButton, { backgroundColor: theme.primary }]}
            onPress={handlePlayPause}
          >
            {isPlaying ? (
              <Pause size={18} color="#FFFFFF" />
            ) : (
              <Play size={18} color="#FFFFFF" fill="#FFFFFF" />
            )}
          </TouchableOpacity>
          
          {showPlaylistControls && (
            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: theme.muted }]}
              onPress={handleNext}
            >
              <SkipForward size={16} color={theme.text} />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 500,
  },
  playerContainer: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  content: {
    flex: 1,
    marginLeft: 16,
  },
  text: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    marginBottom: 4,
    fontFamily: typography.fonts.quote,
  },
  category: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    gap: 8,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});