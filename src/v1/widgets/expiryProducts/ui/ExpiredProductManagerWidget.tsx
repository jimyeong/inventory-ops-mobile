import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { EXPIRY_RANGES, ExpiryRange, StockWithPicture } from '../../../features/expiry-stock/model/types';
import { useExpiryProductWithStockWithLeftDays } from '../../../features/expiry-stock/model/useExpiryProductWithStock';
import { useExpiryStockByRange } from '../../../features/expiry-stock/model/useExpiryStockByRange';
import { ExpiryTotalLabel, ExpiryDisplayPanel } from '../../../pages/Stock/ui';
import { ExpiryProductManagingChips } from '.';
import { DeleteStockRequestPayload, expiryStockApi } from '../../../features/expiry-stock/api/expiryStockApi';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { EVENT_MESSAGE, EVENT_TYPE, SCREEN_TYPES, TOAST_MESSAGE, TOAST_TYPE } from '../../../constant';
import { useAuth } from '../../../../context/AuthContext';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ROOT_PARAM_LIST } from '../../../../models/navigation';



const ExpiredProductManagerWidget = () => {
    const initialState = {
        Expiry_Range: EXPIRY_RANGES[0],
        IsExpiredPanelOpen: true,
    }
    const [selectedRange, setSelectedRange] = useState<ExpiryRange>(initialState.Expiry_Range);
    const [isExpiredPanelOpen, setIsExpiredPanelOpen] = useState(initialState.IsExpiredPanelOpen);
    const today = new Date().toISOString().split('T')[0];
    const startDate = new Date(new Date(today).setDate(new Date(today).getDate() + selectedRange.minDays)).toISOString().split('T')[0];
    const endDate = new Date(new Date(today).setDate(new Date(today).getDate() + selectedRange.maxDays)).toISOString().split('T')[0];
    const {
        setStocksWithPictures: setExpiredProductsWithPictures,
        loading: expiredProductsLoading,
        error: expiredProductsError,
        total: expiredProductsTotal,
        refetch: refetchExpired,
        stocksWithPictures: expiredProductsWithPictures,
        products: expiredProducts,
    } = useExpiryProductWithStockWithLeftDays(-1);
    const { rangedList, loading: expiryStockByRangeLoading, error: expiryStockByRangeError, total: expiryStockByRangeTotal, refetch: refetchByRange, stocksWithPictures: expiryStockByRangeWithPictures } = useExpiryStockByRange(startDate, endDate);
    const { userData } = useAuth(); /// user id is needed
    const navigation = useNavigation<NavigationProp<ROOT_PARAM_LIST>>();
    const [refreshing, setRefreshing] = useState(false);
    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await Promise.all([refetchExpired(), refetchByRange()]);
        } finally {
            setRefreshing(false);
        }
    }, [refetchExpired, refetchByRange]);
    const handleChipPress = (range: ExpiryRange) => {
        if (range.id === "-1") setIsExpiredPanelOpen(true);
        if (range.id !== "-1") setIsExpiredPanelOpen(false);
        setSelectedRange(range);
    }
    const handleDeleteStock = async (params: DeleteStockRequestPayload, label: string) => {
        let toastMessage = label === "sold" ?
            TOAST_MESSAGE.STOCK_SOLD_SUCCESSFULLY :
            TOAST_MESSAGE.STOCK_EXPIRED_SUCCESSFULLY;
        try {
            const response = await expiryStockApi.deleteStockWithEvent(params);
            if (response.success) {
                Toast.show({
                    text1: toastMessage,
                    type: TOAST_TYPE.SUCCESS,
                });
                setExpiredProductsWithPictures(expiredProductsWithPictures.filter((product) => product.stock_id !== params.stock_id));
            } else {
                Toast.show({
                    text1: toastMessage,
                    type: TOAST_TYPE.ERROR,
                });
            }
        } catch (error) {
            Toast.show({
                text1: toastMessage,
                type: TOAST_TYPE.ERROR,
            });
        }
    }

    const handleSoldButtonPress = async (params: DeleteStockRequestPayload) => {
        await handleDeleteStock(params, "sold");
    }
    const handleExpiredButtonPress = async (params: DeleteStockRequestPayload) => {
        await handleDeleteStock(params, "expired");
    }
    const handleCardPress = (stock: StockWithPicture) => {
        const product = expiryStockByRangeWithPictures.find((product) => product.product_id === stock.product_id);
        if(product && stock.stock_id) {
            const _product = {
                ...product,
                stock: [],
                tags: [],
                barcode: '',
                type: '',
                available_for_order: false,
            }
            navigation.navigate('ProductDetail', 
                { 
                    product: _product,
                    product_id: stock.product_id, 
                    prev_screen: SCREEN_TYPES.EXPIRY_STOCK_SCREEN, 
                    message: EVENT_MESSAGE.CARD_CLICK, 
                    is_updated: false, 
                    event_type: EVENT_TYPE.CARD_CLICK 
                });
        } else {
            Toast.show({
                text1: "Product not found",
                type: TOAST_TYPE.ERROR,
            });
        }
    }
    return (
        <>
            <View style={styles.filterSection}>
                <ExpiryProductManagingChips
                    selectedRange={selectedRange}
                    onRangePress={handleChipPress}
                    expiryStockByRangeLoading={expiryStockByRangeLoading}
                    expiredProductsLoading={expiredProductsLoading}
                />
            </View>
            <ExpiryTotalLabel
                total={isExpiredPanelOpen ? expiredProductsWithPictures.length : expiryStockByRangeWithPictures.length}
                label={isExpiredPanelOpen ? "Expired" : selectedRange.label}
                isExpiredPanelOpen={isExpiredPanelOpen}
            />
            <ExpiryDisplayPanel
                onCardPressHandler={handleCardPress}
                onSoldButtonPress={handleSoldButtonPress}
                onExpiredButtonPress={handleExpiredButtonPress}
                selectedChipId={selectedRange.id}
                expiredProducts={expiredProductsWithPictures}
                expiryRangeList={expiryStockByRangeWithPictures}
                expiredProductLoading={expiredProductsLoading}
                expiredProductError={expiredProductsError}
                expiredProductTotal={expiredProductsTotal}
                expiryStockByRangeLoading={expiryStockByRangeLoading}
                expiryStockByRangeError={expiryStockByRangeError}
                expiryStockByRangeTotal={expiryStockByRangeTotal}
                onRefresh={handleRefresh}
                refreshing={refreshing}
            />
        </>
    );
};

export default ExpiredProductManagerWidget;

const styles = StyleSheet.create({

    filterSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },

});