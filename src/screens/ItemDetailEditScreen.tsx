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
  SafeAreaView,
  Modal,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Item, Tag } from '../models/Item';
import { ROOT_PARAM_LIST } from '../models/navigation';
import ItemService from '../services/ItemService';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';
import { imgServer } from '../services/ApiService';
import Toast from 'react-native-toast-message';
import BarcodeReader from '../components/BarcodeReader/BarcodeReader';
import ImageOptimizationService from '../services/ImageOptimizationService';
import ImageUploadService from '../services/ImageUploadService';
import { OptimizedImage } from '../services/ImageOptimizationService';

type NavigationProp = NativeStackNavigationProp<ROOT_PARAM_LIST>;

const ItemDetailEditScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<ROOT_PARAM_LIST, 'ItemDetailEdit'>>();
  const { item: itemFromRoute, itemId } = route.params;  
  const { userData: user } = useAuth();

  const [selectedImage, setSelectedImage] = useState<OptimizedImage | null>(null);
  const [uploadedImagePath, setUploadedImagePath] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);

  

  // AI Help states
  const [showAIHelp, setShowAIHelp] = useState(false);
  const [aiBarcode, setAiBarcode] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResults, setAiResults] = useState<any>(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [item, setItem] = useState<Partial<Item>>({
    // barcode: itemFromRoute.barcode || '',
    code: itemFromRoute.code || '',
    name: itemFromRoute.name || '',
    name_kor: itemFromRoute.name_kor || '',
    name_eng: itemFromRoute.name_eng || '',
    name_chi: itemFromRoute.name_chi || '',
    name_jap: itemFromRoute.name_jap || '',
    available_for_order: true,
    image_path: itemFromRoute.image_path || '/image_holder.jpg',
    box_barcode: itemFromRoute.box_barcode || '',
    price: itemFromRoute.price as number,
    box_price: itemFromRoute.box_price as number,
  });
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState('');

  // Error states
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Camera modal states
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [scannerTarget, setScannerTarget] = useState<'barcode' | 'box_barcode'>('barcode');


  
  // Refs for field
  const barcodeInputRef = useRef<TextInput>(null);
  const nameInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (item) {
      
      fetchItemDetails();
      fetchTags();
    }
  }, [itemFromRoute]);

  // Auto-fill AI barcode when main barcode is filled
  useEffect(() => {
    if (item.barcode && item.barcode.trim()) {
      setAiBarcode(item.barcode.trim());
    }
  }, [item.barcode]);

  // Image handling functions
  const handleSelectImage = () => {
    ImageOptimizationService.showImagePickerOptions(
      handleCameraSelection,
      handleGallerySelection
    );
  };

  const handleCameraSelection = async () => {
    try {
      const result = await ImageOptimizationService.pickImageFromCamera();
      if (result.success && result.image) {
        setSelectedImage(result.image);
        await uploadSelectedImage(result.image);
      } else {
        Alert.alert('Error', result.error || 'Failed to capture image');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to access camera');
    }
  };

  const handleGallerySelection = async () => {
    try {
      const result = await ImageOptimizationService.pickImageFromGallery();
      if (result.success && result.image) {
        setSelectedImage(result.image);
        await uploadSelectedImage(result.image);
      } else {
        Alert.alert('Error', result.error || 'Failed to select image');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to access gallery');
    }
  };

  const uploadSelectedImage = async (image: OptimizedImage) => {
    try {
      setImageUploading(true);
      const uploadResult = await ImageUploadService.uploadImage(image);
      
      if (uploadResult.success && uploadResult.payload.image_path) { 
        setUploadedImagePath(uploadResult.payload.file_name);
        handleInputChange('image_path', uploadResult.payload.file_name);
        Toast.show({
          type: 'success',
          text1: 'Image uploaded successfully!✅',
          text2: `Size: ${ImageOptimizationService.formatFileSize(image.fileSize)}`,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Upload Failed❌',
          text2: uploadResult.payload.message || 'Failed to upload image',
        });
        setSelectedImage(null);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Upload Error❌',
        text2: error instanceof Error ? error.message : 'Failed to upload image',
      }); 
      setSelectedImage(null);
    } finally {
      setImageUploading(false);
    }
  };


  // AI Help functionality
  const handleAIHelp = async () => {
    if (!aiBarcode.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a barcode to analyze.',
        position: 'bottom',
        bottomOffset: 100,
      });
      return;
    }

    try {
      setAiLoading(true);
      if(!item.name) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Please enter a product name',
          position: 'bottom',
          bottomOffset: 100,
        });
        return;
      }else{
        const response = await ItemService.analyzeBarcode(aiBarcode.trim(), item.name);
        if (response.success) {
          setAiResults(response.payload);
          Toast.show({
            type: 'success',
            text1: 'AI Analysis Complete',
            text2: 'Barcode analysis completed successfully!',
            position: 'bottom',
            bottomOffset: 100,
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Failed to analyze barcode. Please try again.',
            position: 'bottom',
            bottomOffset: 100,
          });
        }
      }
    } catch (error) {
      console.error('Error with AI barcode analysis:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to analyze barcode. Please try again.',
        position: 'bottom',
        bottomOffset: 100,
      });
    } finally {
      setAiLoading(false);
    }
  };

  const fetchItemDetails = async () => {
    try {
      setLoading(true);
      
      const response = await ItemService.getItemById(itemId);
      
      if (response.success) {
        const itemData = response.payload;
        // Set the form fields with the item data
        setItem({
          id: itemData.id,
          code: itemData.code || '',
          barcode: itemData.barcode || '',
          price: itemData.price as number,
          box_price: itemData.box_price as number,
          name: itemData.name || '',
          name_kor: itemData.name_kor || '',
          name_eng: itemData.name_eng || '',
          name_chi: itemData.name_chi || '',
          name_jap: itemData.name_jap || '',
          image_path: itemData.image_path || '/image_holder.jpg',
          box_barcode: itemData.box_barcode || '',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Item not found',
          position: 'bottom',
          bottomOffset: 100,
        });
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error fetching item:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load item details. Please try again.',
        position: 'bottom',
        bottomOffset: 100,
      });
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const tagsResponse = await ItemService.getTags();
      if (tagsResponse.success) {
        setAllTags(tagsResponse.payload.tags);
        
        // Set selected tags from the item data
        if (itemId) {
          const itemResponse = await ItemService.getItemTags(itemId);
          if (itemResponse.success) {
            setSelectedTags(itemResponse.payload);
          }
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to fetch tags. Please try again.',
          position: 'bottom',
          bottomOffset: 100,
        });
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
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

  const handleInputChange = (field: keyof Item, value: string | boolean | number) => {
    //if(field === 'price' || field === 'box_price') value = parseFloat(value as string) || 0;
    
    setItem({
      ...item,
      [field]: value,
    });
    
    // Clear error if field has value
    if (errors[field as string] && typeof value === 'string' && value.trim()) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleScanForAI = () => {
    navigation.navigate('Scanner', {
      returnScreen: 'FilloutItemInfo',
      targetField: 'ai_barcode'
    } as never);
  };


  const handleScanBarcode = () => {
    setScannerTarget('barcode');
    setShowBarcodeScanner(true);
  };

  const handleScanBoxBarcode = () => {
    setScannerTarget('box_barcode');
    setShowBarcodeScanner(true);
  };

  const handleBarcodeScanned = (scannedCode: string) => {
    if (scannerTarget === 'barcode') {
      handleInputChange('barcode', scannedCode);
    } else if (scannerTarget === 'box_barcode') {
      handleInputChange('box_barcode', scannedCode);
    }
    setShowBarcodeScanner(false);
  };

  const handleCloseBarcodeScanner = () => {
    setShowBarcodeScanner(false);
  };

  const handleTagToggle = (tag: Tag) => {
    const isSelected = selectedTags.some(t => t.id === tag.id);
    if (isSelected) {
      setSelectedTags(selectedTags.filter(t => t.id !== tag.id));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // TODO: add new tag MAKE A REQUEST TO API
  const handleAddNewTag = () => {
    if (!newTagName.trim()) return;
    
    // For now, create a temporary tag (in production, this should create via API)
    const newTag: Tag = {
      id: `temp-${Date.now()}`,
      tag_name: newTagName.trim(),
    };
    
    
    createNewTag(newTagName.trim());
    setNewTagName('');
  };

  const createNewTag = async (tag_name: string) => {
  
    const response = await ItemService.createTag(tag_name);
    if (response.success) {
      setAllTags([...allTags, response.payload]);
    }
  };  


  const handleRemoveTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter(t => t.id !== tagId));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fill in all required fields.',
        position: 'bottom',
        bottomOffset: 100,
      });
      return;
    }
    try {
      setSaving(true);
      
      // Prepare only fields that should be submitted (exclude null/undefined)
      const itemToSubmit = Object.fromEntries(
        Object.entries(item).filter(([_, value]) => value !== null && value !== undefined)
      );
      itemToSubmit.price = parseFloat(itemToSubmit.price as string) || 0;
      itemToSubmit.box_price = parseFloat(itemToSubmit.box_price as string) || 0;
      itemToSubmit.tags = selectedTags.map(tag => {
        return {id: tag.id, tag_name: tag.tag_name}
      });

      
      // Update the item
      await ItemService.updateItem(itemToSubmit as Partial<Item>);

      Toast.show({
        type: 'success',
        text1: 'Item updated successfully!✅',
        text2: 'Item updated successfully!',
        position: 'bottom',
        bottomOffset: 100,
      });
      
      navigation.goBack();
    } catch (error) {
      console.error('Error saving item:', error);
      Toast.show({    
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save item. Please try again.',
        position: 'bottom',
        bottomOffset: 100,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading item details...</Text>
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView style={styles.container}>
        {/* AI Help Section */}
        <View style={styles.aiHelpSection}>
          <TouchableOpacity
            style={styles.aiHelpButton}
            onPress={() => setShowAIHelp(!showAIHelp)}
          >
            <View style={styles.aiHelpButtonContent}>
              <Icon name="psychology" size={20} color="#ffffff" />
              <Text style={styles.aiHelpButtonText}>Get Help by AI</Text>
            </View>
            <Icon
              name={showAIHelp ? "expand-less" : "expand-more"}
              size={20}
              color="#ffffff"
            />
          </TouchableOpacity>
          
          {showAIHelp && (
            <View style={styles.aiHelpContent}>
              <Text style={styles.aiHelpDescription}>
                Analyze any barcode with AI to get detailed product information
              </Text>
              <View style={styles.aiInputContainer}>
                <TextInput
                  style={styles.aiInput}
                  value={aiBarcode}
                  onChangeText={setAiBarcode}
                  placeholder="Enter barcode for AI analysis"
                  keyboardType="number-pad"
                />
                <TouchableOpacity 
                  style={styles.aiScanButton}
                  onPress={handleScanForAI}
                >
                  <Icon name="qr-code-scanner" size={20} color="#ffffff" />
                </TouchableOpacity>
              </View>           
              <TouchableOpacity
                style={[styles.analyzeButton, aiLoading && styles.disabledButton]}
                onPress={handleAIHelp}
                disabled={aiLoading || !aiBarcode.trim()}
              >
                {aiLoading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <>
                    <Icon name="analytics" size={18} color="#ffffff" />
                    <Text style={styles.analyzeButtonText}>Analyze Barcode</Text>
                  </>
                )}
              </TouchableOpacity>
              {aiResults && (
                <View style={styles.aiResultsContainer}>
                  <Text style={styles.aiResultsTitle}>AI Analysis Results:</Text>
                  <View style={styles.aiResultItem}>
                    <Text style={styles.aiResultLabel}>Korean Name:</Text>
                    <Text style={styles.aiResultValue}>{aiResults.name_kor || 'N/A'}</Text>
                  </View>
                  <View style={styles.aiResultItem}>
                    <Text style={styles.aiResultLabel}>English Name:</Text>
                    <Text style={styles.aiResultValue}>{aiResults.name_eng || 'N/A'}</Text>
                  </View>
                  <View style={styles.aiResultItem}>
                    <Text style={styles.aiResultLabel}>Chinese Name:</Text>
                    <Text style={styles.aiResultValue}>{aiResults.name_chi || 'N/A'}</Text>
                  </View>
                  <View style={styles.aiResultItem}>
                    <Text style={styles.aiResultLabel}>Japanese Name:</Text>
                    <Text style={styles.aiResultValue}>{aiResults.name_jap || 'N/A'}</Text>
                  </View>
                  <View style={styles.aiResultRow}>
                    <View style={[styles.aiBadge, { backgroundColor: aiResults.hasBeef ? '#e74c3c' : '#27ae60' }]}>
                      <Text style={styles.aiBadgeText}>Beef: {aiResults.hasBeef ? 'Yes' : 'No'}</Text>
                    </View>
                    <View style={[styles.aiBadge, { backgroundColor: aiResults.hasPork ? '#e74c3c' : '#27ae60' }]}>
                      <Text style={styles.aiBadgeText}>Pork: {aiResults.hasPork ? 'Yes' : 'No'}</Text>
                    </View>
                    <View style={[styles.aiBadge, { backgroundColor: aiResults.isHalal ? '#27ae60' : '#e74c3c' }]}>
                      <Text style={styles.aiBadgeText}>Halal: {aiResults.isHalal ? 'Yes' : 'No'}</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Icon name="edit" size={24} color="#3498db" />
            <Text style={styles.headerText}>Edit Item Details</Text>
          </View>
          {/* Image Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Image</Text>
            <View style={styles.card}>
              <View style={styles.inputGroup}>
                
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
            {/* Image Upload Section */}
            <View style={styles.imageUploadSection}>
              <TouchableOpacity 
                style={styles.imageUploadButton}
                onPress={handleSelectImage}
                disabled={imageUploading}
              >
                {imageUploading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <>
                    <Icon 
                      name={item.image_path && item.image_path !== '/image_holder.jpg' ? "edit" : "add-a-photo"} 
                      size={20} 
                      color="#ffffff" 
                    />
                    <Text style={styles.imageUploadButtonText}>
                      {item.image_path && item.image_path !== '/image_holder.jpg' ? 'Change Image' : 'Add Image'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
              
              {selectedImage && (
                <View style={styles.selectedImageInfo}>
                  <Text style={styles.imageInfoText}>
                    📷 {ImageOptimizationService.formatFileSize(selectedImage.fileSize)}
                  </Text>
                  <Text style={styles.imageInfoSubtext}>
                    {selectedImage.width} × {selectedImage.height}px
                  </Text>
                </View>
              )}
              
              {imageUploadError && (
                <Text style={styles.imageErrorText}>
                  ❌ {imageUploadError}
                </Text>
              )}
            </View>
          </View>
          
          {/* Essential Fields Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Essential Information</Text>
            <View style={styles.card}>
              {/* Price Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Price(£)</Text>
                <TextInput
                  style={styles.input}
                  value={item.price?.toString() || ''}
                  onChangeText={(value) => handleInputChange('price', value)}
                  placeholder="Enter item price"
                  keyboardType="numeric"
                />
              </View>
              {/* Box Price Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Box Price(£)</Text>
                <TextInput
                  style={styles.input}
                  value={item.box_price?.toString() || ''}
                  onChangeText={(value) => handleInputChange('box_price', value)}
                  placeholder="Enter item box price"
                  keyboardType="numeric"
                />
              </View>
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

              {/* Box Barcode Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Box Barcode</Text>
                <View style={styles.barcodeContainer}>
                  <TextInput
                    style={[
                      styles.input, 
                      styles.barcodeInput
                    ]}
                    value={item.box_barcode}
                    onChangeText={(value) => handleInputChange('box_barcode', value)}
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
                  editable={false}
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
                  editable={false}
                />
                {errors.name ? (
                  <Text style={styles.errorText}>{errors.name}</Text>
                ) : null}
              </View>

              {/* Type Field */}
              {/* <View style={styles.inputGroup}>
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
              </View> */}

              {/* Available For Order Field */}
              {/* <View style={styles.inputGroup}>
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
              </View> */}
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

          {/* Tags Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.card}>
              {/* Selected Tags */}
              {selectedTags.length > 0 && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Selected Tags</Text>
                  <View style={styles.selectedTagsContainer}>
                    {selectedTags.map((tag) => (
                      <View key={tag.id} style={styles.selectedTag}>
                        <Text style={styles.selectedTagText}>{tag.tag_name}</Text>
                        <TouchableOpacity onPress={() => handleRemoveTag(tag.id)}>
                          <Icon name="close" size={16} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Add New Tag */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Add New Tag</Text>
                <View style={styles.newTagContainer}>
                  <TextInput
                    style={[styles.input, styles.newTagInput]}
                    value={newTagName}
                    onChangeText={setNewTagName}
                    placeholder="Enter new tag name"
                  />
                  <TouchableOpacity 
                    style={styles.addTagButton}
                    onPress={handleAddNewTag}
                  >
                    <Icon name="add" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
              {/* Available Tags */}
              {allTags.length > 0 && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Available Tags</Text>
                  <View style={styles.availableTagsContainer}>
                    {allTags.map((tag) => {
                      const isSelected = selectedTags.some(t => t.id === tag.id);
                      return (
                        <TouchableOpacity
                          key={tag.id}
                          style={[
                            styles.availableTag,
                            isSelected && styles.selectedAvailableTag
                          ]}
                          onPress={() => handleTagToggle(tag)}
                        >
                          <Text style={[
                            styles.availableTagText,
                            isSelected && styles.selectedAvailableTagText
                          ]}>
                            {tag.tag_name}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}
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
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Barcode Scanner Modal */}
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
    </SafeAreaView>
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
  selectedTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  selectedTagText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  newTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  newTagInput: {
    flex: 1,
    marginRight: 8,
  },
  addTagButton: {
    backgroundColor: '#27ae60',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  availableTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  availableTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#ecf0f1',
    borderWidth: 1,
    borderColor: '#bdc3c7',
  },
  selectedAvailableTag: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  availableTagText: {
    fontSize: 14,
    color: '#34495e',
    fontWeight: '500',
  },
  selectedAvailableTagText: {
    color: '#FFFFFF',
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
   // AI Help Styles
   aiHelpSection: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  aiHelpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#9b59b6',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  aiHelpButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiHelpButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 10,
  },
  aiHelpContent: {
    padding: 16,
  },
  aiHelpDescription: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 16,
    lineHeight: 20,
  },
  aiInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  aiInput: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#2c3e50',
    marginRight: 8,
  },
  aiScanButton: {
    backgroundColor: '#9b59b6',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 16,
  },
  analyzeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  aiResultsContainer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  aiResultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  aiResultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  aiResultLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6c757d',
  },
  aiResultValue: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '400',
    flex: 1,
    textAlign: 'right',
  },
  aiResultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 8,
  },
  aiBadge: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  aiBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  // Image Upload Styles
  imageUploadSection: {
    marginTop: 16,
    alignItems: 'center',
  },
  imageUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 150,
  },
  imageUploadButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  selectedImageInfo: {
    marginTop: 12,
    alignItems: 'center',
    backgroundColor: '#e8f5e8',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  imageInfoText: {
    fontSize: 14,
    color: '#27ae60',
    fontWeight: '600',
  },
  imageInfoSubtext: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 2,
  },
  imageErrorText: {
    marginTop: 8,
    fontSize: 14,
    color: '#e74c3c',
    textAlign: 'center',
  },
});

export default ItemDetailEditScreen;


