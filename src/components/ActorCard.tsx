// ============================================
// ShowME App - Actor Card Component (Dark Theme)
// ============================================

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';

import { Actor } from '../types/types';
import { colors, typography, spacing } from '../theme/theme';

interface ActorCardProps {
  actor: Actor;
  onPress: () => void;
  size?: 'small' | 'medium';
}

export default function ActorCard({ actor, onPress, size = 'small' }: ActorCardProps) {
  const { i18n } = useTranslation();
  const isHebrew = i18n.language === 'he';
  const isRussian = i18n.language === 'ru';

  const name = isHebrew ? actor.nameHe : isRussian ? actor.nameRu : actor.name;

  const cardWidth = size === 'small' ? 80 : 100;
  const imageSize = size === 'small' ? 64 : 80;

  return (
    <TouchableOpacity style={[styles.container, { width: cardWidth }]} onPress={onPress}>
      <View style={[styles.imageContainer, { width: imageSize, height: imageSize }]}>
        <Image
          source={{ uri: actor.imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={200}
          recyclingKey={actor.id}
        />
        <LinearGradient
          colors={['transparent', 'rgba(168, 85, 247, 0.3)']}
          style={styles.imageGradient}
        />
      </View>
      <Text style={styles.name} numberOfLines={2}>{name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginEnd: spacing.md,
  },
  imageContainer: {
    borderRadius: 32,
    overflow: 'hidden',
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: colors.dark[500],
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  name: {
    ...typography.labelSmall,
    color: colors.neutral.textSecondary,
    textAlign: 'center',
  },
});
