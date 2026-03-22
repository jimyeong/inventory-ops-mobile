export type StockType = 'BOX' | 'BUNDLE' | 'PCS';
export interface Item {
  id: string;
  code: string;
  price: number;
  box_price?: number;
  barcode: string;
  barcode_for_box?: string;
  box_barcode?: string;
  name: string;
  name_kor: string;
  name_eng: string;
  name_chi: string;
  name_jap: string;
  type: string;
  available_for_order: boolean;
  image_path: string;
  ingredients?: string;
  has_beef?: boolean;
  has_pork?: boolean;
  is_halal?: boolean;
  reasoning?: string;
  created_at: Date;
  stock: ItemStockWithUI[];
  tags: Tag[];
}
export interface ItemStock{
  stock_id: number;
  item_id: string;
  box_number: string;
  bundle_number: string;
  pcs_number: string;
  expiry_date: Date;
  registered_date: Date;
  created_at: Date;
  location?: string;
  registering_person: string;
  notes?: string;
  discount_rate: number;
  stock_type: StockType;
}
export interface ItemStockWithUI extends ItemStock {
  isSelectedForEdit: boolean;
  isSelectedForStockOut: boolean;
}
export interface StockTransaction extends ItemStock{
  id: string;
  type: 'IN' | 'OUT';
  stockType: StockType;
  quantity: number;
  date: Date;
  userId: string;
}

export interface ItemWithMissingInfo {
  item: Item;
  stock: ItemStock[];
  missingFields: string[];
}

export interface MissingInfoResponse {
  message: string;
  payload: {
    itemsWithMissingInfo: ItemWithMissingInfo[];
    missingByCategory: {
      code: Item[];
      barcode: Item[];
      name: Item[];
      image_path: Item[];
    };
    total_with_missing_info: number;
    total_missing_code: number;
    total_missing_barcode: number;
    total_missing_name: number;
    total_missing_image: number;
  };
  success: boolean;
  user_exists: boolean;
}

export interface Tag {
  id: string;
  tag_name: string;
  color?: string;
  count?: number;
}

export type TypeStockRequestParams = {
  stock: ItemStock;
  stock_type: string;
  quantity: number;
  userId: string;
  notes: string;
  location: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total_items: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface PaginatedItemsResponse {
  message: string;
  payload: {
    items: Item[];
    pagination: PaginationInfo;
  };
  success: boolean;
  user_exists: boolean;
}

export type SearchResultItem = {
  item: Item;
  tag_names: string[];
}
export interface SearchResult {
  searchItems: SearchResultItem[];
  searchType: string;
  searchValue: string;
  total: number;
}
