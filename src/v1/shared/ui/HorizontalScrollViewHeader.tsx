import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StyleSheet } from 'react-native';

interface HorizontalScrollViewHeaderProps {
    title: string;
    count: number;
    Icon: React.ReactElement;
}
const HorizontalScrollViewHeader = ({ title , count=0, Icon }: HorizontalScrollViewHeaderProps) => {
    return (

        <View style={styles.header}>
            <View style={styles.headerLeft}>
                {Icon}
                <Text style={styles.headerTitle}>{title}</Text>
            </View>
            {count > 0 && (
                <View style={styles.countBadge}>
                    <Text style={styles.countText}>{count}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2c3e50',
    },
    countBadge: {
        backgroundColor: '#e74c3c',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    countText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ffffff',
    },
});

export default HorizontalScrollViewHeader;