import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, shadows, spacing } from '../../../shared/theme/token';

interface ProductDetailBottomBarProps {
    onHome: () => void;
    onStockOut?: () => void;
    onEdit?: () => void;
    onHistory?: () => void;
}

const ProductDetailBottomBar = ({
    onHome,
    onStockOut,
    onEdit,
    onHistory,
}: ProductDetailBottomBarProps) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={onHome}>
                <Icon name="home" size={24} color={colors.success.main} />
                <Text style={styles.buttonText}>Home</Text>
            </TouchableOpacity>

            {onStockOut && (
                <TouchableOpacity style={styles.button} onPress={onStockOut}>
                    <Icon name="remove-circle" size={24} color={colors.error.main} />
                    <Text style={styles.buttonText}>Stock Out</Text>
                </TouchableOpacity>
            )}

            {onEdit && (
                <TouchableOpacity style={styles.button} onPress={onEdit}>
                    <Icon name="edit" size={24} color={colors.primary.main} />
                    <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
            )}

            {onHistory && (
                <TouchableOpacity style={styles.button} onPress={onHistory}>
                    <Icon name="history" size={24} color={colors.neutral[600]} />
                    <Text style={styles.buttonText}>History</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.background.paper,
        borderTopWidth: 1,
        borderTopColor: colors.border.light,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.base,
        ...shadows.md,
    },
    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.sm,
        gap: 4,
    },
    buttonText: {
        fontSize: 12,
        color: colors.text.secondary,
        fontWeight: '500',
        marginTop: 2,
    },
});

export default ProductDetailBottomBar;
