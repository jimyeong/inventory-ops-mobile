import { View, Text, TouchableOpacity, ActivityIndicator, StyleProp, ViewStyle, TextStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface IndicatorButtonProps {
    icon: string;
    text: string;
    onPress: () => void;
    styles: {
        buttonStyle: StyleProp<ViewStyle>;
        buttonText: StyleProp<TextStyle>;
    };
    disabled?: boolean;
}

const defaultTextStyles:StyleProp<TextStyle> = {
    color: 'white',
    fontWeight: 500,
    lineHeight: 20,
    fontSize: 16,
}
const defaultShapeStyles:StyleProp<ViewStyle> = {
    backgroundColor: '#1D4ED8',
    borderRadius: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    marginRight: 5,
    alignItems: 'center',
    
}


const IndicatorButton = ({ icon, text, onPress, disabled, styles={buttonStyle: defaultShapeStyles, buttonText: defaultTextStyles} }: IndicatorButtonProps) => {
    return (
        <TouchableOpacity onPress={onPress} disabled={disabled} style={styles.buttonStyle} >
            {disabled ? (
                <ActivityIndicator size="small" color="#ffffff" />
            ) : (
                <>
                    <Icon name={icon} size={16} color="#ffffff" style={styles.buttonText} />
                    <Text style={styles.buttonText}>{text}</Text>
                </>
            )}
        </TouchableOpacity>
    )
}

export default IndicatorButton;