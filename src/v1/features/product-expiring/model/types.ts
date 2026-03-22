import { Product } from "../../../entities/products/models/types";
import { ExpiredStock } from "../../../entities/stocks/models/types";

// DTO
export interface ExpiringProductsData {
    expiring_products: Product[];
    total: number;
    ahead_of_days: number;
    message: string;
}
export interface ExpiredProductsData {
    expiring_products: Product[];
    total: number;
    older_than_days: number;
    message: string;
}


export interface ProductWithExpiredStock {
    product: Product;
    expired_stocks: ExpiredStock[];
}