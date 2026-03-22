import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ProductStock } from '../../../stocks/models/types';

const StockCardIconText = ({ stock,iconName, iconColor, label, value }: { stock: ProductStock, iconName: string, iconColor: string, label: string, value: string }) => {
    return (

        <View style={styles.stockDetailRow}>
            <Icon name={iconName} size={16} color={iconColor} />
            <Text style={styles.stockDetailLabel}>{label}</Text>
            <Text style={styles.stockDetailValue}>
                {value}
            </Text>
        </View>
    );
};

export default StockCardIconText;

const styles = StyleSheet.create({

    stockDetailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stockDetailLabel: {
        fontSize: 13,
        fontWeight: '500',
        color: '#7f8c8d',
        width: 90,
    },
    stockDetailValue: {
        flex: 1,
        fontSize: 13,
        color: '#2c3e50',
    },

});