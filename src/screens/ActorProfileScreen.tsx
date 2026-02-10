// ============================================
// ShowME App - Actor Profile Screen (Dark Aurora Theme)
// ============================================

import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StatusBar,
  Animated,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing } from '../theme/theme';
import { RootStackParamList } from '../types/types';
import { getActorById } from '../data/actors';
import { useShows } from '../hooks/useShows';
import { ShowCard } from '../components/components';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEADER_HEIGHT = SCREEN_HEIGHT * 0.4;

type ActorProfileRouteProp = RouteProp<RootStackParamList, 'ActorProfile'>;
type ActorProfileNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ActorProfileScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<ActorProfileNavigationProp>();
  const route = useRoute<ActorProfileRouteProp>();
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;

  const actor = getActorById(route.params.actorId);
  const { shows } = useShows();

  const isHebrew = i18n.language === 'he';
  const isRussian = i18n.language === 'ru';

  if (!actor) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.errorContainer}>
          <Ionicons
            name="person-outline"
            size={48}
            color={colors.neutral.textTertiary}
          />
          <Text style={styles.errorText}>{t('errors.actorNotFound')}</Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => navigation.goBack()}
          >
            <LinearGradient
              colors={[colors.primary.main, colors.primary.dark]}
              style={styles.errorButtonGradient}
            >
              <Text style={styles.errorButtonText}>{t('common.back')}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const name = isHebrew ? actor.nameHe : isRussian ? actor.nameRu : actor.name;
  const bio = isHebrew ? actor.bioHe : isRussian ? actor.bioRu : actor.bio;

  // Get shows this actor is in
  const actorShows = shows.filter((show) => actor.showIds.includes(show.id));

  const navigateToShow = (showId: string) => {
    navigation.navigate('ShowDetails', { showId });
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT - 150],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Animated Header */}
      <Animated.View
        style={[
          styles.animatedHeader,
          { paddingTop: insets.top, opacity: headerOpacity },
        ]}
      >
        <View style={styles.animatedHeaderBg} />
        <Text style={styles.animatedHeaderTitle} numberOfLines={1}>
          {name}
        </Text>
      </Animated.View>

      {/* Back Button */}
      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + spacing.sm }]}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={colors.neutral.white} />
      </TouchableOpacity>

      {/* Share Button */}
      <TouchableOpacity
        style={[styles.shareButton, { top: insets.top + spacing.sm }]}
        onPress={() => {}}
      >
        <Ionicons name="share-outline" size={24} color={colors.neutral.white} />
      </TouchableOpacity>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image
            source={{ uri: actor.imageUrl }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={[
              'transparent',
              'rgba(10, 10, 15, 0.7)',
              colors.neutral.background,
            ]}
            style={styles.heroGradient}
          />

          <View style={styles.heroContent}>
            <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: actor.imageUrl }}
                style={styles.profileImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(168, 85, 247, 0.3)']}
                style={styles.profileImageGradient}
              />
            </View>
            <Text style={styles.actorName}>{name}</Text>
            {!isHebrew && (
              <Text style={styles.actorNameSecondary}>{actor.nameHe}</Text>
            )}
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <LinearGradient
              colors={['rgba(168, 85, 247, 0.2)', 'rgba(168, 85, 247, 0.1)']}
              style={styles.statIcon}
            >
              <Ionicons
                name="film-outline"
                size={20}
                color={colors.primary.main}
              />
            </LinearGradient>
            <Text style={styles.statNumber}>{actorShows.length}</Text>
            <Text style={styles.statLabel}>{t('actor.activeShows')}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <LinearGradient
              colors={['rgba(236, 72, 153, 0.2)', 'rgba(236, 72, 153, 0.1)']}
              style={styles.statIcon}
            >
              <Ionicons
                name="star-outline"
                size={20}
                color={colors.secondary.main}
              />
            </LinearGradient>
            <Text style={styles.statNumber}>{actor.showIds.length}</Text>
            <Text style={styles.statLabel}>{t('actor.totalShows')}</Text>
          </View>
        </View>

        {/* Bio Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('actor.about')}</Text>
          <View style={styles.bioCard}>
            <Text style={styles.bioText}>{bio}</Text>
          </View>
        </View>

        {/* Photos Gallery */}
        {actor.photos && actor.photos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('actor.photos')}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.photosContainer}
            >
              {actor.photos.map((photo: string, index: number) => (
                <TouchableOpacity key={index} style={styles.photoItem}>
                  <Image
                    source={{ uri: photo }}
                    style={styles.photoImage}
                    resizeMode="cover"
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(10, 10, 15, 0.5)']}
                    style={styles.photoGradient}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Current Shows */}
        {actorShows.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('actor.currentShows')}</Text>
            <FlatList
              data={actorShows}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.showCardWrapper}>
                  <ShowCard
                    show={item}
                    onPress={() => navigateToShow(item.id)}
                    size="small"
                  />
                </View>
              )}
              contentContainerStyle={styles.showsContainer}
            />
          </View>
        )}

        {/* Follow Button */}
        <View style={styles.followSection}>
          <TouchableOpacity style={styles.followButton}>
            <LinearGradient
              colors={[colors.primary.main, colors.secondary.main]}
              style={styles.followButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons
                name="heart-outline"
                size={20}
                color={colors.neutral.white}
              />
              <Text style={styles.followButtonText}>
                {t('actor.follow', { defaultValue: 'Follow' })}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <Text style={styles.followHint}>
            {t('actor.followHint', {
              defaultValue: 'Get notified about new shows',
            })}
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.background,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  errorText: {
    ...typography.bodyLarge,
    color: colors.neutral.text,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  errorButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  errorButtonGradient: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  errorButtonText: {
    ...typography.labelLarge,
    color: colors.neutral.white,
  },
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingBottom: spacing.md,
  },
  animatedHeaderBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.dark[800],
  },
  animatedHeaderTitle: {
    ...typography.headingMedium,
    color: colors.neutral.text,
    maxWidth: SCREEN_WIDTH * 0.6,
  },
  backButton: {
    position: 'absolute',
    left: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 101,
  },
  shareButton: {
    position: 'absolute',
    right: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 101,
  },
  heroSection: {
    height: HEADER_HEIGHT,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: spacing.xl,
  },
  profileImageContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: colors.primary.main,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileImageGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  actorName: {
    ...typography.displaySmall,
    color: colors.neutral.white,
    textAlign: 'center',
  },
  actorNameSecondary: {
    ...typography.bodyLarge,
    color: colors.neutral.textSecondary,
    marginTop: spacing.xs,
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: colors.dark[700],
    marginHorizontal: spacing.lg,
    marginTop: -spacing.xl,
    borderRadius: 16,
    padding: spacing.lg,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statNumber: {
    ...typography.headingLarge,
    color: colors.neutral.text,
  },
  statLabel: {
    ...typography.bodySmall,
    color: colors.neutral.textTertiary,
    marginTop: spacing.xxs,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.dark[500],
    marginHorizontal: spacing.lg,
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  sectionTitle: {
    ...typography.headingSmall,
    color: colors.neutral.text,
    marginBottom: spacing.md,
  },
  bioCard: {
    backgroundColor: colors.dark[700],
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  bioText: {
    ...typography.bodyMedium,
    color: colors.neutral.textSecondary,
    lineHeight: 24,
  },
  photosContainer: {
    paddingRight: spacing.lg,
  },
  photoItem: {
    marginRight: spacing.md,
    borderRadius: 12,
    overflow: 'hidden',
  },
  photoImage: {
    width: 140,
    height: 180,
  },
  photoGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  showsContainer: {
    paddingRight: spacing.lg,
  },
  showCardWrapper: {
    marginRight: spacing.md,
  },
  followSection: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
  },
  followButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  followButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    gap: spacing.sm,
  },
  followButtonText: {
    ...typography.labelLarge,
    color: colors.neutral.white,
  },
  followHint: {
    ...typography.bodySmall,
    color: colors.neutral.textTertiary,
    marginTop: spacing.sm,
  },
});
