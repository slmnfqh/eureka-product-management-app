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

import { COLORS } from '../../constants/colors';

export default function CategoryDetailScreen({ route, navigation }: any) {
  const { category } = route.params;

  if (!category) {
    return (
      <View style={styles.container}>
        <Text>Category tidak ditemukan</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Hapus Kategori',
      `Yakin ingin menghapus kategori "${category?.nama_kategori}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            // TODO: Panggil deleteKategori service & dispatch redux
            navigation.goBack();
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Custom */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={28} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Kategori</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Category Icon & Name Card */}
        <View style={styles.mainCard}>
          <View style={styles.iconContainer}>
            <Ionicons name="folder-open" size={50} color={COLORS.primary} />
          </View>
          <Text style={styles.categoryName}>{category?.nama_kategori}</Text>
          <Text style={styles.categoryId}>
            ID Kategori: #{category?.id_kategori}
          </Text>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Informasi</Text>
          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Ionicons
                name="pricetag-outline"
                size={20}
                color={COLORS.primary}
              />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Label Kategori</Text>
                <Text style={styles.detailValue}>
                  {category?.nama_kategori}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              navigation.navigate('CategoryList', {
                editCategory: category,
              });
            }}
          >
            <Ionicons name="pencil" size={18} color={COLORS.primary} />
            <Text style={styles.editButtonText}>Edit Nama Kategori</Text>
          </TouchableOpacity>

          <Button
            title="Hapus Kategori"
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
  },
  mainCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
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
  categoryName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  categoryId: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  infoSection: {
    marginBottom: 32,
  },
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
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  actionSection: {
    gap: 12,
  },
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
  editButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
  },
});
