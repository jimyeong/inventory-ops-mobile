import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Switch,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
} from 'react-native';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import { Item } from '../models/Item';
import { ROOT_PARAM_LIST } from '../models/navigation';
import ItemService from '../services/ItemService';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';
import { imgServer } from '../services/ApiService';
import BarcodeReader from '../components/BarcodeReader/BarcodeReader';
import Toast from 'react-native-toast-message';


const EditItemScreen = () => {

const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
const [scannerTarget, setScannerTarget] = useState<'barcode' | 'box_barcode'>('barcode');

  const navigation = useNavigation<NavigationProp<ROOT_PARAM_LIST>>();
  const route = useRoute<RouteProp<ROOT_PARAM_LIST, 'ItemDetailEdit'>>();
  const { itemId, item: itemFromRoute } = route.params;
  const { userData: user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [item, setItem] = useState<Partial<Item>>({
    id: itemId,
    code: '',
    barcode: '',
    barcode_for_box: '',
    name: '',
    name_kor: '',
    name_eng: '',
    name_chi: '',
    name_jap: '',
    type: 'PCS',
    available_for_order: true,
    image_path: '',
    ingredients: '',
    has_beef: false,
    has_pork: false,
    is_halal: false,
    reasoning: '',
  });

  // Error states
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Refs for fields
  const barcodeInputRef = useRef<TextInput>(null);
  const nameInputRef = useRef<TextInput>(null);

  useEffect(() => {
    fetchItemDetails();
  }, [itemId]);

  // Handle scanner results when returning from Scanner screen  
  useEffect(() => {
    if (route.params?.barcode && route.params.barcode !== item.barcode) {
      handleInputChange('barcode', route.params.barcode);
    }
    if (route.params?.box_barcode && route.params.box_barcode !== item.barcode_for_box) {
      handleInputChange('barcode_for_box', route.params.box_barcode);
    }
  }, [route.params?.barcode, route.params?.box_barcode, item.barcode, item.barcode_for_box]);

  const handleBarcodeScanned = (scannedCode: string) => {
    if (scannerTarget === 'barcode') {
      handleInputChange('barcode', scannedCode);
    } else if (scannerTarget === 'box_barcode') {
      handleInputChange('barcode_for_box', scannedCode);
    }
    setShowBarcodeScanner(false);
  };

  const handleCloseBarcodeScanner = () => {
    setShowBarcodeScanner(false);
  };

  const handleScanBarcode = () => {
    setScannerTarget('barcode');
    setShowBarcodeScanner(true);
  };

  const handleScanBoxBarcode = () => {
    setScannerTarget('box_barcode');
    setShowBarcodeScanner(true);
  };


  const fetchItemDetails = async () => {
    try {
      setLoading(true);
      
      if (itemId) {
        const itemData = await ItemService.getItemById(itemId);
        
        // Set the form fields with the item data
        if(itemData.success) {
          setItem({
            id: itemData.payload.id,
            code: itemData.payload.code || '',
            barcode: itemData.payload.barcode || '',
            barcode_for_box: itemData.payload.barcode_for_box || '',
            name: itemData.payload.name || '',
            name_kor: itemData.payload.name_kor || '',
            name_eng: itemData.payload.name_eng || '',
            name_chi: itemData.payload.name_chi || '',
            name_jap: itemData.payload.name_jap || '',
            type: itemData.payload.type || 'PCS',
            available_for_order: itemData.payload.available_for_order !== undefined ? itemData.payload.available_for_order : true,
            image_path: itemData.payload.image_path || '',
            ingredients: itemData.payload.ingredients || '',
            has_beef: itemData.payload.has_beef || false,
            has_pork: itemData.payload.has_pork || false,
            is_halal: itemData.payload.is_halal || false,
            reasoning: itemData.payload.reasoning || '',
          });
        }
      }
    } catch (error) {
      console.error('Error fetching item:', error);
      Alert.alert('Error', 'Failed to load item details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Required fields validation
    if (!item.code?.trim()) {
      newErrors.code = 'Code is required';
    }
    
    if (!item.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof Item, value: string | boolean) => {
    setItem({
      ...item,
      [field]: value,
    });
    
    // Clear error if field has value
    if (errors[field as string] && typeof value === 'string' && value.trim()) {
      setErrors({ ...errors, [field]: '' });
    }
  };


  const handleFilloutWithAI = async () => {
    if (!item.barcode?.trim()) {
      Alert.alert('Error', 'Please enter a barcode first to use AI fillout.');
      return;
    }

    try {
      setAiLoading(true);
      const response = await ItemService.filloutWithAI(item.barcode);
      
      if (response.success) {
        const aiData = response.payload;
        setItem(prev => ({
          ...prev,
          name_kor: aiData.name_kor || prev.name_kor,
          name_eng: aiData.name_eng || prev.name_eng,
          name_chi: aiData.name_chi || prev.name_chi,
          name_jap: aiData.name_jpn || prev.name_jap,
          ingredients: aiData.ingredients || prev.ingredients,
          is_halal: aiData.halal !== undefined ? aiData.halal : prev.is_halal,
          has_beef: aiData.beef !== undefined ? aiData.beef : prev.has_beef,
          has_pork: aiData.pork !== undefined ? aiData.pork : prev.has_pork,
          reasoning: aiData.reasoning || prev.reasoning,
        }));
        Alert.alert('Success', 'Item information filled out with AI!');
      } else {
        Alert.alert('Error', 'Failed to get AI information.');
      }
    } catch (error) {
      console.error('Error with AI fillout:', error);
      Alert.alert('Error', 'Failed to get AI information. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }
    
    try {
      setSaving(true);
      
      // Prepare only fields that should be submitted (exclude null/undefined)
      const itemToSubmit = Object.fromEntries(
        Object.entries(item).filter(([_, value]) => value !== null && value !== undefined)
      );
      
      // Create or update the item
      // if (itemId) {
      //   await ItemService.updateItem(itemToSubmit as Partial<Item>);
      //   Alert.alert('Success', 'Item updated successfully!');
      // } else {
      //   await ItemService.registerItem(itemToSubmit as Item);
      //   Alert.alert('Success', 'Item created successfully!');
      // }

      const response = await ItemService.updateItem(itemToSubmit as Partial<Item>);
      if (response.success) {
        Toast.show({
          type: 'success',
          text1: 'Item updated successfully!✅',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed to update item. Please try again.❌',
        });
      }
      
      navigation.goBack();
    } catch (error) {
      console.error('Error saving item:', error);
      Alert.alert('Error', 'Failed to save item. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading item details...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Icon name="edit" size={24} color="#3498db" />
          <Text style={styles.headerText}>
            {itemId ? 'Edit Item' : 'Create Item'}
          </Text>
        </View>

        {/* AI Fillout Button */}
        <View style={styles.aiButtonContainer}>
          <TouchableOpacity
            style={[styles.aiButton, aiLoading && styles.disabledButton]}
            onPress={handleFilloutWithAI}
            disabled={aiLoading || !item.barcode?.trim() || !item.barcode_for_box?.trim()}
          >
            {aiLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Icon name="auto-fix-high" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                <Text style={styles.aiButtonText}>Fillout with AI</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
        
        {/* Essential Fields Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Essential Information</Text>
          <View style={styles.card}>
            {/* Barcode Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Barcode</Text>
              <View style={styles.barcodeContainer}>
                <TextInput
                  ref={barcodeInputRef}
                  style={[
                    styles.input, 
                    styles.barcodeInput
                  ]}
                  value={item.barcode}
                  onChangeText={(value) => handleInputChange('barcode', value)}
                  placeholder="Enter barcode"
                  keyboardType="number-pad"
                />
                <TouchableOpacity 
                  style={styles.scanButton}
                  onPress={handleScanBarcode}
                >
                  <Icon name="qr-code-scanner" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Barcode for Box Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Barcode for Box</Text>
              <View style={styles.barcodeContainer}>
                <TextInput
                  style={[styles.input, styles.barcodeInput]}
                  value={item.barcode_for_box}
                  onChangeText={(value) => handleInputChange('barcode_for_box', value)}
                  placeholder="Enter box barcode"
                  keyboardType="number-pad"
                />
                <TouchableOpacity 
                  style={styles.scanButton}
                  onPress={handleScanBoxBarcode}
                >
                  <Icon name="qr-code-scanner" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Code Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Code*</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.code ? styles.inputError : null
                ]}
                value={item.code}
                onChangeText={(value) => handleInputChange('code', value)}
                placeholder="Enter item code"
              />
              {errors.code ? (
                <Text style={styles.errorText}>{errors.code}</Text>
              ) : null}
            </View>

            {/* Name Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name*</Text>
              <TextInput
                ref={nameInputRef}
                style={[
                  styles.input,
                  errors.name ? styles.inputError : null
                ]}
                value={item.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholder="Enter item name"
              />
              {errors.name ? (
                <Text style={styles.errorText}>{errors.name}</Text>
              ) : null}
            </View>

            {/* Type Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Item Type*</Text>
              <View style={styles.typeContainer}>
                {['PCS', 'BOX'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeButton,
                      item.type === type && styles.selectedTypeButton
                    ]}
                    onPress={() => handleInputChange('type', type)}
                  >
                    <Text 
                      style={[
                        styles.typeButtonText,
                        item.type === type && styles.selectedTypeButtonText
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Additional Fields Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          <View style={styles.card}>
            {/* Ingredients Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ingredients</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={item.ingredients}
                onChangeText={(value) => handleInputChange('ingredients', value)}
                placeholder="Enter ingredients"
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Dietary Information */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Dietary Information</Text>
              
              <View style={styles.switchRow}>
                <Text style={styles.switchRowLabel}>Contains Beef:</Text>
                <Switch
                    value={!!item.has_beef}
                  onValueChange={(value) => handleInputChange('has_beef', value)}
                  trackColor={{ false: '#d1d1d1', true: '#e74c3c' }}
                  thumbColor={!!item.has_beef ? '#c0392b' : '#f4f3f4'}
                />
              </View>

              <View style={styles.switchRow}>
                <Text style={styles.switchRowLabel}>Contains Pork:</Text>
                <Switch
                  value={!!item.has_pork}
                  onValueChange={(value) => handleInputChange('has_pork', value)}
                  trackColor={{ false: '#d1d1d1', true: '#e74c3c' }}
                  thumbColor={!!item.has_pork ? '#c0392b' : '#f4f3f4'}
                />
              </View>

              <View style={styles.switchRow}>
                <Text style={styles.switchRowLabel}>Halal Certified:</Text>
                <Switch
                  value={!!item.is_halal}
                  onValueChange={(value) => handleInputChange('is_halal', value)}
                  trackColor={{ false: '#d1d1d1', true: '#27ae60' }}
                  thumbColor={!!item.is_halal ? '#2ecc71' : '#f4f3f4'}
                />
              </View>
            </View>

            {/* Reasoning Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Reasoning</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={item.reasoning}
                onChangeText={(value) => handleInputChange('reasoning', value)}
                placeholder="Enter reasoning for dietary classifications"
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Available For Order Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Available For Order</Text>
              <View style={styles.switchContainer}>
                <Switch
                  value={!!item.available_for_order}
                  onValueChange={(value) => handleInputChange('available_for_order', value)}
                  trackColor={{ false: '#d1d1d1', true: '#81b0ff' }}
                  thumbColor={!!item.available_for_order ? '#3498db' : '#f4f3f4'}
                />
                <Text style={styles.switchLabel}>
                  {!!item.available_for_order ? 'Yes' : 'No'}
                </Text>
              </View>
            </View>

            {/* Image Path Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Image URL</Text>
              <TextInput
                style={styles.input}
                value={item.image_path}
                onChangeText={(value) => handleInputChange('image_path', value)}
                placeholder="Enter image URL"
              />
              
              {/* Image Preview */}
                {item.image_path ? (
                <View style={styles.imagePreviewContainer}>
                  <Image 
                    source={{ uri: imgServer + item.image_path }}
                    style={styles.imagePreview}
                    resizeMode="contain"
                  />
                </View>
              ) : null}
            </View>
          </View>
        </View>
        
        {/* Multilanguage Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Multilanguage Names</Text>
          <View style={styles.card}>
            {/* Korean Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Korean Name</Text>
              <TextInput
                style={styles.input}
                value={item.name_kor}
                onChangeText={(value) => handleInputChange('name_kor', value)}
                placeholder="Enter Korean name"
              />
            </View>

            {/* English Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>English Name</Text>
              <TextInput
                style={styles.input}
                value={item.name_eng}
                onChangeText={(value) => handleInputChange('name_eng', value)}
                placeholder="Enter English name"
              />
            </View>

            {/* Chinese Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Chinese Name</Text>
              <TextInput
                style={styles.input}
                value={item.name_chi}
                onChangeText={(value) => handleInputChange('name_chi', value)}
                placeholder="Enter Chinese name"
              />
            </View>

            {/* Japanese Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Japanese Name</Text>
              <TextInput
                style={styles.input}
                value={item.name_jap}
                onChangeText={(value) => handleInputChange('name_jap', value)}
                placeholder="Enter Japanese name"
              />
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={saving}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Icon name="save" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                <Text style={styles.saveButtonText}>Save Item</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal
        visible={showBarcodeScanner}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <BarcodeReader
          onScan={handleBarcodeScanned}
          onClose={handleCloseBarcodeScanner}
        />
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7f8c8d',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 8,
  },
  section: {
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#34495e',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f7f9fa',
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#2c3e50',
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 4,
  },
  barcodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  barcodeInput: {
    flex: 1,
    marginRight: 8,
  },
  scanButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeButton: {
    flex: 1,
    backgroundColor: '#f7f9fa',
    borderWidth: 1,
    borderColor: '#e1e8ed',
    padding: 12,
    margin: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedTypeButton: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
  },
  selectedTypeButtonText: {
    color: '#FFFFFF',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: '#34495e',
  },
  imagePreviewContainer: {
    marginTop: 8,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    backgroundColor: '#f7f9fa',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#34495e',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    flex: 2,
    backgroundColor: '#2ecc71',
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#95a5a6',
  },
  buttonIcon: {
    marginRight: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  aiButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  aiButton: {
    backgroundColor: '#9b59b6',
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchRowLabel: {
    fontSize: 14,
    color: '#34495e',
    fontWeight: '500',
  },
});

export default EditItemScreen;