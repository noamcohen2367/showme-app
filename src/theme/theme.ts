// ============================================
// ShowMI App - Theme Configuration
// ============================================

import { Platform, TextStyle } from 'react-native';

// ============================================
// Brand Constants (never change)
// ============================================

export const brand = {
  purple: '#6C5CE7', // primary CTA
  pink: '#E8195A', // secondary / hot accent
  blue: '#3B45D6', // deep royal blue
  glow: '#8B7FF0', // soft purple glow
};

// ============================================
// Theme Type
// ============================================

export interface Theme {
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  surface: {
    glass: string;
    card: string;
    elevated: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
  };
  border: {
    subtle: string;
    strong: string;
  };
  divider: string;
  accent: {
    primary: string;
    secondary: string;
    pressed: string;
    disabled: string;
  };
  state: {
    success: string;
    warning: string;
    danger: string;
    info: string;
  };
  effects: {
    shadowColor: string;
    glowPrimary: string;
    glowSoft: string;
    glowLogo: string;
    glassOverlay: string;
  };
  gradients: {
    hero: [string, string, string];
    accent: [string, string];
  };
}

// ============================================
// Light Tech Theme
// ============================================

export const lightTheme: Theme = {
  background: {
    primary: '#F7F8FA',
    secondary: '#FFFFFF',
    tertiary: '#EEF1F6',
  },
  surface: {
    glass: 'rgba(255,255,255,0.70)',
    card: '#FFFFFF',
    elevated: 'rgba(255,255,255,0.88)',
  },
  text: {
    primary: '#0B1220',
    secondary: '#4B5565',
    tertiary: '#7A8598',
    inverse: '#FFFFFF',
  },
  border: {
    subtle: 'rgba(15,23,42,0.10)',
    strong: 'rgba(15,23,42,0.18)',
  },
  divider: 'rgba(15,23,42,0.08)',
  accent: {
    primary: '#6C5CE7',
    secondary: '#E8195A',
    pressed: '#4F3FD4',
    disabled: 'rgba(108,92,231,0.35)',
  },
  state: {
    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#6C5CE7',
  },
  effects: {
    shadowColor: '#000000',
    glowPrimary: 'rgba(108,92,231,0.20)',
    glowSoft: 'rgba(108,92,231,0.12)',
    glowLogo: 'rgba(139,127,240,0.22)',
    glassOverlay: 'rgba(255,255,255,0.55)',
  },
  gradients: {
    hero: ['#FFFFFF', '#F0EEFF', '#EAE6FF'],
    accent: ['#6C5CE7', '#3B45D6'],
  },
};

// ============================================
// Dark Premium Theme
// ============================================

export const darkTheme: Theme = {
  background: {
    primary: '#0C0B1E',
    secondary: '#121028',
    tertiary: '#1C1A38',
  },
  surface: {
    glass: 'rgba(255,255,255,0.06)',
    card: '#1C1A38',
    elevated: 'rgba(255,255,255,0.10)',
  },
  text: {
    primary: '#F0EFFF',
    secondary: '#A9A8C8',
    tertiary: '#6E6D8C',
    inverse: '#0C0B1E',
  },
  border: {
    subtle: 'rgba(240,239,255,0.10)',
    strong: 'rgba(240,239,255,0.16)',
  },
  divider: 'rgba(240,239,255,0.07)',
  accent: {
    primary: '#6C5CE7',
    secondary: '#E8195A',
    pressed: '#4F3FD4',
    disabled: 'rgba(108,92,231,0.35)',
  },
  state: {
    success: '#34D399',
    warning: '#FBBF24',
    danger: '#FB7185',
    info: '#6C5CE7',
  },
  effects: {
    shadowColor: '#0C0B1E',
    glowPrimary: 'rgba(108,92,231,0.25)',
    glowSoft: 'rgba(108,92,231,0.14)',
    glowLogo: 'rgba(139,127,240,0.30)',
    glassOverlay: 'rgba(12,11,30,0.55)',
  },
  gradients: {
    hero: ['#0C0B1E', '#121028', '#1C1A38'],
    accent: ['#6C5CE7', '#3B45D6'],
  },
};

// ============================================
// Legacy color palette (kept for backward compat)
// Screens still importing `colors` continue to work.
// ============================================

