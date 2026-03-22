import { Product } from '../../models/types';
import { TouchableOpacity, StyleSheet } from 'react-native';
import BaseProductCard from './BaseProductCard';
import ExpiredLabel from '../../../stocks/ui/Labels/ExpiredLabel';

interface ExpiryProductCardProps {
    product: Product;
    onPress?: (product: Product) => void;
}

const ExpiryProductCard = ({ product, onPress }: ExpiryProductCardProps) => {
    const expiredBadgeStyle =
    {
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
    }
    const expiredTextStyle = {
        fontSize: 10,
        fontWeight: '600',
        color: '#ffffff',
    }
    return (
        <BaseProductCard
            product={product}
            onPress={onPress}
            ExpiredLabel={<ExpiredLabel expiredBadgeStyle={expiredBadgeStyle} expiredTextStyle={expiredTextStyle} expiredIcon="warning" expiredText="Expired" />}
        />
    );
};

export default ExpiryProductCard;

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ecf0f1',
    },
});