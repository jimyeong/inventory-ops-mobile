import React from 'react';
import { View, FlatList, RefreshControl, ViewStyle } from 'react-native';
import SearchProductCard from './SearchProductCard';
import SearchEmptyComponent from './SearchEmptyComponent';
import { SearchResultProduct } from '../model/type';
import { Product } from '../../../../entities/products/models/types';

interface SearchResultViewProps {
    searchedList: SearchResultProduct[];
    onClickProduct: (product: Product) => void;
    style: ViewStyle;
    refreshing?: boolean;
    onRefresh?: () => void;
}

const SearchResultView = ({ searchedList, onClickProduct, style, refreshing, onRefresh }: SearchResultViewProps) => {
    return (
        <View style={style}>
            <FlatList
                data={searchedList}
                renderItem={({ item }) => <SearchProductCard product={item.product} onClick={onClickProduct} />}
                keyExtractor={(item, index) => `${item.product.product_id}-${index}`}
                refreshControl={
                    onRefresh ? (
                        <RefreshControl refreshing={refreshing ?? false} onRefresh={onRefresh} />
                    ) : undefined
                }
                ListEmptyComponent={<SearchEmptyComponent />}
            />
        </View>
    );
};

export default SearchResultView;
