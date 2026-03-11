// ============================================
// ShowME App - Social/Reviews Screen
// ============================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
} from 'react-native';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing } from '../theme/theme';

interface Review {
  id: string;
  user: {
    name: string;
    avatar: string;
    level: string;
  };
  showName: string;
  showImage: string;
  rating: number;
  text: string;
  date: Date;
  likes: number;
  comments: number;
  liked: boolean;
}

const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    user: { name: 'Sarah Cohen', avatar: 'https://picsum.photos/seed/user1/100/100', level: 'gold' },
    showName: 'The Phantom of the Opera',
    showImage: 'https://picsum.photos/seed/show1/200/200',
    rating: 5,
    text: 'Absolutely breathtaking performance! The cast was incredible and the staging was out of this world. A must-see for any theater lover. 🎭✨',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2),
    likes: 24, comments: 5, liked: false,
  },
  {
    id: '2',
    user: { name: 'David Levi', avatar: 'https://picsum.photos/seed/user2/100/100', level: 'silver' },
    showName: 'Romeo and Juliet',
    showImage: 'https://picsum.photos/seed/show2/200/200',
    rating: 4,
    text: 'Beautiful modern interpretation of a classic. The chemistry between the leads was palpable.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24),
    likes: 18, comments: 3, liked: true,
  },
  {
    id: '3',
    user: { name: 'Maya Ben-Ari', avatar: 'https://picsum.photos/seed/user3/100/100', level: 'bronze' },
    showName: 'Les Misérables',
    showImage: 'https://picsum.photos/seed/show3/200/200',
    rating: 5,
    text: 'I cried three times! The emotional depth of this production is unmatched.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 48),
    likes: 42, comments: 8, liked: false,
  },
];

const FRIENDS = [
  { id: '1', name: 'Sarah', avatar: 'https://picsum.photos/seed/f1/100/100', recentShow: 'Phantom', online: true },
  { id: '2', name: 'David', avatar: 'https://picsum.photos/seed/f2/100/100', recentShow: 'Romeo', online: false },
  { id: '3', name: 'Maya', avatar: 'https://picsum.photos/seed/f3/100/100', online: true },
  { id: '4', name: 'Yossi', avatar: 'https://picsum.photos/seed/f4/100/100', recentShow: 'Cats', online: false },
];

