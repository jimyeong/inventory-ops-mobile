import React, { useRef } from 'react';
import { View, StyleSheet, FlatList, ScrollView, RefreshControl } from 'react-native';
import { Product } from '../../../../entities/products/models/types';
import ProductLoadingIndicator from '../../../../entities/products/ui/Loading/ProductLoadingIndicator';
import { NoStockAvailable } from '../../../../entities/stocks/ui/NoStockAvailable';
import ExpiryStockCard from '../Cards/ExpiryStockCard';
import { ProductErrorOccur } from '../../../../entities/products/ui/Messages/ProductErrorOccur';
import ExpiringProductCard from '../ExpiringProductCard';
import { StockWithPicture } from '../../../../features/expiry-stock/model/types';
import AlreadyExpiredStockCard from '../Cards/AlreadyExpiredStockCard';
import { IndicatingButton } from '../../../../shared/ui/Buttons';
import ActionContent from '../../../../shared/ui/SwipeableContainer/ActionContent';
import { SharedValue } from 'react-native-reanimated';
import { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import LeftSwipeableContainer from '../../../../shared/ui/SwipeableContainer/LeftSwipeableContainer';
import { layout } from '../../../../shared/theme/token';
import renderExpiredStockLeftAction from '../ExpirySwipeableContainer/renderExpiredStockLeftAction';
import { DeleteStockRequestPayload } from '../../../../features/expiry-stock/api/expiryStockApi';

const renderLeftActions = (progress: SharedValue<number>, translation: SharedValue<number>, swipeableMethods: SwipeableMethods) => {
    return <ActionContent progress={progress} onPress={() => { }} actionText="Delete" iconLabel="delete" buttonStyle={styles.button} />;
}
const renderRightActions = (progress: SharedValue<number>, translation: SharedValue<number>, swipeableMethods: SwipeableMethods) => {
    return <ActionContent progress={progress} onPress={() => { }} actionText="Sold" iconLabel="check-circle" buttonStyle={styles.button} />;
}
interface ExpiryDisplayPanelProps {
    selectedChipId: string;
    expiredProducts: StockWithPicture[];
    expiryRangeList: StockWithPicture[];
    expiredProductLoading: boolean;
    expiredProductError: string | null;
    expiredProductTotal: number;
    expiryStockByRangeLoading: boolean;
    expiryStockByRangeError: string | null;
    expiryStockByRangeTotal: number;
    onRefresh?: () => void | Promise<void>;
    refreshing?: boolean;
    onSoldButtonPress: (params: DeleteStockRequestPayload) => void;
    onExpiredButtonPress: (params: DeleteStockRequestPayload) => void;
    onCardPressHandler: (stock: StockWithPicture) => void;
}

const refreshControl = (onRefresh?: () => void | Promise<void>, refreshing?: boolean) =>
    onRefresh ? (
        <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} />
    ) : undefined;

export default function ExpiryDisplayPanel({
    selectedChipId,
    expiredProducts,
    expiryRangeList,
    expiredProductLoading,
    expiredProductError,
    expiredProductTotal,
    expiryStockByRangeLoading,
    expiryStockByRangeError,
    expiryStockByRangeTotal,
    onRefresh,
    refreshing = false,
    onSoldButtonPress,
    onExpiredButtonPress,
    onCardPressHandler,
}: ExpiryDisplayPanelProps) {
    const rc = refreshControl(onRefresh, refreshing);
    const swipeableRef = useRef<SwipeableMethods>(null);
    if (selectedChipId === "-1") {
        if (expiredProductLoading && expiredProducts.length === 0) {
            return (
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    refreshControl={rc}
                >
                    <ProductLoadingIndicator message="Loading expired products..." />
                </ScrollView>
            );
        }
        if (expiredProductError && expiredProducts.length === 0) {
            return (
                <ScrollView contentContainerStyle={styles.scrollContent} refreshControl={rc}>
                    <ProductErrorOccur message={expiredProductError} />
                </ScrollView>
            );
        }
        if (expiredProductTotal === 0 && expiredProducts.length === 0) {
            return (
                <ScrollView contentContainerStyle={styles.scrollContent} refreshControl={rc}>
                    <NoStockAvailable />
                </ScrollView>
            );
        }
        return (
            <View>
                <FlatList
                    contentContainerStyle={styles.swipeableWrapper}
                    showsVerticalScrollIndicator={false}
                    data={expiredProducts}
                    keyExtractor={(item) => item.stock_id.toString()}
                    renderItem={({ item }: { item: StockWithPicture }) => (
                        <View style={styles.swipeableContainer}>
                            <LeftSwipeableContainer
                                ref={swipeableRef as React.RefObject<SwipeableMethods>}
                                renderLeftActions={
                                    (progress, translation, swipeableMethods) => 
                                        renderExpiredStockLeftAction({
                                            productStock: item,
                                            onSoldButtonPress: onSoldButtonPress,
                                            onExpiredButtonPress: onExpiredButtonPress,
                                            progress,
                                            translation,
                                            swipeableMethods
                                        })}

                                friction={2}
                                leftThreshold={20}
                            >
                                <AlreadyExpiredStockCard currentStock={item} />
                            </LeftSwipeableContainer>
                        </View>
                    )}
                    refreshControl={rc}
                />
            </View>
        );
    }
    if (expiryStockByRangeLoading && expiryRangeList.length === 0) {
        return (
            <ScrollView contentContainerStyle={styles.scrollContent} refreshControl={rc}>
                <ProductLoadingIndicator message="Loading expired products..." />
            </ScrollView>
        );
    }
    if (expiryStockByRangeError && expiryRangeList.length === 0) {
        return (
            <ScrollView contentContainerStyle={styles.scrollContent} refreshControl={rc}>
                <ProductErrorOccur message={expiryStockByRangeError} />
            </ScrollView>
        );
    }
    if (expiryStockByRangeTotal === 0 && expiryRangeList.length === 0) {
        return (
            <ScrollView contentContainerStyle={styles.scrollContent} refreshControl={rc}>
                <NoStockAvailable />
            </ScrollView>
        );
    }
    return (
        <FlatList
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            data={expiryRangeList}
            keyExtractor={(item) => item.stock_id.toString()}
            renderItem={({ item }: { item: StockWithPicture }) => <ExpiringProductCard onPressCardHandler={onCardPressHandler} currentStock={item} />}
            refreshControl={rc}
        />
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    listContainer: {
        padding: 16,
    },
    scrollContent: {
        flexGrow: 1,
    },
    button: {
        width: '100%',
        height: '100%',
        backgroundColor: '#e74c3c',
    },
    swipeableWrapper:{
        paddingBottom: 120,
    },
    swipeableContainer: {
        paddingHorizontal: layout.screenHorizontalPadding,
        marginBottom: 10,
        
    },
});