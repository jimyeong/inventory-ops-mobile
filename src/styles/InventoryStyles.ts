import { StyleSheet } from 'react-native';
export const InventoryStyle = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    authContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    mainContainer: {
      flex: 1,
      padding: 20,
    },
    header: {
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      marginBottom: 15,
      color: '#666',
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 15,
    },
    listContainer: {
      flex: 1,
    },
    listHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
    },
    itemContainer: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    itemName: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    formContainer: {
      flex: 1,
    },
    input: {
      height: 50,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      marginBottom: 15,
      paddingHorizontal: 10,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 20,
    },
    loader: {
      marginTop: 20,
    },
    emptyText: {
      textAlign: 'center',
      marginTop: 30,
      color: '#888',
    },
  });