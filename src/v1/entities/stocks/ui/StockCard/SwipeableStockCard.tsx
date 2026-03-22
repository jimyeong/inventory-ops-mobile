import React, { useCallback, useRef } from 'react';
import { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import type { SharedValue } from 'react-native-reanimated';
import { ProductStock } from '../../models/types';
import StockCard from './StockCard';
import { LeftActionContent } from '../../../../shared/ui/SwipeableContainer/SwipeableContainer';
import LeftSwipeableContainer from '../../../../shared/ui/SwipeableContainer/LeftSwipeableContainer';
import { colors } from '../../../../shared/theme/token';
import { styles } from '../../../../../screens/StockInScreen/ui/styles';
import EditableStockCard from './EditableStockCard';

interface SwipeableStockCardProps {
    stock: ProductStock;
    index: number;
    isEditing: boolean;
    onUpdate?: (stock: ProductStock) => void;
    onCancel?: (stock_id: number) => void;
    onHandleStockUpdate?: (stock: ProductStock) => void;
    onDelete?: (stockId: number) => void;
}

const SwipeableStockCard = ({ stock, index, isEditing, onUpdate, onCancel, onHandleStockUpdate, onDelete }: SwipeableStockCardProps) => {
    const swipeableRef = useRef<SwipeableMethods>(null);

    const onPressUpdate = useCallback(() => {
        swipeableRef.current?.close();
        if (onUpdate) {
            onUpdate(stock);
        }
    }, [onUpdate, stock, swipeableRef]);
    
    const handleInit = useCallback((stock_id: number) => {
        //close
        if (onCancel) {
            onCancel(stock_id);
        }
    }, [onCancel, stock.stock_id]);


    const handleCancel = useCallback((stock_id: number) => {
        swipeableRef.current?.close();
        if (onCancel) {
            onCancel(stock_id);
        }
    }, [onCancel]);

    const renderLeftActions = useCallback(
        (
            progress: SharedValue<number>,
            _translation: SharedValue<number>,
            _swipeableMethods: SwipeableMethods
        ) => {

            if (isEditing) {
                return (
                    <LeftActionContent progress={progress} onPress={() => handleCancel(stock.stock_id)} actionText="Cancel" iconLabel="close" buttonStyle={colors.cancel} />
                )
            } else {
                return (
                    <LeftActionContent progress={progress} onPress={onPressUpdate} actionText="Update" iconLabel="edit" buttonStyle={colors.edit} />
                )
            }

        },
        [stock.stock_id, isEditing]
    );

    return (
        <LeftSwipeableContainer
            ref={swipeableRef as React.RefObject<SwipeableMethods>}
            renderLeftActions={renderLeftActions}
            overshootLeft={false}
            friction={2}
            leftThreshold={40}
        >
            {isEditing ? (
                <EditableStockCard stock={stock}
                    index={index}
                    isEditing={true}
                    onHandleStockUpdate={onHandleStockUpdate}
                    onInit={handleInit} />
                    
            ) : (
                <StockCard stock={stock} index={index} onDelete={onDelete} />
            )}
        </LeftSwipeableContainer>
    );
};

export default SwipeableStockCard;
