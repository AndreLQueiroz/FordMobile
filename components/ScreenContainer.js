import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { COLORS } from '../constants/theme';

export default function ScreenContainer({ children, scroll = false }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
});