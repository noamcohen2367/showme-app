// ============================================
// ShowME App - Animated Button Components
// ============================================

import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Animated,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { colors, typography, spacing } from '../theme/theme';
import { mediumHaptic, lightHaptic } from '../utils/haptics';

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  hapticFeedback?: boolean;
}

export function AnimatedButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
  hapticFeedback = true,
}: AnimatedButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = async () => {
    if (hapticFeedback) {
      await mediumHaptic();
    }
    onPress();
  };

  const sizeStyles = {
    small: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      iconSize: 16,
    },
    medium: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      iconSize: 18,
    },
    large: {
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.xl,
      iconSize: 20,
    },
  };

  const currentSize = sizeStyles[size];

  const renderContent = () => {
    const textStyles = [
      styles.buttonText,
      size === 'small' && styles.buttonTextSmall,
      size === 'large' && styles.buttonTextLarge,
      variant === 'outline' && styles.buttonTextOutline,
      variant === 'ghost' && styles.buttonTextGhost,
      disabled && styles.buttonTextDisabled,
      textStyle,
    ];

    const iconColor =
      variant === 'outline' || variant === 'ghost'
        ? colors.primary.main
        : colors.neutral.white;

    if (loading) {
      return (
        <ActivityIndicator
          color={
            variant === 'outline' || variant === 'ghost'
              ? colors.primary.main
              : colors.neutral.white
          }
          size="small"
        />
      );
    }

    return (
      <View style={styles.buttonContent}>
        {icon && iconPosition === 'left' && (
          <Ionicons
            name={icon}
            size={currentSize.iconSize}
            color={iconColor}
            style={styles.iconLeft}
          />
        )}
        <Text style={textStyles}>{title}</Text>
        {icon && iconPosition === 'right' && (
          <Ionicons
            name={icon}
            size={currentSize.iconSize}
            color={iconColor}
            style={styles.iconRight}
          />
        )}
      </View>
    );
  };

  const buttonStyle = [
    styles.button,
    {
      paddingVertical: currentSize.paddingVertical,
      paddingHorizontal: currentSize.paddingHorizontal,
    },
    variant === 'outline' && styles.buttonOutline,
    variant === 'ghost' && styles.buttonGhost,
    disabled && styles.buttonDisabled,
    fullWidth && styles.buttonFullWidth,
    style,
  ];

  if (variant === 'primary' && !disabled) {
    return (
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          alignSelf: fullWidth ? 'stretch' : 'auto',
        }}
      >
        <TouchableOpacity
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled || loading}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={[colors.primary.main, colors.secondary.main]}
            style={[buttonStyle, styles.gradientButton]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {renderContent()}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  if (variant === 'secondary' && !disabled) {
    return (
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          alignSelf: fullWidth ? 'stretch' : 'auto',
        }}
      >
        <TouchableOpacity
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled || loading}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={[colors.primary.dark, colors.primary.main]}
            style={[buttonStyle, styles.gradientButton]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {renderContent()}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
        alignSelf: fullWidth ? 'stretch' : 'auto',
      }}
    >
      <TouchableOpacity
        style={buttonStyle}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.7}
      >
        {renderContent()}
      </TouchableOpacity>
    </Animated.View>
  );
}

// Animated Icon Button
interface AnimatedIconButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  size?: number;
  color?: string;
  backgroundColor?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

export function AnimatedIconButton({
  icon,
  onPress,
  size = 24,
  color = colors.neutral.white,
  backgroundColor = 'rgba(255, 255, 255, 0.1)',
  disabled = false,
  style,
}: AnimatedIconButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = async () => {
    await lightHaptic();
    onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.iconButton,
          {
            backgroundColor,
            width: size + 16,
            height: size + 16,
            borderRadius: (size + 16) / 2,
          },
          disabled && styles.iconButtonDisabled,
          style,
        ]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Ionicons
          name={icon}
          size={size}
          color={disabled ? colors.neutral.textTertiary : color}
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

// Animated Card Pressable
interface AnimatedCardProps {
  children: React.ReactNode;
  onPress: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}

export function AnimatedCard({
  children,
  onPress,
  style,
  disabled = false,
}: AnimatedCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = async () => {
    await lightHaptic();
    onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={style}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={1}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientButton: {
    borderRadius: 12,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary.main,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
  },
  buttonDisabled: {
    backgroundColor: colors.dark[600],
  },
  buttonFullWidth: {
    width: '100%',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    ...typography.labelLarge,
    color: colors.neutral.white,
  },
  buttonTextSmall: {
    ...typography.labelMedium,
  },
  buttonTextLarge: {
    fontSize: 18,
    fontWeight: '600',
  },
  buttonTextOutline: {
    color: colors.primary.main,
  },
  buttonTextGhost: {
    color: colors.primary.main,
  },
  buttonTextDisabled: {
    color: colors.neutral.textTertiary,
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonDisabled: {
    opacity: 0.5,
  },
});

export default {
  AnimatedButton,
  AnimatedIconButton,
  AnimatedCard,
};
