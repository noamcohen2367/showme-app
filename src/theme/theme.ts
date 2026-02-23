// ============================================
// ShowME App - Theme Configuration
// ============================================

import { Platform, TextStyle } from 'react-native';

// ============================================
// Brand Constants (never change)
// ============================================

export const brand = {
  blue:   '#2F7BFF',
  purple: '#7C3AED',
  teal:   '#2AD3C2',
  glow:   '#A78BFA',
};

// ============================================
// Theme Type
// ============================================

export interface Theme {
  background: {
    primary:   string;
    secondary: string;
    tertiary:  string;
  };
  surface: {
    glass:    string;
    card:     string;
    elevated: string;
  };
  text: {
    primary:   string;
    secondary: string;
    tertiary:  string;
    inverse:   string;
  };
  border: {
    subtle: string;
    strong: string;
  };
  divider: string;
  accent: {
    primary:   string;
    secondary: string;
    pressed:   string;
    disabled:  string;
  };
  state: {
    success: string;
    warning: string;
    danger:  string;
    info:    string;
  };
  effects: {
    shadowColor:  string;
    glowPrimary:  string;
    glowSoft:     string;
    glowLogo:     string;
    glassOverlay: string;
  };
  gradients: {
    hero:   [string, string, string];
    accent: [string, string];
  };
}

// ============================================
// Light Tech Theme
// ============================================

export const lightTheme: Theme = {
  background: {
    primary:   '#F7F8FA',
    secondary: '#FFFFFF',
    tertiary:  '#EEF1F6',
  },
  surface: {
    glass:    'rgba(255,255,255,0.70)',
    card:     '#FFFFFF',
    elevated: 'rgba(255,255,255,0.88)',
  },
  text: {
    primary:   '#0B1220',
    secondary: '#4B5565',
    tertiary:  '#7A8598',
    inverse:   '#FFFFFF',
  },
  border: {
    subtle: 'rgba(15,23,42,0.10)',
    strong: 'rgba(15,23,42,0.18)',
  },
  divider: 'rgba(15,23,42,0.08)',
  accent: {
    primary:   '#2F7BFF',
    secondary: '#7C3AED',
    pressed:   '#2463D6',
    disabled:  '#A9C7FF',
  },
  state: {
    success: '#22C55E',
    warning: '#F59E0B',
    danger:  '#EF4444',
    info:    '#2F7BFF',
  },
  effects: {
    shadowColor:  '#000000',
    glowPrimary:  'rgba(47,123,255,0.24)',
    glowSoft:     'rgba(124,58,237,0.18)',
    glowLogo:     'rgba(167,139,250,0.28)',
    glassOverlay: 'rgba(255,255,255,0.55)',
  },
  gradients: {
    hero:   ['#FFFFFF', '#EEF1FF', '#F3EEFF'],
    accent: ['#2F7BFF', '#7C3AED'],
  },
};

// ============================================
// Dark Premium Theme
// ============================================

export const darkTheme: Theme = {
  background: {
    primary:   '#070B14',
    secondary: '#0B1220',
    tertiary:  '#0F1A2D',
  },
  surface: {
    glass:    'rgba(15,26,45,0.62)',
    card:     '#0C1628',
    elevated: 'rgba(16,31,56,0.78)',
  },
  text: {
    primary:   '#EAF0FF',
    secondary: '#B7C2DA',
    tertiary:  '#7F8AA6',
    inverse:   '#0B1220',
  },
  border: {
    subtle: 'rgba(234,240,255,0.10)',
    strong: 'rgba(234,240,255,0.16)',
  },
  divider: 'rgba(234,240,255,0.08)',
  accent: {
    primary:   '#4D95FF',
    secondary: '#8B5CF6',
    pressed:   '#2F7BFF',
    disabled:  'rgba(77,149,255,0.35)',
  },
  state: {
    success: '#34D399',
    warning: '#FBBF24',
    danger:  '#FB7185',
    info:    '#4D95FF',
  },
  effects: {
    shadowColor:  '#000000',
    glowPrimary:  'rgba(77,149,255,0.30)',
    glowSoft:     'rgba(139,92,246,0.22)',
    glowLogo:     'rgba(167,139,250,0.34)',
    glassOverlay: 'rgba(15,26,45,0.55)',
  },
  gradients: {
    hero:   ['#070B14', '#0B1220', '#1B1140'],
    accent: ['#4D95FF', '#8B5CF6'],
  },
};

// ============================================
// Legacy color palette (kept for backward compat)
// Screens still importing `colors` continue to work.
// ThemeContext will eventually replace these.
// ============================================

