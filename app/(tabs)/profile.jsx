import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { useBooks } from '../../hooks/useBooks';
import { COLORS, PADDING, BORDER_RADIUS, FONT_SIZE } from '../../utils/constants';

function SettingRow({ icon, iconColor, label, subtitle, onPress, rightContent }) {
  return (
    <TouchableOpacity style={styles.settingRow} onPress={onPress} activeOpacity={0.75}>
      <View style={[styles.settingIcon, { backgroundColor: iconColor + '22' }]}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <View style={styles.settingText}>
        <Text style={styles.settingLabel}>{label}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {rightContent || <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { myBooks } = useBooks();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: false }).start();
  }, []);

  const booksRead = myBooks.filter(b => b.status === 'completed').length;
  const booksReading = myBooks.filter(b => b.status === 'reading').length;
  const booksToRead = myBooks.filter(b => b.status === 'to-read').length;
  const favorites = myBooks.filter(b => b.isFavorite).length;
  const totalPages = myBooks.reduce((s, b) => s + (b.pagesRead || 0), 0);

  const initial = user?.name?.[0]?.toUpperCase() || 'L';

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            try { await logout(); }
            catch { Alert.alert('Erreur', 'Erreur lors de la déconnexion'); }
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Avatar & name */}
      <Animated.View style={[styles.heroSection, { opacity: fadeAnim }]}>
        <View style={styles.avatarRing}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
        </View>
        <Text style={styles.userName}>{user?.name || 'Lecteur'}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        <View style={styles.memberBadge}>
          <Ionicons name="star" size={12} color={COLORS.gold} />
          <Text style={styles.memberBadgeText}>Lecteur passionné</Text>
        </View>
      </Animated.View>

      {/* Stats grid */}
      <View style={styles.statsGrid}>
        {[
          { value: booksRead,    label: 'Lus',       icon: 'checkmark-circle', color: COLORS.completed },
          { value: booksReading, label: 'En cours',  icon: 'book',             color: COLORS.reading },
          { value: booksToRead,  label: 'À lire',    icon: 'time-outline',     color: COLORS.toRead },
          { value: favorites,    label: 'Favoris',   icon: 'heart',            color: COLORS.favorite },
        ].map((stat, i) => (
          <View key={i} style={styles.statCard}>
            <Ionicons name={stat.icon} size={18} color={stat.color} />
            <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Pages read banner */}
      {totalPages > 0 && (
        <View style={styles.pagesBanner}>
          <Ionicons name="document-text" size={20} color={COLORS.gold} />
          <View style={styles.pagesText}>
            <Text style={styles.pagesValue}>{totalPages.toLocaleString('fr-FR')}</Text>
            <Text style={styles.pagesLabel}>pages lues au total</Text>
          </View>
          <Ionicons name="trending-up" size={20} color={COLORS.completed} />
        </View>
      )}

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Paramètres</Text>
        <View style={styles.card}>
          <SettingRow
            icon="notifications"
            iconColor={COLORS.gold}
            label="Notifications"
            subtitle="Rappels de lecture"
            onPress={() => router.push('/notifications')}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="moon"
            iconColor={COLORS.toRead}
            label="Thème"
            subtitle="Sombre"
          />
          <View style={styles.divider} />
          <SettingRow
            icon="information-circle"
            iconColor={COLORS.teal}
            label="À propos"
            subtitle="Version 1.0.0"
          />
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
        <Ionicons name="log-out-outline" size={18} color={COLORS.danger} />
        <Text style={styles.logoutText}>Déconnexion</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const teal = '#5ABFB0';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    paddingBottom: 120,
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: PADDING.xl,
    paddingBottom: PADDING.lg,
  },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: COLORS.gold + '66',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: PADDING.md,
  },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.gold,
  },
  avatarText: {
    fontSize: 34,
    fontWeight: '900',
    color: COLORS.gold,
  },
  userName: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: PADDING.sm,
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: COLORS.gold + '22',
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.gold + '44',
  },
  memberBadgeText: {
    fontSize: 11,
    color: COLORS.gold,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: PADDING.lg,
    gap: PADDING.sm,
    marginBottom: PADDING.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: PADDING.md,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  statValue: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  pagesBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: PADDING.md,
    marginHorizontal: PADDING.lg,
    marginBottom: PADDING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: PADDING.md,
    borderWidth: 1,
    borderColor: COLORS.gold + '33',
  },
  pagesText: { flex: 1 },
  pagesValue: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  pagesLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
  },
  section: {
    paddingHorizontal: PADDING.lg,
    marginBottom: PADDING.lg,
  },
  sectionTitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontWeight: '700',
    marginBottom: PADDING.sm,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: PADDING.md,
    padding: PADDING.md,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingText: { flex: 1 },
  settingLabel: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  settingSubtitle: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.surfaceBorder,
    marginLeft: PADDING.lg + 36 + PADDING.md,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: PADDING.sm,
    marginHorizontal: PADDING.lg,
    paddingVertical: 15,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.danger + '44',
  },
  logoutText: {
    color: COLORS.danger,
    fontWeight: '700',
    fontSize: FONT_SIZE.md,
  },
});
