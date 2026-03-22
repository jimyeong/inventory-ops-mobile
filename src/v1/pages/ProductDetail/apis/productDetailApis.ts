import { apiClient } from "../../../../services/ApiService";
import { ProductStockResponseData } from "../models/type";
import { V1ApiResponse } from "../../../shared/api/ApiClient";
import { Product, ProductInfo } from "../../../entities/products/models/types";
import { ProductDetailResponse, UpdateProductInfoResponse, UpdateProdutPictureRequest } from "./model";

export const getProductDetail = async (productId: string): Promise<V1ApiResponse<ProductDetailResponse>> => {
    const response = await apiClient.get(`/api/v1/products/inventory/${productId}`);
    return response.data;
}
export const getProductStock = async (productId: string): Promise<V1ApiResponse<ProductStockResponseData>> => {
    const response = await apiClient.get(`/api/v1/stocks/${productId}`);
    return response.data;
}
export const updateProductInfo = async (productInfo: ProductInfo): Promise<V1ApiResponse<ProductDetailResponse>> => {
    const response = await apiClient.put(`/api/v1/products/update`, productInfo);
    return response.data;
}
export const uploadProductImage = async (params: UpdateProdutPictureRequest): Promise<V1ApiResponse<UpdateProductInfoResponse>> => {
    const response = await apiClient.post(`/api/v1/image/upload`, params);
    return response.data;
}