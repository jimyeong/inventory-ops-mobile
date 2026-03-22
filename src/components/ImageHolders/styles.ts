import { StyleSheet } from "react-native"

export const cardImageHolderStyles = StyleSheet.create({
    itemCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        paddingTop: 20,
        backgroundColor: '#4f46e5',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    imagePlaceholder: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e9ecef',
        borderStyle: 'dashed',
    },
    itemContent: {
        flexDirection: 'row',
        padding: 16,
    },

    itemImageContainer: {
        marginRight: 16,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemImage: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
        backgroundColor: '#f8f9fa',
    },
})
