import React, { useEffect, useRef } from 'react';
import {
  View, Text, Image, TouchableOpacity,
  StyleSheet, Animated, Dimensions, ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, PADDING, BORDER_RADIUS, FONT_SIZE } from '../utils/constants';
import { formatProgress } from '../utils/formatters';

const { width } = Dimensions.get('window');

type BookStatus = 'reading' | 'completed' | 'to-read';

interface Book {
  _id?: string;
  id?: string;
  googleBooksId?: string;
  title: string;
  author?: string;
  imageUrl?: string;
  pageCount?: number;
  pagesRead?: number;
  categories?: string[];
  status?: BookStatus | string;
  isFavorite?: boolean;
  publishedDate?: string;
}

interface BookCardProps {
  book: Book;
  onPress?: () => void;
  onFavorite?: (id: string) => void;
  showProgress?: boolean;
  style?: ViewStyle;
}

const STATUS_CONFIG: Record<BookStatus, { label: string; color: string; icon: string }> = {
  reading:   { label: 'En cours',  color: COLORS.reading,   icon: 'book' },
  completed: { label: 'Terminé',   color: COLORS.completed, icon: 'checkmark-circle' },
  'to-read': { label: 'À lire',    color: COLORS.toRead,    icon: 'time-outline' },
};

export const BookCard = ({
  book,
  onPress,
  onFavorite,
  showProgress = false,
  style,
}: BookCardProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.97)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 420, useNativeDriver: false }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 80, friction: 10, useNativeDriver: false }),
    ]).start();
  }, []);

  const pageCount = Number(book.pageCount || 0);
  const pagesRead = Number(book.pagesRead || 0);
  const progressPercent = pageCount > 0
    ? Math.min((pagesRead / pageCount) * 100, 100)
    : 0;

  const statusConfig = book.status && book.status in STATUS_CONFIG
    ? STATUS_CONFIG[book.status as BookStatus]
    : null;

  return (
    <Animated.View
      style={[
        styles.card,
        style,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
      ]}
    >
      {/* Left: cover image with shimmer border */}
      <TouchableOpacity onPress={onPress} activeOpacity={0.88} style={styles.imageWrapper}>
        <Image
          source={{ uri: book.imageUrl || 'https://via.placeholder.com/100x150/1A1720/E8C97A?text=📖' }}
          style={styles.image}
          resizeMode="cover"
        />
        {statusConfig && (
          <View style={[styles.statusDot, { backgroundColor: statusConfig.color }]} />
        )}
      </TouchableOpacity>

      {/* Right: content */}
      <TouchableOpacity style={styles.content} onPress={onPress} activeOpacity={0.88}>
        <View style={styles.contentTop}>
          {statusConfig && (
            <View style={[styles.statusPill, { borderColor: statusConfig.color }]}>
              <Ionicons name={statusConfig.icon as any} size={10} color={statusConfig.color} />
              <Text style={[styles.statusText, { color: statusConfig.color }]}>
                {statusConfig.label}
              </Text>
            </View>
          )}

          <Text style={styles.title} numberOfLines={2}>{book.title}</Text>
          <Text style={styles.author} numberOfLines={1}>
            {book.author || 'Auteur inconnu'}
          </Text>

          {(book.categories || []).length > 0 && (
            <Text style={styles.categories} numberOfLines={1}>
              {(book.categories || []).slice(0, 2).join('  ·  ')}
            </Text>
          )}
        </View>

        {showProgress && pageCount > 0 && (
          <View style={styles.progressSection}>
            <View style={styles.progressTrack}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: `${progressPercent}%`,
                    backgroundColor: progressPercent >= 100
                      ? COLORS.completed
                      : COLORS.gold,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressLabel}>
              {formatProgress(book.pagesRead, book.pageCount)}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Favorite button */}
      {onFavorite && (
        <TouchableOpacity
          style={styles.favoriteBtn}
          onPress={() => onFavorite(book._id || book.id || '')}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={book.isFavorite ? 'heart' : 'heart-outline'}
            size={22}
            color={book.isFavorite ? COLORS.favorite : COLORS.textMuted}
          />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: PADDING.md,
    marginBottom: PADDING.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: PADDING.md,
  },
  image: {
    width: 72,
    height: 108,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.surfaceHigh,
  },
  statusDot: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    minHeight: 108,
  },
  contentTop: {
    flex: 1,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 6,
  },
  statusText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: FONT_SIZE.md,
    fontWeight: '800',
    color: COLORS.textPrimary,
    lineHeight: 21,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  author: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gold,
    fontWeight: '500',
    marginBottom: 5,
  },
  categories: {
    fontSize: 11,
    color: COLORS.textMuted,
    letterSpacing: 0.3,
  },
  progressSection: {
    marginTop: 10,
  },
  progressTrack: {
    height: 4,
    backgroundColor: COLORS.surfaceBorder,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  favoriteBtn: {
    marginLeft: PADDING.sm,
    paddingTop: 2,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
