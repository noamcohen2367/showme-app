// ============================================
// ShowME App - Search Bar Component
// ============================================

import React from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity,
  I18nManager,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { colors, typography, spacing } from '../theme/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
  onClear?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export default function SearchBar({ 
  value, 
  onChangeText, 
  onFocus,
  onClear,
  placeholder,
  autoFocus = false,
}: SearchBarProps) {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;

  const handleClear = () => {
    onChangeText('');
    onClear?.();
  };

  return (
    <View style={styles.container}>
      <Ionicons 
        name="search" 
        size={20} 
        color={colors.neutral.textTertiary} 
        style={styles.searchIcon}
      />
      <TextInput
        style={[styles.input, isRTL && styles.inputRTL]}
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        placeholder={placeholder || t('search.placeholder')}
        placeholderTextColor={colors.neutral.textTertiary}
        autoFocus={autoFocus}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <Ionicons 
            name="close-circle" 
            size={20} 
            color={colors.neutral.textTertiary} 
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.surface,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.neutral.border,
    height: 48,
  },
  searchIcon: {
    marginEnd: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.neutral.text,
    paddingVertical: spacing.sm,
  },
  inputRTL: {
    textAlign: 'right',
  },
  clearButton: {
    padding: spacing.xs,
    marginStart: spacing.sm,
  },
});
