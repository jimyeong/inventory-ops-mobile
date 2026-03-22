import React from 'react';
import { ScrollView, ScrollViewProps, StyleProp, ViewStyle } from 'react-native';

interface HorizontalScrollContainerProps extends Omit<ScrollViewProps, 'horizontal' | 'style' | 'contentContainerStyle'> {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    contentContainerStyle?: StyleProp<ViewStyle>;
}

const HorizontalScrollContainer = ({
    children,
    style,
    contentContainerStyle,
    showsHorizontalScrollIndicator = false,
    ...rest
}: HorizontalScrollContainerProps) => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
            style={style}
            contentContainerStyle={contentContainerStyle}
            {...rest}
        >
            {children}
        </ScrollView>
    );
};

export default HorizontalScrollContainer;
