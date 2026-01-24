import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface ChipProps {
  label: string;
  variant?: 'default' | 'primary';
  onRemove?: () => void;
}

export function Chip({ label, variant = 'default', onRemove }: ChipProps) {
  const isPrimary = variant === 'primary';

  return (
    <View
      style={[
        styles.chip,
        isPrimary ? styles.chipPrimary : styles.chipDefault,
      ]}
    >
      <Text
        style={[
          styles.label,
          isPrimary ? styles.labelPrimary : styles.labelDefault,
        ]}
      >
        {label}
      </Text>
      {onRemove && (
        <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
          <Feather
            name="x"
            size={14}
            color={isPrimary ? colors.primary : colors.textSecondary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  chipDefault: {
    backgroundColor: colors.muted,
  },
  chipPrimary: {
    backgroundColor: colors.primaryLight,
  },
  label: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  labelDefault: {
    color: colors.textSecondary,
  },
  labelPrimary: {
    color: colors.primary,
  },
  removeButton: {
    marginLeft: 4,
  },
});
