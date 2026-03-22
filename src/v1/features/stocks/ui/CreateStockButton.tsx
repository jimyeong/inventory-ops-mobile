import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IndicatingButton from '../../../shared/ui/Buttons/IndicatingButton';

interface CreateStockButtonPropsType {
    onPress: () => void;
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
    label?: string;
}

const CreateStockButton = ({
    onPress,
    disabled = false,
    loading = false,
    style,
    label = 'Create Stock'
}: CreateStockButtonPropsType) => {
    return (
        <IndicatingButton onPress={onPress} disabled={disabled} loading={loading} label={label} icon="add-circle" style={styles.button} />
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#27ae60',
    },
});

export default CreateStockButton;