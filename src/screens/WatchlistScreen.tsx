// ============================================
// ShowME App - Watchlist Screen
// ============================================

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
} from 'react-native';
import { Image } from 'expo-image';
import { Swipeable } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing } from '../theme/theme';
import { RootStackParamList } from '../types/types';
import { useWatchlist } from '../hooks/useWatchlist';
import { useShows } from '../hooks/useShows';
import { getTheaterById } from '../data/theaters';
import { Show } from '../types/types';

type WatchlistNav = NativeStackNavigationProp<RootStackParamList>;
type TabType = 'watchlist' | 'watched';

const CARD_HEIGHT = 200;
const CARD_MARGIN = 12; // spacing.md

// ── Swipe action backgrounds ────────────────────────────────────────────────

function WatchedAction({
  progress,
}: {
  progress: Animated.AnimatedInterpolation<number>;
}) {
  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
    extrapolate: 'clamp',
  });
  return (
    <Animated.View
      style={[styles.swipeAction, styles.swipeWatched, { transform: [{ scale }] }]}
    >
      <Ionicons name="checkmark-circle" size={28} color="#fff" />
      <Text style={styles.swipeActionText}>נצפה</Text>
    </Animated.View>
  );
}

function DeleteAction({
  progress,
}: {
  progress: Animated.AnimatedInterpolation<number>;
}) {
  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
    extrapolate: 'clamp',
  });
  return (
    <Animated.View
      style={[styles.swipeAction, styles.swipeDelete, { transform: [{ scale }] }]}
    >
      <Ionicons name="trash" size={28} color="#fff" />
      <Text style={styles.swipeActionText}>הסר</Text>
    </Animated.View>
  );
}

// ── Swipeable card (own animation state) ───────────────────────────────────

interface CardProps {
  show: Show;
  activeTab: TabType;
  isHebrew: boolean;
  onWatched: (id: string) => void;
  onDelete: (id: string) => void;
  onPress: (id: string) => void;
}