export const colors = {
  primary: {
    main: '#6C5CE7',
    light: '#8B7FF0',
    dark: '#4F3FD4',
    contrast: '#FFFFFF',
    glow: 'rgba(108, 92, 231, 0.20)',
  },
  secondary: {
    main: '#E8195A',
    light: '#F04E7C',
    dark: '#C0144A',
    contrast: '#FFFFFF',
    glow: 'rgba(232, 25, 90, 0.20)',
  },
  accent: {
    main: '#3B45D6',
    light: '#5A62E8',
    dark: '#2A31B8',
    glow: 'rgba(59, 69, 214, 0.20)',
  },

  // ── Backgrounds / surfaces ──────────────────
  dark: {
    900: '#0C0B1E', // base background
    800: '#121028', // subtle lift
    700: '#1C1A38', // glass card fill
    600: '#26234A', // elevated surface
    500: '#322E5C', // borders / dividers
    400: '#403C72', // lighter borders
  },

  // ── Glass tokens (glassmorphism) ────────────
  glass: {
    card: 'rgba(255,255,255,0.06)',
    cardBorder: 'rgba(255,255,255,0.10)',
    elevated: 'rgba(255,255,255,0.10)',
    elevatedBorder: 'rgba(255,255,255,0.18)',
    subtle: 'rgba(255,255,255,0.03)',
    dim: 'rgba(12,11,30,0.60)',
  },

  // ── Text & neutrals ────────────────────────
  neutral: {
    white: '#FFFFFF',
    background: '#0C0B1E',
    surface: '#121028',
    surfaceAlt: '#1C1A38',
    border: '#322E5C',
    borderLight: '#403C72',
    text: '#F0EFFF',
    textSecondary: '#A9A8C8',
    textTertiary: '#6E6D8C',
    disabled: '#4D4C6A',
    placeholder: '#6E6D8C',
  },

  semantic: {
    success: '#10B981',
    successLight: 'rgba(16, 185, 129, 0.12)',
    error: '#FB7185',
    errorLight: 'rgba(251, 113, 133, 0.12)',
    warning: '#FBBF24',
    warningLight: 'rgba(251, 191, 36, 0.12)',
    info: '#6C5CE7',
    infoLight: 'rgba(108, 92, 231, 0.12)',
  },

  zones: {
    premium: '#FBBF24',
    a: '#6C5CE7',
    b: '#3B45D6',
    c: '#5A62E8',
    economy: '#6E6D8C',
    occupied: '#322E5C',
    selected: '#10B981',
  },

  badges: {
    popular: '#FBBF24',
    sellingFast: '#FB7185',
    specialPrice: '#10B981',
    lastChance: '#F97316',
    new: '#bb6cf7',
  },

  levels: {
    bronze: '#CD7F32',
    silver: '#9CA3AF',
    gold: '#FBBF24',
  },

  gradients: {
    aurora: ['#6C5CE7', '#E8195A', '#3B45D6'] as [string, string, string],
    purple: ['#4F3FD4', '#6C5CE7'] as [string, string],
    pink: ['#C0144A', '#E8195A'] as [string, string],
    dark: ['#0C0B1E', '#121028', '#1C1A38'] as [string, string, string],
  },
};

// ============================================
// Typography (theme-independent)
// ============================================

const _fontFamily = Platform.select({
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
// Spacing (theme-independent)
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
// Border Radius (theme-independent)
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
// Shadows
// ============================================

export const shadows = {
  glow: {
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  glowStrong: {
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  glowPink: {
    shadowColor: colors.secondary.main,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  card: {
    shadowColor: '#0C0B1E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 4,
  },
  glass: {
    shadowColor: '#0C0B1E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
  elevated: {
    shadowColor: '#0C0B1E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  bottomNav: {
    shadowColor: '#0C0B1E',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 16,
  },
};

// ============================================
// Animations (theme-independent)
// ============================================

export const animations = {
  fast: 150,
  normal: 300,
  slow: 500,
  verySlow: 800,
};

// ============================================
// Component tokens (theme-independent)
// ============================================

export const components = {
  button: {
    height: { small: 36, medium: 44, large: 52 },
    borderRadius: borderRadius.md,
  },
  input: { height: 48, borderRadius: borderRadius.md, borderWidth: 1 },
  card: { borderRadius: borderRadius.lg, padding: spacing.lg },
  bottomTab: { height: 80, iconSize: 24 },
  header: { height: 56 },
};

// ============================================
// Default export (legacy)
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
