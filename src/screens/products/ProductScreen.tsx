import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Input from '../../components/Input';
import Button from '../../components/Button';
import FloatingButtonAdd from '../../components/FloatingButtonAdd';

import {
  fetchProductStart,
  fetchProductSuccess,
  fetchProductError,
} from '../../store/productSlice';

import { RootState } from '../../store';
import {
  getProduk,
  createProduk,
  updateProduk,
  deleteProduk,
} from '../../services/productService';

import { COLORS, getCategoryColor } from '../../constants/colors';

import { getKategori } from '../../services/categoryService';
import { useFocusEffect } from '@react-navigation/native';
import { Kategori } from '../../types/category';

export default function ProductScreen({ navigation, route }: any) {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector(
    (state: RootState) => state.products,
  );

  const [namaProduk, setNamaProduk] = useState('');
  const [kodeProduk, setKodeProduk] = useState('');
  const [foto, setFoto] = useState<any>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [categories, setCategories] = useState<Kategori[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');

  const loadProduk = async () => {
    dispatch(fetchProductStart());
    try {
      const data = await getProduk();
      dispatch(fetchProductSuccess(data));
    } catch (err: any) {
      dispatch(fetchProductError(err.message));
    }
  };

  const loadKategori = async () => {
    try {
      const data = await getKategori();
      setCategories(data);
    } catch {
      Alert.alert('Error', 'Gagal memuat kategori');
    }
  };

  const pickImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (result.assets?.length) {
      setFoto(result.assets[0]);
    }
  };

  const resetForm = () => {
    setNamaProduk('');
    setKodeProduk('');
    setSelectedCategory(null);
    setFoto(null);
    setEditingId(null);
    setFormMode('add');
    setSubmitting(false);
  };

  const handleSubmit = async () => {
    if (!selectedCategory || !namaProduk.trim() || !kodeProduk.trim()) {
      Alert.alert(
        'Validasi',
        'Kategori, nama produk, dan kode produk wajib diisi',
      );
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append('id_kategori', String(selectedCategory));
    formData.append('nama_produk', namaProduk.trim());
    formData.append('kode_produk', kodeProduk.trim());

    if (foto) {
      formData.append('foto_produk', {
        uri: foto.uri,
        type: foto.type || 'image/jpeg',
        name: foto.fileName || `product_${Date.now()}.jpg`,
      } as any);
    }

    try {
      if (editingId !== null) {
        await updateProduk(editingId, formData);
        Alert.alert('Sukses', 'Produk berhasil diperbarui');
      } else {
        await createProduk(formData);
        Alert.alert('Sukses', 'Produk berhasil ditambahkan');
      }

      resetForm();
      setShowFormModal(false);
      loadProduk();
    } catch (err: any) {
      Alert.alert(
        'Error',
        err?.response?.data?.message || 'Gagal menyimpan produk',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item: any) => {
    setFormMode('edit');
    setNamaProduk(item.nama_produk);
    setKodeProduk(item.kode_produk);
    setSelectedCategory(item.id_kategori);
    setEditingId(item.id_produk);
    setFoto(null);
    setShowFormModal(true);
  };

  const handleDelete = (id: number) => {
    Alert.alert('Hapus Produk', 'Yakin ingin menghapus produk ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteProduk(id);
            Alert.alert('Sukses', 'Produk berhasil dihapus');
            loadProduk();
          } catch (err: any) {
            Alert.alert(
              'Error',
              err?.response?.data?.message || 'Gagal menghapus produk',
            );
          }
        },
      },
    ]);
  };

  useEffect(() => {
    loadProduk();
    loadKategori();
  }, []);

  useEffect(() => {
    console.log('Selected Category:', selectedCategory);
    console.log('Categories:', categories);
    console.log('Selected Category Name:', selectedCategoryName);
  }, [selectedCategory, categories]);

  const selectedCategoryName = selectedCategory
    ? categories.length > 0
      ? categories.find(c => c.id_kategori === selectedCategory)
          ?.nama_kategori ?? 'Memuat kategori...'
      : 'Memuat kategori...'
    : 'Pilih Kategori';

  useFocusEffect(
    useCallback(() => {
      loadProduk();
    }, []),
  );

  // ✅ TAMBAHKAN useFocusEffect UNTUK HANDLE EDIT DARI DETAIL
  useFocusEffect(
    useCallback(() => {
      const editProduct = route?.params?.editProduct;
      if (editProduct) {
        handleEdit(editProduct);
        navigation.setParams({ editProduct: undefined });
      }
    }, [route?.params?.editProduct]),
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Produk</Text>
        {/* <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            resetForm();
            setShowFormModal(true);
          }}
        >
          <MaterialIcons name="add" size={24} color="#fff" />
        </TouchableOpacity> */}
      </View>
      {/* Error Message */}
      {error && (
        <View style={styles.errorBanner}>
          <MaterialIcons name="error" size={18} color={COLORS.danger} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      {/* Product List */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item, index) =>
            item?.id_produk ? item.id_produk.toString() : index.toString()
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate('ProductDetail', { product: item })
              }
            >
              <Image
                source={{
                  uri: item.foto_url || 'https://via.placeholder.com/56',
                }}
                style={styles.thumbnail}
              />

              <View style={styles.cardContent}>
                <Text style={styles.productName} numberOfLines={2}>
                  {item.nama_produk}
                </Text>
                <Text style={styles.productCode}>{item.kode_produk}</Text>
                <View
                  style={[
                    styles.categoryBadge,
                    {
                      backgroundColor: getCategoryColor(item.nama_kategori)
                        .badge,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      { color: getCategoryColor(item.nama_kategori).text },
                    ]}
                  >
                    {item.nama_kategori || 'Tanpa kategori'}
                  </Text>
                </View>
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => handleEdit(item)}
                >
                  <MaterialIcons name="edit" size={18} color={COLORS.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => handleDelete(item.id_produk)}
                >
                  <MaterialIcons
                    name="delete"
                    size={18}
                    color={COLORS.danger}
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons
                name="folder-open"
                size={48}
                color={COLORS.border}
              />
              <Text style={styles.emptyText}>
                Belum ada produk, mulai tambah sekarang
              </Text>
            </View>
          }
        />
      )}
      <FloatingButtonAdd
        onPress={() => {
          resetForm();
          setFormMode('add');
          setShowFormModal(true);
        }}
      />
      {/* Form Modal */}
      <Modal visible={showFormModal} animationType="slide" transparent={false}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => {
                setShowFormModal(false);
                resetForm();
              }}
            >
              <Text style={styles.closeButton}>Batal</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {formMode === 'edit' ? 'Edit Produk' : 'Tambah Produk'}
            </Text>
            <View style={{ width: 50 }} />
          </View>

          <ScrollView
            style={styles.formContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Category Selector */}
            <Text style={styles.formLabel}>Kategori *</Text>
            <TouchableOpacity
              style={[styles.categorySelector, { marginBottom: 18 }]}
              onPress={async () => {
                await loadKategori();
                setShowCategoryModal(true);
              }}
            >
              <Text
                style={[
                  styles.categorySelectorText,
                  !selectedCategory && { color: COLORS.textSecondary },
                ]}
              >
                {selectedCategoryName}
              </Text>
              <MaterialIcons
                name="expand-more"
                size={20}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>

            {/* Product Name */}
            {/* GANTI NAMA PRODUK KE KOMPONEN INPUT */}
            <Input
              label="Nama Produk *"
              placeholder="Masukkan nama produk"
              value={namaProduk}
              onChangeText={setNamaProduk}
            />

            {/* Kode Produk: Label sudah include di dalam komponen Input */}
            <Input
              label="Kode Produk *"
              placeholder="Masukkan kode produk"
              value={kodeProduk}
              onChangeText={setKodeProduk}
            />

            {/* Photo */}
            <Text style={styles.formLabel}>Foto Produk *</Text>
            <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
              <MaterialIcons
                name="photo-camera"
                size={24}
                color={COLORS.primary}
              />
              <Text style={styles.photoButtonText}>Pilih Foto</Text>
            </TouchableOpacity>

            {foto && (
              <View style={styles.photoPreview}>
                <Image source={{ uri: foto.uri }} style={styles.preview} />
                <TouchableOpacity
                  style={styles.removePhotoButton}
                  onPress={() => setFoto(null)}
                >
                  <MaterialIcons
                    name="cancel"
                    size={24}
                    color={COLORS.danger}
                  />
                </TouchableOpacity>
              </View>
            )}

            <View style={{ height: 24 }} />
          </ScrollView>

          {/* Form Actions */}
          <View style={styles.formActions}>
            <Button
              title={formMode === 'edit' ? 'Update' : 'Tambah'}
              onPress={handleSubmit}
              loading={submitting}
            />
          </View>
        </View>
      </Modal>
      {/* Category Modal */}
      <Modal
        visible={showCategoryModal}
        animationType="slide"
        transparent={false}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
              <Text style={styles.closeButton}>Kembali</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Pilih Kategori</Text>
            <View style={{ width: 50 }} />
          </View>

          <FlatList
            data={categories}
            keyExtractor={(item, index) =>
              item?.id_kategori ? item.id_kategori.toString() : index.toString()
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.categoryItem,
                  selectedCategory === item.id_kategori &&
                    styles.categoryItemSelected,
                  {
                    backgroundColor: getCategoryColor(item.nama_kategori).bg,
                    borderLeftWidth:
                      selectedCategory === item.id_kategori ? 4 : 0,
                    borderLeftColor: getCategoryColor(item.nama_kategori).text,
                  },
                ]}
                onPress={() => {
                  setSelectedCategory(item.id_kategori);
                  setShowCategoryModal(false);
                }}
              >
                <Text
                  style={[
                    styles.categoryItemText,
                    {
                      color: getCategoryColor(item.nama_kategori).text,
                      fontWeight:
                        selectedCategory === item.id_kategori ? '700' : '500',
                    },
                  ]}
                >
                  {item.nama_kategori}
                </Text>
                {selectedCategory === item.id_kategori && (
                  <MaterialIcons
                    name="check-circle"
                    size={20}
                    color={getCategoryColor(item.nama_kategori).text}
                  />
                )}
              </TouchableOpacity>
            )}
            contentContainerStyle={{ padding: 16 }}
          />
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
    // padding: 12,
    // paddingBottom: 24,
    padding: 12,
    paddingBottom: 100,
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
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: COLORS.background,
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  productCode: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
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
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.card,
  },
  categorySelectorText: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '500',
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
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
  },
  photoButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
  },
  photoPreview: {
    marginTop: 16,
    position: 'relative',
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: COLORS.background,
  },
  removePhotoButton: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  formActions: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
    borderRadius: 10,
  },
  categoryItemSelected: {
    // backgroundColor: '#EFF6FF',
  },
  categoryItemText: {
    fontSize: 15,
  },
  categoryItemTextSelected: {
    fontWeight: '600',
    color: COLORS.primary,
  },
});
