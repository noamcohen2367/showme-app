// ============================================
// ShowME App - My Performances Screen (Dark Aurora Theme)
// ============================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { getAppWidth } from '../utils/dimensions';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing } from '../theme/theme';
import { RootStackParamList } from '../types/types';
import { userPerformances } from '../data/user';
import { getShowById } from '../data/shows';
import { getTheaterById } from '../data/theaters';

const SCREEN_WIDTH = getAppWidth();

type MyPerformancesNavigationProp = NativeStackNavigationProp<RootStackParamList>;

type TabType = 'upcoming' | 'past';

export default function MyPerformancesScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<MyPerformancesNavigationProp>();
  const insets = useSafeAreaInsets();
  const isHebrew = i18n.language === 'he';

  const [activeTab, setActiveTab] = useState<TabType>('upcoming');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingPerformances = userPerformances.filter(p => new Date(p.date) >= today);
  const pastPerformances = userPerformances.filter(p => new Date(p.date) < today);

  const performances = activeTab === 'upcoming' ? upcomingPerformances : pastPerformances;

  const getDaysUntil = (date: string): number => {
    const performanceDate = new Date(date);
    const diffTime = performanceDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getCountdownText = (date: string): string => {
    const days = getDaysUntil(date);
    if (days === 0) return t('performances.today');
    if (days === 1) return t('performances.tomorrow');
    if (days < 7) return t('performances.daysUntil', { days });
    return new Date(date).toLocaleDateString(isHebrew ? 'he-IL' : 'en-US', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.neutral.background} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={styles.title}>{t('performances.title')}</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.tabActive]}
          onPress={() => setActiveTab('upcoming')}
        >
          {activeTab === 'upcoming' && (
            <LinearGradient
              colors={[colors.primary.main, colors.secondary.main]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          )}
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.tabTextActive]}>
            {t('performances.upcoming')} ({upcomingPerformances.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.tabActive]}
          onPress={() => setActiveTab('past')}
        >
          {activeTab === 'past' && (
            <LinearGradient
              colors={[colors.primary.main, colors.secondary.main]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          )}
          <Text style={[styles.tabText, activeTab === 'past' && styles.tabTextActive]}>
            {t('performances.past')} ({pastPerformances.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {performances.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Ionicons 
                name={activeTab === 'upcoming' ? 'ticket-outline' : 'time-outline'} 
                size={48} 
                color={colors.neutral.textTertiary} 
              />
            </View>
            <Text style={styles.emptyTitle}>
              {activeTab === 'upcoming' ? t('performances.noUpcoming') : t('performances.noPast')}
            </Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'upcoming' ? t('performances.noUpcomingDesc') : t('performances.noPastDesc')}
            </Text>
            {activeTab === 'upcoming' && (
              <TouchableOpacity 
                style={styles.browseButton}
                onPress={() => navigation.navigate('MainTabs', { screen: 'Search' })}
              >
                <LinearGradient
                  colors={[colors.primary.main, colors.primary.dark]}
                  style={styles.browseButtonGradient}
                >
                  <Text style={styles.browseButtonText}>{t('performances.browseShows')}</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          performances.map((performance) => {
            const show = getShowById(performance.showId);
            const theater = show ? getTheaterById(show.theaterId) : null;
            if (!show || !theater) return null;

            const showTitle = isHebrew ? show.titleHe : show.title;
            const theaterName = isHebrew ? theater.nameHe : theater.name;
            const isUpcoming = activeTab === 'upcoming';
            const daysUntil = getDaysUntil(performance.date);

            return (
              <TouchableOpacity 
                key={performance.id} 
                style={styles.ticketCard}
                onPress={() => navigation.navigate('TicketDetail', { performanceId: performance.id })}
                activeOpacity={0.9}
              >
                {/* Ticket Top */}
                <View style={styles.ticketTop}>
                  <Image source={{ uri: show.imageUrl }} style={styles.ticketImage} contentFit="cover" transition={300} />
                  <LinearGradient
                    colors={['transparent', 'rgba(10, 10, 15, 0.9)']}
                    style={styles.ticketImageGradient}
                  />
                  
                  {/* Countdown Badge */}
                  {isUpcoming && (
                    <View style={[
                      styles.countdownBadge,
                      daysUntil <= 3 && styles.countdownBadgeUrgent,
                    ]}>
                      {daysUntil <= 3 && (
                        <Ionicons name="time" size={12} color={colors.semantic.warning} />
                      )}
                      <Text style={[
                        styles.countdownText,
                        daysUntil <= 3 && styles.countdownTextUrgent,
                      ]}>
                        {getCountdownText(performance.date)}
                      </Text>
                    </View>
                  )}

                  {/* Past Badge */}
                  {!isUpcoming && (
                    <View style={styles.pastBadge}>
                      <Ionicons name="checkmark-circle" size={14} color={colors.semantic.success} />
                      <Text style={styles.pastText}>{t('performances.attended')}</Text>
                    </View>
                  )}

                  <View style={styles.ticketTopContent}>
                    <Text style={styles.ticketTitle} numberOfLines={2}>{showTitle}</Text>
                    <View style={styles.ticketVenue}>
                      <Ionicons name="location" size={14} color={colors.neutral.textSecondary} />
                      <Text style={styles.ticketVenueText}>{theaterName}</Text>
                    </View>
                  </View>
                </View>

                {/* Ticket Divider */}
                <View style={styles.ticketDivider}>
                  <View style={styles.dividerCircleLeft} />
                  <View style={styles.dividerLine} />
                  <View style={styles.dividerCircleRight} />
                </View>

                {/* Ticket Bottom */}
                <View style={styles.ticketBottom}>
                  <View style={styles.ticketInfo}>
                    <View style={styles.ticketInfoItem}>
                      <Ionicons name="calendar-outline" size={16} color={colors.primary.main} />
                      <Text style={styles.ticketInfoText}>
                        {new Date(performance.date).toLocaleDateString(isHebrew ? 'he-IL' : 'en-US', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                        })}
                      </Text>
                    </View>
                    <View style={styles.ticketInfoItem}>
                      <Ionicons name="time-outline" size={16} color={colors.primary.main} />
                      <Text style={styles.ticketInfoText}>{performance.time}</Text>
                    </View>
                    <View style={styles.ticketInfoItem}>
                      <Ionicons name="people-outline" size={16} color={colors.primary.main} />
                      <Text style={styles.ticketInfoText}>
                        {performance.seats.length} {t('performances.tickets')}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.ticketAction}>
                    <Text style={styles.viewTicketText}>
                      {isUpcoming ? t('performances.viewTicket') : t('performances.viewDetails')}
                    </Text>
                    <Ionicons name="chevron-forward" size={16} color={colors.primary.main} />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}

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
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.displaySmall,
    color: colors.neutral.text,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    backgroundColor: colors.dark[700],
    borderRadius: 12,
    padding: spacing.xxs,
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  tabActive: {
    backgroundColor: 'transparent',
  },
  tabText: {
    ...typography.labelMedium,
    color: colors.neutral.textSecondary,
  },
  tabTextActive: {
    color: colors.neutral.white,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.dark[700],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    ...typography.headingMedium,
    color: colors.neutral.text,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    ...typography.bodyMedium,
    color: colors.neutral.textTertiary,
    textAlign: 'center',
    maxWidth: 250,
  },
  browseButton: {
    marginTop: spacing.xl,
    borderRadius: 12,
    overflow: 'hidden',
  },
  browseButtonGradient: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
  },
  browseButtonText: {
    ...typography.labelLarge,
    color: colors.neutral.white,
  },
  ticketCard: {
    backgroundColor: colors.dark[700],
    borderRadius: 16,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  ticketTop: {
    height: 160,
    position: 'relative',
  },
  ticketImage: {
    width: '100%',
    height: '100%',
  },
  ticketImageGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  countdownBadge: {
    position: 'absolute',
    top: spacing.md,
    end: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: 12,
    gap: spacing.xxs,
  },
  countdownBadgeUrgent: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  countdownText: {
    ...typography.labelSmall,
    color: colors.neutral.white,
  },
  countdownTextUrgent: {
    color: colors.semantic.warning,
  },
  pastBadge: {
    position: 'absolute',
    top: spacing.md,
    end: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: 12,
    gap: spacing.xxs,
  },
  pastText: {
    ...typography.labelSmall,
    color: colors.semantic.success,
  },
  ticketTopContent: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
    right: spacing.md,
  },
  ticketTitle: {
    ...typography.headingSmall,
    color: colors.neutral.white,
    marginBottom: spacing.xxs,
  },
  ticketVenue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ticketVenueText: {
    ...typography.bodySmall,
    color: colors.neutral.textSecondary,
    marginStart: spacing.xxs,
  },
  ticketDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
    backgroundColor: colors.dark[700],
  },
  dividerCircleLeft: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.neutral.background,
    marginStart: -10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.dark[500],
    marginHorizontal: spacing.sm,
  },
  dividerCircleRight: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.neutral.background,
    marginEnd: -10,
  },
  ticketBottom: {
    padding: spacing.md,
  },
  ticketInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  ticketInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ticketInfoText: {
    ...typography.labelSmall,
    color: colors.neutral.text,
    marginStart: spacing.xxs,
  },
  ticketAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.dark[500],
  },
  viewTicketText: {
    ...typography.labelMedium,
    color: colors.primary.main,
  },
});
