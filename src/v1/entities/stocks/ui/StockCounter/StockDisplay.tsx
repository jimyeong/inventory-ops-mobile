import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProductStock } from '../../models/types';
import Icon from 'react-native-vector-icons/MaterialIcons';

const StockDisplay = ({ stock, iconName, iconColor, label, value }: { stock: ProductStock, iconName: string, iconColor: string, label: string, value: string }) => {
    return (
        <View style={styles.quantityItem}>
            <Icon name={iconName} size={20} color={iconColor} />
            <View style={styles.quantityInfo}>
                <Text style={styles.quantityLabel}>{label}</Text>
                <Text style={styles.quantityValue}>{value}</Text>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({

    quantityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    quantityInfo: {
        alignItems: 'center',
    },
    quantityLabel: {
        fontSize: 12,
        color: '#7f8c8d',
    },
    quantityValue: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2c3e50',
    },
});

export default StockDisplay;