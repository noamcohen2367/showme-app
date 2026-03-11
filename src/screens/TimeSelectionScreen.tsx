// ============================================
// ShowME App - Time Selection Screen (Dark Aurora Theme)
// ============================================

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Linking,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing } from '../theme/theme';
import { RootStackParamList, ShowTime } from '../types/types';
import { useShow } from '../hooks/useShows';

type TimeSelectionNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TimeSelection'>;
type TimeSelectionRouteProp = RouteProp<RootStackParamList, 'TimeSelection'>;

export default function TimeSelectionScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<TimeSelectionNavigationProp>();
  const route = useRoute<TimeSelectionRouteProp>();
  const insets = useSafeAreaInsets();
  const isHebrew = i18n.language === 'he';

  const { showId, date } = route.params;
  const { show } = useShow(showId);

  const [selectedTime, setSelectedTime] = useState<ShowTime | null>(null);

  // Get available times for selected date
  const availableTimes = useMemo(() => {
    if (!show?.availableDates) return [];
    const dateData = show.availableDates.find(d => d.date === date);
    return dateData?.times || [];
  }, [show, date]);

  const getAvailabilityColor = (availableSeats: number): string => {
    if (availableSeats > 50) return colors.semantic.success;
    if (availableSeats > 20) return colors.semantic.warning;
    return colors.semantic.error;
  };

  const getAvailabilityText = (availableSeats: number): string => {
    if (availableSeats > 50) return t('booking.goodAvailability');
    if (availableSeats > 20) return t('booking.limitedAvailability');
    return t('booking.fewSeatsLeft');
  };

  const handleContinue = async () => {
    if (!selectedTime) return;
    const url = selectedTime.purchaseLink;
    if (!url) {
      Alert.alert(
        isHebrew ? 'לינק לא זמין' : 'Link unavailable',
        isHebrew ? 'לא נמצא לינק לרכישת כרטיסים להצגה זו.' : 'No purchase link found for this show.',
      );
      return;
    }
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      Linking.openURL(url);
    } else {
      Alert.alert(
        isHebrew ? 'שגיאה' : 'Error',
        isHebrew ? `לא ניתן לפתוח: ${url}` : `Cannot open: ${url}`,
      );
    }
  };

  const formattedDate = new Date(date).toLocaleDateString(isHebrew ? 'he-IL' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.neutral.background} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.neutral.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('show.selectTime')}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Progress Indicator — 2 steps: date → time */}
      <View style={styles.progressContainer}>
        {['date', 'time'].map((step, index) => (
          <React.Fragment key={step}>
            <View style={[
              styles.progressStep,
              styles.progressStepActive,
              index < 1 && styles.progressStepCompleted,
            ]}>
              {index < 1 ? (
                <Ionicons name="checkmark" size={16} color={colors.neutral.white} />
              ) : (
                <LinearGradient
                  colors={[colors.primary.main, colors.secondary.main]}
                  style={styles.progressStepGradient}
                >
                  <Text style={styles.progressStepTextActive}>{index + 1}</Text>
                </LinearGradient>
              )}
            </View>
            {index < 1 && (
              <View style={[styles.progressLine, styles.progressLineActive]} />
            )}
          </React.Fragment>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Selected Date */}
        <View style={styles.dateInfo}>
          <Ionicons name="calendar" size={20} color={colors.primary.main} />
          <Text style={styles.dateText}>{formattedDate}</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.changeText}>{t('common.change')}</Text>
          </TouchableOpacity>
        </View>

        {/* Available Times */}
        <Text style={styles.sectionTitle}>{t('booking.selectShowtime')}</Text>

        {availableTimes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="time-outline" size={48} color={colors.neutral.textTertiary} />
            <Text style={styles.emptyText}>{t('booking.noTimesAvailable')}</Text>
          </View>
        ) : (
          <View style={styles.timesGrid}>
            {availableTimes.map((timeSlot, index) => {
              const isSoldOut = timeSlot.availableSeats === 0;
              const isSelected = selectedTime?.time === timeSlot.time;
              const availabilityColor = getAvailabilityColor(timeSlot.availableSeats);

              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.timeCard, isSelected && styles.timeCardSelected, isSoldOut && styles.timeCardSoldOut]}
                  onPress={() => !isSoldOut && setSelectedTime(timeSlot)}
                  disabled={isSoldOut}
                >
                  {isSelected && (
                    <LinearGradient
                      colors={['rgba(168, 85, 247, 0.2)', 'rgba(236, 72, 153, 0.1)']}
                      style={StyleSheet.absoluteFill}
                    />
                  )}

                  <View style={styles.timeCardHeader}>
                    <Text style={[styles.timeText, isSelected && styles.timeTextSelected, isSoldOut && styles.timeTextSoldOut]}>
                      {timeSlot.time}
                    </Text>
                    {isSoldOut ? (
                      <View style={styles.soldOutBadge}>
                        <Ionicons name="close-circle" size={12} color={colors.semantic.error} />
                        <Text style={styles.soldOutBadgeText}>{t('show.soldOut')}</Text>
                      </View>
                    ) : isSelected ? (
                      <Ionicons name="checkmark-circle" size={20} color={colors.primary.main} />
                    ) : null}
                  </View>

                  {!isSoldOut && (
                    <View style={styles.availabilityRow}>
                      <View style={[styles.availabilityDot, { backgroundColor: availabilityColor }]} />
                      <Text style={styles.availabilityText}>
                        {getAvailabilityText(timeSlot.availableSeats)}
                      </Text>
                    </View>
                  )}

                  <View style={styles.priceRow}>
                    {timeSlot.isLastMinuteDeal && !isSoldOut && (
                      <View style={styles.dealBadge}>
                        <Ionicons name="flash" size={12} color={colors.semantic.warning} />
                        <Text style={styles.dealText}>{t('home.lastMinute')}</Text>
                      </View>
                    )}
                    {!isSoldOut && (
                      <View style={styles.priceContainer}>
                        {timeSlot.originalPrice && (
                          <Text style={styles.originalPrice}>₪{timeSlot.originalPrice}</Text>
                        )}
                        <Text style={[styles.price, isSelected && styles.priceSelected]}>
                          ₪{timeSlot.price}
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Button */}
      <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + spacing.md }]}>
        <TouchableOpacity
          style={[styles.continueButton, !selectedTime && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!selectedTime}
        >
          <LinearGradient
            colors={selectedTime ? [colors.primary.main, colors.primary.dark] : [colors.dark[600], colors.dark[600]]}
            style={styles.continueButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons
              name="open-outline"
              size={20}
              color={selectedTime ? colors.neutral.white : colors.neutral.textTertiary}
            />
            <Text style={[styles.continueButtonText, !selectedTime && styles.continueButtonTextDisabled]}>
              {isHebrew ? 'לרכישת כרטיסים' : 'Buy Tickets'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark[500],
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.headingMedium,
    color: colors.neutral.text,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  progressStep: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.dark[700],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  progressStepActive: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    overflow: 'hidden',
  },
  progressStepCompleted: {
    backgroundColor: colors.primary.main,
  },
  progressStepGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressStepText: {
    ...typography.labelMedium,
    color: colors.neutral.textTertiary,
  },
  progressStepTextActive: {
    ...typography.labelMedium,
    color: colors.neutral.white,
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: colors.dark[500],
    marginHorizontal: spacing.xs,
  },
  progressLineActive: {
    backgroundColor: colors.primary.main,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark[700],
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    marginVertical: spacing.lg,
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  dateText: {
    ...typography.labelLarge,
    color: colors.neutral.text,
    flex: 1,
    marginStart: spacing.sm,
  },
  changeText: {
    ...typography.labelMedium,
    color: colors.primary.main,
  },
  sectionTitle: {
    ...typography.headingSmall,
    color: colors.neutral.text,
    marginBottom: spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyText: {
    ...typography.bodyLarge,
    color: colors.neutral.textTertiary,
    marginTop: spacing.md,
  },
  timesGrid: {
    gap: spacing.md,
  },
  timeCard: {
    backgroundColor: colors.dark[700],
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.dark[500],
    overflow: 'hidden',
  },
  timeCardSelected: {
    borderColor: colors.primary.main,
  },
  timeCardSoldOut: {
    borderColor: 'rgba(239, 68, 68, 0.2)',
    opacity: 0.6,
  },
  timeTextSoldOut: {
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
  timeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  timeText: {
    ...typography.headingMedium,
    color: colors.neutral.text,
  },
  timeTextSelected: {
    color: colors.primary.main,
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginEnd: spacing.sm,
  },
  availabilityText: {
    ...typography.bodySmall,
    color: colors.neutral.textSecondary,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dealBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  dealText: {
    ...typography.labelSmall,
    color: colors.semantic.warning,
    marginStart: spacing.xxs,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  originalPrice: {
    ...typography.bodyMedium,
    color: colors.neutral.textTertiary,
    textDecorationLine: 'line-through',
    marginEnd: spacing.sm,
  },
  price: {
    ...typography.headingSmall,
    color: colors.neutral.text,
  },
  priceSelected: {
    color: colors.primary.main,
  },
  bottomContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.dark[500],
    backgroundColor: colors.dark[800],
  },
  continueButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  continueButtonText: {
    ...typography.labelLarge,
    color: colors.neutral.white,
  },
  continueButtonTextDisabled: {
    color: colors.neutral.textTertiary,
  },
});
