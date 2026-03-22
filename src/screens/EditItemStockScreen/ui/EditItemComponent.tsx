import { View, Text, StyleSheet, Image, ImageStyle, FlatList, TouchableOpacity, TextStyle, ViewStyle, ListRenderItem, ListRenderItemInfo } from 'react-native'
import React, { useContext } from 'react'
import { editItemStockContext } from '../contexts/EditItemStockContext';
import { Item, ItemStock } from '../../../models/Item';
import { stockItemDetailStyles } from './styles';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { imgServer } from '../../../services/ApiService';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ROOT_PARAM_LIST } from '../../../models/navigation';

interface EditItemComponentProps {
    item: Item;
    renderStockItem: (item: ListRenderItemInfo<ItemStock>) => React.ReactElement;
    onPressStockIn: () => void;
    onPressScanAgain: () => void;
    navigation: NavigationProp<ROOT_PARAM_LIST>;
}

const EditItemComponent = ({item, renderStockItem, onPressStockIn, onPressScanAgain, navigation}: EditItemComponentProps) => {
    const {state, dispatch} = useContext(editItemStockContext);         // need to write type guard

  return (
    
    <View style={stockItemDetailStyles.itemContainer}>
    <View style={stockItemDetailStyles.itemDetails}>
      <View style={stockItemDetailStyles.itemHeaderRow || { flexDirection: 'row', marginBottom: 15 }}>
        {item.image_path ? (
          <Image
            source={{ uri: imgServer + item.image_path }}
            style={stockItemDetailStyles.itemImage as ImageStyle}
            resizeMode="contain"
          />
        ) : (
          <View style={stockItemDetailStyles.placeholderImage || {
            width: 80,
            height: 80,
            borderRadius: 8,
            backgroundColor: '#f0f0f0',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 15
          }}>
            <Icon name="hide-image" size={30} color="#bdc3c7" />
          </View>
        )}
        <View style={stockItemDetailStyles.itemHeaderInfo || { flex: 1, justifyContent: 'center' }}>
          <Text style={stockItemDetailStyles.itemName}>{item.name}</Text>
          <Text style={stockItemDetailStyles.itemBarcode}>Barcode: {item.barcode}</Text>
          <Text style={stockItemDetailStyles.itemBarcode}>Box Barcode: {item.box_barcode}</Text>
        </View>
      </View>
      {/* Stock listing section */}
      <View>
        <View style={stockItemDetailStyles.stockSectionHeader}>
          <Icon name="assignment" size={20} color="#34495e" />
          <Text style={stockItemDetailStyles.stockSectionTitle}>Current Stock</Text>
        </View>
        <FlatList
          style={stockItemDetailStyles.stockContainer}
          data={item.stock}
          renderItem={renderStockItem}
          keyExtractor={(item) => item.stock_id.toString()}
          ListEmptyComponent={
            <View style={stockItemDetailStyles.emptyStockContainer}>
              <Icon name="remove-shopping-cart" size={40} color="#bdc3c7" />
              <Text style={stockItemDetailStyles.emptyStockText}>No stock information available</Text>
            </View>
          }
          showsVerticalScrollIndicator={true}
        />
      </View>
    </View>

    <View style={stockItemDetailStyles.buttonsContainer}>
      <TouchableOpacity
        style={[stockItemDetailStyles.actionButton, stockItemDetailStyles.stockInButton, { flex: 1, justifyContent: "center", flexDirection: "row" }]}
        onPress={onPressStockIn}
      >
        <Icon name="unarchive" size={18} color="#ffffff" style={{ marginRight: 6 }} />
        <Text style={stockItemDetailStyles.buttonText}>Stock In</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[stockItemDetailStyles.actionButton, stockItemDetailStyles.editButton, { flex: 1, justifyContent: "center", flexDirection: "row", marginLeft: 10 }]}
        onPress={() => navigation.navigate('ItemDetailEdit', { itemId: state?.scannedItem?.id as string, item: state?.scannedItem as Item })}
      >
        <Icon name="edit" size={18} color="#ffffff" style={{ marginRight: 6 }} />
        <Text style={stockItemDetailStyles.buttonText}>Edit Item</Text>
      </TouchableOpacity>
    </View>

    <TouchableOpacity
      style={stockItemDetailStyles.scanAgainButton}
      onPress={onPressScanAgain}
    >
      <Text style={stockItemDetailStyles.buttonText}>Scan Another Item</Text>
    </TouchableOpacity>
  </View>
  )
}

export default EditItemComponent   
