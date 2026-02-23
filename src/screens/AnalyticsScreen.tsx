// ============================================
// ShowME App - Analytics/Stats Screen
// ============================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing } from '../theme/theme';
import { currentUser } from '../data/user';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock analytics data
const ANALYTICS_DATA = {
  totalShows: 24,
  totalSpent: 4850,
  avgRating: 4.6,
  reviewsWritten: 8,
  thisYear: 12,
  lastYear: 10,
  favoriteTheater: 'Habima Theatre',
  favoriteGenre: 'Musical',
  totalHours: 48,
  showsThisMonth: 2,
};

const MONTHLY_SHOWS = [
  { month: 'Jan', count: 2 },
  { month: 'Feb', count: 1 },
  { month: 'Mar', count: 3 },
  { month: 'Apr', count: 1 },
  { month: 'May', count: 2 },
  { month: 'Jun', count: 0 },
  { month: 'Jul', count: 1 },
  { month: 'Aug', count: 2 },
  { month: 'Sep', count: 1 },
  { month: 'Oct', count: 2 },
  { month: 'Nov', count: 3 },
  { month: 'Dec', count: 2 },
];

const GENRE_BREAKDOWN = [
  { genre: 'Musical', percentage: 40, color: colors.primary.main },
  { genre: 'Drama', percentage: 25, color: colors.secondary.main },
  { genre: 'Comedy', percentage: 20, color: colors.accent.main },
  { genre: 'Other', percentage: 15, color: colors.semantic.warning },
];

const RECENT_ACTIVITY = [
  { id: '1', show: 'The Phantom of the Opera', date: '2025-12-20', rating: 5 },
  { id: '2', show: 'Romeo and Juliet', date: '2025-12-05', rating: 4 },
  { id: '3', show: 'Les Misérables', date: '2025-11-18', rating: 5 },
  { id: '4', show: 'Fiddler on the Roof', date: '2025-11-02', rating: 4 },
];

