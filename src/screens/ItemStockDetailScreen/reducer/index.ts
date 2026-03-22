import { Item, ItemStock, ItemStockWithUI } from "../../../models/Item";
import { ITEM_DETAIL_ACTION_TYPES } from "../contexts/ItemDetailContext";
import { ItemDetailRequestParams, ItemDetailResponseParams } from "../contexts/ItemDetailContext";
import { ServiceResponse } from "../../../services/ApiService";
import { AppUser } from "../../../services/AuthService";



export const initialState: {
    selectedItem: Item | null; // need to write type guard
    userData: AppUser | null;   
    getItemById: (itemId: string) => Promise<void>;
} = {
    selectedItem: null,
    userData: null,
    getItemById: async (itemId: string) => Promise.resolve(void 0),
}

/**
 * reducer types
 */
export type TYPE_SELECTED_ITEM = { selectedItem: Item }         
export type TYPE_UPDATE_SCANNED_ITEM = { updatedStocks: ItemStock[] }
export type TYPE_PAYLOAD = TYPE_SELECTED_ITEM | TYPE_UPDATE_SCANNED_ITEM | TYPE_SET_EDITING_STOCK_INDEX | TYPE_SET_STOCKOUT_INDEX
export type TYPE_SET_EDITING_STOCK_INDEX = { editingStockIndex: number, isSelectedForEdit: boolean }
export type TYPE_SET_STOCKOUT_INDEX = { stockOutIndex: number, isSelectedForStockOut: boolean }

export type TYPE_ITEM_DETAIL_ACTION = {
    type: ITEM_DETAIL_ACTION_TYPES;
    payload: TYPE_PAYLOAD;
};


export const reducer = (
    state: typeof initialState, 
    action: TYPE_ITEM_DETAIL_ACTION
): typeof initialState => {
    switch (action.type) {
        case ITEM_DETAIL_ACTION_TYPES.SET_STOCKOUT_INDEX:
            const {stockOutIndex, isSelectedForStockOut} = action.payload as TYPE_SET_STOCKOUT_INDEX;
            if(!state.selectedItem) return state
            const editingItem =state.selectedItem.stock.map((item) => {
                if(item.stock_id === stockOutIndex)return {...item, isSelectedForStockOut}
                return item
            })
            return {...state, selectedItem: {...state.selectedItem, stock: editingItem}} 
        case ITEM_DETAIL_ACTION_TYPES.SET_STOCK_EDITING:
            // set selected stock index
            const { editingStockIndex , isSelectedForEdit } = action.payload as TYPE_SET_EDITING_STOCK_INDEX;
            if(!state.selectedItem) return state
            const newStock = state.selectedItem.stock.map((item) => {
                if(item.stock_id === editingStockIndex)return {...item, isSelectedForEdit}
                return item
            })
            return {...state, selectedItem: {...state.selectedItem, stock: newStock}}
        case ITEM_DETAIL_ACTION_TYPES.SET_SELECTED_ITEM:
            const { selectedItem } = action.payload as TYPE_SELECTED_ITEM;
            if(!selectedItem) return state
            return { ...state, selectedItem };
        case ITEM_DETAIL_ACTION_TYPES.UPDATE_SCANNED_ITEM_STOCK:
            const { updatedStocks } = action.payload as TYPE_UPDATE_SCANNED_ITEM;
            if(!state.selectedItem) return state // important type guard
            return { ...state, selectedItem: {
                ...state.selectedItem,
                stock: updatedStocks as ItemStockWithUI[]
            }
        };
        default:
            return state;
    }
}

