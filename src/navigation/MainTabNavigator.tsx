import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import ProductStackNavigator from './ProductStackNavigator';
import CategoryScreen from '../screens/categories/CategoryScreen';
import StockScreen from '../screens/stocks/StockScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import CategoryStackNavigator from './CategoryStackNavigator';
import StockStackNavigator from './StockStackNavigator';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'cube';

          // ✅ Mapping icon names dengan benar
          if (route.name === 'Products') {
            iconName = focused ? 'shopping-bag' : 'shopping-bag';
          } else if (route.name === 'Categories') {
            iconName = focused ? 'folder' : 'folder-open';
          } else if (route.name === 'Stok') {
            iconName = focused ? 'inventory' : 'inventory-2';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: 64, // ⬅️ default dinaikkan
          paddingBottom: 10, // ⬅️ ini yang bikin tab naik
          paddingTop: 6,
        },
      })}
    >
      <Tab.Screen
        name="Products"
        component={ProductStackNavigator}
        options={{ title: 'Produk' }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoryStackNavigator}
        options={{ title: 'Kategori' }}
      />
      <Tab.Screen
        name="Stok"
        component={StockStackNavigator}
        options={{ title: 'Stok' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profil' }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
