import React,{useContext, createContext} from 'react'
import { Item, ItemStock, StockType } from '../../../models/Item';
import { AppUser } from '../../../services/AuthService';
import { ServiceResponse } from '../../../services/ApiService';
import { ReducerInitialState } from '../reducer/EditItemStockReducer';

export type EditItemStockRequestParams = {
    stockId: number;
    stock: ItemStock;
    stockType: StockType;
    quantity: number;
    userId: string;
}

export type EditItemStockResponseParams = {
    item: Item;
    message: string;
    updatedStocks: ItemStock[];
}
export const enum EDIT_ITEM_STOCK_ACTION_TYPES {
    SET_SCANNED_ITEM = 'SET_SCANNED_ITEM',
    SET_STOCK_OUT_FORM_VISIBLE = 'SET_STOCK_OUT_FORM_VISIBLE',
    UPDATE_SCANNED_ITEM_STOCK = 'UPDATE_SCANNED_ITEM_STOCK',
}


export const contextInitialState: {
    state: typeof ReducerInitialState   ;
    dispatch: React.Dispatch<any>;
    requestStockOut: (params: EditItemStockRequestParams) => (Promise<ServiceResponse<EditItemStockResponseParams>>);
    userData: null | AppUser;
} = {
    state: ReducerInitialState,
    dispatch: () => null,
    requestStockOut:  async (params: EditItemStockRequestParams) => Promise.resolve({success: false, data: {}, error: null} as unknown as ServiceResponse<EditItemStockResponseParams>),
    userData: null,
}


// const contextInitialState = initialState;  

type EditItemStockContextType = typeof contextInitialState;

const editItemStockContext = createContext<EditItemStockContextType>(contextInitialState);    
export { editItemStockContext }; 

