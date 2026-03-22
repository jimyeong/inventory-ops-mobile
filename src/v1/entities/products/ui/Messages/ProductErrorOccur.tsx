import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import ProblemUI from '../../../../shared/ui/Errors/ProblemUI';

export const ProductErrorOccur = ({ message }: { message: string }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <ProblemUI title="Error" message={message} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f7fa',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
