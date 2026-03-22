import { apiClient } from "../../../../services/ApiService";
import { Product, ProductInfo } from "../../../entities/products/models/types";
import { V1ApiResponse } from "../../../shared/api/apiClient";

interface UpdateProductResponse {
    updated: Product;
}

interface UpdateProductRequest extends ProductInfo {
}
const productApis = {
    updateProduct: async (params: UpdateProductRequest) : Promise<V1ApiResponse<UpdateProductResponse>>=> {
        try {
            const response = await apiClient.put(`/api/v1/product/update`, params);
            return response.data;
        } catch (error) {
            console.error("error", error);
            throw error;
        }
    }
}

export default productApis;