import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, PanGestureHandler, State } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Heart, Share2, ArrowLeft, MoreHorizontal } from 'lucide-react-native';
import { quotes } from '@/mocks/quotes';
import { usePlayerStore } from '@/store/playerStore';
import { AudioWaveform } from '@/components/AudioWaveform';
import { typography } from '@/constants/typography';
import { useSettingsStore } from '@/store/settingsStore';
import { colors } from '@/constants/colors';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function QuoteDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { 
    currentQuote, 
    isPlaying,
    currentPlaylist,
    currentIndex,
    playQuote, 
    pauseQuote, 
    resumeQuote,
    swipeToNext,
    swipeToPrevious,
    toggleFavorite, 
    isFavorite,
    addToHistory,
    setTikTokMode
  } = usePlayerStore();
  const { isDarkMode } = useSettingsStore();
  
  const theme = isDarkMode ? colors.dark : colors.light;
  
  const quote = quotes.find(q => q.id === id);
  const [showDetails, setShowDetails] = useState(false);
  
  if (!quote) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.text }]}>Quote not found</Text>
      </View>
    );
  }
  
  const isCurrentQuote = currentQuote?.id === quote.id;
  const isCurrentlyPlaying = isCurrentQuote && isPlaying;
  const isFavorited = isFavorite(quote.id);
  
  useEffect(() => {
    addToHistory(quote.id);
    // Enter TikTok mode and start playing this quote with all quotes as playlist
    if (!isCurrentQuote) {
      setTikTokMode(true);
      playQuote(quote, quotes);
    }
  }, [quote.id]);
  
  const handlePlayPause = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (isCurrentQuote) {
      isPlaying ? pauseQuote() : resumeQuote();
    } else {
      setTikTokMode(true);
      playQuote(quote, quotes);
    }
  };
  
  const handleFavorite = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    toggleFavorite(quote.id);
  };
  
  const handleShare = () => {
    // Share functionality would go here
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleGoBack = () => {
    setTikTokMode(false);
    router.back();
  };

  const handleSwipeGesture = (event: any) => {
    const { translationY, velocityY, state } = event.nativeEvent;
    
    if (state === State.END) {
      const swipeThreshold = 50;
      const velocityThreshold = 500;
      
      if (Math.abs(translationY) > swipeThreshold || Math.abs(velocityY) > velocityThreshold) {
        if (translationY > 0 || velocityY > 0) {
          // Swipe down - previous quote
          const prevQuote = swipeToPrevious();
          if (prevQuote) {
            router.replace(`/quote/${prevQuote.id}`);
          }
        } else {
          // Swipe up - next quote
          const nextQuote = swipeToNext();
          if (nextQuote) {
            router.replace(`/quote/${nextQuote.id}`);
          }
        }
      }
    }
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: false,
        }}
      />
      
      <PanGestureHandler onGestureEvent={handleSwipeGesture}>
        <View style={styles.gestureContainer}>
          <TouchableOpacity 
            style={styles.playPauseArea}
            onPress={handlePlayPause}
            activeOpacity={1}
          >
            <Image 
              source={{ uri: quote.imageUrl }} 
              style={styles.backgroundImage}
              contentFit="cover"
            />
            
            <LinearGradient
              colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
              style={styles.gradient}
            />
          </TouchableOpacity>

          {/* Back Button */}
          <TouchableOpacity 
            style={[styles.backButton, { top: insets.top + 16 }]}
            onPress={handleGoBack}
            activeOpacity={0.8}
          >
            <ArrowLeft size={24} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>

          {/* Right Side Actions - TikTok Style */}
          <View style={[styles.rightActions, { bottom: insets.bottom + 120 }]}>
            <TouchableOpacity 
              style={[styles.actionButton, isFavorited && styles.favoriteActive]} 
              onPress={handleFavorite}
              activeOpacity={0.8}
            >
              <Heart 
                size={28} 
                color="#FFFFFF" 
                fill={isFavorited ? '#E25822' : 'transparent'} 
                strokeWidth={2}
              />
              <Text style={styles.actionText}>
                {isFavorited ? 'Liked' : 'Like'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={handleShare}
              activeOpacity={0.8}
            >
              <Share2 size={28} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => setShowDetails(!showDetails)}
              activeOpacity={0.8}
            >
              <MoreHorizontal size={28} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.actionText}>More</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Content */}
          <View style={[styles.bottomContent, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.categoryContainer}>
              <Text style={styles.category}>{quote.category}</Text>
            </View>
            
            <Text style={styles.quote}>{quote.text}</Text>
            
            <Text style={styles.attribution}>{quote.attribution}</Text>
            
            <Text style={styles.reference}>{quote.reference}</Text>
            
            {isCurrentlyPlaying && (
              <View style={styles.waveformContainer}>
                <AudioWaveform />
              </View>
            )}

            {/* Playlist indicator */}
            {currentPlaylist.length > 1 && (
              <View style={styles.playlistIndicator}>
                <Text style={styles.playlistText}>
                  {currentIndex + 1} / {currentPlaylist.length}
                </Text>
              </View>
            )}
          </View>

          {/* Details Overlay */}
          {showDetails && (
            <TouchableOpacity 
              style={styles.detailsOverlay}
              onPress={() => setShowDetails(false)}
              activeOpacity={1}
            >
              <View style={styles.detailsContent}>
                <Text style={styles.detailsTitle}>About this teaching</Text>
                <Text style={styles.detailsText}>{quote.explanation}</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </PanGestureHandler>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  gestureContainer: {
    flex: 1,
  },
  playPauseArea: {
    flex: 1,
  },
  backgroundImage: {
    width,
    height,
    position: 'absolute',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  rightActions: {
    position: 'absolute',
    right: 16,
    alignItems: 'center',
    zIndex: 1000,
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 8,
  },
  favoriteActive: {
    transform: [{ scale: 1.1 }],
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.xs,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  bottomContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 80, // Leave space for right actions
    padding: 20,
    zIndex: 1000,
  },
  categoryContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  category: {
    color: '#FFFFFF',
    fontSize: typography.sizes.xs,
    fontWeight: '600',
  },
  quote: {
    color: '#FFFFFF',
    fontSize: typography.sizes.xl,
    fontFamily: typography.quoteFont,
    marginBottom: 12,
    lineHeight: typography.sizes.xl * 1.3,
  },
  attribution: {
    color: '#FFFFFF',
    fontSize: typography.sizes.md,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  reference: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: typography.sizes.sm,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  waveformContainer: {
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  playlistIndicator: {
    alignSelf: 'flex-start',
  },
  playlistText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: typography.sizes.xs,
    fontWeight: '500',
  },
  detailsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  detailsContent: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    maxHeight: '70%',
  },
  detailsTitle: {
    color: '#FFFFFF',
    fontSize: typography.sizes.lg,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  detailsText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.md,
    lineHeight: typography.sizes.md * 1.6,
  },
  errorText: {
    fontSize: typography.sizes.lg,
    textAlign: 'center',
    marginTop: 100,
  },
});