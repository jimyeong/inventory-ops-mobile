import React from 'react';
import BaseChip from '../../../shared/ui/Chips/BaseChip';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

interface ChipProps {
    label: string;
    selected: boolean;
    onPress: () => void;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

const Chip = ({ label, selected, onPress, disabled, style, textStyle }: ChipProps) => {
    return (
        <BaseChip 
        label={label} 
        selected={selected} 
        onPress={onPress} 
        disabled={disabled} 
        style={style ?? undefined} 
        textStyle={textStyle ?? undefined} 
        size="md"
        tone="primary"
        />
    )
};

export default Chip;