import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import styles from './styles';
import { Tag as TagType } from '../../models/Item';
interface ChipProps {
    tag: TagType;
    selected: boolean;
    handleTagToggle: (tag: TagType) => void;
}

const Chip: React.FC<ChipProps> = ({ tag, selected, handleTagToggle }) => {
    return (
        <TouchableOpacity
            key={tag.id}
            style={[
                styles.availableTag,
                selected && styles.selectedAvailableTag
        ]}
        onPress={() => handleTagToggle(tag)}
    >
        <Text style={[
            styles.availableTagText,
            selected && styles.selectedAvailableTagText
        ]}>
            {tag.tagName}
        </Text>
    </TouchableOpacity>
    );
}

export default Chip;