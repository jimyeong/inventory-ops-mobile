import { View, Text } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

const EmptyStockList = ({styles}: {styles: any}) => {
    return (
        <View style={styles.emptyStockContainer}>
            <Icon name="remove-shopping-cart" size={40} color="#bdc3c7" />
            <Text style={styles.emptyStockText}>No stock information available</Text>
        </View>
    )
}

export default EmptyStockList;  