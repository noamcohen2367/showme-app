// ============================================
// ShowME App - Add to Calendar Screen
// ============================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Switch,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing } from '../theme/theme';

interface ShowEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  endTime: string;
  venue: string;
  address: string;
  imageUrl: string;
  seats: string[];
}

const MOCK_EVENT: ShowEvent = {
  id: 'event-1',
  title: 'The Phantom of the Opera',
  date: '2025-01-15',
  time: '20:00',
  endTime: '22:30',
  venue: 'Habima Theatre',
  address: 'Habima Square, Tel Aviv',
  imageUrl: 'https://picsum.photos/seed/phantom/400/200',
  seats: ['A12', 'A13'],
};

const CALENDAR_APPS = [
  { id: 'default', name: 'Default Calendar', icon: 'calendar', color: colors.primary.main },
  { id: 'google', name: 'Google Calendar', icon: 'logo-google', color: '#4285F4' },
  { id: 'outlook', name: 'Outlook', icon: 'mail', color: '#0078D4' },
];

const REMINDER_OPTIONS = [
  { id: 'none', label: 'None' },
  { id: '15min', label: '15 minutes before' },
  { id: '30min', label: '30 minutes before' },
  { id: '1hour', label: '1 hour before' },
  { id: '2hours', label: '2 hours before' },
  { id: '1day', label: '1 day before' },
];

