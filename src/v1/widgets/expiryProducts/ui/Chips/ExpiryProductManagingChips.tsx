import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { EXPIRY_RANGES, ExpiryRange } from '../../../../features/expiry-stock/model/types';
import HorizontalScrollContainer from '../../../../entities/products/ui/HorizontalScrollContainer/HorizontalScrollContainer';
import { Chip } from '../../../../shared';
interface ExpiryProductManagingChipsProps {
    selectedRange: ExpiryRange;
    onRangePress: (range: ExpiryRange) => void;
    expiryStockByRangeLoading: boolean;
    expiredProductsLoading: boolean;
}

const ExpiryProductManagingChips = ({ selectedRange, onRangePress, expiryStockByRangeLoading, expiredProductsLoading }: ExpiryProductManagingChipsProps) => {
    return (
        <HorizontalScrollContainer>
            {EXPIRY_RANGES.map((range) => (
                <Chip 
                key={range.id} 
                label={range.label} 
                selected={selectedRange.id === range.id} 
                onPress={() => onRangePress(range)} 
                disabled={expiryStockByRangeLoading || expiredProductsLoading}
                />
            ))}
        </HorizontalScrollContainer>
    );
};

export default ExpiryProductManagingChips;