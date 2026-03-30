import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import StockInputText from '../../../pages/Stock/ui/InputGroups/StockInputText';
import StockInputTextArea from '../../../pages/Stock/ui/InputGroups/StockInputTextArea';
import DatePicker from '../../../shared/ui/DatePickers/DatePicker';
import Chip from '../../../pages/Stock/Chips/Chip';
import CreateStockButton from '../../../shared/ui/Buttons/IndicatingButton';
import { NavigationProp } from '@react-navigation/native';
import { Product } from '../../../entities/products/models/types';
import { ROOT_PARAM_LIST } from '../../../../models/navigation';
import { AppUser } from '../../../../services/AuthService';
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import { StockInRequestParams, StockInResponseParams } from '../../../features/stocks/models/types';
import { stockCreateApi } from '../../../features/stocks/api/stocksApi';
import { ServiceResponse } from '../../../../services/ApiService';
import { DISCOUNT_RATES, TOAST_TYPE } from '../../../constant';
import { TOAST_MESSAGE } from '../../../constant';
const STOCK_TYPES: Array<"BOX" | "PCS"> = ["BOX", "PCS"];

interface StockInFormProps {
    product: Product;
    userData: AppUser;
    handleStockInResult: (result: { success: boolean }) => void;
}
const StockInFormWidget = ({ product, userData, handleStockInResult }: StockInFormProps) => {
    const [stockType, setStockType] = useState<"BOX" | "PCS">("BOX");
    const [quantity, setQuantity] = useState('1');
    const [expiryDate, setExpiryDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [registeringPerson, setRegisteringPerson] = useState(userData?.payload?.displayName || '');
    const [location, setLocation] = useState('');
    const [notes, setNotes] = useState('');
    const [discountRate, setDiscountRate] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const idempotencyKey = useRef<string | null>(null);


    const handleDateChange = (_event: any, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setExpiryDate(selectedDate);
        }
    };
    const validateForm = (): boolean => {
        if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) {
            Toast.show({
                type: 'error',
                text1: 'Validation Error!❌',
                text2: 'Please enter a valid quantity',
            });
            return false;
        }
        if (!registeringPerson.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Validation Error!❌',
                text2: 'Registering person is required',
            });
            return false;
        }
        return true;
    };
    const handleSubmit = async () => {
        
        if (!idempotencyKey.current) {
            idempotencyKey.current = `${Date.now()}-${Math.random().toString(36).slice(2)}`
        }
        const idempotency_key = idempotencyKey.current;
        //TODO: ADD Idempotency key
        if (!validateForm()) {
            return;
        }
        setIsLoading(true);
        const stockData: StockInRequestParams = {
            item_id: product.product_id,
            stock_type: stockType,
            quantity: Number(quantity),
            expiry_date: expiryDate,
            registering_person: registeringPerson,
            location: location,
            notes: notes,
            discount_rate: discountRate,
        };
        try {

            const response = await stockCreateApi.stockIn(stockData, idempotency_key);
            setIsLoading(false);
            console.log('response success????', response);
            if (response.success) {
                
                handleStockInResult({ success: true });
                idempotencyKey.current = null;
            } else {
                Toast.show({
                    text1: TOAST_MESSAGE.STOCK_ADDED_FAILED,
                    type: TOAST_TYPE.ERROR,
                });
            }
        } catch (err) {
            Toast.show({
                text1: TOAST_MESSAGE.STOCK_ADDED_FAILED,
                type: TOAST_TYPE.ERROR,
            });
        }

    };
    return (
        <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Stock Information</Text>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Stock Type *</Text>
                <View style={styles.chipsContainer}>
                    {STOCK_TYPES.map((type) => <Chip key={type} label={type} selected={stockType === type} onPress={() => setStockType(type)} disabled={isLoading} />)}
                </View>
            </View>

            <View style={styles.inputGroup}>
                <StockInputText
                    labelName="Quantity *"
                    value={quantity}
                    keyboardType="numeric"
                    onChangeHandler={setQuantity}
                    placeholder="Enter quantity"
                    editable={!isLoading}
                />
            </View>

            <DatePicker
                labelName="Expiry Date *"
                onPress={() => setShowDatePicker(true)}
                isLoading={isLoading}
                showDatePicker={showDatePicker}
                handleDateChange={handleDateChange}
                selectedDate={expiryDate}
                minimumDate={new Date()}
            />

            <View style={styles.inputGroup}>
                <StockInputText
                    labelName="Registering Person *"
                    value={registeringPerson}
                    keyboardType="default"
                    onChangeHandler={setRegisteringPerson}
                    placeholder="Enter registering person name"
                    editable={!isLoading}
                />
            </View>

            <View style={styles.inputGroup}>
                <StockInputText
                    labelName="Location"
                    value={location}
                    keyboardType="default"
                    onChangeHandler={setLocation}
                    placeholder="Enter storage location (optional)"
                    editable={!isLoading}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Discount Rate (%)</Text>
                <View style={styles.chipsContainer}>
                    {DISCOUNT_RATES.map((rate, idx) => <Chip key={idx} label={`${rate}%`} selected={discountRate === rate} onPress={() => setDiscountRate(rate)} disabled={isLoading} />)}
                </View>
            </View>

            <View style={styles.inputGroup}>
                <StockInputTextArea
                    labelName="Notes"
                    value={notes}
                    keyboardType="default"
                    onChangeHandler={setNotes}
                    placeholder="Enter any additional notes"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    editable={!isLoading}
                />
            </View>

            <CreateStockButton
                onPress={handleSubmit}
                loading={isLoading}
                disabled={isLoading}
                label="Add Stock"
                style={styles.submitButton}
            />
        </View>
    );
};

export default StockInFormWidget;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    formContainer: {
        padding: 16,
        backgroundColor: '#fff',
        margin: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    textArea: {
        minHeight: 100,
    },
    submitButton: {
        marginTop: 8,
        backgroundColor: '#2196f3',
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    chipSelected: {
        backgroundColor: '#2196f3',
        borderColor: '#2196f3',
    },
    chipText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    chipTextSelected: {
        color: '#fff',
        fontWeight: '600',
    },
});