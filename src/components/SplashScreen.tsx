// ============================================
// ShowMI App - Animated Splash Screen
// ============================================

import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, typography } from '../theme/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const wordmarkOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // Fade in glow
      Animated.timing(glowOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // Scale and fade in logo
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      // Fade in wordmark
      Animated.timing(wordmarkOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      // Fade in tagline
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      // Hold
      Animated.delay(800),
    ]).start(() => {
      onFinish();
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.neutral.background}
      />

      {/* Background gradient */}
      <LinearGradient
        colors={['#1A0A3D', '#0A0A0F', '#1A0A3D']}
        style={StyleSheet.absoluteFill}
      />

      {/* Purple glow */}
      <Animated.View style={[styles.glowContainer, { opacity: glowOpacity }]}>
        <LinearGradient
          colors={[
            'transparent',
            'rgba(168, 85, 247, 0.15)',
            'rgba(168, 85, 247, 0.05)',
            'transparent',
          ]}
          style={styles.glow}
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0 }}
        />
      </Animated.View>

      {/* Logomark */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <Image
          source={require('../../assets/adaptive-icon.png')}
          style={styles.logo}
          contentFit="contain"
        />
      </Animated.View>

      {/* Wordmark */}
      <Animated.View style={{ opacity: wordmarkOpacity }}>
        <Image
          source={require('../../assets/wordmark.png')}
          style={styles.wordmark}
          contentFit="contain"
        />
      </Animated.View>

      {/* Tagline */}
      <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
        Enjoy the night, we'll handle the rest.
      </Animated.Text>

      {/* Loading Dots */}
      <View style={styles.loadingContainer}>
        <LoadingDots />
      </View>
    </View>
  );
}

function LoadingDots() {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dot1, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dot1, {
          toValue: 0.3,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dot2, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dot2, {
          toValue: 0.3,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dot3, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dot3, {
          toValue: 0.3,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <View style={styles.dotsContainer}>
      <Animated.View style={[styles.dot, { opacity: dot1 }]} />
      <Animated.View style={[styles.dot, { opacity: dot2 }]} />
      <Animated.View style={[styles.dot, { opacity: dot3 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowContainer: {
    position: 'absolute',
    width: SCREEN_WIDTH * 1.5,
    height: SCREEN_HEIGHT * 0.7,
  },
  glow: {
    flex: 1,
  },
  logoContainer: {
    marginBottom: 28,
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 12,
  },
  logo: {
    width: 110,
    height: 110,
    borderRadius: 28,
  },
  wordmark: {
    width: 320,
    height: 84,
  },
  tagline: {
    ...typography.bodyMedium,
    color: colors.neutral.textSecondary,
    marginTop: 12,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 80,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary.main,
    marginHorizontal: 4,
  },
});
