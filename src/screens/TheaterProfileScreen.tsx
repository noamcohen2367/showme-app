// ============================================
// ShowME App - Theater Profile Screen
// Edit theater public details
// ============================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { colors, typography, spacing } from '../theme/theme';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useTheater } from '../hooks/useTheater';

// ─── Field component ────────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'url';
  rtl: boolean;
}

function Field({ label, value, onChange, placeholder, multiline, keyboardType = 'default', rtl }: FieldProps) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={[styles.fieldLabel, rtl && styles.textRTL]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          multiline && styles.inputMultiline,
          rtl && styles.inputRTL,
        ]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.neutral.textTertiary}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        keyboardType={keyboardType}
        textAlign={rtl ? 'right' : 'left'}
        autoCapitalize="none"
      />
    </View>
  );
}

// ─── Screen ─────────────────────────────────────────────────────────────────

export default function TheaterProfileScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const rtl = i18n.language === 'he';
  const { userProfile } = useAuth();
  const theaterId = userProfile?.theaterId ?? '';
  const { theater, loading: theaterLoading, refresh } = useTheater(theaterId || undefined);

  const [nameHe, setNameHe]           = useState('');
  const [nameEn, setNameEn]           = useState('');
  const [descriptionHe, setDescHe]    = useState('');
  const [descriptionEn, setDescEn]    = useState('');
  const [address, setAddress]         = useState('');
  const [phone, setPhone]             = useState('');
  const [email, setEmail]             = useState('');
  const [website, setWebsite]         = useState('');
  const [saving, setSaving]           = useState(false);
  const [isDirty, setIsDirty]         = useState(false);

  // Populate fields once theater data loads
  useEffect(() => {
    if (!theater) return;
    setNameHe(theater.nameHe);
    setNameEn(theater.name);
    setDescHe(theater.descriptionHe);
    setDescEn(theater.description);
    setAddress(theater.address);
    setPhone(theater.phone);
    setEmail(theater.email);
    setWebsite(theater.website);
  }, [theater]);

  const makeOnChange = (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (v: string) => { setter(v); setIsDirty(true); };

  const handleSave = async () => {
    if (!theaterId) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('theaters').update({
        name:           nameEn.trim(),
        name_he:        nameHe.trim(),
        description:    descriptionEn.trim(),
        description_he: descriptionHe.trim(),
        address:        address.trim(),
        phone:          phone.trim(),
        email:          email.trim(),
        website:        website.trim(),
      }).eq('id', theaterId);

      if (error) throw error;
      await refresh();
      setIsDirty(false);
      Alert.alert('✓', 'הפרטים נשמרו בהצלחה');
    } catch {
      Alert.alert('שגיאה', 'לא ניתן היה לשמור. נסה שוב.');
    } finally {
      setSaving(false);
    }
  };

  if (theaterLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary.main} />
      </View>
    );
  }

  if (!theater) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.neutral.textTertiary} />
        <Text style={[styles.errorText, { marginTop: spacing.md }]}>לא ניתן לטעון את פרטי התאטרון</Text>
        <TouchableOpacity onPress={refresh} style={{ marginTop: spacing.md }}>
          <Text style={{ color: colors.primary.main, ...typography.bodyMedium }}>נסה שוב</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={[styles.header, rtl && styles.headerRTL]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons
            name={rtl ? 'chevron-forward' : 'chevron-back'}
            size={24}
            color={colors.neutral.text}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('theaterDashboard.theaterProfile')}</Text>
        <TouchableOpacity
          style={[styles.saveBtn, !isDirty && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={!isDirty || saving}
        >
          {saving
            ? <ActivityIndicator size="small" color="#fff" />
            : <Text style={styles.saveBtnText}>{t('common.save')}</Text>
          }
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Section: Name */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, rtl && styles.textRTL]}>שם התאטרון</Text>
            <View style={styles.card}>
              <Field rtl={rtl} label="עברית"   value={nameHe} onChange={makeOnChange(setNameHe)} placeholder="שם בעברית" />
              <View style={styles.fieldDivider} />
              <Field rtl={rtl} label="English" value={nameEn} onChange={makeOnChange(setNameEn)} placeholder="Name in English" />
            </View>
          </View>

          {/* Section: Description */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, rtl && styles.textRTL]}>תיאור</Text>
            <View style={styles.card}>
              <Field rtl={rtl} label="עברית"   value={descriptionHe} onChange={makeOnChange(setDescHe)} placeholder="תיאור קצר של התאטרון..." multiline />
              <View style={styles.fieldDivider} />
              <Field rtl={rtl} label="English" value={descriptionEn} onChange={makeOnChange(setDescEn)} placeholder="Short description..." multiline />
            </View>
          </View>

          {/* Section: Contact */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, rtl && styles.textRTL]}>פרטי קשר</Text>
            <View style={styles.card}>
              <Field rtl={rtl} label="כתובת"   value={address} onChange={makeOnChange(setAddress)} placeholder="רחוב ועיר" />
              <View style={styles.fieldDivider} />
              <Field rtl={rtl} label="טלפון"   value={phone}   onChange={makeOnChange(setPhone)}   placeholder="03-000-0000" keyboardType="phone-pad" />
              <View style={styles.fieldDivider} />
              <Field rtl={rtl} label="אימייל"  value={email}   onChange={makeOnChange(setEmail)}   placeholder="info@theater.co.il" keyboardType="email-address" />
              <View style={styles.fieldDivider} />
              <Field rtl={rtl} label="אתר"     value={website} onChange={makeOnChange(setWebsite)} placeholder="https://..." keyboardType="url" />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Save bar (sticky bottom, appears when dirty) */}
      {isDirty && (
        <View style={[styles.saveBar, { paddingBottom: insets.bottom + 8 }]}>
          <TouchableOpacity
            style={styles.saveBarBtn}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[colors.primary.main, colors.secondary.main]}
              style={styles.saveBarGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {saving
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.saveBarText}>{t('common.save')}</Text>
              }
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: colors.neutral.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.neutral.background },
  errorText: { ...typography.bodyMedium, color: colors.neutral.textTertiary, textAlign: 'center' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark[500],
  },
  headerRTL: { flexDirection: 'row-reverse' },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { ...typography.headingSmall, color: colors.neutral.text },
  saveBtn: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
  },
  saveBtnDisabled: { backgroundColor: colors.dark[500] },
  saveBtnText: { ...typography.labelSmall, color: '#fff', fontWeight: '700' },

  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },

  section: { marginBottom: spacing.xl },
  sectionTitle: {
    ...typography.labelSmall,
    color: colors.neutral.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
    marginHorizontal: spacing.xs,
  },
  textRTL: { textAlign: 'right' },

  card: {
    backgroundColor: colors.dark[700],
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.dark[500],
    overflow: 'hidden',
  },
  fieldDivider: { height: 1, backgroundColor: colors.dark[500], marginHorizontal: spacing.md },

  fieldGroup: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  fieldLabel: {
    ...typography.caption,
    color: colors.neutral.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  input: {
    ...typography.bodyMedium,
    color: colors.neutral.text,
    paddingVertical: spacing.sm,
  },
  inputMultiline: {
    minHeight: 80,
    paddingTop: spacing.sm,
  },
  inputRTL: { textAlign: 'right' },

  saveBar: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.neutral.background,
    borderTopWidth: 1,
    borderTopColor: colors.dark[500],
  },
  saveBarBtn: { borderRadius: 14, overflow: 'hidden' },
  saveBarGradient: { paddingVertical: spacing.md + 2, alignItems: 'center' },
  saveBarText: { ...typography.labelLarge, color: '#fff', fontWeight: '700' },
});
