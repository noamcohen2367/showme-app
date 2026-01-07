// ============================================
// ShowME App - Home Screen (Dark Aurora Theme)
// ============================================

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing } from '../theme/theme';
import {
  RootStackParamList,
  LocationArea,
  ShowCategory,
  Show,
} from '../types/types';
import { shows } from '../data/shows';
import { theaters } from '../data/theaters';

import {
  ShowCard,
  FilterChip,
  LocationFilter,
  CategoryFilter,
  SectionHeader,
} from '../components/components';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<HomeNavigationProp>();
  const insets = useSafeAreaInsets();

  // Filter state
  const [selectedLocation, setSelectedLocation] = useState<LocationArea | null>(
    null
  );
  const [selectedCategories, setSelectedCategories] = useState<ShowCategory[]>(
    []
  );
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // Get theater location map
  const theaterLocationMap = useMemo(() => {
    const map = new Map<string, LocationArea>();
    theaters.forEach((theater) => {
      map.set(theater.id, theater.location);
    });
    return map;
  }, []);

  // Filter shows based on selection
  const filteredShows = useMemo(() => {
    return shows.filter((show) => {
      if (selectedLocation) {
        const theaterLocation = theaterLocationMap.get(show.theaterId);
        if (theaterLocation !== selectedLocation) return false;
      }

      if (selectedCategories.length > 0) {
        const hasCategory = selectedCategories.some((cat) =>
          show.categories.includes(cat)
        );
        if (!hasCategory) return false;
      }

      return show.isActive;
    });
  }, [selectedLocation, selectedCategories, theaterLocationMap]);

  const topShows = filteredShows.slice(0, 5);

  const lastMinuteDeals = useMemo(() => {
    return filteredShows
      .filter((show) =>
        show.availableDates?.some((d) =>
          d.times?.some((t) => t.isLastMinuteDeal)
        )
      )
      .slice(0, 5);
  }, [filteredShows]);

  const trendingShows = useMemo(() => {
    return [...filteredShows].sort((a, b) => b.rating - a.rating).slice(0, 5);
  }, [filteredShows]);

  const handleCategoryToggle = (category: ShowCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const navigateToShow = (showId: string) => {
    navigation.navigate('ShowDetails', { showId });
  };

  const renderShowCard = ({ item }: { item: Show }) => (
    <ShowCard show={item} onPress={() => navigateToShow(item.id)} />
  );

  const getLocationLabel = () => {
    if (!selectedLocation) return t('locations.allLocations');
    return t(`locations.${selectedLocation}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.neutral.background}
      />

      {/* Aurora Gradient Background */}
      <View style={styles.auroraBackground}>
        <LinearGradient
          colors={[
            'rgba(168, 85, 247, 0.01)',
            'rgba(75, 27, 91, 0.01)',
            colors.neutral.background,
            'transparent',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.auroraGradient}
        />
      </View>

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <View>
          <Text style={styles.title}>{t('home.title')}</Text>
          <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
        </View>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Ionicons
            name="notifications-outline"
            size={24}
            color={colors.neutral.text}
          />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          <FilterChip
            label={getLocationLabel()}
            icon="location-outline"
            selected={selectedLocation !== null}
            onPress={() => setShowLocationModal(true)}
            showClear={selectedLocation !== null}
          />
          <FilterChip
            label={
              selectedCategories.length > 0
                ? `${t('common.category')} (${selectedCategories.length})`
                : t('common.category')
            }
            icon="grid-outline"
            selected={selectedCategories.length > 0}
            onPress={() => setShowCategoryModal(true)}
            showClear={selectedCategories.length > 0}
          />
          <FilterChip
            label={t('common.date')}
            icon="calendar-outline"
            onPress={() => {}}
          />
        </ScrollView>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Top in Your Area */}
        <View style={styles.section}>
          <SectionHeader
            title={t('home.topInYourArea')}
            onSeeAll={() => navigation.navigate('MainTabs')}
          />
          {topShows.length > 0 ? (
            <FlatList
              data={topShows}
              renderItem={renderShowCard}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          ) : (
            <View style={styles.emptySection}>
              <Text style={styles.emptyText}>{t('common.noResults')}</Text>
            </View>
          )}
        </View>

        {/* Last Minute Deals */}
        {lastMinuteDeals.length > 0 && (
          <View style={styles.section}>
            <SectionHeader
              title={t('home.lastMinuteDeals')}
              onSeeAll={() => {}}
            />
            <View style={styles.lastMinuteBanner}>
              <LinearGradient
                colors={['rgba(245, 158, 11, 0.2)', 'rgba(245, 158, 11, 0.05)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.lastMinuteGradient}
              />
              <Ionicons
                name="flash"
                size={20}
                color={colors.semantic.warning}
              />
              <Text style={styles.lastMinuteText}>
                {t('home.lastMinuteInfo')}
              </Text>
            </View>
            <FlatList
              data={lastMinuteDeals}
              renderItem={renderShowCard}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          </View>
        )}

        {/* Trending Now */}
        <View style={styles.section}>
          <SectionHeader
            title={t('home.trendingNow')}
            onSeeAll={() => navigation.navigate('MainTabs')}
          />
          {trendingShows.length > 0 ? (
            <FlatList
              data={trendingShows}
              renderItem={({ item }) => (
                <ShowCard
                  show={item}
                  onPress={() => navigateToShow(item.id)}
                  size="small"
                />
              )}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          ) : (
            <View style={styles.emptySection}>
              <Text style={styles.emptyText}>{t('common.noResults')}</Text>
            </View>
          )}
        </View>

        {/* Browse by Category Quick Access */}
        <View style={styles.section}>
          <SectionHeader
            title={t('search.browseCategories')}
            onSeeAll={() => navigation.navigate('MainTabs')}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryQuickAccess}
          >
            {[
              { id: 'musical', emoji: '🎵', gradient: ['#A855F7', '#7C3AED'] },
              { id: 'drama', emoji: '🎭', gradient: ['#EC4899', '#DB2777'] },
              { id: 'comedy', emoji: '😂', gradient: ['#F59E0B', '#D97706'] },
              { id: 'romance', emoji: '❤️', gradient: ['#EF4444', '#DC2626'] },
            ].map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={styles.categoryQuickCard}
                onPress={() => {
                  setSelectedCategories([cat.id as ShowCategory]);
                }}
              >
                <LinearGradient
                  colors={cat.gradient as [string, string]}
                  style={styles.categoryGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                </LinearGradient>
                <Text style={styles.categoryLabel}>
                  {t(`categories.${cat.id}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Special Features */}
        <View style={styles.section}>
          <SectionHeader title="Special Features" />
          <View style={styles.featuresGrid}>
            <TouchableOpacity
              style={styles.featureCard}
              onPress={() => navigation.navigate('GroupBooking')}
            >
              <LinearGradient
                colors={['rgba(168, 85, 247, 0.2)', 'rgba(168, 85, 247, 0.05)']}
                style={styles.featureGradient}
              >
                <View style={styles.featureIcon}>
                  <Ionicons
                    name="people"
                    size={24}
                    color={colors.primary.main}
                  />
                </View>
                <Text style={styles.featureTitle}>Group Booking</Text>
                <Text style={styles.featureDesc}>Up to 20% off for groups</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.featureCard}
              onPress={() => navigation.navigate('SpecialOccasions')}
            >
              <LinearGradient
                colors={['rgba(236, 72, 153, 0.2)', 'rgba(236, 72, 153, 0.05)']}
                style={styles.featureGradient}
              >
                <View style={styles.featureIcon}>
                  <Ionicons
                    name="gift"
                    size={24}
                    color={colors.secondary.main}
                  />
                </View>
                <Text style={styles.featureTitle}>Special Occasions</Text>
                <Text style={styles.featureDesc}>
                  Birthday, Anniversary & more
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom spacing for tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Modals */}
      <LocationFilter
        visible={showLocationModal}
        selectedLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
        onClose={() => setShowLocationModal(false)}
      />
      <CategoryFilter
        visible={showCategoryModal}
        selectedCategories={selectedCategories}
        onSelectCategory={handleCategoryToggle}
        onClearAll={() => setSelectedCategories([])}
        onClose={() => setShowCategoryModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.background,
  },
  auroraBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 800,
  },
  auroraGradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.displaySmall,
    color: colors.neutral.text,
  },
  subtitle: {
    ...typography.bodyMedium,
    color: colors.neutral.textSecondary,
    marginTop: spacing.xxs,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.dark[700],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.secondary.main,
  },
  filtersContainer: {
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark[500],
  },
  filtersContent: {
    paddingHorizontal: spacing.lg,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  horizontalList: {
    paddingHorizontal: spacing.lg,
  },
  emptySection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.bodyMedium,
    color: colors.neutral.textTertiary,
  },
  lastMinuteBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.dark[700],
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    overflow: 'hidden',
  },
  lastMinuteGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  lastMinuteText: {
    ...typography.bodySmall,
    color: colors.neutral.text,
    marginLeft: spacing.sm,
    flex: 1,
  },
  categoryQuickAccess: {
    paddingHorizontal: spacing.lg,
  },
  categoryQuickCard: {
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  categoryGradient: {
    width: 70,
    height: 70,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  categoryEmoji: {
    fontSize: 32,
  },
  categoryLabel: {
    ...typography.labelSmall,
    color: colors.neutral.textSecondary,
  },
  featuresGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  featureCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  featureGradient: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.dark[700],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    marginEnd: spacing.xs,
  },
  featureTitle: {
    ...typography.labelMedium,
    color: colors.neutral.text,
    marginBottom: spacing.xxs,
  },
  featureDesc: {
    ...typography.caption,
    color: colors.neutral.textTertiary,
    textAlign: 'center',
  },
});
