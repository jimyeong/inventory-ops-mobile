import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Switch,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Modal,
  Image,
  BackHandler,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import ItemService from '../../services/ItemService';
import { Item, Tag } from '../../models/Item';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { apiClient, imgServer } from '../../services/ApiService';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp } from '@react-navigation/native';
import { ROOT_PARAM_LIST } from '../../models/navigation';
import ImageOptimizationService, { OptimizedImage } from '../../services/ImageOptimizationService';
import ImageUploadService from '../../services/ImageUploadService';
import OpenAIService, { ProductAnalysisResult } from '../../services/OpenAIService';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { AddItemScreenStyles } from './ui/styles';

// Define navigation and route types
type AddItemRouteParams = {
  barcode?: string;
  box_barcode?: string;
};

const AddItemScreen = () => {
  const navigation = useNavigation<NavigationProp<ROOT_PARAM_LIST>>();
  const route = useRoute<RouteProp<Record<string, AddItemRouteParams>, string>>();
  const { userData: user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Tag related states
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagsLoading, setTagsLoading] = useState(false);
  const [selectedTagIds, setSelectedTagIds] = useState<Tag[]>([]);
  
  // Pagination state for recommendations
  const [page, setPage] = useState(1);
  const [hasMoreRecommendations, setHasMoreRecommendations] = useState(true);
  const [loadingMoreRecommendations, setLoadingMoreRecommendations] = useState(false);
  
  // Image handling states
  const [selectedImage, setSelectedImage] = useState<OptimizedImage | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadedImagePath, setUploadedImagePath] = useState<string>('');
  
  // AI analysis states
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiAnalysisComplete, setAiAnalysisComplete] = useState(false);
  
  // Initialize with barcode from route params if available
  const scannedBarcode = route.params?.barcode || '';
  const scannedBoxBarcode = route.params?.box_barcode || '';
  
  // Form state
  const [item, setItem] = useState<Partial<Item>>({
    barcode: scannedBarcode,
    code: '',
    name: '',
    name_kor: '',
    name_eng: '',
    name_chi: '',
    name_jap: '',
    type: 'PCS', // Default type
    available_for_order: true,
    image_path: '',
    box_barcode: scannedBoxBarcode,
    price: 0,
    box_price: 0,
  });

  // Focus reference for first input
  const codeInputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Focus the first input when component mounts
    setTimeout(() => {
      if (codeInputRef.current) {
        codeInputRef.current.focus();
      }
    }, 100);
    
    // Fetch tags
    fetchTags();
  }, []);

  // Handle route params changes (e.g., returning from barcode scanner)
  useEffect(() => {
    if (route.params?.barcode) {
      setItem(prev => ({ ...prev, barcode: route.params.barcode || '' }));
    }
    if (route.params?.box_barcode) {
      setItem(prev => ({ ...prev, box_barcode: route.params.box_barcode || '' }));
    }
  }, [route.params?.barcode, route.params?.box_barcode]);


  // handle navigation back
  const handleCustomBack = useCallback(() => {
    Alert.alert("Go back?", "Are you sure you want to leave?", [
      { text: "Cancel", style: "cancel" },
      { text: "Leave", onPress: () =>{
        if (item.image_path) {
          //silently delete image from server
          ImageUploadService.deleteImage(item.image_path).finally(() => {
            navigation.goBack();
          });
        } else {
          navigation.goBack();
        }
      } }
    ]);
  }, [item.image_path]);

  // handle back button pressed
  useEffect(() => {
    // navigate back to previous screen
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={handleCustomBack}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      ),
    });

    const backAction = BackHandler.addEventListener('hardwareBackPress', () => {
      if (item.image_path) {
        //silently delete image from server
        ImageUploadService.deleteImage(item.image_path).finally(() => {
          navigation.goBack();
        });
      } else {
        navigation.goBack();
      }
      return true;
    });
    return () => backAction.remove();
  }, [item.image_path]);

  
  // Fetch available tags
  const fetchTags = async () => {
    try {
      setTagsLoading(true);
      const fetchedTags = await ItemService.getTags();
      setTags(fetchedTags.payload.tags);
      
      // Auto-select sp6 tag as mandatory default
      const sp6Tag = fetchedTags.payload.tags.find((tag: any) => tag.tag_name === 'sp6');
      if (sp6Tag) {
        setSelectedTagIds([{id: sp6Tag.id, tag_name: sp6Tag.tag_name}]);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
      Alert.alert('Error', 'Failed to load tags for browsing');
    } finally {
      setTagsLoading(false);
    }
  };
  
  

  
  // Toggle tag selection
  const toggleTagSelection = (tagId: string) => {
    // Find the sp6 tag to prevent deselection
    const sp6Tag = tags.find(tag => tag.tag_name === 'sp6');
    
    if (selectedTagIds.find(tag => tag.id === tagId)) {
      // Prevent deselecting sp6 tag as it's mandatory
      if (sp6Tag && tagId === sp6Tag.id) {
        Alert.alert('Cannot Deselect', 'The sp6 tag is mandatory and cannot be removed');
        return;
      }
      setSelectedTagIds(selectedTagIds.filter(tag => tag.id !== tagId));
    } else {
      setSelectedTagIds([...selectedTagIds, {id: tagId, tag_name: tagId}]);
    }
  };
  
  // Set form data from a selected recommendation
  const selectRecommendedItem = (selectedItem: Item) => {
    setItem({
      ...item,
      id: selectedItem.id,
      barcode: scannedBarcode || selectedItem.barcode,
      code: selectedItem.code,
      name: selectedItem.name,
      name_kor: selectedItem.name_kor,
      name_eng: selectedItem.name_eng,
      name_chi: selectedItem.name_chi,
      name_jap: selectedItem.name_jap,
      type: selectedItem.type,
      available_for_order: selectedItem.available_for_order,
      image_path: selectedItem.image_path,
      box_barcode: selectedItem.box_barcode || '',
    });
    
  };

  const handleInputChange = (field: keyof Item, value: string | boolean) => {
    setItem({
      ...item,
      [field]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields - code, image, and name are required
      if (!item.code) {
        Toast.show({
          type: 'error',
          text1: 'Validation Error ❌',
          text2: 'Item Code is required',
        });
        return;
      }
      
      if (!item.name) {
        Toast.show({
          type: 'error',
          text1: 'Validation Error ❌',
          text2: 'Item Name is required',
        });
        return;
      }
      
      if (!item.image_path && !uploadedImagePath) {
        Toast.show({
          type: 'error',
          text1: 'Validation Error ❌',
          text2: 'Picture is required - please add a photo',
        });
        return;
      }

      // Validate mandatory sp6 tag
        const sp6Tag = tags.find(tag => tag.tag_name === 'sp6');
      if (sp6Tag && !selectedTagIds.find(tag => tag.id === sp6Tag.id)) {
        Toast.show({
          type: 'error',
          text1: 'Validation Error ❌',
          text2: 'The sp6 tag is mandatory for all items',
        });
        return;
      }

      setLoading(true);

      // Create the API request
      // const response = await apiClient.put('/api/v1/updateItem', item);
      item.available_for_order = item.available_for_order ? 1 : 0 as any;  
      
      // Include selected tags (especially mandatory sp6)
      const itemWithTags = {
        ...item,
        tag: selectedTagIds // Include the selected tag IDs
      };
      itemWithTags.price = parseFloat(itemWithTags.price?.toString() || '0');
      itemWithTags.box_price = parseFloat(itemWithTags.box_price?.toString() || '0');
      
      
      const response = await ItemService.createNewItem(itemWithTags as any);
      if (response.success) {
        Toast.show({
          type: 'success',
          text1: 'Item has been created successfully! ✅',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed to create item. Please try again. ❌',
        });
      }
      
      setSuccess(true);
      setLoading(false);
      
      // Show success message
      Alert.alert(
        'Success',
        'Item has been updated successfully! ✅',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      setLoading(false);
      console.error('Error creating item:', error);
      
      // Show error message
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to register item. Please try again. ❌',
        [{ text: 'OK' }]
      );
    }
  };

  const handleScanBarcode = () => {
    // Navigate to scanner screen with callback to return to this screen
    navigation.navigate("Scanner", { 
      returnScreen: 'AddItem',
      targetField: 'barcode'
    });
  };

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
        setUploadedImagePath(uploadResult.payload.image_path);
        handleInputChange('image_path', uploadResult.payload.image_path);
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
        text2: 'Failed to upload image',
      });
      setSelectedImage(null);
    } finally {
      setImageUploading(false);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setUploadedImagePath('');
    setAiAnalysisComplete(false);
      if (item.image_path) {
      // delete image from server
      ImageUploadService.deleteImage(item.image_path).finally(() => {
        handleInputChange('image_path', '');
      });
    }
      // handleInputChange('image_path', '');
  };

  // AI Image Analysis function
  const handleAIAnalysis = async () => {
    if (!uploadedImagePath) {
      Toast.show({
        type: 'error',
        text1: 'No Image Available',
        text2: 'Please upload an image first',
      });
      return;
    }

    // if (!OpenAIService.isConfigured()) {
    //   Toast.show({
    //     type: 'error',
    //     text1: 'AI Service Not Configured',
    //     text2: 'OpenAI API key is not set up',
    //   });
    //   return;
    // }

    try {
      setAiAnalyzing(true);
      
      // Construct the full image URL
      const fullImageUrl = uploadedImagePath.startsWith('http') 
        ? uploadedImagePath 
        : `${imgServer}${uploadedImagePath}`;

      const analysisResult = await OpenAIService.analyzeProductImage(fullImageUrl);
      
      if (analysisResult.success && analysisResult.data) {
        const data = analysisResult.data;
        
        // Update form fields with AI-extracted data
        if (data.barcode && !item.barcode) {
          handleInputChange('barcode', data.barcode);
        }
        if (data.name_kr) {
          handleInputChange('name_kor', data.name_kr);
        }
        if (data.name_jp) {
          handleInputChange('name_jap', data.name_jp);
        }
        if (data.name_ch) {
          handleInputChange('name_chi', data.name_ch);
        }
        if (data.name_en) {
          handleInputChange('name_eng', data.name_en);
          handleInputChange('name', data.name_en);
          // Also set as main name if not already set
          if (!item.name) {
            handleInputChange('name', data.name_en);
          }
        }

        setAiAnalysisComplete(true);
        
        Toast.show({
          type: 'success',
          text1: 'AI Analysis Complete! 🤖',
          text2: 'Product information extracted successfully',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'AI Analysis Failed',
          text2: analysisResult.error || 'Failed to analyze image',
        });
      }
    } catch (error) {
      console.error('AI Analysis error:', error);
      Toast.show({
        type: 'error',
        text1: 'Analysis Error',
        text2: 'Something went wrong during AI analysis',
      });
    } finally {
      setAiAnalyzing(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={AddItemScreenStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={AddItemScreenStyles.scrollContent}>
        <View style={AddItemScreenStyles.headerRow}>
          <View style={AddItemScreenStyles.header}>
            <Icon name="add-circle" size={32} color="#3498db" />
            <Text style={AddItemScreenStyles.headerText}>Register New Item</Text>
          </View>
        </View>

        {/* Essential Information Section */}
        <View style={AddItemScreenStyles.formContainer}>
          <Text style={AddItemScreenStyles.sectionTitle}>Essential Information (Required)</Text>
          
          {/* Image Section */}
          <View style={AddItemScreenStyles.inputGroup}>
            <Text style={AddItemScreenStyles.label}>Item Image*</Text>
             
            {/* Image Actions */}
            <View style={AddItemScreenStyles.imageActionsContainer}>
              <TouchableOpacity
                style={[AddItemScreenStyles.imageActionButton, imageUploading && AddItemScreenStyles.disabledButton]}
                onPress={handleSelectImage}
                disabled={imageUploading}
              >
                {imageUploading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Icon name="add-a-photo" size={20} color="#FFFFFF" />
                    <Text style={AddItemScreenStyles.imageActionText}>Add Photo</Text>
                  </>
                )}
              </TouchableOpacity>            
            </View>

            {/* Image Preview - Shows only when image is selected */}
            {(selectedImage || uploadedImagePath || item.image_path) && (
              <View style={AddItemScreenStyles.imagePreviewContainer}>
                <Image
                  source={{ 
                    uri: selectedImage ? selectedImage.uri : 
                         uploadedImagePath ? `${imgServer}${uploadedImagePath}` : 
                         `${imgServer}${item.image_path}` 
                  }}
                  style={AddItemScreenStyles.imagePreview}
                  resizeMode="contain"
                />
                <View style={AddItemScreenStyles.imageInfo}>
                  {selectedImage && (
                    <Text style={AddItemScreenStyles.imageInfoText}>
                      Size: {ImageOptimizationService.formatFileSize(selectedImage.fileSize)} | 
                      {selectedImage.width}×{selectedImage.height}
                    </Text>
                  )}
                  <TouchableOpacity 
                    style={AddItemScreenStyles.removeImageButton}
                    onPress={removeSelectedImage}
                  >
                    <Icon name="close" size={16} color="#e74c3c" />
                    <Text style={AddItemScreenStyles.removeImageText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* AI Analysis Button - Shows only when image is uploaded */}
            {uploadedImagePath && (
              <TouchableOpacity
                style={[
                  AddItemScreenStyles.aiAnalysisButton, 
                  aiAnalyzing && AddItemScreenStyles.disabledButton,
                  aiAnalysisComplete && AddItemScreenStyles.aiAnalysisCompleteButton
                ]}
                onPress={handleAIAnalysis}
                disabled={aiAnalyzing}
              >
                {aiAnalyzing ? (
                  <>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text style={AddItemScreenStyles.aiAnalysisButtonText}>Analyzing...</Text>
                  </>
                ) : (
                  <>
                    <Icon 
                      name={aiAnalysisComplete ? "check-circle" : "psychology"} 
                      size={20} 
                      color="#FFFFFF" 
                    />
                    <Text style={AddItemScreenStyles.aiAnalysisButtonText}>
                      {aiAnalysisComplete ? "AI Analysis Complete ✨" : "🤖 Analyze with AI"}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* Item Code */}
          <View style={AddItemScreenStyles.inputGroup}>
            <Text style={AddItemScreenStyles.label}>Item Code*</Text>
            <TextInput
              ref={codeInputRef}
              style={AddItemScreenStyles.input}
              value={item.code}
              onChangeText={(value) => handleInputChange('code', value)}
              placeholder="Enter item code"
            />
          </View>

          {/* Item Name */}
          <View style={AddItemScreenStyles.inputGroup}>
            <Text style={AddItemScreenStyles.label}>Item Name*</Text>
            <TextInput
              style={AddItemScreenStyles.input}
              value={item.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholder="Enter item name"
            />
          </View>
        </View>

        {/* Additional Information Section */}
        <View style={AddItemScreenStyles.formContainer}>
          <Text style={AddItemScreenStyles.sectionTitle}>Additional Information (Optional)</Text>
          
          {/* Unit Price */}
          <View style={AddItemScreenStyles.inputGroup}>
            <Text style={AddItemScreenStyles.label}>Unit Price(£)</Text>
            <TextInput
              style={AddItemScreenStyles.input}
              value={item.price?.toString()}
              onChangeText={(value) => handleInputChange('price', value)}
              placeholder="Enter unit price"
              keyboardType="numeric"
            />
          </View>

          {/* Box Price */}
          <View style={AddItemScreenStyles.inputGroup}>
            <Text style={AddItemScreenStyles.label}>Box Price(£)</Text>
            <TextInput
              style={AddItemScreenStyles.input}
              value={item.box_price?.toString()}
              onChangeText={(value) => handleInputChange('box_price', value)}
              placeholder="Enter box price"
              keyboardType="numeric"
            />
          </View>
          
          {/* Barcode Section */}
          <View style={AddItemScreenStyles.inputGroup}>
            <Text style={AddItemScreenStyles.label}>Barcode</Text>
            <View style={AddItemScreenStyles.barcodeContainer}>
              <TextInput
                style={[AddItemScreenStyles.input, AddItemScreenStyles.barcodeInput]}
                value={item.barcode}
                onChangeText={(value) => handleInputChange('barcode', value)}
                placeholder="Enter barcode"
                keyboardType="number-pad"
              />
              <TouchableOpacity 
                style={AddItemScreenStyles.scanButton}
                onPress={handleScanBarcode}
              >
                <Icon name="qr-code-scanner" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Box Barcode */}
          <View style={AddItemScreenStyles.inputGroup}>
            <Text style={AddItemScreenStyles.label}>Box Barcode</Text>
            <View style={AddItemScreenStyles.barcodeContainer}>
              <TextInput
                style={[AddItemScreenStyles.input, AddItemScreenStyles.barcodeInput]}
                value={item.box_barcode}
                onChangeText={(value) => handleInputChange('box_barcode', value)}
                placeholder="Enter box barcode"
                keyboardType="number-pad"
              />
              <TouchableOpacity 
                style={AddItemScreenStyles.scanButton}
                onPress={() => {
                  // Navigate to scanner for box barcode
                  navigation.navigate("Scanner", { 
                    returnScreen: 'AddItem',
                    targetField: 'box_barcode'
                  });
                }}
              >
                <Icon name="qr-code-scanner" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Item Type */}
          <View style={AddItemScreenStyles.inputGroup}>
            <Text style={AddItemScreenStyles.label}>Item Type</Text>
            <View style={AddItemScreenStyles.typeButtonsContainer}>
              {['PCS', 'BOX'].map((type, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    AddItemScreenStyles.typeButton,
                    item.type === type && AddItemScreenStyles.selectedTypeButton
                  ]}
                  onPress={() => handleInputChange('type', type)}
                >
                  <Text 
                    style={[
                          AddItemScreenStyles.typeButtonText,
                      item.type === type && AddItemScreenStyles.selectedTypeButtonText
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* Tags Section */}
          <View style={AddItemScreenStyles.inputGroup}>
            <Text style={AddItemScreenStyles.label}>Tags</Text>
            {tagsLoading ? (
              <ActivityIndicator size="small" color="#3498db" style={AddItemScreenStyles.tagsLoading} />
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={AddItemScreenStyles.tagsScrollView}>
                <View style={AddItemScreenStyles.tagsContainer}>
                  {tags.map((tag, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        AddItemScreenStyles.tagButton,
                        selectedTagIds.find(selectedTag => selectedTag.id === tag.id) 
                          ? { 
                              backgroundColor: tag.color ? tag.color : '#3498db',
                              borderColor: 'transparent'
                            } 
                          : { 
                              backgroundColor: '#f5f6fa',
                              borderColor: '#e1e8ed'
                            }
                      ]}
                      onPress={() => toggleTagSelection(tag.id)}
                    >
                      <Text 
                        style={[
                          AddItemScreenStyles.tagText,
                          selectedTagIds.find(selectedTag => selectedTag.id === tag.id) 
                            ? { color: '#FFFFFF', fontWeight: '500' } 
                            : { color: '#34495e' }
                        ]}
                      >
                        {tag.tag_name} {tag.count ? `(${tag.count})` : ''}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            )}
          </View>

          {/* Available For Order */}
          <View style={AddItemScreenStyles.inputGroup}>
            <Text style={AddItemScreenStyles.label}>Available For Order</Text>
            <View style={AddItemScreenStyles.switchContainer}>
              <Switch
                value={!!item.available_for_order}
                onValueChange={(value) => handleInputChange('available_for_order', value)}
                trackColor={{ false: '#d1d1d1', true: '#81b0ff' }}
                thumbColor={!!item.available_for_order ? '#3498db' : '#f4f3f4'}
              />
              <Text style={AddItemScreenStyles.switchLabel}>
                {!!item.available_for_order ? 'Yes' : 'No'}
              </Text>
            </View>
          </View>
        </View>

        {/* Advanced Information Section */}
        <View style={AddItemScreenStyles.formContainer}>
          <Text style={AddItemScreenStyles.sectionTitle}>Advanced Information (Fill Later)</Text>
          
          {/* Multi-language Names */}
          <Text style={AddItemScreenStyles.sectionTitle}>Multi-language Names</Text>

          {/* Korean Name */}
          <View style={AddItemScreenStyles.inputGroup}>
            <Text style={AddItemScreenStyles.label}>Korean Name</Text>
            <TextInput
              style={AddItemScreenStyles.input}
              value={item.name_kor}
              onChangeText={(value) => handleInputChange('name_kor', value)}
              placeholder="Enter Korean name"
            />
          </View>

          {/* English Name */}
          <View style={AddItemScreenStyles.inputGroup}>
            <Text style={AddItemScreenStyles.label}>English Name</Text>
            <TextInput
              style={AddItemScreenStyles.input}
              value={item.name_eng}
              onChangeText={(value) => handleInputChange('name_eng', value)}
              placeholder="Enter English name"
            />
          </View>

          {/* Chinese Name */}
          <View style={AddItemScreenStyles.inputGroup}>
            <Text style={AddItemScreenStyles.label}>Chinese Name</Text>
            <TextInput
              style={AddItemScreenStyles.input}
              value={item.name_chi}
              onChangeText={(value) => handleInputChange('name_chi', value)}
              placeholder="Enter Chinese name"
            />
          </View>

          {/* Japanese Name */}
          <View style={AddItemScreenStyles.inputGroup}>
            <Text style={AddItemScreenStyles.label}>Japanese Name</Text>
            <TextInput
              style={AddItemScreenStyles.input}
              value={item.name_jap}
              onChangeText={(value) => handleInputChange('name_jap', value)}
              placeholder="Enter Japanese name"
            />
          </View>

        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[AddItemScreenStyles.submitButton, loading && AddItemScreenStyles.disabledButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Icon name="check-circle" size={20} color="#FFFFFF" style={AddItemScreenStyles.buttonIcon} />
              <Text style={AddItemScreenStyles.submitButtonText}>Register Item</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};


export default AddItemScreen;