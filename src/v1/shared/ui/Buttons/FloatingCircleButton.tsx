import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, shadows } from '../../theme/token';

interface FloatingCircleButtonProps {
    onPress: () => void;
    icon?: string;
    iconSize?: number;
    iconColor?: string;
    backgroundColor?: string;
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
    size?: number;
}

const FloatingCircleButton = ({
    onPress,
    icon = 'add',
    iconSize = 24,
    iconColor = colors.common.white,
    backgroundColor = colors.primary.main,
    disabled = false,
    loading = false,
    style,
    size = 56,
}: FloatingCircleButtonProps) => {
    return (
        <TouchableOpacity
            style={[
                styles.container,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: disabled ? colors.neutral[400] : backgroundColor,
                },
                shadows.lg,
                disabled && styles.disabled,
                style,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={iconColor} size="small" />
            ) : (
                <Icon name={icon} size={iconSize} color={iconColor} />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    disabled: {
        opacity: 0.5,
    },
});

export default FloatingCircleButton;
