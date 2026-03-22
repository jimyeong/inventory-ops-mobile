import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

interface ErrorMessageProps {
    message: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
    return (
        <SafeAreaView style={styles.container}>
          <View style={styles.errorContainer}>
            <Icon name="error-outline" size={60} color="#e74c3c" />
            <Text style={styles.errorTitle}>Error</Text>
            <Text style={styles.errorMessage}>{message}</Text>
          </View>
        </SafeAreaView>
    )
}


export default ErrorMessage;



const styles = StyleSheet.create({
    errorContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    errorTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#e74c3c',
      marginTop: 16,
      marginBottom: 8,
    },
    errorMessage: {
      fontSize: 16,
      color: '#7f8c8d',
      textAlign: 'center',
      marginBottom: 24,
    },
    retryButton: {
      backgroundColor: '#e74c3c',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      marginBottom: 16,
    },
    container: {
      flex: 1,
      backgroundColor: '#f9f9f9',
    },
    itemContainer: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 30,
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });