import React from "react";
import { ItemStock } from "../../../models/Item";
import { useContext, useState } from "react";
import { stockCardStyles, stockItemDetailStyles, stockoutFormStyles } from "./styles";
import { itemDetailContext } from "../../ItemStockDetailScreen/contexts/ItemDetailContext";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Toast from "react-native-toast-message";
import StockOutForm from "./StockOutForm";


export interface StockCardProps {
    item: ItemStock;
    styles: any;
    formatDate: (date: Date | string) => string;
}


function StockCard({  item, styles, formatDate }: StockCardProps) {
    
    const { state, dispatch, requestStockOut, userData } = useContext(itemDetailContext);
    const { scannedItem } = state;
    const [showStockOutForm, setShowStockOutForm] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const handleStockOutClick = () => {
        setShowStockOutForm(true);
    };

    const handleCancelStockOut = () => {
        setShowStockOutForm(false);
    };

    const handleSuccessStockOut = async () => {

        // Hide the form
        setShowStockOutForm(false);

        // Show success message
        if (Toast) {
            Toast.show({
                type: 'success',
                text1: 'Stock Out Successful 👍',
                text2: 'Item has been removed from inventory',
                position: 'bottom'
            });
        }

        // Refresh stock data
        setIsRefreshing(true);
        try {
            // Here we would typically reload the current stock data
            // For example: await ItemService.getItemDetails(item.itemId)
            setIsRefreshing(false);
        } catch (error) {
            setIsRefreshing(false);
        }
    };
    // Calculate days until expiry
    const calculateDaysUntilExpiry = (expiryDate: Date | string | undefined): number | null => {
        if (!expiryDate) return null;
        
        const expiry = new Date(expiryDate);
        const today = new Date();
        
        // Reset time portion to compare just the dates
        today.setHours(0, 0, 0, 0);
        expiry.setHours(0, 0, 0, 0);
        
        const diffTime = expiry.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays;
    };

    // Get expiry status info
    const getExpiryInfo = (daysLeft: number | null) => {
        if (daysLeft === null) {
            return {
                color: '#7f8c8d',
                text: 'No expiry date',
                icon: 'calendar-blank',
                backgroundColor: 'transparent'
            };
        }
        
        if (daysLeft < 0) {
            return {
                color: '#e74c3c',
                text: `Expired ${Math.abs(daysLeft)} days ago`,
                icon: 'calendar-alert',
                backgroundColor: 'rgba(231, 76, 60, 0.1)'
            };
        }
        
        if (daysLeft <= 7) {
            return {
                color: '#e74c3c',
                text: `${daysLeft} days left`,
                icon: 'calendar-alert',
                backgroundColor: 'rgba(231, 76, 60, 0.1)'
            };
        }
        
        if (daysLeft <= 14) {
            return {
                color: '#e67e22',
                text: `${daysLeft} days left`,
                icon: 'calendar-alert',
                backgroundColor: 'rgba(230, 126, 34, 0.1)'
            };
        }
        
        if (daysLeft <= 30) {
            return {
                color: '#f39c12',
                text: `${daysLeft} days left`,
                icon: 'calendar-clock',
                backgroundColor: 'rgba(243, 156, 18, 0.1)'
            };
        }
        
        return {
            color: '#27ae60',
            text: `${daysLeft} days left`,
            icon: 'calendar-check',
            backgroundColor: 'transparent'
        };
    };

    const daysUntilExpiry = calculateDaysUntilExpiry(item.expiry_date);
    const expiryInfo = getExpiryInfo(daysUntilExpiry);
    
    return (
        <View 
            style={[
                stockItemDetailStyles.stockItemContainer, 
                daysUntilExpiry !== null && daysUntilExpiry <= 30 ? { borderLeftWidth: 4, borderLeftColor: expiryInfo.color } : {}
            ]}
        >
            <View style={stockItemDetailStyles.stockHeader}>
                <Text style={stockItemDetailStyles.stockId}>Stock ID: {item.stock_id}</Text>
                <Text style={stockItemDetailStyles.stockDate}>Registered: {formatDate(item.registered_date)}</Text>
            </View>

            <View style={stockItemDetailStyles.stockDetailsRow}>
                <View style={stockItemDetailStyles.stockIconContainer}>
                    <Icon name="inventory" size={22} color="#3498db" />
                    <Text style={stockItemDetailStyles.stockDetailText}>Box: {item.box_number || '0'}</Text>
                </View>

                <View style={stockItemDetailStyles.stockIconContainer}>
                    <Icon name="inventory" size={22} color="#9b59b6" />
                    <Text style={stockItemDetailStyles.stockDetailText}>Bundle: {item.bundle_number || '0'}</Text>
                </View>

                <View style={stockItemDetailStyles.stockIconContainer}>
                    <Icon name="inventory-2" size={22} color="#2ecc71" />
                    <Text style={stockItemDetailStyles.stockDetailText}>PCS: {item.pcs_number || '0'}</Text>
                </View>
            </View>
            {/* Stock Out Form */}
            {showStockOutForm && (
                <StockOutForm
                    item={item}
                    visible={showStockOutForm}
                    onCancel={handleCancelStockOut}
                    onSuccess={handleSuccessStockOut}
                    stockId={item.stock_id}
                />  
            )}
            {item.expiry_date && (
                <View style={stockCardStyles.expiryContainer}>
                    <View style={[
                        stockCardStyles.expiryBadge, 
                        { backgroundColor: daysUntilExpiry !== null && daysUntilExpiry <= 30 ? expiryInfo.backgroundColor : 'transparent' }
                    ]}>
                        <Icon name={expiryInfo.icon} size={18} color={expiryInfo.color} />
                        <Text style={[
                            stockItemDetailStyles.stockInfoText, 
                            { 
                                color: expiryInfo.color, 
                                fontWeight: daysUntilExpiry !== null && daysUntilExpiry <= 14 ? 'bold' : 'normal',
                                marginLeft: 6 
                            }
                        ]}>
                            Expires: {formatDate(item.expiry_date)}
                        </Text>
                    </View>
                    {daysUntilExpiry !== null && (
                        <View style={[
                            stockCardStyles.daysLeftBadge, 
                            { backgroundColor: expiryInfo.color }
                        ]}>
                            <Text style={stockCardStyles.daysLeftText}>{expiryInfo.text}</Text>
                        </View>
                    )}
                </View>
            )}

            <View style={stockItemDetailStyles.stockInfo}>
                {item.location && (
                    <View style={stockItemDetailStyles.stockInfoItem}>
                        <Icon name="location-on" size={18} color="#f39c12" />
                        <Text style={stockItemDetailStyles.stockInfoText}>Location: {item.location}</Text>
                    </View>
                )}

                {item.registering_person && (
                    <View style={stockItemDetailStyles.stockInfoItem}>
                        <Icon name="account-circle" size={18} color="#1abc9c" />
                        <Text style={stockItemDetailStyles.stockInfoText}>By: {item.registering_person}</Text>
                    </View>
                )}
            </View>

            {item.notes && (
                <View style={stockItemDetailStyles.notesContainer}>
                    <Icon name="text-fields" size={18} color="#7f8c8d" />
                    <Text style={stockItemDetailStyles.notesText}>{item.notes}</Text>
                </View>
            )}

            <TouchableOpacity
                style={stockItemDetailStyles.stockItemOutButton}
                onPress={handleStockOutClick}
                disabled={isRefreshing}
            >
                {isRefreshing ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                    <React.Fragment>
                        <Icon name="move-to-inbox" size={18} color="#ffffff" />
                        <Text style={stockItemDetailStyles.stockItemButtonText}>Stock Out</Text>
                    </React.Fragment>
                )}
            </TouchableOpacity>
        </View>
    );
}

export default StockCard;


