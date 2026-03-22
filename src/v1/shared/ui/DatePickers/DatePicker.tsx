import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StyleProp, ViewStyle, TextStyle } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface DatePickerProps {
    labelName: string;
    onPress: () => void;
    isLoading: boolean;
    showDatePicker: boolean;
    handleDateChange: (event: any, selectedDate?: Date) => void;
    selectedDate: Date;
    minimumDate: Date;
    containerStyle?: StyleProp<ViewStyle>;
    buttonStyle?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>;
}

const DatePicker = ({labelName,onPress, minimumDate,isLoading, showDatePicker, handleDateChange, selectedDate, containerStyle, buttonStyle, labelStyle}: DatePickerProps) => {
    return (
        <View style={[styles.container, containerStyle]}>
            <Text style={[styles.label, labelStyle]}>{labelName}</Text>
            <TouchableOpacity
                style={[styles.dateButton, buttonStyle]}
                onPress={onPress}
                disabled={isLoading}
            >
                <Icon name="calendar-today" size={20} color="#666" />
                <Text style={styles.dateText}>
                    {selectedDate.toLocaleDateString()}
                </Text>
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    minimumDate={minimumDate ?? new Date()}
                    />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#fff',
    },
    dateText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 8,
    },
})

export default DatePicker;