// ============================================
// ShowME App - Notification Badge Hook
// ============================================

import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_NOTIFICATIONS } from '../data/notifications';

const DISMISSED_KEY = 'showmi.notifications.dismissed';
const READ_KEY = 'showmi.notifications.read';

/**
 * Returns true if there are any unread, non-dismissed notifications.
 * Re-checks every time the screen comes into focus.
 */
export function useNotificationBadge(): boolean {
  const [hasUnread, setHasUnread] = useState(
    // Quick initial guess from static data (avoids flicker for default state)
    MOCK_NOTIFICATIONS.some(n => !n.read)
  );

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const [rawDismissed, rawRead] = await Promise.all([
            AsyncStorage.getItem(DISMISSED_KEY),
            AsyncStorage.getItem(READ_KEY),
          ]);
          const dismissed: string[] = rawDismissed ? JSON.parse(rawDismissed) : [];
          const read: string[] = rawRead ? JSON.parse(rawRead) : [];

          const anyUnread = MOCK_NOTIFICATIONS.some(
            n => !dismissed.includes(n.id) && !read.includes(n.id) && !n.read
          );
          setHasUnread(anyUnread);
        } catch {
          // keep current state on error
        }
      })();
    }, [])
  );

  return hasUnread;
}
