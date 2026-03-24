import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Product } from '../../models/types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { imgServer } from '../../../../../services/ApiService';

const ProductInfoPanel = ({ product }: { product: Product }) => {
    const totalStock = product.stock?.reduce((sum, stock) => {
        const box = parseInt(stock.box_number) || 0;
        const pcs = parseInt(stock.pcs_number) || 0;
        return sum + box + pcs;
    }, 0) || 0;

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                {product.image_path ? (
                    <Image
                        source={{ uri: imgServer + product.image_path }}
                        style={styles.productImage}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.placeholderImage}>
                        <Icon name="image" size={48} color="#ccc" />
                    </View>
                )}
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.productName}>{product.name}</Text>

                <View style={styles.infoRow}>
                    <Icon name="qr-code-scanner" size={16} color="#666" />
                    <Text style={styles.infoLabel}>Barcode:</Text>
                    <Text style={styles.infoValue}>{product.barcode || 'N/A'}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Icon name="tag" size={16} color="#666" />
                    <Text style={styles.infoLabel}>Product ID:</Text>
                    <Text style={styles.infoValue}>{product.product_id || 'N/A'}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Icon name="category" size={16} color="#666" />
                    <Text style={styles.infoLabel}>Code:</Text>
                    <Text style={styles.infoValue}>{product.code || 'N/A'}</Text>
                </View>
                {totalStock > 0 && (
                    <View style={styles.stockBadge}>
                        <Icon name="inventory" size={16} color="#fff" />
                        <Text style={styles.stockText}>
                            Stock: {totalStock}
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        margin: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    imageContainer: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
        marginBottom: 16,
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    placeholderImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    infoContainer: {
        gap: 12,
    },
    productName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
        fontWeight: '600',
    },
    infoValue: {
        fontSize: 14,
        color: '#333',
        flex: 1,
    },
    priceValue: {
        fontSize: 16,
        color: '#2e7d32',
        fontWeight: 'bold',
        flex: 1,
    },
    stockBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2196f3',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        alignSelf: 'flex-start',
        gap: 6,
        marginTop: 8,
    },
    stockText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default ProductInfoPanel;