// ============================================
// ShowME App - Responsive Dimensions Utility
// ============================================
// On web, content is constrained to APP_MAX_WIDTH to look like a mobile app
// centered on the browser. All width-based calculations should use getAppWidth()
// instead of Dimensions.get('window').width directly.

import { Dimensions, Platform } from 'react-native';

/** Maximum content width on web (mobile-phone column, centered on desktop) */
export const APP_MAX_WIDTH = 430;

/**
 * Returns the usable app width.
 * - Native: full device screen width
 * - Web: min(window width, APP_MAX_WIDTH)
 */
export function getAppWidth(): number {
  const { width } = Dimensions.get('window');
  return Platform.OS === 'web' ? Math.min(width, APP_MAX_WIDTH) : width;
}
