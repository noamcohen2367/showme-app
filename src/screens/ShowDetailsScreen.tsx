// ============================================
// ShowME App - Show Details Screen (Dark Aurora Theme)
// ============================================

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
  FlatList,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing } from '../theme/theme';
import { RootStackParamList } from '../types/types';
import { getShowById } from '../data/shows';
import { getTheaterById } from '../data/theaters';
import { getActorById } from '../data/actors';
import Badge from '../components/Badge';
import ActorCard from '../components/ActorCard';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
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
  const show = getShowById(showId);
  const theater = show ? getTheaterById(show.theaterId) : null;

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;

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
        <Ionicons name="arrow-back" size={24} color={colors.neutral.white} />
      </TouchableOpacity>

      {/* Share & Wishlist Buttons */}
      <View
        style={[styles.headerButtonsRight, { top: insets.top + spacing.sm }]}
      >
        <TouchableOpacity style={styles.headerButton} onPress={() => {}}>
          <Ionicons
            name="share-outline"
            size={24}
            color={colors.neutral.white}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setIsWishlisted(!isWishlisted)}
        >
          <Ionicons
            name={isWishlisted ? 'heart' : 'heart-outline'}
            size={24}
            color={isWishlisted ? colors.secondary.main : colors.neutral.white}
          />
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: galleryImages[selectedImageIndex] }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={[
              'transparent',
              'rgba(10, 10, 15, 0.6)',
              colors.neutral.background,
            ]}
            style={styles.heroGradient}
          />

          {/* Badges */}
          {show.badges && show.badges.length > 0 && (
            <View style={styles.badgesContainer}>
              {show.badges.slice(0, 2).map((badge, index) => (
                <Badge key={index} type={badge} size="medium" />
              ))}
            </View>
          )}
        </View>

        {/* Gallery Thumbnails */}
        {galleryImages.length > 1 && (
          <View style={styles.galleryContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Content */}
        <View style={styles.content}>
          {/* Title & Rating */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={18} color={colors.semantic.warning} />
              <Text style={styles.rating}>{show.rating}</Text>
              <Text style={styles.reviewCount}>({show.reviewCount})</Text>
            </View>
          </View>

          {/* Quick Info */}
          <View style={styles.quickInfo}>
            <View style={styles.quickInfoItem}>
              <Ionicons
                name="location-outline"
                size={18}
                color={colors.primary.main}
              />
              <Text style={styles.quickInfoText}>{theaterName}</Text>
            </View>
            <View style={styles.quickInfoItem}>
              <Ionicons
                name="time-outline"
                size={18}
                color={colors.primary.main}
              />
              <Text style={styles.quickInfoText}>
                {show.duration} {t('common.minutes')}
              </Text>
            </View>
            <View style={styles.quickInfoItem}>
              <Ionicons
                name="language-outline"
                size={18}
                color={colors.primary.main}
              />
              <Text style={styles.quickInfoText}>{t('common.hebrew')}</Text>
            </View>
          </View>

          {/* Categories */}
          <View style={styles.categoriesContainer}>
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
            <Text style={styles.sectionTitle}>{t('show.about')}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>

          {/* Cast */}
          {castActors.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('show.cast')}</Text>
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
                showsHorizontalScrollIndicator={false}
              />
            </View>
          )}

          {/* Venue Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('show.venue')}</Text>
            <TouchableOpacity style={styles.venueCard}>
              <Image
                source={{ uri: theater.imageUrl }}
                style={styles.venueImage}
              />
              <View style={styles.venueInfo}>
                <Text style={styles.venueName}>{theaterName}</Text>
                <View style={styles.venueAddress}>
                  <Ionicons
                    name="navigate-outline"
                    size={14}
                    color={colors.neutral.textTertiary}
                  />
                  <Text style={styles.venueAddressText}>
                    {isHebrew ? theater.addressHe : theater.address}
                  </Text>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
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
        <View style={styles.bottomCTAContent}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>{t('common.from')}</Text>
            <Text style={styles.price}>₪{show.startingPrice}</Text>
          </View>
          <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
            <LinearGradient
              colors={[colors.primary.main, colors.secondary.main]}
              style={styles.bookButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.bookButtonText}>{t('common.bookNow')}</Text>
              <Ionicons
                name="arrow-forward"
                size={20}
                color={colors.neutral.white}
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
    backgroundColor: colors.neutral.background,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neutral.background,
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
    color: colors.neutral.white,
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
    left: spacing.lg,
    zIndex: 101,
  },
  headerButtonsRight: {
    position: 'absolute',
    right: spacing.lg,
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
    bottom: spacing.xl,
    left: spacing.lg,
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
    marginRight: spacing.sm,
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
    marginLeft: spacing.xs,
  },
  reviewCount: {
    ...typography.bodySmall,
    color: colors.neutral.textTertiary,
    marginLeft: spacing.xs,
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
    marginLeft: spacing.xs,
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
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: spacing.md,
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
    marginLeft: spacing.xxs,
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
    borderTopColor: 'rgba(168, 85, 247, 0.3)',
  },
  bottomCTAContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  priceContainer: {
    marginRight: spacing.lg,
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
    borderRadius: 12,
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
    color: colors.neutral.white,
  },
});
