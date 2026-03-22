import FilterBadge from "../../../../../components/Filter/FilterBadge";
import { Tag } from "../../../../../models/Item";
import Icon from "react-native-vector-icons/MaterialIcons";
import { SectionHeader, SectionHeaderLeft } from "../../../../../components";

interface FilterControllerProps {
    setShowTagFilter: (show: boolean) => void;
    showTagFilter: boolean;
    selectedTags: Tag[];
    Icon: React.ReactElement;
}

const FilterController = ({setShowTagFilter, showTagFilter, selectedTags, Icon}: FilterControllerProps) => {
    return (
        <SectionHeader
        onPress={() => setShowTagFilter(!showTagFilter)}
      >
        <SectionHeaderLeft Icon={Icon} title="Filter by Tags" > 
          {selectedTags.length > 0 && (
            <FilterBadge count={selectedTags.length} />  
          )}
        </SectionHeaderLeft>
      </SectionHeader>
    )
}

export default FilterController;