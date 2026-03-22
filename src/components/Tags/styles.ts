import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    inputGroup: {
        marginBottom: 20,
        paddingHorizontal: 4,
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 12,
    },
    availableTagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        paddingVertical: 4,
    },
    availableTag: {
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#e9ecef',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    selectedAvailableTag: {
        backgroundColor: '#4f46e5',
        borderColor: '#4338ca',
        shadowColor: '#4f46e5',
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    availableTagText: {
        color: '#495057',
        fontSize: 14,
        fontWeight: '500',
    },
    selectedAvailableTagText: {
        color: '#ffffff',
        fontWeight: '600',
    },
});

export default styles;