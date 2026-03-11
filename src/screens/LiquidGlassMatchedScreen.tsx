// ============================================
// ShowMI App — Liquid Glass Matched Transitions
// Equivalent to /liquid-glass/matched route
// ============================================
// Demonstrates the "matched Liquid Glass" animation system:
//   <Namespace id="...">
//     <GlassEffectContainer spacing={...} modifiers={[animation(...)]}>
//       Each shape carries glassEffect + glassEffectId(uniqueId, namespaceId)
//     </GlassEffectContainer>
//   </Namespace>
//
// When the `expanded` state changes, the GlassEffectContainer animates
// with Animation.spring(), causing glass shapes to morph / merge / separate
// in a fluid, native SwiftUI matched-identity transition.
//
// iOS 26+ : Full SwiftUI matched glass demo via @expo/ui
// Other   : React Native grid with animated opacity/scale fallback
// ============================================

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing, borderRadius } from '../theme/theme';
import { supportsGlassEffect, glassFallback, SwiftUIBoundary } from '../components/liquid-glass/glassHelpers';

// ── SwiftUI imports (iOS only) ─────────────────────────────────────────────

let Host: React.ComponentType<any> | null = null;
let VStack: React.ComponentType<any> | null = null;
let HStack: React.ComponentType<any> | null = null;
let SUIText: React.ComponentType<any> | null = null;
let SUIButton: React.ComponentType<any> | null = null;
let SUIImage: React.ComponentType<any> | null = null;
let GlassEffectContainer: React.ComponentType<any> | null = null;
let Namespace: React.ComponentType<any> | null = null;
let Spacer: React.ComponentType<any> | null = null;

let glassEffect: ((p?: object) => object) | null = null;
let glassEffectId: ((id: string, nsId: string) => object) | null = null;
let padding: ((p?: object) => object) | null = null;
let cornerRadius: ((r: number) => object) | null = null;
let buttonStyle: ((s: string) => object) | null = null;
let animation: ((anim: object, val: any) => object) | null = null;
let Animation: { spring: (p?: object) => object } | null = null;
let frame: ((p: object) => object) | null = null;
let foregroundColor: ((c: string) => object) | null = null;
let opacity: ((v: number) => object) | null = null;

if (supportsGlassEffect) {
  try {
    const sui = require('@expo/ui/swift-ui');
    const mods = require('@expo/ui/swift-ui/modifiers');
    Host = sui.Host;
    VStack = sui.VStack;
    HStack = sui.HStack;
    SUIText = sui.Text;
    SUIButton = sui.Button;
    SUIImage = sui.Image;
    GlassEffectContainer = sui.GlassEffectContainer;
    Namespace = sui.Namespace;
    Spacer = sui.Spacer;
    glassEffect = mods.glassEffect;
    glassEffectId = mods.glassEffectId;
    padding = mods.padding;
    cornerRadius = mods.cornerRadius;
    buttonStyle = mods.buttonStyle;
    animation = mods.animation;
    Animation = mods.Animation;
    frame = mods.frame;
    foregroundColor = mods.foregroundColor;
    opacity = mods.opacity;
  } catch {
    // Fallback to RN layout
  }
}

// ── Static namespace ID (preferred over dynamic useId) ────────────────────
// The Expo UI team recommends static namespace IDs; dynamic ones require
// an internal workaround and may animate less reliably.
const GLASS_NS = 'showmi-matched-glass-v1';

// ── SF Symbol icon data ────────────────────────────────────────────────────

const ICONS_BASE = [
  { id: 'music',    sym: 'music.note',          ionicon: 'musical-notes-outline' as const, color: '#C084FC' },
  { id: 'star',     sym: 'star.fill',            ionicon: 'star-outline' as const,          color: '#FBBF24' },
  { id: 'heart',    sym: 'heart.fill',           ionicon: 'heart-outline' as const,         color: '#FB7185' },
  { id: 'bolt',     sym: 'bolt.fill',            ionicon: 'flash-outline' as const,         color: '#60A5FA' },
] as const;

const ICONS_EXTRA = [
  { id: 'ticket',   sym: 'ticket.fill',          ionicon: 'ticket-outline' as const,        color: '#34D399' },
  { id: 'camera',   sym: 'camera.fill',          ionicon: 'camera-outline' as const,        color: '#F97316' },
  { id: 'globe',    sym: 'globe',                ionicon: 'globe-outline' as const,         color: '#6C5CE7' },
  { id: 'mask',     sym: 'theatermasks.fill',    ionicon: 'happy-outline' as const,         color: '#E8195A' },
] as const;

