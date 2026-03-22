import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, iconSizes } from '../../theme/token';

interface BasicIconButtonProps {
    icon: string;
    onPress: () => void;
    size?: number;
    color?: string;
    disabled?: boolean;
    style?: ViewStyle;
    activeOpacity?: number;
    accessibilityLabel?: string;
    rotation?: number; // Rotation in degrees (0, 90, 180, 270, etc.)
}

const BasicIconButton = ({
    icon,
    onPress,
    size = iconSizes.md,
    color = colors.text.primary,
    disabled = false,
    style,
    activeOpacity = 0.7,
    accessibilityLabel,
    rotation = 0,
}: BasicIconButtonProps) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            activeOpacity={activeOpacity}
            style={[
                styles.button,
                disabled && styles.disabled,
                style,
            ]}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel || icon}
        >
            <View style={{ transform: [{ rotate: `${rotation}deg` }] }}>
                <Icon
                    name={icon}
                    size={size}
                    color={disabled ? colors.text.disabled : color}
                />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
    },
    disabled: {
        opacity: 0.5,
    },
});

export default BasicIconButton;
