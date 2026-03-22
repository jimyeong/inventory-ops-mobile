import { apiClient, ServiceResponse } from './ApiService';

export interface BarcodeMiningResponse {
  barcode: number;
  message: string;
}

class BarcodeMiningServiceClass {
  /**
   * Saves a barcode to the server for mining/analytics purposes
   * @param barcode The barcode to save
   * @returns A promise with the server response
   */
  async saveBarcode(barcode: string): Promise<ServiceResponse<BarcodeMiningResponse>> {
    try {
      const response = await apiClient.post<ServiceResponse<BarcodeMiningResponse>>(
        '/api/v1/saveBarcode', 
        { barcode: barcode }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error saving barcode for mining:', error);
      throw error;
    }
  }
}

export const BarcodeMiningService = new BarcodeMiningServiceClass();