import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, spacing, typography } from '../../../../shared/theme/token';

const SearchEmptyComponent = () => {
    return (
        <View style={styles.container}>
            <Icon name="search-off" size={48} color={colors.neutral[400]} />
            <Text style={styles.title}>No results found</Text>
            <Text style={styles.subtext}>Try adjusting your filters or pull to refresh</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: spacing.xxxl,
        alignItems: 'center',
    },
    title: {
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.text.primary,
        marginTop: spacing.md,
    },
    subtext: {
        fontSize: typography.fontSize.base,
        color: colors.text.secondary,
        marginTop: spacing.xs,
    },
});

export default SearchEmptyComponent;
