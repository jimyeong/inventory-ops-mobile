import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Item } from '../../../../../models/Item';
import { CardImageHolder } from '../../../../../components';
import { styles } from './style';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface ItemCardProps {
    ImageHolder: React.ReactNode;
    item: Item;
    handleItemInfoEdit: (item: Item) => void;
    handleItemStockEdit: (item: Item) => void;
}

const ItemCard = ({ ImageHolder, item, handleItemInfoEdit, handleItemStockEdit }: ItemCardProps) => {
    return (
        <View style={styles.itemCard}>
            {/* Left side - Image */}
            <View style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center'}}> 
                <View style={styles.imageContainer}>
                    {ImageHolder}
                </View>
            </View>
            <View style={styles.itemInfo}>
                {/* Header with name */}
                <View style={styles.itemHeader}>
                    <Text style={styles.itemName} numberOfLines={2}>
                        {item.name || 'No Name'}
                    </Text>
                </View>

                {/* Item details */}
                <View style={styles.itemDetails}>
                    <View style={styles.detailRow}>
                        <View style={styles.detailBadge}>
                            <Icon name="qr-code" size={14} color="#6c757d" />
                            <Text style={styles.detailCode}>{item.code || 'N/A'}</Text>
                        </View>
                        <View style={styles.detailBadge}>
                            <Icon name="inventory" size={14} color="#6c757d" />
                            <Text style={styles.detailType}>{item.type}</Text>
                        </View>
                    </View>

                    <View style={styles.barcodeRow}>
                        <Icon name="qr-code-scanner" size={14} color="#6c757d" />
                        <Text style={styles.barcodeText} numberOfLines={1}>
                            {item.barcode || 'No barcode'}
                        </Text>
                        <Text style={styles.barcodeText} numberOfLines={1}>
                            {item.box_barcode || 'No box barcode'}
                        </Text>
                    </View>
                    <View style={styles.priceRow}>
                        <View style={styles.priceContainer}>
                            <Icon name="attach-money" size={16} color="#0369a1" style={styles.priceIcon} />
                            <Text style={styles.priceLabel}>Unit Price</Text>
                            <Text style={styles.priceText}>{item.price || 'Not Registered'}</Text>
                        </View>
                    </View>
                    <View style={styles.priceRow}>
                        <View style={styles.priceContainer}>
                            <Icon name="inventory" size={16} color="#166534" style={styles.priceIcon} />
                            <Text style={styles.priceLabel}>Box Price</Text>
                            <Text style={styles.priceText}>{item.box_price || 'Not Registered'}</Text>
                        </View>
                    </View>

                    {/* Availability status */}
                    <View style={[
                        styles.availabilityBadge,
                        { backgroundColor: item.available_for_order ? '#d4edda' : '#f8d7da' }
                    ]}>
                        <Icon
                            name={item.available_for_order ? 'check-circle' : 'cancel'}
                            size={14}
                            color={item.available_for_order ? '#155724' : '#721c24'}
                        />
                        <Text style={[
                            styles.availabilityText,
                            { color: item.available_for_order ? '#155724' : '#721c24' }
                        ]}>
                            {item.available_for_order ? 'Available' : 'Unavailable'}
                        </Text>
                    </View>
                </View>
            </View>
            {/* Action Buttons */}
            <View style={styles.actionButtonsContainer}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.infoButton]}
                    onPress={() => handleItemInfoEdit(item)}
                >
                    <Icon name="edit" size={18} color="#ffffff" />
                    <Text style={styles.actionButtonText}>Edit Info</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.stockButton]}
                    onPress={() => handleItemStockEdit(item)}
                >
                    <Icon name="inventory-2" size={18} color="#ffffff" />
                    <Text style={[styles.actionButtonText, styles.stockButtonText]}>Edit Stock</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};

export default ItemCard;