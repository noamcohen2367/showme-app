// ============================================
// ShowME App - Theme/Appearance Settings Screen
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
import { useTheme, ThemeMode } from '../theme/ThemeContext';

type AccentColor = 'purple' | 'blue' | 'green' | 'orange' | 'pink';

const ACCENT_COLORS: { id: AccentColor; name: string; color: string; gradient: [string, string] }[] = [
  { id: 'purple', name: 'Purple', color: '#A855F7', gradient: ['#A855F7', '#7C3AED'] },
  { id: 'blue', name: 'Ocean', color: '#3B82F6', gradient: ['#3B82F6', '#1D4ED8'] },
  { id: 'green', name: 'Emerald', color: '#10B981', gradient: ['#10B981', '#059669'] },
  { id: 'orange', name: 'Sunset', color: '#F59E0B', gradient: ['#F59E0B', '#D97706'] },
  { id: 'pink', name: 'Rose', color: '#EC4899', gradient: ['#EC4899', '#DB2777'] },
];

export default function AppearanceScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const { mode: themeMode, setMode } = useTheme();
  const [accentColor, setAccentColor] = useState<AccentColor>('purple');
  const [reduceMotion, setReduceMotion] = useState(false);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [compactMode, setCompactMode] = useState(false);

  const renderThemeOption = (mode: ThemeMode, icon: keyof typeof Ionicons.glyphMap, label: string) => (
    <TouchableOpacity
      style={[styles.themeOption, themeMode === mode && styles.themeOptionActive]}
      onPress={() => setMode(mode)}
    >
      <View style={[styles.themePreview, mode === 'light' && styles.themePreviewLight]}>
        <View style={[styles.themePreviewHeader, mode === 'light' && styles.themePreviewHeaderLight]} />
        <View style={styles.themePreviewContent}>
          <View style={[styles.themePreviewCard, mode === 'light' && styles.themePreviewCardLight]} />
          <View style={[styles.themePreviewCard, styles.themePreviewCardSmall, mode === 'light' && styles.themePreviewCardLight]} />
        </View>
      </View>
      <View style={styles.themeInfo}>
        <Ionicons 
          name={icon} 
          size={20} 
          color={themeMode === mode ? colors.primary.main : colors.neutral.textSecondary} 
        />
        <Text style={[styles.themeLabel, themeMode === mode && styles.themeLabelActive]}>
          {label}
        </Text>
      </View>
      {themeMode === mode && (
        <View style={styles.checkmark}>
          <Ionicons name="checkmark" size={16} color={colors.neutral.white} />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.neutral.background} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.neutral.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Appearance</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Theme Mode */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Theme</Text>
          <Text style={styles.sectionSubtitle}>Choose your preferred appearance</Text>
          <View style={styles.themeOptions}>
            {renderThemeOption('dark', 'moon', 'Dark')}
            {renderThemeOption('light', 'sunny', 'Light')}
            {renderThemeOption('system', 'phone-portrait', 'System')}
          </View>
        </View>

        {/* Accent Color */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accent Color</Text>
          <Text style={styles.sectionSubtitle}>Personalize your app experience</Text>
          <View style={styles.colorOptions}>
            {ACCENT_COLORS.map((color) => (
              <TouchableOpacity
                key={color.id}
                style={styles.colorOption}
                onPress={() => setAccentColor(color.id)}
              >
                <LinearGradient
                  colors={color.gradient}
                  style={[
                    styles.colorCircle,
                    accentColor === color.id && styles.colorCircleActive,
                  ]}
                >
                  {accentColor === color.id && (
                    <Ionicons name="checkmark" size={20} color={colors.neutral.white} />
                  )}
                </LinearGradient>
                <Text style={[
                  styles.colorLabel,
                  accentColor === color.id && { color: color.color }
                ]}>
                  {color.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Preview Card */}
          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>Preview</Text>
            <View style={styles.previewContent}>
              <LinearGradient
                colors={ACCENT_COLORS.find(c => c.id === accentColor)?.gradient || ['#A855F7', '#7C3AED']}
                style={styles.previewButton}
              >
                <Text style={styles.previewButtonText}>Book Now</Text>
              </LinearGradient>
              <View style={styles.previewBadge}>
                <View style={[styles.previewDot, { backgroundColor: ACCENT_COLORS.find(c => c.id === accentColor)?.color }]} />
                <Text style={[styles.previewBadgeText, { color: ACCENT_COLORS.find(c => c.id === accentColor)?.color }]}>
                  Active
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Accessibility */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accessibility</Text>
          <View style={styles.settingsCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons name="flash-off" size={22} color={colors.primary.main} />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Reduce Motion</Text>
                  <Text style={styles.settingDesc}>Minimize animations throughout the app</Text>
                </View>
              </View>
              <Switch
                value={reduceMotion}
                onValueChange={setReduceMotion}
                trackColor={{ false: colors.dark[500], true: colors.primary.main }}
                thumbColor={colors.neutral.white}
              />
            </View>

            <View style={styles.settingDivider} />

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons name="phone-portrait" size={22} color={colors.primary.main} />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Haptic Feedback</Text>
                  <Text style={styles.settingDesc}>Vibrate on button presses and interactions</Text>
                </View>
              </View>
              <Switch
                value={hapticFeedback}
                onValueChange={setHapticFeedback}
                trackColor={{ false: colors.dark[500], true: colors.primary.main }}
                thumbColor={colors.neutral.white}
              />
            </View>

            <View style={styles.settingDivider} />

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons name="grid" size={22} color={colors.primary.main} />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Compact Mode</Text>
                  <Text style={styles.settingDesc}>Show more content with smaller elements</Text>
                </View>
              </View>
              <Switch
                value={compactMode}
                onValueChange={setCompactMode}
                trackColor={{ false: colors.dark[500], true: colors.primary.main }}
                thumbColor={colors.neutral.white}
              />
            </View>
          </View>
        </View>

        {/* Font Size */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Text Size</Text>
          <View style={styles.fontSizeCard}>
            <Text style={styles.fontSizeSmall}>A</Text>
            <View style={styles.fontSizeSlider}>
              <View style={styles.fontSizeTrack}>
                <View style={styles.fontSizeFill} />
                <View style={styles.fontSizeThumb} />
              </View>
            </View>
            <Text style={styles.fontSizeLarge}>A</Text>
          </View>
          <Text style={styles.fontSizeNote}>
            You can also adjust text size in your device's accessibility settings
          </Text>
        </View>

        {/* Reset */}
        <TouchableOpacity style={styles.resetButton} onPress={() => { setMode('dark'); setAccentColor('purple'); }}>
          <Ionicons name="refresh" size={20} color={colors.neutral.textSecondary} />
          <Text style={styles.resetButtonText}>Reset to Defaults</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.dark[500] },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { ...typography.headingMedium, color: colors.neutral.text },
  content: { flex: 1 },
  contentContainer: { padding: spacing.lg },
  section: { marginBottom: spacing.xxl },
  sectionTitle: { ...typography.headingSmall, color: colors.neutral.text, marginBottom: spacing.xxs },
  sectionSubtitle: { ...typography.bodySmall, color: colors.neutral.textTertiary, marginBottom: spacing.lg },
  themeOptions: { flexDirection: 'row', gap: spacing.md },
  themeOption: { flex: 1, backgroundColor: colors.dark[700], borderRadius: 16, padding: spacing.md, borderWidth: 2, borderColor: colors.dark[500] },
  themeOptionActive: { borderColor: colors.primary.main },
  themePreview: { backgroundColor: colors.dark[800], borderRadius: 8, padding: spacing.sm, marginBottom: spacing.sm, height: 70 },
  themePreviewLight: { backgroundColor: '#F3F4F6' },
  themePreviewHeader: { height: 12, backgroundColor: colors.dark[600], borderRadius: 4, marginBottom: spacing.xs },
  themePreviewHeaderLight: { backgroundColor: '#E5E7EB' },
  themePreviewContent: { flexDirection: 'row', gap: spacing.xs },
  themePreviewCard: { flex: 1, height: 30, backgroundColor: colors.dark[600], borderRadius: 4 },
  themePreviewCardSmall: { flex: 0.6 },
  themePreviewCardLight: { backgroundColor: '#E5E7EB' },
  themeInfo: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  themeLabel: { ...typography.labelMedium, color: colors.neutral.textSecondary },
  themeLabelActive: { color: colors.neutral.text },
  checkmark: { position: 'absolute', top: spacing.sm, right: spacing.sm, width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary.main, alignItems: 'center', justifyContent: 'center' },
  colorOptions: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.lg },
  colorOption: { alignItems: 'center' },
  colorCircle: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  colorCircleActive: { borderWidth: 3, borderColor: colors.neutral.white },
  colorLabel: { ...typography.caption, color: colors.neutral.textSecondary },
  previewCard: { backgroundColor: colors.dark[700], borderRadius: 16, padding: spacing.lg, borderWidth: 1, borderColor: colors.dark[500] },
  previewTitle: { ...typography.labelMedium, color: colors.neutral.textTertiary, marginBottom: spacing.md },
  previewContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  previewButton: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: 10 },
  previewButtonText: { ...typography.labelMedium, color: colors.neutral.white },
  previewBadge: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  previewDot: { width: 8, height: 8, borderRadius: 4 },
  previewBadgeText: { ...typography.labelSmall },
  settingsCard: { backgroundColor: colors.dark[700], borderRadius: 16, padding: spacing.lg, borderWidth: 1, borderColor: colors.dark[500] },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  settingInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  settingText: { marginStart: spacing.md, flex: 1 },
  settingLabel: { ...typography.labelMedium, color: colors.neutral.text },
  settingDesc: { ...typography.caption, color: colors.neutral.textTertiary, marginTop: 2 },
  settingDivider: { height: 1, backgroundColor: colors.dark[500], marginVertical: spacing.md },
  fontSizeCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.dark[700], borderRadius: 16, padding: spacing.lg, borderWidth: 1, borderColor: colors.dark[500] },
  fontSizeSmall: { ...typography.bodySmall, color: colors.neutral.textSecondary },
  fontSizeLarge: { fontSize: 24, fontWeight: '600', color: colors.neutral.textSecondary },
  fontSizeSlider: { flex: 1, marginHorizontal: spacing.lg },
  fontSizeTrack: { height: 4, backgroundColor: colors.dark[500], borderRadius: 2, position: 'relative' },
  fontSizeFill: { position: 'absolute', left: 0, top: 0, bottom: 0, width: '50%', backgroundColor: colors.primary.main, borderRadius: 2 },
  fontSizeThumb: { position: 'absolute', left: '50%', top: -8, width: 20, height: 20, borderRadius: 10, backgroundColor: colors.neutral.white, marginStart: -10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 },
  fontSizeNote: { ...typography.caption, color: colors.neutral.textTertiary, marginTop: spacing.sm, textAlign: 'center' },
  resetButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingVertical: spacing.lg },
  resetButtonText: { ...typography.labelMedium, color: colors.neutral.textSecondary },
});
