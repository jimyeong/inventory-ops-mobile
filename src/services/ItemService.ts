import { apiClient, ServiceResponse, setHeader } from './ApiService';
import { Item, ItemWithMissingInfo, MissingInfoResponse, ItemStock, PaginatedItemsResponse, Tag } from '../models/Item';
import { TypeStockRequestParams } from '../models/Item';
import { ItemDetailRequestParams, ItemDetailResponseParams } from '../screens/ItemStockDetailScreen/contexts/ItemDetailContext';
import { SearchResult } from '../models/Item';

// just box for now
export type SearchType = "code" | "barcode" | "name"
type StockType = "BOX" | "BUNDLE" | "PCS"
class ItemService {

  async stockIn(
    item: Item,
    stock_type: StockType,
    quantity: number,
    userId: string,
    expiry_date: Date,
    notes?: string,
    location?: string,
    discount_rate: number = 0): Promise<ServiceResponse<void>> {
    try {
      // Create the API request
      // Current time will be used for registeredDate and createdAt on the server side
      
      const stockData = {
        item_id: item.id,
        stock_type: stock_type,
        quantity,
        expiry_date: expiry_date,
        registering_person: userId,
        location: location || '',
        notes: notes || '',
        discount_rate: discount_rate
      };
      
      const response = await apiClient.post(`/api/v1/stockIn`, stockData);
      return response.data;
    } catch (error) {
      console.error('Error performing stock in:', error);
      throw error;
    }
  }

  async stockOut(
    requestParams: ItemDetailRequestParams
  ): Promise<ServiceResponse<ItemDetailResponseParams >> {
    try {
      // Validate quantity based on stock type
      let currentStock = 0;
      if (requestParams.stock_type.toLowerCase() === 'box' && requestParams.quantity > 0) {
        currentStock = parseInt(requestParams.stock.box_number || '0', 10);
      } else if (requestParams.stock_type.toLowerCase() === 'bundle' && requestParams.quantity > 0) {
        currentStock = parseInt(requestParams.stock.bundle_number || '0', 10);
      } else if (requestParams.stock_type.toLowerCase() === 'pcs' && requestParams.quantity > 0) {
        currentStock = parseInt(requestParams.stock.pcs_number || '0', 10);
      }

      if (requestParams.quantity > currentStock) {
        throw new Error(`Cannot stock out more than available quantity (${currentStock})`);
      }
      
      // Create the API request
      const stockData = {
        stock: requestParams.stock,
        stock_id: requestParams.stock.stock_id,
        stock_type: requestParams.stock_type,
        quantity: requestParams.quantity,
        registering_person: requestParams.userId,
        location: requestParams.stock.location || '',
        notes: requestParams.stock.notes || '',
        discount_rate: requestParams.stock.discount_rate || 0,
      };
      
      
      const response = await apiClient.post(`/api/v1/stockOut`, stockData);
      return response.data;
    } catch (error) {
      console.error('Error performing stock out:', error);
      throw error;
    }
  }
  async createNewItem(item: Item) {
    try {
      const response = await apiClient.post(`/api/v1/createNewItem`, item);
      return response.data;
    } catch (error) {
      console.error('Error creating item:', error);
      throw error;
    }
  }

  // Register a new item
  async registerItem(item: Item) {
    try {
      const response = await apiClient.post(`/api/v1/registerItem`, item);
      return response.data;
    } catch (error) {
      console.error('Error registering item:', error);
      throw error;
    }
  }

