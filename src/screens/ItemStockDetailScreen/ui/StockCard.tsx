import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
// import { Icon } from 'react-native-vector-icons/Icon';
import Icon from 'react-native-vector-icons/MaterialIcons';
import StockOutForm from './StockOutForm';
import { ItemStock, ItemStockWithUI } from '../../../models/Item';
import { stockCardStyles } from './styles';
import { useContext, useEffect } from 'react';
import { ITEM_DETAIL_ACTION_TYPES, itemDetailContext } from '../contexts/ItemDetailContext';
import StockEditForm from './StockEditForm';
import { Item } from '../../../models/Item';
import IndicatorButton from '../../../components/Buttons/IndicatorButton';

interface StockCardProps {
    stock: ItemStockWithUI;
    styles: any;
    formatDate: (date: Date | string) => string;
    daysUntilExpiry: number | null;
    expiryInfo: {
        color: string;
        text: string;
        icon: string;
        backgroundColor: string;
    };
    isRefreshing: boolean;
    selectedItem: Item;
}
const StockCard = ({ stock, styles, formatDate, daysUntilExpiry, expiryInfo, isRefreshing, selectedItem }: StockCardProps) => {

    const price = selectedItem.price == 0 ? 'N/A' : String(selectedItem.price) + ' p/unit';
    const box_price = selectedItem.box_price == 0 ? 'N/A' : String(selectedItem.box_price) + ' p/box';
    const current_price = stock.discount_rate > 0
        ? (selectedItem.price * (1 - stock.discount_rate / 100)).toFixed(2)
        : selectedItem.price;

    const { state: stockState, dispatch: stockDispatch } = useContext(itemDetailContext);
    const handleStockOutClick = () => {
        stockDispatch({ type: ITEM_DETAIL_ACTION_TYPES.SET_STOCKOUT_INDEX, payload: { stockOutIndex: stock.stock_id, isSelectedForStockOut: true } });
    }
    const handleEditStockClick = () => {
        // stockDispatch({ type: ITEM_DETAIL_ACTION_TYPES.SET_STOCK_EDIT_FORM_VISIBLE, payload: { setStockEditFormVisible: true } });
        stockDispatch({ type: ITEM_DETAIL_ACTION_TYPES.SET_STOCK_EDITING, payload: { editingStockIndex: stock.stock_id, isSelectedForEdit: true } });
    }
    const closeEditForm = () => {
        stockDispatch({ type: ITEM_DETAIL_ACTION_TYPES.SET_STOCK_EDITING, payload: { editingStockIndex: stock.stock_id, isSelectedForEdit: false } });
    }
    const onStockOutSuccess = () => {
        stockDispatch({ type: ITEM_DETAIL_ACTION_TYPES.SET_STOCKOUT_INDEX, payload: { stockOutIndex: stock.stock_id, isSelectedForStockOut: false } });
    }
    const onCancelStockOut = () => {
        stockDispatch({ type: ITEM_DETAIL_ACTION_TYPES.SET_STOCKOUT_INDEX, payload: { stockOutIndex: stock.stock_id, isSelectedForStockOut: false } });
    }

    return (
        <View
            style={[
                styles.stockItemContainer,
                daysUntilExpiry !== null && daysUntilExpiry <= 30 ? { borderLeftWidth: 4, borderLeftColor: expiryInfo.color } : {}
            ]}
        >

            {/* Enhanced Header with Status Indicator */}
            <View style={styles.stockHeader}>
                <View style={styles.stockHeaderLeft}>
                    <View style={styles.stockIdBadge}>
                        <Icon name="qr-code" size={16} color="#ffffff" />
                        <Text style={styles.stockIdText}>#{stock.stock_id}</Text>
                    </View>
                    {stock.discount_rate > 0 && (
                        <View style={styles.discountBadge}>
                            <Icon name="percent" size={12} color="#ffffff" />
                            <Text style={styles.discountBadgeText}>{stock.discount_rate}% OFF</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.stockDate}>{formatDate(stock.registered_date)}</Text>
            </View>

            {/* Enhanced Stock Quantities */}
            <View style={styles.stockQuantitiesContainer}>
                <View style={styles.quantityCard}>
                    <View style={styles.quantityIconContainer}>
                        <Icon name="inventory" size={20} color="#ffffff" />
                    </View>
                    <Text style={styles.quantityLabel}>Box</Text>
                    <Text style={styles.quantityValue}>{stock.box_number || '0'}</Text>
                </View>

                <View style={styles.quantityCard}>
                    <View style={[styles.quantityIconContainer, { backgroundColor: '#9b59b6' }]}>
                        <Icon name="inventory" size={20} color="#ffffff" />
                    </View>
                    <Text style={styles.quantityLabel}>Bundle</Text>
                    <Text style={styles.quantityValue}>{stock.bundle_number || '0'}</Text>
                </View>

                <View style={styles.quantityCard}>
                    <View style={[styles.quantityIconContainer, { backgroundColor: '#2ecc71' }]}>
                        <Icon name="inventory-2" size={20} color="#ffffff" />
                    </View>
                    <Text style={styles.quantityLabel}>PCS</Text>
                    <Text style={styles.quantityValue}>{stock.pcs_number || '0'}</Text>
                </View>
            </View>

            {/* Enhanced Pricing Information */}
            {price !== 'N/A' && (
                <View style={styles.pricingContainer}>
                    <View style={styles.priceRow}>
                        <View style={styles.priceInfo}>
                            <Icon name="attach-money" size={18} color="#34495e" />
                            <Text style={styles.priceLabel}>Unit Price</Text>
                        </View>
                        <View style={styles.priceValueContainer}>
                            {stock.discount_rate > 0 && (
                                <Text style={styles.originalPrice}>{price}</Text>
                            )}
                            <Text style={styles.currentPrice}>
                                {stock.discount_rate > 0
                                    ? (current_price)
                                    : price
                                }
                            </Text>
                        </View>
                    </View>
                    {stock.discount_rate > 0 && (
                        <View style={styles.savingsRow}>
                            <Icon name="local-offer" size={16} color="#e74c3c" />
                            <Text style={styles.savingsText}>
                                You save {current_price} ({stock.discount_rate}%)
                            </Text>
                        </View>
                    )}
                </View>
            )}

            {/** Stock Edit Form */}
            {
                stock.isSelectedForEdit &&
                <StockEditForm
                    item={stock}
                    visible={stock.isSelectedForEdit}
                    stockId={stock.stock_id}
                />
            }
            {/* Stock Out Form */}
            {
                stock.isSelectedForStockOut &&
                <StockOutForm
                    item={stock}
                    visible={stock.isSelectedForStockOut}
                    stockId={stock.stock_id}
                    onStockOutSuccess={onStockOutSuccess}
                    onCancelStockOut={onCancelStockOut}
                />
            }

            {stock.expiry_date && (
                <View style={stockCardStyles.expiryContainer}>
                    <View style={[
                        stockCardStyles.expiryBadge,
                        { backgroundColor: daysUntilExpiry !== null && daysUntilExpiry <= 30 ? expiryInfo.backgroundColor : 'transparent' }
                    ]}>
                        <Icon name={expiryInfo.icon} size={18} color={expiryInfo.color} />
                        <Text style={[
                            styles.stockInfoText,
                            {
                                color: expiryInfo.color,
                                fontWeight: daysUntilExpiry !== null && daysUntilExpiry <= 14 ? 'bold' : 'normal',
                                marginLeft: 6
                            }
                        ]}>
                            Expires: {formatDate(stock.expiry_date)}
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
            <View style={styles.stockInfo}>
                {stock.location && (
                    <View style={styles.stockInfoItem}>
                        <Icon name="location-on" size={18} color="#f39c12" />
                        <Text style={styles.stockInfoText}>Location: {stock.location}</Text>
                    </View>
                )}
                {stock.registering_person && (
                    <View style={styles.stockInfoItem}>
                        <Icon name="account-circle" size={18} color="#1abc9c" />
                        <Text style={styles.stockInfoText}>By: {stock.registering_person}</Text>
                    </View>
                )}
            </View>
            {stock.notes && (
                <View style={styles.notesContainer}>
                    <Icon name="text-fields" size={18} color="#7f8c8d" />
                    <Text style={styles.notesText}>{stock.notes}</Text>
                </View>
            )}
            {/* Enhanced Action Buttons */}
            <View style={styles.actionButtonsContainer}>
                {!stock.isSelectedForEdit && (
                    <IndicatorButton
                        icon="pencil"
                        text="Edit"
                        onPress={handleEditStockClick}
                        disabled={isRefreshing}
                        styles={{ buttonStyle: [styles.actionButton, styles.editButton], buttonText: [styles.actionButtonText] }}
                    />
                )}
                {
                    !stock.isSelectedForStockOut &&
                    <IndicatorButton
                        styles={{ buttonStyle: [styles.actionButton, styles.stockOutButton], buttonText: [styles.actionButtonText] }}
                        onPress={handleStockOutClick}
                        disabled={isRefreshing}
                        icon="package-down"
                        text="Stock Out"
                    />
                }

            </View>
        </View>
    );
}

export default StockCard;