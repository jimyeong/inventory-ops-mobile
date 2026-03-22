import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { itemDetailContext, ItemDetailRequestParams } from "../../ItemStockDetailScreen/contexts/ItemDetailContext";
import { ItemStock, StockType  } from "../../../models/Item";
import { View, Text, TouchableOpacity, ActivityIndicator, TextInput } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { stockOutFormStyles } from "./styles";

interface StockOutFormProps {
    item?: ItemStock;
    visible: boolean;
    onCancel: () => void;
    onSuccess: () => void;
    stockId?: number;
  }
const StockOutForm: React.FC<StockOutFormProps> = ({
    item,
    visible,
    onCancel,
    onSuccess,
    stockId,
  }) => {
    const { requestStockOut, userData } = useContext(itemDetailContext);
    const [quantity, setQuantity] = useState('1');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    // Reset form when visibility changes
    useEffect(() => {
      if (visible) {
        setQuantity('1');
        setError(null);
      }
    }, [visible]);
  
    if (!visible) return null;
  
    // Get maximum quantity available
    const getMaxQuantity = (): number => {
      if (!item) return 0;
  
      // Use boxNumber as the constraint
      return parseInt(item.box_number || '0', 10);
    };
  
    const maxQuantity = getMaxQuantity();
  
    // Validate quantity
    const validateQuantity = (value: string): string | null => {
      const numValue = parseInt(value, 10);
  
      if (isNaN(numValue)) {
        return 'Please enter a valid number';
      }
  
      if (numValue <= 0) {
        return 'Quantity must be greater than 0';
      }
  
      if (numValue > maxQuantity) {
        return `Cannot exceed available quantity (${maxQuantity})`;
      }
  
      return null;
    };
  
    const handleQuantityChange = (value: string) => {
      setQuantity(value);
      setError(null);
    };
  
    const handleSubmit = async () => {
      // Validate input
      const validationError = validateQuantity(quantity);
      if (validationError) {
        setError(validationError);
        return;
      }
  
      try { 
        setLoading(true);
        setIsSubmitting(true);
        const params:ItemDetailRequestParams = {
          stockId: item!.stock_id,
          stock: item as ItemStock,
          stock_type: item!.stock_type.toLowerCase() as StockType,
          quantity: parseInt(quantity, 10),
          userId: userData!.payload.email,
        }
        const res = await requestStockOut(params);
  // request.Stock.StockId, request.Stock.ItemId, deductedQuantity
        // Call API to perform stock out operation
  
        setLoading(false);
  
        if (res.success) {
          // Success toast would be shown by parent component
          onSuccess();
        } else {
          setError('Failed to process stock out. Please try again.');
          setIsSubmitting(false);
        }
      } catch (err) {
        setLoading(false);
        setIsSubmitting(false);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    };
  
    return (
      <View style={stockOutFormStyles.container}>
        <View style={stockOutFormStyles.formHeader}>
          <Icon name="move-to-inbox" size={20} color="#e74c3c" />
          <Text style={stockOutFormStyles.formTitle}>Stock Out</Text>
        </View>
  
        <View style={stockOutFormStyles.formRow}>
          <Text style={stockOutFormStyles.label}>Available Quantity:</Text>
          <Text style={stockOutFormStyles.value}>{maxQuantity} boxes</Text>
        </View>
  
        <View style={stockOutFormStyles.formRow}>
          <Text style={stockOutFormStyles.label}>Quantity to Remove:</Text>
          <TextInput
            style={[
              stockOutFormStyles.input,
              error ? stockOutFormStyles.inputError : null
            ]}
            value={quantity}
            onChangeText={handleQuantityChange}
            keyboardType="numeric"
            maxLength={5}
            editable={!loading}
          />
        </View>
  
        {error && (
          <View style={stockOutFormStyles.errorContainer}>
            <Icon name="error" size={16} color="#e74c3c" />
            <Text style={stockOutFormStyles.errorText}>{error}</Text>
          </View>
        )}
  
        <View style={stockOutFormStyles.buttonContainer}>
          <TouchableOpacity
            style={stockOutFormStyles.cancelButton}
            onPress={onCancel}
            disabled={loading}
          >
            <Text style={stockOutFormStyles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
  
          <TouchableOpacity
            style={[
              stockOutFormStyles.confirmButton,
              (loading || parseInt(quantity, 10) > maxQuantity) ? stockOutFormStyles.confirmButtonDisabled : null
            ]}
            onPress={handleSubmit}
            disabled={loading || parseInt(quantity, 10) > maxQuantity}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <Icon name="check" size={16} color="#ffffff" style={stockOutFormStyles.buttonIcon} />
                <Text style={stockOutFormStyles.confirmButtonText}>Confirm</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  export default StockOutForm;