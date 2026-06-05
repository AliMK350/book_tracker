import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, ScrollView, Animated,
  TextInput, Keyboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useBooks } from '../../hooks/useBooks';
import { COLORS, PADDING, BORDER_RADIUS, FONT_SIZE } from '../../utils/constants';
import { BookCard } from '../../components/BookCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';

const GENRES = [
  { key: '',              label: 'Tous',         emoji: '✦' },
  { key: 'Fiction',       label: 'Fiction',      emoji: '🌀' },
  { key: 'Fantastique',   label: 'Fantastique',  emoji: '🧙' },
  { key: 'Science-fiction',label: 'Sci-Fi',      emoji: '🚀' },
  { key: 'Dystopie',      label: 'Dystopie',     emoji: '🏚️' },
  { key: 'Classique',     label: 'Classique',    emoji: '📜' },
  { key: 'Historique',    label: 'Historique',   emoji: '🏛️' },
  { key: 'Romance',       label: 'Romance',      emoji: '🌹' },
  { key: 'Science',       label: 'Science',      emoji: '🔬' },
];

export default function SearchScreen() {
  const router = useRouter();
  const { searchBooks, searchResults, loadingBooks, error } = useBooks();
  const [query, setQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerAnim, { toValue: 1, duration: 500, useNativeDriver: false }).start();
    searchBooks('bestseller', '');
  }, []);

  const handleSearch = (text) => {
    setQuery(text);
    if (text.length > 2) searchBooks(text, selectedGenre);
    else if (text.length === 0) searchBooks('bestseller', selectedGenre);
  };

  const handleSelectGenre = (genreKey) => {
    setSelectedGenre(genreKey);
    const q = query.length > 2 ? query : 'bestseller';
    searchBooks(q, genreKey);
    Keyboard.dismiss();
  };

  const clearQuery = () => {
    setQuery('');
    searchBooks('bestseller', selectedGenre);
    inputRef.current?.focus();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View style={[styles.header, {
        opacity: headerAnim,
        transform: [{ translateY: headerAnim.interpolate({ inputRange: [0,1], outputRange: [-12,0] }) }],
      }]}>
        <Text style={styles.headerSub}>EXPLORER</Text>
        <Text style={styles.headerTitle}>Découvrir</Text>
      </Animated.View>

      {/* Search input */}
      <View style={[styles.searchWrapper, focused && styles.searchWrapperFocused]}>
        <Ionicons name="search" size={18} color={focused ? COLORS.gold : COLORS.textMuted} />
        <TextInput
          ref={inputRef}
          style={styles.searchInput}
          value={query}
          onChangeText={handleSearch}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Titre, auteur, genre…"
          placeholderTextColor={COLORS.textMuted}
          returnKeyType="search"
          clearButtonMode="never"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={clearQuery} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Genre chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.genreScroll}
        style={styles.genreScrollView}
      >
        {GENRES.map(g => {
          const active = selectedGenre === g.key;
          return (
            <TouchableOpacity
              key={g.key || 'all'}
              style={[styles.genreChip, active && styles.genreChipActive]}
              onPress={() => handleSelectGenre(g.key)}
              activeOpacity={0.75}
            >
              <Text style={styles.genreEmoji}>{g.emoji}</Text>
              <Text style={[styles.genreLabel, active && styles.genreLabelActive]}>{g.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Results */}
      {error ? (
        <View style={styles.errorBox}>
          <Ionicons name="wifi-outline" size={20} color={COLORS.danger} />
          <Text style={styles.errorText}>Vérifiez votre connexion internet.</Text>
        </View>
      ) : null}

      <View style={styles.resultMeta}>
        <View style={styles.sectionDot} />
        <Text style={styles.resultLabel}>
          {query.length > 2
            ? `${searchResults.length} résultat${searchResults.length !== 1 ? 's' : ''} · « ${query} »`
            : 'Recommandés pour vous'}
        </Text>
      </View>

      {loadingBooks && query.length > 0 ? (
        <LoadingSpinner message="Recherche en cours..." />
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={item => item.id || item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <BookCard
              book={item}
              onPress={() => router.push({ pathname: '/book/[id]', params: { id: item.id } })}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyTitle}>Aucun résultat trouvé</Text>
              <Text style={styles.emptyText}>Essayez un autre titre, auteur ou genre.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
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
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: PADDING.lg,
    marginBottom: PADDING.md,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: PADDING.md,
    paddingVertical: 14,
    gap: PADDING.sm,
    borderWidth: 1.5,
    borderColor: COLORS.surfaceBorder,
  },
  searchWrapperFocused: {
    borderColor: COLORS.gold,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    padding: 0,
  },
  genreScrollView: {
    flexGrow: 0,
    marginBottom: PADDING.sm,
  },
  genreScroll: {
    paddingHorizontal: PADDING.lg,
    gap: PADDING.sm,
  },
  genreChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: PADDING.md,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  genreChipActive: {
    backgroundColor: COLORS.gold + '22',
    borderColor: COLORS.gold,
  },
  genreEmoji: { fontSize: 14 },
  genreLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  genreLabelActive: {
    color: COLORS.gold,
    fontWeight: '800',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: PADDING.sm,
    marginHorizontal: PADDING.lg,
    backgroundColor: COLORS.danger + '22',
    borderRadius: BORDER_RADIUS.md,
    padding: PADDING.md,
    marginBottom: PADDING.md,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: FONT_SIZE.sm,
  },
  resultMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: PADDING.lg,
    marginBottom: PADDING.md,
    gap: PADDING.sm,
  },
  sectionDot: {
    width: 6, height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.gold,
  },
  resultLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: PADDING.lg,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: PADDING.xxl,
  },
  emptyEmoji: { fontSize: 48, marginBottom: PADDING.md },
  emptyTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: PADDING.sm,
  },
  emptyText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
