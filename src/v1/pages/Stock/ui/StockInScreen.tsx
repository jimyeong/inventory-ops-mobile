import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { ROOT_PARAM_LIST } from '../../../../models/navigation';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import ProductInfoPanel from '../../../entities/products/ui/Panels/ProductInfoPanel';
import { useAuth } from '../../../../context/AuthContext';
import StockInFormWidget from '../../../widgets/stocks/ui/StockInFormWidget';

const StockInScreen = () => {
    const { product } = useRoute<RouteProp<ROOT_PARAM_LIST, 'StockIn'>>().params;
    const { userData } = useAuth();
    const navigation = useNavigation<NavigationProp<ROOT_PARAM_LIST>>();


    const handleStockInResult = async (result: { success: boolean }) => {
        if (result.success) {
            navigation.navigate('ProductDetail', {
                product_id: product.product_id, 
                product: product,
                prev_screen: 'StockIn',
                message: "Stock has been added successfully!✅",
                is_updated: true,
                event_type: "STOCK_UPDATE"
            });
        } else {
            navigation.navigate('ProductDetail', {
                product_id: product.product_id, 
                product: product,
                prev_screen: 'StockIn',
                message: "Failed to add stock!❌",
                is_updated: false,
                event_type: "STOCK_UPDATE"
            });
        }

    };

    if (!userData) {
        navigation.navigate('Login' as never);;
    }
    return (
        <ScrollView style={styles.container}>
            <ProductInfoPanel product={product} />
            <StockInFormWidget product={product} userData={userData!} handleStockInResult={handleStockInResult} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
});

export default StockInScreen;