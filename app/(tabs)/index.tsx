import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { QuoteCard } from '@/components/QuoteCard';
import { StreakProgress } from '@/components/StreakProgress';
import { ConfessionTracker } from '@/components/ConfessionTracker';
import { MiniPlayer } from '@/components/MiniPlayer';
import { CongratulationsModal } from '@/components/CongratulationsModal';
import { quotes } from '@/mocks/quotes';
import { usePlayerStore } from '@/store/playerStore';
import { useSettingsStore } from '@/store/settingsStore';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Shuffle, TrendingUp } from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { 
    playQuote, 
    resetDailyProgressIfNeeded,
    showCongratulationsModal,
    dismissCongratulationsModal
  } = usePlayerStore();
  const { isDarkMode } = useSettingsStore();
  const [refreshing, setRefreshing] = React.useState(false);
  
  const theme = isDarkMode ? colors.dark : colors.light;
  
  // Reset daily progress if needed when app opens
  useEffect(() => {
    resetDailyProgressIfNeeded();
  }, []);
  
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);
  
  const handleQuotePress = (quote: any) => {
    router.push(`/quote/${quote.id}`);
  };
  
  const handlePlayRandomQuote = () => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    playQuote(randomQuote, quotes);
  };
  
  const featuredQuotes = quotes.slice(0, 3);
  const recentQuotes = quotes.slice(3, 8);
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.text }]}>
              Peace be with you
            </Text>
            <Text style={[styles.subtitle, { color: theme.secondary }]}>
              Continue your spiritual journey
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.shuffleButton, { backgroundColor: theme.primary }]}
            onPress={handlePlayRandomQuote}
          >
            <Shuffle size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        {/* Daily Spiritual Goal */}
        <StreakProgress />
        
        {/* Confession Tracker */}
        <ConfessionTracker />
        
        {/* Featured Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Featured Teachings
            </Text>
            <TouchableOpacity onPress={() => router.push('/categories')}>
              <Text style={[styles.seeAllText, { color: theme.primary }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
          
          {featuredQuotes.map((quote) => (
            <QuoteCard
              key={quote.id}
              quote={quote}
              onPress={() => handleQuotePress(quote)}
            />
          ))}
        </View>
        
        {/* Recent Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <TrendingUp size={20} color={theme.primary} />
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Continue Learning
              </Text>
            </View>
          </View>
          
          {recentQuotes.map((quote) => (
            <QuoteCard
              key={quote.id}
              quote={quote}
              onPress={() => handleQuotePress(quote)}
              compact
            />
          ))}
        </View>
        
        {/* Bottom spacing for mini player */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
      
      <MiniPlayer />
      
      <CongratulationsModal
        visible={showCongratulationsModal}
        onClose={dismissCongratulationsModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
  shuffleButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    marginLeft: 8,
  },
  seeAllText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
  bottomSpacing: {
    height: 100,
  },
});