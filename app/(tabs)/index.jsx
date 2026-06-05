import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, RefreshControl, Animated,
  Dimensions, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../hooks/useAuth';
import { useBooks } from '../../hooks/useBooks';
import { COLORS, PADDING, BORDER_RADIUS, FONT_SIZE } from '../../utils/constants';
import { BookCard } from '../../components/BookCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';

const { width } = Dimensions.get('window');

function StatCard({ value, label, icon, color, delay = 0 }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1, duration: 500, delay, useNativeDriver: false,
    }).start();
  }, []);
  return (
    <Animated.View style={[styles.statCard, { opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0,1], outputRange: [12,0] }) }] }]}>
      <View style={[styles.statIconCircle, { backgroundColor: color + '22' }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { user, token } = useAuth();
  const { myBooks, fetchMyBooks, toggleFavorite, loadingBooks } = useBooks();
  const [refreshing, setRefreshing] = useState(false);
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerAnim, { toValue: 1, duration: 600, useNativeDriver: false }).start();
    if (user) loadBooks();
  }, [user]);

  const loadBooks = async () => {
    try { await fetchMyBooks(user.id, token); }
    catch (e) { console.error(e); }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBooks();
    setRefreshing(false);
  };

  const booksReading = myBooks.filter(b => b.status === 'reading');
  const booksCompleted = myBooks.filter(b => b.status === 'completed');
  const booksFavorite = myBooks.filter(b => b.isFavorite);
  const recentBooks = [...booksReading].slice(0, 5);

  const firstName = user?.name?.split(' ')[0] || 'Lecteur';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bonsoir' : 'Bonne soirée';

  if (loadingBooks && myBooks.length === 0) {
    return <LoadingSpinner message="Chargement de votre bibliothèque..." />;
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.listContent}
      data={recentBooks}
      keyExtractor={item => item._id || item.id}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={COLORS.gold}
        />
      }
      ListHeaderComponent={
        <>
          {/* Hero header */}
          <Animated.View style={[styles.heroSection, {
            opacity: headerAnim,
            transform: [{ translateY: headerAnim.interpolate({ inputRange: [0,1], outputRange: [-20,0] }) }]
          }]}>
            <View style={styles.greetingRow}>
              <View>
                <Text style={styles.greetingSmall}>{greeting},</Text>
                <Text style={styles.greetingName}>{firstName} ✦</Text>
              </View>
              <TouchableOpacity
                style={styles.notifBadge}
                onPress={() => router.push('/notifications')}
              >
                <Ionicons name="notifications" size={18} color={COLORS.gold} />
                <View style={styles.notifDot} />
              </TouchableOpacity>
            </View>

            {/* Search bar */}
            <TouchableOpacity
              style={styles.searchBar}
              onPress={() => router.push('/search')}
              activeOpacity={0.85}
            >
              <Ionicons name="search" size={18} color={COLORS.textMuted} />
              <Text style={styles.searchPlaceholder}>Chercher un livre ou un auteur…</Text>
              <View style={styles.searchKbd}>
                <Ionicons name="options-outline" size={14} color={COLORS.gold} />
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <StatCard value={myBooks.length}       label="Livres"    icon="library"          color={COLORS.gold}      delay={100} />
            <StatCard value={booksReading.length}  label="En cours"  icon="book"             color={COLORS.reading}   delay={200} />
            <StatCard value={booksCompleted.length} label="Terminés" icon="checkmark-circle" color={COLORS.completed} delay={300} />
            <StatCard value={booksFavorite.length} label="Favoris"   icon="heart"            color={COLORS.favorite}  delay={400} />
          </View>

          {/* Discover banner */}
          <TouchableOpacity
            style={styles.discoverBanner}
            onPress={() => router.push('/search')}
            activeOpacity={0.88}
          >
            <View style={styles.discoverText}>
              <Text style={styles.discoverTitle}>Découvrir de nouveaux livres</Text>
              <Text style={styles.discoverSub}>Explorez des milliers de titres →</Text>
            </View>
            <Ionicons name="compass" size={36} color={COLORS.gold} style={{ opacity: 0.7 }} />
          </TouchableOpacity>

          {/* Section: in progress */}
          {recentBooks.length > 0 ? (
            <View style={styles.sectionHeader}>
              <View style={styles.sectionDot} />
              <Text style={styles.sectionTitle}>Continuer la lecture</Text>
              <Text style={styles.sectionCount}>{recentBooks.length}</Text>
            </View>
          ) : (
            <View style={styles.emptyHero}>
              <Text style={styles.emptyEmoji}>📚</Text>
              <Text style={styles.emptyTitle}>Votre bibliothèque vous attend</Text>
              <Text style={styles.emptySub}>Cherchez votre premier livre et commencez votre aventure littéraire.</Text>
              <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/search')}>
                <Text style={styles.emptyBtnText}>Ajouter un livre</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      }
      renderItem={({ item }) => {
        const navId = item._id || item.id || item.googleBooksId;
        return (
          <BookCard
            book={item}
            showProgress
            onPress={() => router.push({ pathname: '/book/[id]', params: { id: navId } })}
            onFavorite={() => toggleFavorite(item._id || item.id, token)}
          />
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  listContent: {
    paddingBottom: 100,
  },
  heroSection: {
    paddingHorizontal: PADDING.lg,
    paddingTop: PADDING.xl,
    paddingBottom: PADDING.md,
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: PADDING.lg,
  },
  greetingSmall: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  greetingName: {
    fontSize: 30,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
    marginTop: 2,
  },
  notifBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.crimson,
    borderWidth: 1.5,
    borderColor: COLORS.bg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: PADDING.md,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    gap: PADDING.sm,
  },
  searchPlaceholder: {
    flex: 1,
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.sm,
  },
  searchKbd: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
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
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    gap: 4,
  },
  statIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
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
  discoverBanner: {
    marginHorizontal: PADDING.lg,
    marginBottom: PADDING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: PADDING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.gold + '44',
  },
  discoverText: { flex: 1 },
  discoverTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  discoverSub: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gold,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: PADDING.lg,
    marginBottom: PADDING.md,
    gap: PADDING.sm,
  },
  sectionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.gold,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
    color: COLORS.textPrimary,
    flex: 1,
    letterSpacing: -0.2,
  },
  sectionCount: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
    backgroundColor: COLORS.surfaceHigh,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  emptyHero: {
    alignItems: 'center',
    paddingVertical: PADDING.xxl,
    paddingHorizontal: PADDING.xl,
  },
  emptyEmoji: { fontSize: 56, marginBottom: PADDING.md },
  emptyTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: PADDING.sm,
  },
  emptySub: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: PADDING.lg,
  },
  emptyBtn: {
    backgroundColor: COLORS.gold,
    paddingVertical: PADDING.md,
    paddingHorizontal: PADDING.xl,
    borderRadius: BORDER_RADIUS.full,
  },
  emptyBtnText: {
    color: COLORS.textInverse,
    fontWeight: '800',
    fontSize: FONT_SIZE.md,
  },
});
