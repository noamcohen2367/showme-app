// ============================================
// ShowME App - Group Booking Screen
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
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing } from '../theme/theme';
import { RootStackParamList } from '../types/types';

type GroupBookingNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface GroupMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  ticketType: 'adult' | 'child' | 'senior' | 'student';
  specialRequests?: string;
}

const TICKET_TYPES = [
  { id: 'adult', label: 'Adult', price: 150, icon: 'person' },
  { id: 'child', label: 'Child (3-12)', price: 80, icon: 'happy' },
  { id: 'senior', label: 'Senior (65+)', price: 100, icon: 'heart' },
  { id: 'student', label: 'Student', price: 90, icon: 'school' },
];

const GROUP_DISCOUNTS = [
  { min: 5, max: 9, discount: 10 },
  { min: 10, max: 19, discount: 15 },
  { min: 20, max: 999, discount: 20 },
];

export default function GroupBookingScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<GroupBookingNavigationProp>();
  const insets = useSafeAreaInsets();

  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState<GroupMember[]>([
    { id: '1', name: '', email: '', ticketType: 'adult' },
  ]);
  const [expandedMember, setExpandedMember] = useState<string | null>('1');
  const [specialOccasion, setSpecialOccasion] = useState<string | null>(null);

  const addMember = () => {
    const newId = Date.now().toString();
    setMembers([...members, { id: newId, name: '', email: '', ticketType: 'adult' }]);
    setExpandedMember(newId);
  };

  const removeMember = (id: string) => {
    if (members.length > 1) {
      setMembers(members.filter(m => m.id !== id));
    }
  };

  const updateMember = (id: string, field: keyof GroupMember, value: string) => {
    setMembers(members.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const getDiscount = () => {
    const count = members.length;
    const discount = GROUP_DISCOUNTS.find(d => count >= d.min && count <= d.max);
    return discount?.discount || 0;
  };

  const calculateTotal = () => {
    const subtotal = members.reduce((sum, member) => {
      const ticketType = TICKET_TYPES.find(t => t.id === member.ticketType);
      return sum + (ticketType?.price || 0);
    }, 0);
    const discount = getDiscount();
    const discountAmount = subtotal * (discount / 100);
    return { subtotal, discount, discountAmount, total: subtotal - discountAmount };
  };

  const totals = calculateTotal();

  const renderMemberCard = (member: GroupMember, index: number) => {
    const isExpanded = expandedMember === member.id;
    const ticketType = TICKET_TYPES.find(t => t.id === member.ticketType);

    return (
      <View key={member.id} style={styles.memberCard}>
        <TouchableOpacity
          style={styles.memberHeader}
          onPress={() => setExpandedMember(isExpanded ? null : member.id)}
        >
          <View style={styles.memberHeaderLeft}>
            <View style={styles.memberNumber}>
              <Text style={styles.memberNumberText}>{index + 1}</Text>
            </View>
            <View>
              <Text style={styles.memberName}>
                {member.name || `Guest ${index + 1}`}
              </Text>
              <Text style={styles.memberType}>{ticketType?.label} - ₪{ticketType?.price}</Text>
            </View>
          </View>
          <View style={styles.memberHeaderRight}>
            {members.length > 1 && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeMember(member.id)}
              >
                <Ionicons name="trash-outline" size={18} color={colors.semantic.error} />
              </TouchableOpacity>
            )}
            <Ionicons
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={colors.neutral.textSecondary}
            />
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.memberContent}>
            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter name"
                placeholderTextColor={colors.neutral.textTertiary}
                value={member.name}
                onChangeText={(text) => updateMember(member.id, 'name', text)}
              />
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter email"
                placeholderTextColor={colors.neutral.textTertiary}
                value={member.email}
                onChangeText={(text) => updateMember(member.id, 'email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Ticket Type */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Ticket Type</Text>
              <View style={styles.ticketTypes}>
                {TICKET_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.ticketTypeOption,
                      member.ticketType === type.id && styles.ticketTypeOptionActive,
                    ]}
                    onPress={() => updateMember(member.id, 'ticketType', type.id)}
                  >
                    <Ionicons
                      name={type.icon as any}
                      size={18}
                      color={member.ticketType === type.id ? colors.primary.main : colors.neutral.textSecondary}
                    />
                    <Text style={[
                      styles.ticketTypeLabel,
                      member.ticketType === type.id && styles.ticketTypeLabelActive,
                    ]}>
                      {type.label}
                    </Text>
                    <Text style={[
                      styles.ticketTypePrice,
                      member.ticketType === type.id && styles.ticketTypePriceActive,
                    ]}>
                      ₪{type.price}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Special Requests */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Special Requests (Optional)</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Wheelchair access, dietary needs, etc."
                placeholderTextColor={colors.neutral.textTertiary}
                value={member.specialRequests}
                onChangeText={(text) => updateMember(member.id, 'specialRequests', text)}
                multiline
                numberOfLines={2}
              />
            </View>
          </View>
        )}
      </View>
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
        <Text style={styles.headerTitle}>Group Booking</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Group Info Card */}
        <View style={styles.infoCard}>
          <LinearGradient
            colors={[colors.primary.main, colors.secondary.main]}
            style={styles.infoCardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.infoCardContent}>
              <Ionicons name="people" size={32} color={colors.neutral.white} />
              <View style={styles.infoCardText}>
                <Text style={styles.infoCardTitle}>Group Discounts Available!</Text>
                <Text style={styles.infoCardDesc}>
                  5-9 people: 10% off • 10-19: 15% off • 20+: 20% off
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Group Name */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Group Details</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Group Name (Optional)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Birthday Party, Office Outing"
              placeholderTextColor={colors.neutral.textTertiary}
              value={groupName}
              onChangeText={setGroupName}
            />
          </View>
        </View>

        {/* Special Occasion */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Occasion?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.occasionOptions}>
              {[
                { id: 'birthday', label: '🎂 Birthday', icon: 'gift' },
                { id: 'anniversary', label: '💍 Anniversary', icon: 'heart' },
                { id: 'corporate', label: '💼 Corporate', icon: 'business' },
                { id: 'school', label: '🎓 School Trip', icon: 'school' },
                { id: 'other', label: '🎉 Other', icon: 'sparkles' },
              ].map((occasion) => (
                <TouchableOpacity
                  key={occasion.id}
                  style={[
                    styles.occasionChip,
                    specialOccasion === occasion.id && styles.occasionChipActive,
                  ]}
                  onPress={() => setSpecialOccasion(
                    specialOccasion === occasion.id ? null : occasion.id
                  )}
                >
                  <Text style={[
                    styles.occasionChipText,
                    specialOccasion === occasion.id && styles.occasionChipTextActive,
                  ]}>
                    {occasion.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Group Members */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Group Members ({members.length})</Text>
            {getDiscount() > 0 && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountBadgeText}>{getDiscount()}% OFF</Text>
              </View>
            )}
          </View>
          {members.map((member, index) => renderMemberCard(member, index))}

          {/* Add Member Button */}
          <TouchableOpacity style={styles.addMemberButton} onPress={addMember}>
            <LinearGradient
              colors={['rgba(168, 85, 247, 0.1)', 'rgba(236, 72, 153, 0.1)']}
              style={styles.addMemberGradient}
            >
              <Ionicons name="add-circle" size={24} color={colors.primary.main} />
              <Text style={styles.addMemberText}>Add Another Person</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Price Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Price Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal ({members.length} tickets)</Text>
            <Text style={styles.summaryValue}>₪{totals.subtotal}</Text>
          </View>

          {totals.discount > 0 && (
            <View style={styles.summaryRow}>
              <View style={styles.discountRow}>
                <Text style={styles.summaryLabelGreen}>Group Discount ({totals.discount}%)</Text>
                <View style={styles.savingsBadge}>
                  <Text style={styles.savingsBadgeText}>SAVINGS</Text>
                </View>
              </View>
              <Text style={styles.summaryValueGreen}>-₪{totals.discountAmount.toFixed(0)}</Text>
            </View>
          )}

          <View style={styles.summaryDivider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₪{totals.total.toFixed(0)}</Text>
          </View>

          {totals.discount > 0 && (
            <View style={styles.savingsNote}>
              <Ionicons name="checkmark-circle" size={16} color={colors.semantic.success} />
              <Text style={styles.savingsNoteText}>
                You're saving ₪{totals.discountAmount.toFixed(0)} with group discount!
              </Text>
            </View>
          )}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.bottomCTA, { paddingBottom: insets.bottom + spacing.md }]}>
        <View style={styles.bottomInfo}>
          <Text style={styles.bottomTotal}>₪{totals.total.toFixed(0)}</Text>
          <Text style={styles.bottomCount}>{members.length} tickets</Text>
        </View>
        <TouchableOpacity style={styles.continueButton}>
          <LinearGradient
            colors={[colors.primary.main, colors.secondary.main]}
            style={styles.continueGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.continueText}>Continue to Seats</Text>
            <Ionicons name="arrow-forward" size={20} color={colors.neutral.white} />
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
  infoCard: { marginBottom: spacing.xl, borderRadius: 16, overflow: 'hidden' },
  infoCardGradient: { padding: spacing.lg },
  infoCardContent: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  infoCardText: { flex: 1 },
  infoCardTitle: { ...typography.labelLarge, color: colors.neutral.white, marginBottom: spacing.xxs },
  infoCardDesc: { ...typography.bodySmall, color: 'rgba(255, 255, 255, 0.8)' },
  section: { marginBottom: spacing.xl },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  sectionTitle: { ...typography.headingSmall, color: colors.neutral.text, marginBottom: spacing.md },
  inputGroup: { marginBottom: spacing.md },
  inputLabel: { ...typography.labelSmall, color: colors.neutral.textSecondary, marginBottom: spacing.xs },
  textInput: { backgroundColor: colors.dark[700], borderRadius: 12, paddingHorizontal: spacing.md, paddingVertical: spacing.md, ...typography.bodyMedium, color: colors.neutral.text, borderWidth: 1, borderColor: colors.dark[500] },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  occasionOptions: { flexDirection: 'row', gap: spacing.sm },
  occasionChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: 20, backgroundColor: colors.dark[700], borderWidth: 1, borderColor: colors.dark[500] },
  occasionChipActive: { backgroundColor: 'rgba(168, 85, 247, 0.2)', borderColor: colors.primary.main },
  occasionChipText: { ...typography.labelMedium, color: colors.neutral.textSecondary },
  occasionChipTextActive: { color: colors.primary.main },
  discountBadge: { backgroundColor: colors.semantic.success, paddingHorizontal: spacing.sm, paddingVertical: spacing.xxs, borderRadius: 8 },
  discountBadgeText: { ...typography.labelSmall, color: colors.neutral.white },
  memberCard: { backgroundColor: colors.dark[700], borderRadius: 16, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.dark[500], overflow: 'hidden' },
  memberHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.md },
  memberHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  memberNumber: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary.main, alignItems: 'center', justifyContent: 'center' },
  memberNumberText: { ...typography.labelMedium, color: colors.neutral.white },
  memberName: { ...typography.labelMedium, color: colors.neutral.text },
  memberType: { ...typography.caption, color: colors.neutral.textTertiary },
  memberHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  removeButton: { padding: spacing.xs },
  memberContent: { paddingHorizontal: spacing.md, paddingBottom: spacing.md, borderTopWidth: 1, borderTopColor: colors.dark[500] },
  ticketTypes: { gap: spacing.sm },
  ticketTypeOption: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderRadius: 12, backgroundColor: colors.dark[600], borderWidth: 1, borderColor: colors.dark[500], gap: spacing.md },
  ticketTypeOptionActive: { borderColor: colors.primary.main, backgroundColor: 'rgba(168, 85, 247, 0.1)' },
  ticketTypeLabel: { flex: 1, ...typography.bodyMedium, color: colors.neutral.textSecondary },
  ticketTypeLabelActive: { color: colors.neutral.text },
  ticketTypePrice: { ...typography.labelMedium, color: colors.neutral.textTertiary },
  ticketTypePriceActive: { color: colors.primary.main },
  addMemberButton: { borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: colors.primary.main, borderStyle: 'dashed' },
  addMemberGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.lg, gap: spacing.sm },
  addMemberText: { ...typography.labelMedium, color: colors.primary.main },
  summaryCard: { backgroundColor: colors.dark[700], borderRadius: 16, padding: spacing.lg, borderWidth: 1, borderColor: colors.dark[500] },
  summaryTitle: { ...typography.labelLarge, color: colors.neutral.text, marginBottom: spacing.lg },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  summaryLabel: { ...typography.bodyMedium, color: colors.neutral.textSecondary },
  summaryValue: { ...typography.labelMedium, color: colors.neutral.text },
  discountRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  summaryLabelGreen: { ...typography.bodyMedium, color: colors.semantic.success },
  summaryValueGreen: { ...typography.labelMedium, color: colors.semantic.success },
  savingsBadge: { backgroundColor: 'rgba(16, 185, 129, 0.2)', paddingHorizontal: spacing.xs, paddingVertical: 2, borderRadius: 4 },
  savingsBadgeText: { ...typography.caption, color: colors.semantic.success, fontSize: 9 },
  summaryDivider: { height: 1, backgroundColor: colors.dark[500], marginVertical: spacing.md },
  totalLabel: { ...typography.headingSmall, color: colors.neutral.text },
  totalValue: { ...typography.headingMedium, color: colors.primary.main },
  savingsNote: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.md, backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: spacing.md, borderRadius: 8 },
  savingsNoteText: { ...typography.bodySmall, color: colors.semantic.success },
  bottomCTA: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.md, backgroundColor: colors.dark[800], borderTopWidth: 1, borderTopColor: colors.dark[500] },
  bottomInfo: { marginEnd: spacing.lg },
  bottomTotal: { ...typography.headingMedium, color: colors.neutral.text },
  bottomCount: { ...typography.caption, color: colors.neutral.textTertiary },
  continueButton: { flex: 1, borderRadius: 12, overflow: 'hidden' },
  continueGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.md, gap: spacing.sm },
  continueText: { ...typography.labelLarge, color: colors.neutral.white },
});
