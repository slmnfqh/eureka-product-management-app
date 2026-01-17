import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductScreen from '../screens/products/ProductScreen';
import ProductDetailScreen from '../screens/products/ProductDetailScreen';

const Stack = createNativeStackNavigator();

export default function ProductStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ProductList" component={ProductScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    </Stack.Navigator>
  );
}
