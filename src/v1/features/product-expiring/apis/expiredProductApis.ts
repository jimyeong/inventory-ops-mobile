import { apiClient, ServiceResponse } from "../../../../services/ApiService";
import { ExpiredProductsData, ExpiringProductsData } from "../model/types";
import { V1ApiResponse } from "../../../shared/api/ApiClient";
import { Product } from "../../../entities/products/models/types";
import { ExpiredStock, ProductStock } from "../../../entities/stocks/models/types";
import { ProductWithExpiredStock } from "../model/types";

export interface ExpiredProductsResponse {
    products_with_expired_stocks: ProductWithExpiredStock[];
}
export async function getItemsWithExpiredStocks(olderThanDays: number = 1): Promise<V1ApiResponse<ExpiredProductsResponse>> {
    try {
        const response = await apiClient.get(`/api/v1/products/expired-inventory?olderThanDays=${olderThanDays}`);
        return response.data;
    } catch (error) {
        console.error('Error getting items with expired stocks older than days:', error);
        throw error;
    }
}
export async function getInventoryWithExpiryDaysLeft(daysLeft: number = 7): Promise<V1ApiResponse<ExpiringProductsData>> {
    try {
        const response = await apiClient.get(`/api/v1/products/expiring-stocks-with-days-left?daysLeft=${daysLeft}`);
        return response.data;
    } catch (error) {
        console.error('Error getting items with expired stocks ahead of days:', error);
        throw error;
    }
}