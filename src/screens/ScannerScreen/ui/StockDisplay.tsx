import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ListRenderItem, Image, ImageStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ItemStock, Item } from '../../../models/Item';
import { imgServer } from '../../../services/ApiService';

interface StockDisplayProps {
    styles: StyleSheet.NamedStyles<any>;
    scannedItem: Item;
    stock: ItemStock[];
    renderStockItem: ListRenderItem<ItemStock>;
    handleStockIn: () => void;
    handleStockOut: () => void;
    handleScanAgain: () => void;
}


const StockDisplay = ({ scannedItem, styles, stock, renderStockItem, handleStockIn, handleStockOut, handleScanAgain }: StockDisplayProps) => {
    
    styles.itemImage = styles.itemImage || { width: 80, height: 80, borderRadius: 8, marginRight: 15 }
    return (<View style={styles.itemContainer}>
        <View style={styles.itemDetails}>
            <View style={styles.itemHeaderRow || { flexDirection: 'row', marginBottom: 15 }}>
                {scannedItem.image_path ? (
                    <Image
                        source={{ uri: imgServer + scannedItem.image_path }}
                        style={styles.itemImage as ImageStyle}
                        resizeMode="contain"
                    />
                ) : (
                    <View style={styles.placeholderImage || {
                        width: 80,
                        height: 80,
                        borderRadius: 8,
                        backgroundColor: '#f0f0f0',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 15
                    }}>
                        <Icon name="hide-image" size={30} color="#bdc3c7" />
                    </View>
                )}
                <View style={styles.itemHeaderInfo || { flex: 1, justifyContent: 'center' }}>
                    <Text style={styles.itemName}>{scannedItem.name}</Text>
                    <Text style={styles.itemBarcode}>Barcode: {scannedItem.barcode}</Text>
                </View>
            </View>
            {/* Stock listing section */}
            <View>
                <View style={styles.stockSectionHeader}>
                    <Icon name="assignment" size={20} color="#34495e" />
                    <Text style={styles.stockSectionTitle}>Current Stock</Text>
                </View>
                <FlatList
                    style={styles.stockContainer}
                    data={scannedItem.stock}
                    renderItem={renderStockItem}
                    keyExtractor={(item) => item.stock_id.toString()}
                    ListEmptyComponent={
                        <View style={styles.emptyStockContainer}>
                            <Icon name="remove-shopping-cart" size={40} color="#bdc3c7" />
                            <Text style={styles.emptyStockText}>No stock information available</Text>
                        </View>
                    }
                    showsVerticalScrollIndicator={true}
                />
            </View>
        </View>

        <View style={styles.buttonsContainer}>
            <TouchableOpacity
                style={[styles.actionButton, styles.stockInButton, { flex: 1, justifyContent: "center", flexDirection: "row" }]}
                onPress={handleStockIn}
            >
                <Icon name="unarchive" size={18} color="#ffffff" style={{ marginRight: 6 }} />
                <Text style={styles.buttonText}>Stock In</Text>
            </TouchableOpacity>
        </View>

        <TouchableOpacity
            style={styles.scanAgainButton}
            onPress={handleScanAgain}
        >
            <Text style={styles.buttonText}>Scan Another Item</Text>
        </TouchableOpacity>
    </View>
    );
};

export default StockDisplay;