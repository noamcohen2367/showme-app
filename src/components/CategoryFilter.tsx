// ============================================
// ShowME App - Category Filter Component (Dark Theme)
// ============================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { ShowCategory } from '../types/types';
import { colors, typography, spacing } from '../theme/theme';

interface CategoryFilterProps {
  selectedCategories: ShowCategory[];
  onSelectCategory: (category: ShowCategory) => void;
  onClearAll: () => void;
  visible: boolean;
  onClose: () => void;
}

const CATEGORIES: { id: ShowCategory; emoji: string; gradient: [string, string] }[] = [
  { id: 'musical', emoji: '🎵', gradient: ['#A855F7', '#7C3AED'] },
  { id: 'drama', emoji: '🎭', gradient: ['#EC4899', '#DB2777'] },
  { id: 'comedy', emoji: '😂', gradient: ['#F59E0B', '#D97706'] },
  { id: 'romance', emoji: '❤️', gradient: ['#EF4444', '#DC2626'] },
  { id: 'suspense', emoji: '😱', gradient: ['#6366F1', '#4F46E5'] },
  { id: 'popular', emoji: '🔥', gradient: ['#F97316', '#EA580C'] },
  { id: 'new', emoji: '✨', gradient: ['#06B6D4', '#0891B2'] },
  { id: 'long_running', emoji: '🏆', gradient: ['#10B981', '#059669'] },
  { id: 'short', emoji: '⏱️', gradient: ['#8B5CF6', '#7C3AED'] },
  { id: 'lgbt', emoji: '🌈', gradient: ['#EC4899', '#A855F7'] },
];

export default function CategoryFilter({ 
  selectedCategories, 
  onSelectCategory,
  onClearAll,
  visible,
  onClose,
}: CategoryFilterProps) {
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Handle bar */}
          <View style={styles.handleBar} />
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{t('search.browseCategories')}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.neutral.text} />
            </TouchableOpacity>
          </View>

          {/* Categories Grid */}
          <ScrollView style={styles.content}>
            <View style={styles.grid}>
              {CATEGORIES.map((category) => {
                const isSelected = selectedCategories.includes(category.id);

                return (
                  <TouchableOpacity
                    key={category.id}
                    style={[styles.categoryCard, isSelected && styles.categoryCardSelected]}
                    onPress={() => onSelectCategory(category.id)}
                  >
                    <LinearGradient
                      colors={isSelected ? category.gradient : [colors.dark[600], colors.dark[700]]}
                      style={styles.categoryGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Text style={styles.emoji}>{category.emoji}</Text>
                    </LinearGradient>
                    <Text style={[styles.categoryLabel, isSelected && styles.categoryLabelSelected]}>
                      {t(`categories.${category.id}`)}
                    </Text>
                    {isSelected && (
                      <View style={styles.checkmark}>
                        <Ionicons name="checkmark" size={12} color={colors.neutral.white} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            {selectedCategories.length > 0 && (
              <TouchableOpacity onPress={onClearAll} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>{t('common.clearAll')}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onClose} style={styles.applyButton}>
              <LinearGradient
                colors={[colors.primary.main, colors.primary.dark]}
                style={styles.applyGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.applyButtonText}>
                  {t('common.apply')} {selectedCategories.length > 0 && `(${selectedCategories.length})`}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.dark[800],
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    borderTopWidth: 1,
    borderColor: colors.dark[500],
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: colors.dark[500],
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark[500],
  },
  title: {
    ...typography.headingMedium,
    color: colors.neutral.text,
  },
  closeButton: {
    padding: spacing.xs,
  },
  content: {
    padding: spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  categoryCard: {
    width: '48%',
    marginHorizontal: '1%',
    marginBottom: spacing.md,
    borderRadius: 16,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    backgroundColor: colors.dark[700],
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryCardSelected: {
    borderColor: colors.primary.main,
  },
  categoryGradient: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  emoji: {
    fontSize: 24,
  },
  categoryLabel: {
    ...typography.labelMedium,
    color: colors.neutral.textSecondary,
    textAlign: 'center',
  },
  categoryLabelSelected: {
    color: colors.neutral.text,
    fontWeight: '600',
  },
  checkmark: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.dark[500],
    gap: spacing.md,
  },
  clearButton: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.dark[500],
    backgroundColor: colors.dark[700],
  },
  clearButtonText: {
    ...typography.labelLarge,
    color: colors.neutral.textSecondary,
  },
  applyButton: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  applyGradient: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  applyButtonText: {
    ...typography.labelLarge,
    color: colors.neutral.white,
  },
});
