// ============================================
// ShowME App - Hall Details Screen
// ============================================

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  FlatList,
  Animated,
} from 'react-native';
import { getAppWidth } from '../utils/dimensions';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing } from '../theme/theme';
import { RootStackParamList } from '../types/types';
import { getHallById, ZONE_COLORS, ZONE_LABELS, getPriceRange, Hall, HallSection } from '../data/halls';

const SCREEN_WIDTH = getAppWidth();

type HallDetailsRouteProp = RouteProp<RootStackParamList, 'HallDetails'>;

export default function HallDetailsScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<HallDetailsRouteProp>();
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;

  const { hallId } = route.params;
  const hall = getHallById(hallId);

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  if (!hall) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Hall not found</Text>
      </View>
    );
  }

  const isHebrew = i18n.language === 'he';
  const priceRange = getPriceRange(hallId);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const renderPhotoItem = ({ item, index }: { item: string; index: number }) => (
    <Image source={{ uri: item }} style={styles.galleryImage} contentFit="cover" transition={200} />
  );

  const renderZoneCard = (section: HallSection) => {
    const zoneLabel = ZONE_LABELS[section.zone];
    const totalSeats = section.rows.reduce((sum, row) => sum + row.seats.length, 0);
    const availableSeats = section.rows.reduce(
      (sum, row) => sum + row.seats.filter(s => s.available).length,
      0
    );
    const avgPrice = section.rows[0]?.seats[0]?.price || 0;

    return (
      <View key={section.id} style={styles.zoneCard}>
        <View style={[styles.zoneColorBar, { backgroundColor: section.color }]} />
        <View style={styles.zoneContent}>
          <View style={styles.zoneHeader}>
            <Text style={styles.zoneName}>{isHebrew ? section.nameHe : section.name}</Text>
            <View style={[styles.zoneBadge, { backgroundColor: `${section.color}30` }]}>
              <Text style={[styles.zoneBadgeText, { color: section.color }]}>
                {isHebrew ? zoneLabel.he : zoneLabel.en}
              </Text>
            </View>
          </View>
          <View style={styles.zoneStats}>
            <View style={styles.zoneStat}>
              <Ionicons name="grid-outline" size={14} color={colors.neutral.textTertiary} />
              <Text style={styles.zoneStatText}>{totalSeats} seats</Text>
            </View>
            <View style={styles.zoneStat}>
              <Ionicons name="checkmark-circle-outline" size={14} color={colors.semantic.success} />
              <Text style={styles.zoneStatText}>{availableSeats} available</Text>
            </View>
            <View style={styles.zoneStat}>
              <Ionicons name="pricetag-outline" size={14} color={colors.primary.main} />
              <Text style={styles.zoneStatText}>₪{avgPrice}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Animated Header */}
      <Animated.View style={[styles.animatedHeader, { opacity: headerOpacity, paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.neutral.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {isHebrew ? hall.nameHe : hall.name}
        </Text>
        <View style={{ width: 40 }} />
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: hall.imageUrl }} style={styles.heroImage} contentFit="cover" transition={300} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)', colors.neutral.background]}
            style={styles.heroGradient}
          />
          
          {/* Back Button */}
          <TouchableOpacity 
            style={[styles.backButton, { top: insets.top + spacing.sm }]}
            onPress={() => navigation.goBack()}
          >
            <View style={styles.backButtonBg}>
              <Ionicons name="arrow-back" size={24} color={colors.neutral.white} />
            </View>
          </TouchableOpacity>

          {/* Hall Info Overlay */}
          <View style={styles.heroContent}>
            <Text style={styles.hallName}>{isHebrew ? hall.nameHe : hall.name}</Text>
            <Text style={styles.theaterName}>{hall.theaterName}</Text>
            <View style={styles.heroStats}>
              <View style={styles.heroStat}>
                <Ionicons name="people" size={16} color={colors.primary.main} />
                <Text style={styles.heroStatText}>{hall.capacity} seats</Text>
              </View>
              <View style={styles.heroStatDivider} />
              <View style={styles.heroStat}>
                <Ionicons name="pricetag" size={16} color={colors.secondary.main} />
                <Text style={styles.heroStatText}>₪{priceRange.min} - ₪{priceRange.max}</Text>
              </View>
              {hall.established && (
                <>
                  <View style={styles.heroStatDivider} />
                  <View style={styles.heroStat}>
                    <Ionicons name="calendar" size={16} color={colors.accent.main} />
                    <Text style={styles.heroStatText}>Est. {hall.established}</Text>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>
              {isHebrew ? hall.descriptionHe : hall.description}
            </Text>
          </View>

          {/* Photo Gallery */}
          {hall.photos.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Gallery</Text>
              <FlatList
                data={hall.photos}
                renderItem={renderPhotoItem}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.galleryList}
                snapToInterval={SCREEN_WIDTH * 0.7 + spacing.md}
                decelerationRate="fast"
              />
            </View>
          )}

          {/* Seating Zones */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Seating Zones</Text>
            <View style={styles.zonesContainer}>
              {hall.layout.sections.map(renderZoneCard)}
            </View>
          </View>

          {/* Stage Type */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Stage</Text>
            <View style={styles.stageCard}>
              <View style={styles.stageIcon}>
                <Ionicons name="albums" size={24} color={colors.primary.main} />
              </View>
              <View style={styles.stageInfo}>
                <Text style={styles.stageType}>
                  {hall.layout.stage.type.charAt(0).toUpperCase() + hall.layout.stage.type.slice(1).replace('_', ' ')} Stage
                </Text>
                <Text style={styles.stageDesc}>
                  {hall.layout.stage.type === 'proscenium' && 'Classic frame stage with clear audience separation'}
                  {hall.layout.stage.type === 'thrust' && 'Stage extends into audience on three sides'}
                  {hall.layout.stage.type === 'arena' && 'Audience surrounds the stage completely'}
                  {hall.layout.stage.type === 'black_box' && 'Flexible space with configurable staging'}
                  {hall.layout.stage.type === 'amphitheater' && 'Semi-circular outdoor-style seating'}
                </Text>
              </View>
            </View>
          </View>

          {/* Amenities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesGrid}>
              {hall.amenities.map((amenity) => (
                <View key={amenity.id} style={styles.amenityItem}>
                  <View style={styles.amenityIcon}>
                    <Ionicons name={amenity.icon as any} size={20} color={colors.primary.main} />
                  </View>
                  <Text style={styles.amenityName}>{amenity.name}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Accessibility */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Accessibility</Text>
            <View style={styles.accessibilityList}>
              {hall.accessibility.map((feature) => (
                <View key={feature.id} style={styles.accessibilityItem}>
                  <View style={styles.accessibilityIcon}>
                    <Ionicons name={feature.icon as any} size={20} color={colors.semantic.success} />
                  </View>
                  <View style={styles.accessibilityContent}>
                    <Text style={styles.accessibilityName}>{feature.name}</Text>
                    <Text style={styles.accessibilityDesc}>{feature.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Audio Systems */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Audio & Technology</Text>
            <View style={styles.audioTags}>
              {hall.audioSystems.map((system, index) => (
                <View key={index} style={styles.audioTag}>
                  <Ionicons name="volume-high" size={14} color={colors.accent.main} />
                  <Text style={styles.audioTagText}>{system}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={{ height: 100 }} />
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral.background },
  errorText: { ...typography.bodyLarge, color: colors.neutral.text, textAlign: 'center', marginTop: 100 },
  animatedHeader: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingBottom: spacing.md, backgroundColor: colors.dark[800], zIndex: 100, borderBottomWidth: 1, borderBottomColor: colors.dark[500] },
  headerButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { ...typography.headingSmall, color: colors.neutral.text, flex: 1, textAlign: 'center' },
  scrollView: { flex: 1 },
  heroContainer: { height: 350, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroGradient: { ...StyleSheet.absoluteFillObject },
  backButton: { position: 'absolute', left: spacing.lg, zIndex: 10 },
  backButtonBg: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0, 0, 0, 0.5)', alignItems: 'center', justifyContent: 'center' },
  heroContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: spacing.lg },
  hallName: { ...typography.displaySmall, color: colors.neutral.white, marginBottom: spacing.xxs },
  theaterName: { ...typography.bodyMedium, color: colors.neutral.textSecondary, marginBottom: spacing.md },
  heroStats: { flexDirection: 'row', alignItems: 'center' },
  heroStat: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  heroStatText: { ...typography.labelSmall, color: colors.neutral.textSecondary },
  heroStatDivider: { width: 1, height: 16, backgroundColor: colors.dark[500], marginHorizontal: spacing.md },
  content: { padding: spacing.lg },
  section: { marginBottom: spacing.xl },
  sectionTitle: { ...typography.headingSmall, color: colors.neutral.text, marginBottom: spacing.md },
  description: { ...typography.bodyMedium, color: colors.neutral.textSecondary, lineHeight: 24 },
  galleryList: { paddingRight: spacing.lg },
  galleryImage: { width: SCREEN_WIDTH * 0.7, height: 180, borderRadius: 12, marginEnd: spacing.md },
  zonesContainer: { gap: spacing.sm },
  zoneCard: { flexDirection: 'row', backgroundColor: colors.dark[700], borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: colors.dark[500] },
  zoneColorBar: { width: 4 },
  zoneContent: { flex: 1, padding: spacing.md },
  zoneHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  zoneName: { ...typography.labelMedium, color: colors.neutral.text },
  zoneBadge: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xxs, borderRadius: 8 },
  zoneBadgeText: { ...typography.caption, fontWeight: '600' },
  zoneStats: { flexDirection: 'row', gap: spacing.lg },
  zoneStat: { flexDirection: 'row', alignItems: 'center', gap: spacing.xxs },
  zoneStatText: { ...typography.caption, color: colors.neutral.textTertiary },
  stageCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.dark[700], borderRadius: 12, padding: spacing.md, borderWidth: 1, borderColor: colors.dark[500] },
  stageIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(168, 85, 247, 0.2)', alignItems: 'center', justifyContent: 'center', marginEnd: spacing.md },
  stageInfo: { flex: 1 },
  stageType: { ...typography.labelMedium, color: colors.neutral.text, marginBottom: spacing.xxs },
  stageDesc: { ...typography.bodySmall, color: colors.neutral.textSecondary },
  amenitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  amenityItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.dark[700], borderRadius: 20, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, gap: spacing.sm },
  amenityIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(168, 85, 247, 0.2)', alignItems: 'center', justifyContent: 'center' },
  amenityName: { ...typography.labelSmall, color: colors.neutral.text },
  accessibilityList: { gap: spacing.sm },
  accessibilityItem: { flexDirection: 'row', backgroundColor: colors.dark[700], borderRadius: 12, padding: spacing.md, borderWidth: 1, borderColor: colors.dark[500] },
  accessibilityIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(16, 185, 129, 0.2)', alignItems: 'center', justifyContent: 'center', marginEnd: spacing.md },
  accessibilityContent: { flex: 1 },
  accessibilityName: { ...typography.labelMedium, color: colors.neutral.text, marginBottom: spacing.xxs },
  accessibilityDesc: { ...typography.bodySmall, color: colors.neutral.textSecondary },
  audioTags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  audioTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(6, 182, 212, 0.15)', borderRadius: 16, paddingVertical: spacing.xs, paddingHorizontal: spacing.md, gap: spacing.xs },
  audioTagText: { ...typography.labelSmall, color: colors.accent.main },
});
