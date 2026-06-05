import React, { createContext, useState } from 'react';
import * as booksService from '../services/books';

export const BooksContext = createContext();

const normalizeBook = (book) => {
  if (!book) return book;
  return {
    ...book,
    id: book.id || book._id,
    googleBooksId: book.googleBooksId || book.id,
  };
};

export const BooksProvider = ({ children }) => {
  const [myBooks, setMyBooks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalBooks: 0,
    booksRead: 0,
    booksReading: 0,
    booksToRead: 0,
    totalPagesRead: 0,
    totalPages: 0,
  });

  const booksContext = {
    // Ma bibliothèque
    myBooks,
    addBook: async (book, userId, token) => {
      try {
        setError(null);
        const newBook = normalizeBook(await booksService.addBook(book, userId, token));
        setMyBooks(prevBooks => [...prevBooks, newBook]);
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    removeBook: async (bookId, userId, token) => {
      try {
        setError(null);
        await booksService.removeBook(bookId, userId, token);
        setMyBooks(prevBooks => prevBooks.filter(b => (b._id || b.id) !== bookId));
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    updateProgress: async (bookId, pagesRead, token) => {
      try {
        setError(null);
        const updated = normalizeBook(await booksService.updateProgress(bookId, pagesRead, token));
        setMyBooks(prevBooks => prevBooks.map(b => (b._id || b.id) === bookId ? updated : b));
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    fetchMyBooks: async (userId, token) => {
      try {
        setLoadingBooks(true);
        const books = await booksService.getMyBooks(userId, token);
        setMyBooks(books.map(normalizeBook));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingBooks(false);
      }
    },

    // Recherche (accepts optional genre)
    searchBooks: async (query, genre = '') => {
      try {
        setError(null);
        setLoadingBooks(true);
        const results = await booksService.searchBooks(query, genre);
        setSearchResults(results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingBooks(false);
      }
    },
    searchResults,

    // Favoris
    favorites,
    toggleFavorite: async (bookId, token) => {
      try {
        setError(null);
        const updated = normalizeBook(await booksService.toggleFavorite(bookId, token));
        // Update myBooks list with new favorite status
        setMyBooks(prevBooks => prevBooks.map(b => (b._id || b.id) === bookId ? updated : b));
        if (updated.isFavorite) {
          setFavorites(prevFavorites => [...prevFavorites, updated]);
        } else {
          setFavorites(prevFavorites => prevFavorites.filter(b => (b._id || b.id) !== bookId));
        }
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    fetchFavorites: async (userId, token) => {
      try {
        setLoadingBooks(true);
        const favs = await booksService.getFavorites(userId, token);
        setFavorites(favs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingBooks(false);
      }
    },

    // Statistiques
    stats,
    fetchUserStats: async (token) => {
      try {
        const userStats = await booksService.getUserStats(token);
        setStats(userStats);
      } catch (err) {
        // If stats endpoint not available, compute locally
        const localStats = {
          totalBooks: myBooks.length,
          booksRead: myBooks.filter(b => b.status === 'completed').length,
          booksReading: myBooks.filter(b => b.status === 'reading').length,
          booksToRead: myBooks.filter(b => b.status === 'to-read').length,
          totalPagesRead: myBooks.reduce((sum, b) => sum + (b.pagesRead || 0), 0),
          totalPages: myBooks.reduce((sum, b) => sum + (b.pageCount || 0), 0),
        };
        setStats(localStats);
      }
    },

    loadingBooks,
    error,
  };

  return (
    <BooksContext.Provider value={booksContext}>
      {children}
    </BooksContext.Provider>
  );
};
