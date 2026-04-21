import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { saveOrUpdateUser, saveCurrentUser, generateUserId } from '../utils/storage';
import { COLORS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function Registration() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim()) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Por favor, informe um e-mail válido.');
      return;
    }

    try {
      setError('');
      setIsSubmitting(true);

      const userData = {
        name: name.trim(),
        email: email.trim(),
      };

      const registeredUser = await saveOrUpdateUser(userData);

      const currentUser = {
        ...registeredUser,
        userId: registeredUser.id || generateUserId(),
      };

      await saveCurrentUser(currentUser);

      setShowSuccess(true);

      setTimeout(() => {
        router.push('/race');
      }, 1500);
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível continuar.');
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBlock}>
        <View style={styles.iconCircle}>
          <Ionicons name="flag-outline" size={36} color={COLORS.text} />
        </View>

        <Text style={styles.title}>Piloto, identifique-se!</Text>
        <Text style={styles.subtitle}>
          Entre com seus dados para começar a acumular pontos.
        </Text>
      </View>

      <View style={styles.card}>
        {showSuccess ? (
          <View style={styles.successContainer}>
            <View style={styles.successCircle}>
              <Ionicons name="person-outline" size={28} color={COLORS.text} />
            </View>

            <Text style={styles.successTitle}>Bem-vindo de volta!</Text>
            <Text style={styles.successText}>Sincronizando seus pontos...</Text>
          </View>
        ) : (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome Completo</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Ex: Ayrton Senna"
                placeholderTextColor={COLORS.muted}
                style={styles.input}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-mail</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="seu@email.com"
                placeholderTextColor={COLORS.muted}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>

            {error ? <Text style={styles.errorBox}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.button, isSubmitting && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.buttonText}>
                {isSubmitting ? 'Acelerando...' : 'Entrar no Cockpit'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 50,
    justifyContent: 'center',
  },
  topBlock: {
    alignItems: 'center',
    marginBottom: 28,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  iconText: {
    fontSize: 36,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.muted,
    textAlign: 'center',
    lineHeight: 22,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  successCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successIcon: {
    fontSize: 28,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
  },
  successText: {
    fontSize: 14,
    color: COLORS.muted,
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#23232b',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: COLORS.text,
    fontSize: 15,
  },
  errorBox: {
    backgroundColor: 'rgba(255, 0, 0, 0.15)',
    borderWidth: 1,
    borderColor: '#ff4d4f',
    color: '#ffd6d6',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 13,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: COLORS.text,
    fontWeight: '800',
    fontSize: 15,
  },
});