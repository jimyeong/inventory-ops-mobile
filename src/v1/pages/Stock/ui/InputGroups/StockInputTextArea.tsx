import { Text } from "react-native";
import { styles } from "../../../../../components/Section/style";
import AppBaseTextInput from "../../../../shared/ui/Inputs/AppBaseTextInput";
import { StyleSheet } from "react-native";
import { AppBaseTextInputProps } from "../../../../shared/ui/Inputs/AppBaseTextInput";


interface StockInputTextAreaProps extends AppBaseTextInputProps {
    labelName: string;
    multiline?: boolean;
    numberOfLines?: number;
    textAlignVertical?: 'top' | 'bottom' | 'center';
}

const StockInputTextArea = ({ labelName, multiline, numberOfLines, textAlignVertical, ...props }: StockInputTextAreaProps) => {
    return (
        <>
            <Text style={inputStyle.label}>{labelName}</Text>
            <AppBaseTextInput
                {...props}
            />
        </>
    );
};

export default StockInputTextArea;
const inputStyle = StyleSheet.create({
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
})