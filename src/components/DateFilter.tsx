// ============================================
// ShowME App - Date Filter Component
// ============================================

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing } from '../theme/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DAY_WIDTH = (SCREEN_WIDTH - spacing.lg * 2 - spacing.xs * 12) / 7;

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAYS_HE = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'];

export type DateFilterType = 'today' | 'specific' | 'range' | null;

export interface DateFilterValue {
  type: DateFilterType;
  date?: string; // For specific date
  startDate?: string; // For range
  endDate?: string; // For range
}

interface DateFilterProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filter: DateFilterValue | null) => void;
  currentFilter: DateFilterValue | null;
}

const QuickOption: React.FC<{
  label: string;
  icon: string;
  selected: boolean;
  onPress: () => void;
}> = ({ label, icon, selected, onPress }) => (
  <TouchableOpacity
    style={[styles.quickOption, selected && styles.quickOptionSelected]}
    onPress={onPress}
  >
    {selected && (
      <LinearGradient
        colors={[colors.primary.main, colors.primary.dark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    )}
    <Ionicons
      name={icon as any}
      size={20}
      color={selected ? colors.neutral.white : colors.neutral.textSecondary}
    />
    <Text style={[styles.quickOptionText, selected && styles.quickOptionTextSelected]}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default function DateFilter({
  visible,
  onClose,
  onApply,
  currentFilter,
}: DateFilterProps) {
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const isHebrew = i18n.language === 'he';

  // Local state for the modal
  const [filterType, setFilterType] = useState<DateFilterType>(currentFilter?.type || null);
  const [selectedDate, setSelectedDate] = useState<string | null>(currentFilter?.date || null);
  const [rangeStart, setRangeStart] = useState<string | null>(currentFilter?.startDate || null);
  const [rangeEnd, setRangeEnd] = useState<string | null>(currentFilter?.endDate || null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectingRangeEnd, setSelectingRangeEnd] = useState(false);

  // Reset local state when modal opens
  React.useEffect(() => {
    if (visible) {
      setFilterType(currentFilter?.type || null);
      setSelectedDate(currentFilter?.date || null);
      setRangeStart(currentFilter?.startDate || null);
      setRangeEnd(currentFilter?.endDate || null);
      setSelectingRangeEnd(false);
    }
  }, [visible, currentFilter]);

  const weekdays = isHebrew ? WEEKDAYS_HE : WEEKDAYS;

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

  const isPastDate = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isDateInRange = (date: Date): boolean => {
    if (!rangeStart || !rangeEnd) return false;
    const dateStr = formatDateString(date);
    return dateStr >= rangeStart && dateStr <= rangeEnd;
  };

  const isRangeStart = (date: Date): boolean => {
    if (!rangeStart) return false;
    return formatDateString(date) === rangeStart;
  };

  const isRangeEnd = (date: Date): boolean => {
    if (!rangeEnd) return false;
    return formatDateString(date) === rangeEnd;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleTodaySelect = () => {
    setFilterType('today');
    const today = new Date();
    setSelectedDate(formatDateString(today));
    setRangeStart(null);
    setRangeEnd(null);
  };

  const handleDateSelect = (date: Date) => {
    if (isPastDate(date)) return;

    const dateStr = formatDateString(date);

    if (filterType === 'range') {
      if (!rangeStart || selectingRangeEnd === false) {
        // Starting a new range
        setRangeStart(dateStr);
        setRangeEnd(null);
        setSelectingRangeEnd(true);
      } else {
        // Completing the range
        if (dateStr < rangeStart) {
          // User selected earlier date, swap
          setRangeEnd(rangeStart);
          setRangeStart(dateStr);
        } else {
          setRangeEnd(dateStr);
        }
        setSelectingRangeEnd(false);
      }
      setSelectedDate(null);
    } else {
      // Specific date selection
      setFilterType('specific');
      setSelectedDate(dateStr);
      setRangeStart(null);
      setRangeEnd(null);
    }
  };

  const handleRangeToggle = () => {
    if (filterType === 'range') {
      // Switch to specific
      setFilterType('specific');
      setRangeStart(null);
      setRangeEnd(null);
    } else {
      // Switch to range
      setFilterType('range');
      setSelectedDate(null);
      setRangeStart(null);
      setRangeEnd(null);
      setSelectingRangeEnd(false);
    }
  };

  const handleApply = () => {
    if (filterType === 'today') {
      const today = new Date();
      onApply({
        type: 'today',
        date: formatDateString(today),
      });
    } else if (filterType === 'specific' && selectedDate) {
      onApply({
        type: 'specific',
        date: selectedDate,
      });
    } else if (filterType === 'range' && rangeStart && rangeEnd) {
      onApply({
        type: 'range',
        startDate: rangeStart,
        endDate: rangeEnd,
      });
    } else {
      onApply(null);
    }
    onClose();
  };

  const handleClear = () => {
    setFilterType(null);
    setSelectedDate(null);
    setRangeStart(null);
    setRangeEnd(null);
    onApply(null);
    onClose();
  };

  const getMonthYearLabel = () => {
    const monthNames = isHebrew
      ? ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר']
      : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    return `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;
  };

  const formatDisplayDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    };
    return date.toLocaleDateString(isHebrew ? 'he-IL' : 'en-US', options);
  };

  const getSelectionLabel = (): string => {
    if (filterType === 'today') {
      return t('common.today');
    }
    if (filterType === 'specific' && selectedDate) {
      return formatDisplayDate(selectedDate);
    }
    if (filterType === 'range' && rangeStart && rangeEnd) {
      return `${formatDisplayDate(rangeStart)} - ${formatDisplayDate(rangeEnd)}`;
    }
    if (filterType === 'range' && rangeStart) {
      return `${formatDisplayDate(rangeStart)} - ...`;
    }
    return '';
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { paddingBottom: insets.bottom + spacing.md }]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.neutral.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{t('common.date')}</Text>
            <TouchableOpacity onPress={handleClear}>
              <Text style={styles.clearText}>{t('common.clearAll')}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Quick Options */}
            <Text style={styles.sectionTitle}>Quick Select</Text>
            <View style={styles.quickOptions}>
              <QuickOption
                label={t('common.today')}
                icon="today-outline"
                selected={filterType === 'today'}
                onPress={handleTodaySelect}
              />
              <QuickOption
                label="Date Range"
                icon="calendar-outline"
                selected={filterType === 'range'}
                onPress={handleRangeToggle}
              />
            </View>

            {/* Selection Display */}
            {getSelectionLabel() && (
              <View style={styles.selectionDisplay}>
                <Ionicons name="checkmark-circle" size={20} color={colors.primary.main} />
                <Text style={styles.selectionText}>{getSelectionLabel()}</Text>
              </View>
            )}

            {/* Range Instruction */}
            {filterType === 'range' && (
              <View style={styles.rangeInstruction}>
                <Ionicons 
                  name="information-circle-outline" 
                  size={18} 
                  color={colors.neutral.textSecondary} 
                />
                <Text style={styles.rangeInstructionText}>
                  {!rangeStart 
                    ? 'Select start date' 
                    : selectingRangeEnd 
                    ? 'Select end date' 
                    : 'Range selected'}
                </Text>
              </View>
            )}

            {/* Calendar */}
            <View style={styles.calendarContainer}>
              {/* Month Navigator */}
              <View style={styles.monthNavigator}>
                <TouchableOpacity style={styles.monthButton} onPress={handlePrevMonth}>
                  <Ionicons name="chevron-back" size={20} color={colors.neutral.text} />
                </TouchableOpacity>
                <Text style={styles.monthTitle}>{getMonthYearLabel()}</Text>
                <TouchableOpacity style={styles.monthButton} onPress={handleNextMonth}>
                  <Ionicons name="chevron-forward" size={20} color={colors.neutral.text} />
                </TouchableOpacity>
              </View>

              {/* Weekday Headers */}
              <View style={styles.weekdaysRow}>
                {weekdays.map((day, index) => (
                  <View key={index} style={styles.weekdayCell}>
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
                  const isPast = isPastDate(date);
                  const isTodayDate = isToday(date);
                  const isSelected = filterType === 'specific' && selectedDate === dateStr;
                  const inRange = isDateInRange(date);
                  const isStart = isRangeStart(date);
                  const isEnd = isRangeEnd(date);

                  return (
                    <View key={dateStr} style={styles.dayCell}>
                      <TouchableOpacity
                        style={[
                          styles.dayInner,
                          isPast && styles.dayPast,
                          isTodayDate && styles.dayToday,
                          isSelected && styles.daySelected,
                          inRange && styles.dayInRange,
                          isStart && styles.dayRangeStart,
                          isEnd && styles.dayRangeEnd,
                        ]}
                        onPress={() => handleDateSelect(date)}
                        disabled={isPast}
                      >
                        {(isSelected || isStart || isEnd) && (
                          <LinearGradient
                            colors={[colors.primary.main, colors.primary.dark]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={StyleSheet.absoluteFill}
                          />
                        )}
                        <Text
                          style={[
                            styles.dayText,
                            isPast && styles.dayTextPast,
                            (isSelected || isStart || isEnd) && styles.dayTextSelected,
                          ]}
                        >
                          {date.getDate()}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* Apply Button */}
          <View style={styles.footer}>
            <TouchableOpacity 
              style={[
                styles.applyButton,
                (!filterType || (filterType === 'range' && (!rangeStart || !rangeEnd))) && styles.applyButtonDisabled
              ]} 
              onPress={handleApply}
              disabled={!filterType || (filterType === 'range' && (!rangeStart || !rangeEnd))}
            >
              <LinearGradient
                colors={
                  filterType && !(filterType === 'range' && (!rangeStart || !rangeEnd))
                    ? [colors.primary.main, colors.primary.dark]
                    : [colors.dark[600], colors.dark[600]]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <Text style={styles.applyButtonText}>{t('common.apply')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.dark[800],
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark[600],
  },
  headerTitle: {
    ...typography.headingSmall,
    color: colors.neutral.text,
  },
  clearText: {
    ...typography.bodyMedium,
    color: colors.primary.main,
  },
  content: {
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    ...typography.labelMedium,
    color: colors.neutral.textSecondary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  quickOptions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  quickOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    backgroundColor: colors.dark[700],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.dark[500],
    overflow: 'hidden',
  },
  quickOptionSelected: {
    borderColor: colors.primary.main,
  },
  quickOptionText: {
    ...typography.bodyMedium,
    color: colors.neutral.textSecondary,
  },
  quickOptionTextSelected: {
    color: colors.neutral.white,
    fontWeight: '600',
  },
  selectionDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
  },
  selectionText: {
    ...typography.bodyMedium,
    color: colors.neutral.text,
    fontWeight: '500',
  },
  rangeInstruction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  rangeInstructionText: {
    ...typography.bodySmall,
    color: colors.neutral.textSecondary,
  },
  calendarContainer: {
    marginTop: spacing.lg,
  },
  monthNavigator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  monthButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.dark[700],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  monthTitle: {
    ...typography.headingSmall,
    color: colors.neutral.text,
  },
  weekdaysRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
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
    width: `${100 / 7}%`,
    aspectRatio: 1,
    padding: 2,
  },
  dayInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: colors.dark[700],
    overflow: 'hidden',
  },
  dayPast: {
    backgroundColor: 'transparent',
  },
  dayToday: {
    borderWidth: 1,
    borderColor: colors.primary.main,
  },
  daySelected: {
    backgroundColor: 'transparent',
  },
  dayInRange: {
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    borderRadius: 0,
  },
  dayRangeStart: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  dayRangeEnd: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  dayText: {
    ...typography.bodyMedium,
    color: colors.neutral.text,
  },
  dayTextPast: {
    color: colors.neutral.textTertiary,
  },
  dayTextSelected: {
    color: colors.neutral.white,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.dark[600],
  },
  applyButton: {
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  applyButtonDisabled: {
    opacity: 0.5,
  },
  applyButtonText: {
    ...typography.labelLarge,
    color: colors.neutral.white,
    fontWeight: '600',
  },
});
