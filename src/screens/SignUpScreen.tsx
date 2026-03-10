// ============================================
// ShowME App - Sign Up Screen
// ============================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { supabase } from '../lib/supabase';
import { colors, typography, spacing } from '../theme/theme';

interface SignUpScreenProps {
  onSignedUp: () => void;
  onGoToLogin: () => void;
}

export default function SignUpScreen({ onSignedUp, onGoToLogin }: SignUpScreenProps) {
  const insets = useSafeAreaInsets();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!email.includes('@')) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (phone.trim().length < 9) {
      newErrors.phone = 'Enter a valid phone number';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validate()) return;
    setIsLoading(true);

    try {
      // Check if email or phone already exists in USER table
      const { data: existing } = await supabase
        .from('USER')
        .select('email, phone')
        .or(`email.eq.${email.trim()},phone.eq.${phone.trim()}`)
        .limit(1);

      if (existing && existing.length > 0) {
        const match = existing[0];
        if (match.email === email.trim()) {
          setErrors(e => ({ ...e, email: 'Email is already registered' }));
        } else {
          setErrors(e => ({ ...e, phone: 'Phone number is already registered' }));
        }
        return;
      }

      // Create auth user — metadata passed to DB trigger
      const { error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { fullName: name.trim(), phone: phone.trim() } },
      });

      if (authError) {
        if (authError.status === 422) {
          setErrors(e => ({ ...e, email: 'Email is already registered' }));
        } else {
          Alert.alert('Sign Up Failed', authError.message);
        }
        return;
      }

      Alert.alert(
        'Account Created!',
        'Your account has been created. You can now sign in.',
        [{ text: 'Sign In', onPress: onSignedUp }],
      );
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.neutral.background} />

      {/* Aurora background */}
      <LinearGradient
        colors={['rgba(168, 85, 247, 0.25)', 'rgba(236, 72, 153, 0.1)', 'transparent']}
        style={styles.aurora}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.6 }}
        pointerEvents="none"
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo / Wordmark */}
          <View style={styles.logoContainer}>
            <Text style={styles.wordmark}>
              <Text style={styles.wordmarkShow}>SHOW</Text>
              <Text style={styles.wordmarkMe}> ME</Text>
            </Text>
            <Text style={styles.tagline}>Your theater, your way</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Create Account</Text>
            <Text style={styles.cardSubtitle}>Join ShowME and discover amazing theater.</Text>

            {/* Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <View style={[styles.inputRow, errors.name && styles.inputRowError]}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={errors.name ? colors.semantic.error : colors.neutral.textTertiary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Your full name"
                  placeholderTextColor={colors.neutral.textTertiary}
                  value={name}
                  onChangeText={v => {
                    setName(v);
                    if (errors.name) setErrors(e => ({ ...e, name: undefined }));
                  }}
                  autoCapitalize="words"
                  autoComplete="name"
                  returnKeyType="next"
                />
              </View>
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Email</Text>
              <View style={[styles.inputRow, errors.email && styles.inputRowError]}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={errors.email ? colors.semantic.error : colors.neutral.textTertiary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="your@email.com"
                  placeholderTextColor={colors.neutral.textTertiary}
                  value={email}
                  onChangeText={v => {
                    setEmail(v);
                    if (errors.email) setErrors(e => ({ ...e, email: undefined }));
                  }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  returnKeyType="next"
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* Phone */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Phone Number</Text>
              <View style={[styles.inputRow, errors.phone && styles.inputRowError]}>
                <Ionicons
                  name="call-outline"
                  size={20}
                  color={errors.phone ? colors.semantic.error : colors.neutral.textTertiary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="050-000-0000"
                  placeholderTextColor={colors.neutral.textTertiary}
                  value={phone}
                  onChangeText={v => {
                    setPhone(v);
                    if (errors.phone) setErrors(e => ({ ...e, phone: undefined }));
                  }}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  returnKeyType="next"
                />
              </View>
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            </View>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Password</Text>
              <View style={[styles.inputRow, errors.password && styles.inputRowError]}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={errors.password ? colors.semantic.error : colors.neutral.textTertiary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="At least 6 characters"
                  placeholderTextColor={colors.neutral.textTertiary}
                  value={password}
                  onChangeText={v => {
                    setPassword(v);
                    if (errors.password) setErrors(e => ({ ...e, password: undefined }));
                  }}
                  secureTextEntry={!showPassword}
                  autoComplete="new-password"
                  returnKeyType="next"
                />
                <TouchableOpacity onPress={() => setShowPassword(p => !p)} style={styles.eyeButton}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.neutral.textTertiary}
                  />
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            {/* Confirm Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Confirm Password</Text>
              <View style={[styles.inputRow, errors.confirmPassword && styles.inputRowError]}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={errors.confirmPassword ? colors.semantic.error : colors.neutral.textTertiary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Repeat your password"
                  placeholderTextColor={colors.neutral.textTertiary}
                  value={confirmPassword}
                  onChangeText={v => {
                    setConfirmPassword(v);
                    if (errors.confirmPassword) setErrors(e => ({ ...e, confirmPassword: undefined }));
                  }}
                  secureTextEntry={!showConfirmPassword}
                  autoComplete="new-password"
                  returnKeyType="done"
                  onSubmitEditing={handleSignUp}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(p => !p)} style={styles.eyeButton}>
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.neutral.textTertiary}
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
            </View>

            {/* Sign Up button */}
            <TouchableOpacity
              style={styles.button}
              onPress={handleSignUp}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[colors.primary.main, colors.secondary.main]}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.neutral.white} />
                ) : (
                  <Text style={styles.buttonText}>Create Account</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Back to login */}
            <View style={styles.loginRow}>
              <Text style={styles.loginPrompt}>Already have an account? </Text>
              <TouchableOpacity onPress={onGoToLogin}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: colors.neutral.background,
  },
  aurora: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  wordmark: {
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: 2,
  },
  wordmarkShow: {
    color: colors.neutral.text,
  },
  wordmarkMe: {
    color: colors.primary.main,
  },
  tagline: {
    ...typography.bodyMedium,
    color: colors.neutral.textTertiary,
    marginTop: spacing.xs,
  },
  card: {
    backgroundColor: colors.dark[700],
    borderRadius: 20,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.dark[500],
  },
  cardTitle: {
    ...typography.headingLarge,
    color: colors.neutral.text,
    marginBottom: spacing.xs,
  },
  cardSubtitle: {
    ...typography.bodyMedium,
    color: colors.neutral.textSecondary,
    marginBottom: spacing.xl,
  },
  fieldGroup: {
    marginBottom: spacing.lg,
  },
  fieldLabel: {
    ...typography.labelSmall,
    color: colors.neutral.textSecondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark[800],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.dark[500],
    paddingHorizontal: spacing.md,
  },
  inputRowError: {
    borderColor: colors.semantic.error,
  },
  inputIcon: {
    marginEnd: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.neutral.text,
    paddingVertical: spacing.md,
  },
  eyeButton: {
    padding: spacing.sm,
  },
  errorText: {
    ...typography.caption,
    color: colors.semantic.error,
    marginTop: spacing.xs,
    marginStart: spacing.xs,
  },
  button: {
    marginTop: spacing.sm,
    borderRadius: 14,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    ...typography.labelLarge,
    color: colors.neutral.white,
    fontWeight: '700',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  loginPrompt: {
    ...typography.bodySmall,
    color: colors.neutral.textTertiary,
  },
  loginLink: {
    ...typography.bodySmall,
    color: colors.primary.main,
    fontWeight: '600',
  },
});
