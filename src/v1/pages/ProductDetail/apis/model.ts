import { Product, ProductInfo } from "../../../entities/products/models/types";

export interface ProductDetailResponse {
    product_id: string;
    products: {
        [productId: string]: Product;
    };
    total: number;
}

export interface UpdateProductInfoResponse {
    image_path: string;
    image_id: string;
    file_size: number;
    message: string;
    success: boolean;
    timestamp: string;
    file_name: string;
}
export interface UpdateProdutPictureRequest {
    file: FormData;
    metadata: any;
}