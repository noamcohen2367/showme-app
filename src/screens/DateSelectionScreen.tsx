// ============================================
// ShowME App - Date Selection Screen (Dark Aurora Theme)
// ============================================

import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { getAppWidth } from '../utils/dimensions';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing } from '../theme/theme';
import { RootStackParamList } from '../types/types';
import { useShow } from '../hooks/useShows';

const SCREEN_WIDTH = getAppWidth();
const DAY_WIDTH = (SCREEN_WIDTH - spacing.lg * 2 - spacing.xs * 12) / 7;

type DateSelectionNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DateSelection'>;
type DateSelectionRouteProp = RouteProp<RootStackParamList, 'DateSelection'>;

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAYS_HE = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'];

export default function DateSelectionScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<DateSelectionNavigationProp>();
  const route = useRoute<DateSelectionRouteProp>();
  const insets = useSafeAreaInsets();
  const isHebrew = i18n.language === 'he';

  const { showId } = route.params;
  const { show } = useShow(showId);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // Nearest upcoming non-sold-out date
  const nearestDate = useMemo(() => {
    if (!show?.availableDates) return null;
    const upcoming = show.availableDates
      .filter(d => d.availability !== 'sold_out' && new Date(d.date + 'T00:00:00') >= today)
      .sort((a, b) => a.date.localeCompare(b.date));
    return upcoming[0]?.date ?? null;
  }, [show, today]);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Once show loads, jump to the nearest date's month and pre-select it
  useEffect(() => {
    if (nearestDate && !selectedDate) {
      const d = new Date(nearestDate + 'T00:00:00');
      setCurrentMonth(new Date(d.getFullYear(), d.getMonth(), 1));
      setSelectedDate(nearestDate);
    }
  }, [nearestDate]); // eslint-disable-line react-hooks/exhaustive-deps

  // Get available dates from show
  const availableDates = useMemo(() => {
    if (!show?.availableDates) return new Set<string>();
    return new Set(show.availableDates.map(d => d.date));
  }, [show]);

  // Get sold-out dates
  const soldOutDates = useMemo(() => {
    if (!show?.availableDates) return new Set<string>();
    return new Set(
      show.availableDates.filter(d => d.availability === 'sold_out').map(d => d.date)
    );
  }, [show]);

  // Days until selected date (0 = today, positive = future)
  const daysUntil = useMemo(() => {
    if (!selectedDate) return null;
    const sel = new Date(selectedDate + 'T00:00:00');
    return Math.round((sel.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }, [selectedDate, today]);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days: (Date | null)[] = [];
    
    // Add empty slots for days before first day
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    // Add all days of month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  }, [currentMonth]);

  const formatDateString = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const isDateAvailable = (date: Date): boolean => {
    const dateStr = formatDateString(date);
    return availableDates.has(dateStr);
  };

  const isPastDate = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isDateSoldOut = (date: Date): boolean => {
    return soldOutDates.has(formatDateString(date));
  };

  const handleDateSelect = (date: Date) => {
    if (!isPastDate(date) && isDateAvailable(date) && !isDateSoldOut(date)) {
      setSelectedDate(formatDateString(date));
    }
  };

  const handleContinue = () => {
    if (selectedDate) {
      navigation.navigate('TimeSelection', { showId, date: selectedDate });
    }
  };

  const weekdays = isHebrew ? WEEKDAYS_HE : WEEKDAYS;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.neutral.background} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.neutral.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('show.selectDate')}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Progress Indicator — 2 steps: date → time */}
      <View style={styles.progressContainer}>
        {['date', 'time'].map((step, index) => (
          <React.Fragment key={step}>
            <View style={[styles.progressStep, index === 0 && styles.progressStepActive]}>
              {index === 0 ? (
                <LinearGradient
                  colors={[colors.primary.main, colors.secondary.main]}
                  style={styles.progressStepGradient}
                >
                  <Text style={styles.progressStepTextActive}>{index + 1}</Text>
                </LinearGradient>
              ) : (
                <Text style={styles.progressStepText}>{index + 1}</Text>
              )}
            </View>
            {index < 1 && <View style={styles.progressLine} />}
          </React.Fragment>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Month Navigator */}
        <View style={styles.monthNavigator}>
          <TouchableOpacity onPress={handlePrevMonth} style={styles.monthButton}>
            <Ionicons name="chevron-back" size={24} color={colors.neutral.text} />
          </TouchableOpacity>
          <Text style={styles.monthTitle}>
            {currentMonth.toLocaleDateString(isHebrew ? 'he-IL' : 'en-US', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </Text>
          <TouchableOpacity onPress={handleNextMonth} style={styles.monthButton}>
            <Ionicons name="chevron-forward" size={24} color={colors.neutral.text} />
          </TouchableOpacity>
        </View>

        {/* Weekday Headers */}
        <View style={styles.weekdaysRow}>
          {weekdays.map((day) => (
            <View key={day} style={styles.weekdayCell}>
              <Text style={styles.weekdayText}>{day}</Text>
            </View>
          ))}
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarGrid}>
          {calendarDays.map((date, index) => {
            if (!date) {
              return <View key={`empty-${index}`} style={styles.dayCell} />;
            }

            const dateStr = formatDateString(date);
            const isAvailable = isDateAvailable(date);
            const isPast = isPastDate(date);
            const isSoldOut = isDateSoldOut(date);
            const isSelected = selectedDate === dateStr;
            const isToday = formatDateString(new Date()) === dateStr;

            return (
              <TouchableOpacity
                key={dateStr}
                style={styles.dayCell}
                onPress={() => handleDateSelect(date)}
                disabled={isPast || !isAvailable || isSoldOut}
              >
                <View style={[
                  styles.dayInner,
                  isSelected && styles.daySelected,
                  isToday && !isSelected && styles.dayToday,
                  isSoldOut && styles.dayInnerSoldOut,
                ]}>
                  {isSelected && (
                    <LinearGradient
                      colors={[colors.primary.main, colors.secondary.main]}
                      style={StyleSheet.absoluteFill}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    />
                  )}
                  <Text style={[
                    styles.dayText,
                    isPast && styles.dayTextPast,
                    !isAvailable && !isPast && styles.dayTextUnavailable,
                    isSoldOut && styles.dayTextSoldOut,
                    isSelected && styles.dayTextSelected,
                  ]}>
                    {date.getDate()}
                  </Text>
                  {isAvailable && !isPast && !isSoldOut && (
                    <View style={[styles.availableDot, isSelected && styles.availableDotSelected]} />
                  )}
                  {isSoldOut && (
                    <View style={styles.soldOutDot} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.primary.main }]} />
            <Text style={styles.legendText}>{t('booking.available')}</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.semantic.error }]} />
            <Text style={styles.legendText}>{t('show.soldOut')}</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.neutral.textTertiary }]} />
            <Text style={styles.legendText}>{t('booking.unavailable')}</Text>
          </View>
        </View>

        {/* Selected Date Info */}
        {selectedDate && (
          <View style={styles.selectedInfo}>
            <Ionicons name="calendar" size={20} color={colors.primary.main} />
            <View style={{ flex: 1, marginStart: spacing.sm }}>
              <Text style={styles.selectedInfoText}>
                {new Date(selectedDate + 'T00:00:00').toLocaleDateString(isHebrew ? 'he-IL' : 'en-US', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </Text>
              {daysUntil !== null && (
                <Text style={styles.selectedInfoDays}>
                  {daysUntil === 0
                    ? (isHebrew ? 'היום!' : 'Today!')
                    : daysUntil === 1
                      ? (isHebrew ? 'מחר' : 'Tomorrow')
                      : isHebrew
                        ? `בעוד ${daysUntil} ימים`
                        : `In ${daysUntil} days`}
                </Text>
              )}
            </View>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Button */}
      <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + spacing.md }]}>
        <TouchableOpacity
          style={[styles.continueButton, !selectedDate && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!selectedDate}
        >
          <LinearGradient
            colors={selectedDate ? [colors.primary.main, colors.primary.dark] : [colors.dark[600], colors.dark[600]]}
            style={styles.continueButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={[styles.continueButtonText, !selectedDate && styles.continueButtonTextDisabled]}>
              {t('common.continue')}
            </Text>
            <Ionicons 
              name="arrow-forward" 
              size={20} 
              color={selectedDate ? colors.neutral.white : colors.neutral.textTertiary} 
            />
          </LinearGradient>
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
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  monthNavigator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
  },
  monthButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.dark[700],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  monthTitle: {
    ...typography.headingMedium,
    color: colors.neutral.text,
  },
  weekdaysRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  weekdayText: {
    ...typography.labelSmall,
    color: colors.neutral.textTertiary,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100/7}%`,
    aspectRatio: 1,
    padding: spacing.xxs,
  },
  dayInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: colors.dark[700],
    overflow: 'hidden',
  },
  daySelected: {
    backgroundColor: 'transparent',
  },
  dayToday: {
    borderWidth: 1,
    borderColor: colors.primary.main,
  },
  dayText: {
    ...typography.bodyMedium,
    color: colors.neutral.text,
  },
  dayTextPast: {
    color: colors.neutral.textTertiary,
  },
  dayTextUnavailable: {
    color: colors.neutral.textTertiary,
  },
  dayTextSelected: {
    color: colors.neutral.white,
    fontWeight: '600',
  },
  availableDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary.main,
    marginTop: spacing.xxs,
  },
  availableDotSelected: {
    backgroundColor: colors.neutral.white,
  },
  dayInnerSoldOut: {
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  dayTextSoldOut: {
    color: colors.semantic.error,
    opacity: 0.6,
  },
  soldOutDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.semantic.error,
    marginTop: spacing.xxs,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xl,
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginEnd: spacing.sm,
  },
  legendText: {
    ...typography.bodySmall,
    color: colors.neutral.textSecondary,
  },
  selectedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary.main,
  },
  selectedInfoText: {
    ...typography.labelLarge,
    color: colors.primary.main,
  },
  selectedInfoDays: {
    ...typography.bodySmall,
    color: colors.neutral.textTertiary,
    marginTop: 2,
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
