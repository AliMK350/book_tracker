import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, PADDING } from '../../utils/constants';
import { Button } from '../../components/Button';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    booksRead: 0,
    booksReading: 0,
    favoriteCount: 0,
    totalPagesRead: 0,
  });

  useEffect(() => {
    // TODO: Fetch user statistics
  }, [user]);

  const handleLogout = async () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr ?',
      [
        { text: 'Annuler', onPress: () => {} },
        {
          text: 'Déconnexion',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert('Erreur', 'Erreur lors de la déconnexion');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="always">
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </Text>
        </View>
        <Text style={styles.name}>{user?.name || 'Utilisateur'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.booksRead}</Text>
          <Text style={styles.statLabel}>Livres lus</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.booksReading}</Text>
          <Text style={styles.statLabel}>En cours</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.favoriteCount}</Text>
          <Text style={styles.statLabel}>Favoris</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Paramètres</Text>

        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => router.push('/notifications')}
        >
          <View style={styles.settingLeft}>
            <Ionicons name="notifications" size={20} color={COLORS.primary} />
            <Text style={styles.settingText}>Notifications</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textTertiary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="moon" size={20} color={COLORS.primary} />
            <Text style={styles.settingText}>Thème</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textTertiary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="information-circle" size={20} color={COLORS.primary} />
            <Text style={styles.settingText}>À propos</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textTertiary} />
        </TouchableOpacity>
      </View>

      <Button
        label="Déconnexion"
        onPress={handleLogout}
        variant="danger"
        style={styles.logoutButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  header: {
    alignItems: 'center',
    paddingVertical: PADDING.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.darkMedium,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: PADDING.md,
  },
  avatarText: {
    fontSize: 32,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 20,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: COLORS.textTertiary,
    marginTop: PADDING.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: PADDING.lg,
    paddingVertical: PADDING.lg,
    gap: PADDING.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.darkMedium,
    borderRadius: 12,
    padding: PADDING.md,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textTertiary,
    marginTop: PADDING.sm,
  },
  section: {
    paddingHorizontal: PADDING.lg,
    marginVertical: PADDING.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: PADDING.md,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: PADDING.md,
    paddingHorizontal: PADDING.md,
    backgroundColor: COLORS.darkMedium,
    borderRadius: 12,
    marginBottom: PADDING.md,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: PADDING.md,
  },
  settingText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  logoutButton: {
    marginHorizontal: PADDING.lg,
    marginBottom: PADDING.xl,
  },
});
