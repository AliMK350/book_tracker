import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useBooks } from '../../hooks/useBooks';
import { COLORS, PADDING } from '../../utils/constants';
import { SearchInput } from '../../components/SearchInput';
import { BookCard } from '../../components/BookCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export default function SearchScreen() {
  const router = useRouter();
  const { searchBooks, searchResults, loadingBooks, error } = useBooks();
  const [query, setQuery] = useState('');

  useEffect(() => {
    searchBooks('fiction');
  }, []);

  const handleSearch = (text) => {
    setQuery(text);
    if (text.length > 2) {
      searchBooks(text);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔍 Rechercher</Text>

      <SearchInput
        value={query}
        onChangeText={handleSearch}
        placeholder="Chercher un livre..."
        style={styles.searchInput}
      />

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Impossible de charger les livres. Vérifiez votre connexion.</Text>
        </View>
      ) : null}

      {loadingBooks && query.length > 2 ? (
        <LoadingSpinner message="Recherche en cours..." />
      ) : (
        <>
          {query.length > 2 ? (
            <Text style={styles.resultText}>
              {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''}
            </Text>
          ) : (
            <Text style={styles.resultText}>
              Résultats recommandés
            </Text>
          )}

          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <BookCard
                book={item}
                onPress={() => router.push(`/book/${item.id}`)}
              />
            )}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              query.length > 2 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Aucun livre trouvé</Text>
                </View>
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Tapez au moins 3 caractères pour chercher</Text>
                </View>
              )
            }
          />
        </>
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
  searchInput: {
    marginHorizontal: PADDING.lg,
    marginBottom: PADDING.md,
  },
  resultText: {
    color: COLORS.textTertiary,
    paddingHorizontal: PADDING.lg,
    marginBottom: PADDING.md,
    fontSize: 12,
  },
  listContent: {
    paddingHorizontal: PADDING.lg,
    paddingBottom: PADDING.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
  errorContainer: {
    paddingHorizontal: PADDING.lg,
    marginBottom: PADDING.md,
  },
  errorText: {
    color: '#f87171',
    fontSize: 14,
    textAlign: 'center',
  },
});
