import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { formatTime } from '../utils/calculations';
import {
  getCurrentLap,
  removeCurrentLap,
  getRankedLaps,
  addPointsToUser,
  saveCurrentLap,
} from '../utils/storage';
import { COLORS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function EmissionResults() {
  const [lapData, setLapData] = useState(null);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [loading, setLoading] = useState(true);

  const earnedPoints = 3;

  useEffect(() => {
    const loadData = async () => {
      const storedLap = await getCurrentLap();

      if (!storedLap) {
        router.replace('/lap-form');
        return;
      }

      let updatedLap = { ...storedLap };

      // Evita pontuar mais de uma vez se a tela abrir novamente
      if (updatedLap.completed && updatedLap.email && !updatedLap.pointsAwarded) {
        await addPointsToUser(updatedLap.email, earnedPoints);
        updatedLap.pointsAwarded = true;
        await saveCurrentLap(updatedLap);
      }

      setLapData(updatedLap);

      const allLaps = await getRankedLaps();
      setTotalCompleted(allLaps.length);

      setLoading(false);
    };

    loadData();
  }, []);

  const handleNewLap = () => {
    router.push('/lap-form');
  };

  const viewRanking = () => {
    router.push('/ranking');
  };

  const startNewSession = async () => {
    await removeCurrentLap();
    router.replace('/registration');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  if (!lapData) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerBlock}>
        <Text style={styles.title}>Resultado da Corrida</Text>
      </View>

      {lapData.completed ? (
        <View style={styles.card}>
          <View style={styles.topRow}>
            <View>
              <Text style={styles.smallLabel}>Tempo da Volta</Text>
              <Text style={styles.timeText}>{formatTime(lapData.time)}</Text>
            </View>

            <View style={styles.pointsBadge}>
              <Text style={styles.pointsBadgeText}>+{earnedPoints} PONTOS</Text>
            </View>
          </View>

          <View style={styles.emissionRow}>
            <View style={[styles.infoBox, styles.infoBoxPrimary]}>
              <Text style={styles.infoBoxLabelPrimary}>Ford Racing</Text>
              <Text style={styles.infoBoxValue}>{lapData.emissionF1}L</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoBoxLabel}>Chevrolet</Text>
              <Text style={styles.infoBoxValue}>{lapData.emissionFE}L</Text>
            </View>
          </View>

          <View style={styles.savingBox}>
            <View style={styles.savingIcon}>
              <Ionicons name="water-outline" size={22} color="#111" />
            </View>

            <View>
              <Text style={styles.savingTitle}>
                Economia: {lapData.difference}L
              </Text>
              <Text style={styles.savingSubtitle}>
                Total de voltas: {totalCompleted}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.card}>
          <Ionicons name="water-outline" size={22} color="#111" />
          <Text style={styles.incompleteTitle}>Corrida Incompleta</Text>
          <Text style={styles.incompleteText}>
            Voltas não finalizadas não somam pontos.
          </Text>
        </View>
      )}

      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleNewLap}>
          <Text style={styles.secondaryButtonText}>Nova Volta</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.greenButton} onPress={viewRanking}>
          <Text style={styles.primaryButtonText}>Ranking</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton} onPress={startNewSession}>
          <Text style={styles.primaryButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: COLORS.text,
    marginTop: 12,
    fontSize: 15,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    justifyContent: 'center',
  },
  headerBlock: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 22,
    gap: 12,
  },
  smallLabel: {
    fontSize: 12,
    color: COLORS.muted,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  timeText: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
  },
  pointsBadge: {
    backgroundColor: '#FACC15',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  pointsBadgeText: {
    color: '#111111',
    fontSize: 12,
    fontWeight: '800',
  },
  emissionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  infoBox: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  infoBoxPrimary: {
    borderColor: 'rgba(225, 6, 0, 0.4)',
  },
  infoBoxLabelPrimary: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  infoBoxLabel: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  infoBoxValue: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
  },
  savingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: 'rgba(22, 163, 74, 0.10)',
    borderWidth: 1,
    borderColor: 'rgba(22, 163, 74, 0.45)',
    borderRadius: 14,
    padding: 16,
  },
  savingIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  savingIconText: {
    fontSize: 22,
  },
  savingTitle: {
    color: COLORS.secondary,
    fontWeight: '800',
    fontSize: 16,
  },
  savingSubtitle: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 4,
  },
  incompleteIcon: {
    fontSize: 42,
    textAlign: 'center',
    marginBottom: 14,
  },
  incompleteTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  incompleteText: {
    fontSize: 14,
    color: COLORS.muted,
    textAlign: 'center',
  },
  buttonGroup: {
    marginTop: 24,
    gap: 12,
  },
  secondaryButton: {
    backgroundColor: '#2A2A35',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: COLORS.text,
    fontWeight: '800',
    fontSize: 15,
  },
  greenButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: COLORS.text,
    fontWeight: '800',
    fontSize: 15,
  },
});