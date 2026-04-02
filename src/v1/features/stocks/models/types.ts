import { Product } from "../../../entities/products/models/types";
import { ProductStock } from "../../../entities/stocks/models/types";


export type StockInRequestParams = {
    item_id: string;
    stock_type: "BOX" | "PCS";
    quantity: number;
    expiry_date: Date;
    registering_person: string;
    location: string;
    notes: string;
    discount_rate: number;
}
export type StockInResponseParams = {
    product: Product;   
    message: string;
    updatedStocks: ProductStock[];
    addedStocks: ProductStock[];
}
export type StockDeleteResponseParams = {
    success: boolean;
    message: string;
}