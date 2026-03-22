import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface BarcodeResultViewProps {
  barcode: string;
  success: boolean;
  onScanAgain: () => void;
}

export const BarcodeResultView: React.FC<BarcodeResultViewProps> = ({ 
  barcode, 
  success, 
  onScanAgain 
}) => {
  return (
    <View style={styles.resultContainer}>
      <View style={styles.resultContent}>
        <View style={styles.iconContainer}>
          {success ? (
            <Icon name="check-circle" size={80} color="#2ecc71" />
          ) : (
            <Icon name="cancel" size={80} color="#e74c3c" />
          )}
        </View>
        
        <Text style={styles.resultTitle}>
          {success ? "Barcode Saved" : "Error Saving Barcode"}
        </Text>
        
        <View style={styles.barcodeContainer}>
          <Text style={styles.barcodeLabel}>Barcode:</Text>
          <Text style={styles.barcodeValue}>{barcode}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.scanAgainButton} 
          onPress={onScanAgain}
        >
          <Icon name="qr-code-scanner" size={24} color="#ffffff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Scan Again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resultContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  barcodeContainer: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 25,
  },
  barcodeLabel: {
    fontSize: 14,
    color: '#777',
    marginBottom: 5,
  },
  barcodeValue: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  scanAgainButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});