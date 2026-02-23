// ============================================
// ShowME App - Notifications Screen
// ============================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing } from '../theme/theme';

interface Notification {
  id: string;
  type: 'reminder' | 'discount' | 'new_show' | 'review' | 'system' | 'social';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  image?: string;
  actionData?: {
    type: 'show' | 'ticket' | 'profile';
    id: string;
  };
}

// Mock notifications data
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'reminder',
    title: 'Show Tomorrow!',
    message: 'Don\'t forget! "The Phantom of the Opera" is tomorrow at 20:00 at Habima Theatre.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    read: false,
    image: 'https://picsum.photos/seed/show1/100/100',
    actionData: { type: 'ticket', id: 'perf-1' },
  },
  {
    id: '2',
    type: 'discount',
    title: '30% Off This Weekend!',
    message: 'Exclusive deal: Get 30% off on "Romeo and Juliet" tickets. Limited time only!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    image: 'https://picsum.photos/seed/show2/100/100',
    actionData: { type: 'show', id: 'show-2' },
  },
  {
    id: '3',
    type: 'new_show',
    title: 'New Show Added',
    message: '"Les Misérables" is now available for booking! Be the first to get tickets.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    read: true,
    image: 'https://picsum.photos/seed/show3/100/100',
    actionData: { type: 'show', id: 'show-3' },
  },
  {
    id: '4',
    type: 'review',
    title: 'Rate Your Experience',
    message: 'How was "The Band\'s Visit"? Share your thoughts and help others discover great shows.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
    actionData: { type: 'show', id: 'show-7' },
  },
  {
    id: '5',
    type: 'social',
    title: 'Sarah liked your review',
    message: 'Your review of "Fiddler on the Roof" received 5 likes!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    read: true,
  },
  {
    id: '6',
    type: 'system',
    title: 'Subscription Expiring Soon',
    message: 'Your Habima Theatre subscription expires in 7 days. Renew now to keep your benefits!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    read: true,
  },
];

const NOTIFICATION_ICONS: Record<Notification['type'], { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  reminder: { icon: 'alarm', color: colors.semantic.warning },
  discount: { icon: 'pricetag', color: colors.secondary.main },
  new_show: { icon: 'sparkles', color: colors.primary.main },
  review: { icon: 'star', color: colors.accent.main },
  social: { icon: 'heart', color: '#EC4899' },
  system: { icon: 'information-circle', color: colors.neutral.textSecondary },
};

export default function NotificationsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const handleNotificationPress = (notification: Notification) => {
    markAsRead(notification.id);
    // Navigation based on actionData would go here
  };

  const renderNotification = (notification: Notification) => {
    const iconConfig = NOTIFICATION_ICONS[notification.type];

    return (
      <TouchableOpacity
        key={notification.id}
        style={[styles.notificationCard, !notification.read && styles.unreadCard]}
        onPress={() => handleNotificationPress(notification)}
        activeOpacity={0.7}
      >
        {/* Unread Indicator */}
        {!notification.read && <View style={styles.unreadDot} />}

        {/* Icon or Image */}
        <View style={styles.notificationLeft}>
          {notification.image ? (
            <Image source={{ uri: notification.image }} style={styles.notificationImage} contentFit="cover" transition={200} />
          ) : (
            <View style={[styles.iconContainer, { backgroundColor: `${iconConfig.color}20` }]}>
              <Ionicons name={iconConfig.icon} size={22} color={iconConfig.color} />
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <Text style={[styles.notificationTitle, !notification.read && styles.unreadTitle]} numberOfLines={1}>
              {notification.title}
            </Text>
            <Text style={styles.notificationTime}>{formatTimestamp(notification.timestamp)}</Text>
          </View>
          <Text style={styles.notificationMessage} numberOfLines={2}>
            {notification.message}
          </Text>
          
          {/* Type Badge */}
          <View style={styles.typeBadge}>
            <Ionicons name={iconConfig.icon} size={12} color={iconConfig.color} />
            <Text style={[styles.typeBadgeText, { color: iconConfig.color }]}>
              {notification.type.replace('_', ' ')}
            </Text>
          </View>
        </View>

        {/* Delete Button */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteNotification(notification.id)}
        >
          <Ionicons name="close" size={18} color={colors.neutral.textTertiary} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const todayNotifications = notifications.filter(n => {
    const today = new Date();
    return n.timestamp.toDateString() === today.toDateString();
  });

  const earlierNotifications = notifications.filter(n => {
    const today = new Date();
    return n.timestamp.toDateString() !== today.toDateString();
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.neutral.background} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.neutral.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{t('notifications.title', { defaultValue: 'Notifications' })}</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markAllButton} onPress={markAllAsRead}>
            <Text style={styles.markAllText}>{t('notifications.markAllRead', { defaultValue: 'Mark all read' })}</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="notifications-off-outline" size={48} color={colors.neutral.textTertiary} />
            </View>
            <Text style={styles.emptyTitle}>{t('notifications.empty', { defaultValue: 'No notifications' })}</Text>
            <Text style={styles.emptySubtitle}>
              {t('notifications.emptyDesc', { defaultValue: 'You\'re all caught up! Check back later for updates.' })}
            </Text>
          </View>
        ) : (
          <>
            {/* Today */}
            {todayNotifications.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('notifications.today', { defaultValue: 'Today' })}</Text>
                {todayNotifications.map(renderNotification)}
              </View>
            )}

            {/* Earlier */}
            {earlierNotifications.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('notifications.earlier', { defaultValue: 'Earlier' })}</Text>
                {earlierNotifications.map(renderNotification)}
              </View>
            )}
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark[500],
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginStart: spacing.sm,
  },
  headerTitle: {
    ...typography.headingMedium,
    color: colors.neutral.text,
  },
  unreadBadge: {
    backgroundColor: colors.primary.main,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginStart: spacing.sm,
  },
  unreadBadgeText: {
    ...typography.labelSmall,
    color: colors.neutral.white,
  },
  markAllButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  markAllText: {
    ...typography.labelSmall,
    color: colors.primary.main,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.labelMedium,
    color: colors.neutral.textTertiary,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: colors.dark[700],
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.dark[500],
    position: 'relative',
  },
  unreadCard: {
    borderColor: colors.primary.main,
    borderLeftWidth: 3,
  },
  unreadDot: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary.main,
  },
  notificationLeft: {
    marginEnd: spacing.md,
  },
  notificationImage: {
    width: 50,
    height: 50,
    borderRadius: 12,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xxs,
  },
  notificationTitle: {
    ...typography.labelMedium,
    color: colors.neutral.text,
    flex: 1,
    marginEnd: spacing.sm,
  },
  unreadTitle: {
    fontWeight: '700',
  },
  notificationTime: {
    ...typography.caption,
    color: colors.neutral.textTertiary,
  },
  notificationMessage: {
    ...typography.bodySmall,
    color: colors.neutral.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typeBadgeText: {
    ...typography.caption,
    textTransform: 'capitalize',
  },
  deleteButton: {
    padding: spacing.xs,
    marginStart: spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl * 2,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.dark[700],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    ...typography.headingSmall,
    color: colors.neutral.text,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    ...typography.bodyMedium,
    color: colors.neutral.textTertiary,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
});
