import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ProductNotFound = () => {
    return (
        <View style={styles.errorContainer}>
            <Icon name="error-outline" size={64} color="#e74c3c" />
            <Text style={styles.errorText}>Product not found</Text>
        </View>
    );
};

export default ProductNotFound;

const styles = StyleSheet.create({
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#e74c3c',
        marginTop: 16,
    },
});