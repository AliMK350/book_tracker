# Configuration de l'API Book Tracker

## Variables d'Environnement

Créez un fichier `.env` à la racine du projet avec:

```
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_GOOGLE_BOOKS_API_KEY=YOUR_GOOGLE_BOOKS_API_KEY
```

## Backend Required Endpoints

### Authentication
- `POST /api/auth/login` - Connexion
- `POST /api/auth/signup` - Inscription
- `POST /api/auth/logout` - Déconnexion

### Books
- `POST /api/books/add` - Ajouter un livre à la bibliothèque
- `GET /api/books/my-books/:userId` - Récupérer les livres de l'utilisateur
- `DELETE /api/books/:bookId` - Supprimer un livre
- `PUT /api/books/:bookId/progress` - Mettre à jour la progression
- `PUT /api/books/:bookId/favorite` - Basculer un favori
- `GET /api/books/favorites/:userId` - Récupérer les favoris
- `POST /api/books/:bookId/review` - Ajouter un avis
- `GET /api/books/:bookId/reviews` - Récupérer les avis

## Google Books API

1. Créer un compte Google Cloud
2. Activer Google Books API
3. Créer une clé API
4. Ajouter à `.env`

## Installation

```bash
npm install
```

## Exécution

```bash
npm start
```

## Structure des Données

### User
```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "password": "string (hashed)"
}
```

### Book
```json
{
  "id": "string",
  "userId": "string",
  "title": "string",
  "author": "string",
  "description": "string",
  "pageCount": "number",
  "pagesRead": "number",
  "status": "to-read|reading|completed",
  "isFavorite": "boolean",
  "dateAdded": "date",
  "dateStarted": "date",
  "dateCompleted": "date"
}
```

### Review
```json
{
  "id": "string",
  "bookId": "string",
  "userId": "string",
  "rating": "number (1-5)",
  "comment": "string",
  "dateCreated": "date"
}
```
