import { apiClient, ServiceResponse } from "../../../../services/ApiService";
import { ExpiringProductStockBetweenDays } from "../model/types";
import { V1ApiResponse } from "../../../shared/api/ApiClient";
import { ExpiringProductsData } from "../../product-expiring/model/types";
import { StockType } from "../../../../models/Item";



export type EventType = "stock_in" | "stock_out" | "expired" | "damaged" | "sold" | "discounted";


export type DeleteStockRequestPayload = {
    stock_id: number;
    event_type: EventType;
    stock_type: StockType;
}
export type DeleteResponsePayload = {
    success: boolean;
    stockId: number;
    message: string;
}

// GET /products/expiring-stocks?startDate={startDate}&endDate={endDate}
export const expiryStockApi = {
    //
    getExpiryStockByRange: async (startDate: string, endDate: string): Promise<V1ApiResponse<ExpiringProductStockBetweenDays>> => {
        const response = await apiClient.get(`/api/v1/products/expiring-stocks?startDate=${startDate}&endDate=${endDate}`);
        return response.data;
    },
    // GET /products/expiring-stocks-with-days-left?daysLeft={daysLeft}
    getExpiryProductWithStockWithLeftDays: async (daysLeft: number): Promise<V1ApiResponse<ExpiringProductsData>> => {
        const response = await apiClient.get(`/api/v1/products/expiring-stocks-with-days-left?daysLeft=${daysLeft}`);
        return response.data;
    },
    deleteStockWithEvent: async (params: DeleteStockRequestPayload): Promise<V1ApiResponse<DeleteResponsePayload>> => {
        
        const response = await apiClient.post(`/api/v1/products/finalise-expired-stock`, params);
        return response.data;
    }
}

