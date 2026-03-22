import { KeyboardType, StyleProp, TextInput, TextInputProps, StyleSheet } from 'react-native';


export interface AppBaseTextInputProps extends TextInputProps {
    value: string;
    keyboardType: KeyboardType;
    onChangeHandler: (text: string) => void;
    placeholder: string;
    editable: boolean;
    inputStyleProps?: StyleProp<any>;
}

export const AppBaseTextInput = ({ value, keyboardType, onChangeHandler, placeholder, editable, inputStyleProps }: AppBaseTextInputProps) => {
    return (
        <>
            <TextInput
                style={[styles.input, inputStyleProps]}
                value={value}
                keyboardType={keyboardType}
                onChangeText={onChangeHandler}
                placeholder={placeholder}
                editable={editable}
            />
        </>
    );
};
export default AppBaseTextInput;

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
    },
});