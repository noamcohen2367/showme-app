// ============================================
// ShowMI App — Liquid Glass Dashboard Demo
// Equivalent to /liquid-glass/index route
// ============================================
// iOS 26+ : Full SwiftUI layout inside <Host>
//           - Glass header (wordmark + subtitle)
//           - 5 glass action chips using buttonStyle('glass')
//           - Expandable panel animated with Animation.spring()
// Other   : Pure React Native fallback with glass-like styling
// ============================================

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';

import { colors, typography, spacing, borderRadius } from '../theme/theme';
import { supportsGlassEffect, glassFallback, SwiftUIBoundary } from '../components/liquid-glass/glassHelpers';
import GlassCard from '../components/liquid-glass/GlassCard';
import GlassButton from '../components/liquid-glass/GlassButton';

// ── SwiftUI imports (iOS only) ─────────────────────────────────────────────

let Host: React.ComponentType<any> | null = null;
let VStack: React.ComponentType<any> | null = null;
let HStack: React.ComponentType<any> | null = null;
let SUIText: React.ComponentType<any> | null = null;
let SUIButton: React.ComponentType<any> | null = null;
let SUIImage: React.ComponentType<any> | null = null;
let Spacer: React.ComponentType<any> | null = null;
let ScrollViewSUI: React.ComponentType<any> | null = null;

let glassEffect: ((p?: object) => object) | null = null;
let padding: ((p?: object) => object) | null = null;
let cornerRadius: ((r: number) => object) | null = null;
let buttonStyle: ((s: string) => object) | null = null;
let animation: ((anim: object, val: any) => object) | null = null;
let Animation: { spring: (p?: object) => object } | null = null;
let frame: ((p: object) => object) | null = null;
let foregroundColor: ((c: string) => object) | null = null;
let shadow: ((p: object) => object) | null = null;
let opacity: ((v: number) => object) | null = null;
let scaleEffect: ((p: object | number) => object) | null = null;

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
    Spacer = sui.Spacer;
    ScrollViewSUI = sui.ScrollView;
    glassEffect = mods.glassEffect;
    padding = mods.padding;
    cornerRadius = mods.cornerRadius;
    buttonStyle = mods.buttonStyle;
    animation = mods.animation;
    Animation = mods.Animation;
    frame = mods.frame;
    foregroundColor = mods.foregroundColor;
    shadow = mods.shadow;
    opacity = mods.opacity;
    scaleEffect = mods.scaleEffect;
  } catch {
    // Fallback to RN layout
  }
}

// ── Chip data ──────────────────────────────────────────────────────────────

const CHIPS = [
  { id: 'tonight',  label: 'Tonight',   icon: 'moon.stars',      ionicon: 'moon-outline' as const },
  { id: 'trending', label: 'Trending',  icon: 'flame',            ionicon: 'flame-outline' as const },
  { id: 'nearme',   label: 'Near Me',   icon: 'location',         ionicon: 'location-outline' as const },
  { id: 'deals',    label: 'Deals',     icon: 'tag',              ionicon: 'pricetag-outline' as const },
  { id: 'saved',    label: 'Saved',     icon: 'bookmark.fill',    ionicon: 'bookmark-outline' as const },
] as const;

// ── Screen ─────────────────────────────────────────────────────────────────

