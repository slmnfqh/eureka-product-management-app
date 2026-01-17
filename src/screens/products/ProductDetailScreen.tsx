import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Button from '../../components/Button';

import { COLORS, getCategoryColor } from '../../constants/colors';

export default function ProductDetailScreen({ route, navigation }: any) {
  const { product } = route.params;

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Product tidak ditemukan</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert('Hapus Produk', 'Yakin ingin menghapus produk ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => {
          // TODO: Implement delete logic with Redux and services
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: product.foto_url || 'https://via.placeholder.com/300',
            }}
            style={styles.productImage}
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Product Details */}
        <View style={styles.detailContent}>
          {/* Header Info */}
          <View style={styles.headerInfo}>
            <View style={{ flex: 1 }}>
              <Text style={styles.productName}>{product.nama_produk}</Text>
              <Text style={styles.productCode}>{product.kode_produk}</Text>
            </View>
            <View
              style={[
                styles.categoryBadgeDetail,
                {
                  backgroundColor: getCategoryColor(product.nama_kategori)
                    .badge,
                },
              ]}
            >
              <Text
                style={[
                  styles.categoryTextDetail,
                  {
                    color: getCategoryColor(product.nama_kategori).text,
                  },
                ]}
              >
                {product.nama_kategori || 'Tanpa kategori'}
              </Text>
            </View>
          </View>

          {/* Details Card */}
          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="barcode" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.detailInfo}>
                <Text style={styles.detailLabel}>Kode Produk</Text>
                <Text style={styles.detailValue}>{product.kode_produk}</Text>
              </View>
            </View>

            <View style={styles.dividerDetail} />

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="folder" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.detailInfo}>
                <Text style={styles.detailLabel}>Kategori</Text>
                <Text style={styles.detailValue}>
                  {product.nama_kategori || '—'}
                </Text>
              </View>
            </View>

            <View style={styles.dividerDetail} />

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons
                  name="document-text"
                  size={20}
                  color={COLORS.primary}
                />
              </View>
              <View style={styles.detailInfo}>
                <Text style={styles.detailLabel}>ID Produk</Text>
                <Text style={styles.detailValue}>{product.id_produk}</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                // LANGSUNG ke ProductList karena berada di stack yang sama
                navigation.navigate('ProductList', {
                  editProduct: product,
                });
              }}
            >
              <Ionicons name="pencil" size={18} color={COLORS.primary} />
              <Text style={styles.editButtonText}>Edit Produk</Text>
            </TouchableOpacity>
          </View>

          <Button
            title="Hapus Produk"
            onPress={handleDelete}
            variant="danger"
          />
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
  imageContainer: {
    position: 'relative',
    height: 300,
    backgroundColor: COLORS.card,
  },
  productImage: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.background,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  productName: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  productCode: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  categoryBadgeDetail: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  categoryTextDetail: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailInfo: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  dividerDetail: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  actionButtons: {
    marginBottom: 12,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: '#EFF6FF',
  },
  editButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
  },
});
