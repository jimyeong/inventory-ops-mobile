import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  TextInput,
  FlatList,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SearchType } from '../services/ItemService';
import { searchApi } from '../v1/features/products/search/api/productSearchApi';
import { SearchResultProduct } from '../v1/features/products/search/model/type';

const HomeScreen = () => {
  const { userData: user, signOut } = useAuth();
  const navigation = useNavigation();
  const firstName = user?.displayName?.split(' ')[0] || 'User';

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('name');
  const [searchResults, setSearchResults] = useState<SearchResultProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showSearchTypeMenu, setShowSearchTypeMenu] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign Out Error:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a search term');
      return;
    }

    setIsSearching(true);
    try {
      const response = await searchApi.lookupItems({ searchType: searchType as SearchType, value: searchQuery });
      if (response.success && response.payload) {
        setSearchResults(response.payload.results);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Error', 'Failed to search items. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleItemPress = (item: SearchResultProduct) => {
    setShowResults(false);
    (navigation.navigate as any)('ScannedItemDetail', {
      item: item.product,
    });
  };

  const getSearchTypeLabel = () => {
    switch (searchType) {
      case 'code': return 'Code';
      case 'barcode': return 'Barcode';
      case 'name': return 'Name';
      default: return 'Name';
    }
  };

  //
  // edd382
  // f2f3ae
  // fc9e4f
  // ff521b
  // 020122


  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputRow}>
          <TouchableOpacity
            style={styles.searchTypeButton}
            onPress={() => setShowSearchTypeMenu(!showSearchTypeMenu)}
          >
            <Text style={styles.searchTypeText}>{getSearchTypeLabel()}</Text>
            <Icon name="arrow-drop-down" size={20} color="#3498db" />
          </TouchableOpacity>

          <TextInput
            style={styles.searchInput}
            placeholder={`Search by ${getSearchTypeLabel().toLowerCase()}...`}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />

          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            disabled={isSearching}
          >
            {isSearching ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Icon name="search" size={24} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>

        {/* Search Type Dropdown */}
        {showSearchTypeMenu && (
          <View style={styles.searchTypeMenu}>
            <TouchableOpacity
              style={styles.searchTypeOption}
              onPress={() => {
                setSearchType('name');
                setShowSearchTypeMenu(false);
              }}
            >
              <Text style={styles.searchTypeOptionText}>Name</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.searchTypeOption}
              onPress={() => {
                setSearchType('code');
                setShowSearchTypeMenu(false);
              }}
            >
              <Text style={styles.searchTypeOptionText}>Code</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.searchTypeOption}
              onPress={() => {
                setSearchType('barcode');
                setShowSearchTypeMenu(false);
              }}
            >
              <Text style={styles.searchTypeOptionText}>Barcode</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Search Results Modal */}
      <Modal
        visible={showResults}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowResults(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Search Results ({searchResults.length})
            </Text>
            <TouchableOpacity onPress={() => setShowResults(false)}>
              <Icon name="close" size={28} color="#2c3e50" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={searchResults}
            keyExtractor={(product, index) => `${product.product.product_id}-${index}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => handleItemPress(item.product)}
              >
                <View style={styles.resultItemContent}>
                  <Text style={styles.resultItemName}>{item.product.name_kor || item.product.name_eng}</Text>
                  <Text style={styles.resultItemCode}>Code: {item.product.code}</Text>
                  {item.product.barcode && (
                    <Text style={styles.resultItemBarcode}>Barcode: {item.product.barcode}</Text>
                  )}
                </View>
                <Icon name="chevron-right" size={24} color="#bdc3c7" />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Icon name="search-off" size={64} color="#bdc3c7" />
                <Text style={styles.emptyText}>No items found</Text>
              </View>
            }
          />
        </SafeAreaView>
      </Modal>

      <TouchableOpacity
        style={styles.signOutButton}
        onPress={handleSignOut}
      >
        <Icon name="logout" size={20} color="#FFFFFF" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#3498db',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#34495e',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuButton: {
    backgroundColor: '#3498db',
    width: '48%',
    height: 120,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  signOutButton: {
    flexDirection: 'row',
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  // Search styles
  searchContainer: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  searchInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 5,
  },
  searchTypeText: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '600',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  searchButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
  },
  searchTypeMenu: {
    backgroundColor: '#ffffff',
    marginTop: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ecf0f1',
    overflow: 'hidden',
  },
  searchTypeOption: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  searchTypeOptionText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  resultItem: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 15,
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  resultItemContent: {
    flex: 1,
  },
  resultItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  resultItemCode: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 3,
  },
  resultItemBarcode: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  tag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 5,
    marginBottom: 5,
  },
  tagText: {
    fontSize: 12,
    color: '#1976d2',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#95a5a6',
    marginTop: 10,
  },
});

export default HomeScreen;