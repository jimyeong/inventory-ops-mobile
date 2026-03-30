import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Product } from '../../../../entities/products/models/types';
import { imgServer } from '../../../../../services/ApiService';
import { StockWithPicture } from '../../../../features/expiry-stock/model/types';
import { useNavigation } from '@react-navigation/native';
import { ROOT_PARAM_LIST } from '../../../../../models/navigation';
function getDaysPastExpiry(expiryDate: Date): number {
    return Math.floor((Date.now() - new Date(expiryDate).getTime()) / (1000 * 60 * 60 * 24));
}

interface AlreadyExpiredStockCardProps {
    currentStock: StockWithPicture;
    onPress?: (product: Product) => void;
    onUpdate?: (stock: StockWithPicture) => void;
}

const AlreadyExpiredStockCard = ({ currentStock, onPress, onUpdate }: AlreadyExpiredStockCardProps) => {
    const daysPast = getDaysPastExpiry(currentStock.expiry_date);
    const hasDiscount = currentStock.discount_rate > 0;
    const discountedPrice = (currentStock.price ?? 0) * (1 - currentStock.discount_rate / 100);
    const handleUpdate = useCallback(() => {
        onUpdate?.(currentStock);
    }, [currentStock, onUpdate]);

    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.75}>
            <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
                <Icon name="edit" size={20} color="#2980b9" />
            </TouchableOpacity>
            {/* Left: Image */}
            <View style={styles.imageContainer}>
                {currentStock.image_path ? (
                    <Image
                        source={{ uri: imgServer + currentStock.image_path }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <Icon name="image" size={32} color="#bdc3c7" />
                    </View>
                )}
            </View>

            {/* Right: Info */}
            <View style={styles.infoContainer}>
                <Text style={styles.name} numberOfLines={2}>
                    {currentStock.name_kor || currentStock.name_eng || currentStock.name || 'No Name'}
                </Text>

                <View style={styles.row}>
                    <Icon name="qr-code" size={15} color="#95a5a6" />
                    <Text style={styles.subText}>{currentStock.code}</Text>
                </View>

                <View style={styles.row}>
                    <Icon name="event" size={15} color="#95a5a6" />
                    <Text style={styles.subText}>
                        {new Date(currentStock.expiry_date).toLocaleDateString()}
                    </Text>
                </View>

                <View style={styles.footer}>
                    <View>
                        {hasDiscount ? (
                            <>
                                <Text style={styles.originalPrice}>£{currentStock.price?.toFixed(2)}</Text>
                                <Text style={styles.discountedPrice}>£{discountedPrice.toFixed(2)}</Text>
                            </>
                        ) : (
                            <Text style={styles.price}>£{currentStock.price?.toFixed(2) ?? 'N/A'}</Text>
                        )}
                    </View>
                    <View style={styles.badgeGroup}>
                        {hasDiscount && (
                            <View style={styles.discountBadge}>
                                <Text style={styles.badgeText}>{currentStock.discount_rate}% OFF</Text>
                            </View>
                        )}
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>
                                {daysPast === 0 ? 'Today' : `${daysPast}d ago`}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default AlreadyExpiredStockCard;

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 14,
        marginBottom: 2,
        borderWidth: 1,
        borderColor: '#ebebeb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
        position: 'relative',
    },
    imageContainer: {
        width: 90,
        height: 90,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#f2f3f5',
        marginRight: 14,
        flexShrink: 0,
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
    },
    infoContainer: {
        flex: 1,
        gap: 5,
    },
    name: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1a1a2e',
        lineHeight: 23,
        letterSpacing: -0.2,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    subText: {
        fontSize: 14,
        color: '#7f8c8d',
        fontWeight: '500',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 4,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#f5f5f5',
    },
    price: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1a1a2e',
    },
    originalPrice: {
        fontSize: 13,
        color: '#aab0b8',
        textDecorationLine: 'line-through',
        fontWeight: '500',
    },
    discountedPrice: {
        fontSize: 18,
        fontWeight: '800',
        color: '#e74c3c',
    },
    badgeGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    discountBadge: {
        backgroundColor: '#27ae60',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },
    badge: {
        backgroundColor: '#e74c3c',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },
    badgeText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#fff',
        letterSpacing: 0.2,
    },
    updateButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 10,
        backgroundColor: '#e8f4fd',
        borderRadius: 8,
    },
});
