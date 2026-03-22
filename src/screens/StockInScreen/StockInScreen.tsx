import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  TextInput,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import { useNavigation, useRoute, NavigationProp } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import ItemService from '../../services/ItemService';
import { Item, ItemStock } from '../../models/Item';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './ui';
import LoadingIndicator from '../../components/LoadingIndicator';
import Toast from 'react-native-toast-message';
import { ROOT_PARAM_LIST } from '../../models/navigation';

type RouteParams = {
  itemDetail: Item;
  actionType: 'IN';
};

type StockType = 'BOX' | 'BUNDLE' | 'PCS';

const discountRates = [0, 10, 20, 30, 50, 70];

// @@@ stockIN
const StockInScreen = () => {
  const navigation = useNavigation<NavigationProp<ROOT_PARAM_LIST>>();
  const route = useRoute();
  const { userData } = useAuth();
  const user = userData!.payload;
  const { itemDetail, actionType } = route.params as RouteParams;
  // Required fields
  const [stockType, setStockType] = useState<StockType>('BOX');
  const [stockNumber, setStockNumber] = useState('1');
  const [expiryDate, setExpiryDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)); // Default 30 days from now
  const [showExpiryDatePicker, setShowExpiryDatePicker] = useState(false);
  // Optional fields
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [discountRate, setDiscountRate] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  

  const onPressStockType = (type: StockType)=> {
    
    setStockType(type);
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  const handleExpiryDateChange = (event: any, selectedDate?: Date) => {
    setShowExpiryDatePicker(false);
    if (selectedDate) {
      setExpiryDate(selectedDate);
    }
  };
  const handleSubmit = async () => {

    try {
      // Validate input
      const stockNumberInt = parseInt(stockNumber || '0', 10);
      if (isNaN(stockNumberInt) || stockNumberInt <= 0) {
        setError('Please enter a valid stock number (greater than 0)');
        return;
      }

      setError(null);
      setLoading(true);

      // Get user info for registering person
      const registeringPerson = user?.displayName || user?.email || user?.uid || 'unknown'
      if (actionType === 'IN') {
        const res = await ItemService.stockIn(
          itemDetail,
          stockType,
          stockNumberInt,
          registeringPerson,
          expiryDate,
          notes,
          location,
          discountRate
        );
        if (res.success) {
          Toast.show({
            text1: 'Stock in successful 👍',
            type: 'success',
          });
        } else {
          Toast.show({
            text1: 'Stock in failed 👀',
            type: 'error',
          });
        }
      }
      setLoading(false);
      if (itemDetail.barcode) {
        navigation.navigate("ScannedItemDetail", { barcode: itemDetail.barcode });
      } else {
        navigation.navigate("ScannedItemDetail", { itemId: itemDetail.id });
      }
    } catch (error: any) {
      setLoading(false);
      setError(error.message || 'An error occurred');
      console.error('Error submitting form:', error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>
            Stock In
          </Text>

          <View style={styles.itemDetails}>
            <Text style={styles.itemName}>{itemDetail.name}</Text>
            <Text style={styles.itemBarcode}>Barcode: {itemDetail.barcode}</Text>
            <Text style={styles.itemId}>Item ID: {itemDetail.id}</Text>
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Required Information</Text>

            {/* Stock Type Selector */}
            <Text style={styles.label}>Stock Type*</Text>
            <View style={styles.stockTypeContainer}>
              {(['BOX', "PCS"] as StockType[]).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.stockTypeButton,
                    stockType === type && styles.selectedStockTypeButton
                  ]}
                  onPress={() => onPressStockType(type)}
                >
                  <Text
                    style={[
                      styles.stockTypeText,
                      stockType === type && styles.selectedStockTypeText
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Stock Number */}
            <Text style={styles.label}>Quantity*</Text>
            <TextInput
              style={styles.input}
              value={stockNumber}
              onChangeText={setStockNumber}
              keyboardType="numeric"
              placeholder="Enter quantity"
            />
            {/* Expiry Date */}
            <Text style={styles.label}>Expiry Date*</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowExpiryDatePicker(true)}
            >
              <Text style={styles.dateText}>{formatDate(expiryDate)}</Text>
              <Icon name="calendar-today" size={20} color="#3498db" />
            </TouchableOpacity>

            {showExpiryDatePicker && (
              <DateTimePicker
                value={expiryDate}
                mode="date"
                display="default"
                onChange={handleExpiryDateChange}
                minimumDate={new Date()}
              />
            )}

            <Text style={styles.sectionTitle}>Optional Information</Text>

            {/* Discount Rate */}
            <Text style={styles.label}>Discount Rate(%)</Text>
            <View style={styles.stockTypeContainer}>
              {discountRates.map((rate) => (
                <TouchableOpacity
                  key={rate}
                  style={[
                    styles.stockTypeButton,
                    discountRate === rate && styles.selectedStockTypeButton
                  ]}
                  onPress={() => setDiscountRate(discountRate === rate ? 0 : rate)}
                >
                  <Text
                    style={[
                      styles.stockTypeText,
                      discountRate === rate && styles.selectedStockTypeText
                    ]}
                  >
                    {rate}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Location */}
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="Enter storage location"
            />

            {/* Notes */}
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.notesInput]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Enter additional notes"
              multiline
            />

            {error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity
              style={[
                styles.submitButton,
                styles.stockOutButton,
                loading && styles.disabledButton,
              ]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>
                  Confirm Stock In
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};


export default StockInScreen;