  // Get all items
  async getItems() {
    try {
      const response = await apiClient.get(`/getItems`);
      return response.data;
    } catch (error) {
      console.error('Error getting items:', error);
      throw error;
    }
  }
  async getItemByBarcode(barcode: string): Promise<ServiceResponse<Item>> {
    try {
      const response = await apiClient.get<ServiceResponse<Item>>(`/api/v1/getItemByBarcode?barcode=${barcode}`); 
      return response.data as unknown as ServiceResponse<Item>;
    } catch (error) {
      console.error('Error fetching item by barcode:', error);
      throw error;
    }
  }
  // Get item by ID
  async editItemById(id: string): Promise<ServiceResponse<Item>> {
    try {
      const response = await apiClient.get(`/api/v1/editItem/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching item by ID:', error);
      throw error;
    }
  }

  // Get item by ID
  async getItemById(id: string): Promise<ServiceResponse<Item>> {
    try {
      const response = await apiClient.get(`/api/v1/getItemById?itemId=${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching item by ID:', error);
      throw error;
    }
  }
  

  // Update an item
  async updateItem(item: Partial<Item>): Promise<ServiceResponse<Item>> {
    try {
      const response = await apiClient.put('/api/v1/updateItem', item);
      return response.data;
    } catch (error) {
      console.error('Error updating item:', error);
      
      throw error;
    }
  }
  // Get items with missing information
  async getItemsWithMissingInfo(): Promise<MissingInfoResponse> {
    try {
      const response = await apiClient.get('/api/v1/getItemsWithMissingInfo');
      return response.data;
    } catch (error) {
      console.error('Error fetching items with missing info:', error);
      throw error;
    }
  }
  
  // Search items by barcode, code, or name
  async lookupItems(searchType: SearchType, value: string): Promise<ServiceResponse<SearchResult>> {
    try {
      const response = await apiClient.post('/api/v1/lookupItems', {
        search_type: searchType,
        value: value
      });
      return response.data;
    } catch (error) {
      console.error('Error looking up items:', error);
      throw error;
    }
  }
  
  // Get item recommendations based on tags with pagination
  async getRecommendations(
    tag_ids: string[], 
    limit: number = 10, 
    page: number = 1
  ): Promise<{
    itemDetails: Item[],
    total: number,
    tag_ids: string[],
    requested: number,
    page: number
  }> {
    try {
      const response = await apiClient.post('/api/v1/recommendations', {
        tag_ids,
        limit,
        page
      });
      return response.data.payload;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw error;
    }
  }
  
  // Get all available tags
  async getTags(): Promise<ServiceResponse<{tags: Tag[]}>> {
    try {
      const response = await apiClient.get('/api/v1/tags');
      return response.data;
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }
  }

  // Get paginated items
  async getItemsPaginated(page: number = 1, limit: number = 10, tagParams?: string): Promise<PaginatedItemsResponse> {
    let url = `/api/v1/getItemsPaginated?page=${page}&limit=${limit}`
    if (tagParams) url+=`&tag=${tagParams}`
    try {
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching paginated items:', error);
      throw error;
    }
  }

  // AI Fillout - Get item information from AI based on barcode
  async filloutWithAI(barcode: string): Promise<ServiceResponse<{
    name_kor: string;
    name_eng: string;
    name_chi: string;
    name_jpn: string;
    ingredients: string;
    halal: boolean;
    beef: boolean;
    pork: boolean;
    reasoning: string;
  }>> {
    try {
      const response = await apiClient.post('/api/v1/fillout-ai', { barcode });
      return response.data;
    } catch (error) {
      console.error('Error with AI fillout:', error);
      throw error;
    }
  }


  async getItemTags(itemId: string): Promise<ServiceResponse<Tag[]>> {
    // /tags/item/{itemId}
    const response = await apiClient.get(`/api/v1/tags/item/${itemId}`);
    return response.data;
  }

  // AI Barcode Analysis - Get item information from AI based on barcode
  async analyzeBarcode(barcode: string, productName: string): Promise<ServiceResponse<{
    name_kor: string;
    name_eng: string;
    name_chi: string;
    name_jap: string;
    hasBeef: boolean;
    hasPork: boolean;
    isHalal: boolean;
  }>> {
    try {
      const response = await apiClient.post('/api/v1/analyze_barcode', { barcode, productName });
      return response.data;
    } catch (error) {
      console.error('Error with AI barcode analysis:', error);
      throw error;
    }
  }

  // Get items expiring within specified days
  async getItemsExpiringWithinDays(within: number): Promise<ServiceResponse<{
    expiring_items: Array<{
      item: Item;
      days_to_expiry: number;
      stock_id: string;
      tag_names: string[];
    }>;
    total: number;
    within_days: number;
    message: string;
  }>> {
    try {
      const response = await apiClient.get(`/api/v1/getItemsExpiringWithinDays?within=${within}`);
      return response.data; 
    } catch (error) {
      console.error('Error fetching expiring items:', error);
      throw error;
    }
  }

  // Delete stock
  async deleteStock(stockId: number): Promise<ServiceResponse<ItemStock[]>> {
    try {
      const response = await apiClient.delete(`/api/v1/stock/${stockId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting stock:', error);
      throw error;
    }
  }

  // Update stock information
  async updateStock(stockId: number, updateData: {
    discount_rate?: number;
    expiry_date?: Date;
    location?: string;
    notes?: string;
  }): Promise<ServiceResponse<ItemStock[]>> {
    try {
      const response = await apiClient.put(`/api/v1/stockUpdate`, {
        stock_id: stockId,
        ...updateData
      });
      return response.data;
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  }

  async createTag(tag_name: string): Promise<ServiceResponse<Tag>> {
    const response = await apiClient.post('/api/v1/tags/create', { tag_name });
    return response.data;
  }

}

export default new ItemService();