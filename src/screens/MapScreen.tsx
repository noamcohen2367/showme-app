// ============================================
// ShowME App - Theater Map Screen
// ============================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { getAppWidth } from '../utils/dimensions';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing } from '../theme/theme';
import { theaters } from '../data/theaters';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SCREEN_WIDTH = getAppWidth();

interface TheaterLocation {
  id: string;
  name: string;
  address: string;
  area: string;
  coordinates: { lat: number; lng: number };
  distance?: string;
  image: string;
  showCount: number;
  rating: number;
}

const THEATER_LOCATIONS: TheaterLocation[] = [
  {
    id: 'theater-1',
    name: 'Habima National Theatre',
    address: 'Habima Square, Tel Aviv',
    area: 'Tel Aviv',
    coordinates: { lat: 32.0733, lng: 34.7794 },
    distance: '2.3 km',
    image: 'https://picsum.photos/seed/theater1/400/200',
    showCount: 8,
    rating: 4.8,
  },
  {
    id: 'theater-2',
    name: 'Cameri Theatre',
    address: '19 Shaul HaMelech Blvd, Tel Aviv',
    area: 'Tel Aviv',
    coordinates: { lat: 32.0851, lng: 34.7818 },
    distance: '3.1 km',
    image: 'https://picsum.photos/seed/theater2/400/200',
    showCount: 6,
    rating: 4.6,
  },
  {
    id: 'theater-3',
    name: 'Beit Lessin Theatre',
    address: '101 Dizengoff St, Tel Aviv',
    area: 'Tel Aviv',
    coordinates: { lat: 32.0803, lng: 34.7738 },
    distance: '1.8 km',
    image: 'https://picsum.photos/seed/theater3/400/200',
    showCount: 5,
    rating: 4.5,
  },
  {
    id: 'theater-4',
    name: 'Jerusalem Theatre',
    address: '20 David Marcus St, Jerusalem',
    area: 'Jerusalem',
    coordinates: { lat: 31.7683, lng: 35.2137 },
    distance: '65 km',
    image: 'https://picsum.photos/seed/theater4/400/200',
    showCount: 4,
    rating: 4.7,
  },
  {
    id: 'theater-5',
    name: 'Haifa Municipal Theatre',
    address: '50 Pevsner St, Haifa',
    area: 'Haifa',
    coordinates: { lat: 32.8191, lng: 34.9983 },
    distance: '95 km',
    image: 'https://picsum.photos/seed/theater5/400/200',
    showCount: 3,
    rating: 4.4,
  },
];

