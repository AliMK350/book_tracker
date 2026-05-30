import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, PADDING, BORDER_RADIUS } from '../utils/constants';

export const SearchInput = ({ value, onChangeText, placeholder = 'Chercher...', style }) => {
  return (
    <View style={[styles.container, style]}>
      <Ionicons 
        name="search" 
        size={20} 
        color={COLORS.textTertiary}
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textTertiary}
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
    backgroundColor: COLORS.darkMedium,
    borderRadius: BORDER_RADIUS.lg,
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
    fontSize: 14,
  },
});
