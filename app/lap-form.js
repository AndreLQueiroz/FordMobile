import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { calculateEmissions, parseTime } from '../utils/calculations';
import { saveLap, getCurrentUser, saveCurrentLap } from '../utils/storage';
import { COLORS } from '../constants/theme';
import ScreenContainer from '../components/ScreenContainer';
import Header from '../components/Header';
import AppCard from '../components/AppCard';
import AppButton from '../components/AppButton';

export default function LapForm() {
  const [lapTime, setLapTime] = useState('');
  const [completed, setCompleted] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser();
      if (!user) {
        router.replace('/registration');
      }
    };

    checkUser();
  }, []);

  const handleSubmit = async () => {
    if (!lapTime) {
      setError('Por favor, informe o tempo da volta.');
      return;
    }

    let timeInSeconds;

    if (lapTime.includes(':')) {
      if (!/^\d{1,2}:\d{2}\.\d{1,3}$/.test(lapTime)) {
        setError('Formato inválido. Use mm:ss.SSS');
        return;
      }
      timeInSeconds = parseTime(lapTime);
    } else {
      if (!/^\d+(\.\d+)?$/.test(lapTime)) {
        setError('Tempo inválido.');
        return;
      }
      timeInSeconds = parseFloat(lapTime);
    }

    const { f1Emission, feEmission, difference } = calculateEmissions(completed);
    const user = await getCurrentUser();

    const lapRecord = {
      userId: user?.userId || 'unknown',
      name: user?.name || 'Anonymous',
      email: user?.email || '',
      time: timeInSeconds,
      completed,
      emissionF1: f1Emission,
      emissionFE: feEmission,
      difference,
      date: new Date().toISOString(),
    };

    await saveLap(lapRecord);
    await saveCurrentLap(lapRecord);

    router.push('/results');
  };

  return (
    <ScreenContainer>
      <Header
        title="Registrar volta"
        subtitle="Informe o tempo e se a volta foi concluída"
        showBack
      />

      <AppCard accent="primary">
        <Text style={styles.label}>Tempo da volta</Text>

        <View style={styles.inputWrap}>
          <Ionicons name="timer-outline" size={18} color={COLORS.muted} />
          <TextInput
            value={lapTime}
            onChangeText={setLapTime}
            placeholder="1:30.091 ou 90.091"
            placeholderTextColor={COLORS.muted}
            style={styles.input}
          />
        </View>

        <Text style={styles.helper}>Formato: mm:ss.SSS ou segundos</Text>

        <Text style={[styles.label, { marginTop: 18 }]}>Completou a volta?</Text>

        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.option, completed && styles.optionActiveGreen]}
            onPress={() => setCompleted(true)}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={18}
              color={COLORS.text}
            />
            <Text style={styles.optionText}>Sim</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, !completed && styles.optionActiveRed]}
            onPress={() => setCompleted(false)}
          >
            <Ionicons
              name="close-circle-outline"
              size={18}
              color={COLORS.text}
            />
            <Text style={styles.optionText}>Não</Text>
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={{ marginTop: 20 }}>
          <AppButton
            title="Calcular emissão"
            onPress={handleSubmit}
            icon="speedometer-outline"
          />
        </View>
      </AppCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  label: {
    color: COLORS.text,
    marginBottom: 8,
    fontWeight: '700',
    fontSize: 14,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#23232b',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 15,
  },
  helper: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  option: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#2a2a35',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    flexDirection: 'row',
  },
  optionActiveGreen: {
    backgroundColor: COLORS.secondary,
  },
  optionActiveRed: {
    backgroundColor: COLORS.primary,
  },
  optionText: {
    color: COLORS.text,
    fontWeight: '700',
  },
  error: {
    color: '#ff6b6b',
    marginTop: 12,
    fontWeight: '600',
  },
});