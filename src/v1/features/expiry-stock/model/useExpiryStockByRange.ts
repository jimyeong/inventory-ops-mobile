import { useEffect, useState, useCallback } from 'react';


import { expiryStockApi } from '../api/expiryStockApi';
import { Product } from '../../../entities/products/models/types';
import { PaginationInfo } from '../../../shared/api/ApiClient';
import { ProductStock } from '../../../entities/stocks/models/types';
import { StockWithPicture } from './types';


interface ExpiryStockByRangeState {
    products: Product[];
    startDate: string;
    endDate: string;
    total: number;
    loading: boolean;
    error: string | null;
}
// @param startDate: string in format YYYY-MM-DD
// @param endDate: string in format YYYY-MM-DD
export const useExpiryStockByRange = (
    startDate: string,
    endDate: string,

) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [rangedList, setRangedList] = useState<ExpiryStockByRangeState>({ products: [], startDate: '', endDate: '', total: 0, loading: false, error: null });
    const [stocksWithPictures, setStocksWithPictures] = useState<StockWithPicture[]>([]);
    const refetch = useCallback(async () => {
        
        setLoading(true);
        setError(null);
        try {
            const res = await expiryStockApi.getExpiryStockByRange(startDate, endDate);
            if (res.success) {
                setRangedList((prev) => ({
                    ...prev,
                    products: res.payload.products.sort((a, b) => a.product_id.localeCompare(b.product_id)),
                    startDate: res.payload.startDate,
                    endDate: res.payload.endDate,
                    total: res.payload.total || 0,
                }));
                console.log("@@@res.payload.products", res.payload);
                const stocksWithPictures: StockWithPicture[] = [];
                for (const product of res.payload.products) {
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
                }else{
                    setStocksWithPictures([]);
                }
            } else {
                setError(res.message);
            }
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return { rangedList, loading, error, total: rangedList.total || 0, startDate, endDate, refetch, stocksWithPictures };
}
