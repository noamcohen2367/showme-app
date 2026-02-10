// ============================================
// ShowME App - Skeleton Loading Components
// ============================================

import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, spacing } from '../theme/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Base skeleton shimmer effect
function SkeletonShimmer({ width, height, borderRadius = 8, style }: {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: object;
}) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  return (
    <View style={[styles.skeletonBase, { width, height, borderRadius }, style]}>
      <Animated.View
        style={[
          styles.shimmer,
          { transform: [{ translateX }] },
        ]}
      >
        <LinearGradient
          colors={['transparent', 'rgba(255, 255, 255, 0.08)', 'transparent']}
          style={styles.shimmerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </Animated.View>
    </View>
  );
}

// Show Card Skeleton
export function ShowCardSkeleton({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) {
  const dimensions = {
    small: { width: 140, height: 180 },
    medium: { width: 200, height: 260 },
    large: { width: SCREEN_WIDTH - spacing.lg * 2, height: 220 },
  };

  const { width, height } = dimensions[size];

  return (
    <View style={[styles.showCardSkeleton, { width }]}>
      <SkeletonShimmer width={width} height={height * 0.65} borderRadius={12} />
      <View style={styles.showCardContent}>
        <SkeletonShimmer width={width * 0.8} height={16} style={{ marginBottom: 8 }} />
        <SkeletonShimmer width={width * 0.5} height={12} style={{ marginBottom: 8 }} />
        <SkeletonShimmer width={width * 0.4} height={14} />
      </View>
    </View>
  );
}

// Show List Skeleton (horizontal)
export function ShowListSkeleton({ count = 3, size = 'medium' }: { count?: number; size?: 'small' | 'medium' }) {
  return (
    <View style={styles.showListSkeleton}>
      {Array.from({ length: count }).map((_, index) => (
        <ShowCardSkeleton key={index} size={size} />
      ))}
    </View>
  );
}

// Section Header Skeleton
export function SectionHeaderSkeleton() {
  return (
    <View style={styles.sectionHeaderSkeleton}>
      <SkeletonShimmer width={150} height={20} />
      <SkeletonShimmer width={60} height={16} />
    </View>
  );
}

// Home Screen Skeleton
export function HomeScreenSkeleton() {
  return (
    <View style={styles.homeScreenSkeleton}>
      {/* Header */}
      <View style={styles.headerSkeleton}>
        <View>
          <SkeletonShimmer width={120} height={16} style={{ marginBottom: 8 }} />
          <SkeletonShimmer width={180} height={24} />
        </View>
        <SkeletonShimmer width={44} height={44} borderRadius={22} />
      </View>

      {/* Location Filter */}
      <View style={styles.locationSkeleton}>
        <SkeletonShimmer width={100} height={36} borderRadius={18} />
      </View>

      {/* Sections */}
      {Array.from({ length: 3 }).map((_, index) => (
        <View key={index} style={styles.sectionSkeleton}>
          <SectionHeaderSkeleton />
          <ShowListSkeleton />
        </View>
      ))}
    </View>
  );
}

// Ticket Card Skeleton
export function TicketCardSkeleton() {
  return (
    <View style={styles.ticketCardSkeleton}>
      <SkeletonShimmer width="100%" height={140} borderRadius={0} />
      <View style={styles.ticketDividerSkeleton} />
      <View style={styles.ticketBottomSkeleton}>
        <View style={styles.ticketInfoSkeleton}>
          <SkeletonShimmer width={80} height={14} />
          <SkeletonShimmer width={60} height={14} />
          <SkeletonShimmer width={70} height={14} />
        </View>
        <SkeletonShimmer width={100} height={16} />
      </View>
    </View>
  );
}

// Profile Header Skeleton
export function ProfileHeaderSkeleton() {
  return (
    <View style={styles.profileHeaderSkeleton}>
      <SkeletonShimmer width={90} height={90} borderRadius={45} style={{ marginBottom: 16 }} />
      <SkeletonShimmer width={150} height={24} style={{ marginBottom: 8 }} />
      <SkeletonShimmer width={80} height={20} borderRadius={10} style={{ marginBottom: 20 }} />
      <View style={styles.statsSkeleton}>
        <SkeletonShimmer width={60} height={40} />
        <SkeletonShimmer width={60} height={40} />
        <SkeletonShimmer width={60} height={40} />
      </View>
    </View>
  );
}

// Actor Card Skeleton
export function ActorCardSkeleton() {
  return (
    <View style={styles.actorCardSkeleton}>
      <SkeletonShimmer width={70} height={70} borderRadius={35} style={{ marginBottom: 8 }} />
      <SkeletonShimmer width={60} height={12} />
    </View>
  );
}

// Search Results Skeleton
export function SearchResultsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <View style={styles.searchResultsSkeleton}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.searchResultItem}>
          <SkeletonShimmer width={80} height={100} borderRadius={8} />
          <View style={styles.searchResultContent}>
            <SkeletonShimmer width={180} height={18} style={{ marginBottom: 8 }} />
            <SkeletonShimmer width={120} height={14} style={{ marginBottom: 8 }} />
            <SkeletonShimmer width={80} height={14} />
          </View>
        </View>
      ))}
    </View>
  );
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Show Details Skeleton
export function ShowDetailsSkeleton() {
  return (
    <View style={styles.showDetailsSkeleton}>
      <SkeletonShimmer width={SCREEN_WIDTH} height={SCREEN_HEIGHT * 0.45} borderRadius={0} />
      <View style={styles.showDetailsContent}>
        <SkeletonShimmer width={SCREEN_WIDTH * 0.7} height={28} style={{ marginBottom: spacing.sm }} />
        <SkeletonShimmer width={SCREEN_WIDTH * 0.3} height={18} style={{ marginBottom: spacing.lg }} />
        <View style={{ flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg }}>
          <SkeletonShimmer width={100} height={16} />
          <SkeletonShimmer width={80} height={16} />
          <SkeletonShimmer width={60} height={16} />
        </View>
        <SkeletonShimmer width="100%" height={14} style={{ marginBottom: spacing.sm }} />
        <SkeletonShimmer width="100%" height={14} style={{ marginBottom: spacing.sm }} />
        <SkeletonShimmer width="70%" height={14} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeletonBase: {
    backgroundColor: colors.dark[600],
    overflow: 'hidden',
  },
  shimmer: {
    ...StyleSheet.absoluteFillObject,
    width: 200,
  },
  shimmerGradient: {
    flex: 1,
  },
  showCardSkeleton: {
    marginRight: spacing.md,
  },
  showCardContent: {
    paddingTop: spacing.sm,
  },
  showListSkeleton: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
  },
  sectionHeaderSkeleton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  homeScreenSkeleton: {
    flex: 1,
    backgroundColor: colors.neutral.background,
    paddingTop: spacing.xl,
  },
  headerSkeleton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  locationSkeleton: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionSkeleton: {
    marginBottom: spacing.xl,
  },
  ticketCardSkeleton: {
    backgroundColor: colors.dark[700],
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  ticketDividerSkeleton: {
    height: 20,
    backgroundColor: colors.dark[700],
  },
  ticketBottomSkeleton: {
    padding: spacing.md,
  },
  ticketInfoSkeleton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  profileHeaderSkeleton: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.dark[700],
    borderRadius: 20,
    marginBottom: spacing.lg,
  },
  statsSkeleton: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: spacing.md,
  },
  actorCardSkeleton: {
    alignItems: 'center',
    marginRight: spacing.md,
  },
  searchResultsSkeleton: {
    paddingHorizontal: spacing.lg,
  },
  searchResultItem: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  searchResultContent: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'center',
  },
});

export default {
  ShowCardSkeleton,
  ShowListSkeleton,
  SectionHeaderSkeleton,
  HomeScreenSkeleton,
  TicketCardSkeleton,
  ProfileHeaderSkeleton,
  ActorCardSkeleton,
  SearchResultsSkeleton,
};
