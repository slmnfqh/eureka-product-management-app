import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';
import { ICON_EMOJI } from '../utils/icons';

interface IconProps extends Omit<TextProps, 'children'> {
  name: keyof typeof ICON_EMOJI;
  size?: number;
  color?: string;
}

export default function Icon({
  name,
  size = 24,
  color = '#000',
  style,
  ...props
}: IconProps) {
  const emoji = ICON_EMOJI[name] || '•';

  return (
    <Text style={[styles.icon, { fontSize: size, color }, style]} {...props}>
      {emoji}
    </Text>
  );
}

const styles = StyleSheet.create({
  icon: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
