import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { useBooks } from '../../hooks/useBooks';
import { COLORS, PADDING } from '../../utils/constants';
import { Button } from '../../components/Button';
import { BookCard } from '../../components/BookCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export default function LibraryScreen() {
  const router = useRouter();
  const { user, token } = useAuth();
  const { myBooks, fetchMyBooks, loadingBooks, removeBook, toggleFavorite } = useBooks();
  const [filter, setFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user && token) {
      loadBooks();
    }
  }, [user, token]);

  const loadBooks = async () => {
    try {
      await fetchMyBooks(user.id, token);
    } catch (error) {
      console.error('Failed to load books', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBooks();
    setRefreshing(false);
  };

  const filteredBooks = myBooks.filter(book => {
    if (filter === 'reading') return book.status === 'reading';
    if (filter === 'completed') return book.status === 'completed';
    if (filter === 'to-read') return book.status === 'to-read';
    return true;
  });

  if (loadingBooks && myBooks.length === 0) {
    return <LoadingSpinner message="Chargement de votre bibliothèque..." />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📚 Ma Bibliothèque</Text>

      <View style={styles.filterContainer}>
        {['all', 'to-read', 'reading', 'completed'].map(status => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterBtn,
              filter === status && styles.filterBtnActive
            ]}
            onPress={() => setFilter(status)}
          >
            <Text style={[
              styles.filterText,
              filter === status && styles.filterTextActive
            ]}>
              {status === 'all' ? 'Tous' : status === 'to-read' ? 'À lire' : status === 'reading' ? 'En cours' : 'Terminés'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredBooks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucun livre dans cette catégorie</Text>
          <Button
            label="Ajouter un livre"
            onPress={() => router.push('/search')}
            style={styles.addButton}
          />
        </View>
      ) : (
        <FlatList
          data={filteredBooks}
          keyExtractor={(item) => item._id || item.id}
          renderItem={({ item }) => {
            const bookId = item._id || item.id || item.googleBooksId;
            const favoriteId = item._id || item.id;
            return (
              <BookCard
                book={item}
                showProgress
                onPress={() => router.push(`/book/${bookId}`)}
                onFavorite={() => toggleFavorite(favoriteId, token)}
              />
            );
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
    paddingTop: PADDING.lg,
  },
  title: {
    fontSize: 26,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    paddingHorizontal: PADDING.lg,
    marginBottom: PADDING.md,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: PADDING.lg,
    marginBottom: PADDING.md,
    gap: PADDING.sm,
  },
  filterBtn: {
    paddingHorizontal: PADDING.md,
    paddingVertical: PADDING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.darkMedium,
  },
  filterBtnActive: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  filterTextActive: {
    color: COLORS.textPrimary,
  },
  listContent: {
    paddingHorizontal: PADDING.lg,
    paddingBottom: PADDING.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: PADDING.lg,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    marginBottom: PADDING.lg,
  },
  addButton: {
    width: '100%',
  },
});
