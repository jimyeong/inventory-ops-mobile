import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f9f9f9',
    },
    keyboardAvoid: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 24,
      color: '#2c3e50',
    },
    itemDetails: {
      backgroundColor: '#ffffff',
      borderRadius: 10,
      padding: 20,
      marginBottom: 20,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
    itemName: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 8,
      color: '#2c3e50',
    },
    itemBarcode: {
      fontSize: 16,
      color: '#666666',
      marginBottom: 8,
    },
    itemId: {
      fontSize: 14,
      color: '#95a5a6',
      marginBottom: 12,
    },
    stockInfo: {
      marginTop: 8,
      backgroundColor: '#f8f9fa',
      borderRadius: 8,
      padding: 12,
    },
    itemStockLabel: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
      color: '#34495e',
    },
    noStock: {
      fontSize: 14,
      color: '#95a5a6',
      fontStyle: 'italic',
    },
    stockNumbers: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    stockItem: {
      fontSize: 15,
    },
    stockLabel: {
      color: '#7f8c8d',
    },
    stockCount: {
      fontWeight: 'bold',
      color: '#2ecc71',
    },
    formContainer: {
      backgroundColor: '#ffffff',
      borderRadius: 10,
      padding: 20,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
      marginTop: 8,
      color: '#3498db',
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#ecf0f1',
    },
    label: {
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 8,
      color: '#34495e',
    },
    input: {
      backgroundColor: '#f5f7fa',
      borderWidth: 1,
      borderColor: '#e1e8ed',
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      marginBottom: 20,
    },
    notesInput: {
      height: 100,
      textAlignVertical: 'top',
    },
    stockTypeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    stockTypeButton: {
      flex: 1,
      backgroundColor: '#f5f7fa',
      borderWidth: 1,
      borderColor: '#e1e8ed',
      padding: 12,
      margin: 4,
      borderRadius: 8,
      alignItems: 'center',
    },
    selectedStockTypeButton: {
      backgroundColor: '#3498db',
      borderColor: '#3498db',
    },
    stockTypeText: {
      fontSize: 14,
      fontWeight: '500',
      color: '#34495e',
    },
    selectedStockTypeText: {
      color: '#FFFFFF',
    },
    datePickerButton: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#f5f7fa',
      borderWidth: 1,
      borderColor: '#e1e8ed',
      borderRadius: 8,
      padding: 12,
      marginBottom: 20,
    },
    dateText: {
      fontSize: 16,
      color: '#34495e',
    },
    errorText: {
      color: '#e74c3c',
      marginBottom: 15,
      fontSize: 14,
    },
    submitButton: {
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 15,
      marginTop: 10,
    },
    stockInButton: {
      backgroundColor: '#2ecc71',
    },
    stockOutButton: {
      backgroundColor: '#e74c3c',
    },
    disabledButton: {
      opacity: 0.7,
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    cancelButton: {
      backgroundColor: '#e74c3c',
      alignItems: 'center',
      padding: 10,
    },
    cancelText: {
      color: '#3498db',
      fontSize: 16,
    },
  });