// ============================================
// ShowME App - Bottom Tab Navigator
// Mobile: iOS 26 Liquid Glass style bottom tabs
// Web: Sticky top navigation bar (TodayTix style)
// ============================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';

import { MainTabParamList, RootStackParamList } from '../types/types';
import { colors, typography, spacing } from '../theme/theme';
import { useNotificationBadge } from '../hooks/useNotificationBadge';

import HomeScreen from '../screens/HomeScreen';
import EnhancedSearchScreen from '../screens/EnhancedSearchScreen';
import WatchlistScreen from '../screens/WatchlistScreen';
import MySubscriptionsScreen from '../screens/MySubscriptionsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const WEB_TOPNAV_HEIGHT = 64;

const TAB_ICONS: Record<keyof MainTabParamList, { active: string; inactive: string }> = {
  Home:            { active: 'home',   inactive: 'home-outline' },
  Search:          { active: 'search', inactive: 'search-outline' },
  Watchlist:       { active: 'heart',  inactive: 'heart-outline' },
  MySubscriptions: { active: 'card',   inactive: 'card-outline' },
  Profile:         { active: 'person', inactive: 'person-outline' },
};

// ─────────────────────────────────────────────────────────────────────────────
// Mobile: iOS 26 Glass Tab Bar Background
// ─────────────────────────────────────────────────────────────────────────────
function GlassTabBarBackground() {
  if (Platform.OS === 'ios') {
    return (
      <BlurView intensity={80} tint="dark" style={styles.blurBackground}>
        <View style={styles.blurBorder} />
      </BlurView>
    );
  }
  return (
    <View style={styles.androidBackground}>
      <View style={styles.androidBorder} />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Web: Sticky Top Navigation Bar
// ─────────────────────────────────────────────────────────────────────────────
function WebTopNav({ state, navigation }: BottomTabBarProps) {
  const { t } = useTranslation();
  const rootNav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const hasUnread = useNotificationBadge();

  const tabs: { name: keyof MainTabParamList; label: string }[] = [
    { name: 'Home',            label: t('navigation.home') },
    { name: 'Search',          label: t('navigation.search') },
    { name: 'Watchlist',       label: t('navigation.myPerformances') },
    { name: 'MySubscriptions', label: t('navigation.mySubscriptions') },
    { name: 'Profile',         label: t('navigation.profile') },
  ];

  return (
    <View style={styles.webTopNav}>
      {/* Left: Logo */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
        activeOpacity={0.8}
        style={styles.webLogoWrap}
      >
        <Image
          source={require('../../assets/wordmark.png')}
          style={styles.webLogo}
          contentFit="contain"
        />
      </TouchableOpacity>

      {/* Center: Nav items */}
      <View style={styles.webNavItems}>
        {tabs.map((tab, index) => {
          const focused = state.index === index;
          const icon = TAB_ICONS[tab.name];
          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => navigation.navigate(tab.name)}
              style={styles.webNavItem}
              activeOpacity={0.7}
            >
              <Ionicons
                name={(focused ? icon.active : icon.inactive) as any}
                size={18}
                color={focused ? colors.primary.main : colors.neutral.textTertiary}
              />
              <Text style={[styles.webNavLabel, focused && styles.webNavLabelActive]}>
                {tab.label}
              </Text>
              {focused && (
                <LinearGradient
                  colors={[colors.primary.main, colors.secondary.main]}
                  style={styles.webNavUnderline}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Right: Notifications */}
      <View style={styles.webNavRight}>
        <TouchableOpacity
          style={styles.webNotifBtn}
          onPress={() => rootNav.navigate('Notifications')}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={22} color={colors.neutral.text} />
          {hasUnread && <View style={styles.webNotifDot} />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Navigator
// ─────────────────────────────────────────────────────────────────────────────
export default function BottomTabNavigator() {
  const { t } = useTranslation();
  const isWeb = Platform.OS === 'web';

  return (
    <Tab.Navigator
      // On web: replace the bottom tab bar with the sticky top nav
      tabBar={isWeb ? (props) => <WebTopNav {...props} /> : undefined}
      screenOptions={({ route }) => ({
        headerShown: false,
        // On web: push content below the 64px sticky top nav
        contentStyle: isWeb ? { paddingTop: WEB_TOPNAV_HEIGHT } : undefined,
        // Mobile-only tab bar options (ignored on web since tabBar prop overrides)
        tabBarIcon: ({ focused, color }) => {
          const icon = TAB_ICONS[route.name];
          const name = focused ? icon.active : icon.inactive;
          return (
            <View style={focused ? styles.activeIconContainer : styles.iconContainer}>
              <Ionicons name={name as any} size={24} color={color} />
              {focused && <View style={styles.glowDot} />}
            </View>
          );
        },
        tabBarActiveTintColor:   colors.primary.main,
        tabBarInactiveTintColor: colors.neutral.textTertiary,
        tabBarStyle:      isWeb ? { display: 'none' } : styles.mobileTabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle:  styles.tabBarItem,
        tabBarBackground: isWeb ? undefined : () => <GlassTabBarBackground />,
      })}
    >
      <Tab.Screen name="Home"            component={HomeScreen}            options={{ tabBarLabel: t('navigation.home') }} />
      <Tab.Screen name="Search"          component={EnhancedSearchScreen}  options={{ tabBarLabel: t('navigation.search') }} />
      <Tab.Screen name="Watchlist"       component={WatchlistScreen}        options={{ tabBarLabel: t('navigation.myPerformances') }} />
      <Tab.Screen name="MySubscriptions" component={MySubscriptionsScreen}  options={{ tabBarLabel: t('navigation.mySubscriptions') }} />
      <Tab.Screen name="Profile"         component={ProfileScreen}          options={{ tabBarLabel: t('navigation.profile') }} />
    </Tab.Navigator>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // ── Mobile bottom tab bar ────────────────────────────────────────────────
  mobileTabBar: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    elevation: 0,
    height: Platform.OS === 'ios' ? 88 : 70,
    paddingTop: spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? 28 : spacing.sm,
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  blurBorder: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 0.5,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  androidBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(18,18,26,0.98)',
  },
  androidBorder: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 1,
    backgroundColor: colors.dark[500],
  },
  tabBarLabel:         { ...typography.labelSmall, marginTop: spacing.xxs },
  tabBarItem:          { paddingTop: spacing.xs },
  iconContainer:       { alignItems: 'center' },
  activeIconContainer: { alignItems: 'center' },
  glowDot: {
    width: 0, height: 0,
    borderRadius: 2,
    backgroundColor: colors.primary.main,
    marginTop: spacing.xxs,
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },

  // ── Web top navigation bar ───────────────────────────────────────────────
  webTopNav: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: WEB_TOPNAV_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    backgroundColor: 'rgba(10,10,20,0.96)',
    borderBottomWidth: 1,
    borderBottomColor: colors.dark[500],
    zIndex: 1000,
  },
  webLogoWrap: {
    marginEnd: 40,
  },
  webLogo: {
    width: 110,
    height: 32,
  },
  webNavItems: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  webNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    position: 'relative',
  },
  webNavLabel: {
    ...typography.labelSmall,
    color: colors.neutral.textTertiary,
  },
  webNavLabelActive: {
    color: colors.primary.main,
    fontWeight: '600',
  },
  webNavUnderline: {
    position: 'absolute',
    bottom: -1,
    left: 14,
    right: 14,
    height: 2,
    borderRadius: 1,
  },
  webNavRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  webNotifBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webNotifDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.semantic.error,
  },
});
