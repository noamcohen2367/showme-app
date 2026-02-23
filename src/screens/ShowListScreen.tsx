// ============================================
// ShowME App - Show List Screen (Section "See All")
// ============================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing } from '../theme/theme';
import { RootStackParamList, ShowListSection } from '../types/types';
import { useShows } from '../hooks/useShows';
import { ShowCard } from '../components/components';
import { SearchResultsSkeleton } from '../components/Skeleton';
import ErrorState from '../components/ErrorState';

type ShowListRouteProp = RouteProp<RootStackParamList, 'ShowList'>;
type ShowListNavigationProp = NativeStackNavigationProp<RootStackParamList>;

function filterBySection(shows: ReturnType<typeof useShows>['shows'], section: ShowListSection) {
  const today = new Date();

  switch (section) {
    case 'top':
      return shows.filter((s) => s.badges?.includes('popular_in_area'));

    case 'trending':
      return shows.filter((s) => s.badges?.includes('selling_fast') || s.rating >= 4.5);

    case 'deals':
      return shows.filter((s) => s.originalPrice && s.startingPrice < s.originalPrice);

    case 'new': {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return shows.filter(
        (s) => s.premiereDate && new Date(s.premiereDate) >= threeMonthsAgo
      );
    }

    case 'recommended':
      return shows
        .filter((s) => s.rating >= 4.3)
        .sort((a, b) => b.rating - a.rating);

    case 'coming_soon':
      return shows.filter(
        (s) => s.availableDates?.length && new Date(s.availableDates[0].date) > today
      );

    case 'weekend': {
      const dayOfWeek = today.getDay();
      const friday = new Date(today);
      friday.setDate(today.getDate() + (dayOfWeek <= 5 ? 5 - dayOfWeek : 0));
      friday.setHours(0, 0, 0, 0);
      const sunday = new Date(today);
      sunday.setDate(today.getDate() + (dayOfWeek === 0 ? 0 : 7 - dayOfWeek));
      sunday.setHours(23, 59, 59, 999);
      return shows.filter((s) =>
        s.availableDates?.some((d) => {
          const showDate = new Date(d.date);
          return showDate >= friday && showDate <= sunday;
        })
      );
    }

    default:
      return shows;
  }
}

export default function ShowListScreen() {
  const route = useRoute<ShowListRouteProp>();
  const navigation = useNavigation<ShowListNavigationProp>();
  const insets = useSafeAreaInsets();
  const { title, section } = route.params;

  const { shows, loading, error, refetch } = useShows();

  const sectionShows = React.useMemo(
    () => filterBySection(shows, section),
    [shows, section]
  );

  const navigateToShow = (showId: string) => {
    navigation.navigate('ShowDetails', { showId });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={24} color={colors.neutral.text} />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.count}>
          {loading ? '' : `${sectionShows.length}`}
        </Text>
      </View>

      {/* Content */}
      {loading && shows.length === 0 ? (
        <View style={styles.listContent}>
          <SearchResultsSkeleton count={6} />
        </View>
      ) : error && shows.length === 0 ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : (
        <FlatList
          data={sectionShows}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <ShowCard
                show={item}
                onPress={() => navigateToShow(item.id)}
                size="large"
                fullWidth
              />
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={48} color={colors.neutral.textTertiary} />
              <Text style={styles.emptyText}>No shows in this section</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark[900],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.dark[700],
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.headingLarge,
    color: colors.neutral.text,
    flex: 1,
  },
  count: {
    ...typography.labelMedium,
    color: colors.neutral.textTertiary,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  cardWrapper: {
    marginBottom: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
    gap: spacing.md,
  },
  emptyText: {
    ...typography.bodyMedium,
    color: colors.neutral.textTertiary,
  },
});
