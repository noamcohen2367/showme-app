// ============================================
// ShowME App - Main Entry Point
// ============================================

import React, { useEffect, useState } from 'react';
import { Platform, StatusBar, View } from 'react-native';
import {
  useFonts,
  Rubik_400Regular,
  Rubik_500Medium,
  Rubik_600SemiBold,
  Rubik_700Bold,
} from '@expo-google-fonts/rubik';
import { NavigationContainer, DarkTheme, LinkingOptions } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import './src/i18n/i18n';
import { initLanguage } from './src/i18n/i18n';

// ── Web: inject global background so the HTML/body and all RNW root divs
//    match the app's dark base color (no white flash before React mounts)
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    html, body, #root {
      background-color: #1A0A2E !important;
      margin: 0; padding: 0;
    }
    /* react-native-web atomic class for any transparent/white bg containers */
    .r-backgroundColor-1niwhzg { background-color: #1A0A2E !important; }
  `;
  document.head.appendChild(style);
}

import { RootNavigator } from './src/navigation/navigation';
import { colors } from './src/theme/theme';
import { ThemeProvider } from './src/theme/ThemeContext';
import SplashScreen from './src/components/SplashScreen';
import AuroraBackground from './src/components/AuroraBackground';
import LoginScreen from './src/screens/LoginScreen';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import SignUpScreen from './src/screens/SignUpScreen';
// ── URL Linking (web deep-links + native universal links) ────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const linking: LinkingOptions<any> = {
  prefixes: Platform.OS === 'web' ? [''] : ['showme://'],
  config: {
    screens: {
      MainTabs: {
        screens: {
          Home:            '',
          Search:          'search',
          Watchlist:       'watchlist',
          MySubscriptions: 'subscriptions',
          Profile:         'profile',
        },
      },
      ShowDetails:             'show/:showId',
      ActorProfile:            'actor/:actorId',
      Settings:                'settings',
      Notifications:           'notifications',
      Rewards:                 'rewards',
      Analytics:               'analytics',
      Social:                  'social',
      Appearance:              'appearance',
      Map:                     'map',
      HallLibrary:             'halls',
      HallDetails:             'hall/:hallId',
      TicketDetail:            'ticket/:performanceId',
      FAQ:                     'faq',
      PaymentMethods:          'payment-methods',
      NotificationPreferences: 'notification-preferences',
    },
  },
};

function AppContent() {
  const { isLoggedIn, login } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'signUp'>('login');
  const [fontsLoaded] = useFonts({
    Rubik_400Regular,
    Rubik_500Medium,
    Rubik_600SemiBold,
    Rubik_700Bold,
  });
  const [isReady, setIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    initLanguage().finally(() => {
      setTimeout(() => setIsReady(true), 800);
    });
  }, []);

  // ── Splash ───────────────────────────────────────────────────────────────
  if (!isReady || !fontsLoaded || showSplash) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.neutral.background }}>
        <StatusBar barStyle="light-content" backgroundColor={colors.neutral.background} />
        <SplashScreen onFinish={() => setShowSplash(false)} />
      </View>
    );
  }

  // ── Login / Sign Up gate ─────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor={colors.neutral.background} />
        {authView === 'signUp' ? (
          <SignUpScreen
            onSignedUp={() => setAuthView('login')}
            onGoToLogin={() => setAuthView('login')}
          />
        ) : (
          <LoginScreen
            onLogin={login}
            onGoToSignUp={() => setAuthView('signUp')}
          />
        )}
      </SafeAreaProvider>
    );
  }

  // ── Main app ──────────────────────────────────────────────────────────────
  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#1A0A2E' }}>
        {/* Aurora is behind all content — background → gradient → content */}
        <AuroraBackground />
        <SafeAreaProvider style={{ flex: 1 }}>
          <NavigationContainer
            linking={linking}
            theme={{ ...DarkTheme, colors: { ...DarkTheme.colors, background: 'transparent' } }}
          >
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            <RootNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
