import { apiClient, ServiceResponse } from '../../../../services/ApiService';
import { StockInRequestParams, StockInResponseParams } from '../models/types';

export const stockCreateApi = {
    stockIn: async (stockData: StockInRequestParams, idempotency_key: string): Promise<ServiceResponse<StockInResponseParams>> => {
        console.log('stockData', stockData);
        try {

            const response = await apiClient.post('/api/v1/stocks/create', stockData, {
                headers: {
                    'Idempotency-Key': idempotency_key,
                },
            });            
            console.log('response', response.data);
            return response.data;
        } catch (error) {
            console.error('Error performing stock in:', error);
            throw error;
        }
    }

}