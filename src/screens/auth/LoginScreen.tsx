import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Button from '../../components/Button';
import Input from '../../components/Input';

import {
  loginError as setLoginError,
  loginStart,
  loginSuccess,
  resetAuthState,
} from '../../store/authSlice';
import { loginService } from '../../services/authService';
import { RootState } from '../../store';
import { saveAuth } from '../../utils/storage';

import { COLORS } from '../../constants/colors';

export default function LoginScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const {
    loading,
    loginError: loginErrorMessage,
    isLoggedIn,
  } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    dispatch(resetAuthState());
  }, []);

  const showError = (message: string) => {
    dispatch(setLoginError(message));
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Validasi', 'Email dan password wajib diisi');
      showError('Email dan password wajib diisi');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Validasi', 'Email tidak valid');
      showError('Email tidak valid');
      return;
    }

    dispatch(loginStart());

    try {
      const result = await loginService({ email: email.trim(), password });
      await saveAuth({
        token: result.token,
        user: result.user,
      });
      dispatch(
        loginSuccess({
          token: result.token,
          user: result.user,
        }),
      );
    } catch (err: any) {
      dispatch(setLoginError(err?.response?.data?.message || 'Login gagal'));
      Alert.alert(
        'Error',
        err?.response?.data?.message || 'Terjadi kesalahan saat login',
      );
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigation.replace('MainTab');
    }
  }, [isLoggedIn, navigation]);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.headerSection}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="login" size={48} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>Selamat Datang</Text>
          <Text style={styles.subtitle}>
            Masuk ke akun Anda untuk melanjutkan
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formSection}>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="example@mail.com"
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
            icon={
              <MaterialIcons
                name="email"
                size={18}
                color={COLORS.textSecondary}
              />
            }
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry={!showPassword}
            editable={!loading}
            icon={
              <MaterialIcons
                name="lock"
                size={18}
                color={COLORS.textSecondary}
              />
            }
            rightIcon={
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialIcons
                  name={showPassword ? 'visibility' : 'visibility-off'}
                  size={18}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
            }
          />

          {loginErrorMessage && (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error" size={16} color={COLORS.danger} />
              <Text style={styles.errorMessage}>{loginErrorMessage}</Text>
            </View>
          )}

          <Button title="Masuk" onPress={handleLogin} loading={loading} />
        </View>

        {/* Footer */}
        <View style={styles.footerSection}>
          <Text style={styles.footerText}>Belum punya akun? </Text>
          <TouchableOpacity
            onPress={() => {
              console.log('Navigate to Register');
              navigation.navigate('Register');
            }}
          >
            <Text style={styles.linkText}>Daftar sekarang</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  formSection: {
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: COLORS.card,
    marginBottom: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.text,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.danger,
    gap: 8,
  },
  errorMessage: {
    flex: 1,
    fontSize: 13,
    color: COLORS.danger,
    fontWeight: '500',
  },
  footerSection: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
});
