// ============================================
// ShowME App - Login Screen (MVP Mock Auth)
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

interface LoginScreenProps {
  onLogin: () => void;
  onGoToSignUp: () => void;
}

export default function LoginScreen({ onLogin, onGoToSignUp }: LoginScreenProps) {
  const insets = useSafeAreaInsets();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!identifier.trim()) {
      newErrors.identifier = 'Email or phone is required';
    } else if (
      !identifier.includes('@') &&
      !/^\+?[\d\s\-()]{7,}$/.test(identifier.trim())
    ) {
      newErrors.identifier = 'Enter a valid email or phone number';
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: identifier.trim(),
        password,
      });
      if (error) {
        Alert.alert('Sign In Failed', error.message);
        return;
      }
      onLogin();
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
              <Text style={styles.wordmarkMe}> MI</Text>
            </Text>
            <Text style={styles.tagline}>Your theater, your way</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sign In</Text>
            <Text style={styles.cardSubtitle}>Welcome back! Enter your details to continue.</Text>

            {/* Identifier field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Email</Text>
              <View style={[styles.inputRow, errors.identifier && styles.inputRowError]}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={errors.identifier ? colors.semantic.error : colors.neutral.textTertiary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="your@email.com or +972..."
                  placeholderTextColor={colors.neutral.textTertiary}
                  value={identifier}
                  onChangeText={v => {
                    setIdentifier(v);
                    if (errors.identifier) setErrors(e => ({ ...e, identifier: undefined }));
                  }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  returnKeyType="next"
                />
              </View>
              {errors.identifier && (
                <Text style={styles.errorText}>{errors.identifier}</Text>
              )}
            </View>

            {/* Password field */}
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
                  placeholder="Enter password"
                  placeholderTextColor={colors.neutral.textTertiary}
                  value={password}
                  onChangeText={v => {
                    setPassword(v);
                    if (errors.password) setErrors(e => ({ ...e, password: undefined }));
                  }}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />
                <TouchableOpacity onPress={() => setShowPassword(p => !p)} style={styles.eyeButton}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.neutral.textTertiary}
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            {/* Login button */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[colors.primary.main, colors.secondary.main]}
                style={styles.loginButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.neutral.white} />
                ) : (
                  <Text style={styles.loginButtonText}>Sign In</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Sign Up link */}
            <View style={styles.signUpRow}>
              <Text style={styles.signUpPrompt}>Don't have an account? </Text>
              <TouchableOpacity onPress={onGoToSignUp}>
                <Text style={styles.signUpLink}>Sign Up</Text>
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
  loginButton: {
    marginTop: spacing.sm,
    borderRadius: 14,
    overflow: 'hidden',
  },
  loginButtonGradient: {
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    ...typography.labelLarge,
    color: colors.neutral.white,
    fontWeight: '700',
  },
  signUpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  signUpPrompt: {
    ...typography.bodySmall,
    color: colors.neutral.textTertiary,
  },
  signUpLink: {
    ...typography.bodySmall,
    color: colors.primary.main,
    fontWeight: '600',
  },
});