// ── Screen ─────────────────────────────────────────────────────────────────

export default function LiquidGlassMatchedScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [expanded, setExpanded] = useState(false);
  const [hostFailed, setHostFailed] = useState(false);
  const handleHostCrash = useCallback(() => setHostFailed(true), []);

  // RN fallback animation values
  const [rnFadeAnims] = useState(() =>
    ICONS_EXTRA.map(() => new Animated.Value(0)),
  );
  const [rnScaleAnims] = useState(() =>
    ICONS_EXTRA.map(() => new Animated.Value(0.7)),
  );

  const toggleExpanded = () => {
    const toValue = expanded ? 0 : 1;
    const toScale = expanded ? 0.7 : 1;
    setExpanded(e => !e);

    // RN fallback stagger animation
    Animated.stagger(
      40,
      ICONS_EXTRA.map((_, i) =>
        Animated.parallel([
          Animated.spring(rnFadeAnims[i], {
            toValue,
            useNativeDriver: true,
            damping: 14,
            stiffness: 180,
          }),
          Animated.spring(rnScaleAnims[i], {
            toValue: toScale,
            useNativeDriver: true,
            damping: 14,
            stiffness: 180,
          }),
        ]),
      ),
    ).start();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background */}
      <LinearGradient
        colors={['#0C0B1E', '#1C1A38', '#0C0B1E']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />

      {/* Glow */}
      <View style={[styles.glowOrb, { top: insets.top + 60 }]} />

      {/* Back button */}
      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + 8 }]}
        onPress={() => navigation.goBack()}
      >
        <View style={styles.backInner}>
          <Ionicons name="arrow-back" size={20} color={glassFallback.textPrimary} />
        </View>
      </TouchableOpacity>

      {supportsGlassEffect && !hostFailed && Host && VStack && HStack && SUIText && SUIButton && SUIImage &&
       GlassEffectContainer && Namespace &&
       glassEffect && glassEffectId && padding && cornerRadius && buttonStyle &&
       animation && Animation && frame && foregroundColor ? (
        // ════════════════════════════════════════════════════════════════
        // iOS 26+ — SwiftUI Matched Liquid Glass path
        // ════════════════════════════════════════════════════════════════
        <SwiftUIBoundary fallback={null} onCrash={handleHostCrash}>
        <Host
          style={[StyleSheet.absoluteFill, { paddingTop: insets.top + 60 }]}
        >
          <VStack spacing={32}>

            {/* Page header */}
            <VStack spacing={6}>
              <SUIText
                modifiers={[
                  foregroundColor('#F0EFFF'),
                  { type: 'font', params: { size: 28, weight: 'bold' } },
                ]}
              >
                Matched Glass
              </SUIText>
              <SUIText
                modifiers={[
                  foregroundColor('#A9A8C8'),
                  { type: 'font', params: { size: 15 } },
                ]}
              >
                Tap the button — shapes morph together
              </SUIText>
            </VStack>

            {/* ── The matched glass demo ── */}
            {/* Namespace coordinates the glassEffect identity transitions */}
            <Namespace id={GLASS_NS}>
              <GlassEffectContainer
                spacing={10}
                modifiers={[
                  animation(
                    Animation.spring({ dampingFraction: 0.72, response: 0.48 }),
                    expanded,
                  ),
                  padding({ all: 16 }),
                  cornerRadius(28),
                ]}
              >
                {/* Base icons — always visible */}
                <HStack spacing={10}>
                  {ICONS_BASE.map(icon => (
                    <SUIImage
                      key={icon.id}
                      systemName={icon.sym}
                      size={28}
                      modifiers={[
                        frame({ width: 60, height: 60 }),
                        padding({ all: 14 }),
                        glassEffect({ glass: { variant: 'clear' } }),
                        glassEffectId(icon.id, GLASS_NS),
                        cornerRadius(16),
                      ]}
                    />
                  ))}
                </HStack>

                {/* Extra icons — appear when expanded */}
                {expanded && (
                  <HStack
                    spacing={10}
                    modifiers={[
                      padding({ top: 10 }),
                      animation(
                        Animation.spring({ dampingFraction: 0.75, response: 0.45 }),
                        expanded,
                      ),
                    ]}
                  >
                    {ICONS_EXTRA.map(icon => (
                      <SUIImage
                        key={icon.id}
                        systemName={icon.sym}
                        size={28}
                        modifiers={[
                          frame({ width: 60, height: 60 }),
                          padding({ all: 14 }),
                          glassEffect({ glass: { variant: 'clear' } }),
                          glassEffectId(icon.id, GLASS_NS),
                          cornerRadius(16),
                        ]}
                      />
                    ))}
                  </HStack>
                )}
              </GlassEffectContainer>
            </Namespace>

            {/* Toggle button */}
            <SUIButton
              onPress={toggleExpanded}
              modifiers={[
                padding({ horizontal: 28, vertical: 12 }),
                cornerRadius(16),
                buttonStyle(expanded ? 'glassProminent' : 'glass'),
                animation(
                  Animation.spring({ dampingFraction: 0.7, response: 0.4 }),
                  expanded,
                ),
              ]}
            >
              <HStack spacing={8}>
                <SUIImage systemName={expanded ? 'minus.circle' : 'plus.circle'} size={18} />
                <SUIText
                  modifiers={[{ type: 'font', params: { size: 15, weight: 'semibold' } }]}
                >
                  {expanded ? 'Collapse' : 'Expand'}
                </SUIText>
              </HStack>
            </SUIButton>

            {/* Info note */}
            <SUIText
              modifiers={[
                foregroundColor('#6E6D8C'),
                { type: 'font', params: { size: 13 } },
                padding({ horizontal: 8 }),
              ]}
            >
              On iOS 26+, glass shapes with glassEffectId morph fluidly
              via SwiftUI's matched-identity system inside GlassEffectContainer.
            </SUIText>

          </VStack>
        </Host>
        </SwiftUIBoundary>
      ) : (
        // ════════════════════════════════════════════════════════════════
        // Android / older iOS — React Native animated fallback
        // ════════════════════════════════════════════════════════════════
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + 64 },
          ]}
        >
          <Text style={styles.title}>Matched Glass</Text>
          <Text style={styles.subtitle}>
            Tap the button — shapes animate in/out
          </Text>

          {/* Icon grid */}
          <View style={styles.gridContainer}>
            {/* Base row */}
            <View style={styles.iconRow}>
              {ICONS_BASE.map(icon => (
                <View key={icon.id} style={styles.iconChip}>
                  <Ionicons name={icon.ionicon} size={26} color={icon.color} />
                </View>
              ))}
            </View>

            {/* Extra row (animated) */}
            <View style={styles.iconRow}>
              {ICONS_EXTRA.map((icon, i) => (
                <Animated.View
                  key={icon.id}
                  style={[
                    styles.iconChip,
                    {
                      opacity: rnFadeAnims[i],
                      transform: [{ scale: rnScaleAnims[i] }],
                    },
                  ]}
                >
                  <Ionicons name={icon.ionicon} size={26} color={icon.color} />
                </Animated.View>
              ))}
            </View>
          </View>

          {/* Toggle */}
          <TouchableOpacity
            style={[styles.toggleBtn, expanded && styles.toggleBtnActive]}
            onPress={toggleExpanded}
          >
            <Ionicons
              name={expanded ? 'remove-circle-outline' : 'add-circle-outline'}
              size={18}
              color={expanded ? '#FFF' : glassFallback.textPrimary}
            />
            <Text
              style={[styles.toggleLabel, expanded && styles.toggleLabelActive]}
            >
              {expanded ? 'Collapse' : 'Expand'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.note}>
            On iOS 26+ with a development build, glass shapes morph natively
            via SwiftUI GlassEffectContainer + Namespace + glassEffectId.
          </Text>
        </ScrollView>
      )}
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  glowOrb: {
    position: 'absolute',
    alignSelf: 'center',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(108,92,231,0.20)',
  },
  backButton: {
    position: 'absolute',
    start: spacing.lg,
    zIndex: 10,
  },
  backInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: glassFallback.background,
    borderWidth: 1,
    borderColor: glassFallback.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // ── RN fallback ──
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    gap: spacing.xl,
    alignItems: 'center',
  },
  title: {
    ...typography.displaySmall,
    color: glassFallback.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.bodyMedium,
    color: glassFallback.textSecondary,
    textAlign: 'center',
  },
  gridContainer: {
    gap: spacing.sm,
    width: '100%',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  iconChip: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: glassFallback.background,
    borderWidth: 1,
    borderColor: glassFallback.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: glassFallback.background,
    borderWidth: 1,
    borderColor: glassFallback.border,
  },
  toggleBtnActive: {
    backgroundColor: colors.primary.main,
    borderColor: 'transparent',
  },
  toggleLabel: {
    ...typography.labelLarge,
    color: glassFallback.textPrimary,
  },
  toggleLabelActive: {
    color: '#FFFFFF',
  },
  note: {
    ...typography.bodySmall,
    color: colors.neutral.textTertiary,
    textAlign: 'center',
    paddingHorizontal: spacing.sm,
  },
});
