// ============================================
// ShowME App - Badge Component (Dark Theme)
// ============================================

import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

import { ShowBadge } from '../types/types';
import { colors, typography, spacing } from '../theme/theme';

interface BadgeProps {
  type: ShowBadge;
  size?: 'small' | 'medium';
}

const BADGE_CONFIG: Record<
  ShowBadge,
  {
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
  }
> = {
  popular_in_area: {
    icon: 'flame',
    color: colors.badges.popular,
  },
  selling_fast: {
    icon: 'trending-up',
    color: colors.badges.sellingFast,
  },
  last_chance: {
    icon: 'time',
    color: colors.badges.lastChance,
  },
  new: {
    icon: 'sparkles',
    color: colors.badges.new,
  },
  special_price: {
    icon: 'pricetag',
    color: colors.badges.specialPrice,
  },
};

export default function Badge({ type, size = 'small' }: BadgeProps) {
  const { t } = useTranslation();
  const config = BADGE_CONFIG[type];

  if (!config) return null;

  const iconSize = size === 'small' ? 10 : 12;
  const paddingH = size === 'small' ? spacing.sm : spacing.md;
  const paddingV = size === 'small' ? spacing.xxs : spacing.xs;

  return (
    <BlurView
      intensity={50}
      tint="dark"
      style={[
        styles.container,
        {
          paddingHorizontal: paddingH,
          paddingVertical: paddingV,
          borderColor: config.color,
        },
      ]}
    >
      <Ionicons name={config.icon} size={iconSize} color={config.color} />
      <Text
        style={[
          styles.text,
          size === 'medium' && styles.textMedium,
          { color: config.color },
        ]}
      >
        {t(`badges.${type}`)}
      </Text>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  text: {
    ...typography.labelSmall,
    marginStart: spacing.xxs,
    textTransform: 'uppercase',
  },
  textMedium: {
    ...typography.labelMedium,
  },
});
