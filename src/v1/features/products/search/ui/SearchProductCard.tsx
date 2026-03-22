import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Product } from '../../../../entities/products/models/types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { imgServer } from '../../../../../services/ApiService';
import { Tag } from '../../../../entities/tags/models/type';
import { ProductStock } from '../../../../entities/stocks/models/types';

interface SearchProductCardProps {
    product: Product;
    onClick?: (product: Product) => void;
}

const SearchProductCard: React.FC<SearchProductCardProps> = ({ product, onClick }) => {
    const getTotalStock = () => {
        if (!product.stock || product.stock.length === 0) return 0;
        return product.stock.reduce((total: number, stock: ProductStock) => {
            const box = parseInt(stock.box_number || '0', 10);
            const bundle = parseInt(stock.bundle_number || '0', 10);
            const pcs = parseInt(stock.pcs_number || '0', 10);
            return total + box + bundle + pcs;
        }, 0);
    };

    const displayName = product.name_kor || product.name_eng || product.name || 'No Name';
    const totalStock = getTotalStock();

    const handleClick = () => {
        if (onClick) {
            onClick(product);
        }
    };

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={handleClick}
            activeOpacity={0.7}
        >
            {/* Product Image */}
            <View style={styles.imageContainer}>
                {product.image_path ? (
                    <Image
                        source={{ uri: imgServer + product.image_path }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <Icon name="image" size={32} color="#bdc3c7" />
                    </View>
                )}
            </View>

            {/* Product Info */}
            <View style={styles.infoContainer} >
                {/* Product Name */}
                <Text style={styles.name} numberOfLines={2}>
                    {displayName}
                </Text>

                {/* Code & Barcode */}
                <View style={styles.detailsRow}>
                    <View style={styles.detailBadge}>
                        <Icon name="qr-code" size={14} color="#7f8c8d" />
                        <Text style={styles.detailText}>{product.code || 'N/A'}</Text>
                    </View>
                    <View style={styles.detailBadge}>
                        <Icon name="qr-code-scanner" size={14} color="#7f8c8d" />
                        <Text style={styles.detailText} numberOfLines={1}>
                            {product.barcode || 'N/A'}
                        </Text>
                    </View>
                </View>

                {/* Price */}
                <View style={styles.priceRow}>
                    <Text style={styles.priceText}>
                        £{product.price?.toFixed(2) || 'N/A'}
                    </Text>
                </View>

                {/* Stock Info */}
                <View style={styles.stockRow}>
                    <Icon name="inventory-2" size={16} color="#3498db" />
                    <Text style={styles.stockText}>
                        Stock: {totalStock} units
                    </Text>
                </View>

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                    <View style={styles.tagsContainer}>
                        {product.tags.slice(0, 3).map((tag: Tag, index: number) => (
                            <View key={index} style={styles.tag}>
                                <Text style={styles.tagText}>{tag.tag_name}</Text>
                            </View>
                        ))}
                        {product.tags.length > 3 && (
                            <View style={[styles.tag, styles.moreTag]}>
                                <Text style={styles.tagText}>+{product.tags.length - 3}</Text>
                            </View>
                        )}
                    </View>
                )}
            </View>

            {/* Chevron Icon */}
            <View style={styles.chevronContainer}>
                <Icon name="chevron-right" size={24} color="#bdc3c7" />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 12,
        marginHorizontal: 16,
        marginVertical: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    imageContainer: {
        width: 80,
        height: 80,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#f8f9fa',
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
    infoContainer: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 6,
    },
    detailsRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 4,
    },
    detailBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        gap: 4,
    },
    detailText: {
        fontSize: 12,
        color: '#7f8c8d',
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    priceText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#27ae60',
        marginLeft: 4,
    },
    stockRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    stockText: {
        fontSize: 13,
        color: '#3498db',
        marginLeft: 4,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
        marginTop: 4,
    },
    tag: {
        backgroundColor: '#e3f2fd',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
    },
    moreTag: {
        backgroundColor: '#ecf0f1',
    },
    tagText: {
        fontSize: 11,
        color: '#1976d2',
        fontWeight: '500',
    },
    chevronContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
});

export default SearchProductCard;