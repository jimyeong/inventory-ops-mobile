import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Button, 
  TextInput, 
  ActivityIndicator,
  Alert,
  FlatList 
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { InventoryStyle } from '../styles/InventoryStyles';
// Your Firebase Functions endpoints
const API_URL = 'https://your-firebase-region-your-project-id.cloudfunctions.net';

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID_HERE', // Get this from your Firebase project
});

// Item type definition
type Item = {
  ID?: number;
  code: string;
  barcode: string;
  name: string;
  type: string;
  available_for_order: number;
  image_path: string;
  created_at?: string;
  updated_at?: string;
};

const InventoryScreen = () => {
  const {userData: user, signOut} = useAuth();
  // Auth state
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Items state
  const [items, setItems] = useState<Item[]>([]);
  
  // New item form state
  const [newItem, setNewItem] = useState<Item>({
    code: '',
    barcode: '',
    name: '',
    type: '',
    available_for_order: 1,
    image_path: '',
  });
  const [showItemForm, setShowItemForm] = useState(false);

  // Handle user state changes
  // Load items from API
  const loadItems = async () => {
    try {
      setLoading(true);
      
      // This endpoint doesn't require authentication
      const response = await axios.get(`${API_URL}/getItems`);
      
      if (response.data.success) {
        setItems(response.data.data);
      } else {
        Alert.alert('Error', response.data.message || 'Failed to load items');
      }
    } catch (error: any) {
      console.error('Error loading items:', error);
      Alert.alert('Error', 'Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  // Register a new item
  const registerItem = async () => {
    // Validate required fields
    if (!newItem.code || !newItem.name || !newItem.type) {
      Alert.alert('Error', 'Code, name, and type are required fields');
      return;
    }
    
    try {
      setLoading(true);
      
      // Get the current user's ID token for authentication
      const idToken = await auth().currentUser?.getIdToken();
      
      if (!idToken) {
        Alert.alert('Error', 'You must be signed in to register items');
        return;
      }
      
      // Send request with auth token
      const response = await axios.post(
        `${API_URL}/registerItem`, 
        newItem,
        {
          headers: {
            Authorization: `Bearer ${idToken}`
          }
        }
      );
      
      if (response.data.success) {
        Alert.alert('Success', 'Item registered successfully!');
        // Reset form and refresh items
        setNewItem({
          code: '',
          barcode: '',
          name: '',
          type: '',
          available_for_order: 1,
          image_path: '',
        });
        setShowItemForm(false);
        loadItems();
      } else {
        Alert.alert('Error', response.data.message || 'Failed to register item');
      }
    } catch (error: any) {
      console.error('Error registering item:', error);
      
      // Special handling for auth errors
      if (error.response && error.response.status === 401) {
        Alert.alert('Authentication Error', 'Please sign in again');
        // You might want to re-authenticate the user here
      } else {
        Alert.alert('Error', 'Failed to register item');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (field: keyof Item, value: any) => {
    setNewItem(prev => ({ ...prev, [field]: value }));
  };

  // Loading state
  if (initializing) {
    return (
      <View style={InventoryStyle.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Render item in the list
  const renderItem = ({ item }: { item: Item }) => (
    <View style={InventoryStyle.itemContainer}>
      <Text style={InventoryStyle.itemName}>{item.name}</Text>
      <Text>Code: {item.code}</Text>
      <Text>Type: {item.type}</Text>
      <Text>Barcode: {item.barcode || 'N/A'}</Text>
    </View>
  );

  // Item registration form
  const renderItemForm = () => (
    <View style={InventoryStyle.formContainer}>
      <Text style={InventoryStyle.sectionTitle}>Register New Item</Text>
      
      <TextInput
        style={InventoryStyle.input}
        placeholder="Code *"
        value={newItem.code}
        onChangeText={(text) => handleInputChange('code', text)}
      />
      
      <TextInput
        style={InventoryStyle.input}
        placeholder="Name *"
        value={newItem.name}
        onChangeText={(text) => handleInputChange('name', text)}
      />
      
      <TextInput
        style={InventoryStyle.input}
        placeholder="Type *"
        value={newItem.type}
        onChangeText={(text) => handleInputChange('type', text)}
      />
      
      <TextInput
        style={InventoryStyle.input}
        placeholder="Barcode"
        value={newItem.barcode}
        onChangeText={(text) => handleInputChange('barcode', text)}
      />
      
      <TextInput
        style={InventoryStyle.input}
        placeholder="Available for Order (0 or 1)"
        value={newItem.available_for_order.toString()}
        onChangeText={(text) => handleInputChange('available_for_order', parseInt(text) || 0)}
        keyboardType="numeric"
      />
      
      <TextInput
        style={InventoryStyle.input}
        placeholder="Image Path"
        value={newItem.image_path}
        onChangeText={(text) => handleInputChange('image_path', text)}
      />
      
      <View style={InventoryStyle.buttonContainer}>
        <Button 
          title="Register" 
          onPress={registerItem} 
          disabled={loading}
        />
        <Button 
          title="Cancel" 
          onPress={() => setShowItemForm(false)} 
          color="red"
        />
      </View>
    </View>
  );

  return (
    <View style={InventoryStyle.container}>  
        <View style={InventoryStyle.mainContainer}>
          <View style={InventoryStyle.header}>
            <Text style={InventoryStyle.title}>Item Registration</Text>
            <Text style={InventoryStyle.subtitle}>Logged in as: {user?.email}</Text>
            <Button title="Sign Out" onPress={signOut} disabled={loading} />
          </View>
          
          {showItemForm ? (
            // Show item registration form
            renderItemForm()
          ) : (
            // Show items list
            <View style={InventoryStyle.listContainer}>
              <View style={InventoryStyle.listHeader}>
                <Text style={InventoryStyle.sectionTitle}>Items</Text>
                <Button 
                  title="+ Add Item" 
                  onPress={() => setShowItemForm(true)}
                />
              </View>
              
              {loading ? (
                <ActivityIndicator style={InventoryStyle.loader} />
              ) : (
                <FlatList
                  data={items}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.ID?.toString() || Math.random().toString()}
                  ListEmptyComponent={<Text style={InventoryStyle.emptyText}>No items found</Text>}
                  onRefresh={loadItems}
                  refreshing={loading}
                />
              )}
            </View>
          )}
        </View>
    </View>
  );
};


export default InventoryScreen;