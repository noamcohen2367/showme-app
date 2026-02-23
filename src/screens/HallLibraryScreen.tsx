// ============================================
// ShowME App - Hall Library Screen
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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing } from '../theme/theme';
import { RootStackParamList } from '../types/types';
import { HALLS, Hall, getPriceRange, ZONE_COLORS } from '../data/halls';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CAPACITY_FILTERS = [
  { id: 'all', label: 'All Sizes' },
  { id: 'small', label: 'Intimate (<300)' },
  { id: 'medium', label: 'Medium (300-700)' },
  { id: 'large', label: 'Large (700+)' },
];

const STAGE_TYPES = [
  { id: 'all', label: 'All Types' },
  { id: 'proscenium', label: 'Proscenium' },
  { id: 'thrust', label: 'Thrust' },
  { id: 'black_box', label: 'Black Box' },
  { id: 'arena', label: 'Arena' },
];

export default function HallLibraryScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState('');
  const [capacityFilter, setCapacityFilter] = useState('all');
  const [stageFilter, setStageFilter] = useState('all');

  const isHebrew = i18n.language === 'he';

  // Filter halls
  const filteredHalls = HALLS.filter((hall) => {
    // Search filter
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      hall.name.toLowerCase().includes(searchLower) ||
      hall.nameHe.includes(searchQuery) ||
      hall.theaterName.toLowerCase().includes(searchLower);

    // Capacity filter
    let matchesCapacity = true;
    if (capacityFilter === 'small') matchesCapacity = hall.capacity < 300;
    else if (capacityFilter === 'medium') matchesCapacity = hall.capacity >= 300 && hall.capacity < 700;
    else if (capacityFilter === 'large') matchesCapacity = hall.capacity >= 700;

    // Stage type filter
    let matchesStage = true;
    if (stageFilter !== 'all') matchesStage = hall.layout.stage.type === stageFilter;

    return matchesSearch && matchesCapacity && matchesStage;
  });

  // Group halls by theater
  const hallsByTheater = filteredHalls.reduce((acc, hall) => {
    if (!acc[hall.theaterName]) {
      acc[hall.theaterName] = [];
    }
    acc[hall.theaterName].push(hall);
    return acc;
  }, {} as Record<string, Hall[]>);

  const renderHallCard = (hall: Hall) => {
    const priceRange = getPriceRange(hall.id);
    
    return (
      <TouchableOpacity
        key={hall.id}
        style={styles.hallCard}
        onPress={() => navigation.navigate('HallDetails', { hallId: hall.id })}
        activeOpacity={0.8}
      >
        <Image source={{ uri: hall.imageUrl }} style={styles.hallImage} contentFit="cover" transition={300} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.hallGradient}
        />
        
        {/* Hall Info */}
        <View style={styles.hallInfo}>
          <Text style={styles.hallName}>{isHebrew ? hall.nameHe : hall.name}</Text>
          
          <View style={styles.hallStats}>
            <View style={styles.hallStat}>
              <Ionicons name="people" size={14} color={colors.primary.main} />
              <Text style={styles.hallStatText}>{hall.capacity}</Text>
            </View>
            <View style={styles.hallStatDivider} />
            <View style={styles.hallStat}>
              <Ionicons name="pricetag" size={14} color={colors.secondary.main} />
              <Text style={styles.hallStatText}>₪{priceRange.min}-{priceRange.max}</Text>
            </View>
          </View>

          {/* Zone Colors Preview */}
          <View style={styles.zonePreview}>
            {hall.layout.sections.slice(0, 4).map((section) => (
              <View
                key={section.id}
                style={[styles.zoneDot, { backgroundColor: section.color }]}
              />
            ))}
          </View>
        </View>

        {/* Stage Type Badge */}
        <View style={styles.stageBadge}>
          <Text style={styles.stageBadgeText}>
            {hall.layout.stage.type.charAt(0).toUpperCase() + hall.layout.stage.type.slice(1).replace('_', ' ')}
          </Text>
        </View>

        {/* Accessibility Icon */}
        {hall.accessibility.length > 0 && (
          <View style={styles.accessibilityBadge}>
            <Ionicons name="accessibility" size={16} color={colors.semantic.success} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.neutral.background} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.neutral.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hall Library</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.neutral.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search halls or theaters..."
            placeholderTextColor={colors.neutral.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.neutral.textTertiary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Capacity Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersRow}
          contentContainerStyle={styles.filtersContent}
        >
          {CAPACITY_FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterChip,
                capacityFilter === filter.id && styles.filterChipActive,
              ]}
              onPress={() => setCapacityFilter(filter.id)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  capacityFilter === filter.id && styles.filterChipTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Stage Type Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersRow}
          contentContainerStyle={styles.filtersContent}
        >
          {STAGE_TYPES.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterChip,
                stageFilter === filter.id && styles.filterChipActive,
              ]}
              onPress={() => setStageFilter(filter.id)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  stageFilter === filter.id && styles.filterChipTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Results Count */}
        <Text style={styles.resultsCount}>
          {filteredHalls.length} {filteredHalls.length === 1 ? 'hall' : 'halls'} found
        </Text>

        {/* Halls by Theater */}
        {Object.entries(hallsByTheater).map(([theaterName, halls]) => (
          <View key={theaterName} style={styles.theaterSection}>
            <View style={styles.theaterHeader}>
              <Ionicons name="business" size={18} color={colors.primary.main} />
              <Text style={styles.theaterName}>{theaterName}</Text>
              <Text style={styles.theaterCount}>{halls.length}</Text>
            </View>
            <View style={styles.hallsGrid}>
              {halls.map(renderHallCard)}
            </View>
          </View>
        ))}

        {filteredHalls.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color={colors.dark[500]} />
            <Text style={styles.emptyTitle}>No halls found</Text>
            <Text style={styles.emptyDesc}>Try adjusting your filters</Text>
          </View>
        )}

        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.dark[500] },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { ...typography.headingMedium, color: colors.neutral.text },
  scrollView: { flex: 1 },
  content: { padding: spacing.lg },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.dark[700], borderRadius: 12, paddingHorizontal: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.dark[500] },
  searchInput: { flex: 1, ...typography.bodyMedium, color: colors.neutral.text, paddingVertical: spacing.md, marginStart: spacing.sm },
  filtersRow: { marginBottom: spacing.sm },
  filtersContent: { gap: spacing.sm },
  filterChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: 20, backgroundColor: colors.dark[700], borderWidth: 1, borderColor: colors.dark[500] },
  filterChipActive: { backgroundColor: 'rgba(168, 85, 247, 0.2)', borderColor: colors.primary.main },
  filterChipText: { ...typography.labelSmall, color: colors.neutral.textSecondary },
  filterChipTextActive: { color: colors.primary.main },
  resultsCount: { ...typography.bodySmall, color: colors.neutral.textTertiary, marginTop: spacing.sm, marginBottom: spacing.lg },
  theaterSection: { marginBottom: spacing.xl },
  theaterHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md, gap: spacing.sm },
  theaterName: { ...typography.labelLarge, color: colors.neutral.text, flex: 1 },
  theaterCount: { ...typography.labelSmall, color: colors.neutral.textTertiary, backgroundColor: colors.dark[600], paddingHorizontal: spacing.sm, paddingVertical: spacing.xxs, borderRadius: 10 },
  hallsGrid: { gap: spacing.md },
  hallCard: { height: 180, borderRadius: 16, overflow: 'hidden', position: 'relative' },
  hallImage: { width: '100%', height: '100%' },
  hallGradient: { ...StyleSheet.absoluteFillObject },
  hallInfo: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: spacing.md },
  hallName: { ...typography.headingSmall, color: colors.neutral.white, marginBottom: spacing.xs },
  hallStats: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  hallStat: { flexDirection: 'row', alignItems: 'center', gap: spacing.xxs },
  hallStatText: { ...typography.labelSmall, color: colors.neutral.textSecondary },
  hallStatDivider: { width: 1, height: 12, backgroundColor: colors.dark[400], marginHorizontal: spacing.sm },
  zonePreview: { flexDirection: 'row', gap: spacing.xs },
  zoneDot: { width: 8, height: 8, borderRadius: 4 },
  stageBadge: { position: 'absolute', top: spacing.md, left: spacing.md, backgroundColor: 'rgba(0, 0, 0, 0.6)', paddingHorizontal: spacing.sm, paddingVertical: spacing.xxs, borderRadius: 8 },
  stageBadgeText: { ...typography.caption, color: colors.neutral.white },
  accessibilityBadge: { position: 'absolute', top: spacing.md, right: spacing.md, width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(16, 185, 129, 0.3)', alignItems: 'center', justifyContent: 'center' },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xxl },
  emptyTitle: { ...typography.headingSmall, color: colors.neutral.text, marginTop: spacing.md },
  emptyDesc: { ...typography.bodyMedium, color: colors.neutral.textSecondary },
});
