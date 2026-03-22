import { Product } from '../v1/entities/products/models/types';
import { Item, ItemStock } from './Item';
import { ProductInfo } from '../v1/entities/products/models/types';


export type ROOT_PARAM_LIST = {
  Splash: undefined;
  Home: undefined;
  Scanner: {
    returnScreen?: string;
    debounceTime?: number; // Optional debounce time for barcode scanning in milliseconds
    targetField?: string; // Optional field to specify which barcode field to update
  };
  AddItem: { barcode?: string; box_barcode?: string };
  StockForm: { item: Item; actionType: 'IN' | 'OUT', targetStockItem?: ItemStock };
  MissingInfo: undefined;
  EditItem: { itemId: string };
  ScannedItemDetail: { barcode?: string; item?: Item; stockId?: string; itemId?: string };
  ItemDetailEdit: { itemId: string, item: Item, barcode?: string; box_barcode?: string };
  FillOutItemInfo: undefined;
  // StockIn: { barcode?: string, itemDetail: Item, actionType: 'IN', itemId?: string };
  BarcodeMining: undefined; // New screen for barcode mining feature
  ExpiringItems: undefined; // New screen for items expiring soon
  EditItemStock: { itemId?: string, barcode?: string };

  // v1
  ProductDetail: { product: Product; product_id: string; prev_screen?: string; message?: string; is_updated?: boolean; event_type?: string };
  ProductInfoUpdate: { product_info: ProductInfo, prev_screen?: string; message?: string; is_updated?: boolean; event_type?: string };  
  StockIn: { product: Product; };
  ExpiryStock: undefined;
};