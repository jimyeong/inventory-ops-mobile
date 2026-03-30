import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import LoadingIndicator from '../components/LoadingIndicator';
import ScannerScreen from '../screens/ScannerScreen/ScannerScreen';
import AddItemScreen from '../screens/AddItemScreen/AddItemScreen';
import { ROOT_PARAM_LIST } from '../models/navigation';
import { navigationRef } from './RootNavigation';
// import StockInScreen from '../screens/StockInScreen/StockInScreen';
import StockInScreen from '../v1/pages/Stock/ui/StockInScreen';
import ItemStockDetailScreen from '../screens/ItemStockDetailScreen/ItemStockDetailScreen';
import ItemDetailEditScreen from '../screens/ItemDetailEditScreen';
import FillOutItemInfo from '../screens/ItemScreen/FilloutItemInfo';
import ExpiringItemsScreen from '../screens/ExpiringItemsScreen/ExpiringItemsScreen';
import HomeTabNavigator from './HomeTabNavigator';
import ProductDetailScreen from '../v1/pages/ProductDetail/ui/ProductDetailScreen';
import SplashScreen from '../v1/pages/Splash/ui/SplashScreen';
import ExpiryStockScreen from '../v1/pages/Stock/ui/ExpiryStockScreen';
import AuthService from '../services/AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import ProductInfoUpdateScreen from '../v1/pages/ProductDetail/ui/ProductInfoUpdateScreen';
const Stack = createNativeStackNavigator<ROOT_PARAM_LIST>();
SplashScreen
const AuthenticatedStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Scanner"
        component={ScannerScreen}
        options={{ title: 'Scan Barcode' }}
      />
      <Stack.Screen
        name="AddItem"
        component={AddItemScreen}
        options={{ title: 'Register New Item' }}
      />
      {/* <Stack.Screen
        name="MissingInfo"
        component={MissingInfoScreen}
        options={{ title: 'Missing Information' }}
      /> */}
      {/* <Stack.Screen
        name="EditItem"
        component={EditItemScreen}
        options={{ title: 'Edit Item' }}
      /> */}

      {/* <Stack.Screen
        name="StockIn"
        component={StockInScreen}
        options={{ title: 'Stock In Page' }}
      /> */}
      {/* <Stack.Screen
        name="BarcodeMining"
        component={BarcodeMiningScreen}
        options={{ title: 'Barcode Mining' }}
      /> */}
      {/* <Stack.Screen
        name="ScannedItemDetail"
        component={ItemStockDetailScreen}
        options={{ title: 'Stock Management' }}
      /> */}
      {/* <Stack.Screen
        name="ItemDetailEdit"
        component={ItemDetailEditScreen}
        options={{ title: 'Product Information' }}
      /> */}
      {/* <Stack.Screen
        name="FillOutItemInfo"
        component={FillOutItemInfo}
        options={{ title: 'Fill Out Item Info' }}
      /> */}
      <Stack.Screen
        name="ExpiringItems"
        component={ExpiringItemsScreen}
        options={{ title: 'Expiring Items' }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ headerShown: false, }}
      />
      <Stack.Screen
        name="StockIn"
        component={StockInScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ExpiryStock"
        component={ExpiryStockScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductInfoUpdate"
        component={ProductInfoUpdateScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  const { userData: user, loading } = useAuth();
  const [bootstrapping, setBootstrapping] = useState(true);
  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      try {
        console.log('APP START');
        console.log('firebase currentUser on boot:', auth().currentUser?.uid);
        console.log('stored refresh token on boot:', await AuthService.getRefreshToken());
        console.log('stored expiry on boot:', await AsyncStorage.getItem('@auth/token_expiry'));

        await AuthService.bootstrapAuth();
      } catch (error) {
        console.error('App bootstrap failed:', error);
      } finally {
        if (mounted) {
          setBootstrapping(false);
        }
      }
    };

    bootstrap();

    return () => {
      mounted = false;
    };
  }, []);
  if (loading || bootstrapping) {
    return <LoadingIndicator message="Starting app..." />;
  }
  return (
    <NavigationContainer ref={navigationRef}>
      {user || auth().currentUser ? <AuthenticatedStack /> : <LoginScreen />}
    </NavigationContainer>
  );
};

export default AppNavigator;