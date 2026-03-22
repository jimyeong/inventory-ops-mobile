import { View } from "react-native";
import { Tag } from "../../../../../models/Item";
import { Chip, TagContainer } from "../../../../../components";
import { styles } from "./style";
import React from "react";

const FilterByTag = ({ showTagFilter, tags, selectedTags, handleTagToggle }: { showTagFilter: boolean, tags: Tag[], selectedTags: Tag[], handleTagToggle: (tag: Tag) => void }) => {
    return (
        <React.Fragment>
            {showTagFilter && (
                <View style={styles.tagFilterContent}>
                    <TagContainer tags={tags} selectedTags={selectedTags} handleTagToggle={handleTagToggle} >
                        {selectedTags.map((tag) => (
                            <Chip key={tag.id} tag={tag} selected={true} handleTagToggle={handleTagToggle} />
                        ))}
                    </TagContainer>
                </View>
            )}
        </React.Fragment>
    )
}

export default FilterByTag;