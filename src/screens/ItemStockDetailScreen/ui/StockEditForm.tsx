import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, TextInput, Alert, Platform, StyleProp, ViewStyle, TextStyle } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ItemStock } from '../../../models/Item';
import { stockEditFormStyles } from './styles';
import ItemService from '../../../services/ItemService';
import { ITEM_DETAIL_ACTION_TYPES, itemDetailContext } from '../contexts/ItemDetailContext';
import Toast from 'react-native-toast-message';
import IconButton from '../../../components/Buttons/IconButton';
import { IndicatorButton } from '../../../components';

interface StockEditFormProps {
    item: ItemStock;
    visible: boolean;
    stockId: number;
}

const discountRates = [0, 10, 20, 30, 50, 70];

const StockEditForm: React.FC<StockEditFormProps> = ({
    item,
    visible,
    stockId,
}) => {
    const { dispatch, getItemById } = useContext(itemDetailContext);
    const onCancel = () => {
        dispatch({ type: ITEM_DETAIL_ACTION_TYPES.SET_STOCK_EDITING, payload: { editingStockIndex: stockId, isSelectedForEdit: false } });
    }
    const onSuccess = () => {
        dispatch({ type: ITEM_DETAIL_ACTION_TYPES.SET_STOCK_EDITING, payload: { editingStockIndex: stockId, isSelectedForEdit: false } });
        // re-fetch the item
        getItemById(item.item_id);
    }

    const [discountRate, setDiscountRate] = useState(item.discount_rate || 0);
    const [expiryDate, setExpiryDate] = useState(item.expiry_date ? new Date(item.expiry_date) : null);
    const [location, setLocation] = useState(item.location || '');
    const [notes, setNotes] = useState(item.notes || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Reset form when visibility or item changes
    useEffect(() => {
        if (visible && item) {
            setDiscountRate(item.discount_rate || 0);
            setExpiryDate(item.expiry_date ? new Date(item.expiry_date) : null);
            setLocation(item.location || '');
            setNotes(item.notes || '');
            setError(null);
        }
    }, [visible, item]);
    if (!visible) return null;
    const handleDiscountRateSelect = (rate: number) => {
        setDiscountRate(rate);
        setError(null);
    };

    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };
    const handleDatePress = () => {
        setShowDatePicker(true);
    };
    const onDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || expiryDate;
        setShowDatePicker(Platform.OS === 'ios');
        setExpiryDate(currentDate);
    };
    const handleSubmit = async () => {
        try {
            setLoading(true);
            const updateData: {
                discount_rate?: number;
                expiry_date?: Date ;
                location?: string;
                notes?: string;
            } = {};
            updateData.discount_rate = discountRate;
            updateData.expiry_date = expiryDate as Date;
            updateData.location = location;
            updateData.notes = notes;
            const response = await ItemService.updateStock(stockId, updateData);
            setLoading(false);
            if (response.success) {
                Toast.show({
                    text1: 'Stock updated successfully',
                    type: 'success',
                });
                onSuccess();
            } else {
                Toast.show({
                    text1: 'Failed to update stock. Please try again.',
                    type: 'error',
                });
            }
        } catch (err) {
            setLoading(false);
            Toast.show({
                text1: 'An unknown error occurred',
                type: 'error',
            });
        }
    };
    return (
        <View style={stockEditFormStyles.container}>
            <View style={stockEditFormStyles.formHeader}>
                <Icon name="edit" size={20} color="#3498db" />
                <Text style={stockEditFormStyles.formTitle}>Edit Stock Information</Text>
            </View>

            {/* Discount Rate */}
            <View style={stockEditFormStyles.formColumn}>
                <Text style={stockEditFormStyles.label}>Discount Rate (%)</Text>
                <View style={stockEditFormStyles.discountChipsContainer}>
                    {discountRates.map((rate) => (
                        <TouchableOpacity
                            key={rate}
                            style={[
                                stockEditFormStyles.discountChip,
                                discountRate === rate && stockEditFormStyles.discountChipSelected
                            ]}
                            onPress={() => handleDiscountRateSelect(rate)}
                            disabled={loading}
                        >
                            <Text style={[
                                stockEditFormStyles.discountChipText,
                                discountRate === rate && stockEditFormStyles.discountChipTextSelected
                            ]}>
                                {rate}%
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Expiry Date */}
            <View style={stockEditFormStyles.formColumn}>
                <Text style={stockEditFormStyles.label}>Expiry Date</Text>
                <TouchableOpacity 
                    style={stockEditFormStyles.dateInput}
                    onPress={handleDatePress}
                    disabled={loading}
                >
                    <Text style={[
                        stockEditFormStyles.dateText,
                        !expiryDate ? stockEditFormStyles.datePlaceholder : null
                    ]}>
                        {expiryDate ? formatDate(expiryDate) : 'Select expiry date'}
                    </Text>
                    <Icon name="event" size={20} color="#7f8c8d" />
                </TouchableOpacity>
            </View>

            {/* Location */}
            <View style={stockEditFormStyles.formColumn}>
                <Text style={stockEditFormStyles.label}>Location</Text>
                <TextInput
                    style={stockEditFormStyles.input}
                    value={location}
                    onChangeText={setLocation}
                    placeholder="Storage location"
                    editable={!loading}
                />
            </View>
            {/* Notes */}
            <View style={stockEditFormStyles.formColumn}>
                <Text style={stockEditFormStyles.label}>Notes</Text>
                <TextInput
                    style={[stockEditFormStyles.input, { height: 60 }]}
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="Additional notes"
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    editable={!loading}
                />
            </View>
            {error && (
                <View style={stockEditFormStyles.errorContainer}>
                    <Icon name="error" size={16} color="#e74c3c" />
                    <Text style={stockEditFormStyles.errorText}>{error}</Text>
                </View>
            )}
            <View style={stockEditFormStyles.buttonContainer}>
                {/** TODO BUTTON SIZE CHANGE, MODULATE BUTTONS */}
                <TouchableOpacity
                    style={stockEditFormStyles.cancelButton}
                    onPress={onCancel}
                    disabled={loading}
                >
                    <Text style={stockEditFormStyles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <IndicatorButton
                    icon="check"
                    text="Update Stock"
                    onPress={handleSubmit}
                    styles={{buttonStyle: stockEditFormStyles.confirmButton as unknown as StyleProp<ViewStyle>[], buttonText: stockEditFormStyles.confirmButtonText as unknown as StyleProp<TextStyle>[]}}
                    disabled={loading}
                />
            </View>

            {/* Date Picker */}
            {showDatePicker && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={expiryDate || new Date()}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={onDateChange}
                />
            )}
        </View>
    );
};

export default StockEditForm;