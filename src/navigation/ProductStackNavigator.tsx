import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductScreen from '../screens/products/ProductScreen';
import ProductDetailScreen from '../screens/products/ProductDetailScreen';

const Stack = createNativeStackNavigator();

export default function ProductStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // ← TAMBAHKAN INI
      }}
    >
      <Stack.Screen
        name="ProductList"
        component={ProductScreen}
        // ← HAPUS options={{ title: 'Produk' }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        // ← HAPUS options={{ title: 'Detail Produk' }}
      />
    </Stack.Navigator>
  );
}