export default function AddToCalendarScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [selectedCalendar, setSelectedCalendar] = useState('default');
  const [reminder1, setReminder1] = useState('1hour');
  const [reminder2, setReminder2] = useState('1day');
  const [includeLocation, setIncludeLocation] = useState(true);
  const [includeNotes, setIncludeNotes] = useState(true);
  const [addTravelTime, setAddTravelTime] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleAddToCalendar = () => {
    setIsAdding(true);

    setTimeout(() => {
      setIsAdding(false);
      setAdded(true);
      Alert.alert(
        'Added to Calendar',
        `"${MOCK_EVENT.title}" has been added to your calendar with reminders.`,
        [{ text: 'Great!', onPress: () => navigation.goBack() }]
      );
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.neutral.background} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.neutral.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add to Calendar</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Event Preview */}
        <View style={styles.eventCard}>
          <Image source={{ uri: MOCK_EVENT.imageUrl }} style={styles.eventImage} contentFit="cover" transition={300} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.eventGradient}
          />
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle}>{MOCK_EVENT.title}</Text>
            <View style={styles.eventDetails}>
              <View style={styles.eventDetail}>
                <Ionicons name="calendar" size={16} color={colors.primary.main} />
                <Text style={styles.eventDetailText}>{formatDate(MOCK_EVENT.date)}</Text>
              </View>
              <View style={styles.eventDetail}>
                <Ionicons name="time" size={16} color={colors.primary.main} />
                <Text style={styles.eventDetailText}>{MOCK_EVENT.time} - {MOCK_EVENT.endTime}</Text>
              </View>
              <View style={styles.eventDetail}>
                <Ionicons name="location" size={16} color={colors.primary.main} />
                <Text style={styles.eventDetailText}>{MOCK_EVENT.venue}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Calendar Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Calendar</Text>
          <View style={styles.calendarOptions}>
            {CALENDAR_APPS.map((app) => (
              <TouchableOpacity
                key={app.id}
                style={[
                  styles.calendarOption,
                  selectedCalendar === app.id && styles.calendarOptionActive,
                ]}
                onPress={() => setSelectedCalendar(app.id)}
              >
                <View style={[styles.calendarIcon, { backgroundColor: `${app.color}20` }]}>
                  <Ionicons name={app.icon as any} size={24} color={app.color} />
                </View>
                <Text style={[
                  styles.calendarName,
                  selectedCalendar === app.id && styles.calendarNameActive,
                ]}>
                  {app.name}
                </Text>
                {selectedCalendar === app.id && (
                  <Ionicons name="checkmark-circle" size={20} color={colors.primary.main} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Reminders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reminders</Text>
          
          <View style={styles.reminderSection}>
            <Text style={styles.reminderLabel}>First Reminder</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.reminderOptions}>
                {REMINDER_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.reminderChip,
                      reminder1 === option.id && styles.reminderChipActive,
                    ]}
                    onPress={() => setReminder1(option.id)}
                  >
                    <Text style={[
                      styles.reminderChipText,
                      reminder1 === option.id && styles.reminderChipTextActive,
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.reminderSection}>
            <Text style={styles.reminderLabel}>Second Reminder</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.reminderOptions}>
                {REMINDER_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.reminderChip,
                      reminder2 === option.id && styles.reminderChipActive,
                    ]}
                    onPress={() => setReminder2(option.id)}
                  >
                    <Text style={[
                      styles.reminderChipText,
                      reminder2 === option.id && styles.reminderChipTextActive,
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>

        {/* Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Event Details</Text>
          <View style={styles.optionsCard}>
            <View style={styles.optionRow}>
              <View style={styles.optionInfo}>
                <Ionicons name="location-outline" size={20} color={colors.primary.main} />
                <Text style={styles.optionLabel}>Include location</Text>
              </View>
              <Switch
                value={includeLocation}
                onValueChange={setIncludeLocation}
                trackColor={{ false: colors.dark[500], true: colors.primary.main }}
                thumbColor={colors.neutral.white}
              />
            </View>

            <View style={styles.optionDivider} />

            <View style={styles.optionRow}>
              <View style={styles.optionInfo}>
                <Ionicons name="document-text-outline" size={20} color={colors.primary.main} />
                <Text style={styles.optionLabel}>Include ticket details</Text>
              </View>
              <Switch
                value={includeNotes}
                onValueChange={setIncludeNotes}
                trackColor={{ false: colors.dark[500], true: colors.primary.main }}
                thumbColor={colors.neutral.white}
              />
            </View>

            <View style={styles.optionDivider} />

            <View style={styles.optionRow}>
              <View style={styles.optionInfo}>
                <Ionicons name="car-outline" size={20} color={colors.primary.main} />
                <View>
                  <Text style={styles.optionLabel}>Add travel time</Text>
                  <Text style={styles.optionHint}>Block time before the event</Text>
                </View>
              </View>
              <Switch
                value={addTravelTime}
                onValueChange={setAddTravelTime}
                trackColor={{ false: colors.dark[500], true: colors.primary.main }}
                thumbColor={colors.neutral.white}
              />
            </View>
          </View>
        </View>

        {/* Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Calendar Preview</Text>
          <View style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <View style={[styles.previewColor, { backgroundColor: colors.primary.main }]} />
              <Text style={styles.previewTitle}>{MOCK_EVENT.title}</Text>
            </View>
            <View style={styles.previewDetails}>
              <Text style={styles.previewText}>{formatDate(MOCK_EVENT.date)}</Text>
              <Text style={styles.previewText}>{MOCK_EVENT.time} - {MOCK_EVENT.endTime}</Text>
              {includeLocation && (
                <Text style={styles.previewText}>📍 {MOCK_EVENT.venue}, {MOCK_EVENT.address}</Text>
              )}
              {includeNotes && (
                <Text style={styles.previewText}>🎫 Seats: {MOCK_EVENT.seats.join(', ')}</Text>
              )}
            </View>
            <View style={styles.previewReminders}>
              {reminder1 !== 'none' && (
                <View style={styles.previewReminder}>
                  <Ionicons name="notifications-outline" size={14} color={colors.neutral.textTertiary} />
                  <Text style={styles.previewReminderText}>
                    {REMINDER_OPTIONS.find(r => r.id === reminder1)?.label}
                  </Text>
                </View>
              )}
              {reminder2 !== 'none' && (
                <View style={styles.previewReminder}>
                  <Ionicons name="notifications-outline" size={14} color={colors.neutral.textTertiary} />
                  <Text style={styles.previewReminderText}>
                    {REMINDER_OPTIONS.find(r => r.id === reminder2)?.label}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.bottomCTA, { paddingBottom: insets.bottom + spacing.md }]}>
        <TouchableOpacity
          style={[styles.addButton, added && styles.addButtonDisabled]}
          onPress={handleAddToCalendar}
          disabled={isAdding || added}
        >
          <LinearGradient
            colors={added ? [colors.semantic.success, colors.semantic.success] : [colors.primary.main, colors.secondary.main]}
            style={styles.addButtonGradient}
          >
            {isAdding ? (
              <Text style={styles.addButtonText}>Adding...</Text>
            ) : added ? (
              <>
                <Ionicons name="checkmark-circle" size={24} color={colors.neutral.white} />
                <Text style={styles.addButtonText}>Added to Calendar</Text>
              </>
            ) : (
              <>
                <Ionicons name="calendar" size={24} color={colors.neutral.white} />
                <Text style={styles.addButtonText}>Add to Calendar</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.dark[500] },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { ...typography.headingMedium, color: colors.neutral.text },
  content: { flex: 1 },
  contentContainer: { padding: spacing.lg },
  eventCard: { borderRadius: 16, overflow: 'hidden', marginBottom: spacing.xl, height: 180, position: 'relative' },
  eventImage: { width: '100%', height: '100%' },
  eventGradient: { ...StyleSheet.absoluteFillObject },
  eventInfo: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: spacing.md },
  eventTitle: { ...typography.headingSmall, color: colors.neutral.white, marginBottom: spacing.sm },
  eventDetails: { gap: spacing.xs },
  eventDetail: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  eventDetailText: { ...typography.bodySmall, color: colors.neutral.textSecondary },
  section: { marginBottom: spacing.xl },
  sectionTitle: { ...typography.labelMedium, color: colors.neutral.text, marginBottom: spacing.md },
  calendarOptions: { gap: spacing.sm },
  calendarOption: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.dark[700], borderRadius: 12, padding: spacing.md, borderWidth: 1, borderColor: colors.dark[500] },
  calendarOptionActive: { borderColor: colors.primary.main },
  calendarIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  calendarName: { flex: 1, ...typography.labelMedium, color: colors.neutral.textSecondary, marginStart: spacing.md },
  calendarNameActive: { color: colors.neutral.text },
  reminderSection: { marginBottom: spacing.md },
  reminderLabel: { ...typography.labelSmall, color: colors.neutral.textSecondary, marginBottom: spacing.sm },
  reminderOptions: { flexDirection: 'row', gap: spacing.sm },
  reminderChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: 20, backgroundColor: colors.dark[700], borderWidth: 1, borderColor: colors.dark[500] },
  reminderChipActive: { backgroundColor: 'rgba(168, 85, 247, 0.2)', borderColor: colors.primary.main },
  reminderChipText: { ...typography.labelSmall, color: colors.neutral.textSecondary },
  reminderChipTextActive: { color: colors.primary.main },
  optionsCard: { backgroundColor: colors.dark[700], borderRadius: 16, padding: spacing.md, borderWidth: 1, borderColor: colors.dark[500] },
  optionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.sm },
  optionInfo: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 },
  optionLabel: { ...typography.labelMedium, color: colors.neutral.text },
  optionHint: { ...typography.caption, color: colors.neutral.textTertiary },
  optionDivider: { height: 1, backgroundColor: colors.dark[500], marginVertical: spacing.xs },
  previewCard: { backgroundColor: colors.dark[700], borderRadius: 12, padding: spacing.md, borderWidth: 1, borderColor: colors.dark[500] },
  previewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  previewColor: { width: 4, height: 40, borderRadius: 2, marginEnd: spacing.md },
  previewTitle: { ...typography.labelLarge, color: colors.neutral.text, flex: 1 },
  previewDetails: { gap: spacing.xs, marginBottom: spacing.md },
  previewText: { ...typography.bodySmall, color: colors.neutral.textSecondary },
  previewReminders: { flexDirection: 'row', gap: spacing.md, borderTopWidth: 1, borderTopColor: colors.dark[500], paddingTop: spacing.md },
  previewReminder: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  previewReminderText: { ...typography.caption, color: colors.neutral.textTertiary },
  bottomCTA: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: spacing.lg, paddingTop: spacing.md, backgroundColor: colors.dark[800], borderTopWidth: 1, borderTopColor: colors.dark[500] },
  addButton: { borderRadius: 12, overflow: 'hidden' },
  addButtonDisabled: { opacity: 0.8 },
  addButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.lg, gap: spacing.sm },
  addButtonText: { ...typography.labelLarge, color: colors.neutral.white },
});
