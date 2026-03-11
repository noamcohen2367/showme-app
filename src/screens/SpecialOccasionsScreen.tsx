// ============================================
// ShowME App - Special Occasions Screen
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

const SCREEN_WIDTH = getAppWidth();

interface Package {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  gradient: [string, string];
  price: number;
  originalPrice?: number;
  includes: string[];
  popular?: boolean;
  image: string;
}

const OCCASION_PACKAGES: Package[] = [
  {
    id: 'birthday',
    name: 'Birthday Celebration',
    description: 'Make their special day unforgettable with a VIP theater experience',
    icon: '🎂',
    color: '#EC4899',
    gradient: ['#EC4899', '#DB2777'],
    price: 399,
    originalPrice: 499,
    popular: true,
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400',
    includes: [
      '2 Premium seats',
      'Birthday cake & champagne',
      'Personalized greeting on screen',
      'Meet & greet with cast',
      'Commemorative photo',
      'VIP lounge access',
    ],
  },
  {
    id: 'anniversary',
    name: 'Romantic Anniversary',
    description: 'Celebrate your love with an enchanting evening at the theater',
    icon: '💕',
    color: '#F43F5E',
    gradient: ['#F43F5E', '#E11D48'],
    price: 549,
    originalPrice: 699,
    image: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=400',
    includes: [
      '2 VIP balcony seats',
      'Roses & chocolates',
      'Champagne toast',
      'Private intermission area',
      'Romantic dinner voucher',
      'Keepsake program book',
    ],
  },
  {
    id: 'proposal',
    name: 'Proposal Package',
    description: 'Pop the question in the most magical setting',
    icon: '💍',
    color: '#A855F7',
    gradient: ['#A855F7', '#7C3AED'],
    price: 999,
    image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400',
    includes: [
      '2 Best seats in house',
      'Personal proposal coordinator',
      'Custom on-screen message',
      'Professional photographer',
      'Champagne & celebration cake',
      'Private celebration room',
      'Keepsake video',
    ],
  },
  {
    id: 'graduation',
    name: 'Graduation Celebration',
    description: 'Honor their achievement with a memorable theater outing',
    icon: '🎓',
    color: '#3B82F6',
    gradient: ['#3B82F6', '#1D4ED8'],
    price: 299,
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400',
    includes: [
      '4 Premium seats',
      'Graduation banner',
      'Celebratory drinks',
      'Group photo opportunity',
      'Special mention',
    ],
  },
  {
    id: 'corporate',
    name: 'Corporate Event',
    description: 'Impress clients or reward your team with premium entertainment',
    icon: '💼',
    color: '#10B981',
    gradient: ['#10B981', '#059669'],
    price: 1499,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
    includes: [
      '10 Premium seats',
      'Private pre-show reception',
      'Open bar & catering',
      'Company logo display',
      'Private intermission lounge',
      'Custom gift bags',
      'Dedicated event coordinator',
    ],
  },
  {
    id: 'bachelorette',
    name: 'Girls Night Out',
    description: 'The ultimate pre-wedding celebration for the bride-to-be',
    icon: '👰',
    color: '#F472B6',
    gradient: ['#F472B6', '#EC4899'],
    price: 449,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400',
    includes: [
      '6 Premium seats',
      'Welcome prosecco',
      'Bride sash & tiara',
      'Group photo',
      'Post-show cocktails',
      'Goody bags',
    ],
  },
];

const ADD_ONS = [
  { id: 'flowers', name: 'Flower Bouquet', price: 80, icon: '💐' },
  { id: 'chocolate', name: 'Luxury Chocolates', price: 60, icon: '🍫' },
  { id: 'photo', name: 'Professional Photos', price: 150, icon: '📸' },
  { id: 'limo', name: 'Limo Service', price: 350, icon: '🚗' },
  { id: 'dinner', name: 'Pre-show Dinner', price: 200, icon: '🍽️' },
];