export default function LiquidGlassDemoScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [expanded, setExpanded] = useState(false);
  const [activeChip, setActiveChip] = useState<string | null>(null);
  const [hostFailed, setHostFailed] = useState(false);
  const handleHostCrash = useCallback(() => setHostFailed(true), []);

  const handleChip = (id: string) => {
    setActiveChip(prev => (prev === id ? null : id));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* ── Gradient background (always rendered) ── */}
      <LinearGradient
        colors={['#0C0B1E', '#121028', '#1C1A38', '#0C0B1E']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.3, y: 0 }}
        end={{ x: 0.7, y: 1 }}
      />

      {/* ── Glow orb ── */}
      <View style={[styles.glowOrb, { top: insets.top + 80 }]} />

      {/* ── Back button (RN layer — always accessible) ── */}
      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + 8 }]}
        onPress={() => navigation.goBack()}
      >
        <View style={styles.backButtonInner}>
          <Ionicons name="arrow-back" size={20} color={glassFallback.textPrimary} />
        </View>
      </TouchableOpacity>

      {supportsGlassEffect && !hostFailed && Host && VStack && HStack && SUIText && SUIButton && SUIImage &&
       glassEffect && padding && cornerRadius && buttonStyle && animation && Animation &&
       frame && foregroundColor ? (
        // ══════════════════════════════════════════════════════════════════
        // iOS 26+ — Full SwiftUI path (wrapped in boundary; if HostView
        // isn't registered in this build, falls back to the RN path below)
        // ══════════════════════════════════════════════════════════════════
        <SwiftUIBoundary fallback={null} onCrash={handleHostCrash}>
        <Host
          style={[StyleSheet.absoluteFill, { paddingTop: insets.top + 56 }]}
        >
          <VStack spacing={24}>

            {/* Header glass card */}
            <SUIText
              modifiers={[
                padding({ horizontal: 24, vertical: 20 }),
                glassEffect({ glass: { variant: 'clear' } }),
                cornerRadius(24),
              ]}
            >
              {/* Inner HStack: logo placeholder + title */}
            </SUIText>

            {/* Wordmark + subtitle */}
            <HStack spacing={0}>
              <VStack spacing={4}>
                <SUIText
                  modifiers={[
                    foregroundColor('#F0EFFF'),
                    { type: 'font', params: { size: 34, weight: 'bold' } },
                  ]}
                >
                  ShowMI
                </SUIText>
                <SUIText
                  modifiers={[
                    foregroundColor('#A9A8C8'),
                    { type: 'font', params: { size: 15 } },
                  ]}
                >
                  Discover tonight's best shows
                </SUIText>
              </VStack>
              {Spacer && <Spacer />}
            </HStack>

            {/* Glass chips row */}
            <HStack spacing={10}>
              {CHIPS.map(chip => (
                <SUIButton
                  key={chip.id}
                  onPress={() => handleChip(chip.id)}
                  modifiers={[
                    padding({ horizontal: 14, vertical: 9 }),
                    cornerRadius(20),
                    buttonStyle(activeChip === chip.id ? 'glassProminent' : 'glass'),
                    animation(
                      Animation.spring({ dampingFraction: 0.7, response: 0.4 }),
                      activeChip === chip.id,
                    ),
                  ]}
                >
                  <HStack spacing={5}>
                    <SUIImage systemName={chip.icon} size={14} />
                    <SUIText
                      modifiers={[
                        { type: 'font', params: { size: 13, weight: 'semibold' } },
                      ]}
                    >
                      {chip.label}
                    </SUIText>
                  </HStack>
                </SUIButton>
              ))}
            </HStack>

            {/* Expandable panel */}
            <VStack
              spacing={0}
              modifiers={[
                glassEffect({ glass: { variant: 'regular' } }),
                cornerRadius(20),
                padding({ all: expanded ? 20 : 16 }),
                animation(
                  Animation.spring({ dampingFraction: 0.75, response: 0.5 }),
                  expanded,
                ),
              ]}
            >
              <HStack spacing={0}>
                <SUIText
                  modifiers={[
                    foregroundColor('#F0EFFF'),
                    { type: 'font', params: { size: 17, weight: 'semibold' } },
                  ]}
                >
                  Tonight's Pick
                </SUIText>
                {Spacer && <Spacer />}
                <SUIButton
                  onPress={() => setExpanded(e => !e)}
                  modifiers={[
                    buttonStyle('glass'),
                    padding({ all: 6 }),
                    cornerRadius(10),
                  ]}
                >
                  <SUIImage
                    systemName={expanded ? 'chevron.up' : 'chevron.down'}
                    size={14}
                  />
                </SUIButton>
              </HStack>

              {expanded && (
                <VStack
                  spacing={8}
                  modifiers={[
                    padding({ top: 12 }),
                    opacity ? opacity(1) : {},
                    animation(
                      Animation.spring({ dampingFraction: 0.8, response: 0.4 }),
                      expanded,
                    ),
                  ]}
                >
                  {['Hamilton', 'Les Misérables', 'Phantom of the Opera'].map(show => (
                    <HStack key={show} spacing={10}>
                      <SUIImage systemName="music.note" size={16} />
                      <SUIText modifiers={[foregroundColor('#F0EFFF')]}>
                        {show}
                      </SUIText>
                    </HStack>
                  ))}
                </VStack>
              )}
            </VStack>

            {/* Bottom CTA */}
            <SUIButton
              onPress={() => {}}
              modifiers={[
                padding({ horizontal: 32, vertical: 14 }),
                cornerRadius(16),
                buttonStyle('glassProminent'),
              ]}
            >
              <HStack spacing={8}>
                <SUIImage systemName="ticket" size={16} />
                <SUIText
                  modifiers={[
                    { type: 'font', params: { size: 16, weight: 'semibold' } },
                  ]}
                >
                  Explore All Shows
                </SUIText>
              </HStack>
            </SUIButton>

          </VStack>
        </Host>
        </SwiftUIBoundary>
      ) : (
        // ══════════════════════════════════════════════════════════════════
        // Android / older iOS — React Native fallback
        // ══════════════════════════════════════════════════════════════════
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + 64 },
          ]}
        >
          {/* Header card */}
          <GlassCard style={styles.headerCard} variant="clear">
            <Image
              source={require('../../assets/wordmark.png')}
              style={styles.wordmark}
              contentFit="contain"
            />
            <Text style={styles.subtitle}>Discover tonight's best shows</Text>
          </GlassCard>

          {/* Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsRow}
          >
            {CHIPS.map(chip => (
              <TouchableOpacity
                key={chip.id}
                style={[
                  styles.chip,
                  activeChip === chip.id && styles.chipActive,
                ]}
                onPress={() => handleChip(chip.id)}
              >
                <Ionicons
                  name={chip.ionicon}
                  size={14}
                  color={
                    activeChip === chip.id
                      ? '#FFF'
                      : glassFallback.textPrimary
                  }
                />
                <Text
                  style={[
                    styles.chipLabel,
                    activeChip === chip.id && styles.chipLabelActive,
                  ]}
                >
                  {chip.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Expandable panel */}
          <GlassCard style={styles.panel}>
            <TouchableOpacity
              style={styles.panelHeader}
              onPress={() => setExpanded(e => !e)}
            >
              <Text style={styles.panelTitle}>Tonight's Pick</Text>
              <Ionicons
                name={expanded ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={glassFallback.textSecondary}
              />
            </TouchableOpacity>

            {expanded && (
              <View style={styles.panelBody}>
                {['Hamilton', 'Les Misérables', 'Phantom of the Opera'].map(show => (
                  <View key={show} style={styles.showRow}>
                    <Ionicons name="musical-notes" size={16} color={colors.primary.main} />
                    <Text style={styles.showName}>{show}</Text>
                  </View>
                ))}
              </View>
            )}
          </GlassCard>

          {/* CTA */}
          <GlassButton
            label="Explore All Shows"
            onPress={() => {}}
            prominent
            iconName="search-outline"
          />
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
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(108,92,231,0.18)',
  },
  backButton: {
    position: 'absolute',
    start: spacing.lg,
    zIndex: 10,
  },
  backButtonInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: glassFallback.background,
    borderWidth: 1,
    borderColor: glassFallback.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // ── RN fallback styles ──
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  headerCard: {
    alignItems: 'flex-start',
  },
  wordmark: {
    width: 160,
    height: 42,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.bodyMedium,
    color: glassFallback.textSecondary,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: glassFallback.background,
    borderWidth: 1,
    borderColor: glassFallback.border,
  },
  chipActive: {
    backgroundColor: colors.primary.main,
    borderColor: 'transparent',
  },
  chipLabel: {
    ...typography.labelMedium,
    color: glassFallback.textPrimary,
  },
  chipLabelActive: {
    color: '#FFFFFF',
  },
  panel: {
    overflow: 'hidden',
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  panelTitle: {
    ...typography.headingSmall,
    color: glassFallback.textPrimary,
  },
  panelBody: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  showRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  showName: {
    ...typography.bodyMedium,
    color: glassFallback.textPrimary,
  },
});
