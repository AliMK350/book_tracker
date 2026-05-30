import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { useBooks } from '../../hooks/useBooks';
import { COLORS, PADDING, BORDER_RADIUS } from '../../utils/constants';
import { Button } from '../../components/Button';
import { BookCard } from '../../components/BookCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { myBooks, fetchMyBooks } = useBooks();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadBooks();
  }, [user]);

  const loadBooks = async () => {
    try {
      if (user) {
        await fetchMyBooks(user.id, '');
      }
    } catch (error) {
      console.error('Failed to load books', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBooks();
    setRefreshing(false);
  };

  const booksInProgress = myBooks.filter(b => b.status === 'reading').slice(0, 5);

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            <Text style={styles.greeting}>
              Bienvenue, {user?.name?.split(' ')[0]}! 👋
            </Text>

            <TouchableOpacity
              style={styles.searchBanner}
              onPress={() => router.push('/search')}
            >
              <Text style={styles.searchBannerText}>🔍 Chercher un livre...</Text>
            </TouchableOpacity>

            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{myBooks.length}</Text>
                <Text style={styles.statLabel}>Livres</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{booksInProgress.length}</Text>
                <Text style={styles.statLabel}>En cours</Text>
              </View>
            </View>

            {booksInProgress.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>📖 Continuer la lecture</Text>
              </>
            )}
          </>
        }
        data={booksInProgress}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BookCard
            book={item}
            showProgress
            onPress={() => router.push(`/book/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          myBooks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>📚 Aucun livre en cours</Text>
              <Button
                label="Ajouter mon premier livre"
                onPress={() => router.push('/search')}
                style={styles.emptyButton}
              />
            </View>
          ) : null
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  listContent: {
    paddingHorizontal: PADDING.lg,
    paddingTop: PADDING.lg,
    paddingBottom: PADDING.xl,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: PADDING.lg,
  },
  searchBanner: {
    backgroundColor: COLORS.darkMedium,
    borderRadius: BORDER_RADIUS.lg,
    padding: PADDING.lg,
    marginBottom: PADDING.lg,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  searchBannerText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: PADDING.md,
    marginBottom: PADDING.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.darkMedium,
    borderRadius: BORDER_RADIUS.lg,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: PADDING.md,
    marginTop: PADDING.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    marginBottom: PADDING.lg,
    textAlign: 'center',
  },
  emptyButton: {
    width: '80%',
  },
});
