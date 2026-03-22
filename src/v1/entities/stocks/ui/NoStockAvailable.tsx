import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const NoStockAvailable = () => {
    return (

        <View style={styles.emptyState}>
            <Icon name="inventory-2" size={64} color="#bdc3c7" />
            <Text style={styles.emptyStateText}>No stock available</Text>
            <Text style={styles.emptyStateSubtext}>This product has no stock records</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#7f8c8d',
        marginTop: 16,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: '#95a5a6',
        marginTop: 8,
    },
});

export default NoStockAvailable;