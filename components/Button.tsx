import React, { useRef } from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, Animated, ViewStyle } from 'react-native';
import { COLORS, PADDING, BORDER_RADIUS } from '../utils/constants';

type Variant = 'primary' | 'secondary' | 'outline' | 'danger';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle | ViewStyle[];
}

export const Button: React.FC<ButtonProps> = ({ 
  label, 
  onPress, 
  variant = 'primary', 
  loading = false,
  disabled = false,
  style 
}) => {
  const isDisabled = disabled || loading;
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: false }).start();
  const handlePressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: false }).start();

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
    >
      <Animated.View style={[
        styles.button,
        // styles is a plain object; assert key exists
        (styles as any)[variant],
        isDisabled && styles.disabled,
        style,
        { transform: [{ scale }] }
      ]}>
        {loading ? (
          <ActivityIndicator color={COLORS.textPrimary} />
        ) : (
          <Text style={[styles.text, variant === 'outline' && styles.outlineText]}>{label}</Text>
        )}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: PADDING.md,
    paddingHorizontal: PADDING.lg,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 52,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  primary: {
    backgroundColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: COLORS.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  danger: {
    backgroundColor: COLORS.danger,
  },
  disabled: {
    opacity: 0.65,
  },
  text: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  outlineText: {
    color: COLORS.primary,
  },
});
