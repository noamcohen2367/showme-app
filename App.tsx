// ============================================
// ShowME App - Main Entry Point
// ============================================

import React, { useEffect, useState } from 'react';
import { StatusBar, View } from 'react-native';
import {
  useFonts,
  Rubik_400Regular,
  Rubik_500Medium,
  Rubik_600SemiBold,
  Rubik_700Bold,
} from '@expo-google-fonts/rubik';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import './src/i18n/i18n';
import { initLanguage } from './src/i18n/i18n';

import { RootNavigator } from './src/navigation/navigation';
import { colors } from './src/theme/theme';
import { ThemeProvider } from './src/theme/ThemeContext';
import SplashScreen from './src/components/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';

function AppContent() {
  const { isLoggedIn, login } = useAuth();
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

  // ── Login gate ────────────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor={colors.neutral.background} />
        <LoginScreen onLogin={login} />
      </SafeAreaProvider>
    );
  }

  // ── Main app ──────────────────────────────────────────────────────────────
  // On web: full browser width, top nav handled by BottomTabNavigator (WebTopNav).
  // On mobile: normal full-screen layout with bottom glass tab bar.
  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.neutral.background }}>
        <SafeAreaProvider style={{ flex: 1 }}>
          <NavigationContainer>
            <StatusBar barStyle="light-content" backgroundColor={colors.neutral.background} />
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
