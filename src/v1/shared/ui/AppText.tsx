import { Text, TextProps } from 'react-native';
import React from 'react';

interface AppTextProps extends TextProps {
    fontFamily?: 'Roboto-Regular' | 'Roboto-Medium' | 'Roboto-Bold' | 'Roboto-Light' | 'Roboto-Italic' | 'Roboto-SemiBold';
}

export const AppText = ({ children, style, fontFamily = 'Roboto-Regular', ...props }: AppTextProps) => {
    return (
        <Text
            {...props}
            style={[
                { fontFamily },
                style,
            ]}
        />
    )
}