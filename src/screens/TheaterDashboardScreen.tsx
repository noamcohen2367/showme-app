// ============================================
// ShowME App - Theater Dashboard Screen
// ============================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../types/types';
import { useTheater, TheaterStory } from '../hooks/useTheater';
import {
  uploadTheaterProfileImage,
  uploadTheaterStory,
  deleteTheaterStory,
} from '../services/theaterService';
import { colors, typography, spacing } from '../theme/theme';

// ─── Sub-components ────────────────────────────────────────────────────────

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  accent?: string;
  rtl: boolean;
}

function StatCard({ icon, label, value, accent = colors.primary.main, rtl }: StatCardProps) {
  return (
    <View style={[styles.statCard, rtl && styles.statCardRTL]}>
      <View style={[styles.statIcon, { backgroundColor: accent + '22' }]}>
        <Ionicons name={icon as any} size={22} color={accent} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={[styles.statLabel, rtl && styles.textRTL]}>{label}</Text>
    </View>
  );
}

interface ActionRowProps {
  icon: string;
  label: string;
  onPress: () => void;
  rtl: boolean;
}

function ActionRow({ icon, label, onPress, rtl }: ActionRowProps) {
  return (
    <TouchableOpacity
      style={[styles.actionRow, rtl && styles.actionRowRTL]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.actionIcon}>
        <Ionicons name={icon as any} size={20} color={colors.primary.main} />
      </View>
      <Text style={[styles.actionLabel, rtl && styles.actionLabelRTL]}>{label}</Text>
      <Ionicons
        name={rtl ? 'chevron-back' : 'chevron-forward'}
        size={18}
        color={colors.neutral.textTertiary}
      />
    </TouchableOpacity>
  );
}

// ─── Story thumbnail ────────────────────────────────────────────────────────

function StoryThumb({ story, onLongPress }: { story: TheaterStory; onLongPress: () => void }) {
  const hoursLeft = Math.max(
    0,
    Math.round((new Date(story.expiresAt).getTime() - Date.now()) / 3_600_000),
  );

  return (
    <TouchableOpacity style={styles.storyThumb} onLongPress={onLongPress} activeOpacity={0.85}>
      <Image
        source={{ uri: story.imageUrl }}
        style={styles.storyImage}
        contentFit="cover"
        transition={200}
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.storyGradient}
      />
      <Text style={styles.storyHours}>{hoursLeft}h</Text>
    </TouchableOpacity>
  );
}

// ─── Upload Story Modal ─────────────────────────────────────────────────────