export default function MapScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [selectedTheater, setSelectedTheater] =
    useState<TheaterLocation | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  const areas = [...new Set(THEATER_LOCATIONS.map((t) => t.area))];
  const filteredTheaters = selectedArea
    ? THEATER_LOCATIONS.filter((t) => t.area === selectedArea)
    : THEATER_LOCATIONS;

  const renderTheaterMarker = (theater: TheaterLocation, index: number) => {
    const isSelected = selectedTheater?.id === theater.id;
    // Simulate map positioning based on index
    const positions = [
      { top: SCREEN_HEIGHT * 0.25, left: SCREEN_WIDTH * 0.45 },
      { top: SCREEN_HEIGHT * 0.3, left: SCREEN_WIDTH * 0.55 },
      { top: SCREEN_HEIGHT * 0.35, left: SCREEN_WIDTH * 0.4 },
      { top: SCREEN_HEIGHT * 0.6, left: SCREEN_WIDTH * 0.5 },
      { top: SCREEN_HEIGHT * 0.15, left: SCREEN_WIDTH * 0.48 },
    ];
    const pos = positions[index] || positions[0];

    return (
      <TouchableOpacity
        key={theater.id}
        style={[styles.marker, { top: pos.top, left: pos.left }]}
        onPress={() => setSelectedTheater(theater)}
      >
        <LinearGradient
          colors={
            isSelected
              ? [colors.primary.main, colors.secondary.main]
              : [colors.dark[600], colors.dark[700]]
          }
          style={[styles.markerDot, isSelected && styles.markerDotSelected]}
        >
          <Ionicons name="location" size={16} color={colors.neutral.white} />
        </LinearGradient>
        {isSelected && (
          <View style={styles.markerLabel}>
            <Text style={styles.markerLabelText} numberOfLines={1}>
              {theater.name}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderTheaterCard = (theater: TheaterLocation) => (
    <TouchableOpacity
      key={theater.id}
      style={[
        styles.theaterCard,
        selectedTheater?.id === theater.id && styles.theaterCardSelected,
      ]}
      onPress={() => setSelectedTheater(theater)}
    >
      <Image source={{ uri: theater.image }} style={styles.theaterImage} contentFit="cover" transition={300} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.theaterImageGradient}
      />
      <View style={styles.theaterInfo}>
        <View style={styles.theaterHeader}>
          <Text style={styles.theaterName} numberOfLines={1}>
            {theater.name}
          </Text>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={12} color={colors.accent.main} />
            <Text style={styles.ratingText}>{theater.rating}</Text>
          </View>
        </View>
        <Text style={styles.theaterAddress} numberOfLines={1}>
          {theater.address}
        </Text>
        <View style={styles.theaterMeta}>
          <View style={styles.metaItem}>
            <Ionicons
              name="location-outline"
              size={14}
              color={colors.neutral.textTertiary}
            />
            <Text style={styles.metaText}>{theater.distance}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons
              name="film-outline"
              size={14}
              color={colors.neutral.textTertiary}
            />
            <Text style={styles.metaText}>{theater.showCount} shows</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderListView = () => (
    <ScrollView style={styles.listContent} showsVerticalScrollIndicator={false}>
      {filteredTheaters.map(renderTheaterCard)}
      <View style={{ height: 100 }} />
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Map View */}
      {viewMode === 'map' && (
        <View style={styles.mapContainer}>
          {/* Simulated Map Background */}
          <Image
            source={{
              uri: 'https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/34.78,32.08,10,0/600x800?access_token=placeholder',
            }}
            style={styles.mapImage}
            placeholder={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==' }}
            contentFit="cover"
            transition={300}
          />
          <LinearGradient
            colors={[
              colors.neutral.background,
              'transparent',
              'transparent',
              colors.neutral.background,
            ]}
            style={styles.mapOverlay}
            locations={[0, 0.1, 0.7, 1]}
          />

          {/* Theater Markers */}
          {filteredTheaters.map((theater, index) =>
            renderTheaterMarker(theater, index)
          )}

          {/* Location Button */}
          <TouchableOpacity
            style={[styles.locationButton, { top: insets.top + 60 }]}
          >
            <Ionicons name="locate" size={22} color={colors.primary.main} />
          </TouchableOpacity>
        </View>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <View style={[styles.listContainer, { paddingTop: insets.top + 60 }]}>
          {renderListView()}
        </View>
      )}

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <View style={styles.headerButton}>
            <Ionicons name="arrow-back" size={22} color={colors.neutral.text} />
          </View>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Theaters Near You</Text>
        </View>
        <TouchableOpacity
          style={styles.viewToggle}
          onPress={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
        >
          <View style={styles.headerButton}>
            <Ionicons
              name={viewMode === 'map' ? 'list' : 'map'}
              size={22}
              color={colors.neutral.text}
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* Area Filter */}
      <View style={[styles.areaFilter, { top: insets.top + 60 }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.areaFilterContent}
        >
          <TouchableOpacity
            style={[styles.areaChip, !selectedArea && styles.areaChipActive]}
            onPress={() => setSelectedArea(null)}
          >
            <Text
              style={[
                styles.areaChipText,
                !selectedArea && styles.areaChipTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          {areas.map((area) => (
            <TouchableOpacity
              key={area}
              style={[
                styles.areaChip,
                selectedArea === area && styles.areaChipActive,
              ]}
              onPress={() => setSelectedArea(area)}
            >
              <Text
                style={[
                  styles.areaChipText,
                  selectedArea === area && styles.areaChipTextActive,
                ]}
              >
                {area}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Selected Theater Panel */}
      {selectedTheater && viewMode === 'map' && (
        <View
          style={[
            styles.theaterPanel,
            { paddingBottom: insets.bottom + spacing.lg },
          ]}
        >
          <View style={styles.panelHandle} />
          <View style={styles.panelContent}>
            <Image
              source={{ uri: selectedTheater.image }}
              style={styles.panelImage}
              contentFit="cover"
              transition={200}
            />
            <View style={styles.panelInfo}>
              <Text style={styles.panelName}>{selectedTheater.name}</Text>
              <Text style={styles.panelAddress}>{selectedTheater.address}</Text>
              <View style={styles.panelMeta}>
                <View style={styles.panelMetaItem}>
                  <Ionicons name="star" size={14} color={colors.accent.main} />
                  <Text style={styles.panelMetaText}>
                    {selectedTheater.rating}
                  </Text>
                </View>
                <View style={styles.panelMetaItem}>
                  <Ionicons
                    name="navigate"
                    size={14}
                    color={colors.primary.main}
                  />
                  <Text style={styles.panelMetaText}>
                    {selectedTheater.distance}
                  </Text>
                </View>
                <View style={styles.panelMetaItem}>
                  <Ionicons
                    name="film"
                    size={14}
                    color={colors.secondary.main}
                  />
                  <Text style={styles.panelMetaText}>
                    {selectedTheater.showCount} shows
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.panelActions}>
            <TouchableOpacity style={styles.panelActionSecondary}>
              <Ionicons
                name="navigate-outline"
                size={20}
                color={colors.primary.main}
              />
              <Text style={styles.panelActionSecondaryText}>Directions</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.panelActionPrimary}>
              <LinearGradient
                colors={[colors.primary.main, colors.secondary.main]}
                style={styles.panelActionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.panelActionPrimaryText}>View Shows</Text>
                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color={colors.neutral.white}
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral.background },
  mapContainer: { flex: 1, position: 'relative' },
  mapImage: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.dark[800],
  },
  mapOverlay: { ...StyleSheet.absoluteFillObject },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    zIndex: 10,
  },
  backButton: {},
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.dark[700],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { ...typography.headingSmall, color: colors.neutral.text },
  viewToggle: {},
  areaFilter: { position: 'absolute', left: 0, right: 0, zIndex: 10 },
  areaFilterContent: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  areaChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.dark[700],
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  areaChipActive: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  areaChipText: {
    ...typography.labelSmall,
    color: colors.neutral.textSecondary,
  },
  areaChipTextActive: { color: colors.neutral.white },
  marker: { position: 'absolute', alignItems: 'center' },
  markerDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.neutral.white,
  },
  markerDotSelected: { width: 44, height: 44, borderRadius: 22 },
  markerLabel: {
    backgroundColor: colors.dark[700],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: 8,
    marginTop: spacing.xxs,
    maxWidth: 120,
  },
  markerLabelText: { ...typography.caption, color: colors.neutral.text },
  locationButton: {
    position: 'absolute',
    right: spacing.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.dark[700],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  theaterPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.dark[800],
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderColor: colors.dark[500],
  },
  panelHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.dark[500],
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  panelContent: { flexDirection: 'row', marginBottom: spacing.lg },
  panelImage: { width: 80, height: 80, borderRadius: 12 },
  panelInfo: { flex: 1, marginStart: spacing.md },
  panelName: {
    ...typography.headingSmall,
    color: colors.neutral.text,
    marginBottom: spacing.xxs,
  },
  panelAddress: {
    ...typography.bodySmall,
    color: colors.neutral.textSecondary,
    marginBottom: spacing.sm,
  },
  panelMeta: { flexDirection: 'row', gap: spacing.md },
  panelMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  panelMetaText: {
    ...typography.labelSmall,
    color: colors.neutral.textSecondary,
  },
  panelActions: { flexDirection: 'row', gap: spacing.md },
  panelActionSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary.main,
  },
  panelActionSecondaryText: {
    ...typography.labelMedium,
    color: colors.primary.main,
  },
  panelActionPrimary: { flex: 2, borderRadius: 12, overflow: 'hidden' },
  panelActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  panelActionPrimaryText: {
    ...typography.labelMedium,
    color: colors.neutral.white,
  },
  listContainer: { flex: 1 },
  listContent: { flex: 1, paddingHorizontal: spacing.lg },
  theaterCard: {
    backgroundColor: colors.dark[700],
    borderRadius: 16,
    marginBottom: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  theaterCardSelected: { borderColor: colors.primary.main },
  theaterImage: { width: '100%', height: 120 },
  theaterImageGradient: { ...StyleSheet.absoluteFillObject },
  theaterInfo: { padding: spacing.md },
  theaterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xxs,
  },
  theaterName: {
    ...typography.labelLarge,
    color: colors.neutral.text,
    flex: 1,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.dark[600],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: 8,
  },
  ratingText: { ...typography.labelSmall, color: colors.neutral.text },
  theaterAddress: {
    ...typography.bodySmall,
    color: colors.neutral.textSecondary,
    marginBottom: spacing.sm,
  },
  theaterMeta: { flexDirection: 'row', gap: spacing.lg },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { ...typography.caption, color: colors.neutral.textTertiary },
});
