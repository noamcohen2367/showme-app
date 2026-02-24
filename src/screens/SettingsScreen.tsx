// ============================================
// ShowME App - Settings Screen (Dark Aurora Theme)
// ============================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  StatusBar,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing } from '../theme/theme';
import { currentUser } from '../data/user';
import { RootStackParamList } from '../types/types';

type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SettingsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const insets = useSafeAreaInsets();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [discountAlerts, setDiscountAlerts] = useState(true);
  const [newShowAlerts, setNewShowAlerts] = useState(true);
  const [showReminders, setShowReminders] = useState(true);

  const handleSave = () => {
    Alert.alert(t('settings.saved'), '', [{ text: 'OK' }]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.neutral.background} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.neutral.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('settings.title')}</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>{t('common.save')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Personal Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.personalDetails')}</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.fieldRow}>
              <View style={styles.fieldIcon}>
                <Ionicons name="person-outline" size={20} color={colors.primary.main} />
              </View>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>{t('settings.fullName')}</Text>
                <Text style={styles.fieldValue}>{currentUser.fullName}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.neutral.textTertiary} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.fieldRow}>
              <View style={styles.fieldIcon}>
                <Ionicons name="mail-outline" size={20} color={colors.primary.main} />
              </View>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>{t('settings.email')}</Text>
                <Text style={styles.fieldValue}>{currentUser.email}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.neutral.textTertiary} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.fieldRow}>
              <View style={styles.fieldIcon}>
                <Ionicons name="call-outline" size={20} color={colors.primary.main} />
              </View>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>{t('settings.phone')}</Text>
                <Text style={styles.fieldValue}>{currentUser.phone}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.neutral.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Language moved to Profile settings – accessible via Profile > Language */}

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.location')}</Text>
          <TouchableOpacity style={styles.card}>
            <View style={styles.fieldRow}>
              <View style={styles.fieldIcon}>
                <Ionicons name="location-outline" size={20} color={colors.primary.main} />
              </View>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>{t('settings.location')}</Text>
                <Text style={styles.fieldValue}>
                  {t(`locations.${currentUser.preferredLocation || 'tel_aviv'}`)}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.neutral.textTertiary} />
            </View>
          </TouchableOpacity>
          <Text style={styles.helpText}>{t('settings.locationDesc')}</Text>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.notifications')}</Text>
          <View style={styles.card}>
            <View style={styles.switchRow}>
              <View style={styles.switchInfo}>
                <Ionicons name="notifications-outline" size={20} color={colors.primary.main} />
                <Text style={styles.switchLabel}>{t('settings.pushNotifications')}</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: colors.dark[500], true: colors.primary.main }}
                thumbColor={colors.neutral.white}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.switchRow}>
              <View style={styles.switchInfo}>
                <Ionicons name="mail-outline" size={20} color={colors.primary.main} />
                <Text style={styles.switchLabel}>{t('settings.emailNotifications')}</Text>
              </View>
              <Switch
                value={emailNotifications}
                onValueChange={setEmailNotifications}
                trackColor={{ false: colors.dark[500], true: colors.primary.main }}
                thumbColor={colors.neutral.white}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.switchRow}>
              <View style={styles.switchInfo}>
                <Ionicons name="pricetag-outline" size={20} color={colors.secondary.main} />
                <Text style={styles.switchLabel}>{t('settings.discountAlerts')}</Text>
              </View>
              <Switch
                value={discountAlerts}
                onValueChange={setDiscountAlerts}
                trackColor={{ false: colors.dark[500], true: colors.secondary.main }}
                thumbColor={colors.neutral.white}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.switchRow}>
              <View style={styles.switchInfo}>
                <Ionicons name="sparkles-outline" size={20} color={colors.accent.main} />
                <Text style={styles.switchLabel}>{t('settings.newShowAlerts')}</Text>
              </View>
              <Switch
                value={newShowAlerts}
                onValueChange={setNewShowAlerts}
                trackColor={{ false: colors.dark[500], true: colors.accent.main }}
                thumbColor={colors.neutral.white}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.switchRow}>
              <View style={styles.switchInfo}>
                <Ionicons name="alarm-outline" size={20} color={colors.semantic.warning} />
                <Text style={styles.switchLabel}>{t('settings.reminderAlerts')}</Text>
              </View>
              <Switch
                value={showReminders}
                onValueChange={setShowReminders}
                trackColor={{ false: colors.dark[500], true: colors.semantic.warning }}
                thumbColor={colors.neutral.white}
              />
            </View>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.about', { defaultValue: 'About' })}</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.fieldRow}>
              <View style={styles.fieldIcon}>
                <Ionicons name="information-circle-outline" size={20} color={colors.primary.main} />
              </View>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>{t('settings.version', { defaultValue: 'Version' })}</Text>
                <Text style={styles.fieldValue}>1.0.0</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.fieldRow}>
              <View style={styles.fieldIcon}>
                <Ionicons name="star-outline" size={20} color={colors.primary.main} />
              </View>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>{t('settings.rateApp', { defaultValue: 'Rate App' })}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.neutral.textTertiary} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.fieldRow}>
              <View style={styles.fieldIcon}>
                <Ionicons name="share-social-outline" size={20} color={colors.primary.main} />
              </View>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>{t('settings.shareApp', { defaultValue: 'Share App' })}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.neutral.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Developer / Demo Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Developer</Text>
          <View style={styles.card}>
            <TouchableOpacity 
              style={styles.fieldRow}
              onPress={() => navigation.navigate('Onboarding')}
            >
              <View style={styles.fieldIcon}>
                <Ionicons name="rocket-outline" size={20} color={colors.primary.main} />
              </View>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>View Onboarding</Text>
                <Text style={styles.fieldHint}>Preview the welcome screens</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.neutral.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <View style={styles.card}>
            <TouchableOpacity style={styles.dangerRow}>
              <View style={[styles.fieldIcon, styles.dangerIcon]}>
                <Ionicons name="trash-outline" size={20} color={colors.semantic.error} />
              </View>
              <Text style={styles.dangerText}>
                {t('settings.deleteAccount', { defaultValue: 'Delete Account' })}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
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
  saveButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  saveButtonText: {
    ...typography.labelMedium,
    color: colors.primary.main,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.labelMedium,
    color: colors.neutral.textTertiary,
    marginBottom: spacing.sm,
    marginStart: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: colors.dark[700],
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  fieldIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: spacing.md,
  },
  fieldContent: {
    flex: 1,
  },
  fieldLabel: {
    ...typography.bodySmall,
    color: colors.neutral.textSecondary,
  },
  fieldValue: {
    ...typography.bodyMedium,
    color: colors.neutral.text,
    marginTop: spacing.xxs,
  },
  fieldHint: {
    ...typography.bodySmall,
    color: colors.neutral.textTertiary,
    marginTop: spacing.xxs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.dark[500],
    marginStart: 68,
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  languageInfo: {
    flex: 1,
  },
  languageNative: {
    ...typography.bodyMedium,
    color: colors.neutral.text,
  },
  languageName: {
    ...typography.bodySmall,
    color: colors.neutral.textTertiary,
    marginTop: spacing.xxs,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  switchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  switchLabel: {
    ...typography.bodyMedium,
    color: colors.neutral.text,
    marginStart: spacing.md,
  },
  helpText: {
    ...typography.caption,
    color: colors.neutral.textTertiary,
    marginTop: spacing.sm,
    marginStart: spacing.sm,
  },
  dangerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  dangerIcon: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  dangerText: {
    ...typography.bodyMedium,
    color: colors.semantic.error,
  },
});
