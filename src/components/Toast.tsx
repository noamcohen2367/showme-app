// ============================================
// ShowME App - Toast Notification Component
// ============================================

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { getAppWidth } from '../utils/dimensions';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography, spacing } from '../theme/theme';

const SCREEN_WIDTH = getAppWidth();

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onHide: () => void;
}

const toastConfig = {
  success: {
    icon: 'checkmark-circle' as const,
    color: colors.semantic.success,
    bgColor: 'rgba(16, 185, 129, 0.15)',
  },
  error: {
    icon: 'close-circle' as const,
    color: colors.semantic.error,
    bgColor: 'rgba(239, 68, 68, 0.15)',
  },
  warning: {
    icon: 'warning' as const,
    color: colors.semantic.warning,
    bgColor: 'rgba(245, 158, 11, 0.15)',
  },
  info: {
    icon: 'information-circle' as const,
    color: colors.primary.main,
    bgColor: 'rgba(168, 85, 247, 0.15)',
  },
};

export function Toast({ visible, message, type = 'info', duration = 3000, onHide }: ToastProps) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const config = toastConfig[type];

  useEffect(() => {
    if (visible) {
      // Slide in
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: insets.top + spacing.md,
          transform: [{ translateY }],
          opacity,
          backgroundColor: config.bgColor,
          borderColor: config.color,
        },
      ]}
    >
      <Ionicons name={config.icon} size={22} color={config.color} />
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
}

// Toast Context for global usage
import { createContext, useContext, useState, useCallback } from 'react';

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toastState, setToastState] = useState({
    visible: false,
    message: '',
    type: 'info' as ToastType,
    duration: 3000,
  });

  const showToast = useCallback((message: string, type: ToastType = 'info', duration: number = 3000) => {
    setToastState({ visible: true, message, type, duration });
  }, []);

  const hideToast = useCallback(() => {
    setToastState(prev => ({ ...prev, visible: false }));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast
        visible={toastState.visible}
        message={toastState.message}
        type={toastState.type}
        duration={toastState.duration}
        onHide={hideToast}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  message: {
    ...typography.bodyMedium,
    color: colors.neutral.text,
    marginStart: spacing.md,
    flex: 1,
  },
});

export default Toast;
