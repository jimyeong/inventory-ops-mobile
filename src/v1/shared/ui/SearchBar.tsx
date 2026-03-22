import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export interface SearchBarProps {
  // Required props
  value: string;
  onChangeText: (text: string) => void;

  // Optional props
  placeholder?: string;
  onSearch?: () => void;
  onClear?: () => void;

  // State
  isSearching?: boolean;
  disabled?: boolean;

  // Styling
  containerStyle?: ViewStyle;

  // UI options
  showSearchIcon?: boolean;
  showClearButton?: boolean;
  showSearchButton?: boolean;
}

/**
 * Pure UI SearchBar Component
 *
 * A simple, reusable search bar without internal state management.
 * All state is controlled by the parent component.
 *
 * @example
 * const [query, setQuery] = useState('');
 *
 * <SearchBar
 *   value={query}
 *   onChangeText={setQuery}
 *   placeholder="Search items..."
 *   onSearch={() => console.log('Search:', query)}
 * />
 */
const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  onSearch,
  onClear,
  isSearching = false,
  disabled = false,
  containerStyle,
  showSearchIcon = true,
  showClearButton = true,
  showSearchButton = true,
}) => {
  const handleClear = () => {
    onChangeText('');
    onClear?.();
  };

  const handleSearch = () => {
    if (value.trim() && onSearch) {
      onSearch();
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.inputRow}>
        {/* Search Icon */}
        {showSearchIcon && (
          <Icon name="search" size={20} color="#7f8c8d" style={styles.searchIcon} />
        )}

        {/* Text Input */}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#95a5a6"
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          editable={!disabled}
          keyboardType="numeric"
        />

        {/* Clear Button */}
        {showClearButton && value.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Icon name="clear" size={20} color="#7f8c8d" />
          </TouchableOpacity>
        )}

        {/* Search Button */}
        {showSearchButton && (
          <TouchableOpacity
            style={[
              styles.searchButton,
              (disabled || isSearching || !value.trim()) && styles.searchButtonDisabled,
            ]}
            onPress={handleSearch}
            disabled={disabled || isSearching || !value.trim()}
          >
            {isSearching ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Icon name="search" size={22} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ecf0f1',
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: '#2c3e50',
  },
  clearButton: {
    padding: 4,
    marginLeft: 4,
  },
  searchButton: {
    backgroundColor: '#3498db',
    marginLeft: 8,
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: 42,
    height: 42,
  },
  searchButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
});

export default SearchBar;
