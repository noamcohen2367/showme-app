// ============================================
// ShowME App - Responsive Dimensions Utility
// ============================================
// On web, the layout is full-width (like a real website with a sticky top nav).
// Use getAppWidth() for full-width containers and scroll views.
// For fixed-width card components on web, use platform-specific constants instead.

import { Dimensions, Platform } from 'react-native';

/**
 * Returns the usable app width.
 * - Native: full device screen width
 * - Web: full browser window width (layout fills the viewport)
 */
export function getAppWidth(): number {
  return Dimensions.get('window').width;
}
