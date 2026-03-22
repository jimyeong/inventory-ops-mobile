import { View, Text } from 'react-native';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface ProblemUIProps {
    title: string;
    message: string;
}

const ProblemUI = ({ title, message }: ProblemUIProps) => {
    return (
        <View style={styles.container}>
            <Icon name="error-outline" size={48} color="#e74c3c" />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
        </View>
    );
};
export default ProblemUI;

const styles = StyleSheet.create({
    
    container: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#e74c3c',
        marginTop: 12,
    },
    message: {
        fontSize: 14,
        color: '#7f8c8d',
        marginTop: 4,
    },
});