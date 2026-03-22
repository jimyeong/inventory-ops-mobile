import React from 'react';
import { View, Text, StyleSheet } from 'react-native';



export default function ExpiryTotalLabel({ total, label, isExpiredPanelOpen,  }: { total: number, label: string, isExpiredPanelOpen: boolean }) {
    if (isExpiredPanelOpen) {
        return (
            <View style={styles.summaryContainer}>
                <Text style={styles.summaryText}>
                    {total} item{total !== 1 ? 's' : ''} Expired
                </Text>
            </View>
        )
    }
    return (
        <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>
                {total} item{total !== 1 ? 's' : ''} expiring in {label} day range
            </Text>
        </View>
    );
}
const styles = StyleSheet.create({
    summaryContainer: {
        backgroundColor: '#fff',
        padding: 16,
    },
    summaryText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});