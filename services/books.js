import { GOOGLE_BOOKS_API_KEY, GOOGLE_BOOKS_API_URL, API_BASE_URL } from '../utils/constants';

const fallbackBooks = [
  {
    id: 'fallback-1',
    title: 'Le Petit Prince',
    author: 'Antoine de Saint-Exupéry',
    description: 'Un aviateur s’écrase dans le désert et rencontre un petit prince venu d’une autre planète.',
    pageCount: 96,
    imageUrl: 'https://covers.openlibrary.org/b/id/8281996-L.jpg',
    publishedDate: '1943',
    categories: ['Classique', 'Aventure'],
  },
  {
    id: 'fallback-2',
    title: '1984',
    author: 'George Orwell',
    description: 'Une dystopie sur une société totalitaire surveillée par Big Brother.',
    pageCount: 328,
    imageUrl: 'https://covers.openlibrary.org/b/id/8221251-L.jpg',
    publishedDate: '1949',
    categories: ['Dystopie', 'Science-fiction'],
  },
  {
    id: 'fallback-3',
    title: 'Le Meilleur des mondes',
    author: 'Aldous Huxley',
    description: 'Une société du futur où le bonheur est imposé par la technologie et le conditionnement.',
    pageCount: 268,
    imageUrl: 'https://covers.openlibrary.org/b/id/8313061-L.jpg',
    publishedDate: '1932',
    categories: ['Dystopie', 'Science-fiction'],
  },
  {
    id: 'fallback-4',
    title: 'Les Misérables',
    author: 'Victor Hugo',
    description: 'L’histoire de Jean Valjean, poursuivi par l’inspecteur Javert, dans une France du XIXᵉ siècle.',
    pageCount: 1463,
    imageUrl: 'https://covers.openlibrary.org/b/id/8285630-L.jpg',
    publishedDate: '1862',
    categories: ['Classique', 'Historique'],
  },
  {
    id: 'fallback-5',
    title: 'La Passe-miroir',
    author: 'Christelle Dabos',
    description: 'Une jeune liseuse traverse des archipels flottants et des complots de cour.',
    pageCount: 672,
    imageUrl: 'https://covers.openlibrary.org/b/id/11063968-L.jpg',
    publishedDate: '2013',
    categories: ['Fantastique', 'Aventure'],
  },
  {
    id: 'fallback-6',
    title: 'Le Nom du vent',
    author: 'Patrick Rothfuss',
    description: 'Histoire d’un magicien devenu légende racontée par ses propres mots.',
    pageCount: 662,
    imageUrl: 'https://covers.openlibrary.org/b/id/8319255-L.jpg',
    publishedDate: '2007',
    categories: ['Fantastique', 'Aventure'],
  },
  {
    id: 'fallback-7',
    title: 'La couleur des sentiments',
    author: 'Kathryn Stockett',
    description: 'Trois femmes découvrent une amitié improbable dans l’Amérique ségrégationniste.',
    pageCount: 532,
    imageUrl: 'https://covers.openlibrary.org/b/id/8139216-L.jpg',
    publishedDate: '2009',
    categories: ['Historique', 'Drame'],
  },
  {
    id: 'fallback-8',
    title: 'L’Étranger',
    author: 'Albert Camus',
    description: 'Un homme oublie les conventions sociales et affronte le sens de la vie.',
    pageCount: 123,
    imageUrl: 'https://covers.openlibrary.org/b/id/8231855-L.jpg',
    publishedDate: '1942',
    categories: ['Classique', 'Philosophie'],
  },
];

const fallbackBookMap = new Map(fallbackBooks.map((book) => [book.id, book]));

