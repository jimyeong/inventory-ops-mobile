import { useEffect, useState, useCallback } from "react";
import { expiryStockApi } from "../api/expiryStockApi";
import { Product } from "../../../entities/products/models/types";
import { PaginationInfo } from "../../../shared/api/ApiClient";
import { StockWithPicture } from "./types";

interface ExpiryProductWithStockWithLeftDaysState {
    products: Product[];
    daysLeft: number;
    isExpired: boolean;
    total: number;
}

/**
 * Fetches products with stock that have a specific number of days left until expiry.
 * @param daysLeft - Number of days until expiry (use negative values for expired products)
 */
export const useExpiryProductWithStockWithLeftDays = (daysLeft: number) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<ExpiryProductWithStockWithLeftDaysState>({
        products: [],
        daysLeft: -1,
        isExpired: true,
        total: 0,
    });
    const [stocksWithPictures, setStocksWithPictures] = useState<StockWithPicture[]>([]);
    // fix 
    const refetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res =
                await expiryStockApi.getExpiryProductWithStockWithLeftDays(daysLeft);
            if (res.success && res.payload) {
                setData({
                    products: res.payload.expiring_products,
                    daysLeft: res.payload.ahead_of_days,
                    isExpired: false,
                    total: res.payload.total ?? 0,
                });
                const stocksWithPictures: StockWithPicture[] = [];
                for (const product of res.payload.expiring_products) {
                    for (const stock of product.stock) {
                        stocksWithPictures.push({
                            ...stock,
                            expiry_date: new Date(stock.expiry_date),
                            image_path: product.image_path,
                            product_id: product.product_id,
                        
                            name: product.name,
                            name_kor: product.name_kor,
                            name_eng: product.name_eng,
                            name_chi: product.name_chi,
                            name_jap: product.name_jap,
                            code: product.code,
                            price: product.price,
                            box_price: product.box_price
                        });
                    }
                }
                if (stocksWithPictures.length > 0) {
                    setStocksWithPictures(stocksWithPictures.sort((a, b) => a.expiry_date.getTime() - b.expiry_date.getTime()));
                } else {
                    setStocksWithPictures([]);
                }

            } else {
                setError(res.message ?? "Failed to fetch expiry products");
            }
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }, [daysLeft]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return { loading, error, refetch, stocksWithPictures, setStocksWithPictures ,...data, daysLeft };
};