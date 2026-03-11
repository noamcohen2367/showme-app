// ============================================
// ShowME App - Enhanced Search Screen
// ============================================

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  FlatList,
  Modal,
  Animated,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { getAppWidth } from '../utils/dimensions';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing } from '../theme/theme';
import { theaters } from '../data/theaters';
import { useShows } from '../hooks/useShows';
import { RootStackParamList, Show, ShowCategory, LocationArea } from '../types/types';
import { SearchResultsSkeleton } from '../components/Skeleton';
import { usePullToRefresh } from '../components/PullToRefresh';
import ErrorState from '../components/ErrorState';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SCREEN_WIDTH = getAppWidth();

type SearchNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Recent searches mock data
const RECENT_SEARCHES = [
  'Phantom of the Opera',
  'Musical',
  'Tel Aviv',
  'Comedy shows',
  'Weekend performances',
];

// Trending searches
const TRENDING_SEARCHES = [
  { text: 'Les Misérables', icon: 'trending-up' },
  { text: 'Family shows', icon: 'people' },
  { text: 'New releases', icon: 'sparkles' },
  { text: 'Under ₪100', icon: 'pricetag' },
];

const CATEGORIES: { id: ShowCategory; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'musical', label: 'Musical', icon: 'musical-notes' },
  { id: 'drama', label: 'Drama', icon: 'sad' },
  { id: 'comedy', label: 'Comedy', icon: 'happy' },
  { id: 'family', label: 'Family', icon: 'people' },
  { id: 'dance', label: 'Dance', icon: 'body' },
  { id: 'opera', label: 'Opera', icon: 'mic' },
];

const LOCATIONS: { id: LocationArea; label: string }[] = [
  { id: 'tel_aviv', label: 'Tel Aviv' },
  { id: 'jerusalem', label: 'Jerusalem' },
  { id: 'haifa', label: 'Haifa' },
  { id: 'beer_sheva', label: 'Beer Sheva' },
  { id: 'herzliya', label: 'Herzliya' },
];

const PRICE_RANGES = [
  { id: 'any', label: 'Any Price', min: 0, max: 999 },
  { id: 'budget', label: 'Under ₪100', min: 0, max: 100 },
  { id: 'mid', label: '₪100 - ₪200', min: 100, max: 200 },
  { id: 'premium', label: '₪200 - ₪350', min: 200, max: 350 },
  { id: 'vip', label: '₪350+', min: 350, max: 999 },
];

const SORT_OPTIONS = [
  { id: 'relevance', label: 'Relevance', icon: 'star' },
  { id: 'price_low', label: 'Price: Low to High', icon: 'arrow-up' },
  { id: 'price_high', label: 'Price: High to Low', icon: 'arrow-down' },
  { id: 'rating', label: 'Highest Rated', icon: 'thumbs-up' },
  { id: 'date', label: 'Date: Soonest', icon: 'calendar' },
];

