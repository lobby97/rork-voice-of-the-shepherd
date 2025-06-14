import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Play, Pause, Heart, Share2, ArrowLeft, SkipForward, SkipBack, List } from 'lucide-react-native';
import { quotes } from '@/mocks/quotes';
import { usePlayerStore } from '@/store/playerStore';
import { AudioWaveform } from '@/components/AudioWaveform';
import { typography } from '@/constants/typography';
import { useSettingsStore } from '@/store/settingsStore';
import { colors } from '@/constants/colors';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';

export default function QuoteDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { 
    currentQuote, 
    isPlaying,
    currentPlaylist,
    currentIndex,
    playQuote, 
    pauseQuote, 
    resumeQuote,
    nextQuote,
    previousQuote,
    toggleFavorite, 
    isFavorite,
    addToHistory
  } = usePlayerStore();
  const { isDarkMode } = useSettingsStore();
  
  const theme = isDarkMode ? colors.dark : colors.light;
  
  const quote = quotes.find(q => q.id === id);
  
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
  const showPlaylistControls = currentPlaylist.length > 1;
  
  useEffect(() => {
    addToHistory(quote.id);
  }, [quote.id]);
  
  const handlePlayPause = () => {
    if (isCurrentQuote) {
      isPlaying ? pauseQuote() : resumeQuote();
    } else {
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
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleNext = () => {
    nextQuote();
  };

  const handlePrevious = () => {
    previousQuote();
  };

  const handlePlayAll = () => {
    playQuote(quote, quotes);
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: false,
        }}
      />
      
      <Image 
        source={{ uri: quote.imageUrl }} 
        style={styles.backgroundImage}
        contentFit="cover"
      />
      
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.9)']}
        style={styles.gradient}
      />

      {/* Custom Header */}
      <View style={styles.customHeader}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleGoBack}
          activeOpacity={0.8}
        >
          <ArrowLeft size={24} color="#FFFFFF" strokeWidth={2.5} />
        </TouchableOpacity>
        
        {!isCurrentQuote && (
          <TouchableOpacity 
            style={styles.playAllButton}
            onPress={handlePlayAll}
            activeOpacity={0.8}
          >
            <List size={18} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.playAllText}>Play All</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.categoryContainer}>
          <Text style={styles.category}>{quote.category}</Text>
        </View>
        
        <Text style={styles.quote}>{quote.text}</Text>
        
        <Text style={styles.attribution}>{quote.attribution}</Text>
        
        <Text style={styles.reference}>{quote.reference}</Text>
        
        <View style={styles.playerContainer}>
          <View style={styles.playerControls}>
            <TouchableOpacity 
              style={[styles.favoriteButton, { backgroundColor: isFavorited ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.15)' }]} 
              onPress={handleFavorite}
            >
              <Heart 
                size={24} 
                color="#FFFFFF" 
                fill={isFavorited ? '#EF4444' : 'transparent'} 
              />
            </TouchableOpacity>
            
            {showPlaylistControls && (
              <TouchableOpacity 
                style={[styles.controlButton, { backgroundColor: 'rgba(255,255,255,0.15)' }]} 
                onPress={handlePrevious}
              >
                <SkipBack size={28} color="#FFFFFF" />
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[styles.playButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]} 
              onPress={handlePlayPause}
            >
              {isCurrentlyPlaying ? (
                <Pause size={32} color="#FFFFFF" />
              ) : (
                <Play size={32} color="#FFFFFF" fill="#FFFFFF" />
              )}
            </TouchableOpacity>
            
            {showPlaylistControls && (
              <TouchableOpacity 
                style={[styles.controlButton, { backgroundColor: 'rgba(255,255,255,0.15)' }]} 
                onPress={handleNext}
              >
                <SkipForward size={28} color="#FFFFFF" />
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[styles.shareButton, { backgroundColor: 'rgba(255,255,255,0.15)' }]} 
              onPress={handleShare}
            >
              <Share2 size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          {showPlaylistControls && (
            <View style={styles.playlistInfo}>
              <Text style={styles.playlistText}>
                {currentIndex + 1} of {currentPlaylist.length}
              </Text>
            </View>
          )}
          
          {isCurrentlyPlaying && (
            <View style={styles.waveformContainer}>
              <AudioWaveform />
            </View>
          )}
        </View>
        
        <View style={styles.explanationContainer}>
          <Text style={styles.explanationTitle}>Reflection</Text>
          <Text style={styles.explanation}>{quote.explanation}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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
  customHeader: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playAllText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 140,
    paddingBottom: 60,
  },
  categoryContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  category: {
    color: '#FFFFFF',
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },
  quote: {
    color: '#FFFFFF',
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.semibold,
    marginBottom: 20,
    lineHeight: typography.lineHeights.normal * typography.sizes.xxxl,
    fontFamily: typography.fonts.quote,
  },
  attribution: {
    color: '#FFFFFF',
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  reference: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: typography.sizes.lg,
    fontStyle: 'italic',
    marginBottom: 48,
  },
  playerContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  playerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
  },
  playButton: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 24,
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
  },
  favoriteButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
  },
  shareButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
  },
  playlistInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
  },
  playlistText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
  waveformContainer: {
    marginTop: 24,
  },
  explanationContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 24,
  },
  explanationTitle: {
    color: '#FFFFFF',
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    marginBottom: 16,
  },
  explanation: {
    color: '#FFFFFF',
    fontSize: typography.sizes.lg,
    lineHeight: typography.lineHeights.relaxed * typography.sizes.lg,
    fontWeight: typography.weights.medium,
  },
  errorText: {
    fontSize: typography.sizes.lg,
    textAlign: 'center',
    marginTop: 100,
  },
});