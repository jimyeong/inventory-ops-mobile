import { View, Text } from 'react-native';
import { Product } from '../../../../entities/products/models/types';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { imgServer } from '../../../../../services/ApiService';
import {Image} from 'react-native';
interface ExpiredProductCardProps {
    product: Product;
    onPress?: (product: Product) => void;
}
const ExpiredProductCard = ({ product, onPress }: ExpiredProductCardProps) => {
    return (

        <TouchableOpacity
            style={styles.card}
            onPress={() => onPress?.(product)}
            activeOpacity={0.7}
        >
            {/* Product Image */}
            <View style={styles.imageContainer}>
                {product.image_path ? (
                    <Image
                        source={{ uri: imgServer + product.image_path }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <Icon name="image" size={40} color="#bdc3c7" />
                    </View>
                )}
                {/* Expired Badge */}
                <View style={styles.expiredBadge}>
                    <Icon name="warning" size={14} color="#ffffff" />
                    <Text style={styles.expiredText}>Expired</Text>
                </View>
            </View>

            {/* Product Info */}
            <View style={styles.infoContainer}>
                <Text style={styles.name} numberOfLines={2}>
                    {product.name_kor || product.name_eng || product.name || 'No Name'}
                </Text>

                <View style={styles.codeRow}>
                    <Icon name="qr-code" size={12} color="#7f8c8d" />
                    <Text style={styles.codeText} numberOfLines={1}>
                        {product.code}
                    </Text>
                </View>

                <View style={styles.priceRow}>
                    <Text style={styles.priceText}>
                        £{product.price?.toFixed(2) || 'N/A'}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};
export default ExpiredProductCard;

const styles = StyleSheet.create({

    container: {
        backgroundColor: '#ffffff',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ecf0f1',
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 12,
    },
    card: {
        width: 160,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#ecf0f1',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    imageContainer: {
        width: '100%',
        height: 120,
        backgroundColor: '#f8f9fa',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imagePlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ecf0f1',
    },
    expiredBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#e74c3c',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    expiredText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#ffffff',
    },
    codeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 6,
    },
    codeText: {
        fontSize: 11,
        color: '#7f8c8d',
        flex: 1,
    },
    priceRow: {
        marginTop: 4,
    },

    infoContainer: {
        padding: 12,
    },
    
    name: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 6,
        minHeight: 36,
    },
    priceText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#e74c3c',
    },

})