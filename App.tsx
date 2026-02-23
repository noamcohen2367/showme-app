// ============================================
// ShowME App - Main Entry Point
// ============================================

import React, { useEffect, useState } from 'react';
import { StatusBar, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Import i18n configuration (must be imported before using translations)
import './src/i18n/i18n';
import { initializeRTL } from './src/i18n/i18n';

// Import navigation
import { RootNavigator } from './src/navigation/navigation';

// Import theme
import { colors } from './src/theme/theme';
import { ThemeProvider } from './src/theme/ThemeContext';

// Import splash screen
import SplashScreen from './src/components/SplashScreen';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Initialize RTL support based on device language
    initializeRTL();
    // Simulate loading time for resources
    setTimeout(() => setIsReady(true), 800);
  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  if (!isReady || showSplash) {
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
