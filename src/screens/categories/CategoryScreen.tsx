import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Button from '../../components/Button';

import {
  fetchCategoryStart,
  fetchCategorySuccess,
  fetchCategoryError,
} from '../../store/categorySlice';

import { RootState } from '../../store';
import {
  createKategori,
  deleteKategori,
  getKategori,
  updateKategori,
} from '../../services/categoryService';
import FloatingButtonAdd from '../../components/FloatingButtonAdd';
import Input from '../../components/Input';

import { COLORS } from '../../constants/colors';

export default function CategoryScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector(
    (state: RootState) => state.categories,
  );

  const [namaKategori, setNamaKategori] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');

  const loadKategori = async () => {
    dispatch(fetchCategoryStart());
    try {
      const data = await getKategori();
      dispatch(fetchCategorySuccess(data));
    } catch (err: any) {
      dispatch(fetchCategoryError(err?.response?.data?.message));
    }
  };

  const resetForm = () => {
    setNamaKategori('');
    setEditingId(null);
    setFormMode('add');
    setSubmitting(false);
  };

  const handleSubmit = async () => {
    if (!namaKategori.trim()) {
      Alert.alert('Validasi', 'Nama kategori wajib diisi');
      return;
    }

    setSubmitting(true);

    try {
      if (formMode === 'edit' && editingId !== null) {
        await updateKategori(editingId, {
          nama_kategori: namaKategori.trim(),
        });
        Alert.alert('Sukses', 'Kategori berhasil diperbarui');
      } else {
        await createKategori({
          nama_kategori: namaKategori.trim(),
        });
        Alert.alert('Sukses', 'Kategori berhasil ditambahkan');
      }

      resetForm();
      setShowModal(false);
      loadKategori();
    } catch (err: any) {
      Alert.alert(
        'Error',
        err?.response?.data?.message || 'Gagal menyimpan kategori',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item: any) => {
    setFormMode('edit');
    setNamaKategori(item.nama_kategori);
    setEditingId(item.id_kategori);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    Alert.alert('Hapus Kategori', 'Yakin ingin menghapus kategori ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteKategori(id);
            Alert.alert('Sukses', 'Kategori berhasil dihapus');
            loadKategori();
          } catch (err: any) {
            const rawMessage = err?.response?.data?.message || '';
            console.log('Raw Error:', rawMessage);

            // Logika untuk menangkap error Foreign Key
            let userFriendlyMessage =
              'Gagal menghapus kategori. Silakan coba lagi.';

            if (rawMessage.includes('foreign key constraint fails')) {
              userFriendlyMessage =
                'Kategori tidak bisa dihapus karena masih ada produk yang menggunakan kategori ini. Hapus atau pindahkan produknya terlebih dahulu.';
            } else if (rawMessage) {
              userFriendlyMessage = rawMessage;
            }

            Alert.alert('Perhatian', userFriendlyMessage);
          }
        },
      },
    ]);
  };

  useEffect(() => {
    loadKategori();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kategori</Text>
        {/* <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity> */}
      </View>

      {/* Error Message */}
      {error && (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle" size={18} color={COLORS.danger} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Category List */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item, index) => {
            if (item && item.id_kategori) {
              return item.id_kategori.toString();
            }
            return `category-${index}`;
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate('CategoryDetail', { category: item })
              }
            >
              <View style={styles.cardContent}>
                <View style={styles.iconWrapper}>
                  <Ionicons name="folder" size={24} color={COLORS.primary} />
                </View>
                <Text style={styles.categoryName} numberOfLines={2}>
                  {item.nama_kategori}
                </Text>
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => handleEdit(item)}
                >
                  <MaterialIcons name="edit" size={20} color={COLORS.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => handleDelete(item.id_kategori)}
                >
                  <MaterialIcons
                    name="delete"
                    size={20}
                    color={COLORS.danger}
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="folder-open-outline"
                size={48}
                color={COLORS.border}
              />
              <Text style={styles.emptyText}>
                Belum ada kategori, mulai tambah sekarang
              </Text>
            </View>
          }
        />
      )}
      <FloatingButtonAdd
        onPress={() => {
          resetForm();
          setShowModal(true);
        }}
      />

      {/* Form Modal */}
      <Modal visible={showModal} animationType="slide" transparent={false}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => {
                setShowModal(false);
                resetForm();
              }}
            >
              <Text style={styles.closeButton}>Batal</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {formMode === 'edit' ? 'Edit Kategori' : 'Tambah Kategori'}
            </Text>
            <View style={{ width: 50 }} />
          </View>

          <ScrollView style={styles.formContent}>
            <Text style={styles.formLabel}>Nama Kategori *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Masukkan nama kategori"
              value={namaKategori}
              onChangeText={setNamaKategori}
              placeholderTextColor={COLORS.textSecondary}
            />

            <View style={{ height: 24 }} />
          </ScrollView>

          <View style={styles.formActions}>
            <Button
              title={formMode === 'edit' ? 'Update' : 'Tambah'}
              onPress={handleSubmit}
              loading={submitting}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.danger,
  },
  errorText: {
    flex: 1,
    color: COLORS.danger,
    fontSize: 14,
    fontWeight: '500',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 12,
    paddingBottom: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  closeButton: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  formContent: {
    flex: 1,
    padding: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 16,
  },
  textInput: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    fontSize: 15,
    color: COLORS.text,
    backgroundColor: COLORS.card,
  },
  formActions: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
});