export default function SocialScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'feed' | 'friends' | 'discover'>('feed');
  const [reviews, setReviews] = useState(MOCK_REVIEWS);

  const toggleLike = (reviewId: string) => {
    setReviews(prev => prev.map(r =>
      r.id === reviewId ? { ...r, liked: !r.liked, likes: r.liked ? r.likes - 1 : r.likes + 1 } : r
    ));
  };

  const formatDate = (date: Date): string => {
    const diff = Date.now() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const getLevelColor = (level: string) => level === 'gold' ? '#FFD700' : level === 'silver' ? '#C0C0C0' : '#CD7F32';

  const renderReviewCard = (review: Review) => (
    <View key={review.id} style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <TouchableOpacity style={styles.userInfo}>
          <Image source={{ uri: review.user.avatar }} style={styles.userAvatar} contentFit="cover" transition={200} />
          <View style={[styles.levelBadge, { backgroundColor: getLevelColor(review.user.level) }]} />
          <View>
            <Text style={styles.userName}>{review.user.name}</Text>
            <Text style={styles.reviewDate}>{formatDate(review.date)}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.showInfo}>
        <Image source={{ uri: review.showImage }} style={styles.showThumbnail} contentFit="cover" transition={200} />
        <View style={styles.showDetails}>
          <Text style={styles.showName}>{review.showName}</Text>
          <View style={styles.ratingRow}>
            {[...Array(5)].map((_, i) => (
              <Ionicons key={i} name={i < review.rating ? 'star' : 'star-outline'} size={16} 
                color={i < review.rating ? colors.accent.main : colors.neutral.textTertiary} />
            ))}
          </View>
        </View>
      </TouchableOpacity>

      <Text style={styles.reviewText}>{review.text}</Text>

      <View style={styles.reviewActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => toggleLike(review.id)}>
          <Ionicons name={review.liked ? 'heart' : 'heart-outline'} size={22} 
            color={review.liked ? colors.secondary.main : colors.neutral.textSecondary} />
          <Text style={[styles.actionText, review.liked && { color: colors.secondary.main }]}>{review.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={20} color={colors.neutral.textSecondary} />
          <Text style={styles.actionText}>{review.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-outline" size={20} color={colors.neutral.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFriendsList = () => (
    <View>
      <TouchableOpacity style={styles.inviteCard}>
        <LinearGradient colors={[colors.primary.main, colors.secondary.main]} style={styles.inviteGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
          <Ionicons name="person-add" size={24} color={colors.neutral.white} />
          <View style={styles.inviteText}>
            <Text style={styles.inviteTitle}>Invite Friends</Text>
            <Text style={styles.inviteSubtitle}>Earn 200 points for each friend!</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.neutral.white} />
        </LinearGradient>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Your Friends ({FRIENDS.length})</Text>
      {FRIENDS.map((friend) => (
        <TouchableOpacity key={friend.id} style={styles.friendCard}>
          <View style={styles.friendAvatarContainer}>
            <Image source={{ uri: friend.avatar }} style={styles.friendAvatar} contentFit="cover" transition={200} />
            {friend.online && <View style={styles.onlineIndicator} />}
          </View>
          <View style={styles.friendInfo}>
            <Text style={styles.friendName}>{friend.name}</Text>
            {friend.recentShow && <Text style={styles.friendActivity}>Recently saw: {friend.recentShow}</Text>}
          </View>
          <TouchableOpacity style={styles.friendAction}>
            <Ionicons name="chatbubble-outline" size={20} color={colors.primary.main} />
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderDiscover = () => (
    <View>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.neutral.textTertiary} />
        <TextInput style={styles.searchInput} placeholder="Search users or shows..." placeholderTextColor={colors.neutral.textTertiary} />
      </View>

      <Text style={styles.sectionTitle}>Top Reviewers</Text>
      {[1, 2, 3].map((i) => (
        <TouchableOpacity key={i} style={styles.topReviewerCard}>
          <Text style={styles.rankBadge}>#{i}</Text>
          <Image source={{ uri: `https://picsum.photos/seed/top${i}/100/100` }} style={styles.topReviewerAvatar} contentFit="cover" transition={200} />
          <View style={styles.topReviewerInfo}>
            <Text style={styles.topReviewerName}>Reviewer {i}</Text>
            <Text style={styles.topReviewerStats}>{50 - i * 10} reviews</Text>
          </View>
          <TouchableOpacity style={styles.followButton}>
            <Text style={styles.followButtonText}>Follow</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.neutral.background} />

      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.neutral.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Community</Text>
        <TouchableOpacity><Ionicons name="notifications-outline" size={24} color={colors.neutral.text} /></TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        {(['feed', 'friends', 'discover'] as const).map((tab) => (
          <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.tabActive]} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</Text>
            {activeTab === tab && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {activeTab === 'feed' && reviews.map(renderReviewCard)}
        {activeTab === 'friends' && renderFriendsList()}
        {activeTab === 'discover' && renderDiscover()}
        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity style={[styles.fab, { bottom: insets.bottom + 90 }]}>
        <LinearGradient colors={[colors.primary.main, colors.secondary.main]} style={styles.fabGradient}>
          <Ionicons name="create" size={24} color={colors.neutral.white} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { ...typography.headingMedium, color: colors.neutral.text },
  tabs: { flexDirection: 'row', paddingHorizontal: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.dark[500] },
  tab: { flex: 1, paddingVertical: spacing.md, alignItems: 'center', position: 'relative' },
  tabActive: {},
  tabText: { ...typography.labelMedium, color: colors.neutral.textTertiary },
  tabTextActive: { color: colors.primary.main },
  tabIndicator: { position: 'absolute', bottom: 0, left: '25%', right: '25%', height: 2, backgroundColor: colors.primary.main, borderRadius: 1 },
  content: { flex: 1 },
  contentContainer: { padding: spacing.lg },
  reviewCard: { backgroundColor: colors.dark[700], borderRadius: 16, padding: spacing.md, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.dark[500] },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  userAvatar: { width: 44, height: 44, borderRadius: 22, marginEnd: spacing.md },
  levelBadge: { position: 'absolute', bottom: 0, left: 30, width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: colors.dark[700] },
  userName: { ...typography.labelMedium, color: colors.neutral.text },
  reviewDate: { ...typography.caption, color: colors.neutral.textTertiary, marginTop: 2 },
  showInfo: { flexDirection: 'row', backgroundColor: colors.dark[600], borderRadius: 12, padding: spacing.sm, marginBottom: spacing.md },
  showThumbnail: { width: 50, height: 50, borderRadius: 8 },
  showDetails: { marginStart: spacing.md, justifyContent: 'center' },
  showName: { ...typography.labelMedium, color: colors.neutral.text, marginBottom: spacing.xxs },
  ratingRow: { flexDirection: 'row', gap: 2 },
  reviewText: { ...typography.bodyMedium, color: colors.neutral.textSecondary, lineHeight: 22, marginBottom: spacing.md },
  reviewActions: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.dark[500], paddingTop: spacing.md, gap: spacing.xl },
  actionButton: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  actionText: { ...typography.labelSmall, color: colors.neutral.textSecondary },
  inviteCard: { marginBottom: spacing.xl, borderRadius: 16, overflow: 'hidden' },
  inviteGradient: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg },
  inviteText: { flex: 1, marginStart: spacing.md },
  inviteTitle: { ...typography.labelLarge, color: colors.neutral.white },
  inviteSubtitle: { ...typography.bodySmall, color: 'rgba(255, 255, 255, 0.8)', marginTop: 2 },
  sectionTitle: { ...typography.headingSmall, color: colors.neutral.text, marginBottom: spacing.md },
  friendCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.dark[700], borderRadius: 12, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.dark[500] },
  friendAvatarContainer: { position: 'relative' },
  friendAvatar: { width: 50, height: 50, borderRadius: 25 },
  onlineIndicator: { position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: 6, backgroundColor: colors.semantic.success, borderWidth: 2, borderColor: colors.dark[700] },
  friendInfo: { flex: 1, marginStart: spacing.md },
  friendName: { ...typography.labelMedium, color: colors.neutral.text },
  friendActivity: { ...typography.caption, color: colors.neutral.textTertiary, marginTop: 2 },
  friendAction: { padding: spacing.sm },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.dark[700], borderRadius: 12, paddingHorizontal: spacing.md, marginBottom: spacing.xl, borderWidth: 1, borderColor: colors.dark[500] },
  searchInput: { flex: 1, ...typography.bodyMedium, color: colors.neutral.text, paddingVertical: spacing.md, marginStart: spacing.sm },
  topReviewerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.dark[700], borderRadius: 12, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.dark[500] },
  rankBadge: { ...typography.labelLarge, color: colors.accent.main, marginEnd: spacing.md, width: 30 },
  topReviewerAvatar: { width: 44, height: 44, borderRadius: 22 },
  topReviewerInfo: { flex: 1, marginStart: spacing.md },
  topReviewerName: { ...typography.labelMedium, color: colors.neutral.text },
  topReviewerStats: { ...typography.caption, color: colors.neutral.textTertiary, marginTop: 2 },
  followButton: { backgroundColor: colors.primary.main, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: 8 },
  followButtonText: { ...typography.labelSmall, color: colors.neutral.white },
  fab: { position: 'absolute', right: spacing.lg, borderRadius: 28, overflow: 'hidden', shadowColor: colors.primary.main, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 8 },
  fabGradient: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center' },
});
