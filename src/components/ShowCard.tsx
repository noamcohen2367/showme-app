// ============================================
// ShowME App - Show Card Component (Dark Theme)
// ============================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { getAppWidth } from '../utils/dimensions';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { Show } from '../types/types';
import { colors, typography, spacing } from '../theme/theme';
import { getTheaterById } from '../data/theaters';
import Badge from './Badge';

const SCREEN_WIDTH = getAppWidth();
const CARD_WIDTH = Platform.OS === 'web' ? 260 : SCREEN_WIDTH * 0.7;
const CARD_WIDTH_SMALL = Platform.OS === 'web' ? 185 : SCREEN_WIDTH * 0.42;

interface ShowCardProps {
  show: Show;
  onPress: () => void;
  size?: 'large' | 'small';
  showTheater?: boolean;
  fullWidth?: boolean;
}

export default function ShowCard({
  show,
  onPress,
  size = 'large',
  showTheater = true,
  fullWidth = false,
}: ShowCardProps) {
  const { t, i18n } = useTranslation();
  const isHebrew = i18n.language === 'he';
  const isRussian = i18n.language === 'ru';

  const theater = getTheaterById(show.theaterId);

  const title = isHebrew ? show.titleHe : isRussian ? show.titleRu : show.title;
  const theaterName = theater
    ? isHebrew
      ? theater.nameHe
      : isRussian
        ? theater.nameRu
        : theater.name
    : '';

  const cardWidth = fullWidth
    ? '100%'
    : size === 'large'
      ? CARD_WIDTH
      : CARD_WIDTH_SMALL;
  const imageHeight = size === 'large' || fullWidth ? 200 : 130;

  return (
    <TouchableOpacity
      style={[styles.container, { width: cardWidth }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Image */}
      <View style={[styles.imageContainer, { height: imageHeight }]}>
        <Image
          source={{ uri: show.imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={300}
          recyclingKey={show.id}
        />

        {/* Gradient overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(10, 10, 15, 0.8)']}
          style={styles.imageGradient}
        />

        {/* Badges */}
        {show.badges && show.badges.length > 0 && (
          <View style={styles.badgeContainer}>
            <Badge type={show.badges[0]} />
          </View>
        )}

        {/* Last Minute Deal Indicator */}
        {show.availableDates?.some((d) =>
          d.times?.some((t) => t.isLastMinuteDeal),
        ) && (
          <View style={styles.lastMinuteBadge}>
            <Ionicons name="flash" size={12} color={colors.semantic.warning} />
            <Text style={styles.lastMinuteText}>{t('home.lastMinute')}</Text>
          </View>
        )}

        {/* Rating on image */}
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={12} color={colors.semantic.warning} />
          <Text style={styles.ratingBadgeText}>{show.rating}</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text
          style={[styles.title, { textAlign: isHebrew ? 'right' : 'left' }]}
          numberOfLines={2}
        >
          {title}
        </Text>

        {/* Theater + Price — single row */}
        <View
          style={[
            styles.infoRow,
            { flexDirection: isHebrew ? 'row-reverse' : 'row' },
          ]}
        >
          {showTheater && theaterName ? (
            <View
              style={[
                styles.theaterPart,
                { flexDirection: isHebrew ? 'row-reverse' : 'row' },
              ]}
            >
              <Ionicons
                name="location-outline"
                size={12}
                color={colors.neutral.textTertiary}
              />
              <Text style={styles.theaterName} numberOfLines={1}>
                {theaterName}
              </Text>
            </View>
          ) : (
            <View style={styles.theaterPart} />
          )}
          {show.startingPrice > 0 && (
            <View
              style={[
                styles.priceRow,
                { flexDirection: isHebrew ? 'row-reverse' : 'row' },
              ]}
            >
              <Text style={styles.priceLabel}>{t('common.from')}</Text>
              <Text style={styles.price}>₪{show.startingPrice}</Text>
              {show.originalPrice && (
                <Text style={styles.originalPrice}>₪{show.originalPrice}</Text>
              )}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.dark[700],
    borderRadius: 16,
    overflow: 'hidden',
    marginEnd: spacing.md,
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  imageContainer: {
    width: '100%',
    backgroundColor: colors.dark[600],
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  badgeContainer: {
    position: 'absolute',
    top: spacing.sm,
    start: spacing.sm,
  },
  lastMinuteBadge: {
    position: 'absolute',
    bottom: spacing.sm,
    start: spacing.sm,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  lastMinuteText: {
    ...typography.labelSmall,
    color: colors.semantic.warning,
    marginStart: spacing.xxs,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  ratingBadgeText: {
    ...typography.labelSmall,
    color: colors.neutral.white,
    marginStart: spacing.xxs,
  },
  content: {
    padding: spacing.md,
  },
  title: {
    ...typography.labelLarge,
    color: colors.neutral.text,
    marginBottom: spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  theaterPart: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginEnd: spacing.xs,
    gap: spacing.xxs,
  },
  theaterName: {
    ...typography.bodySmall,
    color: colors.neutral.textTertiary,
    flexShrink: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceLabel: {
    ...typography.bodySmall,
    color: colors.neutral.textSecondary,
    marginEnd: spacing.xxs,
  },
  price: {
    ...typography.labelLarge,
    color: colors.primary.main,
    fontWeight: '700',
  },
  originalPrice: {
    ...typography.bodySmall,
    color: colors.neutral.textTertiary,
    textDecorationLine: 'line-through',
    marginStart: spacing.sm,
  },
});
