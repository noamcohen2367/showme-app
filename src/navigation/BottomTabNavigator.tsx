// ============================================
// ShowME App - Bottom Tab Navigator (iOS 26 Liquid Glass Style)
// ============================================

import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { BlurView } from 'expo-blur';

import { MainTabParamList } from '../types/types';
import { colors, typography, spacing } from '../theme/theme';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import EnhancedSearchScreen from '../screens/EnhancedSearchScreen';
import MyPerformancesScreen from '../screens/MyPerformancesScreen';
import MySubscriptionsScreen from '../screens/MySubscriptionsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

type TabIconName = 'home' | 'search' | 'ticket' | 'card' | 'person';

const TAB_ICONS: Record<
  keyof MainTabParamList,
  { active: string; inactive: string }
> = {
  Home: { active: 'home', inactive: 'home-outline' },
  Search: { active: 'search', inactive: 'search-outline' },
  MyPerformances: { active: 'ticket', inactive: 'ticket-outline' },
  MySubscriptions: { active: 'card', inactive: 'card-outline' },
  Profile: { active: 'person', inactive: 'person-outline' },
};

// Glass Tab Bar Background Component (iOS 26 Style using expo-blur)
function GlassTabBarBackground() {
  // iOS: Use BlurView for glass effect
  if (Platform.OS === 'ios') {
    return (
      <BlurView intensity={80} tint="dark" style={styles.blurBackground}>
        <View style={styles.blurBorder} />
      </BlurView>
    );
  }

  // Android fallback
  return (
    <View style={styles.androidBackground}>
      <View style={styles.androidBorder} />
    </View>
  );
}

export default function BottomTabNavigator() {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          const iconConfig = TAB_ICONS[route.name];
          const iconName = focused ? iconConfig.active : iconConfig.inactive;

          return (
            <View
              style={
                focused ? styles.activeIconContainer : styles.iconContainer
              }
            >
              <Ionicons name={iconName as any} size={24} color={color} />
              {focused && <View style={styles.glowDot} />}
            </View>
          );
        },
        tabBarActiveTintColor: colors.primary.main,
        tabBarInactiveTintColor: colors.neutral.textTertiary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
        tabBarBackground: () => <GlassTabBarBackground />,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: t('navigation.home') }}
      />
      <Tab.Screen
        name="Search"
        component={EnhancedSearchScreen}
        options={{ tabBarLabel: t('navigation.search') }}
      />
      <Tab.Screen
        name="MyPerformances"
        component={MyPerformancesScreen}
        options={{ tabBarLabel: t('navigation.myPerformances') }}
      />
      <Tab.Screen
        name="MySubscriptions"
        component={MySubscriptionsScreen}
        options={{ tabBarLabel: t('navigation.mySubscriptions') }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: t('navigation.profile') }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    elevation: 0,
    height: Platform.OS === 'ios' ? 88 : 70,
    paddingTop: spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? 28 : spacing.sm,
  },

  // BlurView Background (iOS)
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  blurBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 0.5,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },

  // Android Fallback
  androidBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(18, 18, 26, 0.98)',
  },
  androidBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.dark[500],
  },

  tabBarLabel: {
    ...typography.labelSmall,
    marginTop: spacing.xxs,
  },
  tabBarItem: {
    paddingTop: spacing.xs,
  },
  iconContainer: {
    alignItems: 'center',
  },
  activeIconContainer: {
    alignItems: 'center',
  },
  glowDot: {
    width: 0,
    height: 0,
    borderRadius: 2,
    backgroundColor: colors.primary.main,
    marginTop: spacing.xxs,
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
});
