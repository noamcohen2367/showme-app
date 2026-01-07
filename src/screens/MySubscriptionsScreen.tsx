// ============================================
// ShowME App - My Subscriptions Screen (Dark Aurora Theme)
// ============================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing } from '../theme/theme';
import { userSubscriptions } from '../data/user';
import { getTheaterById } from '../data/theaters';

type TabType = 'active' | 'expired';

export default function MySubscriptionsScreen() {
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const isHebrew = i18n.language === 'he';

  const [activeTab, setActiveTab] = useState<TabType>('active');

  const activeSubscriptions = userSubscriptions.filter(s => s.status === 'active');
  const expiredSubscriptions = userSubscriptions.filter(s => s.status === 'expired');

  const subscriptions = activeTab === 'active' ? activeSubscriptions : expiredSubscriptions;

  const getDaysRemaining = (validUntil: string): number => {
    const endDate = new Date(validUntil);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getUsagePercentage = (used: number, total: number): number => {
    return Math.round(((total - used) / total) * 100);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.neutral.background} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={styles.title}>{t('subscriptions.title')}</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.tabActive]}
          onPress={() => setActiveTab('active')}
        >
          {activeTab === 'active' && (
            <LinearGradient
              colors={[colors.primary.main, colors.secondary.main]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          )}
          <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>
            {t('subscriptions.active')} ({activeSubscriptions.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'expired' && styles.tabActive]}
          onPress={() => setActiveTab('expired')}
        >
          {activeTab === 'expired' && (
            <LinearGradient
              colors={[colors.primary.main, colors.secondary.main]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          )}
          <Text style={[styles.tabText, activeTab === 'expired' && styles.tabTextActive]}>
            {t('subscriptions.expired')} ({expiredSubscriptions.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {subscriptions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Ionicons 
                name={activeTab === 'active' ? 'card-outline' : 'time-outline'} 
                size={48} 
                color={colors.neutral.textTertiary} 
              />
            </View>
            <Text style={styles.emptyTitle}>
              {activeTab === 'active' ? t('subscriptions.noActive') : t('subscriptions.noExpired')}
            </Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'active' ? t('subscriptions.noActiveDesc') : t('subscriptions.noExpiredDesc')}
            </Text>
            {activeTab === 'active' && (
              <TouchableOpacity style={styles.browseButton}>
                <LinearGradient
                  colors={[colors.primary.main, colors.primary.dark]}
                  style={styles.browseButtonGradient}
                >
                  <Text style={styles.browseButtonText}>{t('subscriptions.browseTheaters')}</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          subscriptions.map((subscription) => {
            const theater = getTheaterById(subscription.theaterId);
            if (!theater) return null;

            const theaterName = isHebrew ? theater.nameHe : theater.name;
            const daysRemaining = getDaysRemaining(subscription.validUntil);
            const usagePercentage = getUsagePercentage(
              subscription.remainingTickets,
              subscription.totalTickets
            );
            const isActive = subscription.status === 'active';
            const isLowTickets = subscription.remainingTickets <= 2;
            const isExpiringSoon = daysRemaining <= 30 && daysRemaining > 0;

            return (
              <TouchableOpacity 
                key={subscription.id} 
                style={styles.subscriptionCard}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={isActive 
                    ? ['rgba(168, 85, 247, 0.1)', 'rgba(236, 72, 153, 0.05)']
                    : [colors.dark[700], colors.dark[700]]
                  }
                  style={styles.cardGradient}
                >
                  {/* Card Header */}
                  <View style={styles.cardHeader}>
                    <Image 
                      source={{ uri: theater.imageUrl }} 
                      style={styles.theaterImage}
                    />
                    <View style={styles.headerInfo}>
                      <Text style={styles.theaterName}>{theaterName}</Text>
                      <Text style={styles.subscriptionType}>{subscription.subscriptionType}</Text>
                    </View>
                    <View style={[
                      styles.statusBadge,
                      isActive ? styles.statusBadgeActive : styles.statusBadgeExpired,
                    ]}>
                      <Text style={[
                        styles.statusText,
                        isActive ? styles.statusTextActive : styles.statusTextExpired,
                      ]}>
                        {isActive ? t('subscriptions.active') : t('subscriptions.expired')}
                      </Text>
                    </View>
                  </View>

                  {/* Tickets Progress */}
                  <View style={styles.ticketsSection}>
                    <View style={styles.ticketsHeader}>
                      <Text style={styles.ticketsLabel}>{t('subscriptions.ticketsRemaining')}</Text>
                      <Text style={[
                        styles.ticketsCount,
                        isLowTickets && isActive && styles.ticketsCountLow,
                      ]}>
                        {subscription.remainingTickets}/{subscription.totalTickets}
                      </Text>
                    </View>
                    <View style={styles.progressBar}>
                      <LinearGradient
                        colors={isLowTickets && isActive 
                          ? [colors.semantic.warning, colors.semantic.error]
                          : [colors.primary.main, colors.secondary.main]
                        }
                        style={[
                          styles.progressFill,
                          { width: `${100 - usagePercentage}%` }
                        ]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      />
                    </View>
                    {isLowTickets && isActive && (
                      <View style={styles.warningRow}>
                        <Ionicons name="warning" size={14} color={colors.semantic.warning} />
                        <Text style={styles.warningText}>{t('subscriptions.lowTickets')}</Text>
                      </View>
                    )}
                  </View>

                  {/* Validity */}
                  <View style={styles.validitySection}>
                    <View style={styles.validityRow}>
                      <Ionicons name="calendar-outline" size={16} color={colors.neutral.textSecondary} />
                      <Text style={styles.validityText}>
                        {isActive 
                          ? `${t('subscriptions.validUntil')}: ${new Date(subscription.validUntil).toLocaleDateString(isHebrew ? 'he-IL' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}`
                          : `${t('subscriptions.expiredOn')}: ${new Date(subscription.validUntil).toLocaleDateString(isHebrew ? 'he-IL' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}`
                        }
                      </Text>
                    </View>
                    {isExpiringSoon && isActive && (
                      <View style={styles.expiringBadge}>
                        <Ionicons name="time" size={12} color={colors.semantic.warning} />
                        <Text style={styles.expiringText}>
                          {daysRemaining} {t('subscriptions.daysLeft')}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Subscription Code */}
                  <View style={styles.codeSection}>
                    <Text style={styles.codeLabel}>{t('subscriptions.code')}</Text>
                    <Text style={styles.codeValue}>{subscription.subscriptionCode}</Text>
                  </View>

                  {/* Actions */}
                  {isActive && (
                    <View style={styles.actionsRow}>
                      <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="ticket-outline" size={18} color={colors.primary.main} />
                        <Text style={styles.actionText}>{t('subscriptions.useTicket')}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="refresh-outline" size={18} color={colors.primary.main} />
                        <Text style={styles.actionText}>{t('subscriptions.renew')}</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {!isActive && (
                    <TouchableOpacity style={styles.renewButton}>
                      <LinearGradient
                        colors={[colors.primary.main, colors.primary.dark]}
                        style={styles.renewButtonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        <Text style={styles.renewButtonText}>{t('subscriptions.renewNow')}</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            );
          })
        )}

        {/* Benefits Section */}
        {activeTab === 'active' && activeSubscriptions.length > 0 && (
          <View style={styles.benefitsSection}>
            <Text style={styles.benefitsTitle}>{t('subscriptions.yourBenefits')}</Text>
            <View style={styles.benefitsGrid}>
              <View style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  <Ionicons name="pricetag" size={20} color={colors.primary.main} />
                </View>
                <Text style={styles.benefitText}>{t('subscriptions.benefit1')}</Text>
              </View>
              <View style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  <Ionicons name="flash" size={20} color={colors.secondary.main} />
                </View>
                <Text style={styles.benefitText}>{t('subscriptions.benefit2')}</Text>
              </View>
              <View style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  <Ionicons name="star" size={20} color={colors.accent.main} />
                </View>
                <Text style={styles.benefitText}>{t('subscriptions.benefit3')}</Text>
              </View>
            </View>
          </View>
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
  subscriptionCard: {
    borderRadius: 16,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.dark[500],
    borderRadius: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  theaterImage: {
    width: 50,
    height: 50,
    borderRadius: 12,
    marginRight: spacing.md,
  },
  headerInfo: {
    flex: 1,
  },
  theaterName: {
    ...typography.labelLarge,
    color: colors.neutral.text,
  },
  subscriptionType: {
    ...typography.bodySmall,
    color: colors.neutral.textSecondary,
    marginTop: spacing.xxs,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: 12,
  },
  statusBadgeActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  statusBadgeExpired: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  statusText: {
    ...typography.labelSmall,
  },
  statusTextActive: {
    color: colors.semantic.success,
  },
  statusTextExpired: {
    color: colors.semantic.error,
  },
  ticketsSection: {
    marginBottom: spacing.lg,
  },
  ticketsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  ticketsLabel: {
    ...typography.bodySmall,
    color: colors.neutral.textSecondary,
  },
  ticketsCount: {
    ...typography.labelLarge,
    color: colors.neutral.text,
  },
  ticketsCountLow: {
    color: colors.semantic.warning,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.dark[600],
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  warningText: {
    ...typography.bodySmall,
    color: colors.semantic.warning,
    marginLeft: spacing.xs,
  },
  validitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  validityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  validityText: {
    ...typography.bodySmall,
    color: colors.neutral.textSecondary,
    marginLeft: spacing.xs,
  },
  expiringBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: 12,
  },
  expiringText: {
    ...typography.labelSmall,
    color: colors.semantic.warning,
    marginLeft: spacing.xxs,
  },
  codeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.dark[500],
    marginBottom: spacing.md,
  },
  codeLabel: {
    ...typography.bodySmall,
    color: colors.neutral.textTertiary,
  },
  codeValue: {
    ...typography.labelMedium,
    color: colors.primary.main,
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    paddingVertical: spacing.sm,
    borderRadius: 10,
    gap: spacing.xs,
  },
  actionText: {
    ...typography.labelMedium,
    color: colors.primary.main,
  },
  renewButton: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  renewButtonGradient: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  renewButtonText: {
    ...typography.labelMedium,
    color: colors.neutral.white,
  },
  benefitsSection: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.dark[700],
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  benefitsTitle: {
    ...typography.headingSmall,
    color: colors.neutral.text,
    marginBottom: spacing.lg,
  },
  benefitsGrid: {
    gap: spacing.md,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  benefitText: {
    ...typography.bodyMedium,
    color: colors.neutral.text,
    flex: 1,
  },
});
