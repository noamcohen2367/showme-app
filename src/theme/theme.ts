// ============================================
// ShowME App - Theme Configuration
// ============================================
// A dark, cinematic theater theme with aurora
// purple/magenta glows and minimalist aesthetic

import { Platform, TextStyle } from 'react-native';

// ============================================
// Color Palette - Dark Aurora Theme
// ============================================

export const colors = {
  // Primary colors - Magenta/Purple aurora
  primary: {
    main: '#A855F7',       // Vibrant purple
    light: '#C084FC',      // Light purple
    dark: '#7C3AED',       // Deep purple
    contrast: '#FFFFFF',   // Text on primary
    glow: 'rgba(168, 85, 247, 0.4)', // Glow effect
  },
  
  // Secondary colors - Pink/Magenta accent
  secondary: {
    main: '#EC4899',       // Hot pink/magenta
    light: '#F472B6',      // Light pink
    dark: '#DB2777',       // Deep pink
    contrast: '#FFFFFF',   // Text on secondary
    glow: 'rgba(236, 72, 153, 0.4)', // Glow effect
  },
  
  // Accent - Cyan/Teal for highlights
  accent: {
    main: '#06B6D4',       // Cyan
    light: '#22D3EE',      // Light cyan
    dark: '#0891B2',       // Deep cyan
    glow: 'rgba(6, 182, 212, 0.4)',
  },
  
  // Dark backgrounds
  dark: {
    900: '#0A0A0F',        // Deepest black
    800: '#12121A',        // Main background
    700: '#1A1A25',        // Card background
    600: '#242432',        // Elevated surface
    500: '#2E2E3D',        // Border/divider
    400: '#3D3D4F',        // Subtle highlight
  },
  
  // Neutral colors
  neutral: {
    white: '#FFFFFF',
    background: '#0A0A0F',     // Deep black
    surface: '#12121A',        // Card backgrounds
    surfaceAlt: '#1A1A25',     // Alternative surface
    border: '#2E2E3D',         // Borders
    borderLight: '#3D3D4F',    // Light borders
    text: '#FFFFFF',           // Primary text
    textSecondary: '#A1A1AA',  // Secondary text (zinc-400)
    textTertiary: '#71717A',   // Tertiary text (zinc-500)
    disabled: '#52525B',       // Disabled state
    placeholder: '#71717A',    // Placeholder text
  },
  
  // Semantic colors
  semantic: {
    success: '#10B981',        // Emerald
    successLight: 'rgba(16, 185, 129, 0.15)',
    error: '#EF4444',          // Red
    errorLight: 'rgba(239, 68, 68, 0.15)',
    warning: '#F59E0B',        // Amber
    warningLight: 'rgba(245, 158, 11, 0.15)',
    info: '#3B82F6',           // Blue
    infoLight: 'rgba(59, 130, 246, 0.15)',
  },
  
  // Seat zone colors (for interactive map)
  zones: {
    premium: '#F59E0B',    // Gold/Amber - best seats
    a: '#A855F7',          // Purple - zone A
    b: '#06B6D4',          // Cyan - zone B
    c: '#3B82F6',          // Blue - zone C
    economy: '#6B7280',    // Gray - economy
    occupied: '#3D3D4F',   // Dark gray - taken
    selected: '#10B981',   // Green - selected
  },
  
  // Badge colors
  badges: {
    popular: '#F59E0B',        // Amber
    sellingFast: '#EF4444',    // Red
    specialPrice: '#10B981',   // Green
    lastChance: '#F97316',     // Orange
    new: '#A855F7',            // Purple
  },
  
  // User level colors
  levels: {
    bronze: '#CD7F32',
    silver: '#9CA3AF',
    gold: '#F59E0B',
  },
  
  // Gradient definitions (for reference in components)
  gradients: {
    aurora: ['#A855F7', '#EC4899', '#06B6D4'],
    purple: ['#7C3AED', '#A855F7'],
    pink: ['#DB2777', '#EC4899'],
    dark: ['#0A0A0F', '#12121A', '#1A1A25'],
  },
};

// ============================================
// Typography
// ============================================

const fontFamily = Platform.select({
  ios: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  android: {
    regular: 'Roboto',
    medium: 'Roboto-Medium',
    semibold: 'Roboto-Medium',
    bold: 'Roboto-Bold',
  },
  default: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
});

export const typography = {
  // Display - for hero titles
  displayLarge: {
    fontSize: 40,
    fontWeight: '700' as const,
    lineHeight: 48,
    letterSpacing: -1,
  } as TextStyle,
  
  displayMedium: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
    letterSpacing: -0.5,
  } as TextStyle,
  
  displaySmall: {
    fontSize: 28,
    fontWeight: '600' as const,
    lineHeight: 36,
    letterSpacing: -0.5,
  } as TextStyle,
  
  // Headings
  headingLarge: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
    letterSpacing: -0.3,
  } as TextStyle,
  
  headingMedium: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
    letterSpacing: -0.2,
  } as TextStyle,
  
  headingSmall: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  } as TextStyle,
  
  // Body text
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  } as TextStyle,
  
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  } as TextStyle,
  
  bodySmall: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  } as TextStyle,
  
  // Labels
  labelLarge: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
    letterSpacing: 0.1,
  } as TextStyle,
  
  labelMedium: {
    fontSize: 12,
    fontWeight: '600' as const,
    lineHeight: 16,
    letterSpacing: 0.1,
  } as TextStyle,
  
  labelSmall: {
    fontSize: 10,
    fontWeight: '600' as const,
    lineHeight: 14,
    letterSpacing: 0.2,
  } as TextStyle,
  
  // Special
  price: {
    fontSize: 22,
    fontWeight: '700' as const,
    lineHeight: 28,
  } as TextStyle,
  
  caption: {
    fontSize: 11,
    fontWeight: '400' as const,
    lineHeight: 14,
    letterSpacing: 0.2,
  } as TextStyle,
};

// ============================================
// Spacing
// ============================================

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

// ============================================
// Border Radius
// ============================================

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

// ============================================
// Shadows - Glow Effects
// ============================================

export const shadows = {
  // Subtle glow
  glow: {
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  
  // Strong glow
  glowStrong: {
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  
  // Pink glow
  glowPink: {
    shadowColor: colors.secondary.main,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  
  // Card shadow (subtle)
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  
  // Elevated shadow
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  
  // Bottom navigation shadow
  bottomNav: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 16,
  },
};

// ============================================
// Animation Durations
// ============================================

export const animations = {
  fast: 150,
  normal: 300,
  slow: 500,
  verySlow: 800,
};

// ============================================
// Component-specific tokens
// ============================================

export const components = {
  button: {
    height: {
      small: 36,
      medium: 44,
      large: 52,
    },
    borderRadius: borderRadius.md,
  },
  
  input: {
    height: 48,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  
  bottomTab: {
    height: 80,
    iconSize: 24,
  },
  
  header: {
    height: 56,
  },
};

// ============================================
// Theme Export
// ============================================

const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  animations,
  components,
};

export default theme;
