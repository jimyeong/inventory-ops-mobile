import { ViewStyle } from "react-native";
import { Product } from "../../../../entities/products/models/types";
import { V1ApiResponse } from "../../../../shared/api/apiClient";

// export type ProductSearchType = 'name' | 'code' | 'barcode';

export type ProductSearchType = 'code';

// DTS
export interface ProductSearchBarProps {
  // Core functionality
  value: string;
  onChangeText: (text: string) => void;
  onSearch: (query: string, searchType: ProductSearchType) => void;

  // Search configuration
  searchTypes?: ProductSearchType[];
  defaultSearchType?: ProductSearchType;

  // State
  isSearching?: boolean;
  disabled?: boolean;

  // Styling
  containerStyle?: ViewStyle;

  // UI options
  showTypeSelector?: boolean;
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
    items: Product[];
    pagination: PaginationInfo;
  };
  success: boolean;
  user_exists: boolean;
}

export type SearchResultProduct = {
  product: Product;
  // add if needed
}

// export interface SearchQueryResult extends V1ApiResponse<SearchResultPayload> {
//   payload: SearchResultPayload;
// }

export type SearchType = "code" | "barcode" | "name"
export type SearchInventoryRequest = {
  search_type: SearchType;
  value: string;
}
export interface SearchResult {
  results: SearchResultProduct[];
  searchType: string;
  searchValue: string;
  total: number;
}
