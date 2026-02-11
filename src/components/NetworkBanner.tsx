// ============================================
// ShowME App - Network Banner Component
// ============================================

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { colors, typography, spacing } from '../theme/theme';

interface NetworkBannerProps {
  visible: boolean;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export default function NetworkBanner({ visible, onRetry, onDismiss }: NetworkBannerProps) {
  const { t } = useTranslation();
  const heightAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heightAnim, {
        toValue: visible ? 40 : 0,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(opacityAnim, {
        toValue: visible ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [visible, heightAnim, opacityAnim]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { height: heightAnim, opacity: opacityAnim }]}>
      <View style={styles.content}>
        <Ionicons name="cloud-offline-outline" size={16} color={colors.semantic.warning} />
        <Text style={styles.text} numberOfLines={1}>
          {t('errors.showingCachedData')}
        </Text>
        {onRetry && (
          <TouchableOpacity onPress={onRetry} style={styles.retryLink}>
            <Ionicons name="refresh" size={14} color={colors.primary.main} />
          </TouchableOpacity>
        )}
        {onDismiss && (
          <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
            <Ionicons name="close" size={14} color={colors.neutral.textTertiary} />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(245, 158, 11, 0.2)',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
  },
  text: {
    ...typography.labelSmall,
    color: colors.semantic.warning,
    flex: 1,
  },
  retryLink: {
    padding: spacing.xxs,
  },
  dismissButton: {
    padding: spacing.xxs,
  },
});