interface StoryModalProps {
  visible: boolean;
  imageUri: string | null;
  caption: string;
  uploading: boolean;
  rtl: boolean;
  onCaptionChange: (v: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

function StoryModal({
  visible, imageUri, caption, uploading, rtl,
  onCaptionChange, onConfirm, onCancel,
}: StoryModalProps) {
  const { t } = useTranslation();

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onCancel}>
      <KeyboardAvoidingView
        style={styles.modalContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={[styles.modalHeader, rtl && styles.modalHeaderRTL]}>
          <TouchableOpacity onPress={onCancel} style={styles.modalClose}>
            <Ionicons name="close" size={24} color={colors.neutral.text} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>{t('theaterDashboard.addStory')}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled">
          {/* Preview */}
          {imageUri && (
            <Image
              source={{ uri: imageUri }}
              style={styles.storyPreview}
              contentFit="cover"
            />
          )}

          {/* Caption */}
          <Text style={[styles.captionLabel, rtl && styles.textRTL]}>
            {t('theaterDashboard.storyCaption')}
          </Text>
          <TextInput
            style={[styles.captionInput, rtl && styles.captionInputRTL]}
            placeholder={t('theaterDashboard.storyCaptionPlaceholder')}
            placeholderTextColor={colors.neutral.textTertiary}
            value={caption}
            onChangeText={onCaptionChange}
            multiline
            maxLength={200}
            textAlign={rtl ? 'right' : 'left'}
          />
        </ScrollView>

        {/* Publish button */}
        <View style={styles.modalFooter}>
          <TouchableOpacity
            style={styles.publishButton}
            onPress={onConfirm}
            disabled={uploading}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[colors.primary.main, colors.secondary.main]}
              style={styles.publishGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {uploading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.publishText}>{t('theaterDashboard.uploadStory')}</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Main Screen ────────────────────────────────────────────────────────────

export default function TheaterDashboardScreen() {
  const insets = useSafeAreaInsets();
  const { userProfile } = useAuth();
  const { t, i18n } = useTranslation();
  const rtl = i18n.language === 'he';
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const theaterId = userProfile?.theaterId ?? '';
  const { theater, stories, loading, refresh } = useTheater(theaterId || undefined);

  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [storyUri, setStoryUri] = useState<string | null>(null);
  const [storyCaption, setStoryCaption] = useState('');
  const [uploadingStory, setUploadingStory] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);

  // ── Profile image ──────────────────────────────────────────────────────

  const pickProfileImage = async (source: 'gallery' | 'camera') => {
    const perm = source === 'gallery'
      ? await ImagePicker.requestMediaLibraryPermissionsAsync()
      : await ImagePicker.requestCameraPermissionsAsync();

    if (!perm.granted) return;

    const result = source === 'gallery'
      ? await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.8 })
      : await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 });

    if (result.canceled || !result.assets[0]) return;

    setUploadingAvatar(true);
    try {
      await uploadTheaterProfileImage(theaterId, result.assets[0].uri);
      await refresh();
    } catch {
      Alert.alert('שגיאה', 'לא ניתן היה להעלות את התמונה.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const showAvatarOptions = () => {
    Alert.alert(t('theaterDashboard.editProfileImage'), '', [
      { text: t('theaterDashboard.uploadFromGallery'), onPress: () => pickProfileImage('gallery') },
      { text: t('theaterDashboard.takePhoto'), onPress: () => pickProfileImage('camera') },
      { text: t('common.cancel'), style: 'cancel' },
    ]);
  };

  // ── Story upload ───────────────────────────────────────────────────────

  const pickStoryImage = async (source: 'gallery' | 'camera') => {
    const perm = source === 'gallery'
      ? await ImagePicker.requestMediaLibraryPermissionsAsync()
      : await ImagePicker.requestCameraPermissionsAsync();

    if (!perm.granted) return;

    // allowsEditing: false — on iOS, allowsEditing always forces 1:1 crop regardless of aspect.
    // We pick the full image and display it in a 9:16 container with contentFit="cover".
    const result = source === 'gallery'
      ? await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: false, quality: 0.85 })
      : await ImagePicker.launchCameraAsync({ allowsEditing: false, quality: 0.85 });

    if (result.canceled || !result.assets[0]) return;

    setStoryUri(result.assets[0].uri);
    setStoryCaption('');
    setShowStoryModal(true);
  };

  const showStorySourceOptions = () => {
    Alert.alert(t('theaterDashboard.addStory'), '', [
      { text: t('theaterDashboard.uploadFromGallery'), onPress: () => pickStoryImage('gallery') },
      { text: t('theaterDashboard.takePhoto'), onPress: () => pickStoryImage('camera') },
      { text: t('common.cancel'), style: 'cancel' },
    ]);
  };

  const handlePublishStory = async () => {
    if (!storyUri) return;
    setUploadingStory(true);
    try {
      await uploadTheaterStory(theaterId, storyUri, storyCaption);
      setShowStoryModal(false);
      setStoryUri(null);
      setStoryCaption('');
      await refresh();
    } catch {
      Alert.alert('שגיאה', 'לא ניתן היה להעלות את הסטורי.');
    } finally {
      setUploadingStory(false);
    }
  };

  const confirmDeleteStory = (story: TheaterStory) => {
    Alert.alert(
      t('theaterDashboard.deleteStory'),
      t('theaterDashboard.deleteStoryConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('theaterDashboard.deleteStory'),
          style: 'destructive',
          onPress: async () => {
            await deleteTheaterStory(story.id, story.imageUrl);
            await refresh();
          },
        },
      ],
    );
  };

  // ── Render ─────────────────────────────────────────────────────────────

  const theaterName = theater
    ? (i18n.language === 'he' ? theater.nameHe : theater.name)
    : theaterId;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={['rgba(168,85,247,0.18)', 'transparent']}
        style={styles.headerGradient}
        pointerEvents="none"
      />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Theater Avatar + Name ── */}
        <View style={[styles.profileHeader, rtl && styles.profileHeaderRTL]}>
          <TouchableOpacity onPress={showAvatarOptions} activeOpacity={0.85} style={styles.avatarWrap}>
            {theater?.profileImageUrl ? (
              <Image
                source={{ uri: theater.profileImageUrl }}
                style={styles.avatar}
                contentFit="cover"
                transition={300}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="business" size={36} color={colors.primary.main} />
              </View>
            )}
            <View style={styles.avatarEditBadge}>
              {uploadingAvatar
                ? <ActivityIndicator size="small" color="#fff" />
                : <Ionicons name="camera" size={14} color="#fff" />
              }
            </View>
          </TouchableOpacity>

          <View style={[styles.profileInfo, rtl && styles.profileInfoRTL]}>
            <View style={[styles.theaterBadge, rtl && styles.theaterBadgeRTL]}>
              <Ionicons name="business" size={13} color={colors.primary.main} />
              <Text style={styles.theaterBadgeText}>{t('theaterDashboard.theaterAccount')}</Text>
            </View>
            <Text style={[styles.title, rtl && styles.textRTL]} numberOfLines={2}>
              {theaterName}
            </Text>
            <Text style={[styles.subtitle, rtl && styles.textRTL]}>
              {t('theaterDashboard.managementDashboard')}
            </Text>
          </View>
        </View>

        {/* ── Stories Row ── */}
        <View style={styles.section}>
          {/* Title row — "+" always on the end (right in RTL, left in LTR) */}
          <View style={[styles.storiesTitleRow, rtl && styles.storiesTitleRowRTL]}>
            <Text style={[styles.sectionTitle, styles.sectionTitleInline, rtl && styles.textRTL]}>
              {t('theaterDashboard.stories')}
            </Text>
            <TouchableOpacity
              style={styles.addStoryIconBtn}
              onPress={showStorySourceOptions}
              activeOpacity={0.75}
            >
              <LinearGradient
                colors={[colors.primary.main, colors.secondary.main]}
                style={styles.addStoryIconGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="add" size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storiesRow}
          >
            {loading && stories.length === 0 ? (
              <ActivityIndicator color={colors.primary.main} style={{ marginStart: spacing.md }} />
            ) : (
              stories.map(story => (
                <StoryThumb
                  key={story.id}
                  story={story}
                  onLongPress={() => confirmDeleteStory(story)}
                />
              ))
            )}

            {!loading && stories.length === 0 && (
              <View style={styles.noStoriesWrap}>
                <Text style={styles.noStoriesText}>{t('theaterDashboard.noStories')}</Text>
              </View>
            )}
          </ScrollView>
        </View>

        {/* ── Stats ── */}
        <View style={[styles.statsGrid, rtl && styles.statsGridRTL]}>
          <StatCard rtl={rtl} icon="ticket-outline"      label={t('theaterDashboard.stats.activeShows')}  value="—" />
          <StatCard rtl={rtl} icon="people-outline"      label={t('theaterDashboard.stats.thisMonth')}     value="—" accent={colors.secondary.main} />
          <StatCard rtl={rtl} icon="star-outline"        label={t('theaterDashboard.stats.avgRating')}     value="—" accent="#F59E0B" />
          <StatCard rtl={rtl} icon="trending-up-outline" label={t('theaterDashboard.stats.soldThisWeek')}  value="—" accent="#10B981" />
        </View>

        {/* ── Manage ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, rtl && styles.textRTL]}>{t('theaterDashboard.manage')}</Text>
          <View style={styles.card}>
            <ActionRow rtl={rtl} icon="add-circle-outline" label={t('theaterDashboard.addNewShow')}       onPress={() => {}} />
            <View style={styles.divider} />
            <ActionRow rtl={rtl} icon="list-outline"        label={t('theaterDashboard.myShows')}          onPress={() => {}} />
            <View style={styles.divider} />
            <ActionRow rtl={rtl} icon="calendar-outline"    label={t('theaterDashboard.scheduleAndDates')} onPress={() => {}} />
            <View style={styles.divider} />
            <ActionRow rtl={rtl} icon="image-outline"       label={t('theaterDashboard.mediaAndGallery')}  onPress={() => {}} />
          </View>
        </View>

        {/* ── Analytics ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, rtl && styles.textRTL]}>{t('theaterDashboard.analytics')}</Text>
          <View style={styles.card}>
            <ActionRow rtl={rtl} icon="bar-chart-outline" label={t('theaterDashboard.salesReport')}         onPress={() => {}} />
            <View style={styles.divider} />
            <ActionRow rtl={rtl} icon="eye-outline"       label={t('theaterDashboard.viewsAndImpressions')} onPress={() => {}} />
          </View>
        </View>

        {/* ── Settings ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, rtl && styles.textRTL]}>{t('theaterDashboard.settings')}</Text>
          <View style={styles.card}>
            <ActionRow rtl={rtl} icon="business-outline"      label={t('theaterDashboard.theaterProfile')} onPress={() => navigation.navigate('TheaterProfile')} />
            <View style={styles.divider} />
            <ActionRow rtl={rtl} icon="notifications-outline" label={t('theaterDashboard.notifications')}  onPress={() => {}} />
          </View>
        </View>
      </ScrollView>

      {/* Story upload modal */}
      <StoryModal
        visible={showStoryModal}
        imageUri={storyUri}
        caption={storyCaption}
        uploading={uploadingStory}
        rtl={rtl}
        onCaptionChange={setStoryCaption}
        onConfirm={handlePublishStory}
        onCancel={() => { setShowStoryModal(false); setStoryUri(null); }}
      />
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral.background },
  headerGradient: { position: 'absolute', top: 0, left: 0, right: 0, height: 260 },
  scroll: { paddingHorizontal: spacing.lg },

  // Profile header
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  profileHeaderRTL: { flexDirection: 'row-reverse' },

  avatarWrap: { position: 'relative' },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: colors.primary.main + '66' },
  avatarPlaceholder: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: colors.primary.main + '18',
    borderWidth: 2, borderColor: colors.primary.main + '44',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarEditBadge: {
    position: 'absolute', bottom: 0, end: 0,
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: colors.primary.main,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: colors.neutral.background,
  },

  profileInfo: { flex: 1, alignItems: 'flex-start', gap: spacing.xs },
  profileInfoRTL: { alignItems: 'flex-end' },

  theaterBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: colors.primary.main + '22',
    paddingHorizontal: spacing.sm, paddingVertical: 3,
    borderRadius: 20, borderWidth: 1, borderColor: colors.primary.main + '44',
  },
  theaterBadgeRTL: { flexDirection: 'row-reverse' },
  theaterBadgeText: { ...typography.caption, color: colors.primary.main, fontWeight: '600' },

  title: { ...typography.headingMedium, color: colors.neutral.text },
  subtitle: { ...typography.bodySmall, color: colors.neutral.textSecondary },
  textRTL: { textAlign: 'right' },

  // Stories
  storiesTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  storiesTitleRowRTL: { flexDirection: 'row-reverse' },
  sectionTitleInline: { marginBottom: 0, marginStart: spacing.xs },

  addStoryIconBtn: { borderRadius: 20, overflow: 'hidden' },
  addStoryIconGradient: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },

  storiesRow: { flexDirection: 'row', gap: spacing.md, paddingVertical: spacing.sm },

  storyThumb: { width: 72, height: 100, borderRadius: 14, overflow: 'hidden' },
  storyImage: { width: '100%', height: '100%' },
  storyGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 36 },
  storyHours: { position: 'absolute', bottom: 5, left: 0, right: 0, textAlign: 'center', ...typography.caption, color: '#fff', fontWeight: '600' },

  noStoriesWrap: { justifyContent: 'center', paddingHorizontal: spacing.md, height: 100 },
  noStoriesText: { ...typography.bodySmall, color: colors.neutral.textTertiary },

  // Stats
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl },
  statsGridRTL: { flexDirection: 'row-reverse' },
  statCard: {
    flex: 1, minWidth: '45%', backgroundColor: colors.dark[700],
    borderRadius: 16, padding: spacing.md, borderWidth: 1,
    borderColor: colors.dark[500], alignItems: 'flex-start', gap: spacing.xs,
  },
  statCardRTL: { alignItems: 'flex-end' },
  statIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xs },
  statValue: { ...typography.headingMedium, color: colors.neutral.text },
  statLabel: { ...typography.caption, color: colors.neutral.textTertiary },

  // Sections
  section: { marginBottom: spacing.xl },
  sectionTitle: {
    ...typography.labelSmall, color: colors.neutral.textTertiary,
    textTransform: 'uppercase', letterSpacing: 1,
    marginBottom: spacing.sm, marginStart: spacing.xs,
  },
  card: {
    backgroundColor: colors.dark[700], borderRadius: 16,
    borderWidth: 1, borderColor: colors.dark[500], overflow: 'hidden',
  },
  actionRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.md, paddingVertical: spacing.md, gap: spacing.md,
  },
  actionRowRTL: { flexDirection: 'row-reverse' },
  actionIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: colors.primary.main + '18',
    alignItems: 'center', justifyContent: 'center',
  },
  actionLabel: { ...typography.bodyMedium, color: colors.neutral.text, flex: 1 },
  actionLabelRTL: { textAlign: 'right' },
  divider: { height: 1, backgroundColor: colors.dark[500], marginHorizontal: spacing.md },

  // Story modal
  modalContainer: { flex: 1, backgroundColor: colors.neutral.background },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.dark[500],
  },
  modalHeaderRTL: { flexDirection: 'row-reverse' },
  modalClose: { width: 40, alignItems: 'flex-start' },
  modalTitle: { ...typography.headingSmall, color: colors.neutral.text },
  modalContent: { padding: spacing.lg, gap: spacing.lg },

  storyPreview: {
    width: '100%', aspectRatio: 9 / 16,
    borderRadius: 16, overflow: 'hidden',
    backgroundColor: colors.dark[700],
  },
  captionLabel: { ...typography.labelSmall, color: colors.neutral.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  captionInput: {
    backgroundColor: colors.dark[700], borderRadius: 12,
    borderWidth: 1, borderColor: colors.dark[500],
    padding: spacing.md, ...typography.bodyMedium, color: colors.neutral.text,
    minHeight: 80, textAlignVertical: 'top',
  },
  captionInputRTL: { textAlign: 'right' },

  modalFooter: { padding: spacing.lg, paddingBottom: spacing.xl },
  publishButton: { borderRadius: 14, overflow: 'hidden' },
  publishGradient: { paddingVertical: spacing.md + 2, alignItems: 'center' },
  publishText: { ...typography.labelLarge, color: '#fff', fontWeight: '700' },
});
