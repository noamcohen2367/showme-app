// ============================================
// ShowME App - Digital Wallet Screen
// ============================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing } from '../theme/theme';
import { RootStackParamList } from '../types/types';

type WalletRouteProps = RouteProp<RootStackParamList, 'DigitalWallet'>;

interface WalletPass {
  id: string;
  showTitle: string;
  date: string;
  time: string;
  venue: string;
  seats: string[];
  barcode: string;
  imageUrl: string;
}

// Mock pass data
const MOCK_PASS: WalletPass = {
  id: 'pass-1',
  showTitle: 'The Phantom of the Opera',
  date: '2025-01-15',
  time: '20:00',
  venue: 'Habima Theatre',
  seats: ['A12', 'A13'],
  barcode: '1234567890',
  imageUrl: 'https://picsum.photos/seed/phantom/400/200',
};

export default function DigitalWalletScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [isAdding, setIsAdding] = useState(false);
  const [addedToWallet, setAddedToWallet] = useState(false);

  const isIOS = Platform.OS === 'ios';

  const handleAddToWallet = async () => {
    setIsAdding(true);
    
    // Simulate API call to generate wallet pass
    setTimeout(() => {
      setIsAdding(false);
      setAddedToWallet(true);
      Alert.alert(
        isIOS ? 'Added to Apple Wallet' : 'Added to Google Wallet',
        'Your ticket has been added to your wallet. You can access it anytime, even offline!',
        [{ text: 'Great!', style: 'default' }]
      );
    }, 1500);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.neutral.background} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.neutral.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Digital Wallet</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Wallet Pass Preview */}
        <View style={styles.passContainer}>
          <LinearGradient
            colors={[colors.dark[600], colors.dark[800]]}
            style={styles.passCard}
          >
            {/* Pass Header */}
            <View style={styles.passHeader}>
              <View style={styles.passLogo}>
                <Ionicons name="ticket" size={24} color={colors.primary.main} />
              </View>
              <View style={styles.passHeaderText}>
                <Text style={styles.passAppName}>ShowMI</Text>
                <Text style={styles.passType}>Event Ticket</Text>
              </View>
              {isIOS ? (
                <Image
                  source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Apple_Wallet_icon.svg/1200px-Apple_Wallet_icon.svg.png' }}
                  style={styles.walletIcon}
                  contentFit="cover"
                  transition={200}
                />
              ) : (
                <Image
                  source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Google_Wallet_2022_icon.svg/1200px-Google_Wallet_2022_icon.svg.png' }}
                  style={styles.walletIcon}
                  contentFit="cover"
                  transition={200}
                />
              )}
            </View>

            {/* Show Image */}
            <Image source={{ uri: MOCK_PASS.imageUrl }} style={styles.passImage} contentFit="cover" transition={300} />

            {/* Pass Details */}
            <View style={styles.passDetails}>
              <Text style={styles.passShowTitle}>{MOCK_PASS.showTitle}</Text>
              
              <View style={styles.passInfoRow}>
                <View style={styles.passInfoItem}>
                  <Text style={styles.passInfoLabel}>DATE</Text>
                  <Text style={styles.passInfoValue}>{formatDate(MOCK_PASS.date)}</Text>
                </View>
              </View>

              <View style={styles.passInfoRow}>
                <View style={styles.passInfoItem}>
                  <Text style={styles.passInfoLabel}>TIME</Text>
                  <Text style={styles.passInfoValue}>{MOCK_PASS.time}</Text>
                </View>
                <View style={styles.passInfoItem}>
                  <Text style={styles.passInfoLabel}>SEATS</Text>
                  <Text style={styles.passInfoValue}>{MOCK_PASS.seats.join(', ')}</Text>
                </View>
              </View>

              <View style={styles.passInfoRow}>
                <View style={styles.passInfoItem}>
                  <Text style={styles.passInfoLabel}>VENUE</Text>
                  <Text style={styles.passInfoValue}>{MOCK_PASS.venue}</Text>
                </View>
              </View>
            </View>

            {/* Barcode */}
            <View style={styles.barcodeContainer}>
              <View style={styles.barcode}>
                {/* Simulated barcode lines */}
                {[...Array(30)].map((_, i) => (
                  <View 
                    key={i} 
                    style={[
                      styles.barcodeLine, 
                      { width: Math.random() > 0.5 ? 2 : 4 }
                    ]} 
                  />
                ))}
              </View>
              <Text style={styles.barcodeNumber}>{MOCK_PASS.barcode}</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Benefits */}
        <View style={styles.benefitsSection}>
          <Text style={styles.sectionTitle}>Why Add to Wallet?</Text>
          
          <View style={styles.benefitCard}>
            <View style={[styles.benefitIcon, { backgroundColor: 'rgba(168, 85, 247, 0.2)' }]}>
              <Ionicons name="wifi-outline" size={24} color={colors.primary.main} />
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Works Offline</Text>
              <Text style={styles.benefitDesc}>Access your ticket even without internet connection</Text>
            </View>
          </View>

          <View style={styles.benefitCard}>
            <View style={[styles.benefitIcon, { backgroundColor: 'rgba(236, 72, 153, 0.2)' }]}>
              <Ionicons name="notifications-outline" size={24} color={colors.secondary.main} />
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Smart Reminders</Text>
              <Text style={styles.benefitDesc}>Get notified when it's time to leave for the show</Text>
            </View>
          </View>

          <View style={styles.benefitCard}>
            <View style={[styles.benefitIcon, { backgroundColor: 'rgba(6, 182, 212, 0.2)' }]}>
              <Ionicons name="location-outline" size={24} color={colors.accent.main} />
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Location Aware</Text>
              <Text style={styles.benefitDesc}>Ticket appears on lock screen when you arrive</Text>
            </View>
          </View>

          <View style={styles.benefitCard}>
            <View style={[styles.benefitIcon, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
              <Ionicons name="flash-outline" size={24} color={colors.semantic.success} />
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Quick Entry</Text>
              <Text style={styles.benefitDesc}>Scan directly from your wallet - no app needed</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.bottomCTA, { paddingBottom: insets.bottom + spacing.md }]}>
        <TouchableOpacity
          style={[styles.addButton, addedToWallet && styles.addButtonDisabled]}
          onPress={handleAddToWallet}
          disabled={isAdding || addedToWallet}
        >
          <LinearGradient
            colors={addedToWallet ? [colors.semantic.success, colors.semantic.success] : (isIOS ? ['#000', '#1a1a1a'] : ['#4285F4', '#34A853'])}
            style={styles.addButtonGradient}
          >
            {isAdding ? (
              <Text style={styles.addButtonText}>Adding...</Text>
            ) : addedToWallet ? (
              <>
                <Ionicons name="checkmark-circle" size={24} color={colors.neutral.white} />
                <Text style={styles.addButtonText}>Added to Wallet</Text>
              </>
            ) : (
              <>
                <Ionicons name={isIOS ? 'wallet' : 'wallet-outline'} size={24} color={colors.neutral.white} />
                <Text style={styles.addButtonText}>
                  Add to {isIOS ? 'Apple' : 'Google'} Wallet
                </Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.dark[500] },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { ...typography.headingMedium, color: colors.neutral.text },
  content: { flex: 1 },
  contentContainer: { padding: spacing.lg },
  passContainer: { marginBottom: spacing.xl },
  passCard: { borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: colors.dark[500] },
  passHeader: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.dark[500] },
  passLogo: { width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(168, 85, 247, 0.2)', alignItems: 'center', justifyContent: 'center' },
  passHeaderText: { flex: 1, marginLeft: spacing.md },
  passAppName: { ...typography.labelLarge, color: colors.neutral.text },
  passType: { ...typography.caption, color: colors.neutral.textTertiary },
  walletIcon: { width: 32, height: 32, borderRadius: 8 },
  passImage: { width: '100%', height: 120 },
  passDetails: { padding: spacing.lg },
  passShowTitle: { ...typography.headingMedium, color: colors.neutral.text, marginBottom: spacing.md },
  passInfoRow: { flexDirection: 'row', marginBottom: spacing.md },
  passInfoItem: { flex: 1 },
  passInfoLabel: { ...typography.caption, color: colors.neutral.textTertiary, marginBottom: spacing.xxs, letterSpacing: 1 },
  passInfoValue: { ...typography.labelMedium, color: colors.neutral.text },
  barcodeContainer: { padding: spacing.lg, backgroundColor: colors.neutral.white, alignItems: 'center' },
  barcode: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 60, gap: 2 },
  barcodeLine: { height: '100%', backgroundColor: colors.dark[900] },
  barcodeNumber: { ...typography.labelMedium, color: colors.dark[900], marginTop: spacing.sm, letterSpacing: 2 },
  benefitsSection: { marginBottom: spacing.xl },
  sectionTitle: { ...typography.headingSmall, color: colors.neutral.text, marginBottom: spacing.md },
  benefitCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.dark[700], borderRadius: 12, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.dark[500] },
  benefitIcon: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  benefitContent: { flex: 1, marginLeft: spacing.md },
  benefitTitle: { ...typography.labelMedium, color: colors.neutral.text, marginBottom: spacing.xxs },
  benefitDesc: { ...typography.bodySmall, color: colors.neutral.textSecondary },
  bottomCTA: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: spacing.lg, paddingTop: spacing.md, backgroundColor: colors.dark[800], borderTopWidth: 1, borderTopColor: colors.dark[500] },
  addButton: { borderRadius: 12, overflow: 'hidden' },
  addButtonDisabled: { opacity: 0.8 },
  addButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.lg, gap: spacing.sm },
  addButtonText: { ...typography.labelLarge, color: colors.neutral.white },
});
