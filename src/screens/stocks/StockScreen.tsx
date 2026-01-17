import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Button from '../../components/Button';

import {
  fetchStockStart,
  fetchStockSuccess,
  fetchStockError,
} from '../../store/stockSlice';

import { RootState } from '../../store';
import {
  getStok,
  createStok,
  updateStok,
  deleteStok,
} from '../../services/stockService';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FloatingButtonAdd from '../../components/FloatingButtonAdd';
import Input from '../../components/Input';

import { COLORS, getStockStatus } from '../../constants/colors';

import { getProduk } from '../../services/productService';
import { useFocusEffect } from '@react-navigation/native';

export default function StockScreen({ navigation, route }: any) {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector(
    (state: RootState) => state.stocks,
  );

  const [idProduk, setIdProduk] = useState('');
  const [jumlahBarang, setJumlahBarang] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [products, setProducts] = useState<any[]>([]); // State daftar produk
  const [showProductModal, setShowProductModal] = useState(false); // State Modal Dropdown

  useEffect(() => {
    loadStok();
    loadProdukList(); // Panggil saat screen dibuka
  }, []);

  const loadStok = async () => {
    dispatch(fetchStockStart());
    try {
      const data = await getStok();
      dispatch(fetchStockSuccess(data));
    } catch (err: any) {
      dispatch(fetchStockError(err.message));
    }
  };

  const loadProdukList = async () => {
    try {
      const data = await getProduk();
      setProducts(data);
    } catch (err) {
      console.log('Gagal memuat produk');
    }
  };

  const resetForm = () => {
    setIdProduk('');
    setJumlahBarang('');
    setEditingId(null);
    setSubmitting(false);
  };

  const handleSubmit = async () => {
    if (!idProduk.trim() || !jumlahBarang.trim()) {
      Alert.alert('Validasi', 'ID produk dan jumlah barang wajib diisi');
      return;
    }

    if (isNaN(Number(idProduk)) || isNaN(Number(jumlahBarang))) {
      Alert.alert('Validasi', 'ID produk dan jumlah harus berupa angka');
      return;
    }

    setSubmitting(true);

    const payload = {
      id_produk: Number(idProduk),
      jumlah_barang: Number(jumlahBarang),
    };

    try {
      if (editingId) {
        await updateStok(editingId, payload);
        Alert.alert('Sukses', 'Stok berhasil diperbarui');
      } else {
        await createStok(payload);
        Alert.alert('Sukses', 'Stok berhasil ditambahkan');
      }

      resetForm();
      setShowModal(false);
      loadStok();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Gagal menyimpan stok');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item: any) => {
    setIdProduk(String(item.id_produk));
    setJumlahBarang(String(item.jumlah_barang));
    setEditingId(item.id_stok);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    Alert.alert('Hapus Stok', 'Yakin ingin menghapus stok ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteStok(id); // id di sini adalah id_stok
            Alert.alert('Sukses', 'Stok berhasil dihapus');
            loadStok();
          } catch (err: any) {
            // Tambahkan penanganan pesan error yang lebih rapi
            const msg = err?.response?.data?.message || 'Gagal menghapus stok';
            Alert.alert('Error', msg);
          }
        },
      },
    ]);
  };

  useEffect(() => {
    loadStok();
  }, []);

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) {
      return { label: 'Habis', color: COLORS.danger, bgColor: '#FEE2E2' };
    } else if (quantity < 10) {
      return { label: 'Minim', color: COLORS.warning, bgColor: '#FEF3C7' };
    } else {
      return { label: 'Tersedia', color: COLORS.secondary, bgColor: '#DCFCE7' };
    }
  };

  // Mencari produk berdasarkan ID
  const selectedProduct = products.find(
    p => String(p.id_produk) === String(idProduk),
  );

  useFocusEffect(
    useCallback(() => {
      loadStok();
      loadProdukList();

      const editStock = route?.params?.editStock;
      if (editStock) {
        setIdProduk(String(editStock.id_produk));
        setJumlahBarang(String(editStock.jumlah_barang));
        setEditingId(editStock.id_stok);
        setShowModal(true);

        // bersihin param biar ga kebuka lagi saat balik2
        navigation.setParams({ editStock: undefined });
      }
    }, [route?.params?.editStock]),
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Stok</Text>
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
      {/* Stock List */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item, index) =>
            item?.id_stok ? item.id_stok.toString() : index.toString()
          }
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const status = getStockStatus(item.jumlah_barang);
            return (
              <TouchableOpacity
                style={styles.card}
                activeOpacity={0.7}
                onPress={() =>
                  navigation.navigate('StockDetail', { stock: item })
                }
              >
                <View style={styles.iconWrapper}>
                  <Ionicons name="cube" size={24} color={COLORS.primary} />
                </View>

                <View style={styles.cardInfo}>
                  <Text style={styles.stockTitle} numberOfLines={1}>
                    {item.nama_produk || `Produk #${item.id_produk}`}
                  </Text>
                  <Text style={styles.stockQuantity}>
                    {item.jumlah_barang} Unit
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: status.bgColor },
                    ]}
                  >
                    <Text style={[styles.statusText, { color: status.color }]}>
                      {status.label}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={e => {
                      e.stopPropagation(); // Agar saat klik edit, detail tidak terbuka
                      handleEdit(item);
                    }}
                  >
                    <MaterialIcons
                      name="edit"
                      size={20}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={e => {
                      e.stopPropagation(); // Agar saat klik hapus, detail tidak terbuka
                      handleDelete(item.id_stok);
                    }}
                  >
                    <MaterialIcons
                      name="delete"
                      size={20}
                      color={COLORS.danger}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="cube-outline" size={48} color={COLORS.border} />
              <Text style={styles.emptyText}>Belum ada data stok.</Text>
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

      {/* MODAL UTAMA */}
      <Modal visible={showModal} animationType="slide">
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
              {editingId ? 'Edit Stok' : 'Tambah Stok'}
            </Text>
            <View style={{ width: 50 }} />
          </View>

          <ScrollView style={styles.formContent}>
            <Text style={styles.formLabel}>Pilih Produk *</Text>
            <TouchableOpacity
              style={[styles.categorySelector, { marginBottom: 18 }]}
              onPress={async () => {
                await loadProdukList();
                setShowProductModal(true);
              }}
            >
              <Text
                style={[
                  styles.categorySelectorText,
                  !idProduk && { color: COLORS.textSecondary },
                ]}
              >
                {selectedProduct ? selectedProduct.nama_produk : 'Pilih Produk'}
              </Text>
              <Ionicons
                name="chevron-down"
                size={20}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>

            <Input
              label="Jumlah Barang *"
              placeholder="Masukkan jumlah barang"
              value={jumlahBarang}
              onChangeText={setJumlahBarang}
              keyboardType="numeric" // Supaya keyboard muncul angka saja
            />
          </ScrollView>

          <View style={styles.formActions}>
            <Button
              title={editingId ? 'Update' : 'Simpan'}
              onPress={handleSubmit}
              loading={submitting}
            />
          </View>
        </View>
      </Modal>

      {/* MODAL SELECT PRODUK (DROPDOWN) */}
      <Modal visible={showProductModal} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.dropdownContainer}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.modalTitle}>Pilih Produk</Text>
              <TouchableOpacity onPress={() => setShowProductModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={products}
              keyExtractor={item => item.id_produk.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.categoryItem,
                    idProduk === String(item.id_produk) &&
                      styles.categoryItemSelected,
                  ]}
                  onPress={() => {
                    setIdProduk(String(item.id_produk));
                    setShowProductModal(false);
                  }}
                >
                  <View>
                    <Text style={styles.categoryItemText}>
                      {item.nama_produk}
                    </Text>
                    <Text style={styles.categorySubText}>
                      Kode: {item.kode_produk}
                    </Text>
                  </View>
                  {idProduk === String(item.id_produk) && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={COLORS.primary}
                    />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
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
    margin: 16,
    padding: 12,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
  },
  errorText: {
    color: COLORS.danger,
    fontFamily: 'Poppins-Medium',
    marginLeft: 8,
  },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 12, paddingBottom: 100 },
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
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 15,
  },
  stockTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  stockQuantity: {
    fontSize: 13, // Sedikit lebih kecil agar hierarki visual bagus
    fontFamily: 'Poppins-Regular',
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
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
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: {
    fontFamily: 'Poppins-Regular',
    color: COLORS.textSecondary,
    marginTop: 10,
  },
  modalContainer: { flex: 1, backgroundColor: COLORS.background },
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
  modalTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  closeButton: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  formContent: { padding: 16 },
  formLabel: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  categorySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.card,
  },
  categorySelectorText: { fontFamily: 'Poppins-Regular', fontSize: 15 },
  textInput: {
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.card,
    fontFamily: 'Poppins-Regular',
  },
  formActions: { padding: 16 },
  // Dropdown Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  dropdownContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    maxHeight: '80%',
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  categoryItemSelected: { backgroundColor: '#F0F7FF' },
  categoryItemText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    color: COLORS.text,
  },
  categorySubText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});
