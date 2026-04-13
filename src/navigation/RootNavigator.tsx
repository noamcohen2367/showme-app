// ============================================
// ShowME App - Root Stack Navigator
// ============================================

import React from 'react';
import { Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from '../types/types';
import { colors, typography } from '../theme/theme';
import { isRTL } from '../i18n/i18n';

import BottomTabNavigator from './BottomTabNavigator';

// Import all screens
import ShowDetailsScreen from '../screens/ShowDetailsScreen';
import ActorProfileScreen from '../screens/ActorProfileScreen';
import DateSelectionScreen from '../screens/DateSelectionScreen';
import TimeSelectionScreen from '../screens/TimeSelectionScreen';
import SeatSelectionScreen from '../screens/SeatSelectionScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrderConfirmationScreen from '../screens/OrderConfirmationScreen';
import TicketDetailScreen from '../screens/TicketDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';

// New screens (Stage 8-14)
import NotificationsScreen from '../screens/NotificationsScreen';
import RewardsScreen from '../screens/RewardsScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import SocialScreen from '../screens/SocialScreen';
import AppearanceScreen from '../screens/AppearanceScreen';
import MapScreen from '../screens/MapScreen';

// New screens (Stage 15-17)
import EnhancedSearchScreen from '../screens/EnhancedSearchScreen';
import GroupBookingScreen from '../screens/GroupBookingScreen';
import SpecialOccasionsScreen from '../screens/SpecialOccasionsScreen';

// Additional screens
import OnboardingScreen from '../screens/OnboardingScreen';

// Stage 18 screens
import DigitalWalletScreen from '../screens/DigitalWalletScreen';
import PaymentMethodsScreen from '../screens/PaymentMethodsScreen';
import ShareTicketScreen from '../screens/ShareTicketScreen';
import ReviewScreen from '../screens/ReviewScreen';
import AddToCalendarScreen from '../screens/AddToCalendarScreen';
import NotificationPreferencesScreen from '../screens/NotificationPreferencesScreen';
import LiveChatScreen from '../screens/LiveChatScreen';

// Stage 19 screens - Hall Library
import HallLibraryScreen from '../screens/HallLibraryScreen';
import HallDetailsScreen from '../screens/HallDetailsScreen';
import ShowListScreen from '../screens/ShowListScreen';

// MVP screens
import FAQScreen from '../screens/FAQScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const rtl = isRTL();

  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: colors.primary.main,
        headerTitleStyle: {
          ...typography.headingMedium,
          color: colors.neutral.text,
        },
        headerStyle: {
          backgroundColor: colors.dark[800],
        },
        contentStyle: {
          backgroundColor: '#160a27',
        },
        animation:
          Platform.OS === 'web'
            ? 'none'
            : rtl
              ? 'slide_from_left'
              : 'slide_from_right',
      }}
    >
      {/* Main Tab Navigator */}
      <Stack.Screen
        name="MainTabs"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />

      {/* Show Details & Booking Flow */}
      <Stack.Screen
        name="ShowDetails"
        component={ShowDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ActorProfile"
        component={ActorProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DateSelection"
        component={DateSelectionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TimeSelection"
        component={TimeSelectionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SeatSelection"
        component={SeatSelectionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OrderConfirmation"
        component={OrderConfirmationScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />

      {/* Ticket Detail */}
      <Stack.Screen
        name="TicketDetail"
        component={TicketDetailScreen}
        options={{ headerShown: false }}
      />

      {/* Settings & Profile */}
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />

      {/* New Screens (Stage 8-14) */}
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Rewards"
        component={RewardsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Social"
        component={SocialScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Appearance"
        component={AppearanceScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Map"
        component={MapScreen}
        options={{ headerShown: false }}
      />

      {/* New Screens (Stage 15-17) */}
      <Stack.Screen
        name="EnhancedSearch"
        component={EnhancedSearchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GroupBooking"
        component={GroupBookingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SpecialOccasions"
        component={SpecialOccasionsScreen}
        options={{ headerShown: false }}
      />

      {/* Additional Screens */}
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{ headerShown: false }}
      />

      {/* Stage 18 Screens */}
      <Stack.Screen
        name="DigitalWallet"
        component={DigitalWalletScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PaymentMethods"
        component={PaymentMethodsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ShareTicket"
        component={ShareTicketScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Review"
        component={ReviewScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddToCalendar"
        component={AddToCalendarScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotificationPreferences"
        component={NotificationPreferencesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LiveChat"
        component={LiveChatScreen}
        options={{ headerShown: false }}
      />

      {/* Stage 19 Screens - Hall Library */}
      <Stack.Screen
        name="HallLibrary"
        component={HallLibraryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HallDetails"
        component={HallDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ShowList"
        component={ShowListScreen}
        options={{ headerShown: false }}
      />

      {/* MVP screens */}
      <Stack.Screen
        name="FAQ"
        component={FAQScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
