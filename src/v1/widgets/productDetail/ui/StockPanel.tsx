import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import NoStockAvailable from '../../../entities/stocks/ui/NoStockAvailable';
import SwipeableStockCard from '../../../entities/stocks/ui/StockCard/SwipeableStockCard';
import { ProductStock } from '../../../entities/stocks/models/types';
interface StockPanelPropsType {
    stocks: ProductStock[];
    onHandleStockUpdate: (stock: ProductStock) => void;
    onHandleStockDelete?: (stockId: number) => void;
}
interface EditingStockProps {
    stock_id: number;
    isEditing: boolean;
}
const StockPanel = ({ stocks, onHandleStockUpdate, onHandleStockDelete }: StockPanelPropsType) => {
    // const editingMap = new Map<number, boolean>();
    const [editingMap, setEditingMap] = useState<{ [key: number]: EditingStockProps }>({});

    const handleStockUpdate = (stock: ProductStock) => {
        setEditingMap({ ...editingMap, [stock.stock_id]: { stock_id: stock.stock_id, isEditing: true } });
    };
    const handleStockCancel = (stock_id: number) => {
        setEditingMap({ ...editingMap, [stock_id]: { stock_id: stock_id, isEditing: false } });
    };
    if (!stocks || stocks.length === 0) return <NoStockAvailable />
    return (
        <View style={styles.container}>
            <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
                {stocks.map((stock, index) => {
                    const isEditing = editingMap[stock.stock_id]?.isEditing;
                    return (
                        <SwipeableStockCard
                            isEditing={!isEditing ? false : true}
                            key={stock.stock_id || index}
                            stock={stock}
                            index={index}
                            onUpdate={handleStockUpdate}
                            onCancel={handleStockCancel}
                            onHandleStockUpdate={onHandleStockUpdate}
                            onDelete={onHandleStockDelete}
                        />
                    )
                })}
            </ScrollView>
        </View>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    tabContent: {
        flex: 1,
    },
});

export default StockPanel;