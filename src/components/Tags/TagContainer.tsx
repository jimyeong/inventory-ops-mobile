import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Tag } from '../../models/Item';
import styles from './styles';

interface TagContainerProps {
    tags: Tag[];
    selectedTags: Tag[];
    handleTagToggle: (tag: Tag) => void;
    children: React.ReactNode;
}
const TagContainer: React.FC<TagContainerProps> = ({ tags, selectedTags, handleTagToggle}) => {
    return (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>Available Tags</Text>
            <View style={styles.availableTagsContainer}>
                {tags.map((tag) => {
                    const isSelected = selectedTags.some(t => t.id === tag.id);
                    return (
                        <TouchableOpacity
                            key={tag.id}
                            style={[
                                styles.availableTag,
                                isSelected && styles.selectedAvailableTag
                            ]}
                            onPress={() => handleTagToggle(tag)}
                        >
                            <Text style={[
                                styles.availableTagText,
                                isSelected && styles.selectedAvailableTagText
                            ]}>
                                {tag.tag_name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

export default TagContainer;