import { View, Text } from "react-native";
import { PaginationInfo } from "../../../../../models/Item";
import { SectionHeader, SectionHeaderLeft } from "../../../../../components";
import { styles } from "./style";

interface ItemLimiterProps {
    showLimitSelector: boolean;
    setShowLimitSelector: (show: boolean) => void;
    pagination: PaginationInfo;
    children: React.ReactNode;
    Icon: React.ReactElement;
}

const ItemLimiter = ({showLimitSelector, setShowLimitSelector, pagination, children, Icon}: ItemLimiterProps) => {
    return (
        <SectionHeader style={styles.toggleButton} onPress={() => setShowLimitSelector(!showLimitSelector)}>
            <SectionHeaderLeft Icon={Icon} title={`Items per page (${pagination.limit})`} >
                {children}
            </SectionHeaderLeft>
        </SectionHeader>
    )
}

export default ItemLimiter; 