// Recherche via Google Books API (gratuit)
const filterFallbackBooks = (query, genre) => {
  const normalizedQuery = query?.trim().toLowerCase() || '';
  const normalizedGenre = genre?.trim().toLowerCase() || '';

  if (!normalizedQuery || normalizedQuery === 'bestseller') {
    return fallbackBooks;
  }

  return fallbackBooks.filter((book) => {
    const searchableText = [
      book.title,
      book.author,
      book.description,
      book.publishedDate,
      ...(book.categories || []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    const matchesQuery = !normalizedQuery || searchableText.includes(normalizedQuery);
    const matchesGenre =
      !normalizedGenre ||
      book.categories.some((category) =>
        category.toLowerCase().includes(normalizedGenre) ||
        normalizedGenre.includes(category.toLowerCase())
      );

    return matchesQuery && matchesGenre;
  });
};

export const searchBooks = async (query, genre = '') => {
  try {
    const keyParam = GOOGLE_BOOKS_API_KEY ? `&key=${GOOGLE_BOOKS_API_KEY}` : '';
    const genreMap = {
      'Science-fiction': 'Science Fiction',
      'Dystopie': 'Dystopian',
      'Classique': 'Classics',
      'Fantastique': 'Fantasy',
      'Historique': 'History',
      'Romance': 'Romance',
      'Science': 'Science',
      'Fiction': 'Fiction',
    };

    const subject = genre ? (genreMap[genre] || genre.replace(/[-_]/g, ' ')) : '';
    const queryText = query?.trim() || '';
    const qElements = [];
    if (subject) qElements.push(`subject:${subject}`);
    if (queryText) qElements.push(queryText);
    const q = qElements.join(' ');

    if (!q) {
      return fallbackBooks;
    }

    const response = await fetch(
      `${API_BASE_URL}/books/search?q=${encodeURIComponent(q)}`
    );

    if (!response.ok) {
      console.error('[books.searchBooks] response not ok', { status: response.status, statusText: response.statusText });
      return filterFallbackBooks(queryText, genre || subject);
    }

    const data = await response.json();
    const results = data.items?.map((item) => ({
      id: item.id,
      title: item.volumeInfo.title,
      author: item.volumeInfo.authors?.[0] || 'Auteur inconnu',
      description: item.volumeInfo.description,
      pageCount: item.volumeInfo.pageCount || 0,
      imageUrl: item.volumeInfo.imageLinks?.thumbnail?.replace('http://', 'https://') || 'https://via.placeholder.com/150x220.png?text=Pas+d%27image',
      publishedDate: item.volumeInfo.publishedDate,
      categories: item.volumeInfo.categories || [],
    })) || [];

    return results.length > 0 ? results : filterFallbackBooks(queryText, genre || subject);
  } catch (error) {
    console.error('[books.searchBooks] failed', { query, genre, error });
    return filterFallbackBooks(query, genre);
  }
};

// Détails d'un livre via Google Books API
export const getBookDetails = async (bookId) => {
  if (fallbackBookMap.has(bookId)) {
    return fallbackBookMap.get(bookId);
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/books/details/${bookId}`
    );
    
    if (!response.ok) {
      throw new Error('Book not found');
    }
    
    const item = await response.json();
    
    return {
      id: item.id,
      title: item.volumeInfo.title,
      author: item.volumeInfo.authors?.[0] || 'Unknown',
      authors: item.volumeInfo.authors || [],
      description: item.volumeInfo.description || 'Aucune description disponible.',
      pageCount: item.volumeInfo.pageCount || 0,
      imageUrl: item.volumeInfo.imageLinks?.thumbnail?.replace('http://', 'https://') || 'https://via.placeholder.com/150x220.png?text=Pas+d%27image',
      publishedDate: item.volumeInfo.publishedDate,
      categories: item.volumeInfo.categories || [],
      publisher: item.volumeInfo.publisher || '',
      language: item.volumeInfo.language || '',
      averageRating: item.volumeInfo.averageRating || null,
    };
  } catch (error) {
    console.error('[books.getBookDetails] failed', { bookId, error });
    if (fallbackBookMap.has(bookId)) {
      return fallbackBookMap.get(bookId);
    }
    throw new Error('Failed to fetch book details');
  }
};

// Ma bibliothèque
export const addBook = async (book, userId, token) => {
  try {
    const url = `${API_BASE_URL}/books/add`;
    const payload = {
      book: {
        ...book,
        id: book.id || book.googleBooksId,
        author: book.author || (Array.isArray(book.authors) ? book.authors[0] : book.author) || 'Auteur inconnu',
      },
      userId,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      const message = errorBody?.error || 'Failed to add book';
      throw new Error(message);
    }

    return response.json();
  } catch (error) {
    console.error('[books.addBook] failed', { error });
    throw error;
  }
};

export const removeBook = async (bookId, userId, token) => {
  try {
    const url = `${API_BASE_URL}/books/${bookId}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to remove book');
    }
  } catch (error) {
    console.error('[books.removeBook] failed', { bookId, error });
    throw error;
  }
};

export const getMyBooks = async (userId, token) => {
  try {
    const url = `${API_BASE_URL}/books/my-books/${userId}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }

    return response.json();
  } catch (error) {
    console.error('[books.getMyBooks] failed', { userId, error });
    throw error;
  }
};

export const updateProgress = async (bookId, pagesRead, token) => {
  const response = await fetch(`${API_BASE_URL}/books/${bookId}/progress`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ pagesRead }),
  });

  if (!response.ok) {
    throw new Error('Failed to update progress');
  }

  return response.json();
};

// Favoris
export const toggleFavorite = async (bookId, token) => {
  const response = await fetch(`${API_BASE_URL}/books/${bookId}/favorite`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to toggle favorite');
  }

  return response.json();
};

export const getFavorites = async (userId, token) => {
  const response = await fetch(`${API_BASE_URL}/books/favorites/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch favorites');
  }

  return response.json();
};

// Avis
export const addReview = async (bookId, rating, comment, token) => {
  const response = await fetch(`${API_BASE_URL}/books/${bookId}/review`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ rating, comment }),
  });

  if (!response.ok) {
    throw new Error('Failed to add review');
  }

  return response.json();
};

export const getReviews = async (bookId) => {
  const response = await fetch(`${API_BASE_URL}/books/${bookId}/reviews`);

  if (!response.ok) {
    throw new Error('Failed to fetch reviews');
  }

  return response.json();
};

// Statistiques utilisateur
export const getUserStats = async (token) => {
  const response = await fetch(`${API_BASE_URL}/books/stats/user`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch stats');
  }

  return response.json();
};
