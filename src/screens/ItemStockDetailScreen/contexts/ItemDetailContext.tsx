import { useReducer, createContext } from "react";
import { Item, ItemStock, StockType } from '../../../models/Item';
import { initialState, reducer, initialState as ReducerInitialState } from "../reducer";
import { ServiceResponse } from "../../../services/ApiService";
import { AppUser } from "../../../services/AuthService";


export const enum ITEM_DETAIL_ACTION_TYPES {
    SET_SELECTED_ITEM = 'SET_SELECTED_ITEM',
    SET_STOCK_EDIT_FORM_VISIBLE = 'SET_STOCK_EDIT_FORM_VISIBLE',
    SET_STOCK_OUT_FORM_VISIBLE = 'SET_STOCK_OUT_FORM_VISIBLE',
    UPDATE_SCANNED_ITEM_STOCK = 'UPDATE_SCANNED_ITEM_STOCK',
    SET_STOCK_EDITING = 'SET_STOCK_EDITING',
    SET_STOCKOUT_INDEX = 'SET_STOCKOUT_INDEX',
}

export type ItemDetailRequestParams = {
    stockId: number;
    stock: ItemStock;
    stock_type: StockType;
    quantity: number;
    userId: string;
}

export type ItemDetailResponseParams = {
    item: Item;
    message: string;
    updatedStocks: ItemStock[];
}
const contextInitialState: {
    state: typeof ReducerInitialState;
    dispatch: React.Dispatch<any>;
    requestStockOut: (params: ItemDetailRequestParams) => (Promise<ServiceResponse<ItemDetailResponseParams>>);
    userData: null | AppUser;
    updateStock: (stockId: number, updateData: any) => Promise<ServiceResponse<ItemStock[]>>;
    getItemById: (itemId: string) => Promise<void>;
    selectedItem: Item | null;
} = {
    state: ReducerInitialState,
    dispatch: () => null,
    requestStockOut:  async (params: ItemDetailRequestParams) => Promise.resolve({success: false, data: {}, error: null} as unknown as ServiceResponse<ItemDetailResponseParams>),
    userData: null, 
    updateStock: async (stockId: number, updateData: any) => Promise.resolve({success: false, data: [], error: null} as unknown as ServiceResponse<ItemStock[]>),
    getItemById: async (itemId: string) => Promise.resolve(void 0),
    selectedItem: null,
}

// const contextInitialState = initialState;  

type ItemDetailContextType = typeof contextInitialState;

const itemDetailContext = createContext<ItemDetailContextType>(contextInitialState);    
export { itemDetailContext }; 

