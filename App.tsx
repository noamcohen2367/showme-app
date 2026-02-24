// ============================================
// ShowME App - Main Entry Point
// ============================================

import React, { useEffect, useState } from 'react';
import { StatusBar, View, StyleSheet } from 'react-native';
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
import { getAuth } from './src/storage/mvpStorage';

export default function App() {
  const [fontsLoaded] = useFonts({
    Rubik_400Regular,
    Rubik_500Medium,
    Rubik_600SemiBold,
    Rubik_700Bold,
  });

  const [isReady, setIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    Promise.all([
      initLanguage(),
      getAuth().then(auth => {
        if (auth.isLoggedIn) setIsLoggedIn(true);
      }),
    ]).finally(() => {
      setTimeout(() => setIsReady(true), 800);
    });
  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  if (!isReady || !fontsLoaded || showSplash) {
    return (
      <View style={styles.splashContainer}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.neutral.background}
        />
        <SplashScreen onFinish={handleSplashFinish} />
      </View>
    );
  }

  // Show login gate if not authenticated
  if (!isLoggedIn) {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor={colors.neutral.background} />
        <LoginScreen onLogin={() => setIsLoggedIn(true)} />
      </SafeAreaProvider>
    );
  }

  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <NavigationContainer>
            <StatusBar
              barStyle="light-content"
              backgroundColor={colors.neutral.background}
            />
            <RootNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: colors.neutral.background,
  },
});
