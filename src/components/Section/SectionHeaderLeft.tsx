import { View, Text } from "react-native";
import { styles } from "./style";

interface SectionHeaderLeftProps {
    children: React.ReactNode;
    Icon: React.ReactElement;
    title: string;
}

const SectionHeaderLeft = ({children, Icon, title}: SectionHeaderLeftProps) => {
    return (
        <View style={styles.sectionHeaderLeft}>
            {Icon}
            <Text style={styles.sectionTitle}>{title}</Text>
            {children}
        </View>
    )
}

export default SectionHeaderLeft;