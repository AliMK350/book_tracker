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
import { validateEmail, validatePassword, validateName } from '../../utils/validation';
import { COLORS, PADDING } from '../../utils/constants';
import { Button } from '../../components/Button';
import { useRouter } from 'expo-router';

export default function SignupScreen() {
  const router = useRouter();
  const { signup, user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (user) {
      router.replace('/');
    }
  }, [user, router]);

  const handleSignup = async () => {
    if (!validateName(name)) {
      Alert.alert('Erreur', 'Nom invalide (min 2 caractères)');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Erreur', 'Email invalide');
      return;
    }
    if (!validatePassword(password)) {
      Alert.alert('Erreur', 'Mot de passe invalide (min 6 caractères)');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    try {
      setLoading(true);
      await signup(email, password, name);
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
        <Text style={styles.subtitle}>Créer un compte</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Nom complet</Text>
          <TextInput
            style={styles.input}
            placeholder="Votre nom"
            placeholderTextColor={COLORS.textTertiary}
            value={name}
            onChangeText={setName}
            editable={!loading}
          />

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

          <Text style={styles.label}>Confirmer le mot de passe</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirmer votre mot de passe"
            placeholderTextColor={COLORS.textTertiary}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            editable={!loading}
          />

          <Button
            label="S'inscrire"
            onPress={handleSignup}
            loading={loading}
            style={styles.button}
          />

          <TouchableOpacity
            onPress={() => router.push('/(auth)/login')}
            disabled={loading}
          >
            <Text style={styles.link}>
              Déjà inscrit ? <Text style={styles.linkBold}>Se connecter</Text>
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
    backgroundColor: COLORS.surface,
  },
  content: {
    padding: PADDING.lg,
    justifyContent: 'center',
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
    backgroundColor: COLORS.card,
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
