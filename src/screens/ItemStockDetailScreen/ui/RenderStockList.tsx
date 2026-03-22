import { View, Text, FlatList, ListRenderItemInfo } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ItemStock, ItemStockWithUI } from '../../../models/Item';
interface RenderStockList {
    stock: ItemStockWithUI[]; styles: any;
    renderStockItem: (item: ListRenderItemInfo<ItemStockWithUI>) => React.ReactElement | null;
    ItemDescription: React.ReactElement;
    ListEmptyComponent: React.ReactElement | null 

}

const RenderStockList = ({ stock, styles, renderStockItem, ItemDescription, ListEmptyComponent }: RenderStockList) => {
    const ListHeaderComponent = () => (
        <View>
            {ItemDescription}
            <View style={styles.stockSectionHeader}>
                <Icon name="assignment" size={20} color="#34495e" />
                <Text style={styles.stockSectionTitle}>Current Stock</Text>
            </View>
        </View>
    );

    return (
        <FlatList
            style={[styles.stockContainer, { flex: 1 }]}
            data={stock}
            renderItem={renderStockItem}
            keyExtractor={(item) => item.stock_id.toString()}
            ListHeaderComponent={ListHeaderComponent}
            ListEmptyComponent={ListEmptyComponent}
            showsVerticalScrollIndicator={true}
        />
    )
}

export default RenderStockList; 