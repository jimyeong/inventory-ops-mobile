import { apiClient, ServiceResponse } from '../../../../services/ApiService';
import { StockInRequestParams, StockInResponseParams , StockDeleteResponseParams } from '../models/types';
import { V1ApiResponse } from '../../../shared/api/ApiClient';

//fix this too
export const stockCreateApi = {
    stockIn: async (stockData: StockInRequestParams, idempotency_key: string): Promise<V1ApiResponse<StockInResponseParams>> => {
        console.log('stockData', stockData);
        try {

            const response = await apiClient.post('/api/v1/stocks/create', stockData, {
                headers: {
                    'Idempotency-Key': idempotency_key,
                },
            });            
            return response.data;
        } catch (error) {
            console.error('Error performing stock in:', error);
            throw error;
        }
    },
    stockDelete: async (stockId: number): Promise<V1ApiResponse<StockDeleteResponseParams>> => {
        try {
            const response = await apiClient.delete(`/api/v1/stocks/delete/${stockId}`);
            return response.data;
        } catch (error) {
            console.error('Error performing stock delete:', error);
            throw error;
        }
    }

}