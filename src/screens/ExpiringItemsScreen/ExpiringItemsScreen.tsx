import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { ROOT_PARAM_LIST } from '../../models/navigation';
import ItemService from '../../services/ItemService';
import { imgServer } from '../../services/ApiService';
import EditItemStockScreen from '../EditItemStockScreen/EditItemStockScreen';
import { Item } from '../../models/Item';
import { styles } from './ui/styles';

export interface ExpiringItem {
  item: Item;
  days_to_expiry: number;
  stock_id: string;
  tag_names: string[];
}

interface ExpiringItemsResponse {
  expiringItems: ExpiringItem[];
  total: number;
  within_days: number;
  message: string;
}

const EXPIRY_FILTER_OPTIONS = [7, 14, 21, 30, 60];

const ExpiringItemsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<ROOT_PARAM_LIST>>();
  const { userData } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expiringItems, setExpiringItems] = useState<ExpiringItem[]>([]);
  const [selectedDays, setSelectedDays] = useState<number>(7);
  const [totalItems, setTotalItems] = useState<number>(0);

  const fetchExpiringItems = useCallback(async (days: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ItemService.getItemsExpiringWithinDays(days);
      
      if (response.success) {
        setExpiringItems(response.payload.expiring_items);
        setTotalItems(response.payload.total);
      } else {
        setError(response.payload.message || 'Failed to fetch expiring items');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error fetching expiring items:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpiringItems(selectedDays);
  }, [selectedDays, fetchExpiringItems]);

  const handleChipPress = (days: number) => {
    setSelectedDays(days);
  };

  const handleItemPress = (item: ExpiringItem) => {
    navigation.navigate('ScannedItemDetail', { itemId: item.item.id });  
  };

  const renderChip = (days: number) => (
    <TouchableOpacity
      key={days}
      style={[
        styles.chip,
        selectedDays === days && styles.selectedChip
      ]}
      onPress={() => handleChipPress(days)}
    >
      <Text style={[
        styles.chipText,
        selectedDays === days && styles.selectedChipText
      ]}>
        {days} days
      </Text>
    </TouchableOpacity>
  );

  const renderExpiringItem = ({ item }: { item: ExpiringItem }) => (
    <TouchableOpacity 
      style={styles.itemContainer}
      onPress={() => handleItemPress(item)}
    >
      <View style={styles.itemContent}>
        {/* Item Image */}
        <View style={styles.imageContainer}>
          {item.item.image_path ? (
            <Image  
              source={{ uri: imgServer + item.item.image_path }}
              style={styles.itemImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Icon name="image" size={32} color="#bdc3c7" />
            </View>
          )}
          
          {/* Urgency Indicator Overlay */}
          {item.days_to_expiry <= 3 && (
            <View style={styles.urgentOverlay}>
              <Icon name="warning" size={20} color="#fff" />
            </View>
          )}
        </View>

        {/* Item Details */}
        <View style={styles.itemDetails}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemName} numberOfLines={2}>
              {item.item.name || 'Unnamed Item'}
            </Text>
            <View style={[
              styles.expiryBadge,
              item.days_to_expiry <= 7 && styles.criticalBadge,
              item.days_to_expiry <= 3 && styles.urgentBadge
            ]}>
              <Text style={styles.expiryText}>
                {item.days_to_expiry} day{item.days_to_expiry !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>
          <View>
            <Text>
              Item Code: {item.item.code}
            </Text>
          </View>
          <View style={styles.itemInfo}>
            <View style={styles.infoRow}>
              <Icon name="qr-code-scanner" size={16} color="#7f8c8d" />
              <Text style={styles.itemBarcode}>{item.item.barcode || 'No barcode'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="inventory" size={16} color="#7f8c8d" />
              <Text style={styles.itemStock}>Stock ID: {item.stock_id}</Text>
            </View>
            
            {/* Stock Details */}
            {(() => {
              const stockItem = item.item.stock?.find(s => s.stock_id.toString() === item.stock_id.toString());
              if (stockItem) {
                return (
                  <View>
                    <View style={styles.infoRow}>
                      <Icon name="event" size={16} color="#7f8c8d" />
                      <Text style={styles.itemStock}>
                        Expiry: {new Date(stockItem.expiry_date).toLocaleDateString()}
                      </Text>
                    </View>
                    <View>
                      <Text>
                        Discount: {stockItem.discount_rate}
                      </Text>
                    </View>

                    <View style={styles.pricingSection}>
                      <View style={styles.infoRow}>
                        <Icon name="attach-money" size={16} color="#7f8c8d" />
                        <Text style={styles.itemStock}>
                          Original Price: ${item.item.price?.toFixed(2)}
                        </Text>
                      </View>
                      {stockItem.discount_rate > 0 && (
                        <View style={styles.infoRow}>
                          <Icon name="local-offer" size={16} color="#e74c3c" />
                          <Text style={[styles.discountedPrice, styles.itemStock]}>
                            Discounted Price: ${((item.item.price || 0) * (1 - stockItem.discount_rate / 100)).toFixed(2)}
                          </Text>
                        </View>
                      )}
                      {stockItem.discount_rate > 0 && (
                        <View style={styles.savingsRow}>
                          <Text style={styles.savingsText}>
                            Save ${((item.item.price || 0) * (stockItem.discount_rate / 100)).toFixed(2)} ({stockItem.discount_rate}% OFF)
                          </Text>
                        </View>
                      )}
                    </View>
                    {stockItem.box_number && (
                        <View style={styles.infoRow}>
                        <Icon name="inventory-2" size={16} color="#7f8c8d" />
                        <Text style={styles.itemStock}>Box: {stockItem.box_number}</Text>
                      </View>
                    )}
                    {stockItem.location && (
                      <View style={styles.infoRow}>
                        <Icon name="location-on" size={16} color="#7f8c8d" />
                        <Text style={styles.itemStock}>Location: {stockItem.location}</Text>
                      </View>
                    )}
                  </View>
                );
              }
              return null;
            })()}
          </View>

          {item.tag_names.length > 0 && (
            <View style={styles.tagsContainer}>
              {item.tag_names.slice(0, 3).map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
                {item.tag_names.length > 3 && (
                <View style={[styles.tag, styles.moreTagsIndicator]}>
                  <Text style={styles.tagText}>+{item.tag_names.length - 3}</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Loading expiring items...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="error-outline" size={60} color="#e74c3c" />
          <Text style={styles.errorTitle}>Error Loading Items</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => fetchExpiringItems(selectedDays)}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#34495e" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Expiring Items</Text>
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Show items expiring within:</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.chipsContainer}
        >
          {EXPIRY_FILTER_OPTIONS.map(renderChip)}
        </ScrollView>
      </View>

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>
          {totalItems} item{totalItems !== 1 ? 's' : ''} expiring within {selectedDays} day{selectedDays !== 1 ? 's' : ''}
        </Text>
      </View>

      {expiringItems?.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="check-circle" size={60} color="#2ecc71" />
          <Text style={styles.emptyTitle}>No Items Expiring Soon</Text>
          <Text style={styles.emptyMessage}>
            Great! No items are expiring within {selectedDays} day{selectedDays !== 1 ? 's' : ''}.
          </Text>
        </View>
      ) : (
        <FlatList
          data={expiringItems}
          renderItem={renderExpiringItem}
          keyExtractor={(item, index) => `${item.stock_id}-${index}`}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};


export default ExpiringItemsScreen;