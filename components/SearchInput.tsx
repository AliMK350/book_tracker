import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, PADDING, BORDER_RADIUS } from '../utils/constants';

interface SearchInputProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  style?: ViewStyle | ViewStyle[];
}

export const SearchInput: React.FC<SearchInputProps> = ({ value, onChangeText, placeholder = 'Chercher...', style }) => {
  return (
    <View style={[styles.container, style]}>
      <Ionicons 
        name="search" 
        size={20} 
        color={COLORS.primary}
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textSecondary}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: PADDING.md,
    marginBottom: PADDING.md,
  },
  icon: {
    marginRight: PADDING.sm,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    paddingVertical: PADDING.md,
    fontSize: 15,
    fontWeight: '600',
  },
});
