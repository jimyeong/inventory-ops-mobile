import { apiClient, ServiceResponse } from '../../../../services/ApiService';
import { StockInRequestParams } from '../models/types';

export const stockCreateApi = {
    stockIn: async (stockData: StockInRequestParams): Promise<ServiceResponse<void>> => {
        const response = await apiClient.post('/api/v1/stockIn', stockData);
        return response.data;
    }
    
}