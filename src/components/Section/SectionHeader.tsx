import { View, Text, TouchableOpacity, StyleProp, ViewStyle } from "react-native";
import { styles } from "./style";

interface SectionHeaderProps {
    onPress: () => void;
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

const SectionHeader = ({onPress, children, style}: SectionHeaderProps) => {
    return (
        <TouchableOpacity
        style={[styles.sectionHeader, style]}
        onPress={onPress}
      >
        {children}
      </TouchableOpacity>
    )
}

export default SectionHeader;