// ============================================
// ShowME App - Badge Component (Dark Theme)
// ============================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { ShowBadge } from '../types/types';
import { colors, typography, spacing } from '../theme/theme';

interface BadgeProps {
  type: ShowBadge;
  size?: 'small' | 'medium';
}

const BADGE_CONFIG: Record<ShowBadge, { 
  icon: keyof typeof Ionicons.glyphMap; 
  color: string;
  bgColor: string;
}> = {
  popular_in_area: {
    icon: 'flame',
    color: colors.badges.popular,
    bgColor: 'rgba(245, 158, 11, 0.2)',
  },
  selling_fast: {
    icon: 'trending-up',
    color: colors.badges.sellingFast,
    bgColor: 'rgba(239, 68, 68, 0.2)',
  },
  last_chance: {
    icon: 'time',
    color: colors.badges.lastChance,
    bgColor: 'rgba(249, 115, 22, 0.2)',
  },
  new: {
    icon: 'sparkles',
    color: colors.badges.new,
    bgColor: 'rgba(168, 85, 247, 0.2)',
  },
  special_price: {
    icon: 'pricetag',
    color: colors.badges.specialPrice,
    bgColor: 'rgba(16, 185, 129, 0.2)',
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
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: config.bgColor,
          paddingHorizontal: paddingH,
          paddingVertical: paddingV,
          borderColor: config.color,
        }
      ]}
    >
      <Ionicons name={config.icon} size={iconSize} color={config.color} />
      <Text 
        style={[
          styles.text, 
          size === 'medium' && styles.textMedium,
          { color: config.color }
        ]}
      >
        {t(`badges.${type}`)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
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
