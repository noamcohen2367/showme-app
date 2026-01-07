// ============================================
// ShowME App - Rewards Screen
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

interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  icon: keyof typeof Ionicons.glyphMap;
  category: 'discount' | 'upgrade' | 'exclusive' | 'merchandise';
  available: boolean;
}

const REWARDS: Reward[] = [
  {
    id: '1',
    title: '10% Off Next Ticket',
    description: 'Get 10% discount on your next ticket purchase',
    pointsCost: 500,
    icon: 'pricetag',
    category: 'discount',
    available: true,
  },
  {
    id: '2',
    title: 'Free Seat Upgrade',
    description: 'Upgrade to better seats at no extra cost',
    pointsCost: 1000,
    icon: 'arrow-up-circle',
    category: 'upgrade',
    available: true,
  },
  {
    id: '3',
    title: 'VIP Lounge Access',
    description: 'Access to exclusive VIP lounge before the show',
    pointsCost: 1500,
    icon: 'star',
    category: 'exclusive',
    available: true,
  },
  {
    id: '4',
    title: 'Backstage Tour',
    description: 'Exclusive backstage tour after the performance',
    pointsCost: 3000,
    icon: 'walk',
    category: 'exclusive',
    available: false,
  },
  {
    id: '5',
    title: 'Free Drink Voucher',
    description: 'One complimentary drink at the theater bar',
    pointsCost: 300,
    icon: 'wine',
    category: 'merchandise',
    available: true,
  },
  {
    id: '6',
    title: 'Show Program Book',
    description: 'Free collector\'s edition program book',
    pointsCost: 400,
    icon: 'book',
    category: 'merchandise',
    available: true,
  },
  {
    id: '7',
    title: 'Meet & Greet',
    description: 'Meet the cast after a selected performance',
    pointsCost: 5000,
    icon: 'people',
    category: 'exclusive',
    available: false,
  },
  {
    id: '8',
    title: '25% Off Season Pass',
    description: 'Big discount on theater season subscriptions',
    pointsCost: 2500,
    icon: 'card',
    category: 'discount',
    available: true,
  },
];

const CATEGORY_COLORS: Record<Reward['category'], string> = {
  discount: colors.secondary.main,
  upgrade: colors.primary.main,
  exclusive: colors.accent.main,
  merchandise: '#10B981',
};

interface PointsActivity {
  id: string;
  description: string;
  points: number;
  date: Date;
  type: 'earned' | 'redeemed';
}

const POINTS_HISTORY: PointsActivity[] = [
  { id: '1', description: 'Purchased ticket', points: 150, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), type: 'earned' },
  { id: '2', description: 'Left a review', points: 50, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), type: 'earned' },
  { id: '3', description: 'Redeemed: Free Drink', points: -300, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), type: 'redeemed' },
  { id: '4', description: 'Purchased 2 tickets', points: 300, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15), type: 'earned' },
  { id: '5', description: 'Referral bonus', points: 200, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20), type: 'earned' },
];

