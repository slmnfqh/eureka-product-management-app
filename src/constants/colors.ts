export const COLORS = {
  primary: '#3B82F6',
  secondary: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  background: '#F9FAFB',
  card: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  shadow: '#000000',
};

export const CATEGORY_COLORS: Record<
  string,
  { bg: string; text: string; badge: string }
> = {
  makanan: {
    bg: '#FEF3C7',
    text: '#D97706',
    badge: '#FECACA',
  },
  minuman: {
    bg: '#DBEAFE',
    text: '#0284C7',
    badge: '#BFDBFE',
  },
  pakaian: {
    bg: '#F3E8FF',
    text: '#7C3AED',
    badge: '#E9D5FF',
  },
  elektronik: {
    bg: '#DCE4FF',
    text: '#4F46E5',
    badge: '#E0E7FF',
  },
  furniture: {
    bg: '#D1FAE5',
    text: '#059669',
    badge: '#CCFBF1',
  },
  kecantikan: {
    bg: '#FBE2F3',
    text: '#DB2777',
    badge: '#FBCFE8',
  },
  olahraga: {
    bg: '#FED7AA',
    text: '#EA580C',
    badge: '#FEDDCA',
  },
  buku: {
    bg: '#CCFBF1',
    text: '#0D9488',
    badge: '#CFFAFE',
  },
  mainan: {
    bg: '#FEE2E2',
    text: '#DC2626',
    badge: '#FECACA',
  },
  peralatan: {
    bg: '#E0E7FF',
    text: '#3730A3',
    badge: '#E0E7FF',
  },
  snack: {
    bg: '#CFFAFE',
    text: '#0891B2',
    badge: '#A5F3FC',
  },
};

export const getCategoryColor = (categoryName: string) => {
  const normalized = categoryName?.toLowerCase().trim() || '';
  return (
    CATEGORY_COLORS[normalized] || {
      bg: '#F3F4F6',
      text: '#6B7280',
      badge: '#E5E7EB',
    }
  );
};

export const getStockStatus = (quantity: number) => {
  if (quantity === 0) {
    return {
      label: 'Habis',
      color: COLORS.danger,
      bgColor: '#FEE2E2',
    };
  } else if (quantity < 10) {
    return {
      label: 'Minim',
      color: COLORS.warning,
      bgColor: '#FEF3C7',
    };
  } else {
    return {
      label: 'Tersedia',
      color: COLORS.secondary,
      bgColor: '#DCFCE7',
    };
  }
};
