import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Product } from '../../../entities/products/models/types';
import { ProductStock } from '../../../entities/stocks/models/types';
import { imgServer } from '../../../../services/ApiService';
import { StockWithPicture } from '../../../features/expiry-stock/model/types';

function getDaysToExpiry(expiryDate: Date): number {
    return Math.ceil((new Date(expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function getUrgencyStyle(days: number) {
    if (days <= 3) return styles.urgentBadge;
    if (days <= 7) return styles.criticalBadge;
    return styles.normalBadge;
}

function getQuantityLabel(stock: ProductStock): string {
    switch (stock.stock_type) {
        case 'BOX':
            return `${stock.box_number}`;
        case 'BUNDLE':
            return `${stock.bundle_number}`;
        case 'PCS':
            return `${stock.pcs_number}`;
        default:
            return '';
    }
}
interface ExpiringProductCardProps {
    currentStock: StockWithPicture;
    onPressCardHandler?: (stock: StockWithPicture) => void;
}

export default function ExpiringProductCard({ currentStock, onPressCardHandler }: ExpiringProductCardProps) {
    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.75} onPress={() => onPressCardHandler?.(currentStock)}>
            {/* Image */}
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

            {/* Details */}
            <View style={styles.details}>
                {/* Name & Price */}
                <Text style={styles.name} numberOfLines={2}>
                    {currentStock.name_kor || currentStock.name_eng || currentStock.name}
                </Text>
                <Text style={styles.code}>Code: {currentStock.code}</Text>
                <Text style={styles.price}>£{currentStock.price?.toFixed(2)}</Text>
                <View style={styles.stockInfo}>
                    {/* Expiry date */}
                    <View style={styles.infoRow}>
                        <Icon name="event" size={13} color="#7f8c8d" />
                        <Text style={styles.infoText}>
                            {new Date(currentStock.expiry_date).toLocaleDateString()}
                        </Text>
                    </View>

                    {/* Stock type & quantity */}
                    <View style={styles.infoRow}>
                        <Icon name="inventory" size={13} color="#7f8c8d" />
                        <Text style={styles.infoText}>
                            {currentStock.stock_type} · {getQuantityLabel(currentStock)}
                        </Text>
                    </View>

                    {/* Location */}
                    {currentStock.location ? (
                        <View style={styles.infoRow}>
                            <Icon name="location-on" size={13} color="#7f8c8d" />
                            <Text style={styles.infoText}>{currentStock.location}</Text>
                        </View>
                    ) : null}

                    {/* Registered person & date */}
                    <View style={styles.infoRow}>
                        <Icon name="person" size={13} color="#7f8c8d" />
                        <Text style={styles.infoText}>
                            By: {currentStock.registering_person} ·
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Icon name="calendar-today" size={13} color="#7f8c8d" />
                        <Text style={styles.infoText}>
                            Registered:
                            {currentStock.registered_date ? new Date(currentStock.registered_date).toLocaleDateString() : 'N/A'}
                        </Text>
                    </View>

                    {/* Discount */}
                    {currentStock.discount_rate > 0 && (
                        <View style={styles.discountRow}>
                            <Icon name="local-offer" size={13} color="#e74c3c" />
                            <Text style={styles.discountText}>
                                {currentStock.discount_rate}% OFF → £
                                {((currentStock.price || 0) * (1 - currentStock.discount_rate / 100)).toFixed(2)}
                            </Text>
                        </View>
                    )}

                    {/* Left days */}
                    <View style={[styles.daysBadge, ,getUrgencyStyle(getDaysToExpiry(currentStock.expiry_date))]}>
                        <Text style={[styles.daysText, getUrgencyStyle(getDaysToExpiry(currentStock.expiry_date))]}>
                            {getDaysToExpiry(currentStock.expiry_date)} day{getDaysToExpiry(currentStock.expiry_date) !== 1 ? 's' : ''} left
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 16,
        flexDirection: 'row',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
        padding: 14,
    },
    imageContainer: {
        marginRight: 14,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    imagePlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 12,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e9ecef',
        borderStyle: 'dashed',
    },
    details: {
        flex: 1,
    },
    name: {
        fontSize: 15,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 2,
    },
    code: {
        fontSize: 14,
        color: '#7f8c8d',
        marginBottom: 2,
    },
    price: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 8,
    },
    stockRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    daysBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 10,
        marginTop: 2,
    },
    normalBadge: {
        backgroundColor: '#f39c12',
    },
    criticalBadge: {
        backgroundColor: '#e74c3c',
    },
    urgentBadge: {
        backgroundColor: '#c0392b',
    },
    badgeIcon: {
        marginRight: 3,
    },
    daysText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#fff',
    },
    stockInfo: {
        flex: 1,
        gap: 3,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    infoText: {
        fontSize: 14,
        color: '#7f8c8d',
    },
    discountRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 2,
    },
    discountText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#e74c3c',
    },
});