export default function SpecialOccasionsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  const toggleAddOn = (id: string) => {
    setSelectedAddOns(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const calculateTotal = () => {
    if (!selectedPackage) return 0;
    const addOnsTotal = selectedAddOns.reduce((sum, id) => {
      const addOn = ADD_ONS.find(a => a.id === id);
      return sum + (addOn?.price || 0);
    }, 0);
    return selectedPackage.price + addOnsTotal;
  };

  const renderPackageCard = (pkg: Package) => (
    <TouchableOpacity
      key={pkg.id}
      style={[
        styles.packageCard,
        selectedPackage?.id === pkg.id && styles.packageCardSelected,
      ]}
      onPress={() => setSelectedPackage(pkg)}
    >
      {pkg.popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
        </View>
      )}
      
      <Image source={{ uri: pkg.image }} style={styles.packageImage} contentFit="cover" transition={300} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.packageImageGradient}
      />
      
      <View style={styles.packageContent}>
        <View style={styles.packageHeader}>
          <Text style={styles.packageIcon}>{pkg.icon}</Text>
          <View style={styles.packageTitleContainer}>
            <Text style={styles.packageName}>{pkg.name}</Text>
            <Text style={styles.packageDescription} numberOfLines={2}>
              {pkg.description}
            </Text>
          </View>
        </View>

        <View style={styles.packageIncludes}>
          {pkg.includes.slice(0, 3).map((item, idx) => (
            <View key={idx} style={styles.includeItem}>
              <Ionicons name="checkmark-circle" size={14} color={colors.semantic.success} />
              <Text style={styles.includeText} numberOfLines={1}>{item}</Text>
            </View>
          ))}
          {pkg.includes.length > 3 && (
            <Text style={styles.moreIncludes}>+{pkg.includes.length - 3} more</Text>
          )}
        </View>

        <View style={styles.packageFooter}>
          <View style={styles.packagePricing}>
            {pkg.originalPrice && (
              <Text style={styles.originalPrice}>₪{pkg.originalPrice}</Text>
            )}
            <Text style={styles.packagePrice}>₪{pkg.price}</Text>
          </View>
          <View style={[
            styles.selectIndicator,
            selectedPackage?.id === pkg.id && styles.selectIndicatorActive,
          ]}>
            {selectedPackage?.id === pkg.id ? (
              <Ionicons name="checkmark" size={18} color={colors.neutral.white} />
            ) : (
              <View style={styles.selectCircle} />
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.neutral.background} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.neutral.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Special Occasions</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Celebrate Life's Moments</Text>
          <Text style={styles.heroSubtitle}>
            Create unforgettable memories with our curated celebration packages
          </Text>
        </View>

        {/* Packages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Your Experience</Text>
          {OCCASION_PACKAGES.map(renderPackageCard)}
        </View>

        {/* Add-ons */}
        {selectedPackage && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Enhance Your Experience</Text>
            <View style={styles.addOnsGrid}>
              {ADD_ONS.map((addOn) => (
                <TouchableOpacity
                  key={addOn.id}
                  style={[
                    styles.addOnCard,
                    selectedAddOns.includes(addOn.id) && styles.addOnCardSelected,
                  ]}
                  onPress={() => toggleAddOn(addOn.id)}
                >
                  <Text style={styles.addOnIcon}>{addOn.icon}</Text>
                  <Text style={styles.addOnName}>{addOn.name}</Text>
                  <Text style={styles.addOnPrice}>+₪{addOn.price}</Text>
                  {selectedAddOns.includes(addOn.id) && (
                    <View style={styles.addOnCheck}>
                      <Ionicons name="checkmark" size={14} color={colors.neutral.white} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Selected Package Details */}
        {selectedPackage && (
          <View style={styles.detailsCard}>
            <View style={styles.detailsHeader}>
              <Text style={styles.detailsTitle}>{selectedPackage.name}</Text>
              <LinearGradient
                colors={selectedPackage.gradient}
                style={styles.detailsBadge}
              >
                <Text style={styles.detailsBadgeText}>{selectedPackage.icon}</Text>
              </LinearGradient>
            </View>
            
            <Text style={styles.detailsSubtitle}>Package Includes:</Text>
            {selectedPackage.includes.map((item, idx) => (
              <View key={idx} style={styles.detailsItem}>
                <Ionicons name="checkmark-circle" size={18} color={colors.semantic.success} />
                <Text style={styles.detailsItemText}>{item}</Text>
              </View>
            ))}

            {selectedAddOns.length > 0 && (
              <>
                <Text style={[styles.detailsSubtitle, { marginTop: spacing.lg }]}>Add-ons:</Text>
                {selectedAddOns.map((id) => {
                  const addOn = ADD_ONS.find(a => a.id === id);
                  return addOn ? (
                    <View key={id} style={styles.detailsItem}>
                      <Text style={styles.detailsItemIcon}>{addOn.icon}</Text>
                      <Text style={styles.detailsItemText}>{addOn.name}</Text>
                      <Text style={styles.detailsItemPrice}>+₪{addOn.price}</Text>
                    </View>
                  ) : null;
                })}
              </>
            )}
          </View>
        )}

        {/* Testimonial */}
        <View style={styles.testimonialCard}>
          <Ionicons name="chatbubble-ellipses" size={24} color={colors.primary.main} />
          <Text style={styles.testimonialText}>
            "The proposal package was absolutely perfect! They helped plan every detail 
            and she said yes! Couldn't have asked for a more magical moment."
          </Text>
          <View style={styles.testimonialAuthor}>
            <Image
              source={{ uri: 'https://picsum.photos/seed/testimonial/50/50' }}
              style={styles.testimonialAvatar}
              contentFit="cover"
              transition={200}
            />
            <View>
              <Text style={styles.testimonialName}>David & Sarah</Text>
              <Text style={styles.testimonialDate}>Engaged at Habima Theatre</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom CTA */}
      {selectedPackage && (
        <View style={[styles.bottomCTA, { paddingBottom: insets.bottom + spacing.md }]}>
          <View style={styles.bottomInfo}>
            <Text style={styles.bottomLabel}>Total Price</Text>
            <Text style={styles.bottomTotal}>₪{calculateTotal()}</Text>
          </View>
          <TouchableOpacity style={styles.bookButton}>
            <LinearGradient
              colors={selectedPackage.gradient}
              style={styles.bookGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.bookText}>Book This Package</Text>
              <Ionicons name="arrow-forward" size={20} color={colors.neutral.white} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { ...typography.headingMedium, color: colors.neutral.text },
  content: { flex: 1 },
  contentContainer: { padding: spacing.lg },
  hero: { marginBottom: spacing.xl, alignItems: 'center' },
  heroTitle: { ...typography.displaySmall, color: colors.neutral.white, textAlign: 'center', marginBottom: spacing.sm },
  heroSubtitle: { ...typography.bodyMedium, color: colors.neutral.textSecondary, textAlign: 'center' },
  section: { marginBottom: spacing.xl },
  sectionTitle: { ...typography.headingSmall, color: colors.neutral.text, marginBottom: spacing.md },
  packageCard: { backgroundColor: colors.dark[700], borderRadius: 20, marginBottom: spacing.lg, overflow: 'hidden', borderWidth: 2, borderColor: colors.dark[500] },
  packageCardSelected: { borderColor: colors.primary.main },
  popularBadge: { position: 'absolute', top: spacing.md, right: spacing.md, backgroundColor: colors.secondary.main, paddingHorizontal: spacing.sm, paddingVertical: spacing.xxs, borderRadius: 8, zIndex: 10 },
  popularBadgeText: { ...typography.caption, color: colors.neutral.white, fontWeight: '700' },
  packageImage: { width: '100%', height: 150 },
  packageImageGradient: { ...StyleSheet.absoluteFillObject, top: 50 },
  packageContent: { padding: spacing.lg },
  packageHeader: { flexDirection: 'row', marginBottom: spacing.md },
  packageIcon: { fontSize: 32, marginEnd: spacing.md },
  packageTitleContainer: { flex: 1 },
  packageName: { ...typography.headingSmall, color: colors.neutral.text, marginBottom: spacing.xxs },
  packageDescription: { ...typography.bodySmall, color: colors.neutral.textSecondary },
  packageIncludes: { marginBottom: spacing.md },
  includeItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.xs },
  includeText: { ...typography.bodySmall, color: colors.neutral.textSecondary, flex: 1 },
  moreIncludes: { ...typography.labelSmall, color: colors.primary.main, marginTop: spacing.xs },
  packageFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.dark[500], paddingTop: spacing.md },
  packagePricing: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  originalPrice: { ...typography.bodyMedium, color: colors.neutral.textTertiary, textDecorationLine: 'line-through' },
  packagePrice: { ...typography.headingMedium, color: colors.primary.main },
  selectIndicator: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: colors.dark[400], alignItems: 'center', justifyContent: 'center' },
  selectIndicatorActive: { backgroundColor: colors.primary.main, borderColor: colors.primary.main },
  selectCircle: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.dark[500] },
  addOnsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  addOnCard: { width: (SCREEN_WIDTH - spacing.lg * 2 - spacing.md * 2) / 3, backgroundColor: colors.dark[700], borderRadius: 12, padding: spacing.md, alignItems: 'center', borderWidth: 1, borderColor: colors.dark[500] },
  addOnCardSelected: { borderColor: colors.primary.main, backgroundColor: 'rgba(168, 85, 247, 0.1)' },
  addOnIcon: { fontSize: 24, marginBottom: spacing.sm },
  addOnName: { ...typography.caption, color: colors.neutral.text, textAlign: 'center', marginBottom: spacing.xxs },
  addOnPrice: { ...typography.labelSmall, color: colors.primary.main },
  addOnCheck: { position: 'absolute', top: spacing.xs, right: spacing.xs, width: 20, height: 20, borderRadius: 10, backgroundColor: colors.primary.main, alignItems: 'center', justifyContent: 'center' },
  detailsCard: { backgroundColor: colors.dark[700], borderRadius: 16, padding: spacing.lg, borderWidth: 1, borderColor: colors.dark[500], marginBottom: spacing.xl },
  detailsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  detailsTitle: { ...typography.headingSmall, color: colors.neutral.text },
  detailsBadge: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  detailsBadgeText: { fontSize: 20 },
  detailsSubtitle: { ...typography.labelMedium, color: colors.neutral.textSecondary, marginBottom: spacing.md },
  detailsItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  detailsItemIcon: { fontSize: 16 },
  detailsItemText: { flex: 1, ...typography.bodyMedium, color: colors.neutral.text },
  detailsItemPrice: { ...typography.labelSmall, color: colors.primary.main },
  testimonialCard: { backgroundColor: colors.dark[700], borderRadius: 16, padding: spacing.lg, borderWidth: 1, borderColor: colors.dark[500] },
  testimonialText: { ...typography.bodyMedium, color: colors.neutral.textSecondary, fontStyle: 'italic', lineHeight: 24, marginVertical: spacing.md },
  testimonialAuthor: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  testimonialAvatar: { width: 40, height: 40, borderRadius: 20 },
  testimonialName: { ...typography.labelMedium, color: colors.neutral.text },
  testimonialDate: { ...typography.caption, color: colors.neutral.textTertiary },
  bottomCTA: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.md, backgroundColor: colors.dark[800], borderTopWidth: 1, borderTopColor: colors.dark[500] },
  bottomInfo: { marginEnd: spacing.lg },
  bottomLabel: { ...typography.caption, color: colors.neutral.textTertiary },
  bottomTotal: { ...typography.headingMedium, color: colors.neutral.text },
  bookButton: { flex: 1, borderRadius: 12, overflow: 'hidden' },
  bookGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.md, gap: spacing.sm },
  bookText: { ...typography.labelLarge, color: colors.neutral.white },
});
