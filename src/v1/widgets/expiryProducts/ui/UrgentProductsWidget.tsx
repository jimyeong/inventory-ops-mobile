import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useExpiredProductsData } from '../../../features/product-expiring/model/useExpiredProducts';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { ROOT_PARAM_LIST } from '../../../../models/navigation';
import { HorizontalScrollViewHeader } from '../../../shared';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NoProblemUI } from '../../../shared';
import { Product } from '../../../entities/products/models/types';
import UrgentProductCard from '../../../entities/products/ui/Card/UrgentProductCard';
import { useUrgentProductsData } from '../../../features/product-expiring/model/useUrgentProducts';



// within 7 days, adjust useUrgentProductsData to use the daysLeft parameter
const UrgentProductsWidget = ({ refreshTrigger }: { refreshTrigger?: number }) => {
    const { urgetProductList, loading, error } = useUrgentProductsData(refreshTrigger);
    const navigation = useNavigation<NavigationProp<ROOT_PARAM_LIST>>();
    if (loading) {
        return (
            <View style={styles.container}>
                <HorizontalScrollViewHeader title="Urgent Products" count={0} Icon={<Icon name="alarm" size={20} color="#e74c3c" />} />
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            </View>
        );
    }

        if (urgetProductList?.total === 0) {
        return (
            <View style={styles.container}>
                <HorizontalScrollViewHeader title="Urgent Products" count={0} Icon={<Icon name="alarm" size={20} color="#e74c3c" />} />
                <NoProblemUI title="No urgent products" message="All products are fresh!" />
            </View>
        );
    }

    const handleProductPress = (product: Product) => {
        navigation.navigate('ProductDetail', { product_id: product.product_id, product: product });
    };
    return (
        <View style={styles.container}>
            {/* Header */}
            <HorizontalScrollViewHeader title="Urgent Products(within 7 days)" count={urgetProductList?.total || 0} Icon={<Icon name="alarm" size={20} color="#e74c3c" />} />

            {/* Horizontal Scroll */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {urgetProductList?.expiring_products.map((product: Product, index: number) => (
                    <UrgentProductCard
                        key={product.product_id || index}
                        product={product}
                        onPress={handleProductPress}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ecf0f1',
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 12,
    },
    card: {
        width: 160,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#ecf0f1',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    imageContainer: {
        width: '100%',
        height: 120,
        backgroundColor: '#f8f9fa',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imagePlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ecf0f1',
    },
    expiredBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#e74c3c',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    expiredText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#ffffff',
    },
    loadingContainer: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 14,
        color: '#95a5a6',
    },
});


export default UrgentProductsWidget;