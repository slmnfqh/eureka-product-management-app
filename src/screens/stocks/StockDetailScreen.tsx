import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from '../../components/Button';

import { COLORS, getStockStatus } from '../../constants/colors';

export default function StockDetailScreen({ route, navigation }: any) {
  const stock = route.params?.stock;

  if (!stock) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Data stok tidak ditemukan.</Text>
        <Button title="Kembali" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const stockStatus = getStockStatus(stock.jumlah_barang);

  const formatDateTime = (dateString: string) => {
    try {
      if (!dateString) return '-';
      const date = new Date(dateString);
      return `${date.toLocaleDateString('id-ID')} ${date.toLocaleTimeString(
        'id-ID',
        { hour: '2-digit', minute: '2-digit' },
      )}`;
    } catch (e) {
      return 'Tanggal tidak valid';
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Hapus Stok',
      `Yakin ingin menghapus stok produk "${
        stock.nama_produk || stock.id_produk
      }"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Sukses', 'Stok berhasil dihapus');
            navigation.goBack();
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={28} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Stok</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.mainCard}>
          <View style={styles.iconContainer}>
            <Ionicons name="cube" size={50} color={COLORS.primary} />
          </View>
          {/* Perhatikan: Tidak ada spasi di antara kurung kurawal dan tag Text */}
          <Text style={styles.productName}>
            {stock.nama_produk || `Produk ID: #${stock.id_produk}`}
          </Text>
          <Text style={styles.stockId}>{`ID Stok: #${stock.id_stok}`}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Informasi Stok</Text>
          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Ionicons name="apps-outline" size={20} color={COLORS.primary} />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Jumlah Barang</Text>
                <Text
                  style={[styles.detailValue, { color: stockStatus.color }]}
                >
                  {`${stock.jumlah_barang} unit (${stockStatus.label})`}
                </Text>
              </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={20} color={COLORS.primary} />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Terakhir Update</Text>
                <Text style={styles.detailValue}>
                  {formatDateTime(stock.tgl_update)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              navigation.navigate('StockList', {
                editStock: stock,
              });
            }}
          >
            <Ionicons name="pencil" size={18} color={COLORS.primary} />
            <Text style={styles.editButtonText}>Edit Stok</Text>
          </TouchableOpacity>
          <Button title="Hapus Stok" onPress={handleDelete} variant="danger" />
        </View>
      </ScrollView>
    </View>
  );
}

// ... styles tetap sama seperti yang kamu buat ...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: { fontSize: 16, color: COLORS.danger, marginBottom: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: { padding: 16, paddingBottom: 32 },
  mainCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 2,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  stockId: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  infoSection: { marginBottom: 32 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
    marginLeft: 4,
  },
  detailCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 8,
  },
  detailTextContainer: { flex: 1 },
  detailLabel: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 2 },
  detailValue: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  separator: { height: 1, backgroundColor: COLORS.border, marginVertical: 8 },
  actionSection: { gap: 12 },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
  },
  editButtonText: { fontSize: 15, fontWeight: '600', color: COLORS.primary },
});
