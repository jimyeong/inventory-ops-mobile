import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import { ProductStock } from '../../models/types';


import { colors, spacing, borderRadius, shadows, chips } from '../../../../shared/theme/token';
import StockHeader from './StockHeader';
import StockDisplay from '../StockCounter/StockDisplay';
import StockCardIconText from './StockCardIconText';
import DatePicker from '../../../../shared/ui/DatePickers/DatePicker';
import Chip from '../../../../pages/Stock/Chips/Chip';
import { DISCOUNT_RATES } from '../../../../constant';
import FormLabelText from '../../../../shared/ui/Text/FormLabelText/FormLabelText';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BasicIconButton from '../../../../shared/ui/Buttons/BasicIconButton';
import Button from '../../../../shared/ui/Buttons/IndicatingButton';
import { StockType } from '../../../../../models/Item';

interface EditableStockCardProps {
    stock: ProductStock;
    index: number;
    isEditing: boolean;
    onHandleStockUpdate?: (updatedStock: ProductStock) => void;
    onInit?: (stock_id: number) => void;
}


const EditableStockCard = ({ stock, index, onHandleStockUpdate, onInit }: EditableStockCardProps) => {
    const [stockType, setStockType] = useState(stock.stock_type);
    let stockNumber = 0;
    if (stockType.toLowerCase() === 'box') {
        stockNumber = Number(stock.box_number) || 0;
    } else if (stockType.toLowerCase() === 'pcs') {
        stockNumber = Number(stock.pcs_number) || 0;
    } else if (stockType.toLowerCase() === 'bundle') {
        stockNumber = Number(stock.bundle_number) || 0;
    }
    const [stockValue, setStockValue] = useState(stockNumber);
    const [expiryDate, setExpiryDate] = useState(new Date(stock.expiry_date));
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [location, setLocation] = useState(stock.location || '');
    const [notes, setNotes] = useState(stock.notes || '');
    const [discountRate, setDiscountRate] = useState<number>(stock.discount_rate || 0);

    const handleDateChange = (_event: any, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setExpiryDate(selectedDate);
        }
    };


    const handleSave = () => {
        const updatedStock: Partial<ProductStock> = {
            stock_id: stock.stock_id,
            expiry_date: expiryDate,
            location: location,
            notes: notes,
            discount_rate: discountRate,
            registered_date: new Date(),
            stock_type: stockType.toUpperCase() as StockType,

        };
        let key = ''
        if (stockType.toUpperCase() === 'BOX') {
            key = 'box_number';
        } else if (stockType.toUpperCase() === 'PCS') {
            key = 'pcs_number';
        } else if (stockType.toUpperCase() === 'BUNDLE') {
            key = 'bundle_number';
        }
        // to server, we need to send the stock value as a int
        (updatedStock as any)[key] = Number(stockValue);
        if (onHandleStockUpdate) {
            onHandleStockUpdate(updatedStock as ProductStock);
        }
        if (onInit) {
            onInit(stock.stock_id);
        }
    };
    if (true) {
        return (

            <View key={stock.stock_id || index} style={styles.stockCard}>
                {/* Stock Header */}
                <StockHeader stock={stock} />

                {/* Stock Quantities */}
                <View>
                    <FormLabelText label="Stock Quantities" />
                    <View style={styles.stockQuantities}>

                        {stock.stock_type.toUpperCase() === 'BOX' && (
                            <StockDisplay stock={stock} iconName="inventory-2" iconColor={colors.pink.main} label="BOX" value={stockValue.toString() || '0'} />
                        )}
                        {stock.stock_type.toUpperCase() === 'PCS' && (
                            <StockDisplay stock={stock} iconName="inventory-2" iconColor={colors.purple.dark} label="PCS" value={stockValue.toString() || '0'} />
                        )}
                        <View style={{ flexDirection: 'row', gap: 10, display: 'flex', justifyContent: 'center', }}>
                            <BasicIconButton icon="arrow-drop-down" onPress={() => setStockValue((prev)=> prev - 1 >= 0 ? prev - 1 : 0)} size={40} color={colors.text.primary} rotation={0} />
                            <BasicIconButton icon="arrow-drop-up" onPress={() => setStockValue(stockValue + 1)} size={40} color={colors.text.primary} rotation={0} />
                        </View>
                    </View>

                </View>
                <View style={styles.datePickerContainer}>
                    <DatePicker labelName="Expiry Date" onPress={() => setShowDatePicker(true)} isLoading={false} showDatePicker={showDatePicker} handleDateChange={handleDateChange} selectedDate={expiryDate} minimumDate={new Date()} />
                </View>
                <View>
                    <FormLabelText label="Discount Rate (%)" />
                    <View style={styles.discountChipsContainer}>
                        {DISCOUNT_RATES.map((rate) => (
                            <Chip key={rate} label={`${rate}%`} selected={discountRate === rate} onPress={() => setDiscountRate(rate)} />
                        ))}
                    </View>
                </View>

                {/* Stock Details */}
                <View style={styles.stockDetails}>
                    <FormLabelText label="Registered by: " />
                    <Text>{stock.registering_person || 'N/A'}</Text>
                </View>
                <View style={styles.stockDetails}>
                    <Button onPress={handleSave} label="Save" icon="save" style={styles.saveButton} />
                    
                </View>
            </View>
        )
    }
};

const styles = StyleSheet.create({
    discountChipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    datePickerContainer: {
        marginBottom: 16,
    },
    discountChipsLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#7f8c8d',
        marginBottom: 8,
    },
    stockCard: {
        backgroundColor: '#ffffff',
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 4,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    stockQuantities: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
        paddingVertical: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
    },
    stockDetails: {
        display: 'flex',
        marginTop: 24,
        gap: 10,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    stockDetailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stockDetailLabel: {
        fontSize: 13,
        fontWeight: '500',
        color: '#7f8c8d',
        width: 90,
    },
    stockDetailValue: {
        flex: 1,
        fontSize: 14,
        color: '#2c3e50',
        fontWeight: '500',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#e74c3c',
        marginTop: 16,
    },
    saveButton: {
        backgroundColor: colors.secondary.dark,
        borderRadius: 8,
        padding: 10,
        width: '100%',
    },
    saveButtonText: {
        color: colors.success.contrast,
    },
})

export default EditableStockCard;

