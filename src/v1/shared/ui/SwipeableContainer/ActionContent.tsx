import { View, Text, StyleProp, ViewStyle, StyleSheet, Animated, TextStyle } from 'react-native';
import { interpolate, SharedValue } from 'react-native-reanimated';
import { colors, spacing } from '../../theme/token';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RectButton } from 'react-native-gesture-handler';
import { useAnimatedStyle } from 'react-native-reanimated';

interface ActionContentProps {
    progress: SharedValue<number>;
    onPress: () => void;
    actionText: string;
    iconLabel: string;
    buttonStyle?: StyleProp<ViewStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    direction?: 'left' | 'right';
    textStyle?: StyleProp<TextStyle>;
}

const ActionContent = ({ progress, onPress, actionText, iconLabel, buttonStyle, direction, containerStyle, textStyle }: ActionContentProps) => {
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{
            translateX: interpolate(progress.value, [0, 1], [-100, 0])
        }],
        opacity: progress.value
    }));
    return (
        <View>
        <Animated.View style={[styles.actionContainer, animatedStyle]}>
            <RectButton
                style={[styles.updateButton, buttonStyle]}
                onPress={onPress}
            >
                <Icon name={iconLabel} size={24} color={colors.common.white} />
                <Text style={[styles.actionText, textStyle]}>{actionText}</Text>
            </RectButton>
        </Animated.View>    
        </View>
    );
}

export default ActionContent;

const styles = StyleSheet.create({
    
    actionContainer: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginRight: 26,
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