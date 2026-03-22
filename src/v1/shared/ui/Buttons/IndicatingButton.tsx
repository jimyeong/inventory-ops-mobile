import React from 'react';
import { TouchableOpacity, ActivityIndicator, Text, StyleSheet, ViewStyle   } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';



// style.button: {
//     backgroundColor: '#808080',
// },
interface IndicatingButtonPropsType {
    onPress: () => void;
    disabled?: boolean;
    loading?: boolean;
    label?: string;
    icon?: string;
    style?: ViewStyle;
}
const IndicatingButton = ({
    onPress,
    disabled = false,
    loading = false,
    icon = 'add-circle',
    style,
    label = 'Button Title'}: IndicatingButtonPropsType) => {
    return (
        <TouchableOpacity style={[styles.button, style]} onPress={onPress} disabled={disabled || loading} activeOpacity={0.7}>

            {loading ? (
                <ActivityIndicator size="small" color="#ffffff" style={styles.loader} />
            ) : (
                <Icon name={icon} size={20} color="#ffffff" style={styles.icon} />
            )}
            <Text style={styles.buttonText}>{loading ? 'Loading...' : label}</Text>
        </TouchableOpacity>
    );
};

export default IndicatingButton;
const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#808080',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
        gap: 8,
    },
    buttonDisabled: {
        backgroundColor: '#95a5a6',
        opacity: 0.6,
        shadowOpacity: 0,
        elevation: 0,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    icon: {
        marginRight: 4,
    },
    loader: {
        marginRight: 4,
    },
});