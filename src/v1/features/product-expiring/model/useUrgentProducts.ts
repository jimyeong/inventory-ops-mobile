import { useEffect } from "react";
import { useState } from "react";
import { getInventoryWithExpiryDaysLeft } from "../apis/expiredProductApis";
import { Product } from "../../../entities/products/models/types";
import { ExpiringProductsData } from "./types";
import { expiryStockApi } from "../../expiry-stock/api/expiryStockApi";

const initialState: ExpiringProductsData = {
    expiring_products: [],
    total: 0,
    ahead_of_days: 7,
    message: '',
};
export const useUrgentProductsData = (refreshTrigger?: number) => {
    const [urgetProductList, setUrgentProductList] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const fetchUrgentItems = async () => {
            setLoading(true);
            setError(null);
            try {
                const today = new Date().toISOString().split('T')[0];
                const endDate = new Date(new Date(today).setDate(new Date(today).getDate() + 6)).toISOString().split('T')[0];
                const response = await expiryStockApi.getExpiryStockByRange(today, endDate);
                if (response.success) {
                    setUrgentProductList({
                        expiring_products: response.payload.products.sort((a, b) => a.product_id.localeCompare(b.product_id)),
                        total: response.payload.total,
                        ahead_of_days: 7,
                        message: response.message,
                    });
                }else{
                    setUrgentProductList(initialState);
                }
            } catch (error) {
                setError(error as string);
            } finally {
                setLoading(false);
            }
        };
        fetchUrgentItems();
    }, [refreshTrigger]);

    return { urgetProductList, loading, error };
}