function SwipeableShowCard({
  show,
  activeTab,
  isHebrew,
  onWatched,
  onDelete,
  onPress,
}: CardProps) {
  const { t } = useTranslation();
  const theater = getTheaterById(show.theaterId);
  const title = isHebrew ? show.titleHe : show.title;
  const theaterName = theater
    ? isHebrew
      ? theater.nameHe
      : theater.name
    : '';

  // Animation values for the collapse effect
  const animHeight = useRef(new Animated.Value(CARD_HEIGHT)).current;
  const animOpacity = useRef(new Animated.Value(1)).current;
  const animMargin = useRef(new Animated.Value(CARD_MARGIN)).current;

  const collapse = (callback: () => void) => {
    Animated.parallel([
      Animated.timing(animHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(animOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(animMargin, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => callback());
  };

  // In RNGH Swipeable:
  //   direction === 'left'  → left side opened → user swiped RIGHT → watched
  //   direction === 'right' → right side opened → user swiped LEFT → delete
  const handleSwipeOpen = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      // Swiped right → mark as watched
      if (activeTab === 'watchlist') {
        collapse(() => onWatched(show.id));
      }
    } else {
      // Swiped left → delete
      collapse(() => onDelete(show.id));
    }
  };

  return (
    <Animated.View
      style={{
        height: animHeight,
        opacity: animOpacity,
        marginBottom: animMargin,
        overflow: 'hidden',
        borderRadius: 18,
      }}
    >
      <Swipeable
        friction={2}
        overshootLeft={false}
        overshootRight={false}
        renderLeftActions={
          activeTab === 'watchlist'
            ? progress => <WatchedAction progress={progress} />
            : undefined
        }
        renderRightActions={progress => <DeleteAction progress={progress} />}
        onSwipeableOpen={handleSwipeOpen}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.card}
          onPress={() => onPress(show.id)}
        >
          {/* Full-width image */}
          <Image
            source={{ uri: show.imageUrl }}
            style={styles.cardImage}
            contentFit="cover"
            transition={300}
          />

          {/* Gradient overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(10,10,18,0.55)', 'rgba(10,10,18,0.92)']}
            style={styles.cardGradient}
          />

          {/* Watched badge */}
          {activeTab === 'watched' && (
            <View style={styles.watchedBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#fff" />
              <Text style={styles.watchedBadgeText}>{t('watchlist.tabWatched')}</Text>
            </View>
          )}

          {/* Info overlay */}
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {title}
            </Text>
            <View style={styles.cardMeta}>
              <Ionicons
                name="business-outline"
                size={13}
                color="rgba(255,255,255,0.55)"
              />
              <Text style={styles.cardMetaText} numberOfLines={1}>
                {theaterName}
              </Text>
            </View>
            {show.startingPrice > 0 && (
              <Text style={styles.cardPrice}>
                {t('common.startingAt')} ₪{show.startingPrice}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </Swipeable>
    </Animated.View>
  );
}

// ── Main Screen ─────────────────────────────────────────────────────────────

export default function WatchlistScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<WatchlistNav>();
  const insets = useSafeAreaInsets();
  const isHebrew = i18n.language === 'he';

  const [activeTab, setActiveTab] = useState<TabType>('watchlist');

  const {
    watchlist,
    watched,
    loaded,
    markAsWatched,
    removeFromWatchlist,
    removeFromWatched,
    reload,
  } = useWatchlist();

  const { shows: allShows } = useShows();

  useFocusEffect(
    React.useCallback(() => {
      reload();
    }, [reload]),
  );

  const currentIds = activeTab === 'watchlist' ? watchlist : watched;
  const shows: Show[] = currentIds
    .map(id => allShows.find(s => s.id === id))
    .filter((s): s is Show => s !== undefined);

  // ── Empty state ────────────────────────────────────────────────────────────

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconBg}>
        <Ionicons
          name={
            activeTab === 'watchlist' ? 'heart-outline' : 'checkmark-circle-outline'
          }
          size={48}
          color={colors.neutral.textTertiary}
        />
      </View>
      <Text style={styles.emptyTitle}>
        {activeTab === 'watchlist'
          ? t('watchlist.emptyWatchlist')
          : t('watchlist.emptyWatched')}
      </Text>
      <Text style={styles.emptySubtitle}>
        {activeTab === 'watchlist'
          ? t('watchlist.emptyWatchlistDesc')
          : t('watchlist.emptyWatchedDesc')}
      </Text>
      {activeTab === 'watchlist' && (
        <TouchableOpacity
          style={styles.browseButton}
          onPress={() => navigation.navigate('MainTabs', { screen: 'Search' })}
        >
          <LinearGradient
            colors={[colors.primary.main, colors.primary.dark]}
            style={styles.browseButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.browseButtonText}>{t('watchlist.browseShows')}</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.neutral.background} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <View style={[styles.headerRow, { flexDirection: isHebrew ? 'row-reverse' : 'row' }]}>
          <Ionicons name="heart" size={26} color={colors.secondary.main} />
          <Text style={[styles.headerTitle, { marginStart: spacing.sm }]}>
            {t('watchlist.title')}
          </Text>
        </View>
        <Text style={[styles.headerSubtitle, { textAlign: isHebrew ? 'right' : 'left' }]}>
          {activeTab === 'watchlist'
            ? t('watchlist.countShows', { count: watchlist.length })
            : t('watchlist.countWatched', { count: watched.length })}
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'watchlist' && styles.tabActive]}
          onPress={() => setActiveTab('watchlist')}
        >
          {activeTab === 'watchlist' && (
            <LinearGradient
              colors={[colors.primary.main, colors.secondary.main]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          )}
          <Ionicons
            name={activeTab === 'watchlist' ? 'heart' : 'heart-outline'}
            size={16}
            color={activeTab === 'watchlist' ? '#fff' : colors.neutral.textSecondary}
          />
          <Text style={[styles.tabText, activeTab === 'watchlist' && styles.tabTextActive]}>
            {t('watchlist.tabWatchlist')}{watchlist.length > 0 ? ` (${watchlist.length})` : ''}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'watched' && styles.tabActive]}
          onPress={() => setActiveTab('watched')}
        >
          {activeTab === 'watched' && (
            <LinearGradient
              colors={[colors.primary.main, colors.secondary.main]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          )}
          <Ionicons
            name={activeTab === 'watched' ? 'checkmark-circle' : 'checkmark-circle-outline'}
            size={16}
            color={activeTab === 'watched' ? '#fff' : colors.neutral.textSecondary}
          />
          <Text style={[styles.tabText, activeTab === 'watched' && styles.tabTextActive]}>
            {t('watchlist.tabWatched')}{watched.length > 0 ? ` (${watched.length})` : ''}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Swipe hint */}
      {loaded && shows.length > 0 && (
        <View style={styles.swipeHintRow}>
          <Text style={styles.swipeHintLabel}>
            {activeTab === 'watchlist'
              ? `← ${t('watchlist.swipeLeftDelete')}  ·  ${t('watchlist.swipeRightWatched')} →`
              : `← ${t('watchlist.swipeLeftDelete')}`}
          </Text>
        </View>
      )}

      {/* Content */}
      {!loaded ? null : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {shows.length === 0
            ? renderEmptyState()
            : shows.map(show => (
                <SwipeableShowCard
                  key={show.id}
                  show={show}
                  activeTab={activeTab}
                  isHebrew={isHebrew}
                  onWatched={markAsWatched}
                  onDelete={
                    activeTab === 'watchlist' ? removeFromWatchlist : removeFromWatched
                  }
                  onPress={id => navigation.navigate('ShowDetails', { showId: id })}
                />
              ))}
          <View style={{ height: 100 }} />
        </ScrollView>
      )}
    </View>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  // ── Header ──────────────────────────────────────────────────────────────
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  headerRow: {
    alignItems: 'center',
    marginBottom: spacing.xxs,
  },
  headerTitle: {
    ...typography.displaySmall,
    color: colors.neutral.text,
  },
  headerSubtitle: {
    ...typography.bodySmall,
    color: colors.neutral.textTertiary,
    marginTop: spacing.xxs,
  },

  // ── Tabs ────────────────────────────────────────────────────────────────
  tabsRow: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    backgroundColor: colors.dark[700],
    borderRadius: 12,
    padding: spacing.xxs,
    marginBottom: spacing.sm,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: 10,
    overflow: 'hidden',
    gap: spacing.xs,
  },
  tabActive: {
    backgroundColor: 'transparent',
  },
  tabText: {
    ...typography.labelMedium,
    color: colors.neutral.textSecondary,
  },
  tabTextActive: {
    color: '#fff',
  },

  // ── Swipe hint row ──────────────────────────────────────────────────────
  swipeHintRow: {
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  swipeHintLabel: {
    ...typography.bodySmall,
    color: colors.neutral.textTertiary,
    fontSize: 11,
  },

  // ── Scroll ──────────────────────────────────────────────────────────────
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
  },

  // ── Show card ───────────────────────────────────────────────────────────
  card: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: colors.dark[700],
    height: CARD_HEIGHT,
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
  },
  cardGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  watchedBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(34, 197, 94, 0.8)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: 20,
  },
  watchedBadgeText: {
    ...typography.labelSmall,
    color: '#fff',
    fontSize: 11,
  },
  cardInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
  },
  cardTitle: {
    ...typography.headingSmall,
    color: '#fff',
    marginBottom: spacing.xxs,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    marginBottom: spacing.xxs,
  },
  cardMetaText: {
    ...typography.bodySmall,
    color: 'rgba(255,255,255,0.65)',
    flex: 1,
  },
  cardPrice: {
    ...typography.labelSmall,
    color: colors.primary.main,
  },

  // ── Swipe action panels ─────────────────────────────────────────────────
  swipeAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    height: CARD_HEIGHT,
    borderRadius: 18,
    gap: spacing.xxs,
  },
  swipeWatched: {
    backgroundColor: '#22c55e',
    marginRight: spacing.sm,
  },
  swipeDelete: {
    backgroundColor: '#ef4444',
    marginLeft: spacing.sm,
  },
  swipeActionText: {
    ...typography.labelSmall,
    color: '#fff',
  },

  // ── Empty state ─────────────────────────────────────────────────────────
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyIconBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.dark[700],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    ...typography.headingMedium,
    color: colors.neutral.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...typography.bodyMedium,
    color: colors.neutral.textTertiary,
    textAlign: 'center',
    maxWidth: 260,
  },
  browseButton: {
    marginTop: spacing.xl,
    borderRadius: 12,
    overflow: 'hidden',
  },
  browseButtonGradient: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
  },
  browseButtonText: {
    ...typography.labelLarge,
    color: '#fff',
  },
});