export default function RewardsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'rewards' | 'history'>('rewards');
  const [selectedCategory, setSelectedCategory] = useState<Reward['category'] | 'all'>('all');

  // Mock user points
  const userPoints = 1250;
  const totalEarned = 2550;

  const filteredRewards = selectedCategory === 'all' 
    ? REWARDS 
    : REWARDS.filter(r => r.category === selectedCategory);

  const levelProgress = (currentUser.totalPurchases % 10) / 10;
  const showsToNextLevel = 10 - (currentUser.totalPurchases % 10);

  const renderRewardCard = (reward: Reward) => {
    const canRedeem = userPoints >= reward.pointsCost && reward.available;
    const categoryColor = CATEGORY_COLORS[reward.category];

    return (
      <TouchableOpacity
        key={reward.id}
        style={[styles.rewardCard, !reward.available && styles.rewardCardDisabled]}
        disabled={!canRedeem}
        activeOpacity={0.7}
      >
        {/* Icon */}
        <LinearGradient
          colors={reward.available ? [categoryColor, `${categoryColor}99`] : [colors.dark[500], colors.dark[600]]}
          style={styles.rewardIcon}
        >
          <Ionicons 
            name={reward.icon} 
            size={24} 
            color={reward.available ? colors.neutral.white : colors.neutral.textTertiary} 
          />
        </LinearGradient>

        {/* Content */}
        <View style={styles.rewardContent}>
          <Text style={[styles.rewardTitle, !reward.available && styles.rewardTitleDisabled]}>
            {reward.title}
          </Text>
          <Text style={styles.rewardDescription} numberOfLines={2}>
            {reward.description}
          </Text>
          
          {/* Points Cost */}
          <View style={styles.pointsCostContainer}>
            <Ionicons 
              name="diamond" 
              size={14} 
              color={canRedeem ? colors.primary.main : colors.neutral.textTertiary} 
            />
            <Text style={[styles.pointsCost, canRedeem && styles.pointsCostCanRedeem]}>
              {reward.pointsCost.toLocaleString()} pts
            </Text>
          </View>
        </View>

        {/* Redeem Button */}
        {reward.available ? (
          <TouchableOpacity 
            style={[styles.redeemButton, canRedeem && styles.redeemButtonActive]}
            disabled={!canRedeem}
          >
            {canRedeem ? (
              <LinearGradient
                colors={[colors.primary.main, colors.secondary.main]}
                style={styles.redeemButtonGradient}
              >
                <Text style={styles.redeemButtonText}>Redeem</Text>
              </LinearGradient>
            ) : (
              <Text style={styles.redeemButtonTextDisabled}>
                {userPoints >= reward.pointsCost ? 'Unavailable' : `${reward.pointsCost - userPoints} more`}
              </Text>
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.comingSoonBadge}>
            <Text style={styles.comingSoonText}>Coming Soon</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderHistoryItem = (activity: PointsActivity) => {
    const isEarned = activity.type === 'earned';

    return (
      <View key={activity.id} style={styles.historyItem}>
        <View style={[styles.historyIcon, isEarned ? styles.historyIconEarned : styles.historyIconRedeemed]}>
          <Ionicons 
            name={isEarned ? 'add' : 'remove'} 
            size={16} 
            color={isEarned ? colors.semantic.success : colors.secondary.main} 
          />
        </View>
        <View style={styles.historyContent}>
          <Text style={styles.historyDescription}>{activity.description}</Text>
          <Text style={styles.historyDate}>
            {activity.date.toLocaleDateString()}
          </Text>
        </View>
        <Text style={[styles.historyPoints, isEarned ? styles.pointsEarned : styles.pointsRedeemed]}>
          {isEarned ? '+' : ''}{activity.points}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.neutral.background} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.neutral.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('rewards.title', { defaultValue: 'Rewards' })}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Points Card */}
        <LinearGradient
          colors={[colors.primary.main, colors.secondary.main]}
          style={styles.pointsCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.pointsCardContent}>
            <View style={styles.pointsMain}>
              <Text style={styles.pointsLabel}>Your Points</Text>
              <View style={styles.pointsValueRow}>
                <Ionicons name="diamond" size={28} color={colors.neutral.white} />
                <Text style={styles.pointsValue}>{userPoints.toLocaleString()}</Text>
              </View>
            </View>
            <View style={styles.pointsStats}>
              <View style={styles.pointsStat}>
                <Text style={styles.pointsStatValue}>{totalEarned.toLocaleString()}</Text>
                <Text style={styles.pointsStatLabel}>Total Earned</Text>
              </View>
              <View style={styles.pointsStatDivider} />
              <View style={styles.pointsStat}>
                <Text style={styles.pointsStatValue}>{currentUser.level}</Text>
                <Text style={styles.pointsStatLabel}>Level</Text>
              </View>
            </View>
          </View>

          {/* Level Progress */}
          <View style={styles.levelProgress}>
            <View style={styles.levelProgressBar}>
              <View style={[styles.levelProgressFill, { width: `${levelProgress * 100}%` }]} />
            </View>
            <Text style={styles.levelProgressText}>
              {showsToNextLevel} shows to next level
            </Text>
          </View>
        </LinearGradient>

        {/* Earn More Section */}
        <View style={styles.earnSection}>
          <Text style={styles.sectionTitle}>Earn More Points</Text>
          <View style={styles.earnCards}>
            <View style={styles.earnCard}>
              <Ionicons name="ticket" size={24} color={colors.primary.main} />
              <Text style={styles.earnCardTitle}>Buy Tickets</Text>
              <Text style={styles.earnCardPoints}>+100 pts</Text>
            </View>
            <View style={styles.earnCard}>
              <Ionicons name="star" size={24} color={colors.accent.main} />
              <Text style={styles.earnCardTitle}>Leave Review</Text>
              <Text style={styles.earnCardPoints}>+50 pts</Text>
            </View>
            <View style={styles.earnCard}>
              <Ionicons name="people" size={24} color={colors.secondary.main} />
              <Text style={styles.earnCardTitle}>Refer Friend</Text>
              <Text style={styles.earnCardPoints}>+200 pts</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'rewards' && styles.tabActive]}
            onPress={() => setActiveTab('rewards')}
          >
            <Text style={[styles.tabText, activeTab === 'rewards' && styles.tabTextActive]}>
              Rewards
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'history' && styles.tabActive]}
            onPress={() => setActiveTab('history')}
          >
            <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>
              History
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'rewards' ? (
          <>
            {/* Category Filters */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.categoryFilters}
              contentContainerStyle={styles.categoryFiltersContent}
            >
              {['all', 'discount', 'upgrade', 'exclusive', 'merchandise'].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    selectedCategory === cat && styles.categoryChipActive,
                  ]}
                  onPress={() => setSelectedCategory(cat as any)}
                >
                  <Text style={[
                    styles.categoryChipText,
                    selectedCategory === cat && styles.categoryChipTextActive,
                  ]}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Rewards List */}
            <View style={styles.rewardsList}>
              {filteredRewards.map(renderRewardCard)}
            </View>
          </>
        ) : (
          /* History List */
          <View style={styles.historyList}>
            {POINTS_HISTORY.map(renderHistoryItem)}
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  pointsCard: {
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  pointsCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  pointsMain: {},
  pointsLabel: {
    ...typography.bodySmall,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: spacing.xs,
  },
  pointsValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  pointsValue: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.neutral.white,
  },
  pointsStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsStat: {
    alignItems: 'center',
  },
  pointsStatValue: {
    ...typography.labelLarge,
    color: colors.neutral.white,
    textTransform: 'capitalize',
  },
  pointsStatLabel: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  pointsStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: spacing.md,
  },
  levelProgress: {},
  levelProgressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  levelProgressFill: {
    height: '100%',
    backgroundColor: colors.neutral.white,
    borderRadius: 3,
  },
  levelProgressText: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  earnSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.headingSmall,
    color: colors.neutral.text,
    marginBottom: spacing.md,
  },
  earnCards: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  earnCard: {
    flex: 1,
    backgroundColor: colors.dark[700],
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  earnCardTitle: {
    ...typography.labelSmall,
    color: colors.neutral.text,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  earnCardPoints: {
    ...typography.labelMedium,
    color: colors.primary.main,
    marginTop: spacing.xxs,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.dark[700],
    borderRadius: 12,
    padding: 4,
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: colors.primary.main,
  },
  tabText: {
    ...typography.labelMedium,
    color: colors.neutral.textSecondary,
  },
  tabTextActive: {
    color: colors.neutral.white,
  },
  categoryFilters: {
    marginBottom: spacing.lg,
    marginHorizontal: -spacing.lg,
  },
  categoryFiltersContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.dark[700],
    borderWidth: 1,
    borderColor: colors.dark[500],
    marginRight: spacing.sm,
  },
  categoryChipActive: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  categoryChipText: {
    ...typography.labelSmall,
    color: colors.neutral.textSecondary,
  },
  categoryChipTextActive: {
    color: colors.neutral.white,
  },
  rewardsList: {},
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark[700],
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  rewardCardDisabled: {
    opacity: 0.6,
  },
  rewardIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  rewardContent: {
    flex: 1,
  },
  rewardTitle: {
    ...typography.labelMedium,
    color: colors.neutral.text,
    marginBottom: spacing.xxs,
  },
  rewardTitleDisabled: {
    color: colors.neutral.textTertiary,
  },
  rewardDescription: {
    ...typography.caption,
    color: colors.neutral.textSecondary,
    marginBottom: spacing.sm,
  },
  pointsCostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pointsCost: {
    ...typography.labelSmall,
    color: colors.neutral.textTertiary,
  },
  pointsCostCanRedeem: {
    color: colors.primary.main,
  },
  redeemButton: {
    marginLeft: spacing.md,
  },
  redeemButtonActive: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  redeemButtonGradient: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  redeemButtonText: {
    ...typography.labelSmall,
    color: colors.neutral.white,
  },
  redeemButtonTextDisabled: {
    ...typography.caption,
    color: colors.neutral.textTertiary,
  },
  comingSoonBadge: {
    backgroundColor: colors.dark[600],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
    marginLeft: spacing.md,
  },
  comingSoonText: {
    ...typography.caption,
    color: colors.neutral.textTertiary,
  },
  historyList: {},
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark[700],
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  historyIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  historyIconEarned: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  historyIconRedeemed: {
    backgroundColor: 'rgba(236, 72, 153, 0.2)',
  },
  historyContent: {
    flex: 1,
  },
  historyDescription: {
    ...typography.bodyMedium,
    color: colors.neutral.text,
  },
  historyDate: {
    ...typography.caption,
    color: colors.neutral.textTertiary,
    marginTop: spacing.xxs,
  },
  historyPoints: {
    ...typography.labelLarge,
    marginLeft: spacing.md,
  },
  pointsEarned: {
    color: colors.semantic.success,
  },
  pointsRedeemed: {
    color: colors.secondary.main,
  },
});
