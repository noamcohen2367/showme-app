// ============================================
// ShowME App - Filter Chip Component (Dark Theme)
// Updated with onClear callback support
// ============================================

import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, typography, spacing } from '../theme/theme';

interface FilterChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  showClear?: boolean;
  onClear?: () => void; // NEW: Optional callback for clear action
}

export default function FilterChip({ 
  label, 
  selected = false, 
  onPress,
  icon,
  showClear = false,
  onClear,
}: FilterChipProps) {
  
  const handleClearPress = (e: any) => {
    e.stopPropagation?.();
    if (onClear) {
      onClear();
    } else {
      // If no onClear provided, default to calling onPress (existing behavior)
      onPress();
    }
  };

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
        numberOfLines={1}
      >
        {label}
      </Text>
      {showClear && selected && (
        <TouchableOpacity 
          onPress={handleClearPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.clearButton}
        >
          <Ionicons 
            name="close-circle" 
            size={16} 
            color={colors.primary.main} 
          />
        </TouchableOpacity>
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
    maxWidth: 200,
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
    flexShrink: 1,
  },
  labelSelected: {
    color: colors.primary.main,
  },
  clearButton: {
    marginLeft: spacing.xs,
    padding: 2,
  },
});
