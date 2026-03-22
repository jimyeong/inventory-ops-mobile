import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { pageStyles } from '../../screens/ItemStockDetailScreen/ui/styles';

interface BarcodeErrorProps {
    error: string;
    onPressScanAgain: () => void;
    getItemById: (barcode: string) => void;
    barcode: string;
    styles: any | undefined;
}
const BarcodeError = ({ error, onPressScanAgain, getItemById, barcode, styles }: BarcodeErrorProps) => {
    const handleRetry = ()=>{
        getItemById(barcode);
    }
    return (

        <SafeAreaView style={styles.container}>
            <View style={styles.errorContainer}>
                <Icon name="error-outline" size={60} color="#e74c3c" />
                <Text style={styles.errorTitle}>Error Loading Item</Text>
                <Text style={pageStyles.errorMessage}>{error || 'Item not found'}</Text>
                <TouchableOpacity
                    style={pageStyles.retryButton}
                    onPress={handleRetry}
                >
                    <Text style={pageStyles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={pageStyles.scanAgainButton}
                    onPress={onPressScanAgain}
                >
                    <Text style={pageStyles.buttonText}>Scan Different Item</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default BarcodeError;