import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  ToastAndroid,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Camera, useCameraDevice, useCodeScanner, CameraDevice, CodeType } from 'react-native-vision-camera';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { ROOT_PARAM_LIST } from '../../models/navigation';
import { BarcodeMiningService } from '../../services/BarcodeMiningService';
import { BarcodeResultView } from './ui/BarcodeResultView';

const BarcodeMiningScreen = () => {
  const { userData: user } = useAuth();
  const navigation = useNavigation<NavigationProp<ROOT_PARAM_LIST>>();
  const debounceTime = 800; // Debounce time in ms
  const [hasPermission, setHasPermission] = useState(false);
  const [scanning, setScanning] = useState(true);
  const [loading, setLoading] = useState(false);
  const [barcode, setBarcode] = useState<string>('');
  const [lastScannedAt, setLastScannedAt] = useState<number>(0);
  const [debounceTimeMs, setDebounceTimeMs] = useState<number>(debounceTime);
  const [showResult, setShowResult] = useState(false);
  const [scanSuccessful, setScanSuccessful] = useState(false);

  const camera = useRef<Camera>(null);

  // Function to show toast message
  const showToast = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Success', message, [{ text: 'OK' }]);
    }
  };

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

  // Update debounce time if it changes
  useEffect(() => {
    if (debounceTime !== debounceTimeMs) {
      setDebounceTimeMs(debounceTime);
    }
  }, [debounceTime]);

  // Handler for scanned barcode
  const handleBarcode = async (barcodeValue: string) => {
    try {
      setScanning(false);
      setLoading(true);

      // Call API to save barcode
      const response = await BarcodeMiningService.saveBarcode(barcodeValue);
      if(response.success){
        showToast('Barcode saved successfully');

      }else{
        showToast("It was not successful"  + response.payload.message);
      }
      
      // Set success state and show the result
      setScanSuccessful(true);
      setShowResult(true);
      
      
      setLoading(false);
    } catch (error) {
      console.error('Error processing barcode:', error);
      Alert.alert('Error', 'Failed to save barcode. Please try again.');
      setScanSuccessful(false);
      setShowResult(true);
      setLoading(false);
    }
  };

  // Handler to scan again
  const handleScanAgain = () => {
    setShowResult(false);
    setScanSuccessful(false);
    setScanning(true);
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
      {!showResult ? (
        <View style={styles.cameraContainer}>
          <Camera
            codeScanner={codeScanner}
            device={device}
            isActive={scanning && !loading}
            ref={camera}
            style={styles.camera}
          />

          {loading ? (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#ffffff" />
              <Text style={styles.loadingText}>Saving barcode information...</Text>
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
      ) : (
        <BarcodeResultView 
          barcode={barcode} 
          success={scanSuccessful} 
          onScanAgain={handleScanAgain} 
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
});

export default BarcodeMiningScreen;