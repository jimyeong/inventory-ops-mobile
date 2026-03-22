import React from 'react';
import { View, Text } from 'react-native';
import { Product } from '../../models/types';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { imgServer } from '../../../../../services/ApiService';
import { Image } from 'react-native';

import BaseProductCard from './BaseProductCard';


interface UrgentProductCardProps {
    product: Product;
    onPress?: (product: Product) => void;
}
const UrgentProductCard = ({ product, onPress }: UrgentProductCardProps) => {
    return (
        <BaseProductCard product={product} onPress={onPress} />
    );
};
export default UrgentProductCard;
