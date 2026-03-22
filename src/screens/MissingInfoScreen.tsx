import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Alert,
  Image,
  TextInput,
} from 'react-native';
import { useNavigation, NavigationProp   } from '@react-navigation/native';
import ItemService from '../services/ItemService';
import { ItemWithMissingInfo, MissingInfoResponse, Item, SearchResult } from '../models/Item';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { imgServer } from '../services/ApiService';
import { ROOT_PARAM_LIST } from '../models/navigation';

// Define tab types for the different missing info categories
type TabType = 'all' | 'code' | 'barcode' | 'name' | 'image';

const MissingInfoScreen = () => {
    const navigation = useNavigation<NavigationProp<ROOT_PARAM_LIST>>();
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<MissingInfoResponse | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [displayData, setDisplayData] = useState<ItemWithMissingInfo[]>([]);
  const [searchText, setSearchText] = useState('');
  const [searchType, setSearchType] = useState<'barcode' | 'code' | 'name'>('name');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isSearchMode, setIsSearchMode] = useState(false);
  
  // For debounce implementation
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Function to fetch the missing info data
  const fetchMissingInfo = useCallback(async () => {    
    try {
      setLoading(true);
      const response = await ItemService.getItemsWithMissingInfo();
      setData(response);
      setDisplayData(response.payload.itemsWithMissingInfo);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching missing info:', error);
      Alert.alert('Error', 'Failed to fetch items with missing information');
      setLoading(false);
    }
  }, []);

  // Function to handle refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchMissingInfo();
    setRefreshing(false);
  }, [fetchMissingInfo]);

  useEffect(() => {
    fetchMissingInfo();
  }, [fetchMissingInfo]);
  
  // Search function with debounce
  const handleSearch = useCallback((text: string) => {
    setSearchText(text);
    
    // If search text is less than 3 characters and not empty, don't search yet
    if (text.length > 0 && text.length < 3) {
      return;
    }
    
    // Clear previous search mode if search is empty
    if (text.length === 0) {
      setIsSearchMode(false);
      return;
    }
    
    // Clear any existing timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    
    // Set a new timeout for debounce (300ms)
    debounceTimeout.current = setTimeout(async () => {
      try {
        setSearchLoading(true);
        setIsSearchMode(true);
        
        // Perform the search
        const results = await ItemService.lookupItems(searchType, text);
        setSearchResults(results.payload as SearchResult);
      } catch (error) {
        console.error('Error searching items:', error);
        Alert.alert('Error', 'Failed to search items. Please try again.');
      } finally {
        setSearchLoading(false);
      }
    }, 300);
  }, [searchType]);
  
  // Create an array of items from search results to display (with empty missingFields)
  const getDisplayItemsFromSearch = useCallback(() => { 
    return searchResults?.items;
  }, [searchResults]);
  
  // Function to filter data based on the active tab
  useEffect(() => {
    if (!data) return;

    switch (activeTab) {
      case 'all':
        setDisplayData(data.payload.itemsWithMissingInfo);
        break;
      case 'code':
        setDisplayData(
          data.payload.itemsWithMissingInfo.filter(item => 
            item.missingFields.includes('code')
          )
        );
        break;
      case 'barcode':
        setDisplayData(
          data.payload.itemsWithMissingInfo.filter(item => 
            item.missingFields.includes('barcode')
          )
        );
        break;
      case 'name':
        setDisplayData(
          data.payload.itemsWithMissingInfo.filter(item => 
            item.missingFields.includes('name')
          )
        );
        break;
      case 'image':
        setDisplayData(
          data.payload.itemsWithMissingInfo.filter(item => 
            item.missingFields.includes('image_path')
          )
        );
        break;
      default:
        setDisplayData(data.payload.itemsWithMissingInfo);
    }
  }, [activeTab, data]);

  // Navigate to edit an item
  const handleEditItem = (item: Item) => {
    navigation.navigate('EditItem', { itemId: item.id });
  };

  // Render the tab bar for filtering
  const renderTabBar = () => {
    const tabs: { key: TabType; label: string; icon: string; count?: number }[] = [
      { 
        key: 'all', 
        label: 'All', 
        icon: 'view-list',
        count: data?.payload.total_with_missing_info 
      },
      { 
        key: 'code', 
        label: 'Code', 
        icon: 'code',
        count: data?.payload.total_missing_code 
      },
      { 
        key: 'barcode', 
        label: 'Barcode', 
        icon: 'qr-code',
        count: data?.payload.total_missing_barcode 
      },
      { 
        key: 'name', 
        label: 'Name', 
        icon: 'text-format',
        count: data?.payload.total_missing_name 
      },
      { 
        key: 'image', 
        label: 'Image', 
        icon: 'image',
        count: data?.payload.total_missing_image 
      },
    ];

    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
      >
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tabButton,
              activeTab === tab.key && styles.activeTabButton
            ]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Icon 
              name={tab.icon} 
              size={22} 
              color={activeTab === tab.key ? '#FFFFFF' : '#3498db'} 
            />
            <Text style={[
              styles.tabText,
              activeTab === tab.key && styles.activeTabText
            ]}>
              {tab.label}
              {tab.count !== undefined && ` (${tab.count})`}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  // Render a missing info item
  const renderMissingInfoItem = ({ item }: { item: ItemWithMissingInfo }) => {
    // Check if the item has an image path
    const hasImage = item.item.image_path && item.item.image_path.trim() !== '';
    const isMissingImage = item.missingFields.includes('image_path');
    return (
      <TouchableOpacity
        style={styles.itemCard}
        onPress={() => handleEditItem(item.item)}
      >
        <View style={styles.itemRow}>
          {/* Item Image or Placeholder */}
          <View style={styles.imageContainer}>
            {hasImage ? (
              <Image 
                source={{ uri: imgServer + item.item.image_path }} 
                style={styles.itemImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Icon name="image-not-supported" size={32} color="#bdc3c7" />
              </View>
            )}
          </View>
          
          {/* Item Details */}
          <View style={styles.itemDetails}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.item.name || 'No Name'}
              </Text>
              <Text style={styles.itemCode}>
                {item.item.code || 'No Code'}
              </Text>
            </View>

            <View style={styles.missingContainer}>
              <Text style={styles.missingLabel}>Missing Information:</Text>
              <View style={styles.missingTags}>
                {item.missingFields.map(field => (
                  <View 
                    key={field} 
                    style={[
                      styles.missingTag,
                      styles[`${field}Tag` as keyof typeof styles] || styles.defaultTag
                    ]}
                  >
                    <Text style={styles.missingTagText}>
                      {field === 'image_path' ? 'Image' : field.charAt(0).toUpperCase() + field.slice(1)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Stock Information if available */}
        {item.stock && item.stock.length > 0 && (
          <View style={styles.stockInfo}>
            <Text style={styles.stockLabel}>Stock Information:</Text>
            <Text style={styles.stockText}>
              Box: <Text style={styles.stockValue}>{item.stock[0].box_number || '0'}</Text>,
              Bundle: <Text style={styles.stockValue}>{item.stock[0].bundle_number || '0'}</Text>,
              PCS: <Text style={styles.stockValue}>{item.stock[0].pcs_number || '0'}</Text>
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditItem(item.item)}
        >
          <Icon name="edit" size={18} color="#FFFFFF" />
          <Text style={styles.editButtonText}>Edit Item</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  // Render statistics cards
  const renderStatistics = () => {
    if (!data) return null;

    const { 
      total_with_missing_info, 
      total_missing_code, 
      total_missing_barcode, 
      total_missing_name, 
      total_missing_image 
    } = data.payload;

    return (
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Missing Information Overview</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{total_with_missing_info}</Text>
            <Text style={styles.statLabel}>Total Items</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{total_missing_code}</Text>
            <Text style={styles.statLabel}>Missing Code</Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{total_missing_barcode}</Text>
            <Text style={styles.statLabel}>Missing Barcode</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{total_missing_name}</Text>
            <Text style={styles.statLabel}>Missing Name</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{total_missing_image}</Text>
            <Text style={styles.statLabel}>Missing Image</Text>
          </View>
        </View>
      </View>
    );
  };

  // Render search bar and type selector
  const renderSearchBar = () => {
    return (
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icon name="search" size={20} color="#7f8c8d" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search items..."
            value={searchText}
            onChangeText={handleSearch}
            returnKeyType="search"
          />
          {searchText.length > 0 && (
            <TouchableOpacity 
              onPress={() => handleSearch('')}
              style={styles.clearButton}
            >
              <Icon name="clear" size={20} color="#7f8c8d" />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.searchTypeContainer}>
          <TouchableOpacity
            style={[
              styles.searchTypeButton,
              searchType === 'name' && styles.activeSearchTypeButton
            ]}
            onPress={() => setSearchType('name')}
          >
            <Text style={[
              styles.searchTypeText,
              searchType === 'name' && styles.activeSearchTypeText
            ]}>Name</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.searchTypeButton,
              searchType === 'code' && styles.activeSearchTypeButton
            ]}
            onPress={() => setSearchType('code')}
          >
            <Text style={[
              styles.searchTypeText,
              searchType === 'code' && styles.activeSearchTypeText
            ]}>Code</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.searchTypeButton,
              searchType === 'barcode' && styles.activeSearchTypeButton
            ]}
            onPress={() => setSearchType('barcode')}
          >
            <Text style={[
              styles.searchTypeText,
              searchType === 'barcode' && styles.activeSearchTypeText
            ]}>Barcode</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Icon name="error-outline" size={24} color="#e74c3c" />
        <Text style={styles.headerText}>Items With Missing Information</Text>
      </View>
      
      {renderSearchBar()}

      {loading || searchLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>
            {searchLoading ? 'Searching...' : 'Loading data...'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={isSearchMode ? [] : displayData}
          renderItem={renderMissingInfoItem}
          keyExtractor={(item) => item.item.id.toString()}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            !isSearchMode ? (
              <>
                {renderStatistics()}
                {renderTabBar()}
                <Text style={styles.resultsCount}>
                  Showing {displayData.length} results
                </Text>
              </>
            ) : (
              <Text style={styles.resultsCount}>
                Found {searchResults?.items.length} results for "{searchText}"
              </Text>
            )
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon 
                name={isSearchMode ? "search-off" : "check-circle"} 
                size={48} 
                color={isSearchMode ? "#e74c3c" : "#2ecc71"} 
              />
              <Text style={styles.emptyText}>
                {isSearchMode 
                  ? `No items found matching "${searchText}"`
                  : 'No items with missing information in this category!'
                }
              </Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#3498db']}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 8,
  },
  searchContainer: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#2c3e50',
  },
  clearButton: {
    padding: 4,
  },
  searchTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchTypeButton: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f5f6fa',
    borderRadius: 4,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  activeSearchTypeButton: {
    backgroundColor: '#3498db',
  },
  searchTypeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#7f8c8d',
  },
  activeSearchTypeText: {
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7f8c8d',
  },
  listContent: {
    padding: 16,
  },
  tabsContainer: {
    paddingVertical: 8,
    flexDirection: 'row',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#3498db',
  },
  activeTabButton: {
    backgroundColor: '#3498db',
  },
  tabText: {
    color: '#3498db',
    fontWeight: '500',
    marginLeft: 4,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  resultsCount: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: 14,
    color: '#7f8c8d',
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#f5f6fa',
    marginRight: 12,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
  },
  itemDetails: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  itemCode: {
    fontSize: 14,
    color: '#7f8c8d',
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  missingContainer: {
    marginBottom: 12,
  },
  missingLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 6,
  },
  missingTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  missingTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  missingTagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  stockInfo: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
  stockLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  stockText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  stockValue: {
    fontWeight: 'bold',
    color: '#3498db',
  },
  codeTag: {
    backgroundColor: '#e74c3c',
  },
  barcodeTag: {
    backgroundColor: '#f39c12',
  },
  nameTag: {
    backgroundColor: '#3498db',
  },
  imagePathTag: {
    backgroundColor: '#9b59b6',
  },
  defaultTag: {
    backgroundColor: '#95a5a6',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2ecc71',
    paddingVertical: 8,
    borderRadius: 4,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  statsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    padding: 10,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3498db',
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
  },
});

export default MissingInfoScreen;