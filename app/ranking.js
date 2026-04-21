import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { getRankedLaps, getGlobalRanking } from '../utils/storage';
import { formatTime } from '../utils/calculations';
import { COLORS } from '../constants/theme';
import ScreenContainer from '../components/ScreenContainer';
import Header from '../components/Header';
import AppCard from '../components/AppCard';
import AppButton from '../components/AppButton';

export default function Ranking() {
  const [laps, setLaps] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const rankedLaps = await getRankedLaps();
      const rankedUsers = await getGlobalRanking();
      setLaps(rankedLaps);
      setUsers(rankedUsers);
    };

    loadData();
  }, []);

  return (
    <ScreenContainer>
      <Header
        title="Hall da Fama"
        subtitle="Pilotos com mais pontos e melhores tempos"
        showBack
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <AppCard accent="secondary">
          <View style={styles.sectionHeader}>
            <Ionicons name="trophy-outline" size={18} color="#FACC15" />
            <Text style={styles.cardTitle}>Ranking de Pontuação</Text>
          </View>

          {users.length > 0 ? (
            users.map((user, index) => (
              <View key={index} style={styles.row}>
                <Text style={styles.position}>{index + 1}º</Text>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.points}>{user.points || 0} pts</Text>
              </View>
            ))
          ) : (
            <Text style={styles.empty}>Sem pilotos ainda</Text>
          )}
        </AppCard>

        <AppCard accent="primary">
          <View style={styles.sectionHeader}>
            <Ionicons name="speedometer-outline" size={18} color={COLORS.primary} />
            <Text style={styles.cardTitle}>Recordes de Pista</Text>
          </View>

          {laps.length > 0 ? (
            laps.map((lap, index) => (
              <View key={index} style={styles.row}>
                <Text style={styles.position}>{index + 1}º</Text>
                <Text style={styles.name}>{lap.name}</Text>
                <Text style={styles.time}>{formatTime(lap.time)}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.empty}>Nenhum recorde ainda</Text>
          )}
        </AppCard>

        <AppCard>
          <View style={styles.communityRow}>
            <View style={styles.communityIcon}>
              <Ionicons name="people-outline" size={20} color={COLORS.primary} />
            </View>
            <View>
              <Text style={styles.communityTitle}>{users.length} Pilotos Registrados</Text>
              <Text style={styles.communitySubtitle}>Comunidade Ford Racing</Text>
            </View>
          </View>
        </AppCard>

        <View style={styles.buttons}>
          <AppButton
            title="Comparar carros"
            onPress={() => router.push('/compare')}
            icon="git-compare-outline"
            variant="secondary"
          />

          <AppButton
            title="Correr de novo"
            onPress={() => router.push('/race')}
            icon="flash-outline"
          />
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    color: COLORS.text,
    fontWeight: '800',
    fontSize: 18,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  position: {
    color: COLORS.text,
    fontWeight: '800',
    width: 34,
  },
  name: {
    flex: 1,
    color: COLORS.text,
  },
  points: {
    color: '#FACC15',
    fontWeight: '800',
  },
  time: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  empty: {
    color: COLORS.muted,
    textAlign: 'center',
    paddingVertical: 12,
  },
  communityRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  communityIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(225, 6, 0, 0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  communityTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '800',
  },
  communitySubtitle: {
    color: COLORS.muted,
    marginTop: 2,
  },
  buttons: {
    gap: 12,
  },
});