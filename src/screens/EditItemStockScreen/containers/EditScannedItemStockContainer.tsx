import React, { useContext, useEffect, useReducer, useState } from 'react'
import { Item, ItemStock, StockType } from '../../../models/Item';
import ItemService from '../../../services/ItemService';
import { contextInitialState, EDIT_ITEM_STOCK_ACTION_TYPES, editItemStockContext, EditItemStockRequestParams, EditItemStockResponseParams } from '../contexts/EditItemStockContext';
import { styles } from '../../StockInScreen/ui/styles';
import EditItemComponent from '../ui/EditItemComponent';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ROOT_PARAM_LIST } from '../../../models/navigation';
import Toast from 'react-native-toast-message';
import StockCard from '../ui/StockCard';
import { ServiceResponse } from '../../../services/ApiService';
import ErrorMessage from '../../../components/ErrorMessages/ErrorMessage';
import StockOutSkeleton from '../ui/StockOutSkeleton';
import { useAuth } from '../../../context/AuthContext';
import { reducer, ReducerInitialState } from '../reducer/EditItemStockReducer';
import { ItemDetailRequestParams } from '../../ItemStockDetailScreen/contexts/ItemDetailContext';


interface EditScannedItemStockContainerProps {
    barcode?: string;
    itemId?: string;
}
const EditScannedItemStockContainer = ({ barcode, itemId }: EditScannedItemStockContainerProps) => {
    const [item, setItem] = useState<Item | null>(null);
    const navigation = useNavigation<NavigationProp<ROOT_PARAM_LIST>>();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [state, dispatch] = useReducer(reducer, ReducerInitialState);         // need to write type guard     
    const { userData } = useAuth();
    useEffect(() => {
        getItemByIdOrBarcode(barcode || "", itemId || "");
    }, [barcode, itemId]);

    const onPressStockIn = () => {
        navigation.navigate('StockIn', {
            itemId: itemId || '',
            barcode: barcode || '',
            itemDetail: item!,
            actionType: 'IN'
        } as any) ;
    }

    const onPressScanAgain = () => {
        navigation.goBack();
    }
    const onUpdateFinish = (updatedStocks: ItemStock[]) => {
        dispatch({ type: EDIT_ITEM_STOCK_ACTION_TYPES.SET_STOCK_OUT_FORM_VISIBLE, payload: { setFormVisible: false } });
        dispatch({ type: EDIT_ITEM_STOCK_ACTION_TYPES.UPDATE_SCANNED_ITEM_STOCK, payload: { updatedStocks } });
        Toast.show({
            text1: 'Stock out successful 👍',
            type: 'success',
            visibilityTime: 3000,
        });
    }

    const renderStockItem = ({ item }: { item: ItemStock }) => {
        const formatDate = (date: Date | string) => {
            if (!date) return 'N/A';
            const d = new Date(date);
            return d.toLocaleDateString();
        };
        return (
            <StockCard
                item={item}
                styles={styles}
                formatDate={formatDate} />
        )
    };

    /**server requests */
    const requestStockOut = async (params: EditItemStockRequestParams): Promise<ServiceResponse<EditItemStockResponseParams>> => {
        // call the stock out api with the selected stock item and the quantity
        const res = await ItemService.stockOut(params as unknown as ItemDetailRequestParams);
        if (res.success) { onUpdateFinish(res.payload.updatedStocks); }
        return res;
    }

    const getItemByIdOrBarcode = async (barcode: string, itemId: string) => {
        setLoading(true);
        try {
            // For a better demo of the skeleton loading state, we can add a small delay
            // Remove this in production
            let res: ServiceResponse<Item> | undefined;

            if (barcode) {
                res = await ItemService.getItemByBarcode(barcode);
            } else {
                res = await ItemService.getItemById(itemId);
            }

            if (res && res.success) {
                dispatch({ type: EDIT_ITEM_STOCK_ACTION_TYPES.SET_SCANNED_ITEM, payload: { scannedItem: res.payload } });
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
    if (error) return <ErrorMessage message={error} />
    if (loading) return <StockOutSkeleton /> 
    if (!item) return <ErrorMessage message="Item not found" />
    return (
        <editItemStockContext.Provider value={{...contextInitialState, userData, requestStockOut, dispatch, state}}>
            <EditItemComponent item={item} onPressStockIn={onPressStockIn} onPressScanAgain={onPressScanAgain} renderStockItem={renderStockItem} navigation={navigation} />
        </editItemStockContext.Provider>
    )
}

export default EditScannedItemStockContainer