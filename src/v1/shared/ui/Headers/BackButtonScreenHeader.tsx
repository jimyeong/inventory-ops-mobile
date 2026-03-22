import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TouchableOpacity, TextStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface ScreenHeaderProps {
    title: string;
    onBackPress: () => void;
    containerStyle?: StyleProp<ViewStyle>;
    buttonStyle?: StyleProp<ViewStyle>;
    icon: string;
    iconSize?: number;
    iconColor?: string;
    children?: React.ReactNode;
    titleStyle?: StyleProp<TextStyle>;
}

const BackButtonScreenHeader = ({ title, onBackPress, containerStyle, buttonStyle, icon, iconSize, iconColor ='#2c3e50', children }: ScreenHeaderProps) => {
    return (
        <View style={[styles.header, containerStyle]}>
            <TouchableOpacity onPress={onBackPress} style={buttonStyle}>
                <Icon name={icon} size={22} color={iconColor} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Product</Text>
            {children}
        </View>
    );
};

export default BackButtonScreenHeader;
const styles = StyleSheet.create({
    /* Header */
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        flex: 1,
        fontSize: 18,
        paddingLeft: 16,
    },
});