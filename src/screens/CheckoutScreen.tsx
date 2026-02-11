// ============================================
// ShowME App - Checkout Screen (Dark Aurora Theme)
// ============================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing } from '../theme/theme';
import { RootStackParamList } from '../types/types';
import { useShow } from '../hooks/useShows';
import { getTheaterById } from '../data/theaters';
import { currentUser, userSubscriptions } from '../data/user';

type CheckoutNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Checkout'>;
type CheckoutRouteProp = RouteProp<RootStackParamList, 'Checkout'>;

type PaymentMethod = 'credit_card' | 'apple_pay' | 'subscription';

export default function CheckoutScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<CheckoutNavigationProp>();
  const route = useRoute<CheckoutRouteProp>();
  const insets = useSafeAreaInsets();
  const isHebrew = i18n.language === 'he';

  const { showId, date, time, seats, totalPrice } = route.params;
  const { show } = useShow(showId);
  const theater = show ? getTheaterById(show.theaterId) : null;

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [addTicketProtect, setAddTicketProtect] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const title = show ? (isHebrew ? show.titleHe : show.title) : '';
  const theaterName = theater ? (isHebrew ? theater.nameHe : theater.name) : '';

  const ticketProtectCost = addTicketProtect ? seats.length * 15 : 0;
  const serviceFee = 10;
  const promoDiscount = promoApplied ? 20 : 0;
  const finalTotal = totalPrice + ticketProtectCost + serviceFee - promoDiscount;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'SHOWME20') {
      setPromoApplied(true);
      Alert.alert(t('checkout.promoApplied'), t('checkout.promoSuccess'));
    } else {
      Alert.alert(t('checkout.invalidPromo'), t('checkout.tryAgain'));
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    
    navigation.navigate('OrderConfirmation', {
      orderId: `ORD-${Date.now()}`,
      showId,
      date,
      time,
      seats,
      totalPrice: finalTotal,
    });
  };

  const formattedDate = new Date(date).toLocaleDateString(isHebrew ? 'he-IL' : 'en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.neutral.background} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.neutral.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('checkout.title')}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        {['date', 'time', 'seats', 'payment'].map((step, index) => (
          <React.Fragment key={step}>
            <View style={[
              styles.progressStep, 
              styles.progressStepActive,
              index < 3 && styles.progressStepCompleted,
            ]}>
              {index < 3 ? (
                <Ionicons name="checkmark" size={16} color={colors.neutral.white} />
              ) : (
                <LinearGradient
                  colors={[colors.primary.main, colors.secondary.main]}
                  style={styles.progressStepGradient}
                >
                  <Text style={styles.progressStepTextActive}>{index + 1}</Text>
                </LinearGradient>
              )}
            </View>
            {index < 3 && <View style={[styles.progressLine, styles.progressLineActive]} />}
          </React.Fragment>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('checkout.orderSummary')}</Text>
          <View style={styles.orderCard}>
            {show && (
              <Image source={{ uri: show.imageUrl }} style={styles.orderImage} contentFit="cover" transition={200} />
            )}
            <View style={styles.orderInfo}>
              <Text style={styles.orderTitle}>{title}</Text>
              <Text style={styles.orderDetail}>{theaterName}</Text>
              <Text style={styles.orderDetail}>{formattedDate} • {time}</Text>
              <Text style={styles.orderDetail}>{t('checkout.seats')}: {seats.join(', ')}</Text>
            </View>
          </View>
        </View>

        {/* Ticket Protect */}
        <View style={styles.section}>
          <View style={styles.ticketProtectCard}>
            <View style={styles.ticketProtectHeader}>
              <Ionicons name="shield-checkmark" size={24} color={colors.primary.main} />
              <View style={styles.ticketProtectInfo}>
                <Text style={styles.ticketProtectTitle}>{t('checkout.ticketProtect')}</Text>
                <Text style={styles.ticketProtectDesc}>{t('checkout.ticketProtectDesc')}</Text>
              </View>
              <Switch
                value={addTicketProtect}
                onValueChange={setAddTicketProtect}
                trackColor={{ false: colors.dark[500], true: colors.primary.main }}
                thumbColor={colors.neutral.white}
              />
            </View>
            <Text style={styles.ticketProtectPrice}>
              +₪15 {t('checkout.perTicket')}
            </Text>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('checkout.paymentMethod')}</Text>
          
          <TouchableOpacity
            style={[styles.paymentOption, paymentMethod === 'credit_card' && styles.paymentOptionSelected]}
            onPress={() => setPaymentMethod('credit_card')}
          >
            <Ionicons name="card" size={24} color={paymentMethod === 'credit_card' ? colors.primary.main : colors.neutral.text} />
            <View style={styles.paymentOptionInfo}>
              <Text style={[styles.paymentOptionTitle, paymentMethod === 'credit_card' && styles.paymentOptionTitleSelected]}>
                {t('checkout.creditCard')}
              </Text>
              <Text style={styles.paymentOptionSubtitle}>•••• 4242</Text>
            </View>
            {paymentMethod === 'credit_card' && (
              <Ionicons name="checkmark-circle" size={24} color={colors.primary.main} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.paymentOption, paymentMethod === 'apple_pay' && styles.paymentOptionSelected]}
            onPress={() => setPaymentMethod('apple_pay')}
          >
            <Ionicons name="logo-apple" size={24} color={paymentMethod === 'apple_pay' ? colors.primary.main : colors.neutral.text} />
            <View style={styles.paymentOptionInfo}>
              <Text style={[styles.paymentOptionTitle, paymentMethod === 'apple_pay' && styles.paymentOptionTitleSelected]}>
                Apple Pay
              </Text>
            </View>
            {paymentMethod === 'apple_pay' && (
              <Ionicons name="checkmark-circle" size={24} color={colors.primary.main} />
            )}
          </TouchableOpacity>

          {userSubscriptions.length > 0 && (
            <TouchableOpacity
              style={[styles.paymentOption, paymentMethod === 'subscription' && styles.paymentOptionSelected]}
              onPress={() => setPaymentMethod('subscription')}
            >
              <Ionicons name="ticket" size={24} color={paymentMethod === 'subscription' ? colors.primary.main : colors.neutral.text} />
              <View style={styles.paymentOptionInfo}>
                <Text style={[styles.paymentOptionTitle, paymentMethod === 'subscription' && styles.paymentOptionTitleSelected]}>
                  {t('checkout.useSubscription')}
                </Text>
                <Text style={styles.paymentOptionSubtitle}>
                  {userSubscriptions[0].remainingTickets} {t('checkout.ticketsRemaining')}
                </Text>
              </View>
              {paymentMethod === 'subscription' && (
                <Ionicons name="checkmark-circle" size={24} color={colors.primary.main} />
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Promo Code */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('checkout.promoCode')}</Text>
          <View style={styles.promoContainer}>
            <TextInput
              style={styles.promoInput}
              placeholder={t('checkout.enterPromo')}
              placeholderTextColor={colors.neutral.textTertiary}
              value={promoCode}
              onChangeText={setPromoCode}
              editable={!promoApplied}
            />
            <TouchableOpacity
              style={[styles.promoButton, promoApplied && styles.promoButtonApplied]}
              onPress={handleApplyPromo}
              disabled={promoApplied || promoCode.length === 0}
            >
              <Text style={styles.promoButtonText}>
                {promoApplied ? t('checkout.applied') : t('checkout.apply')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Price Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('checkout.priceBreakdown')}</Text>
          <View style={styles.priceCard}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>{t('checkout.tickets')} ({seats.length}×)</Text>
              <Text style={styles.priceValue}>₪{totalPrice}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>{t('checkout.serviceFee')}</Text>
              <Text style={styles.priceValue}>₪{serviceFee}</Text>
            </View>
            {addTicketProtect && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>{t('checkout.ticketProtect')}</Text>
                <Text style={styles.priceValue}>₪{ticketProtectCost}</Text>
              </View>
            )}
            {promoApplied && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabelDiscount}>{t('checkout.discount')}</Text>
                <Text style={styles.priceValueDiscount}>-₪{promoDiscount}</Text>
              </View>
            )}
            <View style={styles.priceDivider} />
            <View style={styles.priceRow}>
              <Text style={styles.totalLabel}>{t('checkout.total')}</Text>
              <Text style={styles.totalValue}>₪{finalTotal}</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Button */}
      <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + spacing.md }]}>
        <View style={styles.securePayment}>
          <Ionicons name="lock-closed" size={14} color={colors.neutral.textTertiary} />
          <Text style={styles.securePaymentText}>{t('checkout.securePayment')}</Text>
        </View>
        <TouchableOpacity
          style={styles.payButton}
          onPress={handlePayment}
          disabled={isProcessing}
        >
          <LinearGradient
            colors={[colors.primary.main, colors.secondary.main]}
            style={styles.payButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {isProcessing ? (
              <Text style={styles.payButtonText}>{t('checkout.processing')}</Text>
            ) : (
              <>
                <Text style={styles.payButtonText}>{t('checkout.payNow')}</Text>
                <Text style={styles.payButtonPrice}>₪{finalTotal}</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark[500],
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.headingMedium,
    color: colors.neutral.text,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  progressStep: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.dark[700],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  progressStepActive: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    overflow: 'hidden',
  },
  progressStepCompleted: {
    backgroundColor: colors.primary.main,
  },
  progressStepGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressStepTextActive: {
    ...typography.labelMedium,
    color: colors.neutral.white,
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: colors.dark[500],
    marginHorizontal: spacing.xs,
  },
  progressLineActive: {
    backgroundColor: colors.primary.main,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  section: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    ...typography.headingSmall,
    color: colors.neutral.text,
    marginBottom: spacing.md,
  },
  orderCard: {
    flexDirection: 'row',
    backgroundColor: colors.dark[700],
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  orderImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: spacing.md,
  },
  orderInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  orderTitle: {
    ...typography.labelLarge,
    color: colors.neutral.text,
    marginBottom: spacing.xxs,
  },
  orderDetail: {
    ...typography.bodySmall,
    color: colors.neutral.textSecondary,
    marginTop: spacing.xxs,
  },
  ticketProtectCard: {
    backgroundColor: colors.dark[700],
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  ticketProtectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ticketProtectInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  ticketProtectTitle: {
    ...typography.labelLarge,
    color: colors.neutral.text,
  },
  ticketProtectDesc: {
    ...typography.bodySmall,
    color: colors.neutral.textSecondary,
    marginTop: spacing.xxs,
  },
  ticketProtectPrice: {
    ...typography.bodySmall,
    color: colors.primary.main,
    marginTop: spacing.sm,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark[700],
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  paymentOptionSelected: {
    borderColor: colors.primary.main,
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
  },
  paymentOptionInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  paymentOptionTitle: {
    ...typography.labelLarge,
    color: colors.neutral.text,
  },
  paymentOptionTitleSelected: {
    color: colors.primary.main,
  },
  paymentOptionSubtitle: {
    ...typography.bodySmall,
    color: colors.neutral.textSecondary,
    marginTop: spacing.xxs,
  },
  promoContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  promoInput: {
    flex: 1,
    backgroundColor: colors.dark[700],
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...typography.bodyMedium,
    color: colors.neutral.text,
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  promoButton: {
    backgroundColor: colors.dark[600],
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  promoButtonApplied: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: colors.semantic.success,
  },
  promoButtonText: {
    ...typography.labelMedium,
    color: colors.primary.main,
  },
  priceCard: {
    backgroundColor: colors.dark[700],
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  priceLabel: {
    ...typography.bodyMedium,
    color: colors.neutral.textSecondary,
  },
  priceValue: {
    ...typography.bodyMedium,
    color: colors.neutral.text,
  },
  priceLabelDiscount: {
    ...typography.bodyMedium,
    color: colors.semantic.success,
  },
  priceValueDiscount: {
    ...typography.bodyMedium,
    color: colors.semantic.success,
  },
  priceDivider: {
    height: 1,
    backgroundColor: colors.dark[500],
    marginVertical: spacing.md,
  },
  totalLabel: {
    ...typography.labelLarge,
    color: colors.neutral.text,
  },
  totalValue: {
    ...typography.headingMedium,
    color: colors.primary.main,
  },
  bottomContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.dark[500],
    backgroundColor: colors.dark[800],
  },
  securePayment: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  securePaymentText: {
    ...typography.bodySmall,
    color: colors.neutral.textTertiary,
    marginLeft: spacing.xs,
  },
  payButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  payButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  payButtonText: {
    ...typography.labelLarge,
    color: colors.neutral.white,
  },
  payButtonPrice: {
    ...typography.labelLarge,
    color: colors.neutral.white,
    opacity: 0.8,
  },
});
