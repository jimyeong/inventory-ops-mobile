import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StyleSheet } from 'react-native';


interface NoProblemUIProps {
    title: string;
    message: string;
}

const NoProblemUI = ({ title, message }: NoProblemUIProps) => {
    return (
        <View style={styles.emptyContainer}>
            <Icon name="check-circle" size={48} color="#2ecc71" />
            <Text style={styles.emptyText}>{title}</Text>
            <Text style={styles.emptySubtext}>{message}</Text>
        </View>
    );
};
export default NoProblemUI;

const styles = StyleSheet.create({
    emptyContainer: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2ecc71',
        marginTop: 12,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#7f8c8d',
        marginTop: 4,
    },
})