export const colors = {
  primary: {
    main:     '#A855F7',
    light:    '#C084FC',
    dark:     '#7C3AED',
    contrast: '#FFFFFF',
    glow:     'rgba(168, 85, 247, 0.4)',
  },
  secondary: {
    main:     '#EC4899',
    light:    '#F472B6',
    dark:     '#DB2777',
    contrast: '#FFFFFF',
    glow:     'rgba(236, 72, 153, 0.4)',
  },
  accent: {
    main:  '#06B6D4',
    light: '#22D3EE',
    dark:  '#0891B2',
    glow:  'rgba(6, 182, 212, 0.4)',
  },
  dark: {
    900: '#0A0A0F',
    800: '#12121A',
    700: '#1A1A25',
    600: '#242432',
    500: '#2E2E3D',
    400: '#3D3D4F',
  },
  neutral: {
    white:          '#FFFFFF',
    background:     '#0A0A0F',
    surface:        '#12121A',
    surfaceAlt:     '#1A1A25',
    border:         '#2E2E3D',
    borderLight:    '#3D3D4F',
    text:           '#FFFFFF',
    textSecondary:  '#A1A1AA',
    textTertiary:   '#71717A',
    disabled:       '#52525B',
    placeholder:    '#71717A',
  },
  semantic: {
    success:      '#10B981',
    successLight: 'rgba(16, 185, 129, 0.15)',
    error:        '#EF4444',
    errorLight:   'rgba(239, 68, 68, 0.15)',
    warning:      '#F59E0B',
    warningLight: 'rgba(245, 158, 11, 0.15)',
    info:         '#3B82F6',
    infoLight:    'rgba(59, 130, 246, 0.15)',
  },
  zones: {
    premium:  '#F59E0B',
    a:        '#A855F7',
    b:        '#06B6D4',
    c:        '#3B82F6',
    economy:  '#6B7280',
    occupied: '#3D3D4F',
    selected: '#10B981',
  },
  badges: {
    popular:      '#F59E0B',
    sellingFast:  '#EF4444',
    specialPrice: '#10B981',
    lastChance:   '#F97316',
    new:          '#A855F7',
  },
  levels: {
    bronze: '#CD7F32',
    silver: '#9CA3AF',
    gold:   '#F59E0B',
  },
  gradients: {
    aurora: ['#A855F7', '#EC4899', '#06B6D4'] as [string, string, string],
    purple: ['#7C3AED', '#A855F7'] as [string, string],
    pink:   ['#DB2777', '#EC4899'] as [string, string],
    dark:   ['#0A0A0F', '#12121A', '#1A1A25'] as [string, string, string],
  },
};

// ============================================
// Typography (theme-independent)
// ============================================

const _fontFamily = Platform.select({
  ios:     { regular: 'System', medium: 'System', semibold: 'System', bold: 'System' },
  android: { regular: 'Roboto', medium: 'Roboto-Medium', semibold: 'Roboto-Medium', bold: 'Roboto-Bold' },
  default: { regular: 'System', medium: 'System', semibold: 'System', bold: 'System' },
});

export const typography = {
  displayLarge:  { fontSize: 40, fontWeight: '700' as const, lineHeight: 48, letterSpacing: -1 } as TextStyle,
  displayMedium: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40, letterSpacing: -0.5 } as TextStyle,
  displaySmall:  { fontSize: 28, fontWeight: '600' as const, lineHeight: 36, letterSpacing: -0.5 } as TextStyle,
  headingLarge:  { fontSize: 24, fontWeight: '600' as const, lineHeight: 32, letterSpacing: -0.3 } as TextStyle,
  headingMedium: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28, letterSpacing: -0.2 } as TextStyle,
  headingSmall:  { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 } as TextStyle,
  bodyLarge:     { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 } as TextStyle,
  bodyMedium:    { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 } as TextStyle,
  bodySmall:     { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 } as TextStyle,
  labelLarge:    { fontSize: 14, fontWeight: '600' as const, lineHeight: 20, letterSpacing: 0.1 } as TextStyle,
  labelMedium:   { fontSize: 12, fontWeight: '600' as const, lineHeight: 16, letterSpacing: 0.1 } as TextStyle,
  labelSmall:    { fontSize: 10, fontWeight: '600' as const, lineHeight: 14, letterSpacing: 0.2 } as TextStyle,
  price:         { fontSize: 22, fontWeight: '700' as const, lineHeight: 28 } as TextStyle,
  caption:       { fontSize: 11, fontWeight: '400' as const, lineHeight: 14, letterSpacing: 0.2 } as TextStyle,
};

// ============================================
// Spacing (theme-independent)
// ============================================

export const spacing = {
  xxs: 2, xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48,
};

// ============================================
// Border Radius (theme-independent)
// ============================================

export const borderRadius = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, full: 9999,
};

// ============================================
// Shadows (theme-independent structure)
// ============================================

export const shadows = {
  glow: {
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  glowStrong: {
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  glowPink: {
    shadowColor: colors.secondary.main,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  bottomNav: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 16,
  },
};

// ============================================
// Animations (theme-independent)
// ============================================

export const animations = {
  fast: 150, normal: 300, slow: 500, verySlow: 800,
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

const theme = { colors, typography, spacing, borderRadius, shadows, animations, components };
export default theme;
