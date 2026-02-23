// ============================================
// ShowMI App — GlassCard
// iOS 26+  : expo-glass-effect GlassView as absolute background
// Other    : React Native View with glass-like fallback styling
// ============================================
// GlassCard wraps any React Native children. The glass surface is
// provided by a GlassView overlay (UIVisualEffectView) so children
// remain normal RN components on all platforms.
// ============================================

import React from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { glassFallback, supportsGlassEffect } from './glassHelpers';
import { borderRadius, spacing } from '../../theme/theme';

// ── expo-glass-effect (iOS only) ───────────────────────────────────────────

let GlassView: React.ComponentType<any> | null = null;
let isLiquidGlassAvailable: (() => boolean) | null = null;

if (supportsGlassEffect) {
  try {
    const pkg = require('expo-glass-effect');
    GlassView = pkg.GlassView;
    isLiquidGlassAvailable = pkg.isLiquidGlassAvailable;
  } catch {
    // expo-glass-effect not in this build — use RN fallback
  }
}

// ── Props ──────────────────────────────────────────────────────────────────

export interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** 'clear' = fully transparent glass; 'regular' = tinted material (default) */
  variant?: 'clear' | 'regular';
  /** Extra padding inside the card */
  padding?: number;
}

// ── Component ──────────────────────────────────────────────────────────────

export default function GlassCard({
  children,
  style,
  variant = 'regular',
  padding: pad,
}: GlassCardProps) {
  const glassAvailable =
    supportsGlassEffect &&
    GlassView !== null &&
    isLiquidGlassAvailable?.() === true;

  const innerPad = pad ?? spacing.lg;

  if (glassAvailable && GlassView) {
    const GV = GlassView;
    return (
      <View style={[styles.container, style]}>
        {/* Native UIVisualEffectView — renders behind children */}
        <GV
          style={StyleSheet.absoluteFill}
          glassEffectStyle={variant}
        />
        <View style={[styles.inner, { padding: innerPad }]}>
          {children}
        </View>
      </View>
    );
  }

  // ── Fallback (Android / older iOS) ─────────────────────────────────────
  return (
    <View style={[styles.fallback, style, { padding: innerPad }]}>
      {children}
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: glassFallback.border,
  },
  inner: {
    // Content sits above GlassView
  },
  fallback: {
    borderRadius: borderRadius.xl,
    backgroundColor: glassFallback.background,
    borderWidth: 1,
    borderColor: glassFallback.border,
  },
});
