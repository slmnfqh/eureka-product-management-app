import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StockScreen from '../screens/stocks/StockScreen';
import StockDetailScreen from '../screens/stocks/StockDetailScreen';

const Stack = createNativeStackNavigator();

export default function StockStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StockList" component={StockScreen} />
      <Stack.Screen name="StockDetail" component={StockDetailScreen} />
    </Stack.Navigator>
  );
}
