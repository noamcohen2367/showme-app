// ============================================
// ShowME App - Haptic Feedback Utility
// ============================================

import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// Check if haptics are available
const isHapticsAvailable = Platform.OS === 'ios' || Platform.OS === 'android';

/**
 * Light haptic feedback - for subtle interactions
 * Use for: toggles, small button presses, selections
 */
export const lightHaptic = async () => {
  if (isHapticsAvailable) {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      // Silently fail if haptics not available
    }
  }
};

/**
 * Medium haptic feedback - for standard interactions
 * Use for: button presses, card taps, navigation
 */
export const mediumHaptic = async () => {
  if (isHapticsAvailable) {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      // Silently fail if haptics not available
    }
  }
};

/**
 * Heavy haptic feedback - for significant interactions
 * Use for: confirmations, successful actions, errors
 */
export const heavyHaptic = async () => {
  if (isHapticsAvailable) {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch (error) {
      // Silently fail if haptics not available
    }
  }
};

/**
 * Selection haptic - for selection changes
 * Use for: picker changes, tab switches, list selections
 */
export const selectionHaptic = async () => {
  if (isHapticsAvailable) {
    try {
      await Haptics.selectionAsync();
    } catch (error) {
      // Silently fail if haptics not available
    }
  }
};

/**
 * Success haptic - for successful operations
 * Use for: purchase complete, booking confirmed, form submitted
 */
export const successHaptic = async () => {
  if (isHapticsAvailable) {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      // Silently fail if haptics not available
    }
  }
};

/**
 * Warning haptic - for warnings
 * Use for: validation errors, low stock warnings
 */
export const warningHaptic = async () => {
  if (isHapticsAvailable) {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (error) {
      // Silently fail if haptics not available
    }
  }
};

/**
 * Error haptic - for errors
 * Use for: payment failed, network error, validation error
 */
export const errorHaptic = async () => {
  if (isHapticsAvailable) {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch (error) {
      // Silently fail if haptics not available
    }
  }
};

export default {
  light: lightHaptic,
  medium: mediumHaptic,
  heavy: heavyHaptic,
  selection: selectionHaptic,
  success: successHaptic,
  warning: warningHaptic,
  error: errorHaptic,
};
