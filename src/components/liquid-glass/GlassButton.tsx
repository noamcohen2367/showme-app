// ============================================
// ShowMI App — GlassButton
// iOS 26+  : SwiftUI Button via @expo/ui with buttonStyle('glass' | 'glassProminent')
// Other    : React Native TouchableOpacity with glass-like styling
// ============================================

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { supportsGlassEffect, glassFallback } from './glassHelpers';
import { colors, typography, spacing, borderRadius } from '../../theme/theme';

// ── SwiftUI imports (iOS only, tree-shaken on Android via Platform guard) ──
let SwiftUIButton: React.ComponentType<any> | null = null;
let SwiftUIText: React.ComponentType<any> | null = null;
let SwiftUIHStack: React.ComponentType<any> | null = null;
let SwiftUIImage: React.ComponentType<any> | null = null;
let SwiftUIHost: React.ComponentType<any> | null = null;
let buttonStyleMod: ((s: string) => object) | null = null;
let paddingMod: ((p: object) => object) | null = null;
let cornerRadiusMod: ((r: number) => object) | null = null;

if (supportsGlassEffect) {
  try {
    const sui = require('@expo/ui/swift-ui');
    const mods = require('@expo/ui/swift-ui/modifiers');
    SwiftUIButton = sui.Button;
    SwiftUIText = sui.Text;
    SwiftUIHStack = sui.HStack;
    SwiftUIImage = sui.Image;
    SwiftUIHost = sui.Host;
    buttonStyleMod = mods.buttonStyle;
    paddingMod = mods.padding;
    cornerRadiusMod = mods.cornerRadius;
  } catch {
    // @expo/ui not available in this build — fall through to RN fallback
  }
}

// ── Props ──────────────────────────────────────────────────────────────────

export interface GlassButtonProps {
  label: string;
  onPress: () => void;
  /** Use the more prominent glass variant (white fill) */
  prominent?: boolean;
  /** SF Symbol name shown to the left of the label (iOS only) */
  iconSystemName?: string;
  /** Ionicons name shown on Android / when SF Symbol unavailable */
  iconName?: keyof typeof Ionicons.glyphMap;
}

// ── Component ──────────────────────────────────────────────────────────────

export default function GlassButton({
  label,
  onPress,
  prominent = false,
  iconSystemName,
  iconName,
}: GlassButtonProps) {
  // ── iOS: SwiftUI path ────────────────────────────────────────────────────
  if (
    supportsGlassEffect &&
    SwiftUIHost &&
    SwiftUIButton &&
    buttonStyleMod &&
    paddingMod &&
    cornerRadiusMod
  ) {
    const B = SwiftUIButton;
    const H = SwiftUIHStack;
    const Img = SwiftUIImage;
    const Txt = SwiftUIText;
    const Host = SwiftUIHost;

    return (
      <Host matchContents>
        <B
          onPress={onPress}
          modifiers={[
            paddingMod({ horizontal: 16, vertical: 10 }),
            cornerRadiusMod(14),
            buttonStyleMod(prominent ? 'glassProminent' : 'glass'),
          ]}
        >
          {H && iconSystemName ? (
            <H spacing={6}>
              {Img && (
                <Img systemName={iconSystemName} size={16} />
              )}
              {Txt && <Txt>{label}</Txt>}
            </H>
          ) : (
            Txt ? <Txt>{label}</Txt> : null
          )}
        </B>
      </Host>
    );
  }

  // ── Android / fallback: React Native path ───────────────────────────────
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, prominent && styles.buttonProminent]}
      activeOpacity={0.75}
    >
      <View style={styles.row}>
        {iconName && (
          <Ionicons
            name={iconName}
            size={16}
            color={prominent ? colors.neutral.background : glassFallback.textPrimary}
            style={styles.icon}
          />
        )}
        <Text style={[styles.label, prominent && styles.labelProminent]}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// ── Styles (RN fallback) ────────────────────────────────────────────────────

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: borderRadius.md,
    backgroundColor: glassFallback.background,
    borderWidth: 1,
    borderColor: glassFallback.border,
  },
  buttonProminent: {
    backgroundColor: colors.primary.main,
    borderColor: 'transparent',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginEnd: spacing.xs,
  },
  label: {
    ...typography.labelLarge,
    color: glassFallback.textPrimary,
  },
  labelProminent: {
    color: '#FFFFFF',
  },
});
