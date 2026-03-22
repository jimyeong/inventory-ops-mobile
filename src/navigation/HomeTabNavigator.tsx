import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';
// import HomeScreen from '../screens/HomeScreen';
import FillOutItemInfo from '../screens/ItemScreen/FilloutItemInfo';
import ExpiringItemsScreen from '../screens/ExpiringItemsScreen/ExpiringItemsScreen';
import HomeScreen from '../v1/pages/Home/ui/HomeScreen';
import ExpiryStockScreen from '../v1/pages/Stock/ui/ExpiryStockScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductDetailScreen from '../v1/pages/ProductDetail/ui/ProductDetailScreen';
import ProductInfoUpdateScreen from '../v1/pages/ProductDetail/ui/ProductInfoUpdateScreen';

const Tab = createBottomTabNavigator();

const HomeStack = createNativeStackNavigator();

const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ headerShown: true, title: 'Product Information' }}
      />
      <HomeStack.Screen
        name="ProductInfoUpdate"
        component={ProductInfoUpdateScreen}
        options={{ headerShown: false, title: 'Product Update' }}
      />
    </HomeStack.Navigator>
  );
};

const SignOutPlaceholder = () => null;

const HomeTabNavigator = () => {
  const { signOut } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#3498db',
        tabBarInactiveTintColor: '#7f8c8d',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#ecf0f1',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Home',
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
   
      <Tab.Screen
        name="ExpiryStockTab"
        component={ExpiryStockScreen}
        options={{
          tabBarLabel: 'Expiry Stock',
          tabBarIcon: ({ color, size }) => (
            <Icon name="event" size={size} color={color} />
          ),
          headerShown: true,
          title: 'Expiry Stock',
        }}
      />
      <Tab.Screen
        name="SignOutTab"
        component={SignOutPlaceholder}
        options={{
          tabBarLabel: 'Sign Out',
          tabBarIcon: ({ color, size }) => (
            <Icon name="logout" size={size} color={color} />
          ),
          tabBarButton: (props) => (
            <TouchableOpacity
              style={props.style}
              onPress={signOut}
              activeOpacity={0.7}
            >
              {props.children}
            </TouchableOpacity>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default HomeTabNavigator;

  //  <Tab.Screen
  //       name="FillOutItemInfoTab"
  //       component={FillOutItemInfo}
  //       options={{
  //         tabBarLabel: 'Item Info',
  //         tabBarIcon: ({ color, size }) => (
  //           <Icon name="analytics" size={size} color={color} />
  //         ),
  //         headerShown: true,
  //         title: 'Fill Out Item Info',
  //       }}
  //     />

// <Tab.Screen
// name="ExpiringItemsTab"
// component={ExpiringItemsScreen}
// options={{
//   tabBarLabel: 'Expiring',
//   tabBarIcon: ({ color, size }) => (
//     <Icon name="alarm" size={size} color={color} />
//   ),
//   headerShown: true,
//   title: 'Expiring Items',
// }}
// />
{/* <Tab.Screen
name="ExpiryStockTab"
component={ExpiryStockScreen}
options={{
  tabBarLabel: 'Expiry Stock',
  tabBarIcon: ({ color, size }) => (
    <Icon name="event" size={size} color={color} />
  ),
  headerShown: true,
  title: 'Expiry Stock' ,
}}
/> */}