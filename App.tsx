// ============================================
// ShowME App - Main Entry Point
// ============================================

import React, { useEffect, useState } from 'react';
import { StatusBar, View, StyleSheet, Platform } from 'react-native';
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

// Import i18n configuration (must be imported before using translations)
import './src/i18n/i18n';
import { initLanguage } from './src/i18n/i18n';

// Import navigation
import { RootNavigator } from './src/navigation/navigation';

// Import theme
import { colors } from './src/theme/theme';
import { ThemeProvider } from './src/theme/ThemeContext';

// Import splash screen
import SplashScreen from './src/components/SplashScreen';

// MVP auth
import LoginScreen from './src/screens/LoginScreen';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';

// Responsive web dimensions
import { APP_MAX_WIDTH } from './src/utils/dimensions';

const isWeb = Platform.OS === 'web';

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

  if (!isReady || !fontsLoaded || showSplash) {
    return (
      <View style={styles.splashContainer}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.neutral.background}
        />
        <SplashScreen onFinish={() => setShowSplash(false)} />
      </View>
    );
  }

  // Show login gate if not authenticated
  if (!isLoggedIn) {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor={colors.neutral.background} />
        <View style={styles.webOuter}>
          <View style={styles.webInner}>
            <LoginScreen onLogin={login} />
          </View>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <ThemeProvider>
      <GestureHandlerRootView style={styles.webOuter}>
        <SafeAreaProvider>
          <View style={styles.webInner}>
            <NavigationContainer>
              <StatusBar
                barStyle="light-content"
                backgroundColor={colors.neutral.background}
              />
              <RootNavigator />
            </NavigationContainer>
          </View>
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

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: colors.neutral.background,
  },
  // Web: dark side-bars + centered column
  webOuter: {
    flex: 1,
    backgroundColor: isWeb ? '#07070A' : colors.neutral.background,
    alignItems: isWeb ? 'center' : undefined,
  },
  webInner: {
    flex: 1,
    width: '100%',
    maxWidth: isWeb ? APP_MAX_WIDTH : undefined,
    overflow: isWeb ? 'hidden' : undefined,
  },
});
