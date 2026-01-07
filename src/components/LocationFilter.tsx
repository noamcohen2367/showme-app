// ============================================
// ShowME App - Location Filter Component (Dark Theme)
// ============================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { LocationArea } from '../types/types';
import { colors, typography, spacing } from '../theme/theme';

interface LocationFilterProps {
  selectedLocation: LocationArea | null;
  onSelectLocation: (location: LocationArea | null) => void;
  visible: boolean;
  onClose: () => void;
}

const LOCATIONS: { id: LocationArea | 'all'; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'all', icon: 'globe-outline' },
  { id: 'tel_aviv', icon: 'business-outline' },
  { id: 'sharon', icon: 'leaf-outline' },
  { id: 'jerusalem', icon: 'star-outline' },
  { id: 'haifa', icon: 'boat-outline' },
  { id: 'south', icon: 'sunny-outline' },
  { id: 'north', icon: 'snow-outline' },
];

export default function LocationFilter({ 
  selectedLocation, 
  onSelectLocation,
  visible,
  onClose,
}: LocationFilterProps) {
  const { t } = useTranslation();

  const handleSelect = (location: LocationArea | 'all') => {
    onSelectLocation(location === 'all' ? null : location);
    onClose();
  };

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
            <Text style={styles.title}>{t('home.selectLocation')}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.neutral.text} />
            </TouchableOpacity>
          </View>

          {/* Location Options */}
          <ScrollView style={styles.content}>
            {LOCATIONS.map((location) => {
              const isSelected = location.id === 'all' 
                ? selectedLocation === null 
                : selectedLocation === location.id;

              return (
                <TouchableOpacity
                  key={location.id}
                  style={[styles.option, isSelected && styles.optionSelected]}
                  onPress={() => handleSelect(location.id)}
                >
                  <View style={[styles.iconContainer, isSelected && styles.iconContainerSelected]}>
                    <Ionicons 
                      name={location.icon} 
                      size={24} 
                      color={isSelected ? colors.dark[900] : colors.primary.main} 
                    />
                  </View>
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                    {location.id === 'all' 
                      ? t('locations.allLocations') 
                      : t(`locations.${location.id}`)}
                  </Text>
                  {isSelected && (
                    <Ionicons 
                      name="checkmark-circle" 
                      size={24} 
                      color={colors.primary.main} 
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
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
    maxHeight: '70%',
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
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
    backgroundColor: colors.dark[700],
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionSelected: {
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    borderColor: colors.primary.main,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  iconContainerSelected: {
    backgroundColor: colors.primary.main,
  },
  optionText: {
    ...typography.bodyLarge,
    color: colors.neutral.text,
    flex: 1,
  },
  optionTextSelected: {
    fontWeight: '600',
    color: colors.primary.main,
  },
});
