import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, RefreshControl, Animated,
  ScrollView, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { useBooks } from '../../hooks/useBooks';
import { COLORS, PADDING, BORDER_RADIUS, FONT_SIZE } from '../../utils/constants';
import { BookCard } from '../../components/BookCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';

const FILTERS = [
  { key: 'all',       label: 'Tous',      icon: 'layers',          color: COLORS.textPrimary },
  { key: 'reading',   label: 'En cours',  icon: 'book',            color: COLORS.reading },
  { key: 'to-read',   label: 'À lire',    icon: 'time-outline',    color: COLORS.toRead },
  { key: 'completed', label: 'Terminés',  icon: 'checkmark-circle',color: COLORS.completed },
];

/**
 * FIX: The original bug was that the empty-state conditional
 * *replaced* the FlatList entirely — meaning when a filter was
 * selected and produced 0 results, the FlatList unmounted and
 * the filter bar was also hidden inside the FlatList header.
 * Fixed by: always rendering FlatList (with ListEmptyComponent),
 * and computing filteredBooks with a stable useMemo-like pattern.
 */
export default function LibraryScreen() {
  const router = useRouter();
  const { user, token } = useAuth();
  const { myBooks, fetchMyBooks, loadingBooks, toggleFavorite } = useBooks();
  const [filter, setFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const filterAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(filterAnim, { toValue: 1, duration: 500, useNativeDriver: false }).start();
    if (user && token) loadBooks();
  }, [user, token]);

  const loadBooks = async () => {
    try { await fetchMyBooks(user.id, token); }
    catch (e) { console.error('Failed to load books', e); }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBooks();
    setRefreshing(false);
  };

  // FIX: Stable, correct filter — normalize status to lowercase & trim for safety
  const filteredBooks = myBooks.filter(book => {
    if (filter === 'all') return true;
    const status = (book.status || '').toLowerCase().trim();
    return status === filter;
  });

  const countFor = (key) => {
    if (key === 'all') return myBooks.length;
    return myBooks.filter(b => (b.status || '').toLowerCase().trim() === key).length;
  };

  if (loadingBooks && myBooks.length === 0) {
    return <LoadingSpinner message="Chargement de votre bibliothèque..." />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View style={[styles.header, {
        opacity: filterAnim,
        transform: [{ translateY: filterAnim.interpolate({ inputRange: [0,1], outputRange: [-10,0] }) }],
      }]}>
        <View>
          <Text style={styles.headerSub}>MES LECTURES</Text>
          <Text style={styles.headerTitle}>Bibliothèque</Text>
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{myBooks.length}</Text>
        </View>
      </Animated.View>

      {/* Filter pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
        style={styles.filterScrollView}
      >
        {FILTERS.map((f, i) => {
          const isActive = filter === f.key;
          const count = countFor(f.key);
          return (
            <TouchableOpacity
              key={f.key}
              style={[
                styles.filterPill,
                isActive && [styles.filterPillActive, { borderColor: f.color }],
              ]}
              onPress={() => setFilter(f.key)}
              activeOpacity={0.75}
            >
              <Ionicons
                name={f.icon}
                size={13}
                color={isActive ? f.color : COLORS.textMuted}
              />
              <Text style={[
                styles.filterPillText,
                isActive && [styles.filterPillTextActive, { color: f.color }],
              ]}>
                {f.label}
              </Text>
              {count > 0 && (
                <View style={[
                  styles.filterCount,
                  isActive && { backgroundColor: f.color + '33' },
                ]}>
                  <Text style={[
                    styles.filterCountText,
                    isActive && { color: f.color },
                  ]}>
                    {count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Books list — always rendered to preserve filter bar */}
      <FlatList
        data={filteredBooks}
        keyExtractor={item => item._id || item.id || Math.random().toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.gold} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>
              {filter === 'reading' ? '📖' : filter === 'completed' ? '🏆' : filter === 'to-read' ? '🗂️' : '📚'}
            </Text>
            <Text style={styles.emptyTitle}>
              {filter === 'all' ? 'Votre bibliothèque est vide' : `Aucun livre « ${FILTERS.find(f => f.key === filter)?.label} »`}
            </Text>
            <Text style={styles.emptyText}>
              {filter === 'all'
                ? 'Commencez par ajouter un livre depuis la recherche.'
                : 'Les livres avec ce statut apparaîtront ici.'}
            </Text>
            {filter === 'all' && (
              <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/search')}>
                <Ionicons name="add" size={16} color={COLORS.textInverse} />
                <Text style={styles.emptyBtnText}>Ajouter un livre</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        renderItem={({ item }) => {
          const bookId = item._id || item.id || item.googleBooksId;
          return (
            <BookCard
              book={item}
              showProgress
              onPress={() => router.push({ pathname: '/book/[id]', params: { id: bookId } })}
              onFavorite={() => toggleFavorite(item._id || item.id, token)}
            />
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: PADDING.lg,
    paddingTop: PADDING.xl,
    paddingBottom: PADDING.md,
  },
  headerSub: {
    fontSize: 10,
    color: COLORS.gold,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '700',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  headerBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.gold + '22',
    borderWidth: 1,
    borderColor: COLORS.gold + '44',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBadgeText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '900',
    color: COLORS.gold,
  },
  filterScrollView: {
    flexGrow: 0,
    marginBottom: PADDING.md,
  },
  filterScroll: {
    paddingHorizontal: PADDING.lg,
    gap: PADDING.sm,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: PADDING.md,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  filterPillActive: {
    backgroundColor: COLORS.surfaceHigh,
    borderWidth: 1.5,
  },
  filterPillText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  filterPillTextActive: {
    fontWeight: '800',
  },
  filterCount: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceHigh,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  filterCountText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  listContent: {
    paddingHorizontal: PADDING.lg,
    paddingBottom: 100,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: PADDING.xxl,
    paddingHorizontal: PADDING.xl,
  },
  emptyEmoji: { fontSize: 52, marginBottom: PADDING.md },
  emptyTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: PADDING.sm,
  },
  emptyText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: PADDING.lg,
  },
  emptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.gold,
    paddingVertical: 12,
    paddingHorizontal: PADDING.xl,
    borderRadius: BORDER_RADIUS.full,
  },
  emptyBtnText: {
    color: COLORS.textInverse,
    fontWeight: '800',
    fontSize: FONT_SIZE.md,
  },
});
