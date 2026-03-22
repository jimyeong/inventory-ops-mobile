import { View, Text, StyleSheet } from 'react-native';

export default function MoreTag({ tagCount }: { tagCount: number }) {
    return (
        <View style={[styles.tag, styles.moreTagsIndicator]}>
            <Text style={styles.tagText}>+{tagCount}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    tag: {
        backgroundColor: '#e3f2fd',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 6,
        marginBottom: 4,
        borderWidth: 1,
        borderColor: '#bbdefb',
        shadowColor: '#1976d2',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
        elevation: 2,
    },
    moreTagsIndicator: {
        backgroundColor: '#f5f5f5',
        borderColor: '#e0e0e0',
    },
    tagText: {
        fontSize: 11,
        color: '#1976d2',
        fontWeight: '500',
    },
});