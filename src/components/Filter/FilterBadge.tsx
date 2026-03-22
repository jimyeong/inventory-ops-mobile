import { View, Text } from "react-native";
import { styles } from "./style";

const FilterBadge = ({ count }: { count: number }) => {
    return (
        <View style={styles.filterBadge}>
          <Text style={styles.filterBadgeText}>{count}</Text>
        </View>
    )
}

export default FilterBadge;