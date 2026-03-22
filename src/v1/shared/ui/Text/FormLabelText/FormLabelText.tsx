import { Text, TextProps, StyleSheet } from 'react-native';
import React from 'react';

interface FormLabelTextProps extends TextProps {
    label: string;
}

const FormLabelText = ({ label, ...props }: FormLabelTextProps) => {
    return <Text style={styles.label} {...props}>{label}</Text>;
};

const styles = StyleSheet.create({
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
}); 
export default FormLabelText;