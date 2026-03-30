import { useEffect, useState } from "react";
import { getItemsWithExpiredStocks } from "../apis/expiredProductApis";
import { ExpiredProductsData } from "./types";
import { ProductWithExpiredStock } from "./types";

const initialState = {
    productsWithExpiredStocks: [] as ProductWithExpiredStock[],
    total: 0,
    olderThanDays: 1,
    message: '',
};

export const useExpiredProductsData = (olderThanDays: number = 1, refreshTrigger?: number) => {
    const [expiredProductsDataState, setExpiredProductsDataState] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const fetchExpiredItems = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getItemsWithExpiredStocks(olderThanDays);
                if (response.success) {
                    setExpiredProductsDataState({
                        productsWithExpiredStocks: response.payload.products_with_expired_stocks.sort((a,b)=>a.product.product_id.localeCompare(b.product.product_id)),
                        total: response.payload.products_with_expired_stocks?.length || 0,
                        olderThanDays: olderThanDays,
                        message: response.message ?? '',
                    });
                } else {
                    setExpiredProductsDataState(initialState);
                }
            } catch (error) {
                setError(error as string);
            } finally {
                setLoading(false);
            }
        };
        fetchExpiredItems();
    }, [olderThanDays, refreshTrigger]);

    return { expiredProductsDataState, loading, error };
}