// ============================================
// ShowME App - Show Details Screen (Dark Aurora Theme)
// ============================================

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
  FlatList,
} from 'react-native';
import { getAppWidth } from '../utils/dimensions';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing } from '../theme/theme';
import { RootStackParamList } from '../types/types';
import { useShow } from '../hooks/useShows';
import { getTheaterById } from '../data/theaters';
import { getActorById } from '../data/actors';
import Badge from '../components/Badge';
import ActorCard from '../components/ActorCard';
import { ShowDetailsSkeleton } from '../components/Skeleton';
import { useWatchlist } from '../hooks/useWatchlist';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SCREEN_WIDTH = getAppWidth();
const HEADER_HEIGHT = SCREEN_HEIGHT * 0.45;

type ShowDetailsNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ShowDetails'
>;
type ShowDetailsRouteProp = RouteProp<RootStackParamList, 'ShowDetails'>;

export default function ShowDetailsScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<ShowDetailsNavigationProp>();
  const route = useRoute<ShowDetailsRouteProp>();
  const insets = useSafeAreaInsets();
  const isHebrew = i18n.language === 'he';
  const isRussian = i18n.language === 'ru';

  const { showId } = route.params;
  const { show, loading } = useShow(showId);
  const theater = show ? getTheaterById(show.theaterId) : null;

  const { isInWatchlist, toggleWatchlist, isWatched, markAsWatched, removeFromWatched } = useWatchlist();
  const isWishlisted = isInWatchlist(showId);
  const isAlreadyWatched = isWatched(showId);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;
  const galleryScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (isHebrew) {
      setTimeout(
        () => galleryScrollRef.current?.scrollToEnd({ animated: false }),
        50,
      );
    }
  }, [isHebrew]);

  const nextDates = useMemo(() => {
    if (!show) return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return show.availableDates
      .filter((d) => new Date(d.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  }, [show]);

  if (loading) {
    return <ShowDetailsSkeleton />;
  }

  if (!show || !theater) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons
          name="alert-circle-outline"
          size={48}
          color={colors.semantic.error}
        />
        <Text style={styles.errorText}>{t('common.error')}</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>{t('common.back')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const title = isHebrew ? show.titleHe : isRussian ? show.titleRu : show.title;
  const description = isHebrew
    ? show.descriptionHe
    : isRussian
      ? show.descriptionRu
      : show.description;
  const theaterName = isHebrew
    ? theater.nameHe
    : isRussian
      ? theater.nameRu
      : theater.name;

  const galleryImages = show.galleryImages || [show.imageUrl];
  const castActors =
    show.actorIds?.map((id) => getActorById(id)).filter(Boolean) || [];

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT - 150],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const handleBookNow = () => {
    navigation.navigate('DateSelection', { showId: show.id });
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Animated Header Bar */}
      <Animated.View
        style={[
          styles.animatedHeader,
          { paddingTop: insets.top, opacity: headerOpacity },
        ]}
      >
        <LinearGradient
          colors={[colors.dark[800], colors.dark[800]]}
          style={StyleSheet.absoluteFill}
        />
        <Text style={styles.animatedHeaderTitle} numberOfLines={1}>
          {title}
        </Text>
      </Animated.View>

      {/* Back Button */}
      <TouchableOpacity
        style={[
          styles.headerButton,
          styles.headerButtonLeft,
          { top: insets.top + spacing.sm },
        ]}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Share & Wishlist Buttons */}
      <View
        style={[styles.headerButtonsRight, { top: insets.top + spacing.sm }]}
      >
        <TouchableOpacity style={styles.headerButton} onPress={() => {}}>
          <Ionicons name="share-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        {/* Watched toggle — mutually exclusive with watchlist */}
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => {
            if (isAlreadyWatched) {
              removeFromWatched(showId);
            } else {
              markAsWatched(showId); // also removes from watchlist internally
            }
          }}
        >
          <Ionicons
            name={isAlreadyWatched ? 'checkmark-circle' : 'checkmark-circle-outline'}
            size={24}
            color={isAlreadyWatched ? '#22c55e' : '#FFFFFF'}
          />
        </TouchableOpacity>
        {/* Watchlist toggle — disabled (dimmed) when show is already watched */}
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => {
            if (isAlreadyWatched) {
              // Pressing heart while watched: move back to watchlist
              removeFromWatched(showId);
              toggleWatchlist(showId); // not in watchlist → adds it
            } else {
              toggleWatchlist(showId);
            }
          }}
        >
          <Ionicons
            name={isWishlisted ? 'heart' : 'heart-outline'}
            size={24}
            color={
              isAlreadyWatched
                ? 'rgba(255,255,255,0.3)' // dimmed when watched
                : isWishlisted
                  ? colors.secondary.main
                  : '#FFFFFF'
            }
          />
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
      >
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: galleryImages[selectedImageIndex] }}
            style={styles.heroImage}
            contentFit="cover"
            transition={400}
          />
          <LinearGradient
            colors={['transparent', 'rgba(10, 10, 15, 0.6)', colors.dark[900]]}
            style={styles.heroGradient}
          />

          {/* Badges */}
          {show.badges && show.badges.length > 0 && (
            <View
              style={[
                styles.badgesContainer,
                isHebrew
                  ? {
                      flexDirection: 'row-reverse',
                      start: undefined,
                      end: spacing.lg,
                    }
                  : { flexDirection: 'row' },
              ]}
            >
              {show.badges.slice(0, 2).map((badge, index) => (
                <Badge key={index} type={badge} size="medium" />
              ))}
            </View>
          )}
        </View>

        {/* Gallery Thumbnails */}
        {galleryImages.length > 1 && (
          <View style={styles.galleryContainer}>
            <ScrollView
              ref={galleryScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {galleryImages.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedImageIndex(index)}
                  style={[
                    styles.galleryThumb,
                    selectedImageIndex === index && styles.galleryThumbSelected,
                  ]}
                >
                  <Image
                    source={{ uri: image }}
                    style={styles.galleryThumbImage}
                    contentFit="cover"
                    transition={200}
                    recyclingKey={`thumb-${index}`}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Content */}
        <View style={styles.content}>
          {/* Title & Rating */}
          <View
            style={[
              styles.titleSection,
              { alignItems: isHebrew ? 'flex-end' : 'flex-start' },
            ]}
          >
            <Text
              style={[styles.title, { textAlign: isHebrew ? 'right' : 'left' }]}
            >
              {title}
            </Text>
            <View
              style={[
                styles.ratingContainer,
                { flexDirection: isHebrew ? 'row-reverse' : 'row' },
              ]}
            >
              <Ionicons name="star" size={18} color={colors.semantic.warning} />
              <Text style={styles.rating}>{show.rating}</Text>
              <Text style={styles.reviewCount}>({show.reviewCount})</Text>
            </View>
          </View>

          {/* Quick Info */}
          <View
            style={[
              styles.quickInfo,
              { flexDirection: isHebrew ? 'row-reverse' : 'row' },
            ]}
          >
            <View
              style={[
                styles.quickInfoItem,
                {
                  flexDirection: isHebrew ? 'row-reverse' : 'row',
                  gap: spacing.xs,
                },
              ]}
            >
              <Ionicons
                name="location-outline"
                size={18}
                color={colors.primary.main}
              />
              <Text style={styles.quickInfoText}>{theaterName}</Text>
            </View>
            <View
              style={[
                styles.quickInfoItem,
                {
                  flexDirection: isHebrew ? 'row-reverse' : 'row',
                  gap: spacing.xs,
                },
              ]}
            >
              <Ionicons
                name="time-outline"
                size={18}
                color={colors.primary.main}
              />
              <Text style={styles.quickInfoText}>
                {show.duration} {t('common.minutes')}
              </Text>
            </View>
            <View
              style={[
                styles.quickInfoItem,
                {
                  flexDirection: isHebrew ? 'row-reverse' : 'row',
                  gap: spacing.xs,
                },
              ]}
            >
              <Ionicons
                name="language-outline"
                size={18}
                color={colors.primary.main}
              />
              <Text style={styles.quickInfoText}>{t('common.hebrew')}</Text>
            </View>
          </View>

          {/* Categories */}
          <View
            style={[
              styles.categoriesContainer,
              { flexDirection: isHebrew ? 'row-reverse' : 'row' },
            ]}
          >
            {show.categories.slice(0, 3).map((category, index) => (
              <View key={index} style={styles.categoryChip}>
                <Text style={styles.categoryChipText}>
                  {t(`categories.${category}`)}
                </Text>
              </View>
            ))}
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                { textAlign: isHebrew ? 'right' : 'left' },
              ]}
            >
              {t('show.about')}
            </Text>
            <Text
              style={[
                styles.description,
                { textAlign: isHebrew ? 'right' : 'left' },
              ]}
            >
              {description}
            </Text>
          </View>

          {/* Cast */}
          {castActors.length > 0 && (
            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionTitle,
                  { textAlign: isHebrew ? 'right' : 'left' },
                ]}
              >
                {t('show.cast')}
              </Text>
              <FlatList
                data={castActors}
                renderItem={({ item }) => (
                  <ActorCard
                    actor={item!}
                    onPress={() =>
                      navigation.navigate('ActorProfile', { actorId: item!.id })
                    }
                  />
                )}
                keyExtractor={(item) => item!.id}
                horizontal
                inverted={isHebrew}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          )}

          {/* Next Shows */}
          {nextDates.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { textAlign: isHebrew ? 'right' : 'left' }]}>
                {t('show.nextShows')}
              </Text>
              {nextDates.map((dateItem, index) => {
                const locale = isHebrew ? 'he-IL' : isRussian ? 'ru-RU' : 'en-US';
                const formattedDate = new Date(dateItem.date).toLocaleDateString(locale, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                });
                const isSoldOut = dateItem.availability === 'sold_out';
                return (
                  <View
                    key={index}
                    style={[
                      styles.nextShowRow,
                      { flexDirection: isHebrew ? 'row-reverse' : 'row' },
                      index === nextDates.length - 1 && { borderBottomWidth: 0 },
                    ]}
                  >
                    <Text style={[styles.nextShowDate, isSoldOut && styles.nextShowSoldOutText]}>
                      {formattedDate}
                    </Text>
                    <View style={[styles.nextShowTimes, { flexDirection: isHebrew ? 'row-reverse' : 'row' }]}>
                      {dateItem.times.map((time, ti) => {
                        const isTimeSoldOut = isSoldOut || time.availableSeats === 0;
                        return (
                          <View key={ti} style={[styles.nextShowTimeChip, isTimeSoldOut && styles.nextShowTimeChipSoldOut]}>
                            <Text style={[styles.nextShowTimeText, isTimeSoldOut && styles.nextShowSoldOutText]}>
                              {time.time}
                            </Text>
                            {isTimeSoldOut && (
                              <Text style={styles.nextShowTimeSoldOutLabel}>{t('show.soldOut')}</Text>
                            )}
                          </View>
                        );
                      })}
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {/* Venue Info */}
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                { textAlign: isHebrew ? 'right' : 'left' },
              ]}
            >
              {t('show.venue')}
            </Text>
            <TouchableOpacity
              style={[
                styles.venueCard,
                { flexDirection: isHebrew ? 'row-reverse' : 'row' },
              ]}
            >
              <Image
                source={{ uri: theater.imageUrl }}
                style={styles.venueImage}
                contentFit="cover"
                transition={200}
              />
              <View style={styles.venueInfo}>
                <Text
                  style={[
                    styles.venueName,
                    { textAlign: isHebrew ? 'right' : 'left' },
                  ]}
                >
                  {theaterName}
                </Text>
                <View
                  style={[
                    styles.venueAddress,
                    {
                      flexDirection: isHebrew ? 'row-reverse' : 'row',
                      gap: spacing.xs,
                    },
                  ]}
                >
                  <Ionicons
                    name="navigate-outline"
                    size={14}
                    color={colors.neutral.textTertiary}
                  />
                  <Text
                    style={[
                      styles.venueAddressText,
                      { flex: 0, flexShrink: 1 },
                    ]}
                  >
                    {isHebrew ? theater.addressHe : theater.address}
                  </Text>
                </View>
              </View>
              <Ionicons
                name={isHebrew ? 'chevron-back' : 'chevron-forward'}
                size={20}
                color={colors.neutral.textTertiary}
              />
            </TouchableOpacity>
          </View>

          {/* Bottom spacing for button */}
          <View style={{ height: 120 }} />
        </View>
      </Animated.ScrollView>

      {/* Bottom CTA with Glass Effect */}
      <View
        style={[
          styles.bottomCTA,
          { paddingBottom: insets.bottom + spacing.md },
        ]}
      >
        <BlurView intensity={80} tint="dark" style={styles.bottomCTABlur}>
          <View style={styles.bottomCTAGradient} />
        </BlurView>
        <View
          style={[
            styles.bottomCTAContent,
            { flexDirection: isHebrew ? 'row-reverse' : 'row' },
          ]}
        >
          {show.startingPrice > 0 && (
            <View
              style={[
                styles.priceContainer,
                { alignItems: isHebrew ? 'flex-end' : 'flex-start' },
              ]}
            >
              <Text style={styles.priceLabel}>{t('common.from')}</Text>
              <Text style={styles.price}>₪{show.startingPrice}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
            <LinearGradient
              colors={[colors.primary.main, colors.primary.dark]}
              style={[
                styles.bookButtonGradient,
                { flexDirection: isHebrew ? 'row-reverse' : 'row' },
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.bookButtonText}>{t('common.bookNow')}</Text>
              <Ionicons
                name={isHebrew ? 'arrow-back' : 'arrow-forward'}
                size={20}
                color="#FFFFFF"
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  errorText: {
    ...typography.bodyLarge,
    color: colors.neutral.text,
    marginTop: spacing.md,
  },
  backButton: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary.main,
    borderRadius: 12,
  },
  backButtonText: {
    ...typography.labelLarge,
    color: '#FFFFFF',
  },
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingBottom: spacing.md,
  },
  animatedHeaderTitle: {
    ...typography.headingMedium,
    color: colors.neutral.text,
    maxWidth: SCREEN_WIDTH * 0.6,
    height: 24,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonLeft: {
    position: 'absolute',
    start: spacing.lg,
    zIndex: 101,
  },
  headerButtonsRight: {
    position: 'absolute',
    end: spacing.lg,
    flexDirection: 'row',
    gap: spacing.sm,
    zIndex: 101,
  },
  heroContainer: {
    height: HEADER_HEIGHT,
    width: SCREEN_WIDTH,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  badgesContainer: {
    position: 'absolute',
    bottom: spacing.xxxl,
    start: spacing.lg,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  galleryContainer: {
    paddingHorizontal: spacing.lg,
    marginTop: -spacing.xl,
    marginBottom: spacing.md,
  },
  galleryThumb: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginEnd: spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  galleryThumbSelected: {
    borderColor: colors.primary.main,
  },
  galleryThumbImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    paddingHorizontal: spacing.lg,
  },
  titleSection: {
    marginBottom: spacing.md,
  },
  title: {
    ...typography.displaySmall,
    color: colors.neutral.text,
    marginBottom: spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    ...typography.labelLarge,
    color: colors.neutral.text,
    marginStart: spacing.xs,
  },
  reviewCount: {
    ...typography.bodySmall,
    color: colors.neutral.textTertiary,
    marginStart: spacing.xs,
  },
  quickInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark[500],
  },
  quickInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickInfoText: {
    ...typography.bodyMedium,
    color: colors.neutral.textSecondary,
    marginStart: spacing.xs,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  categoryChip: {
    backgroundColor: colors.dark[700],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  categoryChipText: {
    ...typography.labelSmall,
    color: colors.neutral.textSecondary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.headingSmall,
    color: colors.neutral.text,
    marginBottom: spacing.md,
  },
  description: {
    ...typography.bodyLarge,
    color: colors.neutral.textSecondary,
    lineHeight: 26,
  },
  venueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark[700],
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  venueImage: {
    width: 65,
    height: 65,
    borderRadius: 8,
    marginEnd: spacing.md,
    marginStart: spacing.lg,
  },
  venueInfo: {
    flex: 1,
  },
  venueName: {
    ...typography.labelLarge,
    color: colors.neutral.text,
    marginBottom: spacing.xxs,
  },
  venueAddress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  venueAddressText: {
    ...typography.bodySmall,
    color: colors.neutral.textTertiary,
    marginStart: spacing.xxs,
    marginEnd: spacing.xxs,
    flex: 1,
  },
  bottomCTA: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  bottomCTABlur: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomCTAGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20, 20, 30, 0.5)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(169, 85, 247, 0.2)',
  },
  bottomCTAContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  priceContainer: {
    marginEnd: spacing.lg,
  },
  priceLabel: {
    ...typography.bodySmall,
    color: colors.neutral.textTertiary,
  },
  price: {
    ...typography.headingLarge,
    color: colors.neutral.text,
  },
  bookButton: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  bookButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  bookButtonText: {
    ...typography.labelLarge,
    color: '#FFFFFF',
  },
  nextShowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark[600],
    gap: spacing.md,
  },
  nextShowDate: {
    ...typography.labelMedium,
    color: colors.neutral.text,
  },
  nextShowTimes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    justifyContent: 'flex-end',
  },
  nextShowTimeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary.main,
  },
  nextShowTimeChipSoldOut: {
    backgroundColor: colors.dark[700],
    borderColor: colors.dark[500],
  },
  nextShowTimeText: {
    ...typography.labelSmall,
    color: colors.primary.main,
  },
  nextShowSoldOutText: {
    color: colors.neutral.textTertiary,
  },
  soldOutBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  soldOutBadgeText: {
    ...typography.labelSmall,
    color: colors.semantic.error,
  },
  nextShowTimeSoldOutLabel: {
    ...typography.labelSmall,
    color: colors.semantic.error,
    marginStart: spacing.xxs,
    opacity: 0.8,
  },
});
