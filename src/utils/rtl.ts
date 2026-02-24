// ============================================
// ShowME App - RTL (Right-to-Left) Utilities
// ============================================
//
// Single source of truth for direction-aware styling.
// Values are constants evaluated once at startup — stable for the app lifetime.
// React Native requires an app restart when I18nManager.forceRTL() changes, so
// reading at module-load time is correct and avoids per-render overhead.
//
// Usage in StyleSheet.create():
//   import { rtl, row, textAlign, alignStart } from '../utils/rtl';
//   const styles = StyleSheet.create({
//     container: { flexDirection: row },
//     title:     { textAlign },
//   });
//
// Usage for icon names:
//   name={rtl ? 'chevron-back' : 'chevron-forward'}
//
// ============================================

import { I18nManager } from 'react-native';

/** True when the current layout direction is RTL (e.g. Hebrew). */
export const rtl: boolean = I18nManager.isRTL;

// ── flexDirection ─────────────────────────────────────────────────────────────

/** Use for rows whose child order should mirror in RTL. */
export const row: 'row' | 'row-reverse' = rtl ? 'row-reverse' : 'row';

// ── Text alignment ────────────────────────────────────────────────────────────

/** Body / label text that should hug the reading-start edge. */
export const textAlign: 'right' | 'left' = rtl ? 'right' : 'left';

// ── Flex alignment helpers ────────────────────────────────────────────────────

/** alignItems / justifyContent value for the leading (reading-start) edge. */
export const alignStart: 'flex-end' | 'flex-start' = rtl ? 'flex-end' : 'flex-start';

/** alignItems / justifyContent value for the trailing (reading-end) edge. */
export const alignEnd: 'flex-start' | 'flex-end' = rtl ? 'flex-start' : 'flex-end';

// ── alignSelf ────────────────────────────────────────────────────────────────

/** alignSelf for an element that should hug the leading edge. */
export const selfStart: 'flex-end' | 'flex-start' = rtl ? 'flex-end' : 'flex-start';
