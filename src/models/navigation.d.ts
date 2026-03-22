import { Item } from './Item';
import { Product } from '../v1/features/products/model/type';
export type TYPE_STACK_ARGS = {
    item: Item;
    actionType: string;
};  

type RootStackParamList = {
  Home: undefined;
  Scanner: {
    returnScreen?: string;
  };
  StockForm: {
    item: Item;
    actionType: 'IN' | 'OUT';
  };
  StockInPage: undefined;
  StockOutPage: undefined;
  AddItem: undefined;
  MissingInfo: undefined;
  EditItem: {
    item: Item;
  };
  ScannedItemDetail: {
    barcode: string;
  };
  FillOutItemInfo: undefined;
  EditItemStock: { itemId?: string, barcode?: string };
  // v1
  ProductDetail: { product: Product; productId: string };
};

// overwrite @react-navigation/native
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type ROOT_PARAM_LIST = RootStackParamList;

