// ============================================
// ShowME App - Search Screen (Dark Aurora Theme)
// ============================================

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing } from '../theme/theme';
import { RootStackParamList, ShowCategory, Show } from '../types/types';
import { useShows } from '../hooks/useShows';
import { ShowCard } from '../components/components';
import { SearchResultsSkeleton } from '../components/Skeleton';
import { usePullToRefresh } from '../components/PullToRefresh';
import NetworkBanner from '../components/NetworkBanner';

type SearchNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Category data with gradients
const CATEGORIES: { id: ShowCategory; emoji: string; gradient: [string, string] }[] = [
  { id: 'musical', emoji: '🎵', gradient: ['#A855F7', '#7C3AED'] },
  { id: 'drama', emoji: '🎭', gradient: ['#EC4899', '#DB2777'] },
  { id: 'comedy', emoji: '😂', gradient: ['#F59E0B', '#D97706'] },
  { id: 'popular', emoji: '🔥', gradient: ['#F97316', '#EA580C'] },
  { id: 'short', emoji: '⏱️', gradient: ['#8B5CF6', '#7C3AED'] },
  { id: 'lgbt', emoji: '🌈', gradient: ['#EC4899', '#A855F7'] },
  { id: 'suspense', emoji: '😱', gradient: ['#6366F1', '#4F46E5'] },
  { id: 'romance', emoji: '❤️', gradient: ['#EF4444', '#DC2626'] },
  { id: 'new', emoji: '✨', gradient: ['#06B6D4', '#0891B2'] },
  { id: 'long_running', emoji: '🏆', gradient: ['#10B981', '#059669'] },
];

// Fuzzy search function
function fuzzySearch(query: string, showsList: Show[]): Show[] {
  if (!query.trim()) return [];
  
  const lowerQuery = query.toLowerCase().trim();
  
  const scored = showsList.map(show => {
    let score = 0;
    
    if (show.title.toLowerCase().includes(lowerQuery)) score += 100;
    if (show.titleHe.includes(query)) score += 100;
    if (show.titleRu.toLowerCase().includes(lowerQuery)) score += 100;
    
    const queryChars = lowerQuery.split('');
    let titleIndex = 0;
    const titleLower = show.title.toLowerCase();
    
    for (const char of queryChars) {
      const foundIndex = titleLower.indexOf(char, titleIndex);
      if (foundIndex !== -1) {
        score += 5;
        titleIndex = foundIndex + 1;
      }
    }
    
    if (show.description.toLowerCase().includes(lowerQuery)) score += 20;
    if (show.descriptionHe.includes(query)) score += 20;
    
    return { show, score };
  });
  
  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.show);
}

