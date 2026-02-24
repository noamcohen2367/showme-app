// ============================================
// ShowME App - My Subscriptions Screen (MVP – manual local tracking)
// ============================================

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing } from '../theme/theme';
import {
  Subscription,
  getSubscriptions,
  saveSubscriptions,
} from '../storage/mvpStorage';

// ──────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────
function generateId(): string {
  return `sub_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function clamp(val: number, min: number, max: number) {
  return Math.min(max, Math.max(min, val));
}

interface FormState {
  name: string;
  theater: string;
  totalTickets: string;
  remainingTickets: string;
}

const EMPTY_FORM: FormState = {
  name: '',
  theater: '',
  totalTickets: '',
  remainingTickets: '',
};

// ──────────────────────────────────────────
// Add / Edit modal
// ──────────────────────────────────────────
interface SubModalProps {
  visible: boolean;
  initial: Subscription | null;
  onClose: () => void;
  onSave: (sub: Subscription) => void;
}

function SubModal({ visible, initial, onClose, onSave }: SubModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const isEdit = initial !== null;

  useEffect(() => {
    if (visible) {
      setForm(
        initial
          ? {
              name: initial.name,
              theater: initial.theater,
              totalTickets: String(initial.totalTickets),
              remainingTickets: String(initial.remainingTickets),
            }
          : EMPTY_FORM,
      );
      setErrors({});
    }
  }, [visible, initial]);

  const validate = (): boolean => {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.theater.trim()) e.theater = 'Required';
    const total = parseInt(form.totalTickets, 10);
    const remaining = parseInt(form.remainingTickets, 10);
    if (isNaN(total) || total <= 0) e.totalTickets = 'Must be > 0';
    if (isNaN(remaining) || remaining < 0) e.remainingTickets = 'Must be ≥ 0';
    if (!isNaN(total) && !isNaN(remaining) && remaining > total) {
      e.remainingTickets = 'Cannot exceed total';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const total = parseInt(form.totalTickets, 10);
    const remaining = clamp(parseInt(form.remainingTickets, 10), 0, total);
    const now = new Date().toISOString();
    onSave({
      id: initial?.id ?? generateId(),
      name: form.name.trim(),
      theater: form.theater.trim(),
      totalTickets: total,
      remainingTickets: remaining,
      usedCount: total - remaining,
      createdAt: initial?.createdAt ?? now,
      updatedAt: now,
    });
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.modalContainer} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Modal header */}
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.neutral.text} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>{isEdit ? 'Edit Subscription' : 'Add Subscription'}</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.modalSave}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalBody} keyboardShouldPersistTaps="handled">
          {/* Name */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Subscription Name *</Text>
            <TextInput
              style={[styles.formInput, errors.name && styles.formInputError]}
              placeholder="e.g. Cameri Season Pass"
              placeholderTextColor={colors.neutral.textTertiary}
              value={form.name}
              onChangeText={v => { setForm(f => ({ ...f, name: v })); setErrors(e => ({ ...e, name: undefined })); }}
            />
            {errors.name && <Text style={styles.formError}>{errors.name}</Text>}
          </View>

          {/* Theater */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Theater *</Text>
            <TextInput
              style={[styles.formInput, errors.theater && styles.formInputError]}
              placeholder="e.g. Cameri Theatre"
              placeholderTextColor={colors.neutral.textTertiary}
              value={form.theater}
              onChangeText={v => { setForm(f => ({ ...f, theater: v })); setErrors(e => ({ ...e, theater: undefined })); }}
            />
            {errors.theater && <Text style={styles.formError}>{errors.theater}</Text>}
          </View>

          {/* Tickets row */}
          <View style={styles.ticketsRow}>
            <View style={[styles.formGroup, styles.ticketField]}>
              <Text style={styles.formLabel}>Total Tickets *</Text>
              <TextInput
                style={[styles.formInput, errors.totalTickets && styles.formInputError]}
                placeholder="10"
                placeholderTextColor={colors.neutral.textTertiary}
                value={form.totalTickets}
                onChangeText={v => {
                  setForm(f => ({ ...f, totalTickets: v }));
                  setErrors(e => ({ ...e, totalTickets: undefined, remainingTickets: undefined }));
                }}
                keyboardType="number-pad"
              />
              {errors.totalTickets && <Text style={styles.formError}>{errors.totalTickets}</Text>}
            </View>
            <View style={[styles.formGroup, styles.ticketField]}>
              <Text style={styles.formLabel}>Remaining *</Text>
              <TextInput
                style={[styles.formInput, errors.remainingTickets && styles.formInputError]}
                placeholder="10"
                placeholderTextColor={colors.neutral.textTertiary}
                value={form.remainingTickets}
                onChangeText={v => {
                  setForm(f => ({ ...f, remainingTickets: v }));
                  setErrors(e => ({ ...e, remainingTickets: undefined }));
                }}
                keyboardType="number-pad"
              />
              {errors.remainingTickets && <Text style={styles.formError}>{errors.remainingTickets}</Text>}
            </View>
          </View>

          <Text style={styles.formHint}>
            Tip: after using a ticket, edit and decrease Remaining by 1.
          </Text>

          <View style={{ height: 60 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ──────────────────────────────────────────
// Main screen
// ──────────────────────────────────────────
export default function MySubscriptionsScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Subscription | null>(null);

  // Load from storage on mount
  useEffect(() => {
    getSubscriptions()
      .then(subs => setSubscriptions(subs))
      .finally(() => setLoading(false));
  }, []);

  // Persist whenever the list changes
  const persist = useCallback((subs: Subscription[]) => {
    setSubscriptions(subs);
    saveSubscriptions(subs);
  }, []);

  const openAdd = () => {
    setEditingItem(null);
    setModalVisible(true);
  };

  const openEdit = (sub: Subscription) => {
    setEditingItem(sub);
    setModalVisible(true);
  };

  const handleSave = (sub: Subscription) => {
    const updated = editingItem
      ? subscriptions.map(s => (s.id === sub.id ? sub : s))
      : [...subscriptions, sub];
    persist(updated);
    setModalVisible(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Subscription',
      'Are you sure you want to delete this subscription?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => persist(subscriptions.filter(s => s.id !== id)),
        },
      ],
    );
  };

  const handleUseTicket = (sub: Subscription) => {
    if (sub.remainingTickets <= 0) {
      Alert.alert('No tickets left', 'This subscription has no remaining tickets.');
      return;
    }
    Alert.alert(
      'Use a Ticket',
      `Use 1 ticket from "${sub.name}"?\n${sub.remainingTickets - 1} will remain.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            const updated = subscriptions.map(s =>
              s.id === sub.id
                ? {
                    ...s,
                    remainingTickets: s.remainingTickets - 1,
                    usedCount: s.usedCount + 1,
                    updatedAt: new Date().toISOString(),
                  }
                : s,
            );
            persist(updated);
          },
        },
      ],
    );
  };

  const getUsageGradient = (remaining: number, total: number): [string, string] => {
    const pct = total > 0 ? remaining / total : 0;
    if (pct > 0.5) return [colors.semantic.success, '#059669'];
    if (pct > 0.2) return [colors.semantic.warning, '#D97706'];
    return [colors.semantic.error, '#DC2626'];
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator color={colors.primary.main} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.neutral.background} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={styles.title}>{t('subscriptions.title')}</Text>
        <TouchableOpacity style={styles.addButton} onPress={openAdd} activeOpacity={0.8}>
          <LinearGradient
            colors={[colors.primary.main, colors.secondary.main]}
            style={styles.addButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="add" size={22} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {subscriptions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Ionicons name="card-outline" size={40} color={colors.neutral.textTertiary} />
            </View>
            <Text style={styles.emptyTitle}>No subscriptions yet</Text>
            <Text style={styles.emptyDesc}>
              Tap the + button to add your first theater subscription and start tracking your tickets.
            </Text>
            <TouchableOpacity style={styles.emptyButton} onPress={openAdd} activeOpacity={0.85}>
              <LinearGradient
                colors={[colors.primary.main, colors.secondary.main]}
                style={styles.emptyButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.emptyButtonText}>Add Subscription</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          subscriptions.map(sub => {
            const pct = sub.totalTickets > 0 ? sub.remainingTickets / sub.totalTickets : 0;
            const isLow = sub.remainingTickets <= 2 && sub.remainingTickets > 0;
            const isEmpty = sub.remainingTickets === 0;
            const gradientColors = getUsageGradient(sub.remainingTickets, sub.totalTickets);

            return (
              <View key={sub.id} style={styles.card}>
                {/* Card header */}
                <View style={styles.cardHeader}>
                  <View style={styles.cardInfo}>
                    <Text style={styles.subName} numberOfLines={1}>{sub.name}</Text>
                    <Text style={styles.subTheater} numberOfLines={1}>
                      <Ionicons name="business-outline" size={13} color={colors.neutral.textTertiary} />
                      {'  '}{sub.theater}
                    </Text>
                  </View>
                  <View style={styles.cardActions}>
                    <TouchableOpacity style={styles.iconBtn} onPress={() => openEdit(sub)}>
                      <Ionicons name="pencil-outline" size={18} color={colors.primary.main} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn} onPress={() => handleDelete(sub.id)}>
                      <Ionicons name="trash-outline" size={18} color={colors.semantic.error} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Tickets progress */}
                <View style={styles.progressSection}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>
                      {sub.remainingTickets} / {sub.totalTickets} tickets remaining
                    </Text>
                    {isLow && (
                      <View style={styles.warningBadge}>
                        <Text style={styles.warningText}>Low</Text>
                      </View>
                    )}
                    {isEmpty && (
                      <View style={styles.emptyBadge}>
                        <Text style={styles.emptyBadgeText}>Used up</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.progressBar}>
                    <LinearGradient
                      colors={gradientColors}
                      style={[styles.progressFill, { width: `${Math.round(pct * 100)}%` as any }]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    />
                  </View>
                </View>

                {/* Use ticket button */}
                <TouchableOpacity
                  style={[styles.useButton, isEmpty && styles.useButtonDisabled]}
                  onPress={() => handleUseTicket(sub)}
                  disabled={isEmpty}
                >
                  <Ionicons
                    name="ticket-outline"
                    size={16}
                    color={isEmpty ? colors.neutral.textTertiary : colors.primary.main}
                  />
                  <Text style={[styles.useButtonText, isEmpty && styles.useButtonTextDisabled]}>
                    Use a Ticket
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Add / Edit modal */}
      <SubModal
        visible={modalVisible}
        initial={editingItem}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
      />
    </View>
  );
}

// ──────────────────────────────────────────
// Styles
// ──────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral.background },
  centered: { alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark[500],
  },
  title: { ...typography.displaySmall, color: colors.neutral.text },
  addButton: { borderRadius: 20, overflow: 'hidden' },
  addButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1 },
  contentContainer: { padding: spacing.lg },
  emptyContainer: { alignItems: 'center', paddingVertical: spacing.xxxl },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.dark[700],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  emptyTitle: { ...typography.headingMedium, color: colors.neutral.text, marginBottom: spacing.sm },
  emptyDesc: {
    ...typography.bodyMedium,
    color: colors.neutral.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  emptyButton: { borderRadius: 12, overflow: 'hidden' },
  emptyButtonGradient: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
  },
  emptyButtonText: { ...typography.labelMedium, color: '#FFF', fontWeight: '700' },
  card: {
    backgroundColor: colors.dark[700],
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  cardInfo: { flex: 1, marginEnd: spacing.md },
  subName: { ...typography.labelLarge, color: colors.neutral.text, marginBottom: spacing.xxs },
  subTheater: { ...typography.bodySmall, color: colors.neutral.textTertiary },
  cardActions: { flexDirection: 'row', gap: spacing.sm },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.dark[800],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  progressSection: { marginBottom: spacing.md },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  progressLabel: { ...typography.bodySmall, color: colors.neutral.textSecondary },
  warningBadge: {
    backgroundColor: 'rgba(245,158,11,0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.semantic.warning,
  },
  warningText: { ...typography.caption, color: colors.semantic.warning, fontWeight: '600' },
  emptyBadge: {
    backgroundColor: 'rgba(239,68,68,0.15)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.semantic.error,
  },
  emptyBadgeText: { ...typography.caption, color: colors.semantic.error, fontWeight: '600' },
  progressBar: {
    height: 6,
    backgroundColor: colors.dark[600],
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 3 },
  useButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary.main,
    backgroundColor: 'rgba(168,85,247,0.08)',
  },
  useButtonDisabled: { borderColor: colors.dark[500], backgroundColor: 'transparent' },
  useButtonText: { ...typography.labelSmall, color: colors.primary.main },
  useButtonTextDisabled: { color: colors.neutral.textTertiary },
  modalContainer: { flex: 1, backgroundColor: colors.neutral.background },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark[500],
  },
  modalTitle: { ...typography.headingMedium, color: colors.neutral.text },
  modalSave: { ...typography.labelMedium, color: colors.primary.main },
  modalBody: { padding: spacing.lg },
  formGroup: { marginBottom: spacing.lg },
  formLabel: {
    ...typography.labelSmall,
    color: colors.neutral.textSecondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  formInput: {
    ...typography.bodyMedium,
    color: colors.neutral.text,
    backgroundColor: colors.dark[700],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.dark[500],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  formInputError: { borderColor: colors.semantic.error },
  formError: { ...typography.caption, color: colors.semantic.error, marginTop: spacing.xs },
  formHint: {
    ...typography.caption,
    color: colors.neutral.textTertiary,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  ticketsRow: { flexDirection: 'row', gap: spacing.md },
  ticketField: { flex: 1 },
});
