import { View, Text, TouchableOpacity, StyleProp, ViewStyle, TextStyle } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
interface IconButtonProps {
  icon: string;
  text: string;
  onPress: () => void;
  styles: {
    buttonStyle: StyleProp<ViewStyle>[];
    buttonText: StyleProp<TextStyle>[];
  };
  disabled?: boolean;
  children?: React.ReactNode;
}

const IconButton = ({ icon, text, onPress, styles, disabled, children }: IconButtonProps) => {
  if (disabled) {
    return (
      <TouchableOpacity
        style={styles.buttonStyle}
        onPress={onPress}
        disabled={disabled}
      >
        <Icon name={icon} size={18} color="#ffffff" style={{ marginRight: 6 }} />
        <Text style={styles.buttonText}>{text}</Text>
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity
      style={styles.buttonStyle}
      onPress={onPress}
    >
      <Icon name={icon} size={18} color="#ffffff" style={{ marginRight: 6 }} />
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  )
}

export default IconButton;