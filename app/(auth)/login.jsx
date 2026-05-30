import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail, validatePassword } from '../../utils/validation';
import { COLORS, PADDING } from '../../utils/constants';
import { Button } from '../../components/Button';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (user) {
      router.replace('/');
    }
  }, [user, router]);

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Erreur', 'Email invalide');
      return;
    }
    if (!validatePassword(password)) {
      Alert.alert('Erreur', 'Mot de passe invalide (min 6 caractères)');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      router.replace('/');
    } catch (error) {
      Alert.alert('Erreur', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="always">
      <View style={styles.content}>
        <Text style={styles.logo}>📚 Book Tracker</Text>
        <Text style={styles.subtitle}>Bienvenue !</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="votre@email.com"
            placeholderTextColor={COLORS.textTertiary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            editable={!loading}
          />

          <Text style={styles.label}>Mot de passe</Text>
          <TextInput
            style={styles.input}
            placeholder="Votre mot de passe"
            placeholderTextColor={COLORS.textTertiary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />

          <Button
            label="Se connecter"
            onPress={handleLogin}
            loading={loading}
            style={styles.button}
          />

          <TouchableOpacity
            onPress={() => router.push('/(auth)/signup')}
            disabled={loading}
          >
            <Text style={styles.link}>
              Pas encore inscrit ? <Text style={styles.linkBold}>S'inscrire</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  content: {
    padding: PADDING.lg,
    justifyContent: 'center',
    minHeight: '100%',
  },
  logo: {
    fontSize: 40,
    textAlign: 'center',
    marginBottom: PADDING.md,
  },
  subtitle: {
    fontSize: 24,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: PADDING.xl,
  },
  form: {
    marginTop: PADDING.xl,
  },
  label: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: PADDING.sm,
  },
  input: {
    backgroundColor: COLORS.darkMedium,
    color: COLORS.textPrimary,
    paddingHorizontal: PADDING.md,
    paddingVertical: PADDING.md,
    borderRadius: 12,
    marginBottom: PADDING.lg,
    fontSize: 14,
  },
  button: {
    marginTop: PADDING.md,
  },
  link: {
    textAlign: 'center',
    color: COLORS.textTertiary,
    marginTop: PADDING.lg,
    fontSize: 14,
  },
  linkBold: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});
