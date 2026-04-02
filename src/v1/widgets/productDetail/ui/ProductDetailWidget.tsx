import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Product } from '../../../entities/products/models/types';
import { ProductDetailPanel } from '../../../entities';
import StockPanel from './StockPanel';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ROOT_PARAM_LIST } from '../../../../models/navigation';
import FloatingCircleButton from '../../../shared/ui/Buttons/FloatingCircleButton';
import ProductDetailBottomBar from './ProductDetailBottomBar';
import { useAuth } from '../../../../context/AuthContext';
import { ProductStock } from '../../../entities/stocks/models/types';
import Toast from 'react-native-toast-message';
import ItemService from '../../../../services/ItemService';
import { TOAST_MESSAGE, TOAST_TYPE } from '../../../constant';
import IndicatingButton from '../../../shared/ui/Buttons/IndicatingButton';
import { stockCreateApi } from '../../../features/stocks/api/stocksApi';

type TabType = 'details' | 'stock';

interface ProductDetailWidgetProps {
    productId: string;
    product: Product;
    onRefresh?: () => Promise<void>;
}
// tag + data + list
const ProductDetailWidget = ({ productId, product, onRefresh }: ProductDetailWidgetProps) => {
    const [activeTab, setActiveTab] = useState<TabType>('details');
    const stockLength = product.stock?.length || 0;
    const totalStock = useMemo(() => stockLength, [stockLength])
    const navigation = useNavigation<NavigationProp<ROOT_PARAM_LIST>>();
    const { userData } = useAuth();

    const handleHome = () => {
        navigation.navigate('Home');
    };

    const handleCreateStock = () => {
        navigation.navigate('StockIn', { product: product });
    };

    const handleStockOut = () => {
        Alert.alert('Stock Out', 'Stock out functionality coming soon');
    };
    const handleDeleteStock = async (stockId: number) => {
        //TODO: ADD Idempotency key
        try {
            const response = await stockCreateApi.stockDelete(stockId);
            if (response.success) {
            Toast.show({
                    text1: TOAST_MESSAGE.STOCK_DELETED_SUCCESSFULLY,
                    type: TOAST_TYPE.SUCCESS,
                });
            } else {
                Toast.show({
                    text1: TOAST_MESSAGE.STOCK_DELETED_FAILED,
                    type: TOAST_TYPE.ERROR,
                });
            }
        } catch (error) {
            Toast.show({
                text1: TOAST_MESSAGE.STOCK_DELETED_FAILED,
                type: TOAST_TYPE.ERROR,
            });
        }

    };

    const handleStockUpdate = async (stock: ProductStock) => {
        //TODO: ADD Idempotency key
        stock.registering_person = userData?.payload.displayName || 'N/A';
        stock.expiry_date = stock.expiry_date;

        try {
            const response = await ItemService.updateStock(stock.stock_id, stock);
            if (response.success) {
                Toast.show({
                    text1: TOAST_MESSAGE.STOCK_UPDATED_SUCCESSFULLY,
                    type: TOAST_TYPE.SUCCESS,
                });
            }
        }
        catch (error) {
            Toast.show({
                text1: TOAST_MESSAGE.STOCK_UPDATED_FAILED,
                type: TOAST_TYPE.ERROR,
            });
        }
    };
    const handleHistory = () => {
        Alert.alert('History', 'Product history functionality coming soon');
    };
    return (
        <View style={styles.container}>
            {/* Tab Navigation */}
            <View style={styles.tabBar}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'details' && styles.activeTab]}
                    onPress={() => setActiveTab('details')}
                >
                    <Icon
                        name="info"
                        size={20}
                        color={activeTab === 'details' ? '#3498db' : '#7f8c8d'}
                    />
                    <Text style={[styles.tabText, activeTab === 'details' && styles.activeTabText]}>
                        Details
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, activeTab === 'stock' && styles.activeTab]}
                    onPress={() => setActiveTab('stock')}
                >
                    <Icon
                        name="inventory-2"
                        size={20}
                        color={activeTab === 'stock' ? '#3498db' : '#7f8c8d'}
                    />
                    <Text style={[styles.tabText, activeTab === 'stock' && styles.activeTabText]}>
                        Stock ({totalStock})
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Tab Content */}
            <View style={styles.tabContentContainer}>
                {activeTab === 'details' ? (
                    <>
                        <ProductDetailPanel productDetail={product} />
                        <IndicatingButton
                            onPress={() => { navigation.navigate('ProductInfoUpdate', { product_info: product }) }}
                            icon="edit"
                            label="Update Information"
                        />
                    </>
                ) : (
                    <StockPanel
                        onHandleStockUpdate={handleStockUpdate}
                        onHandleStockDelete={handleDeleteStock}
                        stocks={product.stock || []}
                    />
                )}
            </View>

            {/* Floating Action Button - positioned above bottom bar */}
            <FloatingCircleButton
                onPress={handleCreateStock}
                icon="add"
                style={styles.floatingButton}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#ecf0f1',
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        gap: 8,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#3498db',
    },
    tabText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#7f8c8d',
    },
    activeTabText: {
        color: '#3498db',
        fontWeight: '600',
    },
    tabContentContainer: {
        flex: 1,
    },
    floatingButton: {
        bottom: 20, // Position above the bottom bar (bottom bar height ~60-70px)
    },
});

export default ProductDetailWidget;