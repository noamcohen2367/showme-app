// ============================================
// ShowME App - Error State Component
// ============================================

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

import { colors, typography, spacing } from '../theme/theme';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

export default function ErrorState({
  title,
  message,
  onRetry,
  icon = 'cloud-offline-outline',
}: ErrorStateProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={48} color={colors.neutral.textTertiary} />
      <Text style={styles.title}>{title || t('common.error')}</Text>
      <Text style={styles.message}>
        {message || t('errors.generic')}
      </Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <LinearGradient
            colors={[colors.primary.main, colors.primary.dark]}
            style={styles.retryButtonGradient}
          >
            <Ionicons name="refresh" size={16} color={colors.neutral.white} />
            <Text style={styles.retryButtonText}>{t('errors.tapToRetry')}</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    paddingVertical: spacing.xxxl,
  },
  title: {
    ...typography.headingSmall,
    color: colors.neutral.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  message: {
    ...typography.bodyMedium,
    color: colors.neutral.textTertiary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  retryButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  retryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  retryButtonText: {
    ...typography.labelLarge,
    color: colors.neutral.white,
  },
});
