import React, { useState, useCallback } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { ROOT_PARAM_LIST } from '../../../../models/navigation';
import Chip from '../Chips/Chip';
import { EXPIRY_RANGES, ExpiryRange } from '../../../features/expiry-stock/model/types';
import { useExpiryStockByRange } from '../../../features/expiry-stock/model/useExpiryStockByRange';
import { Product } from '../../../entities/products/models/types';
import { useExpiryProductWithStockWithLeftDays } from '../../../features/expiry-stock/model/useExpiryProductWithStock';
import ExpiryDisplayPanel from './ExpiryDisplay/ExpiryDisplayPanel';
import ExpiryTotalLabel from './ExpiryDisplay/ExpiryTotalLabel';
import { HorizontalScrollContainer } from "../../../entities/products/ui";
import { ExpiryProductManagingChips } from '../../../widgets/expiryProducts/ui';
import ExpiredProductManagerWidget from '../../../widgets/expiryProducts/ui/ExpiredProductManagerWidget';

interface ExpiryStockByRangeState {
    products: Product[];
    startDate: string;
    endDate: string;
    total: number;
    loading: boolean;
    error: string | null;
}
export default function ExpiryStockScreen() {
    const navigation = useNavigation<NavigationProp<ROOT_PARAM_LIST>>();

    return (
        <SafeAreaView style={styles.container}>
            <ExpiredProductManagerWidget />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f7fa',
    },
    
});
