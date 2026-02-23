// ============================================
// ShowME App - Notification Preferences Screen
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
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing } from '../theme/theme';

interface NotificationCategory {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  enabled: boolean;
}

interface QuietHours {
  enabled: boolean;
  startTime: string;
  endTime: string;
}

export default function NotificationPreferencesScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [masterSwitch, setMasterSwitch] = useState(true);
  const [categories, setCategories] = useState<NotificationCategory[]>([
    { id: 'reminders', title: 'Show Reminders', description: 'Get notified before your upcoming shows', icon: 'alarm', color: colors.primary.main, enabled: true },
    { id: 'deals', title: 'Deals & Discounts', description: 'Special offers and last-minute deals', icon: 'pricetag', color: colors.secondary.main, enabled: true },
    { id: 'new_shows', title: 'New Shows', description: 'When new shows are added to your favorite theaters', icon: 'sparkles', color: colors.accent.main, enabled: true },
    { id: 'reviews', title: 'Reviews', description: 'When someone comments on your review', icon: 'chatbubble', color: '#10B981', enabled: false },
    { id: 'friends', title: 'Friend Activity', description: 'When friends book or review shows', icon: 'people', color: '#F59E0B', enabled: false },
    { id: 'rewards', title: 'Rewards & Points', description: 'Earn points, level up, and redeem rewards', icon: 'gift', color: '#EF4444', enabled: true },
  ]);

  const [quietHours, setQuietHours] = useState<QuietHours>({
    enabled: true,
    startTime: '22:00',
    endTime: '08:00',
  });

  const [reminderTiming, setReminderTiming] = useState('1day');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  const toggleCategory = (id: string) => {
    setCategories(prev =>
      prev.map(cat => cat.id === id ? { ...cat, enabled: !cat.enabled } : cat)
    );
  };

  const REMINDER_OPTIONS = [
    { id: '1hour', label: '1 hour before' },
    { id: '3hours', label: '3 hours before' },
    { id: '1day', label: '1 day before' },
    { id: '2days', label: '2 days before' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.neutral.background} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.neutral.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Master Switch */}
        <View style={styles.masterCard}>
          <LinearGradient
            colors={masterSwitch ? [colors.primary.main, colors.secondary.main] : [colors.dark[600], colors.dark[700]]}
            style={styles.masterGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.masterContent}>
              <View style={styles.masterIcon}>
                <Ionicons 
                  name={masterSwitch ? 'notifications' : 'notifications-off'} 
                  size={28} 
                  color={colors.neutral.white} 
                />
              </View>
              <View style={styles.masterText}>
                <Text style={styles.masterTitle}>
                  {masterSwitch ? 'Notifications Enabled' : 'Notifications Disabled'}
                </Text>
                <Text style={styles.masterDesc}>
                  {masterSwitch ? 'You\'ll receive updates and reminders' : 'All notifications are turned off'}
                </Text>
              </View>
              <Switch
                value={masterSwitch}
                onValueChange={setMasterSwitch}
                trackColor={{ false: 'rgba(255,255,255,0.2)', true: 'rgba(255,255,255,0.3)' }}
                thumbColor={colors.neutral.white}
              />
            </View>
          </LinearGradient>
        </View>

        {masterSwitch && (
          <>
            {/* Categories */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notification Types</Text>
              <View style={styles.categoriesCard}>
                {categories.map((category, index) => (
                  <React.Fragment key={category.id}>
                    <TouchableOpacity
                      style={styles.categoryRow}
                      onPress={() => toggleCategory(category.id)}
                    >
                      <View style={[styles.categoryIcon, { backgroundColor: `${category.color}20` }]}>
                        <Ionicons name={category.icon} size={20} color={category.color} />
                      </View>
                      <View style={styles.categoryInfo}>
                        <Text style={styles.categoryTitle}>{category.title}</Text>
                        <Text style={styles.categoryDesc}>{category.description}</Text>
                      </View>
                      <Switch
                        value={category.enabled}
                        onValueChange={() => toggleCategory(category.id)}
                        trackColor={{ false: colors.dark[500], true: category.color }}
                        thumbColor={colors.neutral.white}
                      />
                    </TouchableOpacity>
                    {index < categories.length - 1 && <View style={styles.divider} />}
                  </React.Fragment>
                ))}
              </View>
            </View>

            {/* Reminder Timing */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Show Reminder Timing</Text>
              <Text style={styles.sectionSubtitle}>When should we remind you about upcoming shows?</Text>
              <View style={styles.timingOptions}>
                {REMINDER_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.timingOption,
                      reminderTiming === option.id && styles.timingOptionActive,
                    ]}
                    onPress={() => setReminderTiming(option.id)}
                  >
                    <Text style={[
                      styles.timingOptionText,
                      reminderTiming === option.id && styles.timingOptionTextActive,
                    ]}>
                      {option.label}
                    </Text>
                    {reminderTiming === option.id && (
                      <Ionicons name="checkmark" size={18} color={colors.primary.main} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Quiet Hours */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quiet Hours</Text>
              <View style={styles.quietCard}>
                <View style={styles.quietHeader}>
                  <View style={styles.quietInfo}>
                    <Ionicons name="moon" size={20} color={colors.primary.main} />
                    <View>
                      <Text style={styles.quietTitle}>Do Not Disturb</Text>
                      <Text style={styles.quietDesc}>
                        {quietHours.enabled 
                          ? `${quietHours.startTime} - ${quietHours.endTime}` 
                          : 'Disabled'}
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={quietHours.enabled}
                    onValueChange={(value) => setQuietHours({ ...quietHours, enabled: value })}
                    trackColor={{ false: colors.dark[500], true: colors.primary.main }}
                    thumbColor={colors.neutral.white}
                  />
                </View>

                {quietHours.enabled && (
                  <View style={styles.quietTimes}>
                    <TouchableOpacity style={styles.timeSelector}>
                      <Text style={styles.timeSelectorLabel}>From</Text>
                      <View style={styles.timeSelectorValue}>
                        <Text style={styles.timeSelectorText}>{quietHours.startTime}</Text>
                        <Ionicons name="chevron-down" size={16} color={colors.neutral.textTertiary} />
                      </View>
                    </TouchableOpacity>
                    <View style={styles.timeDivider}>
                      <Ionicons name="arrow-forward" size={16} color={colors.neutral.textTertiary} />
                    </View>
                    <TouchableOpacity style={styles.timeSelector}>
                      <Text style={styles.timeSelectorLabel}>To</Text>
                      <View style={styles.timeSelectorValue}>
                        <Text style={styles.timeSelectorText}>{quietHours.endTime}</Text>
                        <Ionicons name="chevron-down" size={16} color={colors.neutral.textTertiary} />
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>

            {/* Other Channels */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Other Channels</Text>
              <View style={styles.channelsCard}>
                <View style={styles.channelRow}>
                  <View style={styles.channelInfo}>
                    <Ionicons name="mail-outline" size={20} color={colors.primary.main} />
                    <Text style={styles.channelLabel}>Email Notifications</Text>
                  </View>
                  <Switch
                    value={emailNotifications}
                    onValueChange={setEmailNotifications}
                    trackColor={{ false: colors.dark[500], true: colors.primary.main }}
                    thumbColor={colors.neutral.white}
                  />
                </View>
                <View style={styles.divider} />
                <View style={styles.channelRow}>
                  <View style={styles.channelInfo}>
                    <Ionicons name="chatbox-outline" size={20} color={colors.primary.main} />
                    <Text style={styles.channelLabel}>SMS Notifications</Text>
                  </View>
                  <Switch
                    value={smsNotifications}
                    onValueChange={setSmsNotifications}
                    trackColor={{ false: colors.dark[500], true: colors.primary.main }}
                    thumbColor={colors.neutral.white}
                  />
                </View>
              </View>
            </View>

            {/* Info Card */}
            <View style={styles.infoCard}>
              <Ionicons name="information-circle" size={20} color={colors.accent.main} />
              <Text style={styles.infoText}>
                Important notifications about your bookings will always be delivered, even during quiet hours.
              </Text>
            </View>
          </>
        )}

        <View style={{ height: 50 }} />
      </ScrollView>
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
  masterCard: { borderRadius: 16, overflow: 'hidden', marginBottom: spacing.xl },
  masterGradient: { padding: spacing.lg },
  masterContent: { flexDirection: 'row', alignItems: 'center' },
  masterIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  masterText: { flex: 1, marginStart: spacing.md },
  masterTitle: { ...typography.labelLarge, color: colors.neutral.white },
  masterDesc: { ...typography.bodySmall, color: 'rgba(255,255,255,0.8)' },
  section: { marginBottom: spacing.xl },
  sectionTitle: { ...typography.labelMedium, color: colors.neutral.text, marginBottom: spacing.xs },
  sectionSubtitle: { ...typography.bodySmall, color: colors.neutral.textTertiary, marginBottom: spacing.md },
  categoriesCard: { backgroundColor: colors.dark[700], borderRadius: 16, padding: spacing.md, borderWidth: 1, borderColor: colors.dark[500] },
  categoryRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm },
  categoryIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  categoryInfo: { flex: 1, marginStart: spacing.md, marginEnd: spacing.sm },
  categoryTitle: { ...typography.labelMedium, color: colors.neutral.text },
  categoryDesc: { ...typography.caption, color: colors.neutral.textTertiary, marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.dark[500], marginVertical: spacing.xs },
  timingOptions: { gap: spacing.sm },
  timingOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.dark[700], borderRadius: 12, padding: spacing.md, borderWidth: 1, borderColor: colors.dark[500] },
  timingOptionActive: { borderColor: colors.primary.main, backgroundColor: 'rgba(168, 85, 247, 0.1)' },
  timingOptionText: { ...typography.labelMedium, color: colors.neutral.textSecondary },
  timingOptionTextActive: { color: colors.primary.main },
  quietCard: { backgroundColor: colors.dark[700], borderRadius: 16, padding: spacing.md, borderWidth: 1, borderColor: colors.dark[500] },
  quietHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  quietInfo: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  quietTitle: { ...typography.labelMedium, color: colors.neutral.text },
  quietDesc: { ...typography.caption, color: colors.neutral.textTertiary },
  quietTimes: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.dark[500] },
  timeSelector: { flex: 1 },
  timeSelectorLabel: { ...typography.caption, color: colors.neutral.textTertiary, marginBottom: spacing.xxs },
  timeSelectorValue: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.dark[600], borderRadius: 8, padding: spacing.sm },
  timeSelectorText: { ...typography.labelMedium, color: colors.neutral.text },
  timeDivider: { paddingHorizontal: spacing.md, paddingTop: spacing.md },
  channelsCard: { backgroundColor: colors.dark[700], borderRadius: 16, padding: spacing.md, borderWidth: 1, borderColor: colors.dark[500] },
  channelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.sm },
  channelInfo: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  channelLabel: { ...typography.labelMedium, color: colors.neutral.text },
  infoCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: 'rgba(6, 182, 212, 0.1)', padding: spacing.md, borderRadius: 12, gap: spacing.sm },
  infoText: { ...typography.bodySmall, color: colors.accent.main, flex: 1 },
});
