import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    Image,
    Switch,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { NavigationProp, useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ROOT_PARAM_LIST } from '../../../../models/navigation';
import { ProductInfo } from '../../../entities/products/models/types';
import { imgServer } from '../../../../services/ApiService';
import productApis from '../../../features/products/apis/productApis';
import StockInputText from '../../Stock/ui/InputGroups/StockInputText';
import { BackButtonScreenHeader } from '../../../shared';
import { uploadProductImage } from '../apis/productDetailApis';
import ImageUploadUtil from '../../../utils/ImageUploadUtil';
import { OptimizedImage } from '../../../utils/ImageOptimisationUtil';
import Toast from 'react-native-toast-message';
import ImageOptimisationUtil from '../../../utils/ImageOptimisationUtil';
import { TOAST_EVENT_TYPE, TOAST_TYPE } from '../../../constant';
import { TOAST_MESSAGE } from '../../../constant';


const ProductInfoUpdateScreen = () => {
    const navigation = useNavigation<NavigationProp<ROOT_PARAM_LIST>>();
    const route = useRoute<RouteProp<ROOT_PARAM_LIST, 'ProductInfoUpdate'>>();
    const { product_info } = route.params;

    const [name, setName] = useState(product_info.name ?? '');
    const [nameKor, setNameKor] = useState(product_info.name_kor ?? '');
    const [nameEng, setNameEng] = useState(product_info.name_eng ?? '');
    const [nameChi, setNameChi] = useState(product_info.name_chi ?? '');
    const [nameJap, setNameJap] = useState(product_info.name_jap ?? '');
    const [code, setCode] = useState(product_info.code ?? '');
    const [barcode, setBarcode] = useState(product_info.barcode ?? '');
    const [barcodeBox, setBarcodeBox] = useState(product_info.barcode_for_box ?? '');
    const [type, setType] = useState(product_info.type ?? '');
    const [price, setPrice] = useState(String(product_info.price ?? ''));
    const [boxPrice, setBoxPrice] = useState(String(product_info.box_price ?? ''));
    const [ingredients, setIngredients] = useState(product_info.ingredients ?? '');
    const [reasoning, setReasoning] = useState(product_info.reasoning ?? '');
    const [hasBeef, setHasBeef] = useState(product_info.has_beef ?? false);
    const [hasPork, setHasPork] = useState(product_info.has_pork ?? false);
    const [isHalal, setIsHalal] = useState(product_info.is_halal ?? false);
    const [imagePath, setImagePath] = useState(product_info.image_path ?? '');
    const [isSaving, setIsSaving] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<OptimizedImage | null>(null);
    const [priceError, setPriceError] = useState(false);
    const [boxPriceError, setBoxPriceError] = useState(false);
    const [imageUploaded, setImageUploaded] = useState(false);


    const handleSave = async () => {
        const isPriceEmpty = !price || isNaN(parseFloat(price));
        const isBoxPriceEmpty = !boxPrice || isNaN(parseFloat(boxPrice));
        setPriceError(isPriceEmpty);
        setBoxPriceError(isBoxPriceEmpty);
        if (isPriceEmpty || isBoxPriceEmpty) return;
        if(parseFloat(price) <= 0 || parseFloat(boxPrice) <= 0) {
            Toast.show({
                type: TOAST_TYPE.ERROR,
                text1: 'Price and box price cannot be 0 ❌',
            });
            return;
        }

        setIsSaving(true);
        try {
            const payload: ProductInfo = {
                ...product_info,
                name,
                name_kor: nameKor,
                name_eng: nameEng,
                name_chi: nameChi,
                name_jap: nameJap,
                code,
                barcode,
                barcode_for_box: barcodeBox,
                type,
                price: parseFloat(price) || 0,
                box_price: parseFloat(boxPrice) || undefined,
                ingredients,
                reasoning,
                has_beef: hasBeef,
                has_pork: hasPork,
                is_halal: isHalal,
                image_path: imagePath,
            };
            const updateResult = await productApis.updateProduct(payload);
            if (updateResult.success) {
                navigation.goBack();
            } else {
                Toast.show({
                    type: TOAST_TYPE.ERROR,
                    text1: updateResult.message || TOAST_MESSAGE.PRODUCT_INFO_UPDATED_FAILED,
                });
            }
        } catch (err) {
            Toast.show({
                type: TOAST_TYPE.ERROR,
                text1: err instanceof Error ? err.message : TOAST_MESSAGE.PRODUCT_INFO_UPDATED_FAILED,
            });
        } finally {
            setIsSaving(false);
        }
    };

    // Image handling functions
    const handleSelectImage = () => {
        ImageOptimisationUtil.showImagePickerOptions(
            handleCameraSelection,
            handleGallerySelection
        );
    };

    const handleCameraSelection = async () => {
        try {
            const result = await ImageOptimisationUtil.pickImageFromCamera();
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
            const result = await ImageOptimisationUtil.pickImageFromGallery();
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
            const uploadResult = await ImageUploadUtil.uploadImage(image);

            if (uploadResult.success && uploadResult.payload.image_path) {
                setImagePath(uploadResult.payload.file_name);
                // handleInputChange('image_path', uploadResult.payload.file_name);

                Toast.show({
                    type: 'success',
                    text1: 'Image uploaded successfully!✅',
                    text2: `Size: ${ImageOptimisationUtil.formatFileSize(image.fileSize)}`,
                });
                setImageUploaded(true);
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

    useEffect(() => {
        return () => {
            if (imageUploaded && imagePath) {
                ImageUploadUtil.deleteImage(imagePath)
            }
        };
    }, [imageUploaded, imagePath]);

    return (
        <SafeAreaView style={styles.container}>
            <BackButtonScreenHeader
                title="Edit Product"
                onBackPress={() => navigation.goBack()}
                icon="arrow-back"
                iconSize={22}
                iconColor="#2c3e50">
                <TouchableOpacity
                    style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]}
                    onPress={handleSave}
                    disabled={isSaving}
                >
                    {isSaving
                        ? <ActivityIndicator size="small" color="#fff" />
                        : <Text style={styles.saveBtnText}>Save</Text>
                    }
                </TouchableOpacity>
            </BackButtonScreenHeader>

            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

                {/* Photo section */}
                <View style={styles.photoSection}>
                    <View style={styles.photoWindow}>
                        {imagePath ? (
                            <Image
                                source={{ uri: imgServer + imagePath }}
                                style={styles.productImage}
                                resizeMode="cover"
                            />
                        ) : (
                            <View style={styles.photoPlaceholder}>
                                <Icon name="image" size={36} color="#bdc3c7" />
                            </View>
                        )}
                    </View>
                    {/* TODO: Add image upload */}
                    <TouchableOpacity style={styles.cameraBtn} onPress={handleSelectImage}>
                        <Icon name="photo-camera" size={22} color="#fff" />
                        <Text style={styles.cameraBtnText}>Change Photo</Text>
                    </TouchableOpacity>
                </View>

                {/* Section: Names */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Names</Text>
                    <StockInputText
                        labelName="Name"
                        value={name}
                        onChangeHandler={setName}
                        placeholder="Product name"
                        keyboardType="default"
                        editable={true}
                    />
                    <View style={styles.fieldGap} />
                    <StockInputText
                        labelName="Korean"
                        value={nameKor}
                        onChangeHandler={setNameKor}
                        placeholder="한국어 이름"
                        keyboardType="default"
                        editable={true}
                    />
                    <View style={styles.fieldGap} />
                    <StockInputText
                        labelName="English"
                        value={nameEng}
                        onChangeHandler={setNameEng}
                        placeholder="English name"
                        keyboardType="default"
                        editable={true}
                    />
                    <View style={styles.fieldGap} />
                    <StockInputText
                        labelName="Chinese"
                        value={nameChi}
                        onChangeHandler={setNameChi}
                        placeholder="中文名称"
                        keyboardType="default"
                        editable={true}
                    />
                    <View style={styles.fieldGap} />
                    <StockInputText
                        labelName="Japanese"
                        value={nameJap}
                        onChangeHandler={setNameJap}
                        placeholder="日本語名"
                        keyboardType="default"
                        editable={true}
                    />
                </View>

                {/* Section: Product Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Product Details</Text>
                    <View style={styles.priceRow}>
                        <View style={styles.priceField}>
                            <StockInputText
                                id="ajdoiawjprice"
                                labelName="Price (£) *"
                                labelStyleProps={priceError ? styles.errorLabel : undefined}
                                value={price}
                                onChangeHandler={(v) => { setPrice(v); setPriceError(false); }}
                                placeholder="0.00"
                                keyboardType="decimal-pad"
                                inputMode="decimal"
                                editable={true}
                                inputStyleProps={priceError ? styles.errorInput : undefined}
                            />
                            {priceError && <Text style={styles.errorText}>Required</Text>}
                        </View>
                        <View style={styles.priceFieldGap} />
                        <View style={styles.priceField}>
                            <StockInputText
                                id="ajdoiawjboxprice"
                                labelName="Box Price (£) *"
                                labelStyleProps={boxPriceError ? styles.errorLabel : undefined}
                                value={boxPrice}
                                onChangeHandler={(v) => { setBoxPrice(v); setBoxPriceError(false); }}
                                placeholder="0.00"
                                keyboardType="decimal-pad"
                                inputMode="decimal"
                                editable={true}
                                inputStyleProps={boxPriceError ? styles.errorInput : undefined}
                            />
                            {boxPriceError && <Text style={styles.errorText}>Required</Text>}
                        </View>
                    </View>
                    <View style={styles.fieldGap} />
                    <StockInputText
                        labelName="Code"
                        value={code}
                        onChangeHandler={setCode}
                        placeholder="Product code"
                        keyboardType="default"
                        editable={true}
                    />
                    <View style={styles.fieldGap} />
                    <StockInputText
                        labelName="Barcode"
                        value={barcode}
                        onChangeHandler={setBarcode}
                        placeholder="Item barcode"
                        keyboardType="default"
                        editable={true}
                    />
                    <View style={styles.fieldGap} />
                    <StockInputText
                        labelName="Box Barcode"
                        value={barcodeBox}
                        onChangeHandler={setBarcodeBox}
                        placeholder="Box barcode"
                        keyboardType="default"
                        editable={true}
                    />
                    <View style={styles.fieldGap} />
                    <StockInputText
                        labelName="Type"
                        value={type}
                        onChangeHandler={setType}
                        placeholder="e.g. food, drink"
                        keyboardType="default"
                        editable={true}
                    />
                </View>

                {/* Section: Dietary */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Dietary Info</Text>
                    <View style={styles.toggleRow}>
                        <Text style={styles.toggleLabel}>Contains Beef</Text>
                        <Switch
                            value={hasBeef}
                            onValueChange={setHasBeef}
                            trackColor={{ false: '#ddd', true: '#e74c3c' }}
                            thumbColor="#fff"
                        />
                    </View>
                    <View style={styles.toggleDivider} />
                    <View style={styles.toggleRow}>
                        <Text style={styles.toggleLabel}>Contains Pork</Text>
                        <Switch
                            value={hasPork}
                            onValueChange={setHasPork}
                            trackColor={{ false: '#ddd', true: '#e74c3c' }}
                            thumbColor="#fff"
                        />
                    </View>
                    <View style={styles.toggleDivider} />
                    <View style={styles.toggleRow}>
                        <Text style={styles.toggleLabel}>Halal</Text>
                        <Switch
                            value={isHalal}
                            onValueChange={setIsHalal}
                            trackColor={{ false: '#ddd', true: '#27ae60' }}
                            thumbColor="#fff"
                        />
                    </View>
                </View>

                {/* Section: Notes */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Notes</Text>
                    <StockInputText
                        labelName="Ingredients"
                        value={ingredients}
                        onChangeHandler={setIngredients}
                        placeholder="List ingredients..."
                        keyboardType="default"
                        editable={true}
                        multiline
                        numberOfLines={3}
                        inputStyleProps={styles.textArea}
                    />
                    <View style={styles.fieldGap} />
                    <StockInputText
                        labelName="Reasoning"
                        value={reasoning}
                        onChangeHandler={setReasoning}
                        placeholder="Any notes..."
                        keyboardType="default"
                        editable={true}
                        multiline
                        numberOfLines={3}
                        inputStyleProps={styles.textArea}
                    />
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

export default ProductInfoUpdateScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f7fa',
    },

    /* Header */
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backBtn: {
        padding: 4,
        marginRight: 12,
    },
    headerTitle: {
        flex: 1,
        fontSize: 17,
        fontWeight: '700',
        color: '#2c3e50',
    },
    saveBtn: {
        backgroundColor: '#2196f3',
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 20,
        minWidth: 64,
        alignItems: 'center',
    },
    saveBtnDisabled: {
        opacity: 0.6,
    },
    saveBtnText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 13,
    },

    /* Scroll */
    scroll: {
        padding: 16,
        paddingBottom: 40,
        gap: 16,
    },

    /* Photo */
    photoSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 16,
        gap: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    photoWindow: {
        width: 90,
        height: 90,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    photoPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#2196f3',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
    },
    cameraBtnText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },

    /* Section card */
    section: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#95a5a6',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 14,
    },
    fieldGap: {
        height: 14,
    },

    /* Price row */
    priceRow: {
        flexDirection: 'row',
    },
    priceField: {
        flex: 1,
    },
    priceFieldGap: {
        width: 12,
    },

    /* Toggles */
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 6,
    },
    toggleLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#2c3e50',
    },
    toggleDivider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginVertical: 4,
    },

    /* Textarea */
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },

    /* Validation */
    errorInput: {
        borderColor: '#e74c3c',
        borderWidth: 1.5,
    },
    errorLabel: {
        color: '#e74c3c',
    },
    errorText: {
        fontSize: 11,
        color: '#e74c3c',
        marginTop: 4,
    },
});
