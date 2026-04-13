// ============================================
// ShowME App - Profile Screen (Dark Aurora Theme)
// ============================================

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  Linking,
  I18nManager,
  Alert,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing } from '../theme/theme';
import { getNextLevel, userSubscriptions } from '../data/user';
import { RootStackParamList } from '../types/types';
import { SUPPORTED_LANGUAGES, changeLanguage, LanguageCode } from '../i18n/i18n';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

type ProfileNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
  destructive?: boolean;
}

function MenuItem({ icon, label, value, onPress, showChevron = true, destructive = false }: MenuItemProps) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <View style={[styles.menuIcon, destructive && styles.menuIconDestructive]}>
          <Ionicons 
            name={icon} 
            size={20} 
            color={destructive ? colors.semantic.error : colors.primary.main} 
          />
        </View>
        <Text style={[styles.menuItemLabel, destructive && styles.menuItemDestructive]}>
          {label}
        </Text>
      </View>
      <View style={styles.menuItemRight}>
        {value && <Text style={styles.menuItemValue}>{value}</Text>}
        {showChevron && (
          <Ionicons
            name={I18nManager.isRTL ? 'chevron-back' : 'chevron-forward'}
            size={18}
            color={colors.neutral.textTertiary}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<ProfileNavigationProp>();
  const insets = useSafeAreaInsets();
  const { logout, userProfile, profileLoading, refreshProfile } = useAuth();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showPhotoViewer, setShowPhotoViewer] = useState(false);
  const avatarMeasureRef = useRef<View>(null);
  const avatarSnapshot = useRef({ x: 0, y: 0, size: 90 });

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const finalImageTop = (screenHeight - screenWidth) / 2;

  const animLeft = useRef(new Animated.Value(0)).current;
  const animTop = useRef(new Animated.Value(0)).current;
  const animSize = useRef(new Animated.Value(90)).current;
  const animRadius = useRef(new Animated.Value(45)).current;
  const animBgOpacity = useRef(new Animated.Value(0)).current;
  const animActionsOpacity = useRef(new Animated.Value(0)).current;
  const animImageOpacity = useRef(new Animated.Value(1)).current;

  const SPRING = { useNativeDriver: false, tension: 70, friction: 9 } as const;

  const openPhotoViewer = () => {
    avatarMeasureRef.current?.measure((_fx, _fy, width, _height, px, py) => {
      avatarSnapshot.current = { x: px, y: py, size: width };
      animLeft.setValue(px);
      animTop.setValue(py);
      animSize.setValue(width);
      animRadius.setValue(width / 2);
      animBgOpacity.setValue(0);
      animActionsOpacity.setValue(0);
      animImageOpacity.setValue(1);
      setShowPhotoViewer(true);
      Animated.parallel([
        Animated.spring(animLeft, { toValue: 0, ...SPRING }),
        Animated.spring(animTop, { toValue: finalImageTop, ...SPRING }),
        Animated.spring(animSize, { toValue: screenWidth, ...SPRING }),
        Animated.spring(animRadius, { toValue: 0, ...SPRING }),
        Animated.timing(animBgOpacity, { toValue: 1, duration: 250, useNativeDriver: false }),
        Animated.timing(animActionsOpacity, { toValue: 1, duration: 200, delay: 220, useNativeDriver: false }),
      ]).start();
    });
  };

  const closePhotoViewer = () => {
    const { x, y, size } = avatarSnapshot.current;
    // Immediately hide action bar + start fading background
    Animated.timing(animActionsOpacity, { toValue: 0, duration: 80, useNativeDriver: false }).start();
    Animated.timing(animBgOpacity, { toValue: 0, duration: 220, useNativeDriver: false }).start();
    // Zoom image back; fade it out in the last 80ms so it never lands visibly on the profile
    Animated.parallel([
      Animated.spring(animLeft, { toValue: x, ...SPRING }),
      Animated.spring(animTop, { toValue: y, ...SPRING }),
      Animated.spring(animSize, { toValue: size, ...SPRING }),
      Animated.spring(animRadius, { toValue: size / 2, ...SPRING }),
      Animated.sequence([
        Animated.delay(160),
        Animated.timing(animImageOpacity, { toValue: 0, duration: 80, useNativeDriver: false }),
      ]),
    ]).start(() => setShowPhotoViewer(false));
  };

  const handleAvatarPress = () => {
    if (userProfile?.profileImageUrl) {
      openPhotoViewer();
    } else {
      showPickerOptions();
    }
  };

  const showPickerOptions = () => {
    Alert.alert(t('profile.avatar.profilePhoto'), '', [
      { text: t('profile.avatar.uploadGallery'), onPress: () => pickImage('gallery') },
      { text: t('profile.avatar.takePhoto'), onPress: () => pickImage('camera') },
      { text: t('common.cancel'), style: 'cancel' },
    ]);
  };

  const pickImage = async (source: 'gallery' | 'camera') => {
    const permission = source === 'gallery'
      ? await ImagePicker.requestMediaLibraryPermissionsAsync()
      : await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        t('profile.avatar.permissionRequired'),
        source === 'gallery' ? t('profile.avatar.galleryPermission') : t('profile.avatar.cameraPermission'),
      );
      return;
    }

    const result = source === 'gallery'
      ? await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.7 })
      : await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.7 });

    if (result.canceled || !result.assets[0]) return;
    await uploadAvatar(result.assets[0].uri);
  };

  const uploadAvatar = async (uri: string) => {
    if (!userProfile) return;
    setUploadingImage(true);
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const path = `${userProfile.id}/avatar.jpg`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, bytes, { contentType: 'image/jpeg', upsert: true });

      if (uploadError) { Alert.alert('Upload failed', uploadError.message); return; }

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
      // Append timestamp to bust expo-image cache (same path = same URL = stale cache)
      const urlWithCacheBust = `${publicUrl}?t=${Date.now()}`;
      await supabase.from('USER').update({ profileImageUrl: urlWithCacheBust }).eq('id', userProfile.id);
      await refreshProfile();
    } catch {
      Alert.alert('Error', 'Failed to upload image.');
    } finally {
      setUploadingImage(false);
    }
  };

  const deleteAvatar = async () => {
    if (!userProfile) return;
    setUploadingImage(true);
    try {
      await supabase.storage.from('avatars').remove([`${userProfile.id}/avatar.jpg`]);
      await supabase.from('USER').update({ profileImageUrl: null }).eq('id', userProfile.id);
      await refreshProfile();
    } catch {
      Alert.alert('Error', 'Failed to remove image.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      t('profile.logout'),
      t('profile.logoutConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('profile.logout'), style: 'destructive', onPress: logout },
      ],
    );
  };

  if (profileLoading || !userProfile) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  const nextLevel = getNextLevel(userProfile.level);
  const activeSubscriptions = userSubscriptions.filter(s => s.status === 'active');

  const levelGradients: Record<string, [string, string]> = {
    bronze: ['#CD7F32', '#8B5A2B'],
    silver: ['#C0C0C0', '#808080'],
    gold: ['#FFD700', '#DAA520'],
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.neutral.background} />
      

      <ScrollView 
        style={styles.content}
        contentContainerStyle={[styles.contentContainer, { paddingTop: insets.top + spacing.lg }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View ref={avatarMeasureRef}>
          <TouchableOpacity style={styles.avatarContainer} onPress={handleAvatarPress} activeOpacity={0.8}>
            {userProfile.profileImageUrl ? (
              <Image
                source={{ uri: userProfile.profileImageUrl }}
                style={styles.avatar}
                contentFit="cover"
                transition={200}
              />
            ) : (
              <LinearGradient
                colors={[colors.primary.main, colors.secondary.main]}
                style={styles.avatarPlaceholder}
              >
                <Ionicons name="person" size={40} color={colors.neutral.white} />
              </LinearGradient>
            )}
            {/* Upload overlay */}
            {uploadingImage && (
              <View style={styles.avatarOverlay}>
                <ActivityIndicator color="#FFF" />
              </View>
            )}
            {/* Edit badge */}
            <View style={styles.editBadge}>
              <Ionicons name="camera" size={12} color="#FFF" />
            </View>
            {/* Level Badge */}
            <LinearGradient
              colors={levelGradients[userProfile.level]}
              style={styles.levelBadge}
            >
              <Ionicons name="star" size={12} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{userProfile.fullName}</Text>
          <View style={styles.levelRow}>
            <LinearGradient
              colors={levelGradients[userProfile.level]}
              style={styles.levelTag}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.levelTagText}>
                {t(`profile.levels.${userProfile.level}`).toUpperCase()}
              </Text>
            </LinearGradient>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userProfile.totalPurchases}</Text>
              <Text style={styles.statLabel}>{t('profile.showsAttended')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{activeSubscriptions.length}</Text>
              <Text style={styles.statLabel}>{t('profile.activeSubscriptions')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>4.8</Text>
              <Text style={styles.statLabel}>{t('profile.avgRating')}</Text>
            </View>
          </View>

          {/* Level Progress */}
          {nextLevel && (
            <View style={styles.levelProgress}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>{t('profile.nextLevel')}</Text>
                <Text style={styles.progressValue}>
                  {nextLevel.showsNeeded} {t('profile.showsToGo')}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <LinearGradient
                  colors={levelGradients[nextLevel.level]}
                  style={[
                    styles.progressFill,
                    { 
                      width: `${Math.min(100, ((userProfile.totalPurchases) / (userProfile.totalPurchases + nextLevel.showsNeeded)) * 100)}%`,
                    },
                  ]} 
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </View>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction}>
            <LinearGradient
              colors={['rgba(168, 85, 247, 0.2)', 'rgba(168, 85, 247, 0.1)']}
              style={styles.quickActionGradient}
            >
              <Ionicons name="heart" size={24} color={colors.primary.main} />
            </LinearGradient>
            <Text style={styles.quickActionLabel}>{t('profile.watchlist')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <LinearGradient
              colors={['rgba(236, 72, 153, 0.2)', 'rgba(236, 72, 153, 0.1)']}
              style={styles.quickActionGradient}
            >
              <Ionicons name="star" size={24} color={colors.secondary.main} />
            </LinearGradient>
            <Text style={styles.quickActionLabel}>{t('profile.reviews')}</Text>
          </TouchableOpacity>
          {/* MVP hidden temporarily – Rewards planned for future release */}
        </View>

        {/* Explore Section – MVP hidden temporarily: My Stats planned for future release */}
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Explore</Text>
          <View style={styles.menuCard}>
            <MenuItem icon="stats-chart" label="My Stats" onPress={() => navigation.navigate('Analytics')} />
            <View style={styles.menuDivider} />
            <MenuItem icon="people" label="Community" onPress={() => navigation.navigate('Social')} />
            <View style={styles.menuDivider} />
            <MenuItem icon="map" label="Theater Map" onPress={() => navigation.navigate('Map')} />
            <View style={styles.menuDivider} />
            <MenuItem icon="business" label="Hall Library" onPress={() => navigation.navigate('HallLibrary')} />
          </View>
        </View> */}

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.settings')}</Text>
          <View style={styles.menuCard}>
            <MenuItem 
              icon="person-outline" 
              label={t('profile.editProfile')}
              onPress={() => navigation.navigate('Settings')}
            />
            <View style={styles.menuDivider} />
            {/* MVP hidden temporarily – Payment Methods planned for future release */}
            {/* <MenuItem icon="card-outline" label={t('profile.paymentMethods')} value="•••• 4242" onPress={() => navigation.navigate('PaymentMethods')} />
            <View style={styles.menuDivider} /> */}
            <MenuItem
              icon="notifications-outline"
              label={t('profile.notifications')}
              onPress={() => navigation.navigate('NotificationPreferences')}
            />
            <View style={styles.menuDivider} />
            <MenuItem
              icon="color-palette-outline"
              label="Appearance"
              onPress={() => navigation.navigate('Appearance')}
            />
            <View style={styles.menuDivider} />
            <MenuItem
              icon="language-outline"
              label={t('profile.language')}
              value={i18n.language === 'he' ? 'עברית' : i18n.language === 'ru' ? 'Русский' : 'English'}
              onPress={() => setShowLanguageModal(true)}
            />
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.support')}</Text>
          <View style={styles.menuCard}>
            <MenuItem 
              icon="chatbubbles-outline" 
              label="Live Chat"
              onPress={() => navigation.navigate('LiveChat')}
            />
            <View style={styles.menuDivider} />
            <MenuItem
              icon="help-circle-outline"
              label={t('profile.faq')}
              onPress={() => navigation.navigate('FAQ')}
            />
            <View style={styles.menuDivider} />
            <MenuItem
              icon="logo-instagram"
              label={t('profile.contactUs')}
              onPress={() => Linking.openURL('https://www.instagram.com/showmiapp').catch(() =>
                Linking.openURL('instagram://user?username=showmiapp')
              )}
            />
            <View style={styles.menuDivider} />
            <MenuItem 
              icon="document-text-outline" 
              label={t('profile.termsOfUse')}
            />
            <View style={styles.menuDivider} />
            <MenuItem 
              icon="shield-outline" 
              label={t('profile.privacyPolicy')}
            />
          </View>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <View style={styles.menuCard}>
            <MenuItem
              icon="log-out-outline"
              label={t('profile.logout')}
              showChevron={false}
              destructive
              onPress={handleLogout}
            />
          </View>
        </View>

        {/* App Version */}
        <Text style={styles.versionText}>2026 showmi v1.0.0</Text>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Full-Screen Photo Viewer */}
      <Modal
        visible={showPhotoViewer}
        transparent
        animationType="none"
        onRequestClose={closePhotoViewer}
        statusBarTranslucent
      >
        {/* Dimmed background */}
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: '#000', opacity: animBgOpacity }]} />

        {/* Expanding image — animated container clips borderRadius cleanly */}
        <Animated.View
          style={{
            position: 'absolute',
            left: animLeft,
            top: animTop,
            width: animSize,
            height: animSize,
            borderRadius: animRadius,
            overflow: 'hidden',
            opacity: animImageOpacity,
          }}
        >
          <Image
            source={{ uri: userProfile?.profileImageUrl ?? '' }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
        </Animated.View>

        {/* Tap-to-dismiss overlay + action bar */}
        <TouchableWithoutFeedback onPress={closePhotoViewer}>
          <View style={StyleSheet.absoluteFill}>
            {/* Action bar — RTL-aware, fades in after image expands */}
            <Animated.View style={[
              styles.photoViewerBar,
              { opacity: animActionsOpacity, flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse' },
            ]}>
              <TouchableOpacity
                style={styles.photoViewerAction}
                onPress={() => {
                  closePhotoViewer();
                  setTimeout(() => {
                    Alert.alert(t('profile.avatar.profilePhoto'), '', [
                      { text: t('profile.avatar.uploadGallery'), onPress: () => pickImage('gallery') },
                      { text: t('profile.avatar.takePhoto'), onPress: () => pickImage('camera') },
                      { text: t('common.cancel'), style: 'cancel' },
                    ]);
                  }, 350);
                }}
              >
                <Ionicons name="pencil" size={22} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.photoViewerAction}
                onPress={() => { closePhotoViewer(); setTimeout(deleteAvatar, 400); }}
              >
                <Ionicons name="trash-outline" size={22} color="#FF6B6B" />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowLanguageModal(false)}
        >
          <View style={styles.languageSheet}>
            <View style={styles.languageSheetHandle} />
            <Text style={styles.languageSheetTitle}>{t('profile.language')}</Text>
            {Object.values(SUPPORTED_LANGUAGES).map((lang, index) => {
              const isSelected = i18n.language === lang.code;
              return (
                <TouchableOpacity
                  key={lang.code}
                  style={[styles.languageOption, index > 0 && styles.languageOptionBorder]}
                  onPress={async () => {
                    const needsRestart = await changeLanguage(lang.code as LanguageCode);
                    await supabase.from('USER').update({ language: lang.code }).eq('id', userProfile.id);
                    setShowLanguageModal(false);
                    if (needsRestart) {
                      Alert.alert(
                        lang.code === 'he' ? 'נדרשת הפעלה מחדש' : 'Restart Required',
                        lang.code === 'he'
                          ? 'כיוון הטקסט ישתנה לאחר הפעלה מחדש של האפליקציה.'
                          : 'Text direction will update after you restart the app.',
                        [{ text: lang.code === 'he' ? 'אוקיי' : 'OK' }],
                      );
                    }
                  }}
                >
                  <View>
                    <Text style={styles.languageNative}>{lang.nativeName}</Text>
                    <Text style={styles.languageSubtext}>{lang.name}</Text>
                  </View>
                  {isSelected && (
                    <LinearGradient
                      colors={[colors.primary.main, colors.secondary.main]}
                      style={styles.languageCheck}
                    >
                      <Ionicons name="checkmark" size={14} color={colors.neutral.white} />
                    </LinearGradient>
                  )}
                </TouchableOpacity>
              );
            })}
            <View style={{ height: 20 }} />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: colors.dark[700],
    borderRadius: 20,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: colors.primary.main,
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    borderRadius: 45,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.dark[700],
  },
  levelBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.dark[700],
  },
  userName: {
    ...typography.headingLarge,
    color: colors.neutral.text,
  },
  levelRow: {
    marginTop: spacing.sm,
  },
  levelTag: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xxs,
    borderRadius: 12,
  },
  levelTagText: {
    ...typography.labelSmall,
    color: colors.neutral.white,
    fontWeight: '700',
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...typography.headingMedium,
    color: colors.neutral.text,
  },
  statLabel: {
    ...typography.caption,
    color: colors.neutral.textTertiary,
    marginTop: spacing.xxs,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.dark[500],
  },
  levelProgress: {
    width: '85%',
    marginTop: spacing.xl,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  progressLabel: {
    ...typography.bodySmall,
    color: colors.neutral.textSecondary,
  },
  progressValue: {
    ...typography.labelSmall,
    color: colors.primary.main,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.dark[600],
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: spacing.xs,
  },
  quickActionGradient: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  quickActionLabel: {
    ...typography.labelSmall,
    color: colors.neutral.textSecondary,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.labelMedium,
    color: colors.neutral.textTertiary,
    marginBottom: spacing.sm,
    marginStart: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  menuCard: {
    backgroundColor: colors.dark[700],
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIconDestructive: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  menuItemLabel: {
    ...typography.bodyMedium,
    color: colors.neutral.text,
    marginStart: spacing.md,
  },
  menuItemDestructive: {
    color: colors.semantic.error,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemValue: {
    ...typography.bodySmall,
    color: colors.neutral.textTertiary,
    marginEnd: spacing.xs,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.dark[500],
    marginStart: 68,
  },
  versionText: {
    ...typography.caption,
    color: colors.neutral.textTertiary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  // Language modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  languageSheet: {
    backgroundColor: colors.dark[800],
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderColor: colors.dark[500],
  },
  languageSheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.dark[500],
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  languageSheetTitle: {
    ...typography.headingMedium,
    color: colors.neutral.text,
    marginBottom: spacing.lg,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  languageOptionBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.dark[500],
  },
  languageNative: {
    ...typography.bodyMedium,
    color: colors.neutral.text,
  },
  languageSubtext: {
    ...typography.bodySmall,
    color: colors.neutral.textTertiary,
    marginTop: spacing.xxs,
  },
  languageCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoViewerBar: {
    position: 'absolute',
    top: 56,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    gap: 12,
    zIndex: 10,
    justifyContent: 'flex-start',
  },
  photoViewerAction: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
