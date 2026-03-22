import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ProductStock } from '../../models/types';
import StockHeader from './StockHeader';
import StockDisplay from '../StockCounter/StockDisplay';
import StockCardIconText from './StockCardIconText';
import { colors } from '../../../../shared/theme/token';
import BasicIconButton from '../../../../shared/ui/Buttons/BasicIconButton';
import IndicatingButton from '../../../../shared/ui/Buttons/IndicatingButton';

interface StockCardProps {
    stock: ProductStock;
    index: number;
    onDelete?: (stockId: number) => void;
}

const StockCard = ({ stock, index, onDelete }: StockCardProps) => {
    return (
        <View key={stock.stock_id || index} style={styles.stockCard}>
            {/* Stock Header */}
            <StockHeader stock={stock} />

            {/* Stock Quantities */}
            <View style={styles.stockQuantities}>
                {stock.stock_type.toLowerCase() === 'box' && (
                    <StockDisplay stock={stock} iconName="inventory-2" iconColor={colors.pink.main} label="BOX" value={stock.box_number || '0'} />
                )}
                {stock.stock_type.toLowerCase() === 'pcs' && (
                    <StockDisplay stock={stock} iconName="inventory-2" iconColor={colors.purple.dark} label="PCS" value={stock.pcs_number || '0'} />
                )}
            </View>


            {/* Stock Details */}
            <View style={styles.stockDetails}>
                {stock.expiry_date && (
                    <StockCardIconText stock={stock} iconName="event" iconColor="#7f8c8d" label="Expiry:" value={new Date(stock.expiry_date).toLocaleDateString()} />
                )}
                {stock.location && (
                    <StockCardIconText stock={stock} iconName="location-on" iconColor="#7f8c8d" label="Location:" value={stock.location} />
                )}
                {stock.notes && (
                    <StockCardIconText stock={stock} iconName="note" iconColor="#7f8c8d" label="Notes:" value={stock.notes} />
                )}
                {stock.registered_date && (
                    <StockCardIconText stock={stock} iconName="calendar-today" iconColor="#7f8c8d" label="Registered:" value={new Date(stock.registered_date).toLocaleDateString()} />
                )}
            </View>
            {/**
             * label: expired? or days left
             */}
             
            {onDelete && (
                <View style={styles.deleteButtonContainer}>
                    <BasicIconButton style={styles.deleteButton} color={colors.text.inverse} icon="delete" onPress={() => onDelete(stock.stock_id)} size={24} />
                </View>
            )}
        </View>
    );
};

export default StockCard;
const styles = StyleSheet.create({

    stockCard: {
        backgroundColor: '#ffffff',
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 4,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },


    stockQuantities: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
        paddingVertical: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
    },
    stockDetails: {
        gap: 10,
    },
    deleteButtonContainer: {
        marginTop: 12,
        alignItems: 'flex-end',
    },
    deleteButton: {
        backgroundColor: colors.error.light,
        borderRadius: 8,
    },
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
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#e74c3c',
        marginTop: 16,
    },
})