export default function AnalyticsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [selectedPeriod, setSelectedPeriod] = useState<'year' | 'all'>('year');

  const maxMonthlyCount = Math.max(...MONTHLY_SHOWS.map(m => m.count));

  const renderStatCard = (
    icon: keyof typeof Ionicons.glyphMap,
    label: string,
    value: string | number,
    color: string,
    suffix?: string
  ) => (
    <View style={styles.statCard}>
      <LinearGradient
        colors={[`${color}30`, `${color}10`]}
        style={styles.statIconBg}
      >
        <Ionicons name={icon} size={22} color={color} />
      </LinearGradient>
      <Text style={styles.statValue}>
        {value}{suffix}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.neutral.background} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.neutral.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('analytics.title', { defaultValue: 'My Stats' })}</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color={colors.neutral.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Stats */}
        <LinearGradient
          colors={[colors.primary.main, colors.secondary.main]}
          style={styles.heroCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.heroContent}>
            <Text style={styles.heroLabel}>Total Shows Attended</Text>
            <Text style={styles.heroValue}>{ANALYTICS_DATA.totalShows}</Text>
            <View style={styles.heroSubtext}>
              <Ionicons name="trending-up" size={16} color="rgba(255,255,255,0.8)" />
              <Text style={styles.heroSubtextText}>
                +{ANALYTICS_DATA.thisYear - ANALYTICS_DATA.lastYear} from last year
              </Text>
            </View>
          </View>
          <View style={styles.heroIcon}>
            <Ionicons name="ticket" size={60} color="rgba(255,255,255,0.2)" />
          </View>
        </LinearGradient>

        {/* Quick Stats Grid */}
        <View style={styles.statsGrid}>
          {renderStatCard('cash', 'Total Spent', `₪${ANALYTICS_DATA.totalSpent.toLocaleString()}`, colors.semantic.success)}
          {renderStatCard('star', 'Avg Rating', ANALYTICS_DATA.avgRating, colors.accent.main)}
          {renderStatCard('time', 'Hours Watched', ANALYTICS_DATA.totalHours, colors.primary.main, 'h')}
          {renderStatCard('create', 'Reviews', ANALYTICS_DATA.reviewsWritten, colors.secondary.main)}
        </View>

        {/* Period Toggle */}
        <View style={styles.periodToggle}>
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === 'year' && styles.periodButtonActive]}
            onPress={() => setSelectedPeriod('year')}
          >
            <Text style={[styles.periodButtonText, selectedPeriod === 'year' && styles.periodButtonTextActive]}>
              This Year
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === 'all' && styles.periodButtonActive]}
            onPress={() => setSelectedPeriod('all')}
          >
            <Text style={[styles.periodButtonText, selectedPeriod === 'all' && styles.periodButtonTextActive]}>
              All Time
            </Text>
          </TouchableOpacity>
        </View>

        {/* Monthly Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Shows Per Month</Text>
          <View style={styles.chart}>
            {MONTHLY_SHOWS.map((item, index) => (
              <View key={index} style={styles.chartBar}>
                <View style={styles.chartBarContainer}>
                  <LinearGradient
                    colors={[colors.primary.main, colors.secondary.main]}
                    style={[
                      styles.chartBarFill,
                      { height: item.count > 0 ? `${(item.count / maxMonthlyCount) * 100}%` : 4 }
                    ]}
                  />
                </View>
                <Text style={styles.chartBarLabel}>{item.month}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Genre Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Genre Preferences</Text>
          <View style={styles.genreCard}>
            {/* Progress Bars */}
            {GENRE_BREAKDOWN.map((item, index) => (
              <View key={index} style={styles.genreItem}>
                <View style={styles.genreHeader}>
                  <Text style={styles.genreName}>{item.genre}</Text>
                  <Text style={styles.genrePercent}>{item.percentage}%</Text>
                </View>
                <View style={styles.genreBarBg}>
                  <View 
                    style={[
                      styles.genreBarFill, 
                      { width: `${item.percentage}%`, backgroundColor: item.color }
                    ]} 
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Favorites */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Favorites</Text>
          <View style={styles.favoritesRow}>
            <View style={styles.favoriteCard}>
              <View style={[styles.favoriteIcon, { backgroundColor: 'rgba(168, 85, 247, 0.2)' }]}>
                <Ionicons name="business" size={24} color={colors.primary.main} />
              </View>
              <Text style={styles.favoriteLabel}>Top Theater</Text>
              <Text style={styles.favoriteValue}>{ANALYTICS_DATA.favoriteTheater}</Text>
            </View>
            <View style={styles.favoriteCard}>
              <View style={[styles.favoriteIcon, { backgroundColor: 'rgba(236, 72, 153, 0.2)' }]}>
                <Ionicons name="musical-notes" size={24} color={colors.secondary.main} />
              </View>
              <Text style={styles.favoriteLabel}>Top Genre</Text>
              <Text style={styles.favoriteValue}>{ANALYTICS_DATA.favoriteGenre}</Text>
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Shows</Text>
          {RECENT_ACTIVITY.map((item) => (
            <View key={item.id} style={styles.activityItem}>
              <View style={styles.activityDot} />
              <View style={styles.activityContent}>
                <Text style={styles.activityShow}>{item.show}</Text>
                <Text style={styles.activityDate}>{new Date(item.date).toLocaleDateString()}</Text>
              </View>
              <View style={styles.activityRating}>
                {[...Array(5)].map((_, i) => (
                  <Ionicons
                    key={i}
                    name={i < item.rating ? 'star' : 'star-outline'}
                    size={14}
                    color={i < item.rating ? colors.accent.main : colors.neutral.textTertiary}
                  />
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Achievements Preview */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.achievementsRow}>
              <View style={styles.achievementBadge}>
                <LinearGradient
                  colors={['#FFD700', '#FFA500']}
                  style={styles.achievementIcon}
                >
                  <Ionicons name="ribbon" size={24} color="#FFF" />
                </LinearGradient>
                <Text style={styles.achievementName}>First Show</Text>
              </View>
              <View style={styles.achievementBadge}>
                <LinearGradient
                  colors={[colors.primary.main, colors.primary.dark]}
                  style={styles.achievementIcon}
                >
                  <Ionicons name="star" size={24} color="#FFF" />
                </LinearGradient>
                <Text style={styles.achievementName}>5 Reviews</Text>
              </View>
              <View style={styles.achievementBadge}>
                <LinearGradient
                  colors={[colors.secondary.main, '#DB2777']}
                  style={styles.achievementIcon}
                >
                  <Ionicons name="heart" size={24} color="#FFF" />
                </LinearGradient>
                <Text style={styles.achievementName}>Theater Lover</Text>
              </View>
              <View style={[styles.achievementBadge, styles.achievementLocked]}>
                <View style={styles.achievementIconLocked}>
                  <Ionicons name="lock-closed" size={24} color={colors.neutral.textTertiary} />
                </View>
                <Text style={styles.achievementNameLocked}>VIP Status</Text>
              </View>
            </View>
          </ScrollView>
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
  shareButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  heroCard: {
    borderRadius: 20,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
  },
  heroContent: {},
  heroLabel: {
    ...typography.bodyMedium,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: spacing.xs,
  },
  heroValue: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.neutral.white,
  },
  heroSubtext: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  heroSubtextText: {
    ...typography.bodySmall,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  heroIcon: {
    position: 'absolute',
    right: -10,
    bottom: -10,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    width: (SCREEN_WIDTH - spacing.lg * 2 - spacing.md) / 2,
    backgroundColor: colors.dark[700],
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  statIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    ...typography.headingMedium,
    color: colors.neutral.text,
  },
  statLabel: {
    ...typography.bodySmall,
    color: colors.neutral.textTertiary,
    marginTop: spacing.xxs,
  },
  periodToggle: {
    flexDirection: 'row',
    backgroundColor: colors.dark[700],
    borderRadius: 12,
    padding: 4,
    marginBottom: spacing.xl,
  },
  periodButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: 10,
  },
  periodButtonActive: {
    backgroundColor: colors.primary.main,
  },
  periodButtonText: {
    ...typography.labelMedium,
    color: colors.neutral.textSecondary,
  },
  periodButtonTextActive: {
    color: colors.neutral.white,
  },
  chartSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.headingSmall,
    color: colors.neutral.text,
    marginBottom: spacing.md,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
    backgroundColor: colors.dark[700],
    borderRadius: 16,
    padding: spacing.md,
    paddingBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
  },
  chartBarContainer: {
    flex: 1,
    width: 16,
    justifyContent: 'flex-end',
    marginBottom: spacing.xs,
  },
  chartBarFill: {
    width: '100%',
    borderRadius: 4,
    minHeight: 4,
  },
  chartBarLabel: {
    ...typography.caption,
    color: colors.neutral.textTertiary,
    fontSize: 10,
  },
  section: {
    marginBottom: spacing.xl,
  },
  genreCard: {
    backgroundColor: colors.dark[700],
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  genreItem: {
    marginBottom: spacing.md,
  },
  genreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  genreName: {
    ...typography.bodyMedium,
    color: colors.neutral.text,
  },
  genrePercent: {
    ...typography.labelMedium,
    color: colors.neutral.textSecondary,
  },
  genreBarBg: {
    height: 8,
    backgroundColor: colors.dark[500],
    borderRadius: 4,
    overflow: 'hidden',
  },
  genreBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  favoritesRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  favoriteCard: {
    flex: 1,
    backgroundColor: colors.dark[700],
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  favoriteIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  favoriteLabel: {
    ...typography.caption,
    color: colors.neutral.textTertiary,
    marginBottom: spacing.xxs,
  },
  favoriteValue: {
    ...typography.labelMedium,
    color: colors.neutral.text,
    textAlign: 'center',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark[700],
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary.main,
    marginEnd: spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityShow: {
    ...typography.labelMedium,
    color: colors.neutral.text,
  },
  activityDate: {
    ...typography.caption,
    color: colors.neutral.textTertiary,
    marginTop: spacing.xxs,
  },
  activityRating: {
    flexDirection: 'row',
    gap: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  seeAllText: {
    ...typography.labelMedium,
    color: colors.primary.main,
  },
  achievementsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  achievementBadge: {
    alignItems: 'center',
    width: 80,
  },
  achievementIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  achievementIconLocked: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    backgroundColor: colors.dark[600],
    borderWidth: 2,
    borderColor: colors.dark[500],
    borderStyle: 'dashed',
  },
  achievementName: {
    ...typography.caption,
    color: colors.neutral.text,
    textAlign: 'center',
  },
  achievementNameLocked: {
    ...typography.caption,
    color: colors.neutral.textTertiary,
    textAlign: 'center',
  },
  achievementLocked: {
    opacity: 0.5,
  },
});
