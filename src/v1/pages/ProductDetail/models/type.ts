import { ProductStock } from "../../../entities/stocks/models/types";

interface ProductStockResponseData {
    itemId: string
    stocks: ProductStock[]
    total: number
}
export type { ProductStockResponseData };