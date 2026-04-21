import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

export default function AppCard({ children, accent = 'primary', style }) {
  return (
    <View
      style={[
        styles.card,
        accent === 'primary' && styles.primary,
        accent === 'secondary' && styles.secondary,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  primary: {
    borderLeftColor: COLORS.primary,
  },
  secondary: {
    borderLeftColor: COLORS.secondary,
  },
});