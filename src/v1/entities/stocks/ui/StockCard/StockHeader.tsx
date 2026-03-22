import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ProductStock } from '../../../../features/products/model/type';

const StockHeader = ({ stock }: { stock: ProductStock }) => {
    return (

        <View style={styles.stockCardHeader}>
            <View style={styles.stockIdBadge}>
                <Icon name="inventory" size={16} color="#3498db" />
                <Text style={styles.stockIdText}>Stock #{stock.stock_id}</Text>
            </View>
            {stock.discount_rate > 0 && (
                <View style={styles.discountBadge}>
                    <Icon name="local-offer" size={14} color="#e74c3c" />
                    <Text style={styles.discountText}>{stock.discount_rate}% OFF</Text>
                </View>
            )}
        </View>
    );
};

export default StockHeader;

const styles = StyleSheet.create({
    stockCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },

    stockIdBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e3f2fd',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 6,
    },
    stockIdText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1976d2',
    },

    discountBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fee',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        gap: 4,
    },
    discountText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#e74c3c',
    },
});