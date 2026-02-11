// ============================================
// ShowME App - Profile Screen (Dark Aurora Theme)
// ============================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing } from '../theme/theme';
import { currentUser, getNextLevel, userSubscriptions } from '../data/user';
import { RootStackParamList } from '../types/types';

type ProfileNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
  destructive?: boolean;
}

function MenuItem({ icon, label, value, onPress, showChevron = true, destructive = false }: MenuItemProps) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <View style={[styles.menuIcon, destructive && styles.menuIconDestructive]}>
          <Ionicons 
            name={icon} 
            size={20} 
            color={destructive ? colors.semantic.error : colors.primary.main} 
          />
        </View>
        <Text style={[styles.menuItemLabel, destructive && styles.menuItemDestructive]}>
          {label}
        </Text>
      </View>
      <View style={styles.menuItemRight}>
        {value && <Text style={styles.menuItemValue}>{value}</Text>}
        {showChevron && (
          <Ionicons name="chevron-forward" size={18} color={colors.neutral.textTertiary} />
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<ProfileNavigationProp>();
  const insets = useSafeAreaInsets();
  
  const nextLevel = getNextLevel(currentUser.level);
  const levelColors = {
    bronze: colors.levels.bronze,
    silver: colors.levels.silver,
    gold: colors.levels.gold,
  };

  const activeSubscriptions = userSubscriptions.filter(s => s.status === 'active');

  const levelGradients: Record<string, [string, string]> = {
    bronze: ['#CD7F32', '#8B5A2B'],
    silver: ['#C0C0C0', '#808080'],
    gold: ['#FFD700', '#DAA520'],
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.neutral.background} />
      
      {/* Aurora Background */}
      <View style={styles.auroraBackground}>
        <LinearGradient
          colors={['rgba(168, 85, 247, 0.2)', 'rgba(236, 72, 153, 0.1)', 'transparent']}
          style={styles.auroraGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0.5 }}
        />
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={[styles.contentContainer, { paddingTop: insets.top + spacing.lg }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {currentUser.profileImageUrl ? (
              <Image
                source={{ uri: currentUser.profileImageUrl }}
                style={styles.avatar}
                contentFit="cover"
                transition={200}
              />
            ) : (
              <LinearGradient
                colors={[colors.primary.main, colors.secondary.main]}
                style={styles.avatarPlaceholder}
              >
                <Ionicons name="person" size={40} color={colors.neutral.white} />
              </LinearGradient>
            )}
            {/* Level Badge */}
            <LinearGradient
              colors={levelGradients[currentUser.level]}
              style={styles.levelBadge}
            >
              <Ionicons name="star" size={12} color="#FFF" />
            </LinearGradient>
          </View>
          
          <Text style={styles.userName}>{currentUser.fullName}</Text>
          <View style={styles.levelRow}>
            <LinearGradient
              colors={levelGradients[currentUser.level]}
              style={styles.levelTag}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.levelTagText}>
                {t(`profile.levels.${currentUser.level}`).toUpperCase()}
              </Text>
            </LinearGradient>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{currentUser.totalPurchases}</Text>
              <Text style={styles.statLabel}>{t('profile.showsAttended')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{activeSubscriptions.length}</Text>
              <Text style={styles.statLabel}>{t('profile.activeSubscriptions')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>4.8</Text>
              <Text style={styles.statLabel}>{t('profile.avgRating')}</Text>
            </View>
          </View>

          {/* Level Progress */}
          {nextLevel && (
            <View style={styles.levelProgress}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>{t('profile.nextLevel')}</Text>
                <Text style={styles.progressValue}>
                  {nextLevel.showsNeeded} {t('profile.showsToGo')}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <LinearGradient
                  colors={levelGradients[nextLevel.level]}
                  style={[
                    styles.progressFill,
                    { 
                      width: `${Math.min(100, ((currentUser.totalPurchases) / (currentUser.totalPurchases + nextLevel.showsNeeded)) * 100)}%`,
                    },
                  ]} 
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </View>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction}>
            <LinearGradient
              colors={['rgba(168, 85, 247, 0.2)', 'rgba(168, 85, 247, 0.1)']}
              style={styles.quickActionGradient}
            >
              <Ionicons name="heart" size={24} color={colors.primary.main} />
            </LinearGradient>
            <Text style={styles.quickActionLabel}>{t('profile.watchlist')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <LinearGradient
              colors={['rgba(236, 72, 153, 0.2)', 'rgba(236, 72, 153, 0.1)']}
              style={styles.quickActionGradient}
            >
              <Ionicons name="star" size={24} color={colors.secondary.main} />
            </LinearGradient>
            <Text style={styles.quickActionLabel}>{t('profile.reviews')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('Rewards')}>
            <LinearGradient
              colors={['rgba(6, 182, 212, 0.2)', 'rgba(6, 182, 212, 0.1)']}
              style={styles.quickActionGradient}
            >
              <Ionicons name="gift" size={24} color={colors.accent.main} />
            </LinearGradient>
            <Text style={styles.quickActionLabel}>{t('profile.rewards')}</Text>
          </TouchableOpacity>
        </View>

        {/* New Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Explore</Text>
          <View style={styles.menuCard}>
            <MenuItem 
              icon="stats-chart" 
              label="My Stats"
              onPress={() => navigation.navigate('Analytics')}
            />
            <View style={styles.menuDivider} />
            <MenuItem 
              icon="people" 
              label="Community"
              onPress={() => navigation.navigate('Social')}
            />
            <View style={styles.menuDivider} />
            <MenuItem 
              icon="map" 
              label="Theater Map"
              onPress={() => navigation.navigate('Map')}
            />
            <View style={styles.menuDivider} />
            <MenuItem 
              icon="business" 
              label="Hall Library"
              onPress={() => navigation.navigate('HallLibrary')}
            />
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.settings')}</Text>
          <View style={styles.menuCard}>
            <MenuItem 
              icon="person-outline" 
              label={t('profile.editProfile')}
              onPress={() => navigation.navigate('Settings')}
            />
            <View style={styles.menuDivider} />
            <MenuItem 
              icon="card-outline" 
              label={t('profile.paymentMethods')}
              value="•••• 4242"
              onPress={() => navigation.navigate('PaymentMethods')}
            />
            <View style={styles.menuDivider} />
            <MenuItem 
              icon="notifications-outline" 
              label={t('profile.notifications')}
              onPress={() => navigation.navigate('NotificationPreferences')}
            />
            <View style={styles.menuDivider} />
            <MenuItem 
              icon="color-palette-outline" 
              label="Appearance"
              onPress={() => navigation.navigate('Appearance')}
            />
            <View style={styles.menuDivider} />
            <MenuItem 
              icon="language-outline" 
              label={t('profile.language')}
              value={i18n.language === 'he' ? 'עברית' : 'English'}
            />
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.support')}</Text>
          <View style={styles.menuCard}>
            <MenuItem 
              icon="chatbubbles-outline" 
              label="Live Chat"
              onPress={() => navigation.navigate('LiveChat')}
            />
            <View style={styles.menuDivider} />
            <MenuItem 
              icon="help-circle-outline" 
              label={t('profile.faq')}
            />
            <View style={styles.menuDivider} />
            <MenuItem 
              icon="chatbubble-outline" 
              label={t('profile.contactUs')}
            />
            <View style={styles.menuDivider} />
            <MenuItem 
              icon="document-text-outline" 
              label={t('profile.termsOfUse')}
            />
            <View style={styles.menuDivider} />
            <MenuItem 
              icon="shield-outline" 
              label={t('profile.privacyPolicy')}
            />
          </View>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <View style={styles.menuCard}>
            <MenuItem 
              icon="log-out-outline" 
              label={t('profile.logout')}
              showChevron={false}
              destructive
            />
          </View>
        </View>

        {/* App Version */}
        <Text style={styles.versionText}>ShowME v1.0.0</Text>

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
  auroraBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  auroraGradient: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: colors.dark[700],
    borderRadius: 20,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: colors.primary.main,
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.dark[700],
  },
  userName: {
    ...typography.headingLarge,
    color: colors.neutral.text,
  },
  levelRow: {
    marginTop: spacing.sm,
  },
  levelTag: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xxs,
    borderRadius: 12,
  },
  levelTagText: {
    ...typography.labelSmall,
    color: colors.neutral.white,
    fontWeight: '700',
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...typography.headingMedium,
    color: colors.neutral.text,
  },
  statLabel: {
    ...typography.caption,
    color: colors.neutral.textTertiary,
    marginTop: spacing.xxs,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.dark[500],
  },
  levelProgress: {
    width: '85%',
    marginTop: spacing.xl,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  progressLabel: {
    ...typography.bodySmall,
    color: colors.neutral.textSecondary,
  },
  progressValue: {
    ...typography.labelSmall,
    color: colors.primary.main,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.dark[600],
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: spacing.xs,
  },
  quickActionGradient: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  quickActionLabel: {
    ...typography.labelSmall,
    color: colors.neutral.textSecondary,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.labelMedium,
    color: colors.neutral.textTertiary,
    marginBottom: spacing.sm,
    marginLeft: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  menuCard: {
    backgroundColor: colors.dark[700],
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIconDestructive: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  menuItemLabel: {
    ...typography.bodyMedium,
    color: colors.neutral.text,
    marginLeft: spacing.md,
  },
  menuItemDestructive: {
    color: colors.semantic.error,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemValue: {
    ...typography.bodySmall,
    color: colors.neutral.textTertiary,
    marginRight: spacing.xs,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.dark[500],
    marginLeft: 68,
  },
  versionText: {
    ...typography.caption,
    color: colors.neutral.textTertiary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
