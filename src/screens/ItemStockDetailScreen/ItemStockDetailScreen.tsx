import React, { createContext, useContext, useState, useReducer, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Item, ItemStock, ItemStockWithUI } from '../../models/Item';
import { RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import ItemService from '../../services/ItemService';
import { itemDetailContext, ITEM_DETAIL_ACTION_TYPES, ItemDetailRequestParams, ItemDetailResponseParams } from './contexts/ItemDetailContext';
import { useAuth } from '../../context/AuthContext';
import { ServiceResponse } from '../../services/ApiService';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { initialState, reducer, TYPE_PAYLOAD, TYPE_ITEM_DETAIL_ACTION } from './reducer';
import { ROOT_PARAM_LIST } from '../../models/navigation';
import { ItemDescription, ItemStockComponent, StockOutSkeleton, RenderStockList, EmptyStockList } from './ui';
import { BarcodeError,  IconButton } from '../../components';
import { pageStyles } from './ui/styles';
import StockCard from './ui/StockCard';
import { calculateDaysUntilExpiry, getExpiryInfo } from '../../helpers';
import StockEditForm from './ui/StockEditForm';

//@@@@

const ItemStockDetailScreen = () => {
  const { userData } = useAuth();
  const navigation = useNavigation<NavigationProp<ROOT_PARAM_LIST>>();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const route = useRoute<RouteProp<ROOT_PARAM_LIST, 'ScannedItemDetail'>>();
  const [isRefreshing, setIsRefreshing] = useState(false);

  /**singlie stock selection */

  /** FUNCTIONS */
  const onPressStockIn = () => { 
    // navigation.navigate('StockIn', {
      
    //   itemDetail: state?.selectedItem as Item,
    //   actionType: 'IN'
    // });
  }
  const onPressScanAgain = () => {
    navigation.goBack();
  }
  // after stock out, update the stock list
  const onUpdateFinish = (updatedStocks: ItemStock[]) => {
    updatedStocks = processStockList(updatedStocks)
    // dispatch({ type: ITEM_DETAIL_ACTION_TYPES.SET_STOCK_OUT_FORM_VISIBLE, payload: { setStockOutFormVisible: false } });
    dispatch({ type: ITEM_DETAIL_ACTION_TYPES.UPDATE_SCANNED_ITEM_STOCK, payload: { updatedStocks: updatedStocks as ItemStockWithUI[] } });
    Toast.show({
      text1: 'Stock out successful 👍',
      type: 'success',
      visibilityTime: 3000,
    });
  }

  // update stock
  const updateStock = async (stockId: number, updateData: any) => {
    setLoading(true);
    const res = await ItemService.updateStock(stockId, updateData);
    const updatedStocks = processStockList(res.payload) as ItemStockWithUI[] 
    if (res.success) {
      dispatch({ type: ITEM_DETAIL_ACTION_TYPES.UPDATE_SCANNED_ITEM_STOCK, payload: { updatedStocks } });
      setLoading(false);
    }else{
      setLoading(false);
      Toast.show({
        text1: 'Failed to update stock 👀',
        type: 'error',
        visibilityTime: 3000,
      });
    }
    return res;
  }
  const renderStockItem = ({ item: stock }: { item: ItemStockWithUI }) => {
    const formatDate = (date: Date | string) => {
      if (!date) return 'N/A';
      const d = new Date(date);
      return d.toLocaleDateString();  
    };
    return (
      <StockCard
        daysUntilExpiry={calculateDaysUntilExpiry(stock.expiry_date)}
        expiryInfo={getExpiryInfo(calculateDaysUntilExpiry(stock.expiry_date))}
        isRefreshing={isRefreshing}  
        stock={stock}
        selectedItem={state?.selectedItem as Item}
        styles={pageStyles}
        formatDate={formatDate}
      />
    )
  };
  const processStockList = (stock: ItemStock[]):ItemStockWithUI[] => {
    if(!stock) return [];
    const stockUI = stock.map((item, i)=>{
      return {
        ...item, 
        isSelectedForEdit: false,
        isSelectedForStockOut: false,
      }
    })
    return stockUI;
  }
  /**server requests */
  const requestStockOut = async (params: ItemDetailRequestParams): Promise<ServiceResponse<ItemDetailResponseParams>> => {
    // call the stock out api with the selected stock item and the quantity
    
    const res = await ItemService.stockOut(params);
    if (res.success) { onUpdateFinish(res.payload.updatedStocks); }
    return res;
  }
  const getItemById = async (itemId:string) => {
    setLoading(true);
    try {
      const res = await ItemService.getItemById(itemId);
      if(res.success) {
        if(res.payload.stock){res.payload.stock = processStockList(res.payload.stock)}
        dispatch({ type: ITEM_DETAIL_ACTION_TYPES.SET_SELECTED_ITEM, payload: { selectedItem: res.payload } });
        Toast.show({
          text1: 'Item loaded successfully 👍',
          type: 'success',
          visibilityTime: 3000,
        });
      }
    } catch (error) { 
      setError('Failed to load item information');
      Toast.show({
        text1: 'Item is not registered 👀',
        type: 'error',
        visibilityTime: 3000,
      });
    } finally {
      setError(null);
      setLoading(false);
    }
  }

  const getItemByBarcode = async (barcode: string) => {
    setLoading(true);
    try {
      const res = await ItemService.getItemByBarcode(barcode);
      if(res.success) {
        res.payload.stock = processStockList(res.payload.stock)
        dispatch({ type: ITEM_DETAIL_ACTION_TYPES.SET_SELECTED_ITEM, payload: { selectedItem: res.payload } });
        setError(null);
      } else {
        setError('Item not found');
        Toast.show({
          text1: 'Item not found 👀',
          type: 'error',
          visibilityTime: 3000,
        });
      }
    } catch (error) {
      setError('Failed to load item information');
      Toast.show({
        text1: 'Item is not registered 👀',
        type: 'error',
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
    }
  }

  // get data
  useEffect(() => {
    if (route.params?.barcode) {
      const { barcode } = route.params;
      getItemByBarcode(barcode);
    } else if (route.params?.itemId) {

      const { itemId } = route.params;
      getItemById(itemId as string);
    }else{
      setError('Barcode or item ID is required');
      Toast.show({
        text1: 'Barcode or item ID is required 👀',
        type: 'error',
        visibilityTime: 3000,
      });
    }
  }, [])

  // Show loading skeleton while fetching data
  if (loading) {
    return (
      <SafeAreaView style={pageStyles.container}>
        <StockOutSkeleton />
      </SafeAreaView>
    );
  }

  // Show error state
  if (error || !state.selectedItem) {
    return <BarcodeError error={error!} onPressScanAgain={onPressScanAgain} getItemById={getItemByBarcode} barcode={route.params?.barcode || ''} styles={pageStyles} />;
  }
  return (
    <itemDetailContext.Provider
      value={{
        userData,
        requestStockOut,
        updateStock,
        getItemById,    
        dispatch: dispatch as React.Dispatch<TYPE_ITEM_DETAIL_ACTION>,
        state,  
        selectedItem: state?.selectedItem,
      }}>
      <SafeAreaView style={pageStyles.container}>
        {/* Stock listing section */}
        <RenderStockList 
          stock={state?.selectedItem?.stock} 
          styles={pageStyles} 
          renderStockItem={renderStockItem}
          ItemDescription={<ItemDescription item={state?.selectedItem} styles={pageStyles} />}
          ListEmptyComponent={<EmptyStockList styles={pageStyles} />} 
        />
        
        {/* Fixed bottom buttons section */}
        <View style={pageStyles.bottomButtonsContainer}>
          <View style={pageStyles.buttonsContainer}>
            <IconButton icon="package-up" text="Stock In" onPress={onPressStockIn} styles={{buttonStyle: [pageStyles.actionButton, pageStyles.stockInButton, { flex: 1, justifyContent: "center", flexDirection: "row" }], buttonText: [pageStyles.buttonText]}} />
            <IconButton icon="pencil" text="Edit Item" onPress={() => navigation.navigate('ItemDetailEdit', { itemId: state?.selectedItem?.id as string, item: state?.selectedItem as Item })} styles={{buttonStyle: [pageStyles.actionButton, pageStyles.editButton, { flex: 1, justifyContent: "center", flexDirection: "row", marginLeft: 10 }], buttonText: [pageStyles.buttonText]}} />
          </View>
          <IconButton icon="barcode-scan" text="Scan Another Item" onPress={onPressScanAgain} styles={{buttonStyle: [pageStyles.scanAgainButton], buttonText: [pageStyles.buttonText]}} />
        </View>
      </SafeAreaView>
    </itemDetailContext.Provider>
  );
};

export default ItemStockDetailScreen;

