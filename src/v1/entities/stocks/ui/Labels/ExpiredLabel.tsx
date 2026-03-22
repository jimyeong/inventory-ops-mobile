import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface ExpiredLabelProps {
    expiredBadgeStyle?: any;
    expiredTextStyle?: any;
    expiredIcon: string;
    expiredText: string;
}
const ExpiredLabel = ({ expiredBadgeStyle, expiredIcon, expiredText, expiredTextStyle }: ExpiredLabelProps) => {
    return (
        <>  
            {/* Expired Badge */}
            <View style={[styles.expiredBadge, expiredBadgeStyle]}>
                <Icon name={expiredIcon} size={14} color="#ffffff" />
                <Text style={[styles.expiredText, expiredTextStyle]}>{expiredText}</Text>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    expiredBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    expiredText: {
        fontSize: 10,
        fontWeight: '600',
    },
});
export default ExpiredLabel;