// ============================================
// ShowME App - Theater Dashboard Screen
// ============================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

import { useAuth } from '../contexts/AuthContext';
import { colors, typography, spacing } from '../theme/theme';

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  accent?: string;
  rtl: boolean;
}

function StatCard({ icon, label, value, accent = colors.primary.main, rtl }: StatCardProps) {
  return (
    <View style={[styles.statCard, rtl && styles.statCardRTL]}>
      <View style={[styles.statIcon, { backgroundColor: accent + '22' }]}>
        <Ionicons name={icon as any} size={22} color={accent} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={[styles.statLabel, rtl && styles.textRTL]}>{label}</Text>
    </View>
  );
}

interface ActionRowProps {
  icon: string;
  label: string;
  onPress: () => void;
  rtl: boolean;
}

function ActionRow({ icon, label, onPress, rtl }: ActionRowProps) {
  return (
    <TouchableOpacity
      style={[styles.actionRow, rtl && styles.actionRowRTL]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.actionIcon}>
        <Ionicons name={icon as any} size={20} color={colors.primary.main} />
      </View>
      <Text style={[styles.actionLabel, rtl && styles.actionLabelRTL]}>{label}</Text>
      <Ionicons
        name={rtl ? 'chevron-back' : 'chevron-forward'}
        size={18}
        color={colors.neutral.textTertiary}
      />
    </TouchableOpacity>
  );
}

export default function TheaterDashboardScreen() {
  const insets = useSafeAreaInsets();
  const { userProfile } = useAuth();
  const { t, i18n } = useTranslation();
  const rtl = i18n.language === 'he';

  const theaterName = userProfile?.theaterId ?? '';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={['rgba(168,85,247,0.18)', 'transparent']}
        style={styles.headerGradient}
        pointerEvents="none"
      />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, rtl && styles.headerRTL]}>
          <View style={[styles.theaterBadge, rtl && styles.theaterBadgeRTL]}>
            <Ionicons name="business" size={16} color={colors.primary.main} />
            <Text style={styles.theaterBadgeText}>{t('theaterDashboard.theaterAccount')}</Text>
          </View>
          {theaterName ? (
            <Text style={[styles.title, rtl && styles.textRTL]}>{theaterName}</Text>
          ) : null}
          <Text style={[styles.subtitle, rtl && styles.textRTL]}>
            {t('theaterDashboard.managementDashboard')}
          </Text>
        </View>

        {/* Stats */}
        <View style={[styles.statsGrid, rtl && styles.statsGridRTL]}>
          <StatCard rtl={rtl} icon="ticket-outline"      label={t('theaterDashboard.stats.activeShows')}  value="—" />
          <StatCard rtl={rtl} icon="people-outline"      label={t('theaterDashboard.stats.thisMonth')}     value="—" accent={colors.secondary.main} />
          <StatCard rtl={rtl} icon="star-outline"        label={t('theaterDashboard.stats.avgRating')}     value="—" accent="#F59E0B" />
          <StatCard rtl={rtl} icon="trending-up-outline" label={t('theaterDashboard.stats.soldThisWeek')}  value="—" accent="#10B981" />
        </View>

        {/* Manage */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, rtl && styles.textRTL]}>{t('theaterDashboard.manage')}</Text>
          <View style={styles.card}>
            <ActionRow rtl={rtl} icon="add-circle-outline" label={t('theaterDashboard.addNewShow')}       onPress={() => {}} />
            <View style={styles.divider} />
            <ActionRow rtl={rtl} icon="list-outline"        label={t('theaterDashboard.myShows')}          onPress={() => {}} />
            <View style={styles.divider} />
            <ActionRow rtl={rtl} icon="calendar-outline"    label={t('theaterDashboard.scheduleAndDates')} onPress={() => {}} />
            <View style={styles.divider} />
            <ActionRow rtl={rtl} icon="image-outline"       label={t('theaterDashboard.mediaAndGallery')}  onPress={() => {}} />
          </View>
        </View>

        {/* Analytics */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, rtl && styles.textRTL]}>{t('theaterDashboard.analytics')}</Text>
          <View style={styles.card}>
            <ActionRow rtl={rtl} icon="bar-chart-outline" label={t('theaterDashboard.salesReport')}         onPress={() => {}} />
            <View style={styles.divider} />
            <ActionRow rtl={rtl} icon="eye-outline"       label={t('theaterDashboard.viewsAndImpressions')} onPress={() => {}} />
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, rtl && styles.textRTL]}>{t('theaterDashboard.settings')}</Text>
          <View style={styles.card}>
            <ActionRow rtl={rtl} icon="business-outline"      label={t('theaterDashboard.theaterProfile')} onPress={() => {}} />
            <View style={styles.divider} />
            <ActionRow rtl={rtl} icon="notifications-outline" label={t('theaterDashboard.notifications')}  onPress={() => {}} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.background,
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 220,
  },
  scroll: {
    paddingHorizontal: spacing.lg,
  },
  header: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    alignItems: 'flex-start',
  },
  headerRTL: {
    alignItems: 'flex-end',
  },
  theaterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary.main + '22',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary.main + '44',
  },
  theaterBadgeRTL: {
    flexDirection: 'row-reverse',
    alignSelf: 'flex-end',
  },
  theaterBadgeText: {
    ...typography.labelSmall,
    color: colors.primary.main,
    fontWeight: '600',
  },
  title: {
    ...typography.headingLarge,
    color: colors.neutral.text,
    textTransform: 'capitalize',
  },
  subtitle: {
    ...typography.bodyMedium,
    color: colors.neutral.textSecondary,
    marginTop: spacing.xs,
  },
  textRTL: {
    textAlign: 'right',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  statsGridRTL: {
    flexDirection: 'row-reverse',
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.dark[700],
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.dark[500],
    alignItems: 'flex-start',
    gap: spacing.xs,
  },
  statCardRTL: {
    alignItems: 'flex-end',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  statValue: {
    ...typography.headingMedium,
    color: colors.neutral.text,
  },
  statLabel: {
    ...typography.caption,
    color: colors.neutral.textTertiary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.labelSmall,
    color: colors.neutral.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
    marginStart: spacing.xs,
  },
  card: {
    backgroundColor: colors.dark[700],
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.dark[500],
    overflow: 'hidden',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  actionRowRTL: {
    flexDirection: 'row-reverse',
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primary.main + '18',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    ...typography.bodyMedium,
    color: colors.neutral.text,
    flex: 1,
  },
  actionLabelRTL: {
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: colors.dark[500],
    marginHorizontal: spacing.md,
  },
});
