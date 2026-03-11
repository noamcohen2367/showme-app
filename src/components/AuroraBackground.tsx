import React, { useRef, useEffect } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function AuroraBackground() {
  const pulse1 = useRef(new Animated.Value(0.7)).current;
  const pulse2 = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Purple layer — 4s breathing cycle
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse1, {
          toValue: 1.0,
          duration: 4000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
        Animated.timing(pulse1, {
          toValue: 0.7,
          duration: 4000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
      ])
    ).start();

    // Pink layer — 5.5s cycle, offset by 2s so peaks don't align with purple
    const pinkTimeout = setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse2, {
            toValue: 0.85,
            duration: 5500,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.sin),
          }),
          Animated.timing(pulse2, {
            toValue: 0.5,
            duration: 5500,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.sin),
          }),
        ])
      ).start();
    }, 2000);

    return () => clearTimeout(pinkTimeout);
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Layer 1: purple sweep, originates from bottom-left upward */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: pulse1 }]}>
        <LinearGradient
          colors={['transparent', 'rgba(168,85,247,0.08)', 'rgba(168,85,247,0.32)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.6, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Layer 3: pink sweep, originates from bottom-right upward */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: pulse2 }]}>
        <LinearGradient
          colors={['transparent', 'transparent', 'rgba(236,72,153,0.1)', 'rgba(236,72,153,0.18)']}
          locations={[0, 0.4, 0.75, 1]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0.2, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Layer 4: Dynamic Island mask — stronger dark at very top */}
      <View style={styles.dynamicIslandMask}>
        <LinearGradient
          colors={['rgba(26,10,46,0.9)', 'rgba(26,10,46,0.5)', 'transparent']}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dynamicIslandMask: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 90,
  },
});
