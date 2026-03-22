import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TextInput,
  Modal,
  SafeAreaView,
  BackHandler,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Item, PaginatedItemsResponse, PaginationInfo, Tag, SearchResultItem } from '../../models/Item';
import { ROOT_PARAM_LIST } from '../../models/navigation';
import ItemService from '../../services/ItemService';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CardImageHolder, Chip, TagContainer } from '../../components';
import ItemCard from './ui/components/Cards/ItemCard';
import { item_styles } from './ui/styles';
import FilterByTag from './ui/components/Filters/FilterByTag';
import FilterController from './ui/components/Filters/FilterController';
import ItemLimiter from './ui/components/Filters/ItemLimiter';
import { SearchType } from '../../services/ItemService';  
import SearchedItemCard from './ui/components/Cards/SearchedItemCard';

type NavigationProp = NativeStackNavigationProp<ROOT_PARAM_LIST>;

const LIMIT_OPTIONS = [5, 10, 15, 20, 30, 40, 50];

const FillOutItemInfo = () => {
  const navigation = useNavigation<NavigationProp>();
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showLimitSelector, setShowLimitSelector] = useState(false);
  const [showTagFilter, setShowTagFilter] = useState(false);

  // Search states
  const [showSearch, setShowSearch] = useState(false);
  const [searchType, setSearchType] = useState<'code' | 'barcode' | 'name'>('code');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total_items: 0,
    has_next: false,
    has_prev: false,
  });

  useEffect(() => {
    fetchItems(selectedTags, false);
    fetchTags();
  }, [pagination.page, pagination.limit]);

  const fetchTags = async () => {
    const response = await ItemService.getTags();
    if (response.success) {

      setAllTags(response.payload.tags);
    }
  }

  const fetchItems = async (selectedTags: Tag[] = [], isRefresh: boolean = false) => {
    try {

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      let tagParams = {}
      let response: PaginatedItemsResponse
      if (selectedTags.length > 0) {
        const selectedTagParam = selectedTags.map(selected => selected.tag_name).join("&tag=");
        response = await ItemService.getItemsPaginated(
          pagination.page,
          pagination.limit,
          selectedTagParam
        );
      } else {
        response = await ItemService.getItemsPaginated(
          pagination.page,
          pagination.limit,
        );
      }
      if (response.success) {
        // sort items by id
        setItems(response.payload.items.sort((a: Item, b: Item) => parseInt(a.id) - parseInt(b.id)));
        setPagination(response.payload.pagination);
      } else {
        Alert.alert('Error', response.message || 'Failed to fetch items');
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      Alert.alert('Error', 'Failed to fetch items. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchItems(selectedTags, true);
  };
  const handleItemInfoEdit = (item: Item) => {
    navigation.navigate('ItemDetailEdit', { itemId: item.id, item: item });
  }
  const handleItemStockEdit = (item: Item) => {
    navigation.navigate('ScannedItemDetail', { itemId: item.id });
  }
  const handlePreviousPage = () => {
    if (pagination.has_prev) {
      setPagination(prev => ({ ...prev, page: prev.page - 1 }));
    }
  };
  const handleNextPage = () => {
    if (pagination.has_next) {
      setPagination(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };
  const handleLimitChange = (newLimit: number) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
  };
  const handleTagToggle = (tag: Tag) => {
    const isSelected = selectedTags.some(t => t.id === tag.id)
    let newSelectedTags = []
    if (isSelected) {
      newSelectedTags = selectedTags.filter(t => t.id !== tag.id)
    } else {
      newSelectedTags = [...selectedTags, tag]
    }
    setSelectedTags(newSelectedTags)
    fetchItems(newSelectedTags, false);
  };

  // Search functionality
  const performSearch = async (searchType: SearchType, value: string) => {
    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      const results = await ItemService.lookupItems(searchType as SearchType, value.trim());
      setSearchResults(results.payload.searchItems);
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Error', 'Failed to search items. Please try again.');
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const debouncedSearch = useCallback((searchType: SearchType, value: string) => {
    if (value.length < 3) {
      setSearchResults([]);
      return;
    }
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (searchType === 'barcode') {
      // No debouncing for barcode
      performSearch(searchType, value);
    } else {
      // Debounce for code and name
      debounceRef.current = setTimeout(() => {
        performSearch(searchType, value);
      }, 500);
    }
  }, []);

  const handleSearchQueryChange = (value: string) => {
    setSearchQuery(value);
    debouncedSearch(searchType, value);
  };

  const handleSearchTypeChange = (type: SearchType) => {
    setSearchType(type);
    setSearchQuery('');
    setSearchResults([]);

    if (type === 'barcode') {
      // Open barcode scanner
      navigation.navigate('Scanner', {
        returnScreen: 'FilloutItemInfo',
        searchMode: true
      } as never);
    }
  };
  const handleSelectSearchResult = (selectedItem: Item) => {
    navigation.navigate('ScannedItemDetail', {
      itemId: selectedItem.id
    });
    handleCloseSearch();
  };
  // Handle modal close
  const handleCloseSearch = () => {
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  // Handle hardware back button
  useEffect(() => {
    const backAction = () => {
      if (showSearch) {
        handleCloseSearch();
        return true; // Prevent default behavior
      }
      return false; // Let default behavior happen
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [showSearch]);

  // Clean up debounce timeout
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);
  const renderItem = ({ item }: { item: Item }) => (<ItemCard ImageHolder={<CardImageHolder item={item} />} item={item} handleItemInfoEdit={handleItemInfoEdit} handleItemStockEdit={handleItemStockEdit} />)


  const renderLimitSelector = () => (
    <View style={item_styles.limitSelector}>
      <Text style={item_styles.limitLabel}>Choose items per page:</Text>
      <View style={item_styles.limitOptions}>
        {LIMIT_OPTIONS.map((limit) => (
          <TouchableOpacity
            key={limit}
            style={[
              item_styles.limitButton,
              pagination.limit === limit && item_styles.activeLimitButton
            ]}
            onPress={() => handleLimitChange(limit)}
          >
            <Text style={[
              item_styles.limitButtonText,
              pagination.limit === limit && item_styles.activeLimitButtonText
            ]}>
              {limit}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderPaginationControls = () => (
    <View style={item_styles.paginationContainer}>
      <TouchableOpacity
        style={[item_styles.paginationButton, !pagination.has_prev && item_styles.disabledButton]}
        onPress={handlePreviousPage}
        disabled={!pagination.has_prev}
      >
        <Icon name="chevron-left" size={18} color={pagination.has_prev ? "#4f46e5" : "#bdc3c7"} />
        <Text style={[
          item_styles.paginationButtonText,
          !pagination.has_prev && item_styles.disabledButtonText
        ]}>
          Previous
        </Text>
      </TouchableOpacity>

      <View style={item_styles.pageInfo}>
        <Text style={item_styles.pageText}>
          Page {pagination.page}
        </Text>
        <Text style={item_styles.totalText}>
          of {Math.ceil(pagination.total_items / pagination.limit)} pages
        </Text>
      </View>

      <TouchableOpacity
        style={[item_styles.paginationButton, !pagination.has_next && item_styles.disabledButton]}
        onPress={handleNextPage}
        disabled={!pagination.has_next}
      >
        <Text style={[
          item_styles.paginationButtonText,
          !pagination.has_next && item_styles.disabledButtonText
        ]}>
          Next
        </Text>
        <Icon name="chevron-right" size={18} color={pagination.has_next ? "#4f46e5" : "#bdc3c7"} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={item_styles.container}>
      {/* Enhanced Header */}
      <View style={item_styles.header}>
        <View style={item_styles.headerLeft}>
          <View style={item_styles.headerIconContainer}>
            <Icon name="inventory" size={24} color="#ffffff" />
          </View>
          <View>
            <Text style={item_styles.headerText}>Items Library</Text>
            <Text style={item_styles.headerSubtext}>{pagination.total_items} items total</Text>
          </View>
        </View>
        <TouchableOpacity
          style={item_styles.searchButton}
          onPress={() => setShowSearch(true)}
        >
          <Icon name="search" size={22} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Content Container */}
      <View style={item_styles.contentContainer}>
        {/* Tag Filter Section */}
        <View style={item_styles.filterSection}>
          <FilterController setShowTagFilter={setShowTagFilter} showTagFilter={showTagFilter} selectedTags={selectedTags} Icon={<Icon name="filter-list" size={20} color="#6c757d" />} />
          <FilterByTag showTagFilter={showTagFilter} tags={allTags} selectedTags={selectedTags} handleTagToggle={handleTagToggle} />
        </View>



        {/* Items per page section */}
        <View style={item_styles.controlsSection}>
            <ItemLimiter showLimitSelector={showLimitSelector} setShowLimitSelector={setShowLimitSelector} pagination={pagination} Icon={<Icon name="view-list" size={18} color="#6c757d" />} >
              <Icon
                name={showLimitSelector ? "expand-less" : "expand-more"}
                size={20}
                color="#6c757d"
              />
            </ItemLimiter>
        </View>

        {showLimitSelector && (
          <View style={item_styles.limitSelectorContainer}>
            {renderLimitSelector()}
          </View>
        )}

        {/* Items List Section */}
        <View style={item_styles.listSection}>
          {loading && !refreshing && (
            <View style={item_styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4f46e5" />
              <Text style={item_styles.loadingText}>Loading items...</Text>
            </View>
          )}
          {loading && refreshing && (
            <View style={item_styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4f46e5" />
              <Text style={item_styles.loadingText}>Loading items...</Text>
            </View>
          )}

          {!loading && !refreshing && (
            <FlatList
              data={items}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={item_styles.listContent}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  colors={['#4f46e5']}
                  tintColor={'#4f46e5'}
                />
              }
              ListEmptyComponent={
                <View style={item_styles.emptyContainer}>
                  <View style={item_styles.emptyIconContainer}>
                    <Icon name="inventory-2" size={48} color="#bdc3c7" />
                  </View>
                  <Text style={item_styles.emptyText}>No items found</Text>
                  <Text style={item_styles.emptySubtext}>Try adjusting your filters or pull to refresh</Text>
                </View>
              }
            />
          )}
        </View>
      </View>

      {/* Enhanced Pagination */}
      {items && items.length > 0 && (
        <View style={item_styles.paginationWrapper}>
          {renderPaginationControls()}
        </View>
      )}

      {/* Search Modal */}
      <Modal
        visible={showSearch}
        onRequestClose={handleCloseSearch}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={item_styles.searchModalContainer}>
          <View style={item_styles.searchHeader}>
            <TouchableOpacity
              style={item_styles.backButton}
              onPress={handleCloseSearch}
            >
              <Icon name="arrow-back" size={24} color="#34495e" />
            </TouchableOpacity>
            <Text style={item_styles.searchHeaderText}>Search Items</Text>
            <TouchableOpacity
              style={item_styles.closeButton}
              onPress={handleCloseSearch}
            >
              <Icon name="close" size={24} color="#34495e" />
            </TouchableOpacity>
          </View>

          {/* Search Type Selector */}
          <View style={item_styles.searchTypeContainer}>
            {['code', 'name'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  item_styles.searchTypeButton,
                  searchType === type && item_styles.selectedSearchTypeButton
                ]}
                onPress={() => handleSearchTypeChange(type as SearchType)}
              >
                <Text style={[
                  item_styles.searchTypeButtonText,
                  searchType === type && item_styles.selectedSearchTypeButtonText
                ]}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Search Input */}
          {searchType !== 'barcode' && (
            <View style={item_styles.searchInputContainer}>
              <TextInput
                style={item_styles.searchInput}
                value={searchQuery}
                onChangeText={handleSearchQueryChange}
                placeholder={`Search by ${searchType}...`}
                autoFocus
              />
              {searchLoading && (
                <ActivityIndicator
                  size="small"
                  color="#3498db"
                  style={item_styles.searchInputLoader}
                />
              )}
            </View>
          )}

          {/* {searchType === 'barcode' && (
            <View style={item_styles.barcodeSearchInfo}>
              <Icon name="qr-code-scanner" size={48} color="#3498db" />
              <Text style={item_styles.barcodeSearchText}>
                Barcode scanner will open automatically
              </Text>
            </View>
          )} */}
          <FlatList
            data={searchResults}
            keyExtractor={(result) => result.item.id}
            renderItem={({ item: searchResult }: { item: SearchResultItem }) => {
              const searchedItem = searchResult.item
              return (
                 <SearchedItemCard
                  item={searchResult}
                  handleSelectSearchResult={() => {
                    handleSelectSearchResult(searchedItem)
                    handleCloseSearch()
                  } }
                 />
              )
            }}
            ListEmptyComponent={
              searchQuery && !searchLoading ? (
                <View style={item_styles.emptySearchContainer}>
                  <Icon name="search-off" size={48} color="#bdc3c7" />
                  <Text style={item_styles.emptySearchText}>No items found</Text>
                  <Text style={item_styles.emptySearchSubtext}>
                    Try different search terms
                  </Text>
                </View>
              ) : null
            }
            contentContainerStyle={item_styles.searchResultsList}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
};


export default FillOutItemInfo;