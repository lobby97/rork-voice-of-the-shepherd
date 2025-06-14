import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { QuoteCard } from '@/components/QuoteCard';
import { StreakProgress } from '@/components/StreakProgress';
import { ConfessionTracker } from '@/components/ConfessionTracker';
import { CongratulationsModal } from '@/components/CongratulationsModal';
import { quotes } from '@/mocks/quotes';
import { usePlayerStore } from '@/store/playerStore';
import { useSettingsStore } from '@/store/settingsStore';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Play, Shuffle, Sparkles, Heart } from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { isDarkMode, hasCompletedOnboarding } = useSettingsStore();
  const { history, addToHistory, playQuote, resetDailyProgressIfNeeded, incrementListenedCount } = usePlayerStore();
  const insets = useSafeAreaInsets();
  
  const theme = isDarkMode ? colors.dark : colors.light;
  
  // Check if user needs onboarding
  useEffect(() => {
    if (!hasCompletedOnboarding) {
      router.replace('/onboarding/welcome');
    }
  }, [hasCompletedOnboarding]);
  
  // Reset daily progress if needed when component mounts
  useEffect(() => {
    resetDailyProgressIfNeeded();
  }, []);
  
  // Get a random quote for the daily feature
  const dailyQuote = quotes[Math.floor(Math.random() * quotes.length)];
  
  // Get recent quotes from history
  const recentQuotes = history
    .slice(0, 4)
    .map(id => quotes.find(q => q.id === id))
    .filter(Boolean);
  
  const handleQuotePress = (id: string) => {
    addToHistory(id);
    incrementListenedCount();
    router.push(`/quote/${id}`);
  };

  const handlePlayAll = () => {
    playQuote(quotes[0], quotes);
    incrementListenedCount();
    router.push(`/quote/${quotes[0].id}`);
  };

  const handlePlayDaily = () => {
    playQuote(dailyQuote, quotes);
    incrementListenedCount();
    router.push(`/quote/${dailyQuote.id}`);
  };
  
  return (
    <>
      <ScrollView 
        style={[styles.container, { backgroundColor: theme.background }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <View style={styles.titleContainer}>
            <View style={styles.titleRow}>
              <Sparkles size={28} color={theme.accent} />
              <Text style={[styles.title, { color: theme.text }]}>Voice of the Shepherd</Text>
            </View>
            <Text style={[styles.subtitle, { color: theme.secondary }]}>
              Find peace in His word today
            </Text>
          </View>
        </View>
        
        {/* Daily Featured Quote */}
        <View style={styles.dailySection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Today's Word</Text>
            <TouchableOpacity 
              style={[styles.playAllButton, { backgroundColor: theme.primary }]}
              onPress={handlePlayDaily}
              activeOpacity={0.8}
            >
              <Play size={16} color="#FFFFFF" fill="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[styles.dailyCard, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => handleQuotePress(dailyQuote.id)}
            activeOpacity={0.95}
          >
            <Image 
              source={{ uri: dailyQuote.imageUrl }} 
              style={styles.dailyImage}
              contentFit="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.dailyGradient}
            />
            <View style={styles.dailyContent}>
              <View style={[styles.dailyBadge, { backgroundColor: theme.accent }]}>
                <Text style={styles.dailyBadgeText}>Daily</Text>
              </View>
              <Text style={styles.dailyQuote}>{dailyQuote.text}</Text>
              <Text style={styles.dailyReference}>{dailyQuote.reference}</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={handlePlayAll}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIcon, { backgroundColor: theme.primary }]}>
              <Shuffle size={20} color="#FFFFFF" />
            </View>
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: theme.text }]}>Play All</Text>
              <Text style={[styles.actionSubtitle, { color: theme.secondary }]}>
                {quotes.length} teachings
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => router.push('/favorites')}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIcon, { backgroundColor: theme.error }]}>
              <Heart size={20} color="#FFFFFF" />
            </View>
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: theme.text }]}>Favorites</Text>
              <Text style={[styles.actionSubtitle, { color: theme.secondary }]}>
                Your saved
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Progress Tracking */}
        <StreakProgress />
        
        {/* Confession Tracker */}
        <ConfessionTracker />
        
        {/* Featured Teachings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Featured Teachings</Text>
          {quotes.slice(0, 3).map(quote => (
            <QuoteCard 
              key={quote.id} 
              quote={quote} 
              onPress={() => handleQuotePress(quote.id)}
            />
          ))}
        </View>
        
        {/* Recently Viewed */}
        {recentQuotes.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Continue Listening</Text>
            {recentQuotes.map(quote => (
              <QuoteCard 
                key={quote?.id} 
                quote={quote!} 
                compact 
                onPress={() => handleQuotePress(quote!.id)}
              />
            ))}
          </View>
        )}
        
        <View style={styles.footer} />
      </ScrollView>
      
      <CongratulationsModal />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 200,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  titleContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    marginLeft: 12,
    fontFamily: typography.fonts.heading,
  },
  subtitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
    lineHeight: typography.lineHeights.normal * typography.sizes.lg,
  },
  dailySection: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
  },
  playAllButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dailyCard: {
    height: 280,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  dailyImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  dailyGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
  },
  dailyContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 24,
  },
  dailyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  dailyBadgeText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  dailyQuote: {
    color: '#FFFFFF',
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    marginBottom: 12,
    lineHeight: typography.lineHeights.normal * typography.sizes.xl,
    fontFamily: typography.fonts.quote,
  },
  dailyReference: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    fontStyle: 'italic',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  actionCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  section: {
    marginBottom: 32,
  },
  footer: {
    height: 40,
  },
});