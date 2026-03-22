import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SearchBar from '../../../../shared/ui/SearchBar';
import { ProductSearchBarProps, ProductSearchType } from '../model/type';
/**
 * ProductSearchBar Component
 *
 * A specialized search bar for product searching with search type selection.
 * Built on top of the pure SearchBar component.
 *
 * @example
 * const [query, setQuery] = useState('');
 * const [searching, setSearching] = useState(false);
 *
 * const handleSearch = async (query: string, type: ProductSearchType) => {
 *   setSearching(true);
 *   const results = await ItemService.lookupItems(type, query);
 *   setSearching(false);
 * };
 *
 * <ProductSearchBar
 *   value={query}
 *   onChangeText={setQuery}
 *   onSearch={handleSearch}
 *   isSearching={searching}
 * />
 */
const ProductSearchBar: React.FC<ProductSearchBarProps> = ({
  value,
  onChangeText,
  onSearch,
  searchTypes = ['code'],
  defaultSearchType = 'code',
  isSearching = false,
  disabled = false,
  containerStyle,
  showTypeSelector = true,
}) => {
  const [searchType, setSearchType] = useState<ProductSearchType>(defaultSearchType);
  const [showTypeMenu, setShowTypeMenu] = useState(false);

  const handleSearch = () => {
    if (value.trim()) {
      onSearch(value, searchType);
    }
  };

  const getSearchTypeLabel = () => {
    switch (searchType) {
      case 'code':
        return 'Code';
    //   case 'barcode':
    //     return 'Barcode';
    //   case 'name':
            // return "Code";
      default:
        return 'Code';
    }
  };

  const getPlaceholder = () => {
    return `Search by ${getSearchTypeLabel().toLowerCase()}...`;
  };

  return (
    <View style={[styles.container, containerStyle, {padding:16}]}>
      <View style={styles.searchRow}>
        {/* Search Type Selector */}
        {showTypeSelector && searchTypes.length >= 1 && (
          <TouchableOpacity
            style={styles.typeButton}
            onPress={() => setShowTypeMenu(!showTypeMenu)}
            disabled={disabled}
          >
            <Text style={styles.typeButtonText}>{getSearchTypeLabel()}</Text>
            <Icon name="arrow-drop-down" size={20} color="#3498db" />
          </TouchableOpacity>
        )}

        {/* Search Bar */}
        <View style={styles.searchBarWrapper}>
          <SearchBar
            value={value}
            onChangeText={onChangeText}
            placeholder={getPlaceholder()}
            onSearch={handleSearch}
            isSearching={isSearching}
            disabled={disabled}
            containerStyle={styles.searchBarContainer}
          />
        </View>
      </View>

      {/* Search Type Dropdown Menu */}
      {showTypeMenu && searchTypes.length > 1 && (
        <View style={styles.typeMenu}>
          {searchTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeOption,
                searchType === type && styles.activeTypeOption,
              ]}
              onPress={() => {
                setSearchType(type);
                setShowTypeMenu(false);
              }}
            >
              <Text
                style={[
                  styles.typeOptionText,
                  searchType === type && styles.activeTypeOptionText,
                ]}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
              {searchType === type && (
                <Icon name="check" size={20} color="#3498db" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Inline Type Tabs (Alternative to Dropdown) */}
      {showTypeSelector && searchTypes.length > 1 && searchTypes.length <= 3 && !showTypeMenu && (
        <View style={styles.typeTabsContainer}>
          {searchTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeTab,
                searchType === type && styles.activeTypeTab,
              ]}
              onPress={() => setSearchType(type)}
              disabled={disabled}
            >
              <Text
                style={[
                  styles.typeTabText,
                  searchType === type && styles.activeTypeTabText,
                ]}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 12,
    gap: 10,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 90,
  },
  typeButtonText: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '600',
    marginRight: 4,
  },
  searchBarWrapper: {
    flex: 1,
  },
  searchBarContainer: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  typeMenu: {
    backgroundColor: '#ffffff',
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ecf0f1',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  typeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  activeTypeOption: {
    backgroundColor: '#e3f2fd',
  },
  typeOptionText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  activeTypeOptionText: {
    color: '#3498db',
    fontWeight: '600',
  },
  typeTabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 12,
    gap: 8,
  },
  typeTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  activeTypeTab: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  typeTabText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  activeTypeTabText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default ProductSearchBar;
