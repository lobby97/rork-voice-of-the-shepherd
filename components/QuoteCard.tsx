import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Pause, Heart } from 'lucide-react-native';
import { usePlayerStore } from '@/store/playerStore';
import { Quote } from '@/types';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { useSettingsStore } from '@/store/settingsStore';

interface QuoteCardProps {
  quote: Quote;
  onPress?: () => void;
  compact?: boolean;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({ 
  quote, 
  onPress,
  compact = false
}) => {
  const { 
    currentQuote, 
    isPlaying, 
    playQuote, 
    pauseQuote, 
    resumeQuote, 
    toggleFavorite, 
    favorites 
  } = usePlayerStore();
  const { isDarkMode } = useSettingsStore();
  
  const theme = isDarkMode ? colors.dark : colors.light;
  
  const isCurrentQuote = currentQuote?.id === quote.id;
  const isCurrentlyPlaying = isCurrentQuote && isPlaying;
  const isFavorited = favorites.includes(quote.id);
  
  const handlePlayPause = (e: any) => {
    e.stopPropagation();
    if (isCurrentQuote) {
      isPlaying ? pauseQuote() : resumeQuote();
    } else {
      playQuote(quote);
    }
  };
  
  const handleFavorite = (e: any) => {
    e.stopPropagation();
    toggleFavorite(quote.id);
  };
  
  if (compact) {
    return (
      <TouchableOpacity 
        style={[styles.compactContainer, { backgroundColor: theme.card, borderColor: theme.border }]} 
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Image 
          source={{ uri: quote.imageUrl }} 
          style={styles.compactImage}
          contentFit="cover"
        />
        <View style={styles.compactContent}>
          <Text 
            style={[styles.compactText, { color: theme.text }]} 
            numberOfLines={2}
          >
            {quote.text}
          </Text>
          <Text style={[styles.compactCategory, { color: theme.secondary }]}>
            {quote.category}
          </Text>
        </View>
        <View style={styles.compactControls}>
          <TouchableOpacity 
            style={[styles.compactFavoriteButton, { backgroundColor: isFavorited ? theme.error + '20' : theme.muted }]} 
            onPress={handleFavorite}
          >
            <Heart 
              size={16} 
              color={isFavorited ? theme.error : theme.secondary} 
              fill={isFavorited ? theme.error : 'transparent'} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.compactPlayButton, { backgroundColor: theme.primary }]} 
            onPress={handlePlayPause}
          >
            {isCurrentlyPlaying ? (
              <Pause size={16} color="#FFFFFF" />
            ) : (
              <Play size={16} color="#FFFFFF" fill="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }
  
  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]} 
      onPress={onPress}
      activeOpacity={0.95}
    >
      <Image 
        source={{ uri: quote.imageUrl }} 
        style={styles.image}
        contentFit="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.9)']}
        style={styles.gradient}
      />
      <View style={styles.content}>
        <View style={[styles.categoryBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
          <Text style={styles.category}>{quote.category}</Text>
        </View>
        <Text style={styles.quote}>{quote.text}</Text>
        <Text style={styles.attribution}>{quote.attribution}</Text>
        <Text style={styles.reference}>{quote.reference}</Text>
        
        <View style={styles.controls}>
          <TouchableOpacity 
            style={[styles.favoriteButton, { backgroundColor: isFavorited ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.15)' }]} 
            onPress={handleFavorite}
          >
            <Heart 
              size={20} 
              color="#FFFFFF" 
              fill={isFavorited ? '#EF4444' : 'transparent'} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.playButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]} 
            onPress={handlePlayPause}
          >
            {isCurrentlyPlaying ? (
              <Pause size={24} color="#FFFFFF" />
            ) : (
              <Play size={24} color="#FFFFFF" fill="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    marginHorizontal: 20,
    marginVertical: 8,
    height: 360,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '75%',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 24,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  category: {
    color: '#FFFFFF',
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },
  quote: {
    color: '#FFFFFF',
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    marginBottom: 12,
    lineHeight: typography.lineHeights.normal * typography.sizes.xl,
    fontFamily: typography.fonts.quote,
  },
  attribution: {
    color: '#FFFFFF',
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  reference: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: typography.sizes.md,
    fontStyle: 'italic',
    marginBottom: 24,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    left: 0,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 20,
    marginVertical: 6,
    height: 88,
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  compactImage: {
    width: 88,
    height: 88,
  },
  compactContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  compactText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    marginBottom: 6,
    lineHeight: typography.lineHeights.normal * typography.sizes.md,
    fontFamily: typography.fonts.quote,
  },
  compactCategory: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  compactControls: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
    gap: 8,
  },
  compactFavoriteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactPlayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});