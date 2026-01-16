import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  Platform,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface FABProps {
  onPress: () => void;
  iconName?: string;
  color?: string;
  style?: ViewStyle; // Memungkinkan custom posisi per screen jika perlu
}

const FloatingButtonAdd = ({
  onPress,
  iconName = 'add',
  color = '#3B82F6',
  style,
}: FABProps) => {
  return (
    <TouchableOpacity
      style={[styles.fab, { backgroundColor: color }, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <MaterialIcons name={iconName} size={32} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    // Z-index agar selalu di depan
    zIndex: 999,
    // Bayangan untuk Android
    elevation: 8,
    // Bayangan untuk iOS
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
});

export default FloatingButtonAdd;
