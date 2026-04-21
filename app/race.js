import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { getCurrentUser } from '../utils/storage';
import { COLORS } from '../constants/theme';
import ScreenContainer from '../components/ScreenContainer';
import Header from '../components/Header';
import AppCard from '../components/AppCard';
import AppButton from '../components/AppButton';

export default function RacePage() {
  const [userName, setUserName] = useState('');
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await getCurrentUser();

      if (!userData) {
        router.replace('/registration');
        return;
      }

      setUserName(userData.name || '');
    };

    loadUser();
  }, []);

  const handleRace = () => {
    setAnimating(true);

    setTimeout(() => {
      router.push('/lap-form');
    }, 800);
  };

  return (
    <ScreenContainer>
      <Header
        title="Hora de correr"
        subtitle={userName ? `Bem-vindo(a), ${userName}!` : 'Prepare-se para a pista'}
      />

      <AppCard accent="primary" style={styles.centerCard}>
        <View style={styles.iconCircle}>
          <Ionicons name="flag-outline" size={34} color={COLORS.primary} />
        </View>

        <Text style={styles.description}>
          Prepare-se para testar suas habilidades na pista e descobrir o quão forte é a Ford.
        </Text>

        <AppButton
          title={animating ? 'Preparando corrida...' : 'Correr agora'}
          onPress={handleRace}
          icon="flash-outline"
          disabled={animating}
        />
      </AppCard>

      <AppCard accent="secondary">
        <View style={styles.tipHeader}>
          <Ionicons name="leaf-outline" size={18} color={COLORS.secondary} />
          <Text style={styles.tipTitle}>Você sabia?</Text>
        </View>

        <Text style={styles.tipText}>
          Um carro de Fórmula E emite até <Text style={styles.highlight}>98% menos</Text> CO₂ por volta
          quando comparado a um carro de Fórmula 1.
        </Text>
      </AppCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centerCard: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: 'rgba(225, 6, 0, 0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  description: {
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 23,
    fontSize: 15,
    marginBottom: 20,
  },
  tipHeader: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  tipTitle: {
    color: COLORS.text,
    fontWeight: '800',
    fontSize: 16,
  },
  tipText: {
    color: COLORS.muted,
    lineHeight: 22,
  },
  highlight: {
    color: COLORS.secondary,
    fontWeight: '800',
  },
});