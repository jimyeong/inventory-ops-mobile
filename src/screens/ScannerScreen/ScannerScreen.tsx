import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Camera, useCameraDevices, useCameraPermission, useCameraDevice, CameraDevice, useCodeScanner, useFrameProcessor, CodeType } from 'react-native-vision-camera';
// import { useScanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import { ROOT_PARAM_LIST } from '../../models/navigation';

const ScannerScreen = () => {
  const navigation = useNavigation<NavigationProp<ROOT_PARAM_LIST>>();
  const route = useRoute<RouteProp<ROOT_PARAM_LIST, 'Scanner'>>();
  const returnScreen = route.params?.returnScreen; // Check if we should return to another screen
  const debounceTime = 800; //  default of 300ms
  const [hasPermission, setHasPermission] = useState(false);
  const [scanning, setScanning] = useState(true);
  const [loading, setLoading] = useState(false);
  const [barcode, setBarcode] = useState<string>('');
  const [lastScannedAt, setLastScannedAt] = useState<number>(0);
  const [debounceTimeMs, setDebounceTimeMs] = useState<number>(debounceTime);
  const camera = useRef<Camera>(null);

  // Debounced barcode handler
  const handleCodeScanned = useCallback((result: any) => {
    if (!scanning || loading) return; // Don't process if not in scanning mode or loading

    const currentTime = Date.now();
    const timeElapsed = currentTime - lastScannedAt;

    // Only process if sufficient time has passed since last scan
    if (timeElapsed > debounceTimeMs && result && result.length > 0) {
      setLastScannedAt(currentTime);
      setBarcode(result[0].value as string);
      handleBarcode(result[0].value as string);
    } else if (result && result.length > 0) {
    }
  }, [lastScannedAt, debounceTimeMs, scanning, loading]);


  const codeTypes = Platform.OS === 'ios'
  ? ['qr', 'ean-13', 'itf-14']
  : ['qr', 'ean-13', "itf"];

  const codeScanner = useCodeScanner({
    codeTypes: codeTypes as CodeType[],
    onCodeScanned: handleCodeScanned,
  });

  const device = useCameraDevice('back') as CameraDevice;
  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Update debounce time if it changes via navigation params
  useEffect(() => {
    if (debounceTime !== debounceTimeMs) {
      setDebounceTimeMs(debounceTime);
    }
  }, [debounceTime]);

  // add debounce
  const handleBarcode = async (barcode: string) => {
    try {
      setScanning(false);
      setLoading(true);

      // If we're returning to AddItem screen, just pass the barcode back
      if (returnScreen === 'AddItem') {
        setLoading(false);
        navigation.navigate('AddItem', { barcode });
        return;
      } 

      // when there is no return screen. 
      navigation.navigate("ScannedItemDetail", {barcode})

      setLoading(false);
      setScanning(true);
    } catch (error) {
      console.error('Error processing barcode:', error);
      // If scan was initiated from the Add Item screen, return with the barcode anyway
      Alert.alert('Error', 'Failed to process barcode. Please try again.');
      setLoading(false);
      setScanning(true);
    }
  };

  if (!hasPermission) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.permissionText}>Camera permission is required to scan barcodes</Text>
      </SafeAreaView>
    );
  }

  if (!device) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#3498db" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraContainer}>
          <Camera
            codeScanner={codeScanner}
            device={device}
            isActive={scanning && !loading}
            ref={camera}
            style={styles.camera}
            // frameProcessor={frameProcessor}
          />  
          {loading ? (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#ffffff" />
              <Text style={styles.loadingText}>Loading item information...</Text>
            </View>
          ) : (
            <View style={styles.overlay}>
              <View style={styles.scannerBox} />
              <Text style={styles.scannerText}>
                Position the barcode within the frame
              </Text>
            </View>
          )}
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  itemHeaderRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  itemHeaderInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  stockContainer: {
    marginTop: 10,
    maxHeight: 350,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingVertical: 5,
  },
  stockItemContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: 6,
    marginHorizontal: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  stockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 8,
  },
  stockId: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#34495e',
  },
  stockDate: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  stockDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 6,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    paddingHorizontal: 8,
  },
  stockIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockDetailText: {
    marginLeft: 4,
    fontSize: 13,
    fontWeight: '500',
  },
  stockInfo: {
    marginTop: 6,
  },
  stockInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  stockInfoText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#555',
  },
  notesContainer: {
    flexDirection: 'row',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  notesText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#7f8c8d',
    fontStyle: 'italic',
    flex: 1,
  },
  stockSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 5,
    paddingHorizontal: 2,
  },
  stockSectionTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34495e',
  },
  emptyStockContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 10,
  },
  emptyStockText: {
    marginTop: 10,
    color: '#95a5a6',
    fontSize: 14,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    margin: 20,
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 10,
  },
  scannerBox: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#ffffff',
    borderRadius: 10,
  },
  scannerText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  itemContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  itemDetails: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  itemName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemBarcode: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 10,
  },
  itemDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  itemStock: {
    fontSize: 16,
    marginBottom: 5,
  },
  stockCount: {
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '500',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  stockInButton: {
    backgroundColor: '#2ecc71',
    marginRight: 10,
  },
  stockOutButton: {
    backgroundColor: '#e74c3c',
    marginLeft: 10,
  },
  stockItemOutButton: {
    backgroundColor: '#e74c3c',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 5,
    marginTop: 12,
  },
  stockItemButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  scanAgainButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ScannerScreen;