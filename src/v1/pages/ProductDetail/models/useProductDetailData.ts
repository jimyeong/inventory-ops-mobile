import { useEffect, useState } from "react";
import { Item } from "../../../../models/Item";
import { getProductStock } from "../apis/productDetailApis";
import { ProductStockResponseData } from "./type";

// receive product item from previous screen.
// fetch stock status from api.

export const useProductDetailData = (itemId: string) => {
    const [productStock, setProductStock] = useState<ProductStockResponseData | null>(null);
    useEffect(() => {
        const fetchProductStock = async () => {
            try {
                const response = await getProductStock(itemId);
                if (response.success) {
                    setProductStock({ ...response.payload, stocks: response.payload.stocks || [] });
                }
            } catch (error) {
                console.error("ERROR GETTING PRODUCT STOCK", error);
            }
        }
        fetchProductStock()
    }, [itemId]);
    return { productStock };
}