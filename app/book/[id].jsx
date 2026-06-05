import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { useBooks } from '../../hooks/useBooks';
import { COLORS, PADDING, BORDER_RADIUS } from '../../utils/constants';
import { Button } from '../../components/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import * as booksService from '../../services/books';

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user, token } = useAuth();
  const { addBook, removeBook, myBooks, updateProgress, toggleFavorite, fetchMyBooks } = useBooks();
  const [book, setBook] = useState(null);
  const [libraryBook, setLibraryBook] = useState(null);
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Progress tracking
  const [pagesInput, setPagesInput] = useState('');

  // Reviews
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    loadBookDetails();
  }, [id]);

  useEffect(() => {
    const found = myBooks.find(
      b => b.googleBooksId === id || b._id === id || b.id === id
    );
    setIsInLibrary(!!found);
    setLibraryBook(found || null);
    if (found) {
      setPagesInput(String(found.pagesRead || 0));
    }
  }, [id, myBooks]);

  const loadBookDetails = async () => {
    try {
      setLoading(true);

      const found = myBooks.find(
        b => b.googleBooksId === id || b._id === id || b.id === id
      );
      const apiBookId = found?.googleBooksId || id;
      let bookData = null;

      try {
        bookData = await booksService.getBookDetails(apiBookId);
      } catch (error) {
        if (found) {
          bookData = found;
        } else {
          throw error;
        }
      }

      if (found) {
        bookData = {
          ...bookData,
          ...found,
          id: found._id || found.id || bookData.id,
          googleBooksId: found.googleBooksId || bookData.googleBooksId,
        };
      }

      setBook(bookData);

      // Load reviews - use library book ID when available
      try {
        const reviewBookId = found?._id || found?.id || id;
        const reviewsData = await booksService.getReviews(reviewBookId);
        setReviews(reviewsData);
      } catch (e) {
        // Reviews may not exist yet
      }
    } catch (error) {
      console.error('Failed to load book details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToLibrary = async () => {
    try {
      if (!user?.id || !token) {
        console.log('[handleAddToLibrary] Missing auth', { user, tokenPresent: !!token });
        Alert.alert('Erreur', "Veuillez vous connecter pour ajouter à la bibliothèque.");
        return;
      }
      if (!book) {
        Alert.alert('Erreur', 'Livre introuvable');
        return;
      }

      setActionLoading(true);
      await addBook(book, user.id, token);


      Alert.alert('Succès', 'Livre ajouté à votre bibliothèque');

      // Re-sync library from backend (prevents UI state mismatch)
      try {
        await fetchMyBooks?.(user.id, token);
      } catch (e) {
        console.log('[handleAddToLibrary] fetchMyBooks failed', e);
      }
    } catch (error) {
      const msg = error?.message || String(error);
      console.error('[handleAddToLibrary] failed', error);
      Alert.alert('Erreur', msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveFromLibrary = async () => {
    Alert.alert(
      'Confirmer',
      'Retirer ce livre de votre bibliothèque ?',
      [
        { text: 'Annuler' },
        {
          text: 'Retirer',
          style: 'destructive',
          onPress: async () => {
            try {
              if (!user?.id || !token) {
                console.log('[handleRemoveFromLibrary] Missing auth', { user, tokenPresent: !!token });
                Alert.alert('Erreur', "Veuillez vous connecter.");
                return;
              }
              const targetId = libraryBook?._id || libraryBook?.id;
              if (!targetId) {
                Alert.alert('Erreur', 'Livre introuvable dans votre bibliothèque');
                return;
              }

              setActionLoading(true);
              await removeBook(targetId, user.id, token);
              Alert.alert('Succès', 'Livre retiré de votre bibliothèque');

              // Re-sync
              try {
                await fetchMyBooks?.(user.id, token);
              } catch (e) {
                console.log('[handleRemoveFromLibrary] fetchMyBooks failed', e);
              }
            } catch (error) {
              const msg = error?.message || String(error);
              console.error('[handleRemoveFromLibrary] failed', error);
              Alert.alert('Erreur', msg);
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleUpdateProgress = async () => {
    const pages = parseInt(pagesInput);
    if (isNaN(pages) || pages < 0) {
      Alert.alert('Erreur', 'Veuillez entrer un nombre valide');
      return;
    }
    const maxPages = libraryBook?.pageCount || book?.pageCount || 9999;
    if (pages > maxPages) {
      Alert.alert('Erreur', `Le maximum est ${maxPages} pages`);
      return;
    }
    try {
      setActionLoading(true);
      await updateProgress(libraryBook._id || libraryBook.id, pages, token);
      Alert.alert('Succès', 'Progression mise à jour !');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de mettre à jour la progression');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      if (!user?.id || !token) {
        console.log('[handleToggleFavorite] Missing auth', { user, tokenPresent: !!token });
        Alert.alert('Erreur', "Veuillez vous connecter.");
        return;
      }
      const targetId = libraryBook?._id || libraryBook?.id;
      if (!targetId) {
        Alert.alert('Erreur', 'Livre introuvable dans votre bibliothèque');
        return;
      }

      setActionLoading(true);
      await toggleFavorite(targetId, token);

      // Re-sync favorites (and any local flags)
      try {
        await fetchMyBooks?.(user.id, token);
      } catch (e) {
        console.log('[handleToggleFavorite] fetchMyBooks failed', e);
      }
    } catch (error) {
      const msg = error?.message || String(error);
      console.error('[handleToggleFavorite] failed', error);
      Alert.alert('Erreur', msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (reviewRating === 0) {
      Alert.alert('Erreur', 'Veuillez sélectionner une note');
      return;
    }
    try {
      setSubmittingReview(true);
      await booksService.addReview(
        libraryBook._id || libraryBook.id,
        reviewRating,
        reviewComment,
        token
      );
      Alert.alert('Succès', 'Avis ajouté !');
      setReviewRating(0);
      setReviewComment('');
      // Reload reviews
      try {
        const reviewsData = await booksService.getReviews(libraryBook._id || libraryBook.id);
        setReviews(reviewsData);
      } catch (e) {}
    } catch (error) {
      Alert.alert('Erreur', "Impossible d'ajouter l'avis");
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (rating, interactive = false, onSelect = null) => {
    const safeRating = Number(rating) || 0;
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            disabled={!interactive}
            onPress={() => onSelect && onSelect(star)}
          >

            <Ionicons
              name={star <= safeRating ? 'star' : 'star-outline'}
              size={interactive ? 28 : 16}
              color={star <= safeRating ? '#f59e0b' : COLORS.textTertiary}
              style={{ marginRight: 2 }}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner message="Chargement du livre..." />
      </View>
    );
  }

  if (!book) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Livre introuvable</Text>
        <Button label="Retour" onPress={() => router.back()} />
      </View>
    );
  }

  const totalPages = libraryBook?.pageCount || book.pageCount || 0;
  const pagesRead = libraryBook?.pagesRead || 0;
  const progressPercent = totalPages > 0 ? Math.min((pagesRead / totalPages) * 100, 100) : 0;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} keyboardShouldPersistTaps="always">
        {/* Back button */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
          <Text style={styles.backText}>Retour</Text>
        </TouchableOpacity>

        {/* Cover */}
        {book.imageUrl && (
          <Image
            source={{ uri: book.imageUrl }}
            style={styles.cover}
          />
        )}

        <View style={styles.content}>
          {/* Title & Author */}
          <Text style={styles.title}>{String(book.title ?? '')}</Text>
          <Text style={styles.author}>{String(book.author ?? '')}</Text>

          {/* Info chips */}
          <View style={styles.infoContainer}>
            {book.pageCount > 0 && (
              <View style={styles.infoChip}>
                <Ionicons name="book-outline" size={14} color={COLORS.primary} />
                <Text style={styles.infoText}>{String(book.pageCount)} pages</Text>
              </View>
            )}
            {book.publishedDate && (

              <View style={styles.infoChip}>
                <Ionicons name="calendar-outline" size={14} color={COLORS.primary} />
                <Text style={styles.infoText}>{String(book.publishedDate ?? '')}</Text>
              </View>
            )}
            {book.categories?.length > 0 && (
              <View style={styles.infoChip}>
                <Ionicons name="pricetag-outline" size={14} color={COLORS.primary} />
                <Text style={styles.infoText}>{String(book.categories?.[0] ?? '')}</Text>
              </View>
            )}

          </View>

          {/* Add/Remove + Favorite */}
          <View style={styles.actionRow}>
            {isInLibrary ? (
              <>
                <Button
                  label="Retirer de ma bibliothèque"
                  onPress={handleRemoveFromLibrary}
                  loading={actionLoading}
                  variant="danger"
                  style={{ flex: 1 }}
                />
                <TouchableOpacity
                  style={styles.favBtn}
                  onPress={handleToggleFavorite}
                >
                  <Ionicons
                    name={libraryBook?.isFavorite ? 'heart' : 'heart-outline'}
                    size={28}
                    color={libraryBook?.isFavorite ? COLORS.danger : COLORS.textSecondary}
                  />
                </TouchableOpacity>
              </>
            ) : (
              <Button
                label="Ajouter à ma bibliothèque"
                onPress={handleAddToLibrary}
                loading={actionLoading}
                style={{ flex: 1 }}
              />
            )}
          </View>

          {/* Progress Tracking */}
          {isInLibrary && totalPages > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📖 Progression</Text>
              <View style={styles.progressBarLarge}>
                <View
                  style={[
                    styles.progressFillLarge,
                    { width: `${progressPercent}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressLabel}>
                {pagesRead} / {totalPages} pages ({Math.round(progressPercent)}%)
              </Text>

              <View style={styles.progressInputRow}>
                <TextInput
                  style={styles.pagesInput}
                  value={pagesInput}
                  onChangeText={setPagesInput}
                  keyboardType="numeric"
                  placeholder="Pages lues"
                  placeholderTextColor={COLORS.textTertiary}
                />
                <Button
                  label="Mettre à jour"
                  onPress={handleUpdateProgress}
                  loading={actionLoading}
                  style={styles.updateBtn}
                />
              </View>
            </View>
          )}

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📝 Résumé</Text>
            <Text style={styles.description}>{String(book.description ?? '')}</Text>
          </View>


          {/* Reviews Section */}
          {isInLibrary && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>⭐ Laisser un avis</Text>
              <View style={styles.reviewForm}>
                {renderStars(reviewRating, true, setReviewRating)}
                <TextInput
                  style={styles.reviewInput}
                  value={reviewComment}
                  onChangeText={setReviewComment}
                  placeholder="Votre commentaire (optionnel)..."
                  placeholderTextColor={COLORS.textTertiary}
                  multiline
                  numberOfLines={3}
                />
                <Button
                  label="Soumettre"
                  onPress={handleSubmitReview}
                  loading={submittingReview}
                />
              </View>
            </View>
          )}

          {/* Existing Reviews */}
          {reviews.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>💬 Avis ({reviews.length})</Text>
              {reviews.map((review, index) => (
                <View key={review._id || index} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewAuthor}>
                      {String(review.userId?.name || 'Anonyme')}
                    </Text>

                    {renderStars(review.rating)}
                  </View>
                  {review.comment ? (
                    <Text style={styles.reviewComment}>{String(review.comment)}</Text>
                  ) : null}

                </View>
              ))}
            </View>
          )}

          {/* Spacer for bottom */}
          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    marginBottom: PADDING.lg,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: PADDING.lg,
    paddingVertical: PADDING.md,
    paddingTop: PADDING.xl,
  },
  backText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    marginLeft: PADDING.sm,
  },
  cover: {
    width: '55%',
    height: 300,
    borderRadius: BORDER_RADIUS.lg,
    alignSelf: 'center',
    marginBottom: PADDING.lg,
  },
  content: {
    paddingHorizontal: PADDING.lg,
    paddingBottom: PADDING.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: PADDING.sm,
  },
  author: {
    fontSize: 16,
    color: COLORS.primary,
    marginBottom: PADDING.lg,
  },
  infoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: PADDING.sm,
    marginBottom: PADDING.lg,
  },
  infoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.card,
    paddingHorizontal: PADDING.md,
    paddingVertical: PADDING.sm,
    borderRadius: 20,
  },
  infoText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: PADDING.md,
    marginBottom: PADDING.lg,
  },
  favBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: PADDING.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: PADDING.md,
  },
  description: {
    color: COLORS.textSecondary,
    lineHeight: 22,
    fontSize: 14,
  },
  // Progress
  progressBarLarge: {
    height: 10,
    backgroundColor: COLORS.card,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: PADDING.sm,
  },
  progressFillLarge: {
    height: '100%',
    backgroundColor: COLORS.success,
    borderRadius: 5,
  },
  progressLabel: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginBottom: PADDING.md,
  },
  progressInputRow: {
    flexDirection: 'row',
    gap: PADDING.md,
    alignItems: 'center',
  },
  pagesInput: {
    flex: 1,
    backgroundColor: COLORS.card,
    color: COLORS.textPrimary,
    paddingHorizontal: PADDING.md,
    paddingVertical: PADDING.md,
    borderRadius: BORDER_RADIUS.md,
    fontSize: 14,
  },
  updateBtn: {
    flex: 0,
    paddingHorizontal: PADDING.lg,
  },
  // Reviews
  starsContainer: {
    flexDirection: 'row',
    marginBottom: PADDING.md,
  },
  reviewForm: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: PADDING.lg,
  },
  reviewInput: {
    backgroundColor: COLORS.card,
    color: COLORS.textPrimary,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: PADDING.md,
    paddingVertical: PADDING.md,
    marginBottom: PADDING.md,
    fontSize: 14,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  reviewCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: PADDING.md,
    marginBottom: PADDING.sm,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: PADDING.sm,
  },
  reviewAuthor: {
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  reviewComment: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
});
