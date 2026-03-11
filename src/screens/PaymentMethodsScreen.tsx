// ============================================
// ShowME App - Payment Methods Screen
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
  Platform,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing } from '../theme/theme';

interface PaymentMethod {
  id: string;
  type: 'card' | 'apple_pay' | 'google_pay' | 'paypal';
  label: string;
  last4?: string;
  expiryDate?: string;
  cardBrand?: 'visa' | 'mastercard' | 'amex';
  isDefault: boolean;
}

const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  { id: '1', type: 'apple_pay', label: 'Apple Pay', isDefault: true },
  { id: '2', type: 'card', label: 'Visa', last4: '4242', expiryDate: '12/26', cardBrand: 'visa', isDefault: false },
  { id: '3', type: 'card', label: 'Mastercard', last4: '8888', expiryDate: '08/25', cardBrand: 'mastercard', isDefault: false },
];

const CARD_BRANDS: Record<string, { color: string; icon: string }> = {
  visa: { color: '#1A1F71', icon: '💳' },
  mastercard: { color: '#EB001B', icon: '💳' },
  amex: { color: '#006FCF', icon: '💳' },
};

export default function PaymentMethodsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [paymentMethods, setPaymentMethods] = useState(MOCK_PAYMENT_METHODS);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({ number: '', expiry: '', cvv: '', name: '' });

  const isIOS = Platform.OS === 'ios';

  const setDefaultMethod = (id: string) => {
    setPaymentMethods(prev => prev.map(m => ({ ...m, isDefault: m.id === id })));
  };

  const deleteMethod = (id: string) => {
    Alert.alert(
      'Remove Payment Method',
      'Are you sure you want to remove this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => setPaymentMethods(prev => prev.filter(m => m.id !== id))
        }
      ]
    );
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  const formatExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleAddCard = () => {
    if (!newCard.number || !newCard.expiry || !newCard.cvv || !newCard.name) {
      Alert.alert('Missing Information', 'Please fill in all card details');
      return;
    }

    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: 'card',
      label: 'New Card',
      last4: newCard.number.replace(/\s/g, '').slice(-4),
      expiryDate: newCard.expiry,
      cardBrand: 'visa',
      isDefault: false,
    };

    setPaymentMethods([...paymentMethods, newMethod]);
    setShowAddCard(false);
    setNewCard({ number: '', expiry: '', cvv: '', name: '' });
  };

  const renderPaymentMethod = (method: PaymentMethod) => {
    const isDigitalWallet = method.type === 'apple_pay' || method.type === 'google_pay';

    return (
      <TouchableOpacity
        key={method.id}
        style={[styles.methodCard, method.isDefault && styles.methodCardDefault]}
        onPress={() => setDefaultMethod(method.id)}
      >
        <View style={styles.methodLeft}>
          {method.type === 'apple_pay' && (
            <View style={[styles.methodIcon, { backgroundColor: '#000' }]}>
              <Ionicons name="logo-apple" size={24} color="#fff" />
            </View>
          )}
          {method.type === 'google_pay' && (
            <View style={[styles.methodIcon, { backgroundColor: '#fff' }]}>
              <Text style={{ fontSize: 20 }}>G</Text>
            </View>
          )}
          {method.type === 'card' && (
            <View style={[styles.methodIcon, { backgroundColor: CARD_BRANDS[method.cardBrand || 'visa'].color }]}>
              <Ionicons name="card" size={20} color="#fff" />
            </View>
          )}
          {method.type === 'paypal' && (
            <View style={[styles.methodIcon, { backgroundColor: '#003087' }]}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>P</Text>
            </View>
          )}

          <View style={styles.methodInfo}>
            <Text style={styles.methodLabel}>
              {isDigitalWallet ? method.label : `•••• ${method.last4}`}
            </Text>
            {method.expiryDate && (
              <Text style={styles.methodExpiry}>Expires {method.expiryDate}</Text>
            )}
            {isDigitalWallet && (
              <Text style={styles.methodExpiry}>Instant checkout</Text>
            )}
          </View>
        </View>

        <View style={styles.methodRight}>
          {method.isDefault ? (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultBadgeText}>Default</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteMethod(method.id)}
            >
              <Ionicons name="trash-outline" size={18} color={colors.semantic.error} />
            </TouchableOpacity>
          )}
        </View>
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
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Digital Wallets */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Digital Wallets</Text>
          <Text style={styles.sectionSubtitle}>Fast & secure checkout</Text>

          {/* Apple/Google Pay Setup */}
          {!paymentMethods.find(m => m.type === 'apple_pay' || m.type === 'google_pay') ? (
            <TouchableOpacity style={styles.setupWalletCard}>
              <LinearGradient
                colors={isIOS ? ['#000', '#1a1a1a'] : ['#4285F4', '#34A853']}
                style={styles.setupWalletGradient}
              >
                <Ionicons name={isIOS ? 'logo-apple' : 'wallet-outline'} size={32} color="#fff" />
                <View style={styles.setupWalletText}>
                  <Text style={styles.setupWalletTitle}>
                    Set up {isIOS ? 'Apple' : 'Google'} Pay
                  </Text>
                  <Text style={styles.setupWalletDesc}>
                    Pay with a single touch
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            paymentMethods.filter(m => m.type === 'apple_pay' || m.type === 'google_pay').map(renderPaymentMethod)
          )}
        </View>

        {/* Credit/Debit Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Credit & Debit Cards</Text>
          
          {paymentMethods.filter(m => m.type === 'card').map(renderPaymentMethod)}

          {/* Add Card Form */}
          {showAddCard ? (
            <View style={styles.addCardForm}>
              <Text style={styles.addCardTitle}>Add New Card</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Card Number</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="1234 5678 9012 3456"
                  placeholderTextColor={colors.neutral.textTertiary}
                  value={newCard.number}
                  onChangeText={(text) => setNewCard({ ...newCard, number: formatCardNumber(text) })}
                  keyboardType="number-pad"
                  maxLength={19}
                />
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1, marginEnd: spacing.md }]}>
                  <Text style={styles.inputLabel}>Expiry</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="MM/YY"
                    placeholderTextColor={colors.neutral.textTertiary}
                    value={newCard.expiry}
                    onChangeText={(text) => setNewCard({ ...newCard, expiry: formatExpiry(text) })}
                    keyboardType="number-pad"
                    maxLength={5}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>CVV</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="123"
                    placeholderTextColor={colors.neutral.textTertiary}
                    value={newCard.cvv}
                    onChangeText={(text) => setNewCard({ ...newCard, cvv: text.replace(/\D/g, '') })}
                    keyboardType="number-pad"
                    maxLength={4}
                    secureTextEntry
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Cardholder Name</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="John Doe"
                  placeholderTextColor={colors.neutral.textTertiary}
                  value={newCard.name}
                  onChangeText={(text) => setNewCard({ ...newCard, name: text })}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.addCardActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setShowAddCard(false);
                    setNewCard({ number: '', expiry: '', cvv: '', name: '' });
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleAddCard}>
                  <LinearGradient
                    colors={[colors.primary.main, colors.secondary.main]}
                    style={styles.saveButtonGradient}
                  >
                    <Text style={styles.saveButtonText}>Save Card</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addCardButton}
              onPress={() => setShowAddCard(true)}
            >
              <Ionicons name="add-circle-outline" size={24} color={colors.primary.main} />
              <Text style={styles.addCardButtonText}>Add New Card</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Security Note */}
        <View style={styles.securityNote}>
          <Ionicons name="shield-checkmark" size={20} color={colors.semantic.success} />
          <Text style={styles.securityText}>
            Your payment information is encrypted and securely stored. We never store your full card number.
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.dark[500] },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { ...typography.headingMedium, color: colors.neutral.text },
  content: { flex: 1 },
  contentContainer: { padding: spacing.lg },
  section: { marginBottom: spacing.xl },
  sectionTitle: { ...typography.headingSmall, color: colors.neutral.text, marginBottom: spacing.xxs },
  sectionSubtitle: { ...typography.bodySmall, color: colors.neutral.textTertiary, marginBottom: spacing.md },
  setupWalletCard: { borderRadius: 16, overflow: 'hidden' },
  setupWalletGradient: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg },
  setupWalletText: { flex: 1, marginStart: spacing.md },
  setupWalletTitle: { ...typography.labelLarge, color: '#fff' },
  setupWalletDesc: { ...typography.bodySmall, color: 'rgba(255,255,255,0.8)' },
  methodCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.dark[700], borderRadius: 12, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.dark[500] },
  methodCardDefault: { borderColor: colors.primary.main },
  methodLeft: { flexDirection: 'row', alignItems: 'center' },
  methodIcon: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  methodInfo: { marginStart: spacing.md },
  methodLabel: { ...typography.labelMedium, color: colors.neutral.text },
  methodExpiry: { ...typography.caption, color: colors.neutral.textTertiary, marginTop: 2 },
  methodRight: { flexDirection: 'row', alignItems: 'center' },
  defaultBadge: { backgroundColor: colors.primary.main, paddingHorizontal: spacing.sm, paddingVertical: spacing.xxs, borderRadius: 8 },
  defaultBadgeText: { ...typography.caption, color: colors.neutral.white },
  deleteButton: { padding: spacing.sm },
  addCardButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.dark[700], borderRadius: 12, padding: spacing.lg, borderWidth: 1, borderColor: colors.dark[500], borderStyle: 'dashed', gap: spacing.sm },
  addCardButtonText: { ...typography.labelMedium, color: colors.primary.main },
  addCardForm: { backgroundColor: colors.dark[700], borderRadius: 16, padding: spacing.lg, borderWidth: 1, borderColor: colors.dark[500] },
  addCardTitle: { ...typography.labelLarge, color: colors.neutral.text, marginBottom: spacing.lg },
  inputGroup: { marginBottom: spacing.md },
  inputLabel: { ...typography.labelSmall, color: colors.neutral.textSecondary, marginBottom: spacing.xs },
  textInput: { backgroundColor: colors.dark[600], borderRadius: 10, paddingHorizontal: spacing.md, paddingVertical: spacing.md, ...typography.bodyMedium, color: colors.neutral.text, borderWidth: 1, borderColor: colors.dark[500] },
  inputRow: { flexDirection: 'row' },
  addCardActions: { flexDirection: 'row', marginTop: spacing.md, gap: spacing.md },
  cancelButton: { flex: 1, paddingVertical: spacing.md, alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: colors.dark[400] },
  cancelButtonText: { ...typography.labelMedium, color: colors.neutral.textSecondary },
  saveButton: { flex: 2, borderRadius: 10, overflow: 'hidden' },
  saveButtonGradient: { paddingVertical: spacing.md, alignItems: 'center' },
  saveButtonText: { ...typography.labelMedium, color: colors.neutral.white },
  securityNote: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: spacing.md, borderRadius: 12, gap: spacing.sm },
  securityText: { ...typography.bodySmall, color: colors.semantic.success, flex: 1 },
});
