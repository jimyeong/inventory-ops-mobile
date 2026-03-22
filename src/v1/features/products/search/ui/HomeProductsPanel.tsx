import React from 'react';
import { View, Text, ViewStyle, ScrollView, RefreshControl } from 'react-native';
import SearchResultView from './SearchResultView';
import HomeProductsView from './HomeProductsView';
import { SearchResultItem } from '../model/type';
import ExpiredProductsWidget from "../../../../widgets/expiryProducts/ui/ExpiredProductsWidget";
import UrgentProductsWidget from "../../../../widgets/expiryProducts/ui/UrgentProductsWidget";
import { Product } from '../../../../entities/products/models/types';

interface HomeProductsPanelProps {
    isSearching: boolean;
    searchedList: SearchResultItem[];
    style: ViewStyle;
    refreshing?: boolean;
    onRefresh?: () => void;
    refreshTrigger?: number;
    onClickProduct: (product: Product) => void;
}
const HomeProductsPanel = ({
    isSearching,
    searchedList,
    style,
    refreshing,
    onRefresh,
    refreshTrigger,
    onClickProduct,
}: HomeProductsPanelProps) => {
    
    return (
        <>
            {isSearching && (
                <SearchResultView
                    style={style}
                    searchedList={searchedList}
                    onClickProduct={onClickProduct}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            )}
            {!isSearching && (
                <ScrollView
                    style={style}
                    refreshControl={
                        onRefresh ? (
                            <RefreshControl refreshing={refreshing ?? false} onRefresh={onRefresh} />
                        ) : undefined
                    }
                    showsVerticalScrollIndicator={false}
                >
                    <HomeProductsView>
                        <View style={{ marginBottom: 16 }}>
                            <ExpiredProductsWidget refreshTrigger={refreshTrigger} />
                        </View>
                        <View>
                            <UrgentProductsWidget refreshTrigger={refreshTrigger} />
                        </View>
                    </HomeProductsView>
                </ScrollView>
            )}
        </>
    );
};

export default HomeProductsPanel;