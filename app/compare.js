import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS } from '../constants/theme';
import ScreenContainer from '../components/ScreenContainer';
import Header from '../components/Header';
import AppCard from '../components/AppCard';
import AppButton from '../components/AppButton';

export default function ComparePage() {
  const fordData = [
    { label: 'Potência', value: '397 cv', icon: 'flash-outline' },
    { label: 'Aceleração', value: '0–100 km/h em 5,8s', icon: 'speedometer-outline' },
    { label: 'Tecnologia', value: '7 modos de condução', icon: 'hardware-chip-outline' },
    { label: 'Destaque', value: 'Suspensão FOX Racing', icon: 'trophy-outline' },
  ];

  const concorrenteData = [
    { label: 'Potência', value: '360 cv', icon: 'flash-outline' },
    { label: 'Aceleração', value: 'Desempenho mais tradicional', icon: 'trending-down-outline' },
    { label: 'Tecnologia', value: 'Pacote mais básico', icon: 'settings-outline' },
    { label: 'Destaque', value: 'Maior foco utilitário', icon: 'car-sport-outline' },
  ];

  const specs = [
    { label: 'Motor', ford: 'V6 3.0L biturbo', conc: 'V8 5.3 aspirado' },
    { label: 'Potência', ford: '397 cv', conc: '360 cv' },
    { label: 'Torque', ford: '583 Nm', conc: '519 Nm' },
    { label: 'Tração', ford: '4WD', conc: '4x4 tradicional' },
  ];

  return (
    <ScreenContainer>
      <Header
        title="Ford vs Concorrência"
        subtitle="Comparativo entre performance, tecnologia e proposta de uso"
        showBack
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <AppCard accent="primary">
          <Text style={styles.cardTitlePrimary}>Ford Ranger Raptor</Text>

          {fordData.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Ionicons name={item.icon} size={18} color={COLORS.primary} />
              <View style={styles.itemTextWrap}>
                <Text style={styles.itemLabel}>{item.label}</Text>
                <Text style={styles.itemValue}>{item.value}</Text>
              </View>
            </View>
          ))}
        </AppCard>

        <AppCard>
          <Text style={styles.cardTitle}>Chevrolet Silverado</Text>

          {concorrenteData.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Ionicons name={item.icon} size={18} color={COLORS.muted} />
              <View style={styles.itemTextWrap}>
                <Text style={styles.itemLabel}>{item.label}</Text>
                <Text style={styles.itemValue}>{item.value}</Text>
              </View>
            </View>
          ))}
        </AppCard>

        <AppCard>
          <Text style={styles.cardTitle}>Comparação Técnica</Text>

          {specs.map((item, index) => (
            <View key={index} style={styles.specRow}>
              <Text style={styles.specFord}>{item.ford}</Text>
              <Text style={styles.specLabel}>{item.label}</Text>
              <Text style={styles.specConc}>{item.conc}</Text>
            </View>
          ))}
        </AppCard>

        <AppButton
          title="Ir para corrida"
          onPress={() => router.push('/lap-form')}
          icon="arrow-forward-outline"
        />

        <View style={{ height: 30 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  cardTitlePrimary: {
    color: COLORS.primary,
    fontWeight: '800',
    fontSize: 18,
    marginBottom: 14,
  },
  cardTitle: {
    color: COLORS.text,
    fontWeight: '800',
    fontSize: 18,
    marginBottom: 14,
  },
  itemRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
    alignItems: 'flex-start',
  },
  itemTextWrap: {
    flex: 1,
  },
  itemLabel: {
    color: COLORS.muted,
    fontSize: 13,
  },
  itemValue: {
    color: COLORS.text,
    fontWeight: '700',
    marginTop: 2,
  },
  specRow: {
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  specFord: {
    color: COLORS.primary,
    fontWeight: '800',
    marginBottom: 2,
  },
  specLabel: {
    color: COLORS.muted,
    fontSize: 12,
    marginBottom: 2,
  },
  specConc: {
    color: COLORS.text,
  },
});