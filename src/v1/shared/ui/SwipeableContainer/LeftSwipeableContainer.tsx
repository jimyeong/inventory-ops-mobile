import React, {useCallback} from 'react';
import AppSwipeable, { AppSwipeableProps } from './SwipeableContainer';
import { useRef } from 'react';
import { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import { SharedValue } from 'react-native-reanimated';


interface LeftSwipeableContainerProps extends AppSwipeableProps {
    ref: React.RefObject<SwipeableMethods>;
    children: React.ReactNode;
    overshootLeft?: boolean;
    friction?: number;
    leftThreshold?: number;
    renderLeftActions: (progress: SharedValue<number>, translation: SharedValue<number>, swipeableMethods: SwipeableMethods) => React.ReactNode;
}

const LeftSwipeableContainer = ({ children, ref, renderLeftActions, overshootLeft, friction, leftThreshold }: LeftSwipeableContainerProps) => {
    return <AppSwipeable direction="left" ref={ref} renderLeftActions={renderLeftActions} overshootLeft={overshootLeft} friction={friction} leftThreshold={leftThreshold} >{children}</AppSwipeable>;
};

export default LeftSwipeableContainer;