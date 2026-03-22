import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    tagFilterContent: {
        marginTop: 12,
      },
      sectionHeaderLeft:{

      },
      sectionTitle:{

      },

    toggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      },
      toggleButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
      },

    toggleButtonText: {
        fontSize: 15,
        color: '#374151',
        fontWeight: '600',
        marginLeft: 10,
      },
});