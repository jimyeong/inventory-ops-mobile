import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { chips } from '../../theme/token';

type ChipSize = 'sm' | 'md' | 'lg';
type ChipTone = 'primary' | 'neutral' | 'danger';

interface BaseChipProps {
  onPress: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  label: string;
  selected?: boolean;

  /** Variants */
  size?: ChipSize;
  tone?: ChipTone;

  /** Overrides */
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const SIZE: Record<ChipSize, { container: ViewStyle; label: TextStyle }> = {
  sm: {
    container: { paddingHorizontal: 10, paddingVertical: 6 },
    label: { fontSize: 12 },
  },
  md: {
    container: { paddingHorizontal: 12, paddingVertical: 8 },
    label: { fontSize: 14 },
  },
  lg: {
    container: { paddingHorizontal: 14, paddingVertical: 10 },
    label: { fontSize: 16 },
  },
};

const TONE = {
  primary: {
    selected: { backgroundColor: chips.chipSelected.backgroundColor },
    unselected: { backgroundColor: chips.chip.backgroundColor },
    selectedLabel: { color: chips.chipTextSelected.color },
    unselectedLabel: { color: chips.chipTextUnselected.color },
  },
  neutral: {
    selected: { backgroundColor: '#111827' },
    unselected: { backgroundColor: '#e5e7eb' },
    selectedLabel: { color: '#ffffff' },
    unselectedLabel: { color: '#111827' },
  },
  danger: {
    selected: { backgroundColor: '#dc2626' },
    unselected: { backgroundColor: '#fee2e2' },
    selectedLabel: { color: '#ffffff' },
    unselectedLabel: { color: '#7f1d1d' },
  },
} satisfies Record<ChipTone, {
  selected: ViewStyle;
  unselected: ViewStyle;
  selectedLabel: TextStyle;
  unselectedLabel: TextStyle;
}>;

const BaseChip = ({
  onPress,
  disabled = false,
  children,
  label,
  selected = false,
  size = 'md',
  tone = 'primary',
  style,
  textStyle,
}: BaseChipProps) => {
  const toneStyles = TONE[tone];

  return (
    <TouchableOpacity
      style={[
        styles.base,
        SIZE[size].container,
        selected ? toneStyles.selected : toneStyles.unselected,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.label,
          SIZE[size].label,
          selected ? toneStyles.selectedLabel : toneStyles.unselectedLabel,
          disabled && styles.disabledLabel,
          textStyle ?? undefined,
        ]}
      >
        {label}
      </Text>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    gap: 6,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontWeight: '600',
  },
  disabledLabel: {
    color: '#9ca3af',
  },
});

export default BaseChip;