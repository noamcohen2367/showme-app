// ============================================
// ShowMI App — Liquid Glass Helpers
// ============================================
// Gate for Liquid Glass: requires iOS 26+ at runtime.
// @expo/ui SwiftUI components are only available on iOS.
// All non-iOS platforms receive styled RN fallback layouts.
// ============================================

import React from 'react';
import { Platform } from 'react-native';

/**
 * Returns true only on iOS (glassEffect / SwiftUI host supported).
 * We intentionally keep this as a simple OS check — the runtime
 * `isLiquidGlassAvailable()` from expo-glass-effect provides the
 * finer-grained iOS-version gate inside GlassCard.
 */
export const supportsGlassEffect = Platform.OS === 'ios';

/**
 * Shared glass-like fallback colors for non-glass surfaces.
 * Maps to the existing ShowMI dark theme tokens.
 */
export const glassFallback = {
  background: 'rgba(255, 255, 255, 0.08)',
  border: 'rgba(255, 255, 255, 0.14)',
  textPrimary: '#F0EFFF',
  textSecondary: '#A9A8C8',
} as const;

// ── SwiftUI Error Boundary ─────────────────────────────────────────────────
// Catches "Unimplemented component: ExpoUI_HostView_*" when @expo/ui's
// native module is present as a JS bundle but the native view isn't registered
// (e.g. running in Expo Go without a full dev build).

interface SwiftUIBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
  /** Called after the native Host view fails to mount (e.g. Expo Go without dev build). */
  onCrash?: () => void;
}

interface SwiftUIBoundaryState {
  crashed: boolean;
}

export class SwiftUIBoundary extends React.Component<
  SwiftUIBoundaryProps,
  SwiftUIBoundaryState
> {
  state: SwiftUIBoundaryState = { crashed: false };

  static getDerivedStateFromError(): SwiftUIBoundaryState {
    return { crashed: true };
  }

  componentDidCatch() {
    // Notify parent so it can flip to the RN fallback path on next render
    this.props.onCrash?.();
  }

  render() {
    if (this.state.crashed) return this.props.fallback;
    return this.props.children;
  }
}
