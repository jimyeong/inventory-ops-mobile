import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Tag } from '../../models/type';

export default function TagChip({ tag }: { tag: Tag }) {
    return (
        <TouchableOpacity style={styles.tag}>
            <Text style={styles.tagText}>{tag.tag_name}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    // for tag wrapper container
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
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

    tagText: {
        fontSize: 11,
        color: '#1976d2',
        fontWeight: '500',
    },
});