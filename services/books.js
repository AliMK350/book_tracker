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
];

const fallbackBookMap = new Map(fallbackBooks.map((book) => [book.id, book]));

// Recherche via Google Books API (gratuit)
export const searchBooks = async (query) => {
  try {
    const keyParam = GOOGLE_BOOKS_API_KEY ? `&key=${GOOGLE_BOOKS_API_KEY}` : '';
    const response = await fetch(
      `${GOOGLE_BOOKS_API_URL}?q=${encodeURIComponent(query)}${keyParam}&maxResults=20`
    );
    const data = await response.json();
    
    const results = data.items?.map(item => ({
      id: item.id,
      title: item.volumeInfo.title,
      author: item.volumeInfo.authors?.[0] || 'Unknown',
      description: item.volumeInfo.description,
      pageCount: item.volumeInfo.pageCount || 0,
      imageUrl: item.volumeInfo.imageLinks?.thumbnail?.replace('http://', 'https://'),
      publishedDate: item.volumeInfo.publishedDate,
      categories: item.volumeInfo.categories || [],
    })) || [];

    return results.length ? results : fallbackBooks;
  } catch (error) {
    return fallbackBooks;
  }
};

// Détails d'un livre via Google Books API
export const getBookDetails = async (bookId) => {
  if (fallbackBookMap.has(bookId)) {
    return fallbackBookMap.get(bookId);
  }

  try {
    const keyParam = GOOGLE_BOOKS_API_KEY ? `?key=${GOOGLE_BOOKS_API_KEY}` : '';
    const response = await fetch(
      `${GOOGLE_BOOKS_API_URL}/${bookId}${keyParam}`
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
      imageUrl: item.volumeInfo.imageLinks?.thumbnail?.replace('http://', 'https://'),
      publishedDate: item.volumeInfo.publishedDate,
      categories: item.volumeInfo.categories || [],
      publisher: item.volumeInfo.publisher || '',
      language: item.volumeInfo.language || '',
      averageRating: item.volumeInfo.averageRating || null,
    };
  } catch (error) {
    if (fallbackBookMap.has(bookId)) {
      return fallbackBookMap.get(bookId);
    }
    throw new Error('Failed to fetch book details');
  }
};

// Ma bibliothèque
export const addBook = async (book, userId, token) => {
  const response = await fetch(`${API_BASE_URL}/books/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ book, userId }),
  });

  if (!response.ok) {
    throw new Error('Failed to add book');
  }

  return response.json();
};

export const removeBook = async (bookId, userId, token) => {
  const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to remove book');
  }
};

export const getMyBooks = async (userId, token) => {
  const response = await fetch(`${API_BASE_URL}/books/my-books/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch books');
  }

  return response.json();
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
