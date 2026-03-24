import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, SafeAreaView, ScrollView, RefreshControl } from 'react-native';
import { ROOT_PARAM_LIST } from '../../../../models/navigation';
import { RouteProp, useRoute } from '@react-navigation/native';
import ProductNotFound from '../../../entities/products/ui/ProductNotFound';
import ProductDetailWidget from '../../../widgets/productDetail/ui/ProductDetailWidget';
import Toast from 'react-native-toast-message';
import { getProductDetail } from '../apis/productDetailApis';
import { Product } from '../../../entities/products/models/types';
import { TOAST_EVENT_TYPE, TOAST_TYPE } from '../../../constant';
import { TOAST_MESSAGE } from '../../../constant';
import { useProductDetailData } from '../models/useProductDetailData';
// only routing
const ProductDetailScreen = () => {
    const route = useRoute<RouteProp<ROOT_PARAM_LIST, 'ProductDetail'>>();
    const { product: initialProduct, product_id, prev_screen: prevScreen, message, is_updated: isUpdated, event_type: eventType } = route.params;
    const { productStock } = useProductDetailData(product_id);
    const [product, setProduct] = useState<Product>(initialProduct);
    const [refreshing, setRefreshing] = useState(false);
    useFocusEffect(
        useCallback(() => {
            onRefresh();
        }, [product_id])
    )
    useEffect(() => {
        if (eventType === TOAST_EVENT_TYPE.STOCK_UPDATE) {
            Toast.show({
                text1: message,
                type: isUpdated ? TOAST_TYPE.SUCCESS : TOAST_TYPE.ERROR,
                visibilityTime: 3000,
                bottomOffset: 100,
                position: 'bottom',
            });
        }
        if (eventType === TOAST_EVENT_TYPE.PRODUCT_INFO_UPDATE) {
            Toast.show({
                text1: message,
                type: isUpdated ? TOAST_TYPE.SUCCESS : TOAST_TYPE.ERROR,
                visibilityTime: 3000,
                bottomOffset: 100,
                position: 'bottom',
            });
        }
    }, [eventType, message, isUpdated]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            const response = await getProductDetail(product.product_id);
            // get Item
            if (response.success && response.payload) {
                const _product = response.payload.products[product.product_id];
                const _stock = _product.stock || [];
                if (_product) {
                    setProduct({
                        ..._product,
                        product_id: _product.product_id, 
                        stock: [..._stock]
                    });
                    Toast.show({
                        text1: TOAST_MESSAGE.PRODUCT_REFRESHED_SUCCESSFULLY,
                        type: TOAST_TYPE.SUCCESS,
                        visibilityTime: 2000,
                        bottomOffset: 100,
                        position: 'bottom',
                    });
                } else {
                    Toast.show({
                        text1: TOAST_MESSAGE.PRODUCT_NOT_FOUND,
                        type: TOAST_TYPE.ERROR,
                        visibilityTime: 2000,
                        bottomOffset: 100,
                        position: 'bottom',
                    });
                }
            }
        } catch (error) {
            console.error('Error refreshing product:', error);
            Toast.show({
                text1: TOAST_MESSAGE.PRODUCT_REFRESHED_FAILED,
                type: TOAST_TYPE.ERROR,
                visibilityTime: 2000,
                bottomOffset: 100,
                position: 'bottom',
            });
        } finally {
            setRefreshing(false);
        }
    }, [product.product_id]);

    if (!product) {
        return (
            <SafeAreaView style={styles.container}>
                <ProductNotFound />
            </SafeAreaView>
        );
    }
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <ProductDetailWidget
                    productId={product.product_id}
                    product={product}
                    onRefresh={onRefresh}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    scrollContent: {
        flexGrow: 1,
    },
});

export default ProductDetailScreen;