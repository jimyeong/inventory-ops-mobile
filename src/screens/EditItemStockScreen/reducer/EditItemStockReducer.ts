import { AppUser } from "../../../services/AuthService";
import { Item, ItemStock } from "../../../models/Item";
import { contextInitialState, EDIT_ITEM_STOCK_ACTION_TYPES } from "../contexts/EditItemStockContext";





export const ReducerInitialState: {
    isStockOutFormVisible: boolean;
    scannedItem: Item | null; // need to write type guard
    userData: AppUser | null;   
} = {
    isStockOutFormVisible: false,
    scannedItem: null,
    userData: null,
}

/**
 * reducer types
 */
export type TYPE_SCANNED_ITEM = { scannedItem: Item }
export type TYPE_SET_STOCK_OUT_FORM_VISIBLE = { setFormVisible: boolean }
export type TYPE_UPDATE_SCANNED_ITEM = { updatedStocks: ItemStock[] }
export type TYPE_PAYLOAD = TYPE_SCANNED_ITEM | TYPE_SET_STOCK_OUT_FORM_VISIBLE | TYPE_UPDATE_SCANNED_ITEM

export type TYPE_EDIT_ITEM_STOCK_ACTION  = {
    type: EDIT_ITEM_STOCK_ACTION_TYPES;
    payload: TYPE_PAYLOAD;
};


export const reducer = (
    state: typeof ReducerInitialState, 
    action: TYPE_EDIT_ITEM_STOCK_ACTION
): typeof ReducerInitialState => {
    switch (action.type) {
        case EDIT_ITEM_STOCK_ACTION_TYPES.SET_SCANNED_ITEM:
            const { scannedItem } = action.payload as TYPE_SCANNED_ITEM;
            if(!scannedItem) return state
            return { ...state, scannedItem };
        case EDIT_ITEM_STOCK_ACTION_TYPES.UPDATE_SCANNED_ITEM_STOCK:
            const { updatedStocks } = action.payload as TYPE_UPDATE_SCANNED_ITEM;
            if(!state.scannedItem) return state // important type guard
            return { ...state, scannedItem: {
                ...state.scannedItem,
                stock: updatedStocks
            }
        };
        case EDIT_ITEM_STOCK_ACTION_TYPES.SET_STOCK_OUT_FORM_VISIBLE:
            const { setFormVisible } = action.payload as TYPE_SET_STOCK_OUT_FORM_VISIBLE;
            if(!setFormVisible) return state
            return { ...state, isStockOutFormVisible: setFormVisible };
        default:
            return state;
    }
}

