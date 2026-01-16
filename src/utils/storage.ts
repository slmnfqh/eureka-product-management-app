import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_KEY = 'AUTH_DATA';

export interface StoredAuth {
  token: string;
  user: {
    id_user: number;
    nama_user: string;
    email: string;
  };
}

export const saveAuth = async (data: StoredAuth) => {
  await AsyncStorage.setItem('AUTH_DATA', JSON.stringify(data));
};

export const getAuth = async (): Promise<StoredAuth | null> => {
  const raw = await AsyncStorage.getItem(AUTH_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const clearAuth = async () => {
  await AsyncStorage.removeItem(AUTH_KEY);
};
