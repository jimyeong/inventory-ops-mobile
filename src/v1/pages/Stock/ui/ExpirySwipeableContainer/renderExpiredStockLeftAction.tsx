import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, spacing, borderRadius } from '../../../../shared/theme/token';
import { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import { interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { StockWithPicture } from '../../../../features/expiry-stock/model/types';
import { DeleteStockRequestPayload } from '../../../../features/expiry-stock/api/expiryStockApi';
import { StockType } from '../../../../entities/stocks/models/types';

interface RenderExpiredStockLeftActionProps {
    productStock: StockWithPicture;
    progress: SharedValue<number>;
    translation: SharedValue<number>;
    swipeableMethods: SwipeableMethods;
    onSoldButtonPress: (params: DeleteStockRequestPayload) => void;
    onExpiredButtonPress: (params: DeleteStockRequestPayload) => void;

}

const renderExpiredStockLeftAction = ({ productStock, onSoldButtonPress, onExpiredButtonPress, progress, translation, swipeableMethods }: RenderExpiredStockLeftActionProps) => {
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{
            translateX: interpolate(progress.value, [0, 1], [-100, 0])
        }],
        opacity: progress.value
    }));
    const onHandleSoldPress = () => {
        const params: DeleteStockRequestPayload = {
            stock_id: productStock.stock_id,
            event_type: "sold",
            stock_type: productStock.stock_type.toUpperCase() as StockType,
        }
        onSoldButtonPress(params);
        swipeableMethods.close();
    }
    const onHandleExpiredPress = () => {
        const params: DeleteStockRequestPayload = {
            stock_id: productStock.stock_id,
            event_type: "expired",
            stock_type: productStock.stock_type.toUpperCase() as StockType,
        }
        onExpiredButtonPress(params);
        swipeableMethods.close();
    }
    return (
        <>
            <RectButton onPress={onHandleSoldPress}>
                <Animated.View style={[styles.button, styles.soldButton]}>
                    <Icon name="check-circle" size={22} color={colors.common.white} />
                    <Text style={styles.buttonText}>Sold</Text>
                </Animated.View>
            </RectButton>
            <RectButton onPress={onHandleExpiredPress}>
                <Animated.View style={[styles.button, styles.deleteButton]}>
                    <Icon name="delete" size={22} color={colors.common.white} />
                    <Text style={styles.buttonText}>Expired</Text>
                </Animated.View>
            </RectButton>
        </>
    );
};

export default renderExpiredStockLeftAction;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'stretch',
        gap: spacing.xs,
        marginRight: spacing.sm,
    },
    button: {
        width: 72,
        height: '99%',
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    soldButton: {
        backgroundColor: colors.info.main,
        borderTopLeftRadius: borderRadius.lg,
        borderBottomLeftRadius: borderRadius.lg,
    },
    deleteButton: {
        backgroundColor: colors.error.main,
        borderTopRightRadius: borderRadius.lg,
        borderBottomRightRadius: borderRadius.lg,
    },
    buttonText: {
        fontSize: 11,
        fontWeight: '600',
        color: colors.common.white,
    },
});
