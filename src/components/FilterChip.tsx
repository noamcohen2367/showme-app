// ============================================
// ShowME App - Filter Chip Component (Dark Theme)
// ============================================

import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, typography, spacing } from '../theme/theme';

interface FilterChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  showClear?: boolean;
}

export default function FilterChip({ 
  label, 
  selected = false, 
  onPress,
  icon,
  showClear = false,
}: FilterChipProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        selected && styles.containerSelected
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon && (
        <Ionicons 
          name={icon} 
          size={16} 
          color={selected ? colors.primary.main : colors.neutral.textSecondary} 
          style={styles.icon}
        />
      )}
      <Text 
        style={[
          styles.label, 
          selected && styles.labelSelected
        ]}
      >
        {label}
      </Text>
      {showClear && selected && (
        <Ionicons 
          name="close-circle" 
          size={16} 
          color={colors.primary.main} 
          style={styles.clearIcon}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark[700],
    borderRadius: 20,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  containerSelected: {
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    borderColor: colors.primary.main,
  },
  icon: {
    marginRight: spacing.xs,
  },
  label: {
    ...typography.labelMedium,
    color: colors.neutral.textSecondary,
  },
  labelSelected: {
    color: colors.primary.main,
  },
  clearIcon: {
    marginLeft: spacing.xs,
  },
});