export default function SearchScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<SearchNavigationProp>();
  const insets = useSafeAreaInsets();

  const { shows, loading, isUsingFallback, refetch } = useShows();
  const { refreshControlProps } = usePullToRefresh(refetch);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ShowCategory | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Search results
  const searchResults = useMemo(() => {
    if (searchQuery.trim().length > 0) {
      return fuzzySearch(searchQuery, shows);
    }
    return [];
  }, [searchQuery, shows]);

  // Category filtered results
  const categoryResults = useMemo(() => {
    if (selectedCategory) {
      return shows.filter(show =>
        show.categories.includes(selectedCategory) && show.isActive
      );
    }
    return [];
  }, [selectedCategory, shows]);

  const handleCategoryPress = (category: ShowCategory) => {
    setSelectedCategory(category);
    setSearchQuery('');
    Keyboard.dismiss();
  };

  const handleClearCategory = () => {
    setSelectedCategory(null);
  };

  const navigateToShow = (showId: string) => {
    navigation.navigate('ShowDetails', { showId });
  };

  const renderShowItem = ({ item }: { item: Show }) => (
    <View style={styles.searchResultItem}>
      <ShowCard 
        show={item} 
        onPress={() => navigateToShow(item.id)}
        size="small"
      />
    </View>
  );

  const showResults = searchQuery.trim().length > 0 || selectedCategory !== null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.neutral.background} />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={styles.title}>{t('search.title')}</Text>
        
        {/* Search Bar */}
        <View style={[styles.searchContainer, isSearchFocused && styles.searchContainerFocused]}>
          <Ionicons 
            name="search" 
            size={20} 
            color={isSearchFocused ? colors.primary.main : colors.neutral.textTertiary} 
          />
          <TextInput
            style={styles.searchInput}
            placeholder={t('search.placeholder')}
            placeholderTextColor={colors.neutral.textTertiary}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              if (text.length > 0) setSelectedCategory(null);
            }}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.neutral.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <NetworkBanner
        visible={isUsingFallback && !bannerDismissed}
        onRetry={refetch}
        onDismiss={() => setBannerDismissed(true)}
      />

      {/* Category Filter Badge */}
      {selectedCategory && (
        <View style={styles.activeFilterContainer}>
          <View style={styles.activeFilter}>
            <Text style={styles.activeFilterText}>
              {t(`categories.${selectedCategory}`)}
            </Text>
            <TouchableOpacity onPress={handleClearCategory}>
              <Ionicons name="close-circle" size={18} color={colors.primary.main} />
            </TouchableOpacity>
          </View>
          <Text style={styles.resultCount}>
            {categoryResults.length} {t('common.shows')}
          </Text>
        </View>
      )}

      {loading && shows.length === 0 ? (
        <View style={styles.resultsContainer}>
          <SearchResultsSkeleton count={4} />
        </View>
      ) : showResults ? (
        // Results View
        <FlatList
          data={searchQuery.trim().length > 0 ? searchResults : categoryResults}
          renderItem={renderShowItem}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.resultsContainer}
          columnWrapperStyle={styles.resultsRow}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl {...refreshControlProps} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color={colors.neutral.textTertiary} />
              <Text style={styles.emptyText}>{t('search.noResults')}</Text>
            </View>
          }
        />
      ) : (
        // Browse Categories View
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>{t('search.browseCategories')}</Text>
          
          <View style={styles.categoriesGrid}>
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(category.id)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={category.gradient}
                  style={styles.categoryGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                </LinearGradient>
                <Text style={styles.categoryLabel}>{t(`categories.${category.id}`)}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Recent Searches (placeholder) */}
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>{t('search.recentSearches')}</Text>
            <View style={styles.recentEmpty}>
              <Ionicons name="time-outline" size={24} color={colors.neutral.textTertiary} />
              <Text style={styles.recentEmptyText}>{t('search.noRecentSearches')}</Text>
            </View>
          </View>

          {/* Bottom spacing */}
          <View style={{ height: 100 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark[500],
  },
  title: {
    ...typography.displaySmall,
    color: colors.neutral.text,
    marginBottom: spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark[700],
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  searchContainerFocused: {
    borderColor: colors.primary.main,
    backgroundColor: colors.dark[600],
  },
  searchInput: {
    flex: 1,
    ...typography.bodyLarge,
    color: colors.neutral.text,
    marginLeft: spacing.sm,
    paddingVertical: spacing.xs,
  },
  activeFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark[500],
  },
  activeFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary.main,
  },
  activeFilterText: {
    ...typography.labelMedium,
    color: colors.primary.main,
    marginRight: spacing.xs,
  },
  resultCount: {
    ...typography.bodySmall,
    color: colors.neutral.textSecondary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  sectionTitle: {
    ...typography.headingMedium,
    color: colors.neutral.text,
    marginBottom: spacing.lg,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  categoryCard: {
    width: '20%',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xs,
  },
  categoryGradient: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  categoryEmoji: {
    fontSize: 26,
  },
  categoryLabel: {
    ...typography.labelSmall,
    color: colors.neutral.textSecondary,
    textAlign: 'center',
  },
  recentSection: {
    marginTop: spacing.xl,
  },
  recentEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    backgroundColor: colors.dark[700],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  recentEmptyText: {
    ...typography.bodyMedium,
    color: colors.neutral.textTertiary,
    marginLeft: spacing.sm,
  },
  resultsContainer: {
    padding: spacing.lg,
  },
  resultsRow: {
    justifyContent: 'space-between',
  },
  searchResultItem: {
    width: '48%',
    marginBottom: spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyText: {
    ...typography.bodyLarge,
    color: colors.neutral.textTertiary,
    marginTop: spacing.md,
  },
});