export default function EnhancedSearchScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<SearchNavigationProp>();
  const insets = useSafeAreaInsets();
  const searchInputRef = useRef<TextInput>(null);
  const { shows, loading, error, refetch } = useShows();
  const { refreshControlProps } = usePullToRefresh(refetch);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState(RECENT_SEARCHES);

  // Filter state
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<ShowCategory[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<LocationArea[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('any');
  const [selectedSort, setSelectedSort] = useState('relevance');
  const [showAccessibleOnly, setShowAccessibleOnly] = useState(false);

  // Voice search state
  const [isListening, setIsListening] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Filter results
  const filteredShows = shows.filter(show => {
    // Text search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = show.title.toLowerCase().includes(query);
      const matchesTheater = theaters.find(t => t.id === show.theaterId)?.name.toLowerCase().includes(query);
      const matchesCategory = show.categories.some(c => c.toLowerCase().includes(query));
      if (!matchesTitle && !matchesTheater && !matchesCategory) return false;
    }

    // Category filter
    if (selectedCategories.length > 0) {
      if (!selectedCategories.some(c => show.categories.includes(c))) return false;
    }

    // Location filter
    if (selectedLocations.length > 0) {
      const theater = theaters.find(t => t.id === show.theaterId);
      if (!theater || !selectedLocations.includes(theater.location)) return false;
    }

    // Price filter
    const priceRange = PRICE_RANGES.find(p => p.id === selectedPriceRange);
    if (priceRange && priceRange.id !== 'any') {
      if (show.startingPrice < priceRange.min || show.startingPrice > priceRange.max) return false;
    }

    return show.isActive;
  });

  // Sort results
  const sortedShows = [...filteredShows].sort((a, b) => {
    switch (selectedSort) {
      case 'price_low': return a.startingPrice - b.startingPrice;
      case 'price_high': return b.startingPrice - a.startingPrice;
      case 'rating': return b.rating - a.rating;
      default: return 0;
    }
  });

  const activeFiltersCount = selectedCategories.length + selectedLocations.length + 
    (selectedPriceRange !== 'any' ? 1 : 0) + (showAccessibleOnly ? 1 : 0);

  // Voice search animation
  useEffect(() => {
    if (isListening) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.3, duration: 500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isListening]);

  const handleVoiceSearch = () => {
    setIsListening(true);
    // Simulate voice recognition
    setTimeout(() => {
      setIsListening(false);
      setSearchQuery('Musicals in Tel Aviv');
      setIsSearchFocused(false);
    }, 2000);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query && !recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    }
    setIsSearchFocused(false);
  };

  const clearRecentSearch = (search: string) => {
    setRecentSearches(prev => prev.filter(s => s !== search));
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedLocations([]);
    setSelectedPriceRange('any');
    setSelectedSort('relevance');
    setShowAccessibleOnly(false);
  };

  const toggleCategory = (category: ShowCategory) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const toggleLocation = (location: LocationArea) => {
    setSelectedLocations(prev =>
      prev.includes(location) ? prev.filter(l => l !== location) : [...prev, location]
    );
  };

  const renderSearchResult = ({ item }: { item: Show }) => {
    const theater = theaters.find(t => t.id === item.theaterId);
    
    return (
      <TouchableOpacity
        style={styles.resultCard}
        onPress={() => navigation.navigate('ShowDetails', { showId: item.id })}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.resultImage} contentFit="cover" transition={200} recyclingKey={item.id} />
        <View style={styles.resultContent}>
          <Text style={styles.resultTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.resultTheater} numberOfLines={1}>{theater?.name}</Text>
          <View style={styles.resultMeta}>
            <View style={styles.resultRating}>
              <Ionicons name="star" size={14} color={colors.accent.main} />
              <Text style={styles.resultRatingText}>{item.rating}</Text>
            </View>
            <Text style={styles.resultPrice}>From ₪{item.startingPrice}</Text>
          </View>
          <View style={styles.resultCategories}>
            {item.categories.slice(0, 2).map((cat, idx) => (
              <View key={idx} style={styles.resultCategoryBadge}>
                <Text style={styles.resultCategoryText}>{cat}</Text>
              </View>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFiltersModal = () => (
    <Modal
      visible={showFiltersModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowFiltersModal(false)}
    >
      <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
        {/* Modal Header */}
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowFiltersModal(false)}>
            <Ionicons name="close" size={24} color={colors.neutral.text} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Filters</Text>
          <TouchableOpacity onPress={clearAllFilters}>
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          {/* Categories */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Categories</Text>
            <View style={styles.filterChips}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.filterChip,
                    selectedCategories.includes(cat.id) && styles.filterChipActive,
                  ]}
                  onPress={() => toggleCategory(cat.id)}
                >
                  <Ionicons
                    name={cat.icon}
                    size={16}
                    color={selectedCategories.includes(cat.id) ? colors.neutral.white : colors.neutral.textSecondary}
                  />
                  <Text style={[
                    styles.filterChipText,
                    selectedCategories.includes(cat.id) && styles.filterChipTextActive,
                  ]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Locations */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Location</Text>
            <View style={styles.filterChips}>
              {LOCATIONS.map((loc) => (
                <TouchableOpacity
                  key={loc.id}
                  style={[
                    styles.filterChip,
                    selectedLocations.includes(loc.id) && styles.filterChipActive,
                  ]}
                  onPress={() => toggleLocation(loc.id)}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedLocations.includes(loc.id) && styles.filterChipTextActive,
                  ]}>
                    {loc.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Price Range */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Price Range</Text>
            <View style={styles.priceOptions}>
              {PRICE_RANGES.map((price) => (
                <TouchableOpacity
                  key={price.id}
                  style={[
                    styles.priceOption,
                    selectedPriceRange === price.id && styles.priceOptionActive,
                  ]}
                  onPress={() => setSelectedPriceRange(price.id)}
                >
                  <Text style={[
                    styles.priceOptionText,
                    selectedPriceRange === price.id && styles.priceOptionTextActive,
                  ]}>
                    {price.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sort By */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Sort By</Text>
            {SORT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.sortOption,
                  selectedSort === option.id && styles.sortOptionActive,
                ]}
                onPress={() => setSelectedSort(option.id)}
              >
                <View style={styles.sortOptionLeft}>
                  <Ionicons
                    name={option.icon as any}
                    size={20}
                    color={selectedSort === option.id ? colors.primary.main : colors.neutral.textSecondary}
                  />
                  <Text style={[
                    styles.sortOptionText,
                    selectedSort === option.id && styles.sortOptionTextActive,
                  ]}>
                    {option.label}
                  </Text>
                </View>
                {selectedSort === option.id && (
                  <Ionicons name="checkmark" size={20} color={colors.primary.main} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Accessibility */}
          <View style={styles.filterSection}>
            <TouchableOpacity
              style={styles.accessibilityOption}
              onPress={() => setShowAccessibleOnly(!showAccessibleOnly)}
            >
              <View style={styles.accessibilityLeft}>
                <Ionicons name="accessibility" size={24} color={colors.primary.main} />
                <View>
                  <Text style={styles.accessibilityTitle}>Wheelchair Accessible</Text>
                  <Text style={styles.accessibilityDesc}>Show only accessible venues</Text>
                </View>
              </View>
              <View style={[
                styles.checkbox,
                showAccessibleOnly && styles.checkboxActive,
              ]}>
                {showAccessibleOnly && (
                  <Ionicons name="checkmark" size={16} color={colors.neutral.white} />
                )}
              </View>
            </TouchableOpacity>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Apply Button */}
        <View style={[styles.modalFooter, { paddingBottom: insets.bottom + spacing.md }]}>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => setShowFiltersModal(false)}
          >
            <LinearGradient
              colors={[colors.primary.main, colors.secondary.main]}
              style={styles.applyButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.applyButtonText}>
                Show {sortedShows.length} Results
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderVoiceModal = () => (
    <Modal
      visible={isListening}
      transparent
      animationType="fade"
    >
      <View style={styles.voiceModal}>
        <View style={styles.voiceContent}>
          <Animated.View style={[styles.voiceCircle, { transform: [{ scale: pulseAnim }] }]}>
            <LinearGradient
              colors={[colors.primary.main, colors.secondary.main]}
              style={styles.voiceCircleGradient}
            >
              <Ionicons name="mic" size={40} color={colors.neutral.white} />
            </LinearGradient>
          </Animated.View>
          <Text style={styles.voiceText}>Listening...</Text>
          <Text style={styles.voiceHint}>Try "Musicals in Tel Aviv"</Text>
          <TouchableOpacity
            style={styles.voiceCancelButton}
            onPress={() => setIsListening(false)}
          >
            <Text style={styles.voiceCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.neutral.background} />

      {/* Search Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, isSearchFocused && styles.searchBarFocused]}>
            <Ionicons name="search" size={20} color={colors.neutral.textTertiary} />
            <TextInput
              ref={searchInputRef}
              style={styles.searchInput}
              placeholder="Search shows, theaters..."
              placeholderTextColor={colors.neutral.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onSubmitEditing={() => handleSearch(searchQuery)}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={colors.neutral.textTertiary} />
              </TouchableOpacity>
            )}
            {/* MVP hidden temporarily – Voice Search planned for future release */}
            {/* <TouchableOpacity style={styles.voiceButton} onPress={handleVoiceSearch}>
              <Ionicons name="mic" size={20} color={colors.primary.main} />
            </TouchableOpacity> */}
          </View>

          {!isSearchFocused && (
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowFiltersModal(true)}
            >
              <Ionicons name="options" size={22} color={colors.neutral.text} />
              {activeFiltersCount > 0 && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}

          {isSearchFocused && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setIsSearchFocused(false);
                searchInputRef.current?.blur();
              }}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search Suggestions (when focused) */}
      {isSearchFocused && (
        <ScrollView style={styles.suggestionsContainer} showsVerticalScrollIndicator={false}>
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <View style={styles.suggestionsSection}>
              <View style={styles.suggestionsSectionHeader}>
                <Text style={styles.suggestionsSectionTitle}>Recent Searches</Text>
                <TouchableOpacity onPress={() => setRecentSearches([])}>
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              </View>
              {recentSearches.map((search, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => handleSearch(search)}
                >
                  <Ionicons name="time-outline" size={18} color={colors.neutral.textTertiary} />
                  <Text style={styles.suggestionText}>{search}</Text>
                  <TouchableOpacity onPress={() => clearRecentSearch(search)}>
                    <Ionicons name="close" size={18} color={colors.neutral.textTertiary} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Trending */}
          <View style={styles.suggestionsSection}>
            <Text style={styles.suggestionsSectionTitle}>Trending Now</Text>
            {TRENDING_SEARCHES.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionItem}
                onPress={() => handleSearch(item.text)}
              >
                <Ionicons name={item.icon as any} size={18} color={colors.primary.main} />
                <Text style={styles.suggestionText}>{item.text}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      )}

      {/* Search Results */}
      {!isSearchFocused && (
        loading && shows.length === 0 ? (
          <View style={styles.resultsList}>
            <SearchResultsSkeleton count={4} />
          </View>
        ) : (
          <>
            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.activeFilters}
                contentContainerStyle={styles.activeFiltersContent}
              >
                {selectedCategories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={styles.activeFilterChip}
                    onPress={() => toggleCategory(cat)}
                  >
                    <Text style={styles.activeFilterText}>{cat}</Text>
                    <Ionicons name="close" size={14} color={colors.primary.main} />
                  </TouchableOpacity>
                ))}
                {selectedLocations.map((loc) => (
                  <TouchableOpacity
                    key={loc}
                    style={styles.activeFilterChip}
                    onPress={() => toggleLocation(loc)}
                  >
                    <Text style={styles.activeFilterText}>{loc.replace('_', ' ')}</Text>
                    <Ionicons name="close" size={14} color={colors.primary.main} />
                  </TouchableOpacity>
                ))}
                {selectedPriceRange !== 'any' && (
                  <TouchableOpacity
                    style={styles.activeFilterChip}
                    onPress={() => setSelectedPriceRange('any')}
                  >
                    <Text style={styles.activeFilterText}>
                      {PRICE_RANGES.find(p => p.id === selectedPriceRange)?.label}
                    </Text>
                    <Ionicons name="close" size={14} color={colors.primary.main} />
                  </TouchableOpacity>
                )}
              </ScrollView>
            )}

            {/* Results Count */}
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsCount}>{sortedShows.length} shows found</Text>
              <TouchableOpacity
                style={styles.sortButton}
                onPress={() => setShowFiltersModal(true)}
              >
                <Ionicons name="swap-vertical" size={18} color={colors.neutral.textSecondary} />
                <Text style={styles.sortButtonText}>
                  {SORT_OPTIONS.find(s => s.id === selectedSort)?.label}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Results List */}
            <FlatList
              data={sortedShows}
              renderItem={renderSearchResult}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.resultsList}
              showsVerticalScrollIndicator={false}
              refreshControl={<RefreshControl {...refreshControlProps} />}
              ListEmptyComponent={
                error && shows.length === 0 ? (
                  <ErrorState
                    message={t('errors.network')}
                    onRetry={refetch}
                  />
                ) : (
                  <View style={styles.emptyState}>
                    <Ionicons name="search" size={48} color={colors.neutral.textTertiary} />
                    <Text style={styles.emptyTitle}>No shows found</Text>
                    <Text style={styles.emptyText}>Try adjusting your filters or search terms</Text>
                  </View>
                )
              }
            />
          </>
        )
      )}

      {renderFiltersModal()}
      {/* MVP hidden temporarily – Voice modal planned for future release */}
      {/* {renderVoiceModal()} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  header: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  searchContainer: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.dark[700], borderRadius: 12, paddingHorizontal: spacing.md, height: 48, borderWidth: 1, borderColor: colors.dark[500] },
  searchBarFocused: { borderColor: colors.primary.main },
  searchInput: { flex: 1, ...typography.bodyMedium, color: colors.neutral.text, marginHorizontal: spacing.sm },
  voiceButton: { padding: spacing.xs },
  filterButton: { width: 48, height: 48, backgroundColor: colors.dark[700], borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.dark[500] },
  filterBadge: { position: 'absolute', top: 6, end: 6, backgroundColor: colors.primary.main, borderRadius: 10, width: 18, height: 18, alignItems: 'center', justifyContent: 'center' },
  filterBadgeText: { ...typography.caption, color: colors.neutral.white, fontSize: 10 },
  cancelButton: { paddingHorizontal: spacing.sm },
  cancelText: { ...typography.labelMedium, color: colors.primary.main },
  suggestionsContainer: { flex: 1, paddingHorizontal: spacing.lg },
  suggestionsSection: { marginBottom: spacing.xl },
  suggestionsSectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  suggestionsSectionTitle: { ...typography.labelMedium, color: colors.neutral.textSecondary, textTransform: 'uppercase', letterSpacing: 1 },
  clearText: { ...typography.labelSmall, color: colors.primary.main },
  suggestionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, gap: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.dark[600] },
  suggestionText: { flex: 1, ...typography.bodyMedium, color: colors.neutral.text },
  activeFilters: { maxHeight: 50, marginBottom: spacing.sm },
  activeFiltersContent: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  activeFilterChip: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, backgroundColor: 'rgba(168, 85, 247, 0.2)', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: 20, borderWidth: 1, borderColor: colors.primary.main },
  activeFilterText: { ...typography.labelSmall, color: colors.primary.main, textTransform: 'capitalize' },
  resultsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  resultsCount: { ...typography.bodySmall, color: colors.neutral.textSecondary },
  sortButton: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  sortButtonText: { ...typography.labelSmall, color: colors.neutral.textSecondary },
  resultsList: { paddingHorizontal: spacing.lg, paddingBottom: 100 },
  resultCard: { flexDirection: 'row', backgroundColor: colors.dark[700], borderRadius: 16, marginBottom: spacing.md, overflow: 'hidden', borderWidth: 1, borderColor: colors.dark[500] },
  resultImage: { width: 100, height: 130 },
  resultContent: { flex: 1, padding: spacing.md },
  resultTitle: { ...typography.labelLarge, color: colors.neutral.text, marginBottom: spacing.xxs },
  resultTheater: { ...typography.bodySmall, color: colors.neutral.textSecondary, marginBottom: spacing.sm },
  resultMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  resultRating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  resultRatingText: { ...typography.labelSmall, color: colors.neutral.text },
  resultPrice: { ...typography.labelMedium, color: colors.primary.main },
  resultCategories: { flexDirection: 'row', gap: spacing.xs },
  resultCategoryBadge: { backgroundColor: colors.dark[600], paddingHorizontal: spacing.sm, paddingVertical: spacing.xxs, borderRadius: 6 },
  resultCategoryText: { ...typography.caption, color: colors.neutral.textSecondary, textTransform: 'capitalize' },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xxl * 2 },
  emptyTitle: { ...typography.headingSmall, color: colors.neutral.text, marginTop: spacing.lg },
  emptyText: { ...typography.bodyMedium, color: colors.neutral.textTertiary, marginTop: spacing.sm },
  modalContainer: { flex: 1, backgroundColor: 'transparent' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.dark[500] },
  modalTitle: { ...typography.headingMedium, color: colors.neutral.text },
  clearAllText: { ...typography.labelMedium, color: colors.primary.main },
  modalContent: { flex: 1, paddingHorizontal: spacing.lg },
  filterSection: { paddingVertical: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.dark[600] },
  filterSectionTitle: { ...typography.labelMedium, color: colors.neutral.text, marginBottom: spacing.md },
  filterChips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  filterChip: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: 20, backgroundColor: colors.dark[700], borderWidth: 1, borderColor: colors.dark[500] },
  filterChipActive: { backgroundColor: colors.primary.main, borderColor: colors.primary.main },
  filterChipText: { ...typography.labelSmall, color: colors.neutral.textSecondary },
  filterChipTextActive: { color: colors.neutral.white },
  priceOptions: { gap: spacing.sm },
  priceOption: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg, borderRadius: 12, backgroundColor: colors.dark[700], borderWidth: 1, borderColor: colors.dark[500] },
  priceOptionActive: { borderColor: colors.primary.main, backgroundColor: 'rgba(168, 85, 247, 0.1)' },
  priceOptionText: { ...typography.bodyMedium, color: colors.neutral.textSecondary },
  priceOptionTextActive: { color: colors.primary.main },
  sortOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.md },
  sortOptionActive: {},
  sortOptionLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  sortOptionText: { ...typography.bodyMedium, color: colors.neutral.textSecondary },
  sortOptionTextActive: { color: colors.neutral.text },
  accessibilityOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  accessibilityLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  accessibilityTitle: { ...typography.labelMedium, color: colors.neutral.text },
  accessibilityDesc: { ...typography.caption, color: colors.neutral.textTertiary },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: colors.dark[400], alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: colors.primary.main, borderColor: colors.primary.main },
  modalFooter: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.dark[500] },
  applyButton: { borderRadius: 12, overflow: 'hidden' },
  applyButtonGradient: { paddingVertical: spacing.lg, alignItems: 'center' },
  applyButtonText: { ...typography.labelLarge, color: colors.neutral.white },
  voiceModal: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.8)', alignItems: 'center', justifyContent: 'center' },
  voiceContent: { alignItems: 'center' },
  voiceCircle: { marginBottom: spacing.xl },
  voiceCircleGradient: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center' },
  voiceText: { ...typography.headingMedium, color: colors.neutral.white, marginBottom: spacing.sm },
  voiceHint: { ...typography.bodyMedium, color: colors.neutral.textSecondary, marginBottom: spacing.xl },
  voiceCancelButton: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl },
  voiceCancelText: { ...typography.labelMedium, color: colors.neutral.textSecondary },
});
