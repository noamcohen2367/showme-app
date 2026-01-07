// ============================================
// ShowME App - Order Confirmation Screen (Dark Aurora Theme)
// ============================================

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
  Share,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, RouteProp, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing } from '../theme/theme';
import { RootStackParamList } from '../types/types';
import { getShowById } from '../data/shows';
import { getTheaterById } from '../data/theaters';

type OrderConfirmationNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OrderConfirmation'>;
type OrderConfirmationRouteProp = RouteProp<RootStackParamList, 'OrderConfirmation'>;

export default function OrderConfirmationScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<OrderConfirmationNavigationProp>();
  const route = useRoute<OrderConfirmationRouteProp>();
  const insets = useSafeAreaInsets();
  const isHebrew = i18n.language === 'he';

  const { orderId, showId, date, time, seats, totalPrice } = route.params;
  const show = getShowById(showId);
  const theater = show ? getTheaterById(show.theaterId) : null;

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Animate success icon
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();

    // Animate content fade in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const title = show ? (isHebrew ? show.titleHe : show.title) : '';
  const theaterName = theater ? (isHebrew ? theater.nameHe : theater.name) : '';

  const formattedDate = new Date(date).toLocaleDateString(isHebrew ? 'he-IL' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleViewTickets = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      })
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${t('confirmation.shareMessage')} ${title}! 🎭`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleBackToHome = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      })
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.neutral.background} />
      
      {/* Aurora Background Effect */}
      <View style={styles.auroraBackground}>
        <LinearGradient
          colors={['rgba(168, 85, 247, 0.2)', 'rgba(236, 72, 153, 0.15)', 'transparent']}
          style={styles.auroraGradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.5 }}
        />
      </View>

      {/* Success Icon */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.xxl }]}>
        <Animated.View style={[styles.successIcon, { transform: [{ scale: scaleAnim }] }]}>
          <LinearGradient
            colors={[colors.primary.main, colors.secondary.main]}
            style={styles.successIconGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="checkmark" size={48} color={colors.neutral.white} />
          </LinearGradient>
        </Animated.View>

        {/* Confetti Stars */}
        {[...Array(6)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.confetti,
              {
                top: 20 + Math.random() * 60,
                left: 20 + (i * 60),
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Ionicons 
              name="star" 
              size={12 + Math.random() * 8} 
              color={i % 2 === 0 ? colors.primary.main : colors.secondary.main} 
            />
          </Animated.View>
        ))}
      </View>

      {/* Content */}
      <Animated.View 
        style={[
          styles.content, 
          { 
            opacity: fadeAnim, 
            transform: [{ translateY: slideAnim }] 
          }
        ]}
      >
        <Text style={styles.successTitle}>{t('confirmation.success')}</Text>
        <Text style={styles.successSubtitle}>{t('confirmation.thankYou')}</Text>

        {/* Order Card */}
        <View style={styles.orderCard}>
          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>{t('confirmation.orderId')}</Text>
            <Text style={styles.orderValueMono}>{orderId}</Text>
          </View>
          <View style={styles.orderDivider} />
          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>{t('confirmation.show')}</Text>
            <Text style={styles.orderValue}>{title}</Text>
          </View>
          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>{t('confirmation.venue')}</Text>
            <Text style={styles.orderValue}>{theaterName}</Text>
          </View>
          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>{t('confirmation.date')}</Text>
            <Text style={styles.orderValue}>{formattedDate}</Text>
          </View>
          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>{t('confirmation.time')}</Text>
            <Text style={styles.orderValue}>{time}</Text>
          </View>
          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>{t('confirmation.seats')}</Text>
            <Text style={styles.orderValue}>{seats.join(', ')}</Text>
          </View>
          <View style={styles.orderDivider} />
          <View style={styles.orderRow}>
            <Text style={styles.totalLabel}>{t('confirmation.totalPaid')}</Text>
            <Text style={styles.totalValue}>₪{totalPrice}</Text>
          </View>
        </View>

        {/* Email Notice */}
        <View style={styles.emailNotice}>
          <Ionicons name="mail-outline" size={18} color={colors.neutral.textSecondary} />
          <Text style={styles.emailNoticeText}>{t('confirmation.emailSent')}</Text>
        </View>
      </Animated.View>

      {/* Action Buttons */}
      <View style={[styles.buttonsContainer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleViewTickets}>
          <LinearGradient
            colors={[colors.primary.main, colors.primary.dark]}
            style={styles.primaryButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="ticket-outline" size={20} color={colors.neutral.white} />
            <Text style={styles.primaryButtonText}>{t('confirmation.viewTickets')}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.secondaryButtons}>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={20} color={colors.primary.main} />
            <Text style={styles.secondaryButtonText}>{t('confirmation.share')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => {}}>
            <Ionicons name="calendar-outline" size={20} color={colors.primary.main} />
            <Text style={styles.secondaryButtonText}>{t('confirmation.addToCalendar')}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.textButton} onPress={handleBackToHome}>
          <Text style={styles.textButtonText}>{t('confirmation.backToHome')}</Text>
        </TouchableOpacity>
      </View>
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
    height: 350,
  },
  auroraGradient: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    position: 'relative',
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  successIconGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confetti: {
    position: 'absolute',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  successTitle: {
    ...typography.displaySmall,
    color: colors.neutral.text,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  successSubtitle: {
    ...typography.bodyLarge,
    color: colors.neutral.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  orderCard: {
    backgroundColor: colors.dark[700],
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  orderLabel: {
    ...typography.bodyMedium,
    color: colors.neutral.textSecondary,
  },
  orderValue: {
    ...typography.bodyMedium,
    color: colors.neutral.text,
    textAlign: 'right',
    flex: 1,
    marginLeft: spacing.md,
  },
  orderValueMono: {
    ...typography.labelMedium,
    color: colors.primary.main,
    fontFamily: 'monospace',
  },
  orderDivider: {
    height: 1,
    backgroundColor: colors.dark[500],
    marginVertical: spacing.sm,
  },
  totalLabel: {
    ...typography.labelLarge,
    color: colors.neutral.text,
  },
  totalValue: {
    ...typography.headingMedium,
    color: colors.primary.main,
  },
  emailNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  emailNoticeText: {
    ...typography.bodySmall,
    color: colors.neutral.textSecondary,
  },
  buttonsContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    backgroundColor: colors.dark[800],
    borderTopWidth: 1,
    borderTopColor: colors.dark[500],
  },
  primaryButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  primaryButtonText: {
    ...typography.labelLarge,
    color: colors.neutral.white,
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dark[700],
    paddingVertical: spacing.md,
    borderRadius: 12,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  secondaryButtonText: {
    ...typography.labelMedium,
    color: colors.primary.main,
  },
  textButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  textButtonText: {
    ...typography.labelMedium,
    color: colors.neutral.textSecondary,
  },
});
