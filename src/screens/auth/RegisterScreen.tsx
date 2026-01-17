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
  registerStart,
  registerSuccess,
  resetAuthState,
  registerError as setRegisterError,
} from '../../store/authSlice';
import { registerService } from '../../services/authService';
import { RootState } from '../../store';

import { COLORS } from '../../constants/colors';

export default function RegisterScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const { loading, registerError, isLoggedIn } = useSelector(
    (state: RootState) => state.auth,
  );

  // ✅ Semua hooks HARUS dipanggil unconditionally
  const [namaUser, setNamaUser] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    dispatch(resetAuthState());
  }, []);

  const showError = (message: string) => {
    dispatch(setRegisterError(message));
  };

  // ✅ useEffect HARUS ada sebelum conditional logic
  useEffect(() => {
    if (isLoggedIn) {
      navigation.replace('MainTab');
    }
  }, [isLoggedIn, navigation]);

  const handleRegister = async () => {
    if (
      !namaUser.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      Alert.alert('Validasi', 'Semua field wajib diisi');
      showError('Semua field wajib diisi');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Validasi', 'Email tidak valid');
      showError('Email tidak valid');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Validasi', 'Password minimal 8 karakter');
      showError('Password minimal 8 karakter');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Validasi', 'Password dan konfirmasi tidak sama');
      showError('Password dan konfirmasi tidak sama');
      return;
    }

    // ✅ DISPATCH registerStart
    dispatch(registerStart());

    try {
      await registerService({
        nama_user: namaUser.trim(),
        email: email.trim(),
        password,
      });

      // ✅ DISPATCH registerSuccess
      dispatch(registerSuccess());

      Alert.alert('Sukses', 'Akun berhasil dibuat, silakan login');
      navigation.replace('Login');
    } catch (err: any) {
      dispatch(
        setRegisterError(err?.response?.data?.message || 'Registrasi gagal'),
      );
      Alert.alert(
        'Error',
        err?.response?.data?.message || 'Terjadi kesalahan saat registrasi',
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.headerSection}>
          <View style={styles.iconCircle}>
            <MaterialIcons
              name="person-add"
              size={48}
              color={COLORS.secondary}
            />
          </View>
          <Text style={styles.title}>Buat Akun</Text>
          <Text style={styles.subtitle}>Daftar untuk memulai</Text>
        </View>

        {/* Form */}
        <View style={styles.formSection}>
          {/* Nama */}
          <Input
            label="Nama Lengkap"
            value={namaUser}
            onChangeText={setNamaUser}
            placeholder="Nama lengkap Anda"
            editable={!loading}
            icon={
              <MaterialIcons
                name="person"
                size={18}
                color={COLORS.textSecondary}
              />
            }
          />

          {/* Email */}
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
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

          {/* Password */}
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Minimal 8 karakter"
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

          {/* Confirm Password */}
          <Input
            label="Konfirmasi Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Ulangi password"
            secureTextEntry={!showConfirmPassword}
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
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialIcons
                  name={showConfirmPassword ? 'visibility' : 'visibility-off'}
                  size={18}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
            }
          />

          {/* Error Message */}
          {registerError && (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error" size={16} color={COLORS.danger} />
              <Text style={styles.errorMessage}>{registerError}</Text>
            </View>
          )}

          <Button title="Daftar" onPress={handleRegister} loading={loading} />
        </View>

        {/* Footer */}
        <View style={styles.footerSection}>
          <Text style={styles.footerText}>Sudah punya akun? </Text>
          <TouchableOpacity
            onPress={() => {
              console.log('Navigate to Login');
              navigation.navigate('Login');
            }}
          >
            <Text style={styles.linkText}>Masuk di sini</Text>
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
    backgroundColor: '#DCFCE7',
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
