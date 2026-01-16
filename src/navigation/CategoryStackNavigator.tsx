import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CategoryScreen from '../screens/categories/CategoryScreen';
import CategoryDetailScreen from '../screens/categories/CategoryDetailScreen';

const Stack = createNativeStackNavigator();

export default function CategoryStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CategoryList" component={CategoryScreen} />
      <Stack.Screen name="CategoryDetail" component={CategoryDetailScreen} />
    </Stack.Navigator>
  );
}
