import { KeyboardType, StyleProp, TextInputProps, TextStyle, View } from "react-native";
import AppBaseTextInput, { AppBaseTextInputProps } from "../../../../shared/ui/Inputs/AppBaseTextInput";
import { Text } from "react-native";
import { styles } from "../../../../../components/Section/style";
import { StyleSheet, ViewStyle } from "react-native";

export interface StockInputTextProps extends AppBaseTextInputProps {
    labelName: string;
    labelStyleProps?: StyleProp<TextStyle>;
}

const StockInputText = ({ labelName, labelStyleProps, ...props }: StockInputTextProps) => {
    return (
        <>
            <Text style={[inputStyle.label, labelStyleProps]}>{labelName}</Text>
            <AppBaseTextInput
                {...props}
            />
        </>
    );
};

const inputStyle = StyleSheet.create({
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
})

export default StockInputText;