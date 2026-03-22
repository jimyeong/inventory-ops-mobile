import React, { useCallback } from 'react';
import Animated, { interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { Text, TouchableOpacity, StyleSheet, GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';
import { colors, spacing } from '../../../shared/theme/token';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Swipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import { RectButton } from 'react-native-gesture-handler';


interface LeftActionContentProps {
    progress: SharedValue<number>;
    onPress: () => void;
    actionText: string;
    iconLabel: string;
    buttonStyle?: StyleProp<ViewStyle>;
    
}



export const LeftActionContent = ({ progress, onPress, actionText, iconLabel, buttonStyle }: LeftActionContentProps) => {
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{
            translateX: interpolate(progress.value, [0, 1], [-100, 0])
        }],
        opacity: progress.value
    }));
    return (
        <Animated.View style={[styles.actionContainer, animatedStyle]}>
            <RectButton
                style={[styles.updateButton, buttonStyle]}
                onPress={onPress}
            >
                <Icon name={iconLabel} size={24} color={colors.common.white} />
                <Text style={styles.actionText}>{actionText}</Text>
            </RectButton>
        </Animated.View>
    );
}
export interface AppSwipeableProps {
    ref: React.RefObject<SwipeableMethods>;
    direction?: 'left' | 'right';
    overshootLeft?: boolean;
    overshootRight?: boolean;
    friction?: number;
    leftThreshold?: number;
    rightThreshold?: number;
    children: React.ReactNode;
    renderLeftActions?: (progress: SharedValue<number>, translation: SharedValue<number>, swipeableMethods: SwipeableMethods) => React.ReactNode;
    renderRightActions?: (progress: SharedValue<number>, translation: SharedValue<number>, swipeableMethods: SwipeableMethods) => React.ReactNode;
}
const AppSwipeable = ({ref, direction = 'left', renderLeftActions, renderRightActions, overshootLeft, overshootRight, friction, leftThreshold, rightThreshold, children }: AppSwipeableProps)=>{
    return (
        <Swipeable
            ref={ref}
            renderLeftActions={direction === 'left' ? renderLeftActions : undefined}
            renderRightActions={direction === 'right' ? renderRightActions : undefined}
            overshootLeft={direction === 'left' ? overshootLeft : false}
            overshootRight={direction === 'right' ? overshootRight : false}
            friction={friction}
            leftThreshold={direction === 'left' ? leftThreshold : undefined}
            rightThreshold={direction === 'right' ? rightThreshold : undefined}
        >
            {children}
        </Swipeable>
    );
}

export default AppSwipeable;


const styles = StyleSheet.create({
    actionContainer: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginTop: 16,
    },
    updateButton: {
        backgroundColor: colors.primary.main,
        justifyContent: 'center',
        alignItems: 'center',
        width: 100, 
        height: '100%',
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
        marginLeft: 16,
        paddingHorizontal: spacing.base,
        gap: 4,
    },
    actionText: {
        color: colors.common.white,
        fontSize: 12,
        fontWeight: '600',
        marginTop: 2,
    },
});