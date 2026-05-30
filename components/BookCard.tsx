import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, PADDING, BORDER_RADIUS } from '../utils/constants';
import { formatProgress } from '../utils/formatters';

export const BookCard = ({ 
  book, 
  onPress, 
  onFavorite,
  showProgress = false,
  style 
}) => {
  return (
    <TouchableOpacity 
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image 
        source={{ uri: book.imageUrl || 'https://via.placeholder.com/100x150' }}
        style={styles.image}
      />
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{book.title}</Text>
        <Text style={styles.author} numberOfLines={1}>{book.author}</Text>
        
        {showProgress && book.pageCount > 0 && (
          <>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill,
                    { width: `${Math.min((book.pagesRead / book.pageCount) * 100, 100)}%` }
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {formatProgress(book.pagesRead, book.pageCount)}
              </Text>
            </View>
          </>
        )}
      </View>

      {onFavorite && (
        <TouchableOpacity 
          style={styles.favoriteBtn}
          onPress={() => onFavorite(book.id)}
        >
          <Ionicons 
            name={book.isFavorite ? 'heart' : 'heart-outline'} 
            size={24} 
            color={book.isFavorite ? COLORS.danger : COLORS.textSecondary}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.darkMedium,
    borderRadius: BORDER_RADIUS.lg,
    padding: PADDING.md,
    marginBottom: PADDING.md,
    flexDirection: 'row',
  },
  image: {
    width: 80,
    height: 120,
    borderRadius: BORDER_RADIUS.md,
    marginRight: PADDING.md,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  author: {
    color: COLORS.textTertiary,
    fontSize: 12,
  },
  progressContainer: {
    marginTop: PADDING.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.darkLight,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  progressText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: 'bold',
  },
  favoriteBtn: {
    justifyContent: 'flex-start',
    marginLeft: PADDING.sm,
